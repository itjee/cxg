"""API router for quotations."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import QuotationsCreate, QuotationsListResponse, QuotationsResponse, QuotationsUpdate
from .service import QuotationsService

router = AuditedAPIRouter(prefix="/quotations")


@router.post(
    "",
    response_model=EnvelopeResponse[QuotationsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Quotations 생성",
    description="Quotations를 생성합니다.",
)
async def create_quotations(
    data: QuotationsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[QuotationsResponse]:
    """Quotations 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await QuotationsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[QuotationsListResponse],
    summary="Quotations 목록 조회",
    description="Quotations 목록을 조회합니다.",
)
async def get_quotations_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[QuotationsListResponse]:
    """Quotations 목록 조회"""
    items = await QuotationsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[QuotationsResponse],
    summary="Quotations 상세 조회",
    description="Quotations를 조회합니다.",
)
async def get_quotations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[QuotationsResponse]:
    """Quotations 상세 조회"""
    item = await QuotationsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[QuotationsResponse],
    summary="Quotations 수정",
    description="Quotations를 수정합니다.",
)
async def update_quotations(
    item_id: UUID,
    data: QuotationsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[QuotationsResponse]:
    """Quotations 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await QuotationsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Quotations 삭제",
    description="Quotations를 삭제합니다.",
)
async def delete_quotations(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Quotations 삭제"""
    await QuotationsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Quotations가 삭제되었습니다"})
