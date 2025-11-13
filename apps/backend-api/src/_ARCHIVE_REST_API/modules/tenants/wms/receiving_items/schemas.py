"""
입고 라인 (상세) 정보 관리 테이블

Pydantic schemas for ReceivingItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ReceivingItemsBase(BaseModel):
    """Base schema for ReceivingItems"""
    model_config = ConfigDict(from_attributes=True)

    gr_id: UUID
    line_no: int
    po_line_id: UUID | None = None
    item_id: UUID
    location_id: UUID | None = None
    lot_number: str | None = None
    serial_number: str | None = None
    ordered_qty: int | None = Field(default=0)
    received_qty: int
    rejected_qty: int | None = Field(default=0)
    unit_cost: Decimal | None = Field(default=0)


class ReceivingItemsCreate(ReceivingItemsBase):
    """Schema for creating ReceivingItems"""

    # Exclude auto-generated fields
    pass


class ReceivingItemsUpdate(BaseModel):
    """Schema for updating ReceivingItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    gr_id: UUID | None = None
    line_no: int | None = None
    po_line_id: UUID | None = None
    item_id: UUID | None = None
    location_id: UUID | None = None
    lot_number: str | None = None
    serial_number: str | None = None
    ordered_qty: int | None = Field(default=0)
    received_qty: int | None = None
    rejected_qty: int | None = Field(default=0)
    unit_cost: Decimal | None = Field(default=0)


class ReceivingItemsResponse(ReceivingItemsBase):
    """Schema for ReceivingItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ReceivingItemsListResponse(BaseModel):
    """Schema for paginated ReceivingItems list response"""

    items: list[ReceivingItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ReceivingItemsBase",
    "ReceivingItemsCreate",
    "ReceivingItemsUpdate",
    "ReceivingItemsResponse",
    "ReceivingItemsListResponse",
]
