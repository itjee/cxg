"""
구매발주 품목 관리 테이블

Pydantic schemas for PurchaseOrderItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseOrderItemsBase(BaseModel):
    """Base schema for PurchaseOrderItems"""
    model_config = ConfigDict(from_attributes=True)

    po_id: UUID = Field(description="구매발주 헤더 식별자")
    line_no: int = Field(description="라인 번호 (1부터 시작)")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int = Field(description="발주 수량")
    unit_price: Decimal = Field(description="단가")
    total_amount: Decimal = Field(description="총 금액 (qty × unit_price)")
    received_qty: int | None = Field(default=0, description="입고 완료 수량 (누적)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderItemsCreate(PurchaseOrderItemsBase):
    """Schema for creating PurchaseOrderItems"""

    # Exclude auto-generated fields
    pass


class PurchaseOrderItemsUpdate(BaseModel):
    """Schema for updating PurchaseOrderItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    po_id: UUID | None = Field(None, description="구매발주 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호 (1부터 시작)")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int | None = Field(None, description="발주 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    total_amount: Decimal | None = Field(None, description="총 금액 (qty × unit_price)")
    received_qty: int | None = Field(default=0, description="입고 완료 수량 (누적)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderItemsResponse(PurchaseOrderItemsBase):
    """Schema for PurchaseOrderItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseOrderItemsListResponse(BaseModel):
    """Schema for paginated PurchaseOrderItems list response"""

    items: list[PurchaseOrderItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseOrderItemsBase",
    "PurchaseOrderItemsCreate",
    "PurchaseOrderItemsUpdate",
    "PurchaseOrderItemsResponse",
    "PurchaseOrderItemsListResponse",
]
