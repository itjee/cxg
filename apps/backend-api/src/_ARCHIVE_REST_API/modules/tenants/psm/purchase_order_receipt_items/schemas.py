"""
구매발주 입고 품목 관리 테이블

Pydantic schemas for PurchaseOrderReceiptItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseOrderReceiptItemsBase(BaseModel):
    """Base schema for PurchaseOrderReceiptItems"""
    model_config = ConfigDict(from_attributes=True)

    receipt_id: UUID = Field(description="입고 헤더 식별자")
    line_no: int = Field(description="라인 번호 (1부터 시작)")
    po_item_id: UUID = Field(description="구매발주 품목 식별자")
    product_id: UUID = Field(description="제품 식별자")
    ordered_qty: int = Field(description="발주 수량")
    received_qty: int = Field(description="입고 수량")
    accepted_qty: int | None = Field(default=0, description="합격 수량 (검수 통과)")
    rejected_qty: int | None = Field(default=0, description="불합격 수량 (검수 불통과)")
    inspection_status: str | None = Field(max_length=20, default='PENDING', description="검수 상태 (PENDING/IN_PROGRESS/PASS/PARTIAL/FAIL)")
    rejection_reason: str | None = Field(None, description="불합격 사유")
    location_id: UUID | None = Field(None, description="입고 로케이션 식별자")
    lot_no: str | None = Field(None, max_length=100, description="LOT 번호")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderReceiptItemsCreate(PurchaseOrderReceiptItemsBase):
    """Schema for creating PurchaseOrderReceiptItems"""

    # Exclude auto-generated fields
    pass


class PurchaseOrderReceiptItemsUpdate(BaseModel):
    """Schema for updating PurchaseOrderReceiptItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    receipt_id: UUID | None = Field(None, description="입고 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호 (1부터 시작)")
    po_item_id: UUID | None = Field(None, description="구매발주 품목 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    ordered_qty: int | None = Field(None, description="발주 수량")
    received_qty: int | None = Field(None, description="입고 수량")
    accepted_qty: int | None = Field(default=0, description="합격 수량 (검수 통과)")
    rejected_qty: int | None = Field(default=0, description="불합격 수량 (검수 불통과)")
    inspection_status: str | None = Field(max_length=20, default='PENDING', description="검수 상태 (PENDING/IN_PROGRESS/PASS/PARTIAL/FAIL)")
    rejection_reason: str | None = Field(None, description="불합격 사유")
    location_id: UUID | None = Field(None, description="입고 로케이션 식별자")
    lot_no: str | None = Field(None, max_length=100, description="LOT 번호")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderReceiptItemsResponse(PurchaseOrderReceiptItemsBase):
    """Schema for PurchaseOrderReceiptItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseOrderReceiptItemsListResponse(BaseModel):
    """Schema for paginated PurchaseOrderReceiptItems list response"""

    items: list[PurchaseOrderReceiptItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseOrderReceiptItemsBase",
    "PurchaseOrderReceiptItemsCreate",
    "PurchaseOrderReceiptItemsUpdate",
    "PurchaseOrderReceiptItemsResponse",
    "PurchaseOrderReceiptItemsListResponse",
]
