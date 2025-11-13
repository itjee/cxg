"""
구매 가격 계약 관리 테이블

Pydantic schemas for PurchasePriceAgreements model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchasePriceAgreementsBase(BaseModel):
    """Base schema for PurchasePriceAgreements"""
    model_config = ConfigDict(from_attributes=True)

    agreement_no: str = Field(max_length=50, description="계약 번호")
    agreement_date: date = Field(description="계약 일자")
    supplier_id: UUID = Field(description="공급업체 식별자")
    product_id: UUID = Field(description="제품 식별자")
    unit_price: Decimal = Field(description="계약 단가")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 코드 (KRW, USD 등)")
    min_order_qty: int | None = Field(None, description="최소 주문 수량")
    valid_from: date = Field(description="계약 유효 시작일")
    valid_to: date = Field(description="계약 유효 종료일")
    status: str = Field(max_length=20, default='ACTIVE', description="계약 상태 (DRAFT/ACTIVE/EXPIRED/TERMINATED)")
    payment_terms: str | None = Field(None, description="결제 조건")
    delivery_terms: str | None = Field(None, description="배송 조건")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchasePriceAgreementsCreate(PurchasePriceAgreementsBase):
    """Schema for creating PurchasePriceAgreements"""

    # Exclude auto-generated fields
    pass


class PurchasePriceAgreementsUpdate(BaseModel):
    """Schema for updating PurchasePriceAgreements (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    agreement_no: str | None = Field(None, max_length=50, description="계약 번호")
    agreement_date: date | None = Field(None, description="계약 일자")
    supplier_id: UUID | None = Field(None, description="공급업체 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    unit_price: Decimal | None = Field(None, description="계약 단가")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 코드 (KRW, USD 등)")
    min_order_qty: int | None = Field(None, description="최소 주문 수량")
    valid_from: date | None = Field(None, description="계약 유효 시작일")
    valid_to: date | None = Field(None, description="계약 유효 종료일")
    status: str | None = Field(max_length=20, default='ACTIVE', description="계약 상태 (DRAFT/ACTIVE/EXPIRED/TERMINATED)")
    payment_terms: str | None = Field(None, description="결제 조건")
    delivery_terms: str | None = Field(None, description="배송 조건")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchasePriceAgreementsResponse(PurchasePriceAgreementsBase):
    """Schema for PurchasePriceAgreements response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchasePriceAgreementsListResponse(BaseModel):
    """Schema for paginated PurchasePriceAgreements list response"""

    items: list[PurchasePriceAgreementsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchasePriceAgreementsBase",
    "PurchasePriceAgreementsCreate",
    "PurchasePriceAgreementsUpdate",
    "PurchasePriceAgreementsResponse",
    "PurchasePriceAgreementsListResponse",
]
