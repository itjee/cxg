"""
입고 헤더 정보 관리 테이블

Pydantic schemas for Receiving model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ReceivingBase(BaseModel):
    """Base schema for Receiving"""
    model_config = ConfigDict(from_attributes=True)

    gr_code: str = Field(max_length=50)
    doc_date: date = Field(description="전표 일자")
    po_id: UUID | None = None
    vendor_id: UUID | None = None
    warehouse_id: UUID
    receiver_id: UUID | None = None
    total_qty: int | None = Field(default=0)
    status: str = Field(max_length=20, default='DRAFT')
    is_deleted: bool = Field(default=False)


class ReceivingCreate(ReceivingBase):
    """Schema for creating Receiving"""

    # Exclude auto-generated fields
    pass


class ReceivingUpdate(BaseModel):
    """Schema for updating Receiving (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    gr_code: str | None = Field(None, max_length=50)
    doc_date: date | None = Field(None, description="전표 일자")
    po_id: UUID | None = None
    vendor_id: UUID | None = None
    warehouse_id: UUID | None = None
    receiver_id: UUID | None = None
    total_qty: int | None = Field(default=0)
    status: str | None = Field(max_length=20, default='DRAFT')
    is_deleted: bool | None = Field(default=False)


class ReceivingResponse(ReceivingBase):
    """Schema for Receiving response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ReceivingListResponse(BaseModel):
    """Schema for paginated Receiving list response"""

    items: list[ReceivingResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ReceivingBase",
    "ReceivingCreate",
    "ReceivingUpdate",
    "ReceivingResponse",
    "ReceivingListResponse",
]
