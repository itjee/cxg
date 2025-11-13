"""
시리얼 번호 마스터 관리 테이블

Pydantic schemas for InventorySerialNumbers model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventorySerialNumbersBase(BaseModel):
    """Base schema for InventorySerialNumbers"""
    model_config = ConfigDict(from_attributes=True)

    serial_number: str = Field(max_length=100, description="시리얼 번호")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    manufactured_date: date | None = Field(None, description="제조 일자")
    manufacturer_id: UUID | None = Field(None, description="제조사 식별자")
    current_warehouse_id: UUID | None = Field(None, description="현재 창고 식별자")
    current_location_id: UUID | None = Field(None, description="현재 로케이션 식별자")
    owner_type: str | None = Field(None, description="소유 타입 (COMPANY/CUSTOMER/SUPPLIER)")
    owner_id: UUID | None = Field(None, description="소유자 식별자")
    ownership_date: date | None = Field(None, description="소유권 이전 일자")
    warranty_start_date: str | None = Field(None, description="워런티 시작일")
    warranty_end_date: str | None = Field(None, description="워런티 종료일")
    warranty_months: int | None = Field(None, description="워런티 기간 (개월)")
    status: str | None = Field(max_length=20, default='AVAILABLE', description="상태 (AVAILABLE/RESERVED/SHIPPED/SOLD/RETURNED/IN_SERVICE/SCRAPPED)")
    condition_grade: str | None = Field(None, description="상태 등급 (NEW/GOOD/FAIR/POOR/REFURBISHED)")
    sold_date: date | None = Field(None, description="판매 일자")
    shipped_date: date | None = Field(None, description="배송 일자")
    delivered_date: date | None = Field(None, description="배송 완료 일자")
    return_date: date | None = Field(None, description="반품 일자")
    return_reason: str | None = Field(None, description="반품 사유")
    last_service_date: date | None = Field(None, description="최종 A/S 일자")
    service_count: int | None = Field(default=0, description="A/S 횟수")
    scrapped_date: date | None = Field(None, description="폐기 일자")
    scrapped_reason: str | None = Field(None, description="폐기 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventorySerialNumbersCreate(InventorySerialNumbersBase):
    """Schema for creating InventorySerialNumbers"""

    # Exclude auto-generated fields
    pass


class InventorySerialNumbersUpdate(BaseModel):
    """Schema for updating InventorySerialNumbers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    manufactured_date: date | None = Field(None, description="제조 일자")
    manufacturer_id: UUID | None = Field(None, description="제조사 식별자")
    current_warehouse_id: UUID | None = Field(None, description="현재 창고 식별자")
    current_location_id: UUID | None = Field(None, description="현재 로케이션 식별자")
    owner_type: str | None = Field(None, description="소유 타입 (COMPANY/CUSTOMER/SUPPLIER)")
    owner_id: UUID | None = Field(None, description="소유자 식별자")
    ownership_date: date | None = Field(None, description="소유권 이전 일자")
    warranty_start_date: str | None = Field(None, description="워런티 시작일")
    warranty_end_date: str | None = Field(None, description="워런티 종료일")
    warranty_months: int | None = Field(None, description="워런티 기간 (개월)")
    status: str | None = Field(max_length=20, default='AVAILABLE', description="상태 (AVAILABLE/RESERVED/SHIPPED/SOLD/RETURNED/IN_SERVICE/SCRAPPED)")
    condition_grade: str | None = Field(None, description="상태 등급 (NEW/GOOD/FAIR/POOR/REFURBISHED)")
    sold_date: date | None = Field(None, description="판매 일자")
    shipped_date: date | None = Field(None, description="배송 일자")
    delivered_date: date | None = Field(None, description="배송 완료 일자")
    return_date: date | None = Field(None, description="반품 일자")
    return_reason: str | None = Field(None, description="반품 사유")
    last_service_date: date | None = Field(None, description="최종 A/S 일자")
    service_count: int | None = Field(default=0, description="A/S 횟수")
    scrapped_date: date | None = Field(None, description="폐기 일자")
    scrapped_reason: str | None = Field(None, description="폐기 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventorySerialNumbersResponse(InventorySerialNumbersBase):
    """Schema for InventorySerialNumbers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventorySerialNumbersListResponse(BaseModel):
    """Schema for paginated InventorySerialNumbers list response"""

    items: list[InventorySerialNumbersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventorySerialNumbersBase",
    "InventorySerialNumbersCreate",
    "InventorySerialNumbersUpdate",
    "InventorySerialNumbersResponse",
    "InventorySerialNumbersListResponse",
]
