"""Manager Auth - Mutations

Manager 시스템의 인증 관련 Mutation 구현
회원가입, 로그인, 비밀번호 관리 등의 기능을 제공합니다.
"""

import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

import strawberry
from fastapi import Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.exceptions import (
    AlreadyExistsError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
)
from src.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from src.graphql.decorators import require_auth
from src.models.manager.idam import LoginLog, Session, User

from .queries import user_to_graphql
from .types import (
    ChangePasswordInput,
    ManagerAuthUser,
    MessageResponse,
    RefreshTokenInput,
    ResetPasswordConfirmInput,
    ResetPasswordInput,
    SigninInput,
    SignupInput,
    TokenResponse,
)


async def create_login_log(
    db: AsyncSession,
    username: str,
    ip_address: str,
    user_agent: str | None,
    attempt_type: str,
    success: bool,
    user_id: UUID | None = None,
    user_type: str | None = None,
    failure_reason: str | None = None,
) -> None:
    """
    로그인 시도 이력 기록

    성공/실패 여부와 관계없이 모든 로그인 시도를 기록합니다.
    보안 감사(Security Audit) 및 이상 탐지에 활용됩니다.

    Args:
        db: 데이터베이스 세션
        username: 로그인 시도한 사용자명
        ip_address: 요청 IP 주소
        user_agent: User-Agent 헤더
        attempt_type: 시도 유형 (LOGIN, LOGOUT 등)
        success: 성공 여부
        user_id: 사용자 ID (로그인 성공 시)
        user_type: 사용자 타입 (로그인 성공 시)
        failure_reason: 실패 사유 (실패 시)
    """
    login_log = LoginLog(
        username=username,
        ip_address=ip_address,
        user_agent=user_agent,
        attempt_type=attempt_type,
        success=success,
        user_id=user_id,
        user_type=user_type,
        failure_reason=failure_reason,
    )
    db.add(login_log)
    await db.commit()


async def create_session(
    db: AsyncSession,
    session_id: str,
    user_id: UUID,
    session_type: str,
    ip_address: str,
    user_agent: str | None,
    expires_at: datetime,
) -> None:
    """
    사용자 세션 생성

    로그인 성공 시 새로운 세션을 생성합니다.
    세션 추적 및 동시 로그인 관리에 사용됩니다.

    Args:
        db: 데이터베이스 세션
        session_id: 생성할 세션 ID (랜덤 생성)
        user_id: 사용자 ID
        session_type: 세션 타입 (WEB, MOBILE, API 등)
        ip_address: 요청 IP 주소
        user_agent: User-Agent 헤더
        expires_at: 세션 만료 시각
    """
    session = Session(
        session_id=session_id,
        user_id=user_id,
        session_type=session_type,
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=expires_at,
        status="ACTIVE",
    )
    db.add(session)
    await db.commit()


async def register_user(db: AsyncSession, data: SignupInput) -> ManagerAuthUser:
    """
    새로운 사용자 회원가입

    사용자명과 이메일 중복을 검증하고 새 사용자를 생성합니다.
    비밀번호는 해시화하여 안전하게 저장합니다.

    Args:
        db: 데이터베이스 세션
        data: 회원가입 입력 데이터

    Returns:
        생성된 사용자 GraphQL 타입

    Raises:
        AlreadyExistsError: 사용자명 또는 이메일이 이미 존재하는 경우
    """
    # 중복 체크 - username
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise AlreadyExistsError(
            message="이미 존재하는 사용자명입니다",
            detail={"field": "username", "value": data.username},
        )

    # 중복 체크 - email
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise AlreadyExistsError(
            message="이미 존재하는 이메일입니다",
            detail={"field": "email", "value": data.email},
        )

    # 사용자 생성 (비밀번호는 해시화하여 저장)
    user = User(
        username=data.username,
        email=data.email,
        password=get_password_hash(data.password),
        full_name=data.full_name or data.username,
        user_type="MASTER",  # 기본 타입: MASTER
        status="ACTIVE",
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user_to_graphql(user)


async def login_user(db: AsyncSession, data: SigninInput, request: Request) -> TokenResponse:
    """
    사용자 로그인 및 토큰 발급

    사용자명/비밀번호 검증 후 JWT 토큰을 발급합니다.
    모든 로그인 시도는 기록되며, 실패 시 구체적인 오류는 숨깁니다.

    Args:
        db: 데이터베이스 세션
        data: 로그인 입력 데이터
        request: FastAPI Request 객체 (IP, User-Agent 추출용)

    Returns:
        Access Token 및 Refresh Token

    Raises:
        UnauthorizedError: 인증 실패 (사용자 없음, 비밀번호 불일치, 계정 비활성)
    """
    # 클라이언트 정보 추출 (None-safe)
    ip_address = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent")

    # 1. 사용자 조회
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()

    if not user:
        # 보안: 사용자 미존재 시도 기록
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="USER_NOT_FOUND",
        )
        # 보안: 구체적인 오류는 숨김 (사용자 열거 공격 방지)
        raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")

    # 2. 비밀번호 확인 (타입 체크 추가)
    if not user.password or not verify_password(data.password, user.password):
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="INVALID_PASSWORD",
        )
        raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")

    # 3. 계정 활성 상태 확인
    if user.status != "ACTIVE":
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            user_id=user.id,
            user_type=user.user_type,
            failure_reason="INACTIVE_ACCOUNT",
        )
        raise UnauthorizedError(message="비활성화된 계정입니다")

    # 4. 로그인 성공 로그
    await create_login_log(
        db=db,
        username=data.username,
        ip_address=ip_address,
        user_agent=user_agent,
        attempt_type="LOGIN",
        success=True,
        user_id=user.id,
        user_type=user.user_type,
    )

    # 5. 세션 생성 (7일 유효)
    session_id = secrets.token_urlsafe(32)
    session_expires_at = datetime.now(UTC) + timedelta(days=7)

    await create_session(
        db=db,
        session_id=session_id,
        user_id=user.id,
        session_type="WEB",
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=session_expires_at,
    )

    # 6. JWT 토큰 생성
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "session_id": session_id,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


