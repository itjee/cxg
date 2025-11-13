"""
제품/품목 카테고리 정보 관리 테이블

Pydantic schemas for Categories model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class CategoriesBase(BaseModel):
    """Base schema for Categories"""
    model_config = ConfigDict(from_attributes=True)

    parent_id: UUID | None = Field(None, description="상위 카테고리 식별자 (계층구조)")
    code: str = Field(max_length=50, description="카테고리 코드 (사내 규칙)")
    name: str = Field(max_length=100, description="카테고리명")
    level_depth: int | None = Field(default=1, description="계층 깊이 (1=대분류, 2=중분류, 3=소분류)")
    full_path: str | None = Field(None, max_length=500, description="전체 경로 (대분류>중분류>소분류)")
    type: str | None = Field(max_length=20, default='PRODUCT', description="카테고리 유형 (PRODUCT/SERVICE/BUNDLE/VIRTUAL/SUBSCRIPTION/DIGITAL/PHYSICAL)")
    display_order: int | None = Field(default=0, description="표시 순서")
    tax_category: str | None = Field(None, max_length=20, description="세금 분류 (TAXABLE/EXEMPT/ZERO_RATED/REVERSE_CHARGE/SPECIAL)")
    account_code: str | None = Field(None, max_length=30, description="회계 코드")
    manager_id: UUID | None = Field(None, description="카테고리 담당자")
    buyer_id: UUID | None = Field(None, description="구매 담당자")
    icon_url: str | None = Field(None, max_length=500, description="아이콘 URL")
    image_url: str | None = Field(None, max_length=500, description="이미지 URL")
    external_code: str | None = Field(None, max_length=50, description="외부 시스템 코드")
    marketplace: str | None = Field(None, max_length=100, description="마켓플레이스 카테고리")
    description: str | None = Field(None, description="카테고리 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CategoriesCreate(CategoriesBase):
    """Schema for creating Categories"""

    # Exclude auto-generated fields
    pass


class CategoriesUpdate(BaseModel):
    """Schema for updating Categories (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    parent_id: UUID | None = Field(None, description="상위 카테고리 식별자 (계층구조)")
    code: str | None = Field(None, max_length=50, description="카테고리 코드 (사내 규칙)")
    name: str | None = Field(None, max_length=100, description="카테고리명")
    level_depth: int | None = Field(default=1, description="계층 깊이 (1=대분류, 2=중분류, 3=소분류)")
    full_path: str | None = Field(None, max_length=500, description="전체 경로 (대분류>중분류>소분류)")
    type: str | None = Field(max_length=20, default='PRODUCT', description="카테고리 유형 (PRODUCT/SERVICE/BUNDLE/VIRTUAL/SUBSCRIPTION/DIGITAL/PHYSICAL)")
    display_order: int | None = Field(default=0, description="표시 순서")
    tax_category: str | None = Field(None, max_length=20, description="세금 분류 (TAXABLE/EXEMPT/ZERO_RATED/REVERSE_CHARGE/SPECIAL)")
    account_code: str | None = Field(None, max_length=30, description="회계 코드")
    manager_id: UUID | None = Field(None, description="카테고리 담당자")
    buyer_id: UUID | None = Field(None, description="구매 담당자")
    icon_url: str | None = Field(None, max_length=500, description="아이콘 URL")
    image_url: str | None = Field(None, max_length=500, description="이미지 URL")
    external_code: str | None = Field(None, max_length=50, description="외부 시스템 코드")
    marketplace: str | None = Field(None, max_length=100, description="마켓플레이스 카테고리")
    description: str | None = Field(None, description="카테고리 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class CategoriesResponse(CategoriesBase):
    """Schema for Categories response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class CategoriesListResponse(BaseModel):
    """Schema for paginated Categories list response"""

    items: list[CategoriesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "CategoriesBase",
    "CategoriesCreate",
    "CategoriesUpdate",
    "CategoriesResponse",
    "CategoriesListResponse",
]
