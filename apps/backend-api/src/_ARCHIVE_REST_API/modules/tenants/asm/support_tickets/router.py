"""API router for support_tickets."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import SupportTicketsCreate, SupportTicketsListResponse, SupportTicketsResponse, SupportTicketsUpdate
from .service import SupportTicketsService

router = AuditedAPIRouter(prefix="/support_tickets")


@router.post(
    "",
    response_model=EnvelopeResponse[SupportTicketsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Support Tickets 생성",
    description="Support Tickets를 생성합니다.",
)
async def create_support_tickets(
    data: SupportTicketsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SupportTicketsResponse]:
    """Support Tickets 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await SupportTicketsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[SupportTicketsListResponse],
    summary="Support Tickets 목록 조회",
    description="Support Tickets 목록을 조회합니다.",
)
async def get_support_tickets_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SupportTicketsListResponse]:
    """Support Tickets 목록 조회"""
    items = await SupportTicketsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[SupportTicketsResponse],
    summary="Support Tickets 상세 조회",
    description="Support Tickets를 조회합니다.",
)
async def get_support_tickets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SupportTicketsResponse]:
    """Support Tickets 상세 조회"""
    item = await SupportTicketsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[SupportTicketsResponse],
    summary="Support Tickets 수정",
    description="Support Tickets를 수정합니다.",
)
async def update_support_tickets(
    item_id: UUID,
    data: SupportTicketsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[SupportTicketsResponse]:
    """Support Tickets 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await SupportTicketsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Support Tickets 삭제",
    description="Support Tickets를 삭제합니다.",
)
async def delete_support_tickets(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Support Tickets 삭제"""
    await SupportTicketsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Support Tickets가 삭제되었습니다"})
