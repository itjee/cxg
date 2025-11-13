"""API router for purchase_price_agreements."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PurchasePriceAgreementsCreate, PurchasePriceAgreementsListResponse, PurchasePriceAgreementsResponse, PurchasePriceAgreementsUpdate
from .service import PurchasePriceAgreementsService

router = AuditedAPIRouter(prefix="/purchase_price_agreements")


@router.post(
    "",
    response_model=EnvelopeResponse[PurchasePriceAgreementsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="구매 가격 계약 생성",
    description="구매 가격 계약을 생성합니다.",
)
async def create_purchase_price_agreements(
    data: PurchasePriceAgreementsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchasePriceAgreementsResponse]:
    """구매 가격 계약 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PurchasePriceAgreementsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PurchasePriceAgreementsListResponse],
    summary="구매 가격 계약 목록 조회",
    description="구매 가격 계약 목록을 조회합니다.",
)
async def get_purchase_price_agreements_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchasePriceAgreementsListResponse]:
    """구매 가격 계약 목록 조회"""
    items = await PurchasePriceAgreementsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchasePriceAgreementsResponse],
    summary="구매 가격 계약 상세 조회",
    description="구매 가격 계약을 조회합니다.",
)
async def get_purchase_price_agreements(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchasePriceAgreementsResponse]:
    """구매 가격 계약 상세 조회"""
    item = await PurchasePriceAgreementsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchasePriceAgreementsResponse],
    summary="구매 가격 계약 수정",
    description="구매 가격 계약을 수정합니다.",
)
async def update_purchase_price_agreements(
    item_id: UUID,
    data: PurchasePriceAgreementsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchasePriceAgreementsResponse]:
    """구매 가격 계약 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PurchasePriceAgreementsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="구매 가격 계약 삭제",
    description="구매 가격 계약을 삭제합니다.",
)
async def delete_purchase_price_agreements(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """구매 가격 계약 삭제"""
    await PurchasePriceAgreementsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "구매 가격 계약이 삭제되었습니다"})
