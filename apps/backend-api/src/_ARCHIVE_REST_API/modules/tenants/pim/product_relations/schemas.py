"""
제품 연관 관계 관리 테이블 (관련상품, 대체상품, 구성상품 등)

Pydantic schemas for ProductRelations model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductRelationsBase(BaseModel):
    """Base schema for ProductRelations"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    related_product_id: UUID = Field(description="연관 제품 식별자")
    relation_type: str = Field(max_length=20, description="관계 유형 (RELATED/ALTERNATIVE/ACCESSORY/BUNDLE/UPGRADE/CROSS_SELL/UP_SELL)")
    quantity: Decimal | None = Field(default=1, description="수량 (세트 구성 시)")
    display_order: int | None = Field(default=0, description="표시 순서")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductRelationsCreate(ProductRelationsBase):
    """Schema for creating ProductRelations"""

    # Exclude auto-generated fields
    pass


class ProductRelationsUpdate(BaseModel):
    """Schema for updating ProductRelations (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    related_product_id: UUID | None = Field(None, description="연관 제품 식별자")
    relation_type: str | None = Field(None, max_length=20, description="관계 유형 (RELATED/ALTERNATIVE/ACCESSORY/BUNDLE/UPGRADE/CROSS_SELL/UP_SELL)")
    quantity: Decimal | None = Field(default=1, description="수량 (세트 구성 시)")
    display_order: int | None = Field(default=0, description="표시 순서")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductRelationsResponse(ProductRelationsBase):
    """Schema for ProductRelations response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductRelationsListResponse(BaseModel):
    """Schema for paginated ProductRelations list response"""

    items: list[ProductRelationsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductRelationsBase",
    "ProductRelationsCreate",
    "ProductRelationsUpdate",
    "ProductRelationsResponse",
    "ProductRelationsListResponse",
]
