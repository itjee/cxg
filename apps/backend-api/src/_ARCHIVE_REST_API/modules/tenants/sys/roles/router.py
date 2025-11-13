"""API router for roles."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RolesCreate, RolesListResponse, RolesResponse, RolesUpdate
from .service import RolesService


router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[RolesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Roles 생성",
    description="Roles를 생성합니다.",
)
async def create_roles(
    data: RolesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolesResponse]:
    """Roles 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await RolesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[RolesListResponse],
    summary="Roles 목록 조회",
    description="Roles 목록을 조회합니다.",
)
async def get_roles_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolesListResponse]:
    """Roles 목록 조회"""
    items = await RolesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[RolesResponse],
    summary="Roles 상세 조회",
    description="Roles를 조회합니다.",
)
async def get_roles(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolesResponse]:
    """Roles 상세 조회"""
    item = await RolesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[RolesResponse],
    summary="Roles 수정",
    description="Roles를 수정합니다.",
)
async def update_roles(
    item_id: UUID,
    data: RolesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolesResponse]:
    """Roles 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await RolesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Roles 삭제",
    description="Roles를 삭제합니다.",
)
async def delete_roles(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Roles 삭제"""
    await RolesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Roles가 삭제되었습니다"})
