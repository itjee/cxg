"""
창고 마스터 정보 관리 테이블

Pydantic schemas for Warehouses model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class WarehousesBase(BaseModel):
    """Base schema for Warehouses"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=20, description="창고 코드 (사내 규칙)")
    name: str = Field(max_length=100, description="창고명")
    type: str = Field(max_length=20, description="창고 유형 (MAIN/BRANCH/DISTRIBUTION/COLD_STORAGE/FREEZER/EXTERNAL/VIRTUAL/QUARANTINE/RETURN)")
    manager_id: UUID | None = Field(None, description="창고 관리자 식별자")
    is_primary: bool | None = Field(default=False, description="주창고 여부")
    is_external: bool | None = Field(default=False, description="외부창고 여부 (3PL 등)")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    fax: str | None = Field(None, max_length=50, description="팩스번호")
    email: str | None = Field(None, max_length=255, description="이메일")
    postcode: str | None = Field(None, max_length=20, description="우편번호")
    address1: str | None = Field(None, max_length=200, description="기본 주소")
    address2: str | None = Field(None, max_length=200, description="상세 주소")
    building_name: str | None = Field(None, max_length=200, description="건물명")
    city: str | None = Field(None, max_length=100, description="도시")
    state_province: str | None = Field(None, max_length=100, description="주/도")
    country_code: str | None = Field(max_length=3, default='KOR', description="국가 코드 (ISO 3166-1 alpha-3)")
    operating_hours: str | None = Field(None, max_length=100, description="운영 시간")
    capacity_sqm: Decimal | None = Field(None, description="면적 (제곱미터)")
    capacity_volume: Decimal | None = Field(None, description="용적 (세제곱미터)")
    max_weight: Decimal | None = Field(None, description="최대 중량 (kg)")
    has_dock: bool | None = Field(default=False, description="도크 보유 여부")
    has_crane: bool | None = Field(default=False, description="크레인 보유 여부")
    has_cold_storage: bool | None = Field(default=False, description="냉장 시설 여부")
    has_freezer: bool | None = Field(default=False, description="냉동 시설 여부")
    monthly_rent: Decimal | None = Field(None, description="월 임대료")
    storage_cost: Decimal | None = Field(None, description="단위당 보관비")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    external_provider: str | None = Field(None, max_length=100, description="외부 업체명 (3PL 등)")
    contract_start_date: date | None = Field(None, description="계약 시작일")
    contract_close_date: date | None = Field(None, description="계약 종료일")
    description: str | None = Field(None, description="창고 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/MAINTENANCE/SUSPENDED/CLOSED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class WarehousesCreate(WarehousesBase):
    """Schema for creating Warehouses"""

    # Exclude auto-generated fields
    pass


class WarehousesUpdate(BaseModel):
    """Schema for updating Warehouses (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=20, description="창고 코드 (사내 규칙)")
    name: str | None = Field(None, max_length=100, description="창고명")
    type: str | None = Field(None, max_length=20, description="창고 유형 (MAIN/BRANCH/DISTRIBUTION/COLD_STORAGE/FREEZER/EXTERNAL/VIRTUAL/QUARANTINE/RETURN)")
    manager_id: UUID | None = Field(None, description="창고 관리자 식별자")
    is_primary: bool | None = Field(default=False, description="주창고 여부")
    is_external: bool | None = Field(default=False, description="외부창고 여부 (3PL 등)")
    phone: str | None = Field(None, max_length=50, description="전화번호")
    fax: str | None = Field(None, max_length=50, description="팩스번호")
    email: str | None = Field(None, max_length=255, description="이메일")
    postcode: str | None = Field(None, max_length=20, description="우편번호")
    address1: str | None = Field(None, max_length=200, description="기본 주소")
    address2: str | None = Field(None, max_length=200, description="상세 주소")
    building_name: str | None = Field(None, max_length=200, description="건물명")
    city: str | None = Field(None, max_length=100, description="도시")
    state_province: str | None = Field(None, max_length=100, description="주/도")
    country_code: str | None = Field(max_length=3, default='KOR', description="국가 코드 (ISO 3166-1 alpha-3)")
    operating_hours: str | None = Field(None, max_length=100, description="운영 시간")
    capacity_sqm: Decimal | None = Field(None, description="면적 (제곱미터)")
    capacity_volume: Decimal | None = Field(None, description="용적 (세제곱미터)")
    max_weight: Decimal | None = Field(None, description="최대 중량 (kg)")
    has_dock: bool | None = Field(default=False, description="도크 보유 여부")
    has_crane: bool | None = Field(default=False, description="크레인 보유 여부")
    has_cold_storage: bool | None = Field(default=False, description="냉장 시설 여부")
    has_freezer: bool | None = Field(default=False, description="냉동 시설 여부")
    monthly_rent: Decimal | None = Field(None, description="월 임대료")
    storage_cost: Decimal | None = Field(None, description="단위당 보관비")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    external_provider: str | None = Field(None, max_length=100, description="외부 업체명 (3PL 등)")
    contract_start_date: date | None = Field(None, description="계약 시작일")
    contract_close_date: date | None = Field(None, description="계약 종료일")
    description: str | None = Field(None, description="창고 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/MAINTENANCE/SUSPENDED/CLOSED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class WarehousesResponse(WarehousesBase):
    """Schema for Warehouses response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class WarehousesListResponse(BaseModel):
    """Schema for paginated Warehouses list response"""

    items: list[WarehousesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "WarehousesBase",
    "WarehousesCreate",
    "WarehousesUpdate",
    "WarehousesResponse",
    "WarehousesListResponse",
]
