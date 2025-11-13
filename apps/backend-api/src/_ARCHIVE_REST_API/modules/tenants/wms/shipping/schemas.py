"""
출고 헤더 정보 관리 테이블

Pydantic schemas for Shipping model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ShippingBase(BaseModel):
    """Base schema for Shipping"""
    model_config = ConfigDict(from_attributes=True)

    gi_code: str = Field(max_length=50)
    doc_date: date = Field(description="전표 일자")
    so_id: UUID | None = None
    customer_id: UUID | None = None
    warehouse_id: UUID
    picker_id: UUID | None = None
    total_qty: int | None = Field(default=0)
    status: str = Field(max_length=20, default='DRAFT')
    is_deleted: bool = Field(default=False)


class ShippingCreate(ShippingBase):
    """Schema for creating Shipping"""

    # Exclude auto-generated fields
    pass


class ShippingUpdate(BaseModel):
    """Schema for updating Shipping (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    gi_code: str | None = Field(None, max_length=50)
    doc_date: date | None = Field(None, description="전표 일자")
    so_id: UUID | None = None
    customer_id: UUID | None = None
    warehouse_id: UUID | None = None
    picker_id: UUID | None = None
    total_qty: int | None = Field(default=0)
    status: str | None = Field(max_length=20, default='DRAFT')
    is_deleted: bool | None = Field(default=False)


class ShippingResponse(ShippingBase):
    """Schema for Shipping response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ShippingListResponse(BaseModel):
    """Schema for paginated Shipping list response"""

    items: list[ShippingResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ShippingBase",
    "ShippingCreate",
    "ShippingUpdate",
    "ShippingResponse",
    "ShippingListResponse",
]
