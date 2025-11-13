"""
판매 견적서 품목 관리 테이블

Pydantic schemas for QuotationItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class QuotationItemsBase(BaseModel):
    """Base schema for QuotationItems"""
    model_config = ConfigDict(from_attributes=True)

    quote_id: UUID = Field(description="견적서 헤더 식별자")
    line_no: int = Field(description="라인 번호")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int = Field(description="견적 수량")
    unit_price: Decimal = Field(description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal = Field(description="총 금액 (수량 × 단가 × (1 - 할인율))")


class QuotationItemsCreate(QuotationItemsBase):
    """Schema for creating QuotationItems"""

    # Exclude auto-generated fields
    pass


class QuotationItemsUpdate(BaseModel):
    """Schema for updating QuotationItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    quote_id: UUID | None = Field(None, description="견적서 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int | None = Field(None, description="견적 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal | None = Field(None, description="총 금액 (수량 × 단가 × (1 - 할인율))")


class QuotationItemsResponse(QuotationItemsBase):
    """Schema for QuotationItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class QuotationItemsListResponse(BaseModel):
    """Schema for paginated QuotationItems list response"""

    items: list[QuotationItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "QuotationItemsBase",
    "QuotationItemsCreate",
    "QuotationItemsUpdate",
    "QuotationItemsResponse",
    "QuotationItemsListResponse",
]
