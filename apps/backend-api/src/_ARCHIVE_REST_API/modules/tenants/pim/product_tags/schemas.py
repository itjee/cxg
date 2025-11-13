"""
제품 태그 관리 테이블 (신제품, 인기, 할인 등)

Pydantic schemas for ProductTags model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductTagsBase(BaseModel):
    """Base schema for ProductTags"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    tag_name: str = Field(max_length=50, description="태그명")
    tag_type: str | None = Field(max_length=20, default='GENERAL', description="태그 유형 (GENERAL/PROMOTION/SEASONAL/NEW/BEST/SALE/FEATURED)")
    color_code: str | None = Field(None, max_length=20, description="색상 코드 (hex)")
    start_date: date | None = Field(None, description="시작일 (시즌, 프로모션 태그)")
    end_date: date | None = Field(None, description="종료일 (시즌, 프로모션 태그)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductTagsCreate(ProductTagsBase):
    """Schema for creating ProductTags"""

    # Exclude auto-generated fields
    pass


class ProductTagsUpdate(BaseModel):
    """Schema for updating ProductTags (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    tag_name: str | None = Field(None, max_length=50, description="태그명")
    tag_type: str | None = Field(max_length=20, default='GENERAL', description="태그 유형 (GENERAL/PROMOTION/SEASONAL/NEW/BEST/SALE/FEATURED)")
    color_code: str | None = Field(None, max_length=20, description="색상 코드 (hex)")
    start_date: date | None = Field(None, description="시작일 (시즌, 프로모션 태그)")
    end_date: date | None = Field(None, description="종료일 (시즌, 프로모션 태그)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductTagsResponse(ProductTagsBase):
    """Schema for ProductTags response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductTagsListResponse(BaseModel):
    """Schema for paginated ProductTags list response"""

    items: list[ProductTagsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductTagsBase",
    "ProductTagsCreate",
    "ProductTagsUpdate",
    "ProductTagsResponse",
    "ProductTagsListResponse",
]
