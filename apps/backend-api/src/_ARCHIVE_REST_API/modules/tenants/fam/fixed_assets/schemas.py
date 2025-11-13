"""
고정자산: 유형자산 및 무형자산 관리

Pydantic schemas for FixedAssets model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class FixedAssetsBase(BaseModel):
    """Base schema for FixedAssets"""
    model_config = ConfigDict(from_attributes=True)

    asset_code: str = Field(max_length=50, description="자산 코드")
    asset_name: str = Field(max_length=200, description="자산명")
    asset_category: str = Field(max_length=50, description="자산 분류")
    asset_type: str | None = Field(None, max_length=50, description="자산 유형")
    acquisition_date: date = Field(description="취득일")
    acquisition_method: str | None = Field(None, max_length=20, description="취득 방법 (PURCHASE/LEASE/DONATION/CONSTRUCTION/EXCHANGE)")
    acquisition_cost: Decimal = Field(default=0, description="취득가액")
    salvage_value: Decimal = Field(default=0, description="잔존가치")
    depreciable_cost: Decimal = Field(default=0, description="상각대상 금액 (취득가액 - 잔존가치)")
    depreciation_method: str = Field(max_length=20, default='STRAIGHT_LINE', description="상각 방법 (STRAIGHT_LINE/DECLINING_BALANCE/SUM_OF_YEARS/UNITS_OF_PRODUCTION)")
    useful_life_years: int = Field(description="내용연수 (년)")
    useful_life_months: int = Field(description="내용연수 (월)")
    depreciation_rate: Decimal | None = Field(None, description="상각률 (%)")
    account_code: str | None = Field(None, max_length=50, description="계정과목 코드")
    depreciation_account: str | None = Field(None, max_length=50, description="감가상각비 계정")
    accumulated_account: str | None = Field(None, max_length=50, description="감가상각누계액 계정")
    accumulated_depreciation: Decimal = Field(default=0, description="감가상각누계액")
    book_value: Decimal = Field(default=0, description="장부가액 (취득가액 - 감가상각누계액)")
    location: str | None = Field(None, max_length=200, description="위치")
    department_id: UUID | None = Field(None, description="관리 부서 ID")
    custodian_id: UUID | None = Field(None, description="관리자 ID (사원)")
    supplier_id: UUID | None = Field(None, description="공급업체 ID")
    supplier_name: str | None = Field(None, max_length=200, description="공급업체명 (스냅샷)")
    manufacturer: str | None = Field(None, max_length=200, description="제조사")
    model_number: str | None = Field(None, max_length=100, description="모델번호")
    serial_number: str | None = Field(None, max_length=100, description="일련번호")
    warranty_start_date: date | None = Field(None, description="보증 시작일")
    warranty_end_date: date | None = Field(None, description="보증 종료일")
    maintenance_cycle: int | None = Field(None, description="정기점검 주기 (월)")
    last_maintenance_date: date | None = Field(None, description="최근 점검일")
    next_maintenance_date: date | None = Field(None, description="다음 점검일")
    disposal_date: date | None = Field(None, description="처분일")
    disposal_method: str | None = Field(None, max_length=20, description="처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)")
    disposal_amount: Decimal | None = Field(None, description="처분가액")
    disposal_gain_loss: Decimal | None = Field(None, description="처분손익")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str = Field(max_length=20, default='IN_USE', description="상태 (IN_USE/IDLE/UNDER_MAINTENANCE/DISPOSED/LOST)")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class FixedAssetsCreate(FixedAssetsBase):
    """Schema for creating FixedAssets"""

    # Exclude auto-generated fields
    pass


class FixedAssetsUpdate(BaseModel):
    """Schema for updating FixedAssets (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    asset_code: str | None = Field(None, max_length=50, description="자산 코드")
    asset_name: str | None = Field(None, max_length=200, description="자산명")
    asset_category: str | None = Field(None, max_length=50, description="자산 분류")
    asset_type: str | None = Field(None, max_length=50, description="자산 유형")
    acquisition_date: date | None = Field(None, description="취득일")
    acquisition_method: str | None = Field(None, max_length=20, description="취득 방법 (PURCHASE/LEASE/DONATION/CONSTRUCTION/EXCHANGE)")
    acquisition_cost: Decimal | None = Field(default=0, description="취득가액")
    salvage_value: Decimal | None = Field(default=0, description="잔존가치")
    depreciable_cost: Decimal | None = Field(default=0, description="상각대상 금액 (취득가액 - 잔존가치)")
    depreciation_method: str | None = Field(max_length=20, default='STRAIGHT_LINE', description="상각 방법 (STRAIGHT_LINE/DECLINING_BALANCE/SUM_OF_YEARS/UNITS_OF_PRODUCTION)")
    useful_life_years: int | None = Field(None, description="내용연수 (년)")
    useful_life_months: int | None = Field(None, description="내용연수 (월)")
    depreciation_rate: Decimal | None = Field(None, description="상각률 (%)")
    account_code: str | None = Field(None, max_length=50, description="계정과목 코드")
    depreciation_account: str | None = Field(None, max_length=50, description="감가상각비 계정")
    accumulated_account: str | None = Field(None, max_length=50, description="감가상각누계액 계정")
    accumulated_depreciation: Decimal | None = Field(default=0, description="감가상각누계액")
    book_value: Decimal | None = Field(default=0, description="장부가액 (취득가액 - 감가상각누계액)")
    location: str | None = Field(None, max_length=200, description="위치")
    department_id: UUID | None = Field(None, description="관리 부서 ID")
    custodian_id: UUID | None = Field(None, description="관리자 ID (사원)")
    supplier_id: UUID | None = Field(None, description="공급업체 ID")
    supplier_name: str | None = Field(None, max_length=200, description="공급업체명 (스냅샷)")
    manufacturer: str | None = Field(None, max_length=200, description="제조사")
    model_number: str | None = Field(None, max_length=100, description="모델번호")
    serial_number: str | None = Field(None, max_length=100, description="일련번호")
    warranty_start_date: date | None = Field(None, description="보증 시작일")
    warranty_end_date: date | None = Field(None, description="보증 종료일")
    maintenance_cycle: int | None = Field(None, description="정기점검 주기 (월)")
    last_maintenance_date: date | None = Field(None, description="최근 점검일")
    next_maintenance_date: date | None = Field(None, description="다음 점검일")
    disposal_date: date | None = Field(None, description="처분일")
    disposal_method: str | None = Field(None, max_length=20, description="처분 방법 (SALE/DISCARD/DONATION/EXCHANGE/LOSS)")
    disposal_amount: Decimal | None = Field(None, description="처분가액")
    disposal_gain_loss: Decimal | None = Field(None, description="처분손익")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='IN_USE', description="상태 (IN_USE/IDLE/UNDER_MAINTENANCE/DISPOSED/LOST)")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class FixedAssetsResponse(FixedAssetsBase):
    """Schema for FixedAssets response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class FixedAssetsListResponse(BaseModel):
    """Schema for paginated FixedAssets list response"""

    items: list[FixedAssetsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "FixedAssetsBase",
    "FixedAssetsCreate",
    "FixedAssetsUpdate",
    "FixedAssetsResponse",
    "FixedAssetsListResponse",
]
