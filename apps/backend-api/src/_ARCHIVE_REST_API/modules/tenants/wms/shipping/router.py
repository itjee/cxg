"""API router for shipping."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import ShippingCreate, ShippingListResponse, ShippingResponse, ShippingUpdate
from .service import ShippingService

router = AuditedAPIRouter(prefix="/shipping")


@router.post(
    "",
    response_model=EnvelopeResponse[ShippingResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Shipping 생성",
    description="Shipping를 생성합니다.",
)
async def create_shipping(
    data: ShippingCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingResponse]:
    """Shipping 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await ShippingService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[ShippingListResponse],
    summary="Shipping 목록 조회",
    description="Shipping 목록을 조회합니다.",
)
async def get_shipping_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingListResponse]:
    """Shipping 목록 조회"""
    items = await ShippingService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[ShippingResponse],
    summary="Shipping 상세 조회",
    description="Shipping를 조회합니다.",
)
async def get_shipping(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingResponse]:
    """Shipping 상세 조회"""
    item = await ShippingService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[ShippingResponse],
    summary="Shipping 수정",
    description="Shipping를 수정합니다.",
)
async def update_shipping(
    item_id: UUID,
    data: ShippingUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[ShippingResponse]:
    """Shipping 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await ShippingService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Shipping 삭제",
    description="Shipping를 삭제합니다.",
)
async def delete_shipping(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Shipping 삭제"""
    await ShippingService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Shipping가 삭제되었습니다"})