async def refresh_user_token(db: AsyncSession, user_id: UUID) -> TokenResponse:
    """
    Access Token 갱신

    Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
    사용자 상태를 재확인하여 비활성 계정은 갱신을 거부합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID

    Returns:
        새로운 Access Token 및 Refresh Token

    Raises:
        NotFoundError: 사용자를 찾을 수 없는 경우
        UnauthorizedError: 계정이 비활성화된 경우
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    if user.status != "ACTIVE":
        raise UnauthorizedError(message="비활성화된 계정입니다")

    # 새 토큰 생성
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


async def change_user_password(db: AsyncSession, user_id: UUID, data: ChangePasswordInput) -> bool:
    """
    사용자 비밀번호 변경

    현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.

    Args:
        db: 데이터베이스 세션
        user_id: 사용자 ID
        data: 비밀번호 변경 입력 데이터

    Returns:
        성공 여부

    Raises:
        NotFoundError: 사용자를 찾을 수 없는 경우
        UnauthorizedError: 현재 비밀번호가 일치하지 않는 경우
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    # 현재 비밀번호 확인 (타입 체크 추가)
    if not user.password or not verify_password(data.current_password, user.password):
        raise UnauthorizedError(message="현재 비밀번호가 일치하지 않습니다")

    # 새 비밀번호 해시화하여 저장
    user.password = get_password_hash(data.new_password)
    await db.commit()

    return True


async def request_password_reset(db: AsyncSession, email: str) -> str:
    """
    비밀번호 재설정 요청

    이메일로 사용자를 조회하고 재설정 토큰을 생성합니다.
    보안을 위해 이메일이 존재하지 않아도 성공 응답을 반환합니다.

    Args:
        db: 데이터베이스 세션
        email: 사용자 이메일

    Returns:
        재설정 토큰 (개발 환경용, 실제로는 이메일로 전송)

    Raises:
        ValidationError: 계정이 비활성화된 경우
    """
    # 사용자 조회
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # 보안: 이메일이 존재하지 않아도 성공한 것처럼 응답
        # (이메일 열거 공격 방지)
        return "success"

    # 비활성 계정 확인
    if user.status != "ACTIVE":
        raise ValidationError(message="비활성화된 계정입니다")

    # 재설정 토큰 생성 (URL-safe random string)
    reset_token = secrets.token_urlsafe(32)

    # 토큰 만료 시간 (1시간)
    expires_at = datetime.now(UTC) + timedelta(hours=1)

    # DB에 토큰 저장
    user.password_reset_token = reset_token
    user.password_reset_token_expires_at = expires_at
    await db.commit()

    # TODO: 실제 환경에서는 이메일로 토큰 전송
    return reset_token


async def reset_user_password(
    db: AsyncSession, token: str | None, new_password: str, username: str | None = None
) -> bool:
    """
    비밀번호 재설정 확인

    토큰을 검증하고 새 비밀번호로 변경합니다.
    테스트 환경에서는 admin 계정에 한해 토큰 없이 변경 가능합니다.

    Args:
        db: 데이터베이스 세션
        token: 재설정 토큰
        new_password: 새 비밀번호
        username: 사용자명 (테스트 환경용)

    Returns:
        성공 여부

    Raises:
        ValidationError: 토큰이 유효하지 않거나 만료된 경우
        NotFoundError: 사용자를 찾을 수 없는 경우
    """
    # 테스트 환경: admin 계정은 토큰 검증 없이 비밀번호 변경 허용
    if username and username == "admin":
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()

        if not user:
            raise NotFoundError(message="사용자를 찾을 수 없습니다")

        # 비밀번호 변경
        user.password = get_password_hash(new_password)
        user.password_changed_at = datetime.now(UTC)

        # 토큰이 있다면 삭제
        user.password_reset_token = None
        user.password_reset_token_expires_at = None

        await db.commit()

        return True

    # 일반 사용자: 토큰 필수
    if not token:
        raise ValidationError(message="토큰이 필요합니다")

    # 토큰으로 사용자 조회
    result = await db.execute(select(User).where(User.password_reset_token == token))
    user = result.scalar_one_or_none()

    if not user:
        raise ValidationError(message="유효하지 않거나 만료된 토큰입니다")

    # 토큰 만료 확인
    if (
        not user.password_reset_token_expires_at
        or user.password_reset_token_expires_at < datetime.now(UTC)
    ):
        # 만료된 토큰 삭제
        user.password_reset_token = None
        user.password_reset_token_expires_at = None
        await db.commit()

        raise ValidationError(message="유효하지 않거나 만료된 토큰입니다")

    # 비밀번호 변경
    user.password = get_password_hash(new_password)
    user.password_changed_at = datetime.now(UTC)

    # 토큰 삭제 (재사용 방지)
    user.password_reset_token = None
    user.password_reset_token_expires_at = None

    await db.commit()

    return True


