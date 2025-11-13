"""
제품 옵션 값 관리 테이블 (빨강, 파랑, S, M, L 등)

Pydantic schemas for ProductOptionValues model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductOptionValuesBase(BaseModel):
    """Base schema for ProductOptionValues"""
    model_config = ConfigDict(from_attributes=True)

    option_id: UUID = Field(description="옵션 그룹 식별자")
    code: str = Field(max_length=50, description="옵션 값 코드")
    name: str = Field(max_length=100, description="옵션 값명 (예: 빨강, S)")
    name_en: str | None = Field(None, max_length=100, description="영문 옵션 값명")
    display_order: int | None = Field(default=0, description="표시 순서")
    color_code: str | None = Field(None, max_length=20, description="색상 코드 (hex)")
    image_url: str | None = Field(None, max_length=500, description="이미지 URL")
    price_adjustment: Decimal | None = Field(default=0, description="가격 조정 금액")
    adjustment_type: str | None = Field(max_length=20, default='FIXED', description="조정 유형 (FIXED/PERCENT)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/OUT_OF_STOCK)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductOptionValuesCreate(ProductOptionValuesBase):
    """Schema for creating ProductOptionValues"""

    # Exclude auto-generated fields
    pass


class ProductOptionValuesUpdate(BaseModel):
    """Schema for updating ProductOptionValues (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    option_id: UUID | None = Field(None, description="옵션 그룹 식별자")
    code: str | None = Field(None, max_length=50, description="옵션 값 코드")
    name: str | None = Field(None, max_length=100, description="옵션 값명 (예: 빨강, S)")
    name_en: str | None = Field(None, max_length=100, description="영문 옵션 값명")
    display_order: int | None = Field(default=0, description="표시 순서")
    color_code: str | None = Field(None, max_length=20, description="색상 코드 (hex)")
    image_url: str | None = Field(None, max_length=500, description="이미지 URL")
    price_adjustment: Decimal | None = Field(default=0, description="가격 조정 금액")
    adjustment_type: str | None = Field(max_length=20, default='FIXED', description="조정 유형 (FIXED/PERCENT)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/OUT_OF_STOCK)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductOptionValuesResponse(ProductOptionValuesBase):
    """Schema for ProductOptionValues response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductOptionValuesListResponse(BaseModel):
    """Schema for paginated ProductOptionValues list response"""

    items: list[ProductOptionValuesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductOptionValuesBase",
    "ProductOptionValuesCreate",
    "ProductOptionValuesUpdate",
    "ProductOptionValuesResponse",
    "ProductOptionValuesListResponse",
]
