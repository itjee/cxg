"""API router for role_permissions."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RolePermissionsCreate, RolePermissionsListResponse, RolePermissionsResponse, RolePermissionsUpdate
from .service import RolePermissionsService

router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[RolePermissionsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Role Permissions 생성",
    description="Role Permissions를 생성합니다.",
)
async def create_role_permissions(
    data: RolePermissionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolePermissionsResponse]:
    """Role Permissions 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await RolePermissionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[RolePermissionsListResponse],
    summary="Role Permissions 목록 조회",
    description="Role Permissions 목록을 조회합니다.",
)
async def get_role_permissions_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolePermissionsListResponse]:
    """Role Permissions 목록 조회"""
    items = await RolePermissionsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[RolePermissionsResponse],
    summary="Role Permissions 상세 조회",
    description="Role Permissions를 조회합니다.",
)
async def get_role_permissions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolePermissionsResponse]:
    """Role Permissions 상세 조회"""
    item = await RolePermissionsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[RolePermissionsResponse],
    summary="Role Permissions 수정",
    description="Role Permissions를 수정합니다.",
)
async def update_role_permissions(
    item_id: UUID,
    data: RolePermissionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RolePermissionsResponse]:
    """Role Permissions 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await RolePermissionsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Role Permissions 삭제",
    description="Role Permissions를 삭제합니다.",
)
async def delete_role_permissions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Role Permissions 삭제"""
    await RolePermissionsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Role Permissions가 삭제되었습니다"})
