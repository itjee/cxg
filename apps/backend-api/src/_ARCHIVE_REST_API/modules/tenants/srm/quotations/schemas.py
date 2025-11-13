"""
판매 견적서 헤더 관리 테이블

Pydantic schemas for Quotations model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class QuotationsBase(BaseModel):
    """Base schema for Quotations"""
    model_config = ConfigDict(from_attributes=True)

    quote_code: str = Field(max_length=50, description="견적서 코드 (견적번호)")
    customer_id: UUID = Field(description="고객 식별자")
    doc_date: date = Field(description="전표 일자")
    valid_until: date | None = Field(None, description="유효기간 만료일")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class QuotationsCreate(QuotationsBase):
    """Schema for creating Quotations"""

    # Exclude auto-generated fields
    pass


class QuotationsUpdate(BaseModel):
    """Schema for updating Quotations (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    quote_code: str | None = Field(None, max_length=50, description="견적서 코드 (견적번호)")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    doc_date: date | None = Field(None, description="전표 일자")
    valid_until: date | None = Field(None, description="유효기간 만료일")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class QuotationsResponse(QuotationsBase):
    """Schema for Quotations response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class QuotationsListResponse(BaseModel):
    """Schema for paginated Quotations list response"""

    items: list[QuotationsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "QuotationsBase",
    "QuotationsCreate",
    "QuotationsUpdate",
    "QuotationsResponse",
    "QuotationsListResponse",
]
