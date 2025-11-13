"""
지원 티켓의 댓글 및 처리 이력 관리 테이블

Pydantic schemas for TicketComments model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class TicketCommentsBase(BaseModel):
    """Base schema for TicketComments"""
    model_config = ConfigDict(from_attributes=True)

    ticket_id: UUID = Field(description="티켓 식별자")
    comment_text: str = Field(description="댓글 내용")
    comment_type: str | None = Field(max_length=20, default='COMMENT', description="댓글 유형 (COMMENT: 일반댓글/STATUS_CHANGE: 상태변경/ASSIGNMENT: 담당자배정)")
    is_internal: bool | None = Field(default=False, description="내부 메모 여부 (true: 내부용, false: 고객 공개)")
    attachments: dict | None = Field(None, description="첨부파일 정보 (JSON 배열 형식: [{\"name\": \"file.pdf\", \"url\": \"...\"}])")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class TicketCommentsCreate(TicketCommentsBase):
    """Schema for creating TicketComments"""

    # Exclude auto-generated fields
    pass


class TicketCommentsUpdate(BaseModel):
    """Schema for updating TicketComments (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    ticket_id: UUID | None = Field(None, description="티켓 식별자")
    comment_text: str | None = Field(None, description="댓글 내용")
    comment_type: str | None = Field(max_length=20, default='COMMENT', description="댓글 유형 (COMMENT: 일반댓글/STATUS_CHANGE: 상태변경/ASSIGNMENT: 담당자배정)")
    is_internal: bool | None = Field(default=False, description="내부 메모 여부 (true: 내부용, false: 고객 공개)")
    attachments: dict | None = Field(None, description="첨부파일 정보 (JSON 배열 형식: [{\"name\": \"file.pdf\", \"url\": \"...\"}])")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class TicketCommentsResponse(TicketCommentsBase):
    """Schema for TicketComments response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class TicketCommentsListResponse(BaseModel):
    """Schema for paginated TicketComments list response"""

    items: list[TicketCommentsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "TicketCommentsBase",
    "TicketCommentsCreate",
    "TicketCommentsUpdate",
    "TicketCommentsResponse",
    "TicketCommentsListResponse",
]
