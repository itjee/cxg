"""API router for product_variants."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ProductVariantsCreate, ProductVariantsListResponse, ProductVariantsResponse, ProductVariantsUpdate
from .service import ProductVariantsService

router = AuditedAPIRouter(prefix="/product_variants")


@router.post(
    "",
    response_model=EnvelopeResponse[ProductVariantsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Product Variants 생성",
    description="Product Variants를 생성합니다.",
)
async def create_product_variants(
    data: ProductVariantsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductVariantsResponse]:
    """Product Variants 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ProductVariantsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ProductVariantsListResponse],
    summary="Product Variants 목록 조회",
    description="Product Variants 목록을 조회합니다.",
)
async def get_product_variants_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductVariantsListResponse]:
    """Product Variants 목록 조회"""
    items = await ProductVariantsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductVariantsResponse],
    summary="Product Variants 상세 조회",
    description="Product Variants를 조회합니다.",
)
async def get_product_variants(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductVariantsResponse]:
    """Product Variants 상세 조회"""
    item = await ProductVariantsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductVariantsResponse],
    summary="Product Variants 수정",
    description="Product Variants를 수정합니다.",
)
async def update_product_variants(
    item_id: UUID,
    data: ProductVariantsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductVariantsResponse]:
    """Product Variants 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ProductVariantsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Product Variants 삭제",
    description="Product Variants를 삭제합니다.",
)
async def delete_product_variants(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Product Variants 삭제"""
    await ProductVariantsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Product Variants가 삭제되었습니다"})
