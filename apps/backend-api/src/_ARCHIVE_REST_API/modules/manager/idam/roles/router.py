"""API Router for Role."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RoleCreate, RoleListResponse, RoleResponse, RoleUpdate
from .service import RoleService

router = AuditedAPIRouter(prefix="/roles")


@router.post(
    "",
    response_model=EnvelopeResponse[RoleResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Role 생성",
    description="새로운 Role를 생성합니다.",
)
async def create(
    data: RoleCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RoleResponse]:
    """Role 생성."""
    creator_id = UUID(current_user["user_id"])
    obj = await RoleService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(obj)


@router.get(
    "",
    response_model=EnvelopeResponse[RoleListResponse],
    summary="Role 목록 조회",
    description="Role 목록을 조회합니다.",
)
async def get_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    search: str | None = Query(None, description="검색어"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RoleListResponse]:
    """Role 목록 조회."""
    result = await RoleService.get_list(db, page=page, page_size=page_size, search=search)
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{obj_id}",
    response_model=EnvelopeResponse[RoleResponse],
    summary="Role 상세 조회",
    description="Role 상세 정보를 조회합니다.",
)
async def get_detail(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RoleResponse]:
    """Role 상세 조회."""
    obj = await RoleService.get_by_id(db, obj_id)
    return EnvelopeResponse.success_response(obj)


@router.put(
    "/{obj_id}",
    response_model=EnvelopeResponse[RoleResponse],
    summary="Role 수정",
    description="Role 정보를 수정합니다.",
)
async def update(
    obj_id: UUID,
    data: RoleUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RoleResponse]:
    """Role 수정."""
    updater_id = UUID(current_user["user_id"])
    obj = await RoleService.update(db, obj_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(obj)


@router.delete(
    "/{obj_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Role 삭제",
    description="Role를 삭제합니다 (소프트 삭제).",
)
async def delete(
    obj_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Role 삭제."""
    deleter_id = UUID(current_user["user_id"])
    await RoleService.delete(db, obj_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "Role가 삭제되었습니다"})