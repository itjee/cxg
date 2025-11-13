"""API router for purchase_analytics."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PurchaseAnalyticsCreate, PurchaseAnalyticsListResponse, PurchaseAnalyticsResponse, PurchaseAnalyticsUpdate
from .service import PurchaseAnalyticsService

router = AuditedAPIRouter(prefix="/purchase_analytics")


@router.post(
    "",
    response_model=EnvelopeResponse[PurchaseAnalyticsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Purchase Analytics 생성",
    description="Purchase Analytics를 생성합니다.",
)
async def create_purchase_analytics(
    data: PurchaseAnalyticsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseAnalyticsResponse]:
    """Purchase Analytics 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PurchaseAnalyticsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PurchaseAnalyticsListResponse],
    summary="Purchase Analytics 목록 조회",
    description="Purchase Analytics 목록을 조회합니다.",
)
async def get_purchase_analytics_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseAnalyticsListResponse]:
    """Purchase Analytics 목록 조회"""
    items = await PurchaseAnalyticsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseAnalyticsResponse],
    summary="Purchase Analytics 상세 조회",
    description="Purchase Analytics를 조회합니다.",
)
async def get_purchase_analytics(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseAnalyticsResponse]:
    """Purchase Analytics 상세 조회"""
    item = await PurchaseAnalyticsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PurchaseAnalyticsResponse],
    summary="Purchase Analytics 수정",
    description="Purchase Analytics를 수정합니다.",
)
async def update_purchase_analytics(
    item_id: UUID,
    data: PurchaseAnalyticsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PurchaseAnalyticsResponse]:
    """Purchase Analytics 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PurchaseAnalyticsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Purchase Analytics 삭제",
    description="Purchase Analytics를 삭제합니다.",
)
async def delete_purchase_analytics(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Purchase Analytics 삭제"""
    await PurchaseAnalyticsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Purchase Analytics가 삭제되었습니다"})
