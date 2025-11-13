"""API router for inventory_lots."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import InventoryLotsCreate, InventoryLotsListResponse, InventoryLotsResponse, InventoryLotsUpdate
from .service import InventoryLotsService

router = AuditedAPIRouter(prefix="/inventory_lots")


@router.post(
    "",
    response_model=EnvelopeResponse[InventoryLotsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Inventory Lots 생성",
    description="Inventory Lots를 생성합니다.",
)
async def create_inventory_lots(
    data: InventoryLotsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryLotsResponse]:
    """Inventory Lots 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await InventoryLotsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[InventoryLotsListResponse],
    summary="Inventory Lots 목록 조회",
    description="Inventory Lots 목록을 조회합니다.",
)
async def get_inventory_lots_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryLotsListResponse]:
    """Inventory Lots 목록 조회"""
    items = await InventoryLotsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryLotsResponse],
    summary="Inventory Lots 상세 조회",
    description="Inventory Lots를 조회합니다.",
)
async def get_inventory_lots(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryLotsResponse]:
    """Inventory Lots 상세 조회"""
    item = await InventoryLotsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryLotsResponse],
    summary="Inventory Lots 수정",
    description="Inventory Lots를 수정합니다.",
)
async def update_inventory_lots(
    item_id: UUID,
    data: InventoryLotsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryLotsResponse]:
    """Inventory Lots 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await InventoryLotsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Inventory Lots 삭제",
    description="Inventory Lots를 삭제합니다.",
)
async def delete_inventory_lots(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Inventory Lots 삭제"""
    await InventoryLotsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Inventory Lots가 삭제되었습니다"})
