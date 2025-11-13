"""
제품 단위 변환 테이블 (1박스 = 12개)

Pydantic schemas for ProductUnitConversions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductUnitConversionsBase(BaseModel):
    """Base schema for ProductUnitConversions"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    from_unit_id: UUID = Field(description="원단위 식별자")
    to_unit_id: UUID = Field(description="변환단위 식별자")
    conversion_rate: Decimal = Field(description="변환 비율 (예: 1박스 = 12개 -> 12)")
    is_default: bool | None = Field(default=False, description="기본 변환 여부")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductUnitConversionsCreate(ProductUnitConversionsBase):
    """Schema for creating ProductUnitConversions"""

    # Exclude auto-generated fields
    pass


class ProductUnitConversionsUpdate(BaseModel):
    """Schema for updating ProductUnitConversions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    from_unit_id: UUID | None = Field(None, description="원단위 식별자")
    to_unit_id: UUID | None = Field(None, description="변환단위 식별자")
    conversion_rate: Decimal | None = Field(None, description="변환 비율 (예: 1박스 = 12개 -> 12)")
    is_default: bool | None = Field(default=False, description="기본 변환 여부")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductUnitConversionsResponse(ProductUnitConversionsBase):
    """Schema for ProductUnitConversions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductUnitConversionsListResponse(BaseModel):
    """Schema for paginated ProductUnitConversions list response"""

    items: list[ProductUnitConversionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductUnitConversionsBase",
    "ProductUnitConversionsCreate",
    "ProductUnitConversionsUpdate",
    "ProductUnitConversionsResponse",
    "ProductUnitConversionsListResponse",
]
