"""API router for permission_conflict_resolution."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PermissionConflictResolutionCreate, PermissionConflictResolutionListResponse, PermissionConflictResolutionResponse, PermissionConflictResolutionUpdate
from .service import PermissionConflictResolutionService

router = AuditedAPIRouter(prefix="/permission_conflict_resolution")


@router.post(
    "",
    response_model=EnvelopeResponse[PermissionConflictResolutionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Permission Conflict Resolution 생성",
    description="Permission Conflict Resolution를 생성합니다.",
)
async def create_permission_conflict_resolution(
    data: PermissionConflictResolutionCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionConflictResolutionResponse]:
    """Permission Conflict Resolution 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PermissionConflictResolutionService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PermissionConflictResolutionListResponse],
    summary="Permission Conflict Resolution 목록 조회",
    description="Permission Conflict Resolution 목록을 조회합니다.",
)
async def get_permission_conflict_resolution_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionConflictResolutionListResponse]:
    """Permission Conflict Resolution 목록 조회"""
    items = await PermissionConflictResolutionService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PermissionConflictResolutionResponse],
    summary="Permission Conflict Resolution 상세 조회",
    description="Permission Conflict Resolution를 조회합니다.",
)
async def get_permission_conflict_resolution(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionConflictResolutionResponse]:
    """Permission Conflict Resolution 상세 조회"""
    item = await PermissionConflictResolutionService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PermissionConflictResolutionResponse],
    summary="Permission Conflict Resolution 수정",
    description="Permission Conflict Resolution를 수정합니다.",
)
async def update_permission_conflict_resolution(
    item_id: UUID,
    data: PermissionConflictResolutionUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PermissionConflictResolutionResponse]:
    """Permission Conflict Resolution 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PermissionConflictResolutionService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Permission Conflict Resolution 삭제",
    description="Permission Conflict Resolution를 삭제합니다.",
)
async def delete_permission_conflict_resolution(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Permission Conflict Resolution 삭제"""
    await PermissionConflictResolutionService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Permission Conflict Resolution가 삭제되었습니다"})
