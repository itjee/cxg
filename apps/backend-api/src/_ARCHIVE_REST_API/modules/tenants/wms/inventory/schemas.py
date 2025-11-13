"""
재고 현황 관리 테이블 (실시간 재고)

Pydantic schemas for Inventory model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryBase(BaseModel):
    """Base schema for Inventory"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID = Field(description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    quantity_on_hand: Decimal | None = Field(default=0, description="재고 수량")
    quantity_allocated: Decimal | None = Field(default=0, description="할당 수량 (예약)")
    quantity_available: Decimal | None = Field(None, description="가용 수량 (재고 - 할당)")
    quality_status: str | None = Field(max_length=20, default='GOOD', description="품질 상태 (GOOD/DAMAGED/QUARANTINE/HOLD/RETURNED)")
    manufactured_date: date | None = Field(None, description="제조 일자")
    expiry_date: date | None = Field(None, description="유효 기한")
    received_date: date | None = Field(None, description="입고 일자")
    unit_cost: Decimal | None = Field(None, description="단가")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/LOCKED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class InventoryCreate(InventoryBase):
    """Schema for creating Inventory"""

    # Exclude auto-generated fields
    pass


class InventoryUpdate(BaseModel):
    """Schema for updating Inventory (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    quantity_on_hand: Decimal | None = Field(default=0, description="재고 수량")
    quantity_allocated: Decimal | None = Field(default=0, description="할당 수량 (예약)")
    quantity_available: Decimal | None = Field(None, description="가용 수량 (재고 - 할당)")
    quality_status: str | None = Field(max_length=20, default='GOOD', description="품질 상태 (GOOD/DAMAGED/QUARANTINE/HOLD/RETURNED)")
    manufactured_date: date | None = Field(None, description="제조 일자")
    expiry_date: date | None = Field(None, description="유효 기한")
    received_date: date | None = Field(None, description="입고 일자")
    unit_cost: Decimal | None = Field(None, description="단가")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/LOCKED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class InventoryResponse(InventoryBase):
    """Schema for Inventory response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryListResponse(BaseModel):
    """Schema for paginated Inventory list response"""

    items: list[InventoryResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryBase",
    "InventoryCreate",
    "InventoryUpdate",
    "InventoryResponse",
    "InventoryListResponse",
]
