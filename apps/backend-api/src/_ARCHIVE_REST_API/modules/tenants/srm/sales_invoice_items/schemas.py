"""
판매 송장/세금계산서 품목 관리 테이블

Pydantic schemas for SalesInvoiceItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesInvoiceItemsBase(BaseModel):
    """Base schema for SalesInvoiceItems"""
    model_config = ConfigDict(from_attributes=True)

    invoice_id: UUID = Field(description="송장 헤더 식별자")
    line_no: int = Field(description="라인 번호")
    delivery_item_id: UUID | None = Field(None, description="출고 품목 식별자")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int = Field(description="청구 수량")
    unit_price: Decimal = Field(description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    subtotal: Decimal = Field(description="공급가액 (수량 × 단가 × (1 - 할인율))")
    tax_rate: Decimal | None = Field(default=10, description="세율 (%)")
    tax_amount: Decimal | None = Field(default=0, description="세액 (공급가액 × 세율)")
    total_amount: Decimal = Field(description="합계 금액 (공급가액 + 세액)")


class SalesInvoiceItemsCreate(SalesInvoiceItemsBase):
    """Schema for creating SalesInvoiceItems"""

    # Exclude auto-generated fields
    pass


class SalesInvoiceItemsUpdate(BaseModel):
    """Schema for updating SalesInvoiceItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    invoice_id: UUID | None = Field(None, description="송장 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호")
    delivery_item_id: UUID | None = Field(None, description="출고 품목 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int | None = Field(None, description="청구 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    subtotal: Decimal | None = Field(None, description="공급가액 (수량 × 단가 × (1 - 할인율))")
    tax_rate: Decimal | None = Field(default=10, description="세율 (%)")
    tax_amount: Decimal | None = Field(default=0, description="세액 (공급가액 × 세율)")
    total_amount: Decimal | None = Field(None, description="합계 금액 (공급가액 + 세액)")


class SalesInvoiceItemsResponse(SalesInvoiceItemsBase):
    """Schema for SalesInvoiceItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesInvoiceItemsListResponse(BaseModel):
    """Schema for paginated SalesInvoiceItems list response"""

    items: list[SalesInvoiceItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesInvoiceItemsBase",
    "SalesInvoiceItemsCreate",
    "SalesInvoiceItemsUpdate",
    "SalesInvoiceItemsResponse",
    "SalesInvoiceItemsListResponse",
]
