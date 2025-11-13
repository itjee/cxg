"""API router for purchase_quotation_items."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PurchaseQuotationItemsCreate, PurchaseQuotationItemsListResponse, PurchaseQuotationItemsResponse, PurchaseQuotationItemsUpdate
from .service import PurchaseQuotationItemsService

router = AuditedAPIRouter(prefix="/purchase_quotation_items")


@router.post(
    "",
    response_model=EnvelopeResponse[PurchaseQuotationItemsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="구매 견적 품목 생성",
    description="구매 견적 품목을 생성합니다.",
)
async def create_purchase_quotation_items(
    data: PurchaseQuotationItemsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseQuotationItemsResponse]:
    """구매 견적 품목 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PurchaseQuotationItemsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PurchaseQuotationItemsListResponse],
    summary="구매 견적 품목 목록 조회",
    description="구매 견적 품목 목록을 조회합니다.",
)
async def get_purchase_quotation_items_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseQuotationItemsListResponse]:
    """구매 견적 품목 목록 조회"""
    items = await PurchaseQuotationItemsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseQuotationItemsResponse],
    summary="구매 견적 품목 상세 조회",
    description="구매 견적 품목을 조회합니다.",
)
async def get_purchase_quotation_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseQuotationItemsResponse]:
    """구매 견적 품목 상세 조회"""
    item = await PurchaseQuotationItemsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseQuotationItemsResponse],
    summary="구매 견적 품목 수정",
    description="구매 견적 품목을 수정합니다.",
)
async def update_purchase_quotation_items(
    item_id: UUID,
    data: PurchaseQuotationItemsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseQuotationItemsResponse]:
    """구매 견적 품목 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PurchaseQuotationItemsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="구매 견적 품목 삭제",
    description="구매 견적 품목을 삭제합니다.",
)
async def delete_purchase_quotation_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """구매 견적 품목 삭제"""
    await PurchaseQuotationItemsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "구매 견적 품목이 삭제되었습니다"})
