"""API router for product_images."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ProductImagesCreate, ProductImagesListResponse, ProductImagesResponse, ProductImagesUpdate
from .service import ProductImagesService

router = AuditedAPIRouter(prefix="/product_images")


@router.post(
    "",
    response_model=EnvelopeResponse[ProductImagesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Product Images 생성",
    description="Product Images를 생성합니다.",
)
async def create_product_images(
    data: ProductImagesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductImagesResponse]:
    """Product Images 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ProductImagesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ProductImagesListResponse],
    summary="Product Images 목록 조회",
    description="Product Images 목록을 조회합니다.",
)
async def get_product_images_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductImagesListResponse]:
    """Product Images 목록 조회"""
    items = await ProductImagesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductImagesResponse],
    summary="Product Images 상세 조회",
    description="Product Images를 조회합니다.",
)
async def get_product_images(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductImagesResponse]:
    """Product Images 상세 조회"""
    item = await ProductImagesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ProductImagesResponse],
    summary="Product Images 수정",
    description="Product Images를 수정합니다.",
)
async def update_product_images(
    item_id: UUID,
    data: ProductImagesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ProductImagesResponse]:
    """Product Images 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ProductImagesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Product Images 삭제",
    description="Product Images를 삭제합니다.",
)
async def delete_product_images(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Product Images 삭제"""
    await ProductImagesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Product Images가 삭제되었습니다"})
