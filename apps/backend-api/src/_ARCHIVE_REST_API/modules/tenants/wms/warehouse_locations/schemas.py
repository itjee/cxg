"""
창고 로케이션 정보 관리 테이블

Pydantic schemas for WarehouseLocations model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class WarehouseLocationsBase(BaseModel):
    """Base schema for WarehouseLocations"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID = Field(description="창고 식별자")
    location_code: str = Field(max_length=50, description="로케이션 코드")
    location_name: str = Field(max_length=100, description="로케이션명")
    location_type: str | None = Field(max_length=20, default='BIN', description="로케이션 유형 (ZONE/AISLE/RACK/SHELF/BIN/PALLET/FLOOR/DOOR/STAGING/VIRTUAL)")
    parent_id: UUID | None = Field(None, description="상위 로케이션 식별자 (계층구조)")
    level_depth: int | None = Field(default=1, description="계층 깊이 (1=ZONE, 2=AISLE, 3=RACK, 4=BIN)")
    full_path: str | None = Field(None, max_length=500, description="전체 경로 (ZONE-A/AISLE-01/RACK-001/BIN-A001)")
    zone_code: str | None = Field(None, max_length=20, description="구역 코드")
    aisle_code: str | None = Field(None, max_length=20, description="통로 코드")
    rack_code: str | None = Field(None, max_length=20, description="랙 코드")
    bin_code: str | None = Field(None, max_length=20, description="빈 코드")
    x_coordinate: Decimal | None = Field(None, description="X 좌표")
    y_coordinate: Decimal | None = Field(None, description="Y 좌표")
    z_coordinate: Decimal | None = Field(None, description="Z 좌표 (높이)")
    capacity_weight: Decimal | None = Field(None, description="중량 용량 (kg)")
    capacity_volume: Decimal | None = Field(None, description="부피 용량 (㎥)")
    capacity_units: int | None = Field(None, description="단위 용량 (개수)")
    width_cm: Decimal | None = Field(None, description="가로 (cm)")
    height_cm: Decimal | None = Field(None, description="세로 (cm)")
    depth_cm: Decimal | None = Field(None, description="깊이 (cm)")
    is_pickable: bool | None = Field(default=True, description="피킹 가능 여부")
    is_receivable: bool | None = Field(default=True, description="입고 가능 여부")
    is_virtual: bool | None = Field(default=False, description="가상 로케이션 여부")
    is_damaged_area: bool | None = Field(default=False, description="불량품 구역 여부")
    is_quarantine: bool | None = Field(default=False, description="격리 구역 여부")
    temperature_min: Decimal | None = Field(None, description="최저 온도 (℃)")
    temperature_max: Decimal | None = Field(None, description="최고 온도 (℃)")
    humidity_min: Decimal | None = Field(None, description="최저 습도 (%)")
    humidity_max: Decimal | None = Field(None, description="최고 습도 (%)")
    sort_order: int | None = Field(default=0, description="정렬 순서")
    picking_priority: int | None = Field(default=0, description="피킹 우선순위")
    barcode: str | None = Field(None, max_length=100, description="바코드")
    rfid_tag: str | None = Field(None, max_length=100, description="RFID 태그")
    description: str | None = Field(None, description="로케이션 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/MAINTENANCE/BLOCKED/DAMAGED/RESERVED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class WarehouseLocationsCreate(WarehouseLocationsBase):
    """Schema for creating WarehouseLocations"""

    # Exclude auto-generated fields
    pass


class WarehouseLocationsUpdate(BaseModel):
    """Schema for updating WarehouseLocations (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    location_code: str | None = Field(None, max_length=50, description="로케이션 코드")
    location_name: str | None = Field(None, max_length=100, description="로케이션명")
    location_type: str | None = Field(max_length=20, default='BIN', description="로케이션 유형 (ZONE/AISLE/RACK/SHELF/BIN/PALLET/FLOOR/DOOR/STAGING/VIRTUAL)")
    parent_id: UUID | None = Field(None, description="상위 로케이션 식별자 (계층구조)")
    level_depth: int | None = Field(default=1, description="계층 깊이 (1=ZONE, 2=AISLE, 3=RACK, 4=BIN)")
    full_path: str | None = Field(None, max_length=500, description="전체 경로 (ZONE-A/AISLE-01/RACK-001/BIN-A001)")
    zone_code: str | None = Field(None, max_length=20, description="구역 코드")
    aisle_code: str | None = Field(None, max_length=20, description="통로 코드")
    rack_code: str | None = Field(None, max_length=20, description="랙 코드")
    bin_code: str | None = Field(None, max_length=20, description="빈 코드")
    x_coordinate: Decimal | None = Field(None, description="X 좌표")
    y_coordinate: Decimal | None = Field(None, description="Y 좌표")
    z_coordinate: Decimal | None = Field(None, description="Z 좌표 (높이)")
    capacity_weight: Decimal | None = Field(None, description="중량 용량 (kg)")
    capacity_volume: Decimal | None = Field(None, description="부피 용량 (㎥)")
    capacity_units: int | None = Field(None, description="단위 용량 (개수)")
    width_cm: Decimal | None = Field(None, description="가로 (cm)")
    height_cm: Decimal | None = Field(None, description="세로 (cm)")
    depth_cm: Decimal | None = Field(None, description="깊이 (cm)")
    is_pickable: bool | None = Field(default=True, description="피킹 가능 여부")
    is_receivable: bool | None = Field(default=True, description="입고 가능 여부")
    is_virtual: bool | None = Field(default=False, description="가상 로케이션 여부")
    is_damaged_area: bool | None = Field(default=False, description="불량품 구역 여부")
    is_quarantine: bool | None = Field(default=False, description="격리 구역 여부")
    temperature_min: Decimal | None = Field(None, description="최저 온도 (℃)")
    temperature_max: Decimal | None = Field(None, description="최고 온도 (℃)")
    humidity_min: Decimal | None = Field(None, description="최저 습도 (%)")
    humidity_max: Decimal | None = Field(None, description="최고 습도 (%)")
    sort_order: int | None = Field(default=0, description="정렬 순서")
    picking_priority: int | None = Field(default=0, description="피킹 우선순위")
    barcode: str | None = Field(None, max_length=100, description="바코드")
    rfid_tag: str | None = Field(None, max_length=100, description="RFID 태그")
    description: str | None = Field(None, description="로케이션 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/MAINTENANCE/BLOCKED/DAMAGED/RESERVED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None
    ON: str | None = None


class WarehouseLocationsResponse(WarehouseLocationsBase):
    """Schema for WarehouseLocations response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class WarehouseLocationsListResponse(BaseModel):
    """Schema for paginated WarehouseLocations list response"""

    items: list[WarehouseLocationsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "WarehouseLocationsBase",
    "WarehouseLocationsCreate",
    "WarehouseLocationsUpdate",
    "WarehouseLocationsResponse",
    "WarehouseLocationsListResponse",
]
