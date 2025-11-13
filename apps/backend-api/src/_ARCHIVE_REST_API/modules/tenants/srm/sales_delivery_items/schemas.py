"""
판매 출고/배송 품목 관리 테이블

Pydantic schemas for SalesDeliveryItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesDeliveryItemsBase(BaseModel):
    """Base schema for SalesDeliveryItems"""
    model_config = ConfigDict(from_attributes=True)

    delivery_id: UUID = Field(description="출고 헤더 식별자")
    line_no: int = Field(description="라인 번호")
    so_item_id: UUID = Field(description="판매주문 품목 식별자")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int = Field(description="출고 수량")


class SalesDeliveryItemsCreate(SalesDeliveryItemsBase):
    """Schema for creating SalesDeliveryItems"""

    # Exclude auto-generated fields
    pass


class SalesDeliveryItemsUpdate(BaseModel):
    """Schema for updating SalesDeliveryItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    delivery_id: UUID | None = Field(None, description="출고 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호")
    so_item_id: UUID | None = Field(None, description="판매주문 품목 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int | None = Field(None, description="출고 수량")


class SalesDeliveryItemsResponse(SalesDeliveryItemsBase):
    """Schema for SalesDeliveryItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesDeliveryItemsListResponse(BaseModel):
    """Schema for paginated SalesDeliveryItems list response"""

    items: list[SalesDeliveryItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesDeliveryItemsBase",
    "SalesDeliveryItemsCreate",
    "SalesDeliveryItemsUpdate",
    "SalesDeliveryItemsResponse",
    "SalesDeliveryItemsListResponse",
]
