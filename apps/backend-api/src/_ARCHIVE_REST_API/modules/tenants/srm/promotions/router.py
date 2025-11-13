"""API router for promotions."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import PromotionsCreate, PromotionsListResponse, PromotionsResponse, PromotionsUpdate
from .service import PromotionsService

router = AuditedAPIRouter(prefix="/promotions")


@router.post(
    "",
    response_model=EnvelopeResponse[PromotionsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Promotions 생성",
    description="Promotions를 생성합니다.",
)
async def create_promotions(
    data: PromotionsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PromotionsResponse]:
    """Promotions 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await PromotionsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[PromotionsListResponse],
    summary="Promotions 목록 조회",
    description="Promotions 목록을 조회합니다.",
)
async def get_promotions_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PromotionsListResponse]:
    """Promotions 목록 조회"""
    items = await PromotionsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[PromotionsResponse],
    summary="Promotions 상세 조회",
    description="Promotions를 조회합니다.",
)
async def get_promotions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PromotionsResponse]:
    """Promotions 상세 조회"""
    item = await PromotionsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[PromotionsResponse],
    summary="Promotions 수정",
    description="Promotions를 수정합니다.",
)
async def update_promotions(
    item_id: UUID,
    data: PromotionsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[PromotionsResponse]:
    """Promotions 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await PromotionsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Promotions 삭제",
    description="Promotions를 삭제합니다.",
)
async def delete_promotions(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Promotions 삭제"""
    await PromotionsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Promotions가 삭제되었습니다"})
