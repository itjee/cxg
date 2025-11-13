"""API router for journal_entry_lines."""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import JournalEntryLinesCreate, JournalEntryLinesListResponse, JournalEntryLinesResponse, JournalEntryLinesUpdate
from .service import JournalEntryLinesService

router = AuditedAPIRouter(prefix="/journal_entry_lines")


@router.post(
    "",
    response_model=EnvelopeResponse[JournalEntryLinesResponse],
    status_code=status.HTTP_201_CREATED,
    summary="분개 항목 생성",
    description="분개 항목을 생성합니다.",
)
async def create_journal_entry_lines(
    data: JournalEntryLinesCreate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[JournalEntryLinesResponse]:
    """분개 항목 생성"""
    creator_id = UUID(current_user["user_id"])
    item = await JournalEntryLinesService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(item)


@router.get(
    "",
    response_model=EnvelopeResponse[JournalEntryLinesListResponse],
    summary="분개 항목 목록 조회",
    description="분개 항목 목록을 조회합니다.",
)
async def get_journal_entry_lines_list(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[JournalEntryLinesListResponse]:
    """분개 항목 목록 조회"""
    items = await JournalEntryLinesService.get_list(
        db,
        page=page,
        page_size=page_size,
    )
    return EnvelopeResponse.success_response(items)


@router.get(
    "/{item_id}",
    response_model=EnvelopeResponse[JournalEntryLinesResponse],
    summary="분개 항목 상세 조회",
    description="분개 항목을 조회합니다.",
)
async def get_journal_entry_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[JournalEntryLinesResponse]:
    """분개 항목 상세 조회"""
    item = await JournalEntryLinesService.get_by_id(db, item_id)
    return EnvelopeResponse.success_response(item)


@router.put(
    "/{item_id}",
    response_model=EnvelopeResponse[JournalEntryLinesResponse],
    summary="분개 항목 수정",
    description="분개 항목을 수정합니다.",
)
async def update_journal_entry_lines(
    item_id: UUID,
    data: JournalEntryLinesUpdate,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[JournalEntryLinesResponse]:
    """분개 항목 수정"""
    updater_id = UUID(current_user["user_id"])
    item = await JournalEntryLinesService.update(db, item_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(item)


@router.delete(
    "/{item_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    summary="분개 항목 삭제",
    description="분개 항목을 삭제합니다.",
)
async def delete_journal_entry_lines(
    item_id: UUID,
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """분개 항목 삭제"""
    await JournalEntryLinesService.delete(db, item_id, deleted_by=UUID(current_user["user_id"]))
    return EnvelopeResponse.success_response({"message": "분개 항목이 삭제되었습니다"})
