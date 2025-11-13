"""
재고 이동 요청 관리 테이블

Pydantic schemas for InventoryTransfers model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryTransfersBase(BaseModel):
    """Base schema for InventoryTransfers"""
    model_config = ConfigDict(from_attributes=True)

    transfer_code: str = Field(description="이동 요청 코드")
    transfer_date: str = Field(description="이동 요청 일자")
    from_warehouse_id: str | None = Field(None, description="출발 창고 식별자")
    from_location_id: str | None = Field(None, description="출발 로케이션 식별자")
    to_warehouse_id: str = Field(description="도착 창고 식별자")
    to_location_id: str | None = Field(None, description="도착 로케이션 식별자")
    product_id: str = Field(description="제품 식별자")
    lot_number: str | None = Field(None, description="로트 번호")
    serial_number: str | None = Field(None, description="시리얼 번호")
    qty: str = Field(description="이동 수량")
    started_at: str | None = Field(None, description="이동 시작 일시")
    completed_at: str | None = Field(None, description="이동 완료 일시")
    reason: str | None = Field(None, description="이동 사유")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(default='PENDING', description="상태 (PENDING/IN_TRANSIT/COMPLETED/CANCELLED)")
    REFERENCES: str | None = None


class InventoryTransfersCreate(InventoryTransfersBase):
    """Schema for creating InventoryTransfers"""

    # Exclude auto-generated fields
    pass


class InventoryTransfersUpdate(BaseModel):
    """Schema for updating InventoryTransfers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    transfer_code: str | None = Field(None, description="이동 요청 코드")
    transfer_date: str | None = Field(None, description="이동 요청 일자")
    from_warehouse_id: str | None = Field(None, description="출발 창고 식별자")
    from_location_id: str | None = Field(None, description="출발 로케이션 식별자")
    to_warehouse_id: str | None = Field(None, description="도착 창고 식별자")
    to_location_id: str | None = Field(None, description="도착 로케이션 식별자")
    product_id: str | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, description="로트 번호")
    serial_number: str | None = Field(None, description="시리얼 번호")
    qty: str | None = Field(None, description="이동 수량")
    started_at: str | None = Field(None, description="이동 시작 일시")
    completed_at: str | None = Field(None, description="이동 완료 일시")
    reason: str | None = Field(None, description="이동 사유")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(default='PENDING', description="상태 (PENDING/IN_TRANSIT/COMPLETED/CANCELLED)")
    REFERENCES: str | None = None


class InventoryTransfersResponse(InventoryTransfersBase):
    """Schema for InventoryTransfers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryTransfersListResponse(BaseModel):
    """Schema for paginated InventoryTransfers list response"""

    items: list[InventoryTransfersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryTransfersBase",
    "InventoryTransfersCreate",
    "InventoryTransfersUpdate",
    "InventoryTransfersResponse",
    "InventoryTransfersListResponse",
]
