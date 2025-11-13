"""API router for purchase_order_pr_links."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PurchaseOrderPrLinksCreate, PurchaseOrderPrLinksListResponse, PurchaseOrderPrLinksResponse, PurchaseOrderPrLinksUpdate
from .service import PurchaseOrderPrLinksService

router = AuditedAPIRouter(prefix="/purchase_order_pr_links")


@router.post(
    "",
    response_model=EnvelopeResponse[PurchaseOrderPrLinksResponse],
    status_code=status.HTTP_201_CREATED,
    summary="구매 발주 구매요청 연결 생성",
    description="구매 발주 구매요청 연결을 생성합니다.",
)
async def create_purchase_order_pr_links(
    data: PurchaseOrderPrLinksCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseOrderPrLinksResponse]:
    """구매 발주 구매요청 연결 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PurchaseOrderPrLinksService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PurchaseOrderPrLinksListResponse],
    summary="구매 발주 구매요청 연결 목록 조회",
    description="구매 발주 구매요청 연결 목록을 조회합니다.",
)
async def get_purchase_order_pr_links_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseOrderPrLinksListResponse]:
    """구매 발주 구매요청 연결 목록 조회"""
    items = await PurchaseOrderPrLinksService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseOrderPrLinksResponse],
    summary="구매 발주 구매요청 연결 상세 조회",
    description="구매 발주 구매요청 연결을 조회합니다.",
)
async def get_purchase_order_pr_links(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseOrderPrLinksResponse]:
    """구매 발주 구매요청 연결 상세 조회"""
    item = await PurchaseOrderPrLinksService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseOrderPrLinksResponse],
    summary="구매 발주 구매요청 연결 수정",
    description="구매 발주 구매요청 연결을 수정합니다.",
)
async def update_purchase_order_pr_links(
    item_id: UUID,
    data: PurchaseOrderPrLinksUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseOrderPrLinksResponse]:
    """구매 발주 구매요청 연결 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PurchaseOrderPrLinksService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="구매 발주 구매요청 연결 삭제",
    description="구매 발주 구매요청 연결을 삭제합니다.",
)
async def delete_purchase_order_pr_links(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """구매 발주 구매요청 연결 삭제"""
    await PurchaseOrderPrLinksService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "구매 발주 구매요청 연결이 삭제되었습니다"})
