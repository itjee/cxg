"""
제품 단위 마스터 테이블 (개, 박스, 팩 등)

Pydantic schemas for ProductUnits model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductUnitsBase(BaseModel):
    """Base schema for ProductUnits"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=20, description="단위 코드")
    name: str = Field(max_length=50, description="단위명 (예: 개, 박스, 팩)")
    name_en: str | None = Field(None, max_length=50, description="영문 단위명")
    symbol: str | None = Field(None, max_length=10, description="단위 기호 (예: EA, BOX, PK)")
    unit_type: str | None = Field(max_length=20, default='COUNT', description="단위 유형 (COUNT/WEIGHT/VOLUME/LENGTH/AREA/PACKAGE)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductUnitsCreate(ProductUnitsBase):
    """Schema for creating ProductUnits"""

    # Exclude auto-generated fields
    pass


class ProductUnitsUpdate(BaseModel):
    """Schema for updating ProductUnits (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=20, description="단위 코드")
    name: str | None = Field(None, max_length=50, description="단위명 (예: 개, 박스, 팩)")
    name_en: str | None = Field(None, max_length=50, description="영문 단위명")
    symbol: str | None = Field(None, max_length=10, description="단위 기호 (예: EA, BOX, PK)")
    unit_type: str | None = Field(max_length=20, default='COUNT', description="단위 유형 (COUNT/WEIGHT/VOLUME/LENGTH/AREA/PACKAGE)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductUnitsResponse(ProductUnitsBase):
    """Schema for ProductUnits response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductUnitsListResponse(BaseModel):
    """Schema for paginated ProductUnits list response"""

    items: list[ProductUnitsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductUnitsBase",
    "ProductUnitsCreate",
    "ProductUnitsUpdate",
    "ProductUnitsResponse",
    "ProductUnitsListResponse",
]
