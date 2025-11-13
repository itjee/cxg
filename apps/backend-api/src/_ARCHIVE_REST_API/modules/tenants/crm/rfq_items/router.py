"""API router for rfq_items."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import RfqItemsCreate, RfqItemsListResponse, RfqItemsResponse, RfqItemsUpdate
from .service import RfqItemsService

router = AuditedAPIRouter(prefix="/rfq_items")


@router.post(
    "",
    response_model=EnvelopeResponse[RfqItemsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Rfq Items 생성",
    description="Rfq Items를 생성합니다.",
)
async def create_rfq_items(
    data: RfqItemsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqItemsResponse]:
    """Rfq Items 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await RfqItemsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[RfqItemsListResponse],
    summary="Rfq Items 목록 조회",
    description="Rfq Items 목록을 조회합니다.",
)
async def get_rfq_items_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqItemsListResponse]:
    """Rfq Items 목록 조회"""
    items = await RfqItemsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[RfqItemsResponse],
    summary="Rfq Items 상세 조회",
    description="Rfq Items를 조회합니다.",
)
async def get_rfq_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqItemsResponse]:
    """Rfq Items 상세 조회"""
    item = await RfqItemsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[RfqItemsResponse],
    summary="Rfq Items 수정",
    description="Rfq Items를 수정합니다.",
)
async def update_rfq_items(
    item_id: UUID,
    data: RfqItemsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[RfqItemsResponse]:
    """Rfq Items 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await RfqItemsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Rfq Items 삭제",
    description="Rfq Items를 삭제합니다.",
)
async def delete_rfq_items(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Rfq Items 삭제"""
    await RfqItemsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Rfq Items가 삭제되었습니다"})
