"""API router for sales_targets."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SalesTargetsCreate, SalesTargetsListResponse, SalesTargetsResponse, SalesTargetsUpdate
from .service import SalesTargetsService

router = AuditedAPIRouter(prefix="/sales_targets")


@router.post(
    "",
    response_model=EnvelopeResponse[SalesTargetsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Sales Targets 생성",
    description="Sales Targets를 생성합니다.",
)
async def create_sales_targets(
    data: SalesTargetsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesTargetsResponse]:
    """Sales Targets 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await SalesTargetsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[SalesTargetsListResponse],
    summary="Sales Targets 목록 조회",
    description="Sales Targets 목록을 조회합니다.",
)
async def get_sales_targets_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesTargetsListResponse]:
    """Sales Targets 목록 조회"""
    items = await SalesTargetsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[SalesTargetsResponse],
    summary="Sales Targets 상세 조회",
    description="Sales Targets를 조회합니다.",
)
async def get_sales_targets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesTargetsResponse]:
    """Sales Targets 상세 조회"""
    item = await SalesTargetsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[SalesTargetsResponse],
    summary="Sales Targets 수정",
    description="Sales Targets를 수정합니다.",
)
async def update_sales_targets(
    item_id: UUID,
    data: SalesTargetsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SalesTargetsResponse]:
    """Sales Targets 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await SalesTargetsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Sales Targets 삭제",
    description="Sales Targets를 삭제합니다.",
)
async def delete_sales_targets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Sales Targets 삭제"""
    await SalesTargetsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Sales Targets가 삭제되었습니다"})
