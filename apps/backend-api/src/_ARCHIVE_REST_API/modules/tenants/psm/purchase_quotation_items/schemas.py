"""
구매 견적 품목 관리 테이블

Pydantic schemas for PurchaseQuotationItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseQuotationItemsBase(BaseModel):
    """Base schema for PurchaseQuotationItems"""
    model_config = ConfigDict(from_attributes=True)

    quotation_id: UUID = Field(description="견적 헤더 식별자")
    line_no: int = Field(description="라인 번호 (1부터 시작)")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int = Field(description="견적 수량")
    unit_price: Decimal = Field(description="단가")
    total_amount: Decimal = Field(description="총 금액 (qty × unit_price)")
    lead_time_days: int | None = Field(None, description="납기 (일)")
    min_order_qty: int | None = Field(None, description="최소 주문 수량")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseQuotationItemsCreate(PurchaseQuotationItemsBase):
    """Schema for creating PurchaseQuotationItems"""

    # Exclude auto-generated fields
    pass


class PurchaseQuotationItemsUpdate(BaseModel):
    """Schema for updating PurchaseQuotationItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    quotation_id: UUID | None = Field(None, description="견적 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호 (1부터 시작)")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int | None = Field(None, description="견적 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    total_amount: Decimal | None = Field(None, description="총 금액 (qty × unit_price)")
    lead_time_days: int | None = Field(None, description="납기 (일)")
    min_order_qty: int | None = Field(None, description="최소 주문 수량")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseQuotationItemsResponse(PurchaseQuotationItemsBase):
    """Schema for PurchaseQuotationItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseQuotationItemsListResponse(BaseModel):
    """Schema for paginated PurchaseQuotationItems list response"""

    items: list[PurchaseQuotationItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseQuotationItemsBase",
    "PurchaseQuotationItemsCreate",
    "PurchaseQuotationItemsUpdate",
    "PurchaseQuotationItemsResponse",
    "PurchaseQuotationItemsListResponse",
]
