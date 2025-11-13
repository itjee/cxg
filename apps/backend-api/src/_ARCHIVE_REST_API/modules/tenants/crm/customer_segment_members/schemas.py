"""
고객 세그먼트 회원 관리 테이블

Pydantic schemas for CustomerSegmentMembers model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CustomerSegmentMembersBase(BaseModel):
    """Base schema for CustomerSegmentMembers"""
    model_config = ConfigDict(from_attributes=True)

    segment_id: UUID = Field(description="세그먼트 ID")
    partner_id: UUID = Field(description="거래처 ID")
    assigned_date: date = Field(description="할당일")
    assigned_by: UUID | None = Field(None, description="할당자 UUID")
    assignment_type: str | None = Field(max_length=20, default='MANUAL', description="할당 유형 (MANUAL: 수동, AUTO: 자동, IMPORT: 가져오기)")
    is_active: bool | None = Field(default=True, description="활성 여부")
    notes: str | None = Field(None, description="비고")


class CustomerSegmentMembersCreate(CustomerSegmentMembersBase):
    """Schema for creating CustomerSegmentMembers"""

    # Exclude auto-generated fields
    pass


class CustomerSegmentMembersUpdate(BaseModel):
    """Schema for updating CustomerSegmentMembers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    segment_id: UUID | None = Field(None, description="세그먼트 ID")
    partner_id: UUID | None = Field(None, description="거래처 ID")
    assigned_date: date | None = Field(None, description="할당일")
    assigned_by: UUID | None = Field(None, description="할당자 UUID")
    assignment_type: str | None = Field(max_length=20, default='MANUAL', description="할당 유형 (MANUAL: 수동, AUTO: 자동, IMPORT: 가져오기)")
    is_active: bool | None = Field(default=True, description="활성 여부")
    notes: str | None = Field(None, description="비고")


class CustomerSegmentMembersResponse(CustomerSegmentMembersBase):
    """Schema for CustomerSegmentMembers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CustomerSegmentMembersListResponse(BaseModel):
    """Schema for paginated CustomerSegmentMembers list response"""

    items: list[CustomerSegmentMembersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CustomerSegmentMembersBase",
    "CustomerSegmentMembersCreate",
    "CustomerSegmentMembersUpdate",
    "CustomerSegmentMembersResponse",
    "CustomerSegmentMembersListResponse",
]
