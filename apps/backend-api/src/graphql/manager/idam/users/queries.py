"""Manager IDAM Users - Queries

사용자 조회 Query 구현
공통 모듈을 사용한 표준화된 조회 로직
"""

from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.user import User as UserModel

from .types import ManagerUser


def manager_user_to_graphql(user: UserModel) -> "ManagerUser":
    """
    UserModel(DB 모델)을 User(GraphQL 타입)으로 변환

    Args:
        user: 데이터베이스 사용자 모델

    Returns:
        ManagerUser: GraphQL 사용자 타입
    """
    return ManagerUser(
        id=strawberry.ID(str(user.id)),
        user_type=user.user_type,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        username=user.username,
        sso_provider=user.sso_provider,
        sso_subject=user.sso_subject,
        mfa_enabled=user.mfa_enabled,
        status=user.status,
        last_login_at=user.last_login_at,
        last_login_ip=str(user.last_login_ip) if user.last_login_ip else None,
        failed_login_attempts=user.failed_login_attempts,
        locked_until=user.locked_until,
        force_password_change=user.force_password_change,
        timezone=user.timezone or "UTC",
        locale=user.locale or "ko-KR",
        department=user.department,
        position=user.position,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


async def get_manager_user_by_id(db: AsyncSession, user_id: UUID) -> "ManagerUser | None":
    """
    ID로 Manager 사용자 단건 조회

    Args:
        db: 데이터베이스 세션
        user_id: 조회할 사용자 ID

    Returns:
        User: 사용자 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=UserModel,
        id_=user_id,
        to_graphql=manager_user_to_graphql,
    )


async def get_manager_users(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0,
    user_type: str | None = None,
    status: str | None = None,
    search: str | None = None,
    mfa_enabled: bool | None = None,
    force_password_change: bool | None = None,
    created_after: str | None = None,
    created_before: str | None = None,
) -> "list[ManagerUser]":
    """
    Manager 사용자 목록 조회

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 (기본값: 20)
        offset: 건너뛸 개수 (페이징용)
        user_type: 사용자 타입 필터 (선택)
        status: 상태 필터 (선택)
        search: 사용자 검색어 (full_name, email, username 검색)
        mfa_enabled: MFA 활성화 여부 필터 (선택)
        force_password_change: 비밀번호 변경 강제 여부 필터 (선택)
        created_after: 생성일시 이후 (ISO 8601 형식, 선택)
        created_before: 생성일시 이전 (ISO 8601 형식, 선택)

    Returns:
        list[User]: 사용자 객체 리스트
    """
    from datetime import datetime
    from sqlalchemy import or_

    # 필터 조건 구성
    filters = {}
    if user_type:
        filters["user_type"] = user_type
    if status:
        filters["status"] = status
    if mfa_enabled is not None:
        filters["mfa_enabled"] = mfa_enabled
    if force_password_change is not None:
        filters["force_password_change"] = force_password_change

    # search 조건 (복잡한 OR 조건이므로 extra_conditions에서 처리)
    extra_conditions = []
    if search:
        search_pattern = f"%{search}%"
        extra_conditions.append(
            or_(
                UserModel.full_name.ilike(search_pattern),
                UserModel.email.ilike(search_pattern),
                UserModel.username.ilike(search_pattern),
            )
        )

    # 생성일시 범위 필터 (날짜만 받음: YYYY-MM-DD 형식)
    # from: 해당 날짜의 00:00:00 이상
    # to: 해당 날짜의 23:59:59 이하
    if created_after:
        try:
            # YYYY-MM-DD 형식을 datetime으로 변환하여 00:00:00으로 설정
            from datetime import timezone
            created_after_dt = datetime.strptime(created_after, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            extra_conditions.append(UserModel.created_at >= created_after_dt)
        except (ValueError, AttributeError):
            pass

    if created_before:
        try:
            # YYYY-MM-DD 형식을 datetime으로 변환하여 23:59:59로 설정
            from datetime import timezone, timedelta
            created_before_dt = datetime.strptime(created_before, "%Y-%m-%d").replace(
                hour=23, minute=59, second=59, tzinfo=timezone.utc
            )
            extra_conditions.append(UserModel.created_at <= created_before_dt)
        except (ValueError, AttributeError):
            pass

    # 공통 모듈을 사용한 리스트 조회
    return await get_list(
        db=db,
        model_class=UserModel,
        to_graphql=manager_user_to_graphql,
        limit=limit,
        offset=offset,
        order_by=UserModel.created_at.desc(),  # 최신 순으로 정렬
        extra_conditions=extra_conditions if extra_conditions else None,
        **filters,
    )


@strawberry.type
class ManagerUserQueries:
    """
    Manager IDAM Users Query

    사용자 조회 관련 GraphQL 쿼리를 제공합니다.
    """

    @strawberry.field(description="Manager 사용자 조회 (ID)")
    async def user(self, info, id: strawberry.ID) -> "ManagerUser | None":
        """
        ID로 사용자 단건 조회

        Args:
            id: 사용자 ID

        Returns:
            User: 사용자 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_user_by_id(db, UUID(id))

    @strawberry.field(description="Manager 사용자 목록")
    async def users(
        self,
        info,
        limit: int = 20,
        offset: int = 0,
        user_type: str | None = None,
        status: str | None = None,
        search: str | None = None,
        mfa_enabled: bool | None = None,
        force_password_change: bool | None = None,
        created_after: str | None = None,
        created_before: str | None = None,
    ) -> "list[ManagerUser]":
        """
        사용자 목록 조회 (페이징 및 필터링 지원)

        Args:
            limit: 조회 개수
            offset: 건너뛸 개수
            user_type: 사용자 타입 필터
            status: 상태 필터
            search: 사용자 검색어 (full_name, email, username 검색)
            mfa_enabled: MFA 활성화 여부 필터
            force_password_change: 비밀번호 변경 강제 여부 필터
            created_after: 생성일시 이후 (ISO 8601 형식)
            created_before: 생성일시 이전 (ISO 8601 형식)

        Returns:
            list[User]: 사용자 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_users(
            db,
            limit,
            offset,
            user_type,
            status,
            search,
            mfa_enabled,
            force_password_change,
            created_after,
            created_before,
        )
