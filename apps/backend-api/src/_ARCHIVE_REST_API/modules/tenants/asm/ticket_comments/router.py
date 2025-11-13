"""API router for ticket_comments."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import TicketCommentsCreate, TicketCommentsListResponse, TicketCommentsResponse, TicketCommentsUpdate
from .service import TicketCommentsService

router = AuditedAPIRouter(prefix="/ticket_comments")


@router.post(
    "",
    response_model=EnvelopeResponse[TicketCommentsResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Ticket Comments 생성",
    description="Ticket Comments를 생성합니다.",
)
async def create_ticket_comments(
    data: TicketCommentsCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TicketCommentsResponse]:
    """Ticket Comments 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await TicketCommentsService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[TicketCommentsListResponse],
    summary="Ticket Comments 목록 조회",
    description="Ticket Comments 목록을 조회합니다.",
)
async def get_ticket_comments_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TicketCommentsListResponse]:
    """Ticket Comments 목록 조회"""
    items = await TicketCommentsService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[TicketCommentsResponse],
    summary="Ticket Comments 상세 조회",
    description="Ticket Comments를 조회합니다.",
)
async def get_ticket_comments(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TicketCommentsResponse]:
    """Ticket Comments 상세 조회"""
    item = await TicketCommentsService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[TicketCommentsResponse],
    summary="Ticket Comments 수정",
    description="Ticket Comments를 수정합니다.",
)
async def update_ticket_comments(
    item_id: UUID,
    data: TicketCommentsUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TicketCommentsResponse]:
    """Ticket Comments 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await TicketCommentsService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="Ticket Comments 삭제",
    description="Ticket Comments를 삭제합니다.",
)
async def delete_ticket_comments(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """Ticket Comments 삭제"""
    await TicketCommentsService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "Ticket Comments가 삭제되었습니다"})
