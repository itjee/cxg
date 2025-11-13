"""
제품 변형(SKU) 관리 테이블 (빨강-L, 파랑-M 등)

Pydantic schemas for ProductVariants model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductVariantsBase(BaseModel):
    """Base schema for ProductVariants"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    sku: str = Field(max_length=50, description="SKU (Stock Keeping Unit)")
    name: str | None = Field(None, max_length=200, description="변형명 (예: 빨강-L)")
    option_values: dict = Field(description="옵션 값 조합 (JSON 배열: [{\"option_id\": \"...\", \"value_id\": \"...\"}])")
    price: Decimal | None = Field(None, description="판매 가격")
    cost_price: Decimal | None = Field(None, description="원가")
    stock_quantity: Decimal | None = Field(default=0, description="재고 수량")
    reserved_quantity: Decimal | None = Field(default=0, description="예약 수량 (주문 대기 등)")
    available_quantity: Decimal | None = Field(None, description="가용 수량 (재고 - 예약)")
    weight: Decimal | None = Field(None, description="무게 (g)")
    length: Decimal | None = Field(None, description="길이 (cm)")
    width: Decimal | None = Field(None, description="너비 (cm)")
    height: Decimal | None = Field(None, description="높이 (cm)")
    image_url: str | None = Field(None, max_length=500, description="대표 이미지 URL")
    barcode: str | None = Field(None, max_length=50, description="바코드")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductVariantsCreate(ProductVariantsBase):
    """Schema for creating ProductVariants"""

    # Exclude auto-generated fields
    pass


class ProductVariantsUpdate(BaseModel):
    """Schema for updating ProductVariants (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    sku: str | None = Field(None, max_length=50, description="SKU (Stock Keeping Unit)")
    name: str | None = Field(None, max_length=200, description="변형명 (예: 빨강-L)")
    option_values: dict | None = Field(None, description="옵션 값 조합 (JSON 배열: [{\"option_id\": \"...\", \"value_id\": \"...\"}])")
    price: Decimal | None = Field(None, description="판매 가격")
    cost_price: Decimal | None = Field(None, description="원가")
    stock_quantity: Decimal | None = Field(default=0, description="재고 수량")
    reserved_quantity: Decimal | None = Field(default=0, description="예약 수량 (주문 대기 등)")
    available_quantity: Decimal | None = Field(None, description="가용 수량 (재고 - 예약)")
    weight: Decimal | None = Field(None, description="무게 (g)")
    length: Decimal | None = Field(None, description="길이 (cm)")
    width: Decimal | None = Field(None, description="너비 (cm)")
    height: Decimal | None = Field(None, description="높이 (cm)")
    image_url: str | None = Field(None, max_length=500, description="대표 이미지 URL")
    barcode: str | None = Field(None, max_length=50, description="바코드")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductVariantsResponse(ProductVariantsBase):
    """Schema for ProductVariants response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductVariantsListResponse(BaseModel):
    """Schema for paginated ProductVariants list response"""

    items: list[ProductVariantsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductVariantsBase",
    "ProductVariantsCreate",
    "ProductVariantsUpdate",
    "ProductVariantsResponse",
    "ProductVariantsListResponse",
]
