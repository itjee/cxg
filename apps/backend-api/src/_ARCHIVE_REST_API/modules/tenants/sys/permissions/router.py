"""API router for permissions."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PermissionsCreate, PermissionsListResponse, PermissionsResponse, PermissionsUpdate
from .service import PermissionsService

router = AuditedAPIRouter()


@router.post(
    "",
    response_model=EnvelopeResponse[PermissionsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Permissions 생성",
    description="Permissions를 생성합니다.",
)
async def create_permissions(
    data: PermissionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionsResponse]:
    """Permissions 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PermissionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PermissionsListResponse],
    summary="Permissions 목록 조회",
    description="Permissions 목록을 조회합니다.",
)
async def get_permissions_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionsListResponse]:
    """Permissions 목록 조회"""
    items = await PermissionsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PermissionsResponse],
    summary="Permissions 상세 조회",
    description="Permissions를 조회합니다.",
)
async def get_permissions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionsResponse]:
    """Permissions 상세 조회"""
    item = await PermissionsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PermissionsResponse],
    summary="Permissions 수정",
    description="Permissions를 수정합니다.",
)
async def update_permissions(
    item_id: UUID,
    data: PermissionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionsResponse]:
    """Permissions 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PermissionsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Permissions 삭제",
    description="Permissions를 삭제합니다.",
)
async def delete_permissions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Permissions 삭제"""
    await PermissionsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Permissions가 삭제되었습니다"})
