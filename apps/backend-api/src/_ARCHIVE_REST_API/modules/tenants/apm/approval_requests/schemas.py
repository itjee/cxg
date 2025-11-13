"""
결재 요청 테이블

Pydantic schemas for ApprovalRequests model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ApprovalRequestsBase(BaseModel):
    """Base schema for ApprovalRequests"""
    model_config = ConfigDict(from_attributes=True)

    request_code: str = Field(max_length=50, description="결재 요청 코드")
    document_type: str = Field(max_length=50, description="문서 유형 (PO/SO/LEAVE/EXPENSE 등)")
    document_id: UUID = Field(description="문서 식별자")
    requester_id: UUID = Field(description="요청자 식별자")
    department_id: UUID | None = Field(None, description="요청 부서")
    line_id: UUID | None = Field(None, description="사용된 결재선")
    current_step: int | None = Field(default=1, description="현재 결재 단계")
    subject: str = Field(max_length=500, description="제목")
    content: str | None = Field(None, description="내용")
    status: str | None = Field(max_length=20, default='PENDING', description="결재 상태 (PENDING/IN_PROGRESS/APPROVED/REJECTED/CANCELLED)")
    completed_at: datetime | None = Field(None, description="완료 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalRequestsCreate(ApprovalRequestsBase):
    """Schema for creating ApprovalRequests"""

    # Exclude auto-generated fields
    pass


class ApprovalRequestsUpdate(BaseModel):
    """Schema for updating ApprovalRequests (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    request_code: str | None = Field(None, max_length=50, description="결재 요청 코드")
    document_type: str | None = Field(None, max_length=50, description="문서 유형 (PO/SO/LEAVE/EXPENSE 등)")
    document_id: UUID | None = Field(None, description="문서 식별자")
    requester_id: UUID | None = Field(None, description="요청자 식별자")
    department_id: UUID | None = Field(None, description="요청 부서")
    line_id: UUID | None = Field(None, description="사용된 결재선")
    current_step: int | None = Field(default=1, description="현재 결재 단계")
    subject: str | None = Field(None, max_length=500, description="제목")
    content: str | None = Field(None, description="내용")
    status: str | None = Field(max_length=20, default='PENDING', description="결재 상태 (PENDING/IN_PROGRESS/APPROVED/REJECTED/CANCELLED)")
    completed_at: datetime | None = Field(None, description="완료 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalRequestsResponse(ApprovalRequestsBase):
    """Schema for ApprovalRequests response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ApprovalRequestsListResponse(BaseModel):
    """Schema for paginated ApprovalRequests list response"""

    items: list[ApprovalRequestsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ApprovalRequestsBase",
    "ApprovalRequestsCreate",
    "ApprovalRequestsUpdate",
    "ApprovalRequestsResponse",
    "ApprovalRequestsListResponse",
]
