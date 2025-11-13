"""User API router."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import UserCreate, UserListResponse, UserResponse, UserUpdate
from .service import UserService

router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="사용자 생성",
    description="새로운 사용자를 생성합니다.",
)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    """사용자 생성."""
    creator_id = UUID(current_user["user_id"])
    user = await UserService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(user)


@router.get(
    "",
    response_model=EnvelopeResponse[UserListResponse],
    summary="사용자 목록 조회",
    description="사용자 목록을 페이지네이션과 필터로 조회합니다.",
)
async def get_user_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    status: str | None = Query(None, description="상태 필터 (ACTIVE, INACTIVE, LOCKED, SUSPENDED)"),
    user_type: str | None = Query(None, description="사용자 유형 필터 (MASTER, TENANT, SYSTEM)"),
    search: str | None = Query(None, description="검색어 (사용자명, 이름, 이메일)"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserListResponse]:
    """사용자 목록 조회."""
    users = await UserService.get_list(
        db,
        page=page,
        page_size=page_size,
        status_filter=status,
        user_type_filter=user_type,
        search=search,
    )
    return EnvelopeResponse.success_response(users)


@router.get(
    "/{user_id}",
    response_model=EnvelopeResponse[UserResponse],
    summary="사용자 상세 조회",
    description="특정 사용자의 상세 정보를 조회합니다.",
)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    """사용자 상세 조회."""
    user = await UserService.get_by_id(db, user_id)
    return EnvelopeResponse.success_response(user)


@router.put(
    "/{user_id}",
    response_model=EnvelopeResponse[UserResponse],
    summary="사용자 수정",
    description="사용자 정보를 수정합니다.",
)
async def update_user(
    user_id: UUID,
    data: UserUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    """사용자 수정."""
    updater_id = UUID(current_user["user_id"])
    user = await UserService.update(db, user_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(user)


@router.delete(
    "/{user_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="사용자 삭제",
    description="사용자를 삭제합니다 (소프트 삭제).",
)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """사용자 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await UserService.delete(db, user_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "사용자가 삭제되었습니다"})


@router.patch(
    "/{user_id}/status",
    response_model=EnvelopeResponse[UserResponse],
    summary="사용자 상태 변경",
    description="사용자의 상태를 변경합니다.",
)
async def change_user_status(
    user_id: UUID,
    new_status: str = Query(..., pattern="^(ACTIVE|INACTIVE|LOCKED|SUSPENDED)$"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    """사용자 상태 변경."""
    updater_id = UUID(current_user["user_id"])
    user = await UserService.change_status(db, user_id, new_status, updated_by=updater_id)
    return EnvelopeResponse.success_response(user)