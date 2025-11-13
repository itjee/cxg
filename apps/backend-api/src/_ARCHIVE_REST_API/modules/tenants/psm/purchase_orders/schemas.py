"""
구매발주 헤더 관리 테이블

Pydantic schemas for PurchaseOrders model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseOrdersBase(BaseModel):
    """Base schema for PurchaseOrders"""
    model_config = ConfigDict(from_attributes=True)

    po_code: str = Field(max_length=50, description="구매발주 코드 (PO-YYYYMMDD-001)")
    vendor_id: UUID = Field(description="공급업체 식별자")
    doc_date: date = Field(description="전표 일자")
    delivery_date: date | None = Field(None, description="납품 희망일")
    warehouse_id: UUID | None = Field(None, description="입고 창고 식별자")
    payment_terms: str | None = Field(None, max_length=20, description="결제 조건 (COD/NET30/NET60/NET90 등)")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (모든 라인의 합계)")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217 - KRW/USD/JPY 등)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/APPROVED/ORDERED/RECEIVING/COMPLETED/CANCELLED)")
    approved_at: datetime | None = Field(None, description="승인 일시")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrdersCreate(PurchaseOrdersBase):
    """Schema for creating PurchaseOrders"""

    # Exclude auto-generated fields
    pass


class PurchaseOrdersUpdate(BaseModel):
    """Schema for updating PurchaseOrders (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    po_code: str | None = Field(None, max_length=50, description="구매발주 코드 (PO-YYYYMMDD-001)")
    vendor_id: UUID | None = Field(None, description="공급업체 식별자")
    doc_date: date | None = Field(None, description="전표 일자")
    delivery_date: date | None = Field(None, description="납품 희망일")
    warehouse_id: UUID | None = Field(None, description="입고 창고 식별자")
    payment_terms: str | None = Field(None, max_length=20, description="결제 조건 (COD/NET30/NET60/NET90 등)")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (모든 라인의 합계)")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217 - KRW/USD/JPY 등)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/APPROVED/ORDERED/RECEIVING/COMPLETED/CANCELLED)")
    approved_at: datetime | None = Field(None, description="승인 일시")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrdersResponse(PurchaseOrdersBase):
    """Schema for PurchaseOrders response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseOrdersListResponse(BaseModel):
    """Schema for paginated PurchaseOrders list response"""

    items: list[PurchaseOrdersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseOrdersBase",
    "PurchaseOrdersCreate",
    "PurchaseOrdersUpdate",
    "PurchaseOrdersResponse",
    "PurchaseOrdersListResponse",
]
