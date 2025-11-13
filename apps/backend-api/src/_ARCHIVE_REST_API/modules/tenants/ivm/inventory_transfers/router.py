"""API router for inventory_transfers."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import InventoryTransfersCreate, InventoryTransfersListResponse, InventoryTransfersResponse, InventoryTransfersUpdate
from .service import InventoryTransfersService

router = AuditedAPIRouter(prefix="/inventory_transfers")


@router.post(
    "",
    response_model=EnvelopeResponse[InventoryTransfersResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Inventory Transfers 생성",
    description="Inventory Transfers를 생성합니다.",
)
async def create_inventory_transfers(
    data: InventoryTransfersCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryTransfersResponse]:
    """Inventory Transfers 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await InventoryTransfersService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[InventoryTransfersListResponse],
    summary="Inventory Transfers 목록 조회",
    description="Inventory Transfers 목록을 조회합니다.",
)
async def get_inventory_transfers_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryTransfersListResponse]:
    """Inventory Transfers 목록 조회"""
    items = await InventoryTransfersService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryTransfersResponse],
    summary="Inventory Transfers 상세 조회",
    description="Inventory Transfers를 조회합니다.",
)
async def get_inventory_transfers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryTransfersResponse]:
    """Inventory Transfers 상세 조회"""
    item = await InventoryTransfersService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[InventoryTransfersResponse],
    summary="Inventory Transfers 수정",
    description="Inventory Transfers를 수정합니다.",
)
async def update_inventory_transfers(
    item_id: UUID,
    data: InventoryTransfersUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[InventoryTransfersResponse]:
    """Inventory Transfers 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await InventoryTransfersService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Inventory Transfers 삭제",
    description="Inventory Transfers를 삭제합니다.",
)
async def delete_inventory_transfers(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Inventory Transfers 삭제"""
    await InventoryTransfersService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Inventory Transfers가 삭제되었습니다"})
