"""API router for users."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import (
    PasswordChangeRequest,
    PasswordChangeResponse,
    UserInviteRequest,
    UserInviteResponse,
    UsersCreate,
    UsersListResponse,
    UsersResponse,
    UsersUpdate,
)
from .service import UsersService


router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[UsersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Users 생성",
    description="Users를 생성합니다.",
)
async def create_users(
    data: UsersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UsersResponse]:
    """Users 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await UsersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[UsersListResponse],
    summary="Users 목록 조회",
    description="Users 목록을 조회합니다.",
)
async def get_users_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UsersListResponse]:
    """Users 목록 조회"""
    items = await UsersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[UsersResponse],
    summary="Users 상세 조회",
    description="Users를 조회합니다.",
)
async def get_users(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UsersResponse]:
    """Users 상세 조회"""
    item = await UsersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[UsersResponse],
    summary="Users 수정",
    description="Users를 수정합니다.",
)
async def update_users(
    item_id: UUID,
    data: UsersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UsersResponse]:
    """Users 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await UsersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Users 삭제",
    description="Users를 삭제합니다.",
)
async def delete_users(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Users 삭제"""
    await UsersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Users가 삭제되었습니다"})


@router.post(
    "/invite",
    response_model=EnvelopeResponse[UserInviteResponse],
    status_code=status.HTTP_201_CREATED,
    summary="사용자 초대",
    description="""
    새로운 사용자를 초대합니다.
    
    프로세스:
    1. 사용자명/이메일 중복 확인
    2. 임시 비밀번호 생성
    3. 사용자 계정 생성
    4. 초대 이메일 발송 (프론트엔드에서 처리)
    
    초대된 사용자는 첫 로그인 시 비밀번호를 변경해야 합니다.
    """,
)
async def invite_user(
    data: UserInviteRequest,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserInviteResponse]:
    """사용자 초대 (관리자 전용)"""
    inviter_id = UUID(current_user["user_id"])
    result = await UsersService.invite_user(db, data, invited_by=inviter_id)
    return EnvelopeResponse.success_response(result)


@router.post(
    "/change-password",
    response_model=EnvelopeResponse[PasswordChangeResponse],
    summary="비밀번호 변경",
    description="""
    사용자의 비밀번호를 변경합니다.
    
    첫 로그인 시 또는 필요 시 비밀번호를 변경할 수 있습니다.
    현재 비밀번호 확인 후 새 비밀번호로 변경됩니다.
    """,
)
async def change_password(
    data: PasswordChangeRequest,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PasswordChangeResponse]:
    """비밀번호 변경"""
    user_id = UUID(current_user["user_id"])
    result = await UsersService.change_password(db, user_id, data)
    return EnvelopeResponse.success_response(result)
