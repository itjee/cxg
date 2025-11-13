"""
순환 재고 조사 관리 테이블

Pydantic schemas for InventoryCycleCounts model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryCycleCountsBase(BaseModel):
    """Base schema for InventoryCycleCounts"""
    model_config = ConfigDict(from_attributes=True)

    product_id: str = Field(description="제품 식별자")
    warehouse_id: str = Field(description="창고 식별자")
    abc_class: str | None = Field(None, description="ABC 등급 (A: 고중요도, B: 중중요도, C: 저중요도)")
    frequency_type: str = Field(description="빈도 유형 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY)")
    frequency_value: str = Field(description="빈도 값 (예: 1=매일, 2=격일, 7=매주)")
    last_count_date: str | None = Field(None, description="마지막 조사 일자")
    last_count_id: str | None = Field(None, description="마지막 조사 식별자")
    last_variance_qty: str | None = Field(None, description="마지막 차이 수량")
    next_count_date: str | None = Field(None, description="다음 조사 예정일")
    total_count_times: str | None = Field(default=0, description="총 조사 횟수")
    variance_count_times: str | None = Field(None, description="차이 발생 횟수")
    accuracy_rate: str | None = Field(None, description="정확도 (%)")
    is_active: str | None = Field(default=True, description="활성 여부")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None


class InventoryCycleCountsCreate(InventoryCycleCountsBase):
    """Schema for creating InventoryCycleCounts"""

    # Exclude auto-generated fields
    pass


class InventoryCycleCountsUpdate(BaseModel):
    """Schema for updating InventoryCycleCounts (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: str | None = Field(None, description="제품 식별자")
    warehouse_id: str | None = Field(None, description="창고 식별자")
    abc_class: str | None = Field(None, description="ABC 등급 (A: 고중요도, B: 중중요도, C: 저중요도)")
    frequency_type: str | None = Field(None, description="빈도 유형 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY)")
    frequency_value: str | None = Field(None, description="빈도 값 (예: 1=매일, 2=격일, 7=매주)")
    last_count_date: str | None = Field(None, description="마지막 조사 일자")
    last_count_id: str | None = Field(None, description="마지막 조사 식별자")
    last_variance_qty: str | None = Field(None, description="마지막 차이 수량")
    next_count_date: str | None = Field(None, description="다음 조사 예정일")
    total_count_times: str | None = Field(default=0, description="총 조사 횟수")
    variance_count_times: str | None = Field(None, description="차이 발생 횟수")
    accuracy_rate: str | None = Field(None, description="정확도 (%)")
    is_active: str | None = Field(default=True, description="활성 여부")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None


class InventoryCycleCountsResponse(InventoryCycleCountsBase):
    """Schema for InventoryCycleCounts response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryCycleCountsListResponse(BaseModel):
    """Schema for paginated InventoryCycleCounts list response"""

    items: list[InventoryCycleCountsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryCycleCountsBase",
    "InventoryCycleCountsCreate",
    "InventoryCycleCountsUpdate",
    "InventoryCycleCountsResponse",
    "InventoryCycleCountsListResponse",
]
