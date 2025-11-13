"""
출고 라인 (상세) 정보 관리 테이블

Pydantic schemas for ShippingItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ShippingItemsBase(BaseModel):
    """Base schema for ShippingItems"""
    model_config = ConfigDict(from_attributes=True)

    gi_id: UUID
    line_no: int
    so_line_id: UUID | None = None
    item_id: UUID
    location_id: UUID | None = None
    lot_number: str | None = None
    serial_number: str | None = None
    requested_qty: int | None = Field(default=0)
    picked_qty: int


class ShippingItemsCreate(ShippingItemsBase):
    """Schema for creating ShippingItems"""

    # Exclude auto-generated fields
    pass


class ShippingItemsUpdate(BaseModel):
    """Schema for updating ShippingItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    gi_id: UUID | None = None
    line_no: int | None = None
    so_line_id: UUID | None = None
    item_id: UUID | None = None
    location_id: UUID | None = None
    lot_number: str | None = None
    serial_number: str | None = None
    requested_qty: int | None = Field(default=0)
    picked_qty: int | None = None


class ShippingItemsResponse(ShippingItemsBase):
    """Schema for ShippingItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ShippingItemsListResponse(BaseModel):
    """Schema for paginated ShippingItems list response"""

    items: list[ShippingItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ShippingItemsBase",
    "ShippingItemsCreate",
    "ShippingItemsUpdate",
    "ShippingItemsResponse",
    "ShippingItemsListResponse",
]
