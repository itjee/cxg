"""API router for product_option_values."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ProductOptionValuesCreate, ProductOptionValuesListResponse, ProductOptionValuesResponse, ProductOptionValuesUpdate
from .service import ProductOptionValuesService

router = AuditedAPIRouter(prefix="/product_option_values")


@router.post(
    "",
    response_model=EnvelopeResponse[ProductOptionValuesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="상품 옵션 값 생성",
    description="상품 옵션 값을 생성합니다.",
)
async def create_product_option_values(
    data: ProductOptionValuesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductOptionValuesResponse]:
    """상품 옵션 값 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ProductOptionValuesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ProductOptionValuesListResponse],
    summary="상품 옵션 값 목록 조회",
    description="상품 옵션 값 목록을 조회합니다.",
)
async def get_product_option_values_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductOptionValuesListResponse]:
    """상품 옵션 값 목록 조회"""
    items = await ProductOptionValuesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductOptionValuesResponse],
    summary="상품 옵션 값 상세 조회",
    description="상품 옵션 값을 조회합니다.",
)
async def get_product_option_values(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductOptionValuesResponse]:
    """상품 옵션 값 상세 조회"""
    item = await ProductOptionValuesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductOptionValuesResponse],
    summary="상품 옵션 값 수정",
    description="상품 옵션 값을 수정합니다.",
)
async def update_product_option_values(
    item_id: UUID,
    data: ProductOptionValuesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductOptionValuesResponse]:
    """상품 옵션 값 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ProductOptionValuesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="상품 옵션 값 삭제",
    description="상품 옵션 값을 삭제합니다.",
)
async def delete_product_option_values(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """상품 옵션 값 삭제"""
    await ProductOptionValuesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "상품 옵션 값이 삭제되었습니다"})
