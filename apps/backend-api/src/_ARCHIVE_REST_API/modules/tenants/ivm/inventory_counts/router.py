"""API router for inventory_counts."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import InventoryCountsCreate, InventoryCountsListResponse, InventoryCountsResponse, InventoryCountsUpdate
from .service import InventoryCountsService

router = AuditedAPIRouter(prefix="/inventory_counts")


@router.post(
    "",
    response_model=EnvelopeResponse[InventoryCountsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Inventory Counts 생성",
    description="Inventory Counts를 생성합니다.",
)
async def create_inventory_counts(
    data: InventoryCountsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryCountsResponse]:
    """Inventory Counts 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await InventoryCountsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[InventoryCountsListResponse],
    summary="Inventory Counts 목록 조회",
    description="Inventory Counts 목록을 조회합니다.",
)
async def get_inventory_counts_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryCountsListResponse]:
    """Inventory Counts 목록 조회"""
    items = await InventoryCountsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryCountsResponse],
    summary="Inventory Counts 상세 조회",
    description="Inventory Counts를 조회합니다.",
)
async def get_inventory_counts(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryCountsResponse]:
    """Inventory Counts 상세 조회"""
    item = await InventoryCountsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryCountsResponse],
    summary="Inventory Counts 수정",
    description="Inventory Counts를 수정합니다.",
)
async def update_inventory_counts(
    item_id: UUID,
    data: InventoryCountsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryCountsResponse]:
    """Inventory Counts 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await InventoryCountsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Inventory Counts 삭제",
    description="Inventory Counts를 삭제합니다.",
)
async def delete_inventory_counts(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Inventory Counts 삭제"""
    await InventoryCountsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Inventory Counts가 삭제되었습니다"})
