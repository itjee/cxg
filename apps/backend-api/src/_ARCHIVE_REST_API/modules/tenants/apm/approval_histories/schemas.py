"""
결재 이력 테이블

Pydantic schemas for ApprovalHistories model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ApprovalHistoriesBase(BaseModel):
    """Base schema for ApprovalHistories"""
    model_config = ConfigDict(from_attributes=True)

    request_id: UUID = Field(description="결재 요청 식별자")
    step_no: int = Field(description="결재 단계")
    approver_id: UUID = Field(description="결재자 식별자")
    action: str = Field(max_length=20, description="결재 행동 (APPROVED/REJECTED/RETURNED/DELEGATED)")
    comment: str | None = Field(None, description="의견")
    approved_at: datetime | None = Field(None, description="결재 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalHistoriesCreate(ApprovalHistoriesBase):
    """Schema for creating ApprovalHistories"""

    # Exclude auto-generated fields
    pass


class ApprovalHistoriesUpdate(BaseModel):
    """Schema for updating ApprovalHistories (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    request_id: UUID | None = Field(None, description="결재 요청 식별자")
    step_no: int | None = Field(None, description="결재 단계")
    approver_id: UUID | None = Field(None, description="결재자 식별자")
    action: str | None = Field(None, max_length=20, description="결재 행동 (APPROVED/REJECTED/RETURNED/DELEGATED)")
    comment: str | None = Field(None, description="의견")
    approved_at: datetime | None = Field(None, description="결재 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class ApprovalHistoriesResponse(ApprovalHistoriesBase):
    """Schema for ApprovalHistories response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ApprovalHistoriesListResponse(BaseModel):
    """Schema for paginated ApprovalHistories list response"""

    items: list[ApprovalHistoriesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ApprovalHistoriesBase",
    "ApprovalHistoriesCreate",
    "ApprovalHistoriesUpdate",
    "ApprovalHistoriesResponse",
    "ApprovalHistoriesListResponse",
]
