"""
구매요청-발주 연결 관리 테이블 (하나의 PR이 여러 PO로 분할 가능)

Pydantic schemas for PurchaseOrderPrLinks model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseOrderPrLinksBase(BaseModel):
    """Base schema for PurchaseOrderPrLinks"""
    model_config = ConfigDict(from_attributes=True)

    po_id: UUID = Field(description="구매발주 식별자")
    po_item_id: UUID = Field(description="구매발주 품목 식별자")
    pr_id: UUID = Field(description="구매요청 식별자")
    pr_item_id: UUID = Field(description="구매요청 품목 식별자")
    qty: int = Field(description="연결된 수량 (PR 품목 수량 중 해당 PO에 포함된 수량)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderPrLinksCreate(PurchaseOrderPrLinksBase):
    """Schema for creating PurchaseOrderPrLinks"""

    # Exclude auto-generated fields
    pass


class PurchaseOrderPrLinksUpdate(BaseModel):
    """Schema for updating PurchaseOrderPrLinks (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    po_id: UUID | None = Field(None, description="구매발주 식별자")
    po_item_id: UUID | None = Field(None, description="구매발주 품목 식별자")
    pr_id: UUID | None = Field(None, description="구매요청 식별자")
    pr_item_id: UUID | None = Field(None, description="구매요청 품목 식별자")
    qty: int | None = Field(None, description="연결된 수량 (PR 품목 수량 중 해당 PO에 포함된 수량)")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderPrLinksResponse(PurchaseOrderPrLinksBase):
    """Schema for PurchaseOrderPrLinks response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseOrderPrLinksListResponse(BaseModel):
    """Schema for paginated PurchaseOrderPrLinks list response"""

    items: list[PurchaseOrderPrLinksResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseOrderPrLinksBase",
    "PurchaseOrderPrLinksCreate",
    "PurchaseOrderPrLinksUpdate",
    "PurchaseOrderPrLinksResponse",
    "PurchaseOrderPrLinksListResponse",
]
