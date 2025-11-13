"""
제품 옵션 그룹 관리 테이블 (색상, 사이즈 등)

Pydantic schemas for ProductOptions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductOptionsBase(BaseModel):
    """Base schema for ProductOptions"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    code: str = Field(max_length=50, description="옵션 코드")
    name: str = Field(max_length=100, description="옵션명 (예: 색상, 사이즈)")
    name_en: str | None = Field(None, max_length=100, description="영문 옵션명")
    option_type: str | None = Field(max_length=20, default='SELECT', description="옵션 유형 (SELECT/RADIO/TEXT/COLOR/IMAGE)")
    display_order: int | None = Field(default=0, description="표시 순서")
    is_required: bool | None = Field(default=True, description="필수 선택 여부")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductOptionsCreate(ProductOptionsBase):
    """Schema for creating ProductOptions"""

    # Exclude auto-generated fields
    pass


class ProductOptionsUpdate(BaseModel):
    """Schema for updating ProductOptions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    code: str | None = Field(None, max_length=50, description="옵션 코드")
    name: str | None = Field(None, max_length=100, description="옵션명 (예: 색상, 사이즈)")
    name_en: str | None = Field(None, max_length=100, description="영문 옵션명")
    option_type: str | None = Field(max_length=20, default='SELECT', description="옵션 유형 (SELECT/RADIO/TEXT/COLOR/IMAGE)")
    display_order: int | None = Field(default=0, description="표시 순서")
    is_required: bool | None = Field(default=True, description="필수 선택 여부")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductOptionsResponse(ProductOptionsBase):
    """Schema for ProductOptions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductOptionsListResponse(BaseModel):
    """Schema for paginated ProductOptions list response"""

    items: list[ProductOptionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductOptionsBase",
    "ProductOptionsCreate",
    "ProductOptionsUpdate",
    "ProductOptionsResponse",
    "ProductOptionsListResponse",
]
