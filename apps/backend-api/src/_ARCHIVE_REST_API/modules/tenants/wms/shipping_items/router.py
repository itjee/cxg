"""API router for shipping_items."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ShippingItemsCreate, ShippingItemsListResponse, ShippingItemsResponse, ShippingItemsUpdate
from .service import ShippingItemsService

router = AuditedAPIRouter(prefix="/shipping_items")


@router.post(
    "",
    response_model=EnvelopeResponse[ShippingItemsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Shipping Items 생성",
    description="Shipping Items를 생성합니다.",
)
async def create_shipping_items(
    data: ShippingItemsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingItemsResponse]:
    """Shipping Items 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ShippingItemsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ShippingItemsListResponse],
    summary="Shipping Items 목록 조회",
    description="Shipping Items 목록을 조회합니다.",
)
async def get_shipping_items_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingItemsListResponse]:
    """Shipping Items 목록 조회"""
    items = await ShippingItemsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ShippingItemsResponse],
    summary="Shipping Items 상세 조회",
    description="Shipping Items를 조회합니다.",
)
async def get_shipping_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingItemsResponse]:
    """Shipping Items 상세 조회"""
    item = await ShippingItemsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ShippingItemsResponse],
    summary="Shipping Items 수정",
    description="Shipping Items를 수정합니다.",
)
async def update_shipping_items(
    item_id: UUID,
    data: ShippingItemsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingItemsResponse]:
    """Shipping Items 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ShippingItemsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Shipping Items 삭제",
    description="Shipping Items를 삭제합니다.",
)
async def delete_shipping_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Shipping Items 삭제"""
    await ShippingItemsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Shipping Items가 삭제되었습니다"})
