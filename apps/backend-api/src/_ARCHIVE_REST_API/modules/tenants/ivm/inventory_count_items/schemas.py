"""
재고 실사 상세 항목 테이블

Pydantic schemas for InventoryCountItems model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryCountItemsBase(BaseModel):
    """Base schema for InventoryCountItems"""
    model_config = ConfigDict(from_attributes=True)

    count_id: str = Field(description="실사 식별자")
    warehouse_id: str = Field(description="창고 식별자")
    location_id: str | None = Field(None, description="로케이션 식별자")
    product_id: str = Field(description="제품 식별자")
    lot_number: str | None = Field(None, description="로트 번호")
    serial_number: str | None = Field(None, description="시리얼 번호")
    system_qty: str = Field(description="시스템 수량 (장부 재고)")
    counted_qty: str | None = Field(None, description="실사 수량 (실제 재고)")
    variance_qty: str | None = Field(None, description="차이 수량 (counted_qty - system_qty)")
    counted_by: str | None = Field(None, description="실사자 UUID")
    counted_at: str | None = Field(None, description="실사 일시")
    is_recount_required: str | None = Field(default=False, description="재실사 필요 여부")
    recount_count: str | None = Field(default=0, description="재실사 횟수")
    variance_reason_code: str | None = Field(None, description="차이 사유 코드")
    variance_reason: str | None = Field(None, description="차이 사유")
    adjustment_id: str | None = Field(None, description="조정 식별자 (연동된 조정)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None


class InventoryCountItemsCreate(InventoryCountItemsBase):
    """Schema for creating InventoryCountItems"""

    # Exclude auto-generated fields
    pass


class InventoryCountItemsUpdate(BaseModel):
    """Schema for updating InventoryCountItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    count_id: str | None = Field(None, description="실사 식별자")
    warehouse_id: str | None = Field(None, description="창고 식별자")
    location_id: str | None = Field(None, description="로케이션 식별자")
    product_id: str | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, description="로트 번호")
    serial_number: str | None = Field(None, description="시리얼 번호")
    system_qty: str | None = Field(None, description="시스템 수량 (장부 재고)")
    counted_qty: str | None = Field(None, description="실사 수량 (실제 재고)")
    variance_qty: str | None = Field(None, description="차이 수량 (counted_qty - system_qty)")
    counted_by: str | None = Field(None, description="실사자 UUID")
    counted_at: str | None = Field(None, description="실사 일시")
    is_recount_required: str | None = Field(default=False, description="재실사 필요 여부")
    recount_count: str | None = Field(default=0, description="재실사 횟수")
    variance_reason_code: str | None = Field(None, description="차이 사유 코드")
    variance_reason: str | None = Field(None, description="차이 사유")
    adjustment_id: str | None = Field(None, description="조정 식별자 (연동된 조정)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None


class InventoryCountItemsResponse(InventoryCountItemsBase):
    """Schema for InventoryCountItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryCountItemsListResponse(BaseModel):
    """Schema for paginated InventoryCountItems list response"""

    items: list[InventoryCountItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryCountItemsBase",
    "InventoryCountItemsCreate",
    "InventoryCountItemsUpdate",
    "InventoryCountItemsResponse",
    "InventoryCountItemsListResponse",
]
