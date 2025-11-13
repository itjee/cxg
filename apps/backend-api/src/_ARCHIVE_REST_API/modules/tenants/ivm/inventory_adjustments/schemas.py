"""
재고 조정 관리 테이블

Pydantic schemas for InventoryAdjustments model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryAdjustmentsBase(BaseModel):
    """Base schema for InventoryAdjustments"""
    model_config = ConfigDict(from_attributes=True)

    adjustment_code: str = Field(max_length=50, description="조정 코드")
    adjustment_date: date = Field(description="조정 일자")
    adjustment_type: str = Field(max_length=20, description="조정 유형 (COUNT/DAMAGE/LOSS/QUALITY/FOUND/OTHER)")
    warehouse_id: UUID = Field(description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    before_qty: int = Field(description="조정 전 수량")
    after_qty: int = Field(description="조정 후 수량")
    adjustment_qty: int = Field(description="조정 수량 (after_qty - before_qty)")
    reason_code: str | None = Field(None, max_length=50, description="사유 코드 (표준 코드)")
    reason: str = Field(description="조정 사유 (필수)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    completed_at: datetime | None = Field(None, description="조정 완료 일시")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='PENDING', description="상태 (PENDING/APPROVED/REJECTED/COMPLETED)")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryAdjustmentsCreate(InventoryAdjustmentsBase):
    """Schema for creating InventoryAdjustments"""

    # Exclude auto-generated fields
    pass


class InventoryAdjustmentsUpdate(BaseModel):
    """Schema for updating InventoryAdjustments (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    adjustment_code: str | None = Field(None, max_length=50, description="조정 코드")
    adjustment_date: date | None = Field(None, description="조정 일자")
    adjustment_type: str | None = Field(None, max_length=20, description="조정 유형 (COUNT/DAMAGE/LOSS/QUALITY/FOUND/OTHER)")
    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    before_qty: int | None = Field(None, description="조정 전 수량")
    after_qty: int | None = Field(None, description="조정 후 수량")
    adjustment_qty: int | None = Field(None, description="조정 수량 (after_qty - before_qty)")
    reason_code: str | None = Field(None, max_length=50, description="사유 코드 (표준 코드)")
    reason: str | None = Field(None, description="조정 사유 (필수)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    completed_at: datetime | None = Field(None, description="조정 완료 일시")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='PENDING', description="상태 (PENDING/APPROVED/REJECTED/COMPLETED)")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryAdjustmentsResponse(InventoryAdjustmentsBase):
    """Schema for InventoryAdjustments response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryAdjustmentsListResponse(BaseModel):
    """Schema for paginated InventoryAdjustments list response"""

    items: list[InventoryAdjustmentsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryAdjustmentsBase",
    "InventoryAdjustmentsCreate",
    "InventoryAdjustmentsUpdate",
    "InventoryAdjustmentsResponse",
    "InventoryAdjustmentsListResponse",
]