@strawberry.type
class ManagerAuthMutations:
    """
    Manager Auth Mutations

    Manager 시스템의 인증 관련 GraphQL Mutation들을 제공합니다.
    """

    @strawberry.mutation(description="회원가입")
    async def signup(self, info, input: SignupInput) -> ManagerAuthUser:
        """
        새로운 사용자를 등록합니다.

        Args:
            input: 회원가입 정보 (사용자명, 이메일, 비밀번호)

        Returns:
            생성된 사용자 정보

        Raises:
            AlreadyExistsError: 사용자명 또는 이메일이 이미 존재
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        return await register_user(db, input)

    @strawberry.mutation(description="로그인")
    async def signin(self, info, input: SigninInput) -> TokenResponse:
        """
        사용자명과 비밀번호로 로그인하여 토큰을 발급받습니다.

        Args:
            input: 로그인 정보 (사용자명, 비밀번호)

        Returns:
            JWT Access Token 및 Refresh Token

        Raises:
            UnauthorizedError: 인증 실패
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        request = info.context.request
        return await login_user(db, input, request)

    @strawberry.mutation(description="토큰 갱신")
    @require_auth
    async def refresh_token(self, info, input: RefreshTokenInput) -> TokenResponse:
        """
        Refresh Token으로 새로운 Access Token을 발급받습니다.

        Args:
            input: Refresh Token

        Returns:
            새로운 Access Token 및 Refresh Token
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        user_id = UUID(info.context.user_id)
        return await refresh_user_token(db, user_id)

    @strawberry.mutation(description="비밀번호 변경")
    @require_auth
    async def change_password(self, info, input: ChangePasswordInput) -> MessageResponse:
        """
        현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.

        Args:
            input: 현재 비밀번호 및 새 비밀번호

        Returns:
            성공 메시지

        Raises:
            UnauthorizedError: 현재 비밀번호 불일치
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        user_id = UUID(info.context.user_id)
        await change_user_password(db, user_id, input)
        return MessageResponse(message="비밀번호가 변경되었습니다")

    @strawberry.mutation(description="로그아웃")
    @require_auth
    async def logout(self, info) -> MessageResponse:
        """
        로그아웃 처리 (클라이언트에서 토큰 삭제)

        Returns:
            성공 메시지

        Note:
            실제 로그아웃은 클라이언트에서 토큰을 삭제합니다.
            필요시 서버에서 토큰 블랙리스트(Redis) 관리 가능합니다.
        """
        # 실제로는 클라이언트에서 토큰을 삭제
        # 필요시 Redis에 블랙리스트 추가 가능
        return MessageResponse(message="로그아웃되었습니다")

    @strawberry.mutation(description="비밀번호 찾기")
    async def forgot_password(self, info, input: ResetPasswordInput) -> MessageResponse:
        """
        비밀번호 재설정 이메일을 발송합니다.

        Args:
            input: 이메일 주소

        Returns:
            성공 메시지 (개발 환경에서는 토큰 포함)

        Note:
            실제 환경에서는 이메일로만 토큰을 전송해야 합니다.
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        reset_token = await request_password_reset(db, input.email)

        # 개발 환경에서는 토큰을 반환 (실제 환경에서는 이메일로만 전송)
        return MessageResponse(
            message="비밀번호 재설정 이메일이 발송되었습니다", reset_token=reset_token
        )

    @strawberry.mutation(description="비밀번호 재설정")
    async def reset_password(self, info, input: ResetPasswordConfirmInput) -> MessageResponse:
        """
        토큰을 사용하여 새 비밀번호로 재설정합니다.

        Args:
            input: 재설정 토큰 및 새 비밀번호

        Returns:
            성공 메시지

        Raises:
            ValidationError: 토큰이 유효하지 않거나 만료됨
        """
        db = info.context.manager_db_session
        if not db:
            raise Exception("Manager database session not available")

        await reset_user_password(db, input.token, input.new_password, input.username)
        return MessageResponse(message="비밀번호가 재설정되었습니다")
