"""인증 API 라우터"""

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import (
    ChangePasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordConfirmRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from .service import AuthService


router = APIRouter()


@router.post(
    "/signup",
    response_model=EnvelopeResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
    description="새로운 사용자를 등록합니다.",
)
async def signup(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_manager_db),
) -> EnvelopeResponse[UserResponse]:
    """회원가입"""
    user = await AuthService.register(db, data)
    return EnvelopeResponse.success_response(user)


@router.post(
    "/signin",
    response_model=EnvelopeResponse[TokenResponse],
    summary="로그인",
    description="사용자명과 비밀번호로 로그인하여 토큰을 발급받습니다.",
)
async def signin(
    data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_manager_db),
) -> EnvelopeResponse[TokenResponse]:
    """로그인"""
    token = await AuthService.login(db, data, request)
    return EnvelopeResponse.success_response(token)


@router.post(
    "/refresh",
    response_model=EnvelopeResponse[TokenResponse],
    summary="토큰 갱신",
    description="Refresh Token으로 새로운 Access Token을 발급받습니다.",
)
async def refresh_token(
    data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TokenResponse]:
    """토큰 갱신"""
    user_id = UUID(current_user["user_id"])
    token = await AuthService.refresh_access_token(db, user_id)
    return EnvelopeResponse.success_response(token)


@router.get(
    "/me",
    response_model=EnvelopeResponse[UserResponse],
    summary="현재 사용자 정보",
    description="현재 로그인한 사용자의 정보를 조회합니다.",
)
async def get_current_user_info(
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    """현재 사용자 정보"""
    user_id = UUID(current_user["user_id"])
    user = await AuthService.get_current_user_info(db, user_id)
    return EnvelopeResponse.success_response(user)


@router.post(
    "/change-password",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="비밀번호 변경",
    description="현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.",
)
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """비밀번호 변경"""
    user_id = UUID(current_user["user_id"])
    await AuthService.change_password(db, user_id, data)
    return EnvelopeResponse.success_response({"message": "비밀번호가 변경되었습니다"})


@router.post(
    "/logout",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="로그아웃",
    description="로그아웃 처리 (클라이언트에서 토큰 삭제)",
)
async def logout(
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """로그아웃"""
    # 실제로는 클라이언트에서 토큰을 삭제
    # 필요시 Redis에 블랙리스트 추가 가능
    return EnvelopeResponse.success_response({"message": "로그아웃되었습니다"})

@router.post(
    "/forgot-password",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="비밀번호 찾기",
    description="비밀번호 재설정 이메일을 발송합니다.",
)
async def forgot_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_manager_db),
) -> EnvelopeResponse[dict[str, str]]:
    """비밀번호 찾기"""
    token = await AuthService.request_password_reset(db, data.email)
    
    # 개발 환경에서는 토큰을 반환 (실제 환경에서는 이메일로만 전송)
    return EnvelopeResponse.success_response({
        "message": "비밀번호 재설정 이메일이 발송되었습니다",
        "reset_token": token  # 개발용 (프로덕션에서 제거 필요)
    })


@router.post(
    "/reset-password",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="비밀번호 재설정",
    description="토큰을 사용하여 새 비밀번호로 재설정합니다. (테스트: admin 계정은 토큰 불필요)",
)
async def reset_password(
    data: ResetPasswordConfirmRequest,
    db: AsyncSession = Depends(get_manager_db),
) -> EnvelopeResponse[dict[str, str]]:
    """비밀번호 재설정"""
    await AuthService.reset_password(db, data.token, data.new_password, data.username)
    return EnvelopeResponse.success_response({"message": "비밀번호가 재설정되었습니다"})
