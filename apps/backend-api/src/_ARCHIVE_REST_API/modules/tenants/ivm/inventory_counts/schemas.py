"""
재고 실사 관리 테이블

Pydantic schemas for InventoryCounts model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryCountsBase(BaseModel):
    """Base schema for InventoryCounts"""
    model_config = ConfigDict(from_attributes=True)

    count_code: str = Field(max_length=50, description="실사 코드")
    count_name: str = Field(max_length=200, description="실사명")
    count_type: str = Field(max_length=20, description="실사 유형 (FULL/CYCLE/SPOT)")
    scheduled_date: date = Field(description="예정 일자")
    started_at: datetime | None = Field(None, description="시작 일시")
    completed_at: datetime | None = Field(None, description="완료 일시")
    warehouse_id: UUID | None = Field(None, description="대상 창고 (NULL: 전체)")
    location_id: UUID | None = Field(None, description="대상 로케이션 (NULL: 전체)")
    product_category_id: UUID | None = Field(None, description="대상 제품 카테고리 (NULL: 전체)")
    supervisor_id: UUID | None = Field(None, description="감독자 UUID")
    counter_ids: UUID | None = Field(None, description="실사자 UUID 배열")
    total_items: int | None = Field(default=0, description="전체 항목 수")
    counted_items: str | None = Field(None, description="실사 완료 항목 수")
    variance_items: str | None = Field(None, description="차이 발생 항목 수")
    is_adjustment_approved: bool | None = Field(default=False, description="조정 승인 여부")
    status: str | None = Field(max_length=20, default='PLANNED', description="상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryCountsCreate(InventoryCountsBase):
    """Schema for creating InventoryCounts"""

    # Exclude auto-generated fields
    pass


class InventoryCountsUpdate(BaseModel):
    """Schema for updating InventoryCounts (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    count_code: str | None = Field(None, max_length=50, description="실사 코드")
    count_name: str | None = Field(None, max_length=200, description="실사명")
    count_type: str | None = Field(None, max_length=20, description="실사 유형 (FULL/CYCLE/SPOT)")
    scheduled_date: date | None = Field(None, description="예정 일자")
    started_at: datetime | None = Field(None, description="시작 일시")
    completed_at: datetime | None = Field(None, description="완료 일시")
    warehouse_id: UUID | None = Field(None, description="대상 창고 (NULL: 전체)")
    location_id: UUID | None = Field(None, description="대상 로케이션 (NULL: 전체)")
    product_category_id: UUID | None = Field(None, description="대상 제품 카테고리 (NULL: 전체)")
    supervisor_id: UUID | None = Field(None, description="감독자 UUID")
    counter_ids: UUID | None = Field(None, description="실사자 UUID 배열")
    total_items: int | None = Field(default=0, description="전체 항목 수")
    counted_items: str | None = Field(None, description="실사 완료 항목 수")
    variance_items: str | None = Field(None, description="차이 발생 항목 수")
    is_adjustment_approved: bool | None = Field(default=False, description="조정 승인 여부")
    status: str | None = Field(max_length=20, default='PLANNED', description="상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryCountsResponse(InventoryCountsBase):
    """Schema for InventoryCounts response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryCountsListResponse(BaseModel):
    """Schema for paginated InventoryCounts list response"""

    items: list[InventoryCountsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryCountsBase",
    "InventoryCountsCreate",
    "InventoryCountsUpdate",
    "InventoryCountsResponse",
    "InventoryCountsListResponse",
]
