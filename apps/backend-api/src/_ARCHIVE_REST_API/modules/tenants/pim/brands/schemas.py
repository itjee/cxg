"""
브랜드 마스터 정보 관리 테이블

Pydantic schemas for Brands model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class BrandsBase(BaseModel):
    """Base schema for Brands"""
    model_config = ConfigDict(from_attributes=True)

    maker_id: UUID = Field(description="제조사 식별자")
    code: str = Field(max_length=20, description="브랜드 코드 (사내 규칙)")
    name: str = Field(max_length=200, description="브랜드명")
    name_en: str | None = Field(None, max_length=200, description="영문 브랜드명")
    type: str | None = Field(max_length=20, default='PRODUCT', description="브랜드 유형 (PRODUCT/SERVICE/CORPORATE/SUB_BRAND/PRIVATE_LABEL)")
    category: str | None = Field(None, max_length=50, description="브랜드 카테고리")
    logo_url: str | None = Field(None, max_length=500, description="로고 이미지 URL")
    color: str | None = Field(None, max_length=20, description="브랜드 컬러 (hex 코드)")
    tagline: str | None = Field(None, max_length=200, description="브랜드 슬로건")
    market_segment: str | None = Field(None, max_length=50, description="시장 세그먼트")
    price_range: str | None = Field(None, max_length=20, description="가격대 (BUDGET/MID_RANGE/PREMIUM/LUXURY/ULTRA_LUXURY)")
    target_market: str | None = Field(None, max_length=100, description="타겟 시장")
    website: str | None = Field(None, max_length=255, description="브랜드 웹사이트")
    country_code: str | None = Field(None, max_length=3, description="브랜드 원산지 (ISO 3166-1 alpha-3)")
    display_order: int | None = Field(default=0, description="정렬 순서")
    is_premium: bool | None = Field(default=False, description="프리미엄 브랜드 여부")
    is_private: bool | None = Field(default=False, description="자체 브랜드 여부")
    description: str | None = Field(None, description="브랜드 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class BrandsCreate(BrandsBase):
    """Schema for creating Brands"""

    # Exclude auto-generated fields
    pass


class BrandsUpdate(BaseModel):
    """Schema for updating Brands (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    maker_id: UUID | None = Field(None, description="제조사 식별자")
    code: str | None = Field(None, max_length=20, description="브랜드 코드 (사내 규칙)")
    name: str | None = Field(None, max_length=200, description="브랜드명")
    name_en: str | None = Field(None, max_length=200, description="영문 브랜드명")
    type: str | None = Field(max_length=20, default='PRODUCT', description="브랜드 유형 (PRODUCT/SERVICE/CORPORATE/SUB_BRAND/PRIVATE_LABEL)")
    category: str | None = Field(None, max_length=50, description="브랜드 카테고리")
    logo_url: str | None = Field(None, max_length=500, description="로고 이미지 URL")
    color: str | None = Field(None, max_length=20, description="브랜드 컬러 (hex 코드)")
    tagline: str | None = Field(None, max_length=200, description="브랜드 슬로건")
    market_segment: str | None = Field(None, max_length=50, description="시장 세그먼트")
    price_range: str | None = Field(None, max_length=20, description="가격대 (BUDGET/MID_RANGE/PREMIUM/LUXURY/ULTRA_LUXURY)")
    target_market: str | None = Field(None, max_length=100, description="타겟 시장")
    website: str | None = Field(None, max_length=255, description="브랜드 웹사이트")
    country_code: str | None = Field(None, max_length=3, description="브랜드 원산지 (ISO 3166-1 alpha-3)")
    display_order: int | None = Field(default=0, description="정렬 순서")
    is_premium: bool | None = Field(default=False, description="프리미엄 브랜드 여부")
    is_private: bool | None = Field(default=False, description="자체 브랜드 여부")
    description: str | None = Field(None, description="브랜드 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class BrandsResponse(BrandsBase):
    """Schema for Brands response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class BrandsListResponse(BaseModel):
    """Schema for paginated Brands list response"""

    items: list[BrandsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "BrandsBase",
    "BrandsCreate",
    "BrandsUpdate",
    "BrandsResponse",
    "BrandsListResponse",
]
