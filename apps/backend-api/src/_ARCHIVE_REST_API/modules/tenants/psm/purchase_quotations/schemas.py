"""
구매 견적 헤더 관리 테이블

Pydantic schemas for PurchaseQuotations model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseQuotationsBase(BaseModel):
    """Base schema for PurchaseQuotations"""
    model_config = ConfigDict(from_attributes=True)

    quotation_no: str = Field(max_length=50, description="견적 번호 (업체 제공)")
    quotation_date: date = Field(description="견적 일자")
    pr_id: UUID | None = Field(None, description="구매요청 식별자 (견적 요청의 근거)")
    supplier_id: UUID = Field(description="공급업체 식별자")
    status: str = Field(max_length=20, default='DRAFT', description="견적 상태 (DRAFT/SUBMITTED/REVIEWED/SELECTED/REJECTED/EXPIRED)")
    valid_from: date = Field(description="견적 유효 시작일")
    valid_to: date = Field(description="견적 유효 종료일")
    total_amount: Decimal | None = Field(default=0, description="총 견적 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 코드 (KRW, USD 등)")
    delivery_terms: str | None = Field(None, description="배송 조건")
    payment_terms: str | None = Field(None, description="결제 조건")
    notes: str | None = Field(None, description="비고")
    is_selected: bool | None = Field(default=False, description="선택 여부 (채택된 견적)")
    selected_at: datetime | None = Field(None, description="선택 일시")
    selected_by: UUID | None = Field(None, description="선택자 UUID")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseQuotationsCreate(PurchaseQuotationsBase):
    """Schema for creating PurchaseQuotations"""

    # Exclude auto-generated fields
    pass


class PurchaseQuotationsUpdate(BaseModel):
    """Schema for updating PurchaseQuotations (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    quotation_no: str | None = Field(None, max_length=50, description="견적 번호 (업체 제공)")
    quotation_date: date | None = Field(None, description="견적 일자")
    pr_id: UUID | None = Field(None, description="구매요청 식별자 (견적 요청의 근거)")
    supplier_id: UUID | None = Field(None, description="공급업체 식별자")
    status: str | None = Field(max_length=20, default='DRAFT', description="견적 상태 (DRAFT/SUBMITTED/REVIEWED/SELECTED/REJECTED/EXPIRED)")
    valid_from: date | None = Field(None, description="견적 유효 시작일")
    valid_to: date | None = Field(None, description="견적 유효 종료일")
    total_amount: Decimal | None = Field(default=0, description="총 견적 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 코드 (KRW, USD 등)")
    delivery_terms: str | None = Field(None, description="배송 조건")
    payment_terms: str | None = Field(None, description="결제 조건")
    notes: str | None = Field(None, description="비고")
    is_selected: bool | None = Field(default=False, description="선택 여부 (채택된 견적)")
    selected_at: datetime | None = Field(None, description="선택 일시")
    selected_by: UUID | None = Field(None, description="선택자 UUID")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseQuotationsResponse(PurchaseQuotationsBase):
    """Schema for PurchaseQuotations response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseQuotationsListResponse(BaseModel):
    """Schema for paginated PurchaseQuotations list response"""

    items: list[PurchaseQuotationsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseQuotationsBase",
    "PurchaseQuotationsCreate",
    "PurchaseQuotationsUpdate",
    "PurchaseQuotationsResponse",
    "PurchaseQuotationsListResponse",
]
