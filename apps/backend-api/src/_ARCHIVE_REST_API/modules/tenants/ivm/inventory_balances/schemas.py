"""
재고 현황 관리 테이블

Pydantic schemas for InventoryBalances model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryBalancesBase(BaseModel):
    """Base schema for InventoryBalances"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID = Field(description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    on_hand_qty: int | None = Field(default=0, description="현재고 수량")
    available_qty: int | None = Field(default=0, description="가용 수량 (현재고 - 예약)")
    reserved_qty: int | None = Field(default=0, description="예약 수량")
    avg_cost: Decimal | None = Field(default=0, description="평균 단가")
    last_movement_date: datetime | None = Field(None, description="최종 이동 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryBalancesCreate(InventoryBalancesBase):
    """Schema for creating InventoryBalances"""

    # Exclude auto-generated fields
    pass


class InventoryBalancesUpdate(BaseModel):
    """Schema for updating InventoryBalances (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    on_hand_qty: int | None = Field(default=0, description="현재고 수량")
    available_qty: int | None = Field(default=0, description="가용 수량 (현재고 - 예약)")
    reserved_qty: int | None = Field(default=0, description="예약 수량")
    avg_cost: Decimal | None = Field(default=0, description="평균 단가")
    last_movement_date: datetime | None = Field(None, description="최종 이동 일시")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryBalancesResponse(InventoryBalancesBase):
    """Schema for InventoryBalances response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryBalancesListResponse(BaseModel):
    """Schema for paginated InventoryBalances list response"""

    items: list[InventoryBalancesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryBalancesBase",
    "InventoryBalancesCreate",
    "InventoryBalancesUpdate",
    "InventoryBalancesResponse",
    "InventoryBalancesListResponse",
]
