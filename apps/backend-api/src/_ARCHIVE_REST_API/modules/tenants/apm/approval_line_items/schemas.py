"""
결재선 상세 테이블

Pydantic schemas for ApprovalLineItems model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ApprovalLineItemsBase(BaseModel):
    """Base schema for ApprovalLineItems"""
    model_config = ConfigDict(from_attributes=True)

    line_id: UUID = Field(description="결재선 식별자")
    step_no: int = Field(description="결재 단계 번호")
    approver_id: UUID = Field(description="결재자 식별자")
    approver_type: str | None = Field(max_length=20, default='EMPLOYEE', description="결재자 유형 (EMPLOYEE/POSITION/DEPARTMENT)")
    is_required: bool | None = Field(default=True, description="필수 결재 여부")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalLineItemsCreate(ApprovalLineItemsBase):
    """Schema for creating ApprovalLineItems"""

    # Exclude auto-generated fields
    pass


class ApprovalLineItemsUpdate(BaseModel):
    """Schema for updating ApprovalLineItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    line_id: UUID | None = Field(None, description="결재선 식별자")
    step_no: int | None = Field(None, description="결재 단계 번호")
    approver_id: UUID | None = Field(None, description="결재자 식별자")
    approver_type: str | None = Field(max_length=20, default='EMPLOYEE', description="결재자 유형 (EMPLOYEE/POSITION/DEPARTMENT)")
    is_required: bool | None = Field(default=True, description="필수 결재 여부")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalLineItemsResponse(ApprovalLineItemsBase):
    """Schema for ApprovalLineItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ApprovalLineItemsListResponse(BaseModel):
    """Schema for paginated ApprovalLineItems list response"""

    items: list[ApprovalLineItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ApprovalLineItemsBase",
    "ApprovalLineItemsCreate",
    "ApprovalLineItemsUpdate",
    "ApprovalLineItemsResponse",
    "ApprovalLineItemsListResponse",
]
