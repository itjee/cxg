"""
재고 예약 관리 테이블

Pydantic schemas for InventoryReservations model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class InventoryReservationsBase(BaseModel):
    """Base schema for InventoryReservations"""
    model_config = ConfigDict(from_attributes=True)

    reservation_code: str = Field(max_length=50, description="예약 코드")
    reservation_date: date = Field(description="예약 일자")
    reference_doc_type: str = Field(max_length=50, description="참조 문서 유형 (SO/WO/TRANSFER 등)")
    reference_doc_id: UUID = Field(description="참조 문서 식별자")
    reference_line_id: UUID | None = Field(None, description="참조 라인 식별자")
    warehouse_id: UUID = Field(description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID = Field(description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    reserved_qty: int = Field(description="예약 수량")
    fulfilled_qty: int | None = Field(default=0, description="이행 수량")
    remaining_qty: int = Field(description="잔여 수량 (reserved_qty - fulfilled_qty)")
    expires_at: datetime | None = Field(None, description="예약 만료 일시")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/FULFILLED/RELEASED/EXPIRED)")
    released_at: datetime | None = Field(None, description="해제 일시")
    released_by: UUID | None = Field(None, description="해제자 UUID")
    release_reason: str | None = Field(None, description="해제 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryReservationsCreate(InventoryReservationsBase):
    """Schema for creating InventoryReservations"""

    # Exclude auto-generated fields
    pass


class InventoryReservationsUpdate(BaseModel):
    """Schema for updating InventoryReservations (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    reservation_code: str | None = Field(None, max_length=50, description="예약 코드")
    reservation_date: date | None = Field(None, description="예약 일자")
    reference_doc_type: str | None = Field(None, max_length=50, description="참조 문서 유형 (SO/WO/TRANSFER 등)")
    reference_doc_id: UUID | None = Field(None, description="참조 문서 식별자")
    reference_line_id: UUID | None = Field(None, description="참조 라인 식별자")
    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_id: UUID | None = Field(None, description="로케이션 식별자")
    product_id: UUID | None = Field(None, description="제품 식별자")
    lot_number: str | None = Field(None, max_length=100, description="로트 번호")
    serial_number: str | None = Field(None, max_length=100, description="시리얼 번호")
    reserved_qty: int | None = Field(None, description="예약 수량")
    fulfilled_qty: int | None = Field(default=0, description="이행 수량")
    remaining_qty: int | None = Field(None, description="잔여 수량 (reserved_qty - fulfilled_qty)")
    expires_at: datetime | None = Field(None, description="예약 만료 일시")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/FULFILLED/RELEASED/EXPIRED)")
    released_at: datetime | None = Field(None, description="해제 일시")
    released_by: UUID | None = Field(None, description="해제자 UUID")
    release_reason: str | None = Field(None, description="해제 사유")
    notes: str | None = Field(None, description="비고")
    REFERENCES: str | None = None
    ON: str | None = None


class InventoryReservationsResponse(InventoryReservationsBase):
    """Schema for InventoryReservations response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class InventoryReservationsListResponse(BaseModel):
    """Schema for paginated InventoryReservations list response"""

    items: list[InventoryReservationsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "InventoryReservationsBase",
    "InventoryReservationsCreate",
    "InventoryReservationsUpdate",
    "InventoryReservationsResponse",
    "InventoryReservationsListResponse",
]
