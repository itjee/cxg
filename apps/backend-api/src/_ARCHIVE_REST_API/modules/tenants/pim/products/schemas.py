"""
제품/품목 마스터 정보 관리 테이블

Pydantic schemas for Products model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductsBase(BaseModel):
    """Base schema for Products"""
    model_config = ConfigDict(from_attributes=True)

    code: str = Field(max_length=20, description="제품 코드 (사내 규칙)")
    name: str = Field(max_length=200, description="제품명")
    type: str | None = Field(None, max_length=10, description="제품 유형")
    no: str | None = Field(None, max_length=10, description="제품 번호")
    item_type: str | None = Field(None, max_length=10, description="품목 유형")
    category_id: UUID | None = Field(None, description="카테고리 식별자")
    maker_id: UUID | None = Field(None, description="제조사 식별자")
    brand_id: UUID | None = Field(None, description="브랜드 식별자")
    model_name: str | None = Field(None, max_length=100, description="모델명")
    barcode: str | None = Field(None, max_length=50, description="바코드")
    is_taxfree: bool | None = Field(default=False, description="면세 여부")
    is_bigdeal: bool | None = Field(default=False, description="거액 거래 여부")
    is_barcode: bool | None = Field(default=False, description="바코드 보유 여부")
    is_serial: bool | None = Field(default=False, description="시리얼 관리 여부")
    is_inventory: bool | None = Field(default=True, description="재고 관리 여부")
    cto_id: str | None = Field(None, max_length=50, description="CTO ID")
    eclipse_id: str | None = Field(None, max_length=20, description="Eclipse ID")
    procure_id: str | None = Field(None, max_length=20, description="조달 ID")
    std_cost_price: Decimal | None = Field(None, description="표준 원가")
    std_sell_price: Decimal | None = Field(None, description="표준 판매가")
    min_sell_price: Decimal | None = Field(None, description="최소 판매가")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    manager_id: UUID | None = Field(None, description="제품 담당자 식별자")
    image_url: str | None = Field(None, max_length=200, description="이미지 URL")
    description: str | None = Field(None, description="제품 설명")
    specifications: dict | None = Field(None, description="제품 사양 (JSON 형태: {\"cpu\": \"Intel i7\", \"memory\": \"16GB\", \"storage\": \"512GB SSD\"})")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING/EOL)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductsCreate(ProductsBase):
    """Schema for creating Products"""

    # Exclude auto-generated fields
    pass


class ProductsUpdate(BaseModel):
    """Schema for updating Products (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    code: str | None = Field(None, max_length=20, description="제품 코드 (사내 규칙)")
    name: str | None = Field(None, max_length=200, description="제품명")
    type: str | None = Field(None, max_length=10, description="제품 유형")
    no: str | None = Field(None, max_length=10, description="제품 번호")
    item_type: str | None = Field(None, max_length=10, description="품목 유형")
    category_id: UUID | None = Field(None, description="카테고리 식별자")
    maker_id: UUID | None = Field(None, description="제조사 식별자")
    brand_id: UUID | None = Field(None, description="브랜드 식별자")
    model_name: str | None = Field(None, max_length=100, description="모델명")
    barcode: str | None = Field(None, max_length=50, description="바코드")
    is_taxfree: bool | None = Field(default=False, description="면세 여부")
    is_bigdeal: bool | None = Field(default=False, description="거액 거래 여부")
    is_barcode: bool | None = Field(default=False, description="바코드 보유 여부")
    is_serial: bool | None = Field(default=False, description="시리얼 관리 여부")
    is_inventory: bool | None = Field(default=True, description="재고 관리 여부")
    cto_id: str | None = Field(None, max_length=50, description="CTO ID")
    eclipse_id: str | None = Field(None, max_length=20, description="Eclipse ID")
    procure_id: str | None = Field(None, max_length=20, description="조달 ID")
    std_cost_price: Decimal | None = Field(None, description="표준 원가")
    std_sell_price: Decimal | None = Field(None, description="표준 판매가")
    min_sell_price: Decimal | None = Field(None, description="최소 판매가")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    manager_id: UUID | None = Field(None, description="제품 담당자 식별자")
    image_url: str | None = Field(None, max_length=200, description="이미지 URL")
    description: str | None = Field(None, description="제품 설명")
    specifications: dict | None = Field(None, description="제품 사양 (JSON 형태: {\"cpu\": \"Intel i7\", \"memory\": \"16GB\", \"storage\": \"512GB SSD\"})")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING/EOL)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductsResponse(ProductsBase):
    """Schema for Products response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductsListResponse(BaseModel):
    """Schema for paginated Products list response"""

    items: list[ProductsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductsBase",
    "ProductsCreate",
    "ProductsUpdate",
    "ProductsResponse",
    "ProductsListResponse",
]
