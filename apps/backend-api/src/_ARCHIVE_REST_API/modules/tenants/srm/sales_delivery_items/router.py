"""API router for sales_delivery_items."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SalesDeliveryItemsCreate, SalesDeliveryItemsListResponse, SalesDeliveryItemsResponse, SalesDeliveryItemsUpdate
from .service import SalesDeliveryItemsService

router = AuditedAPIRouter(prefix="/sales_delivery_items")


@router.post(
    "",
    response_model=EnvelopeResponse[SalesDeliveryItemsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Sales Delivery Items 생성",
    description="Sales Delivery Items를 생성합니다.",
)
async def create_sales_delivery_items(
    data: SalesDeliveryItemsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesDeliveryItemsResponse]:
    """Sales Delivery Items 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await SalesDeliveryItemsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[SalesDeliveryItemsListResponse],
    summary="Sales Delivery Items 목록 조회",
    description="Sales Delivery Items 목록을 조회합니다.",
)
async def get_sales_delivery_items_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesDeliveryItemsListResponse]:
    """Sales Delivery Items 목록 조회"""
    items = await SalesDeliveryItemsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[SalesDeliveryItemsResponse],
    summary="Sales Delivery Items 상세 조회",
    description="Sales Delivery Items를 조회합니다.",
)
async def get_sales_delivery_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesDeliveryItemsResponse]:
    """Sales Delivery Items 상세 조회"""
    item = await SalesDeliveryItemsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[SalesDeliveryItemsResponse],
    summary="Sales Delivery Items 수정",
    description="Sales Delivery Items를 수정합니다.",
)
async def update_sales_delivery_items(
    item_id: UUID,
    data: SalesDeliveryItemsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesDeliveryItemsResponse]:
    """Sales Delivery Items 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await SalesDeliveryItemsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Sales Delivery Items 삭제",
    description="Sales Delivery Items를 삭제합니다.",
)
async def delete_sales_delivery_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Sales Delivery Items 삭제"""
    await SalesDeliveryItemsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Sales Delivery Items가 삭제되었습니다"})
