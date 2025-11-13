"""
세금계산서 상세: 품목별 공급가액 및 세액

Pydantic schemas for TaxInvoiceLines model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class TaxInvoiceLinesBase(BaseModel):
    """Base schema for TaxInvoiceLines"""
    model_config = ConfigDict(from_attributes=True)

    tax_invoice_id: UUID = Field(description="세금계산서 ID")
    line_no: int = Field(description="라인 번호")
    product_code: str | None = Field(None, max_length=50, description="품목 코드")
    product_name: str = Field(max_length=200, description="품목명")
    product_spec: str | None = Field(None, max_length=200, description="규격")
    unit: str | None = Field(None, max_length=20, description="단위")
    quantity: Decimal = Field(default=0, description="수량")
    unit_price: Decimal = Field(default=0, description="단가")
    supply_amount: Decimal = Field(default=0, description="공급가액")
    tax_amount: Decimal = Field(default=0, description="세액")
    total_amount: Decimal = Field(default=0, description="합계금액")
    remark: str | None = Field(None, description="비고")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class TaxInvoiceLinesCreate(TaxInvoiceLinesBase):
    """Schema for creating TaxInvoiceLines"""

    # Exclude auto-generated fields
    pass


class TaxInvoiceLinesUpdate(BaseModel):
    """Schema for updating TaxInvoiceLines (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    tax_invoice_id: UUID | None = Field(None, description="세금계산서 ID")
    line_no: int | None = Field(None, description="라인 번호")
    product_code: str | None = Field(None, max_length=50, description="품목 코드")
    product_name: str | None = Field(None, max_length=200, description="품목명")
    product_spec: str | None = Field(None, max_length=200, description="규격")
    unit: str | None = Field(None, max_length=20, description="단위")
    quantity: Decimal | None = Field(default=0, description="수량")
    unit_price: Decimal | None = Field(default=0, description="단가")
    supply_amount: Decimal | None = Field(default=0, description="공급가액")
    tax_amount: Decimal | None = Field(default=0, description="세액")
    total_amount: Decimal | None = Field(default=0, description="합계금액")
    remark: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class TaxInvoiceLinesResponse(TaxInvoiceLinesBase):
    """Schema for TaxInvoiceLines response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class TaxInvoiceLinesListResponse(BaseModel):
    """Schema for paginated TaxInvoiceLines list response"""

    items: list[TaxInvoiceLinesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "TaxInvoiceLinesBase",
    "TaxInvoiceLinesCreate",
    "TaxInvoiceLinesUpdate",
    "TaxInvoiceLinesResponse",
    "TaxInvoiceLinesListResponse",
]
