"""
결재선 정의 테이블

Pydantic schemas for ApprovalLines model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ApprovalLinesBase(BaseModel):
    """Base schema for ApprovalLines"""
    model_config = ConfigDict(from_attributes=True)

    line_code: str = Field(max_length=50, description="결재선 코드")
    line_name: str = Field(max_length=200, description="결재선명")
    document_type: str = Field(max_length=50, description="문서 유형 (PO/SO/LEAVE/EXPENSE 등)")
    department_id: UUID | None = Field(None, description="적용 부서 (NULL이면 전체)")
    description: str | None = Field(None, description="설명")
    is_active: bool | None = Field(default=True, description="활성 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ApprovalLinesCreate(ApprovalLinesBase):
    """Schema for creating ApprovalLines"""

    # Exclude auto-generated fields
    pass


class ApprovalLinesUpdate(BaseModel):
    """Schema for updating ApprovalLines (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    line_code: str | None = Field(None, max_length=50, description="결재선 코드")
    line_name: str | None = Field(None, max_length=200, description="결재선명")
    document_type: str | None = Field(None, max_length=50, description="문서 유형 (PO/SO/LEAVE/EXPENSE 등)")
    department_id: UUID | None = Field(None, description="적용 부서 (NULL이면 전체)")
    description: str | None = Field(None, description="설명")
    is_active: bool | None = Field(default=True, description="활성 여부")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ApprovalLinesResponse(ApprovalLinesBase):
    """Schema for ApprovalLines response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ApprovalLinesListResponse(BaseModel):
    """Schema for paginated ApprovalLines list response"""

    items: list[ApprovalLinesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ApprovalLinesBase",
    "ApprovalLinesCreate",
    "ApprovalLinesUpdate",
    "ApprovalLinesResponse",
    "ApprovalLinesListResponse",
]
