"""
구매요청 품목 관리 테이블

Pydantic schemas for PurchaseRequisitionItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseRequisitionItemsBase(BaseModel):
    """Base schema for PurchaseRequisitionItems"""
    model_config = ConfigDict(from_attributes=True)

    pr_id: UUID = Field(description="구매요청 헤더 식별자")
    line_no: int = Field(description="라인 번호 (1부터 시작)")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int = Field(description="요청 수량")
    unit_price: Decimal | None = Field(default=0, description="단가")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (qty × unit_price)")
    required_date: date | None = Field(None, description="필요 일자 (납품 요청일)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseRequisitionItemsCreate(PurchaseRequisitionItemsBase):
    """Schema for creating PurchaseRequisitionItems"""

    # Exclude auto-generated fields
    pass


class PurchaseRequisitionItemsUpdate(BaseModel):
    """Schema for updating PurchaseRequisitionItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    pr_id: UUID | None = Field(None, description="구매요청 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호 (1부터 시작)")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명 (특이사항 등)")
    qty: int | None = Field(None, description="요청 수량")
    unit_price: Decimal | None = Field(default=0, description="단가")
    total_amount: Decimal | None = Field(default=0, description="총 금액 (qty × unit_price)")
    required_date: date | None = Field(None, description="필요 일자 (납품 요청일)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseRequisitionItemsResponse(PurchaseRequisitionItemsBase):
    """Schema for PurchaseRequisitionItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseRequisitionItemsListResponse(BaseModel):
    """Schema for paginated PurchaseRequisitionItems list response"""

    items: list[PurchaseRequisitionItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseRequisitionItemsBase",
    "PurchaseRequisitionItemsCreate",
    "PurchaseRequisitionItemsUpdate",
    "PurchaseRequisitionItemsResponse",
    "PurchaseRequisitionItemsListResponse",
]
