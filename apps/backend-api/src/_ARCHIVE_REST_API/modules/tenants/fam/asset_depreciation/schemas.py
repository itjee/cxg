"""
감가상각: 고정자산 월별 감가상각 이력

Pydantic schemas for AssetDepreciation model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class AssetDepreciationBase(BaseModel):
    """Base schema for AssetDepreciation"""
    model_config = ConfigDict(from_attributes=True)

    asset_id: UUID = Field(description="고정자산 ID")
    asset_code: str | None = Field(None, max_length=50, description="자산 코드 (스냅샷)")
    asset_name: str | None = Field(None, max_length=200, description="자산명 (스냅샷)")
    depreciation_year: int = Field(description="상각 연도")
    depreciation_month: int = Field(description="상각 월 (1-12)")
    depreciation_date: date = Field(description="상각 일자")
    depreciation_method: str = Field(max_length=20, description="상각 방법")
    depreciation_amount: Decimal = Field(default=0, description="당월 상각액")
    accumulated_depreciation: Decimal = Field(default=0, description="감가상각누계액")
    book_value: Decimal = Field(default=0, description="장부가액")
    journal_entry_id: UUID | None = Field(None, description="분개 ID")
    business_document_id: UUID | None = Field(None, description="업무전표 ID")
    is_posted: bool = Field(default=False, description="전기 여부")
    posted_at: datetime | None = Field(None, description="전기 일시")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class AssetDepreciationCreate(AssetDepreciationBase):
    """Schema for creating AssetDepreciation"""

    # Exclude auto-generated fields
    pass


class AssetDepreciationUpdate(BaseModel):
    """Schema for updating AssetDepreciation (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    asset_id: UUID | None = Field(None, description="고정자산 ID")
    asset_code: str | None = Field(None, max_length=50, description="자산 코드 (스냅샷)")
    asset_name: str | None = Field(None, max_length=200, description="자산명 (스냅샷)")
    depreciation_year: int | None = Field(None, description="상각 연도")
    depreciation_month: int | None = Field(None, description="상각 월 (1-12)")
    depreciation_date: date | None = Field(None, description="상각 일자")
    depreciation_method: str | None = Field(None, max_length=20, description="상각 방법")
    depreciation_amount: Decimal | None = Field(default=0, description="당월 상각액")
    accumulated_depreciation: Decimal | None = Field(default=0, description="감가상각누계액")
    book_value: Decimal | None = Field(default=0, description="장부가액")
    journal_entry_id: UUID | None = Field(None, description="분개 ID")
    business_document_id: UUID | None = Field(None, description="업무전표 ID")
    is_posted: bool | None = Field(default=False, description="전기 여부")
    posted_at: datetime | None = Field(None, description="전기 일시")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class AssetDepreciationResponse(AssetDepreciationBase):
    """Schema for AssetDepreciation response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class AssetDepreciationListResponse(BaseModel):
    """Schema for paginated AssetDepreciation list response"""

    items: list[AssetDepreciationResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "AssetDepreciationBase",
    "AssetDepreciationCreate",
    "AssetDepreciationUpdate",
    "AssetDepreciationResponse",
    "AssetDepreciationListResponse",
]
