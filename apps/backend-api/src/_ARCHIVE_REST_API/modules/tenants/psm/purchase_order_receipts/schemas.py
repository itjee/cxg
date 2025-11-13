"""
구매발주 입고 헤더 관리 테이블

Pydantic schemas for PurchaseOrderReceipts model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseOrderReceiptsBase(BaseModel):
    """Base schema for PurchaseOrderReceipts"""
    model_config = ConfigDict(from_attributes=True)

    receipt_no: str = Field(max_length=50, description="입고 번호")
    receipt_date: date = Field(description="입고 일자")
    po_id: UUID = Field(description="구매발주 식별자")
    warehouse_id: UUID = Field(description="입고 창고 식별자")
    location_id: UUID | None = Field(None, description="입고 로케이션 식별자")
    delivery_note_no: str | None = Field(None, max_length=50, description="배송 전표 번호")
    carrier: str | None = Field(None, max_length=100, description="배송 업체명")
    tracking_no: str | None = Field(None, max_length=100, description="송장 번호")
    status: str = Field(max_length=20, default='DRAFT', description="입고 상태 (DRAFT/IN_PROGRESS/INSPECTING/COMPLETED/REJECTED)")
    inspected_by: UUID | None = Field(None, description="검수자 UUID")
    inspected_at: datetime | None = Field(None, description="검수 일시")
    inspection_result: str | None = Field(None, max_length=20, description="검수 결과 (PASS/PARTIAL/FAIL)")
    inspection_notes: str | None = Field(None, description="검수 비고 (불량 사유 등)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderReceiptsCreate(PurchaseOrderReceiptsBase):
    """Schema for creating PurchaseOrderReceipts"""

    # Exclude auto-generated fields
    pass


class PurchaseOrderReceiptsUpdate(BaseModel):
    """Schema for updating PurchaseOrderReceipts (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    receipt_no: str | None = Field(None, max_length=50, description="입고 번호")
    receipt_date: date | None = Field(None, description="입고 일자")
    po_id: UUID | None = Field(None, description="구매발주 식별자")
    warehouse_id: UUID | None = Field(None, description="입고 창고 식별자")
    location_id: UUID | None = Field(None, description="입고 로케이션 식별자")
    delivery_note_no: str | None = Field(None, max_length=50, description="배송 전표 번호")
    carrier: str | None = Field(None, max_length=100, description="배송 업체명")
    tracking_no: str | None = Field(None, max_length=100, description="송장 번호")
    status: str | None = Field(max_length=20, default='DRAFT', description="입고 상태 (DRAFT/IN_PROGRESS/INSPECTING/COMPLETED/REJECTED)")
    inspected_by: UUID | None = Field(None, description="검수자 UUID")
    inspected_at: datetime | None = Field(None, description="검수 일시")
    inspection_result: str | None = Field(None, max_length=20, description="검수 결과 (PASS/PARTIAL/FAIL)")
    inspection_notes: str | None = Field(None, description="검수 비고 (불량 사유 등)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class PurchaseOrderReceiptsResponse(PurchaseOrderReceiptsBase):
    """Schema for PurchaseOrderReceipts response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseOrderReceiptsListResponse(BaseModel):
    """Schema for paginated PurchaseOrderReceipts list response"""

    items: list[PurchaseOrderReceiptsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseOrderReceiptsBase",
    "PurchaseOrderReceiptsCreate",
    "PurchaseOrderReceiptsUpdate",
    "PurchaseOrderReceiptsResponse",
    "PurchaseOrderReceiptsListResponse",
]
