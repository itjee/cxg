"""API router for product_relations."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ProductRelationsCreate, ProductRelationsListResponse, ProductRelationsResponse, ProductRelationsUpdate
from .service import ProductRelationsService

router = AuditedAPIRouter(prefix="/product_relations")


@router.post(
    "",
    response_model=EnvelopeResponse[ProductRelationsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="상품 연관관계 생성",
    description="상품 연관관계를 생성합니다.",
)
async def create_product_relations(
    data: ProductRelationsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductRelationsResponse]:
    """상품 연관관계 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ProductRelationsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ProductRelationsListResponse],
    summary="상품 연관관계 목록 조회",
    description="상품 연관관계 목록을 조회합니다.",
)
async def get_product_relations_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductRelationsListResponse]:
    """상품 연관관계 목록 조회"""
    items = await ProductRelationsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductRelationsResponse],
    summary="상품 연관관계 상세 조회",
    description="상품 연관관계를 조회합니다.",
)
async def get_product_relations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductRelationsResponse]:
    """상품 연관관계 상세 조회"""
    item = await ProductRelationsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductRelationsResponse],
    summary="상품 연관관계 수정",
    description="상품 연관관계를 수정합니다.",
)
async def update_product_relations(
    item_id: UUID,
    data: ProductRelationsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductRelationsResponse]:
    """상품 연관관계 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ProductRelationsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="상품 연관관계 삭제",
    description="상품 연관관계를 삭제합니다.",
)
async def delete_product_relations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """상품 연관관계 삭제"""
    await ProductRelationsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "상품 연관관계가 삭제되었습니다"})
