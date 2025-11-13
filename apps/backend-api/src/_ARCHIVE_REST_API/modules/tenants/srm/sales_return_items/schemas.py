"""
판매 반품 품목 관리 테이블

Pydantic schemas for SalesReturnItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesReturnItemsBase(BaseModel):
    """Base schema for SalesReturnItems"""
    model_config = ConfigDict(from_attributes=True)

    return_id: UUID = Field(description="반품 헤더 식별자")
    line_no: int = Field(description="라인 번호")
    delivery_item_id: UUID | None = Field(None, description="출고 품목 식별자")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int = Field(description="반품 수량")
    unit_price: Decimal = Field(description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal = Field(description="총 금액 (수량 × 단가 × (1 - 할인율))")
    reason_code: str | None = Field(None, max_length=20, description="반품 사유 코드")
    reason_desc: str | None = Field(None, description="반품 사유 설명")


class SalesReturnItemsCreate(SalesReturnItemsBase):
    """Schema for creating SalesReturnItems"""

    # Exclude auto-generated fields
    pass


class SalesReturnItemsUpdate(BaseModel):
    """Schema for updating SalesReturnItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    return_id: UUID | None = Field(None, description="반품 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호")
    delivery_item_id: UUID | None = Field(None, description="출고 품목 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int | None = Field(None, description="반품 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal | None = Field(None, description="총 금액 (수량 × 단가 × (1 - 할인율))")
    reason_code: str | None = Field(None, max_length=20, description="반품 사유 코드")
    reason_desc: str | None = Field(None, description="반품 사유 설명")


class SalesReturnItemsResponse(SalesReturnItemsBase):
    """Schema for SalesReturnItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesReturnItemsListResponse(BaseModel):
    """Schema for paginated SalesReturnItems list response"""

    items: list[SalesReturnItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesReturnItemsBase",
    "SalesReturnItemsCreate",
    "SalesReturnItemsUpdate",
    "SalesReturnItemsResponse",
    "SalesReturnItemsListResponse",
]
