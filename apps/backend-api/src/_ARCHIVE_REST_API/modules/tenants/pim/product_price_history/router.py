"""API router for product_price_history."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ProductPriceHistoryCreate, ProductPriceHistoryListResponse, ProductPriceHistoryResponse, ProductPriceHistoryUpdate
from .service import ProductPriceHistoryService

router = AuditedAPIRouter(prefix="/product_price_history")


@router.post(
    "",
    response_model=EnvelopeResponse[ProductPriceHistoryResponse],
    status_code=status.HTTP_201_CREATED,
    summary="상품 가격 이력 생성",
    description="상품 가격 이력을 생성합니다.",
)
async def create_product_price_history(
    data: ProductPriceHistoryCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductPriceHistoryResponse]:
    """상품 가격 이력 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ProductPriceHistoryService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ProductPriceHistoryListResponse],
    summary="상품 가격 이력 목록 조회",
    description="상품 가격 이력 목록을 조회합니다.",
)
async def get_product_price_history_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductPriceHistoryListResponse]:
    """상품 가격 이력 목록 조회"""
    items = await ProductPriceHistoryService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductPriceHistoryResponse],
    summary="상품 가격 이력 상세 조회",
    description="상품 가격 이력을 조회합니다.",
)
async def get_product_price_history(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductPriceHistoryResponse]:
    """상품 가격 이력 상세 조회"""
    item = await ProductPriceHistoryService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductPriceHistoryResponse],
    summary="상품 가격 이력 수정",
    description="상품 가격 이력을 수정합니다.",
)
async def update_product_price_history(
    item_id: UUID,
    data: ProductPriceHistoryUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductPriceHistoryResponse]:
    """상품 가격 이력 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ProductPriceHistoryService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="상품 가격 이력 삭제",
    description="상품 가격 이력을 삭제합니다.",
)
async def delete_product_price_history(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """상품 가격 이력 삭제"""
    await ProductPriceHistoryService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "상품 가격 이력이 삭제되었습니다"})
