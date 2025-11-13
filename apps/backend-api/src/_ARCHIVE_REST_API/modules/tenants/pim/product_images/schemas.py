"""
제품 이미지 관리 테이블

Pydantic schemas for ProductImages model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductImagesBase(BaseModel):
    """Base schema for ProductImages"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    image_url: str = Field(max_length=500, description="이미지 URL")
    image_type: str | None = Field(max_length=20, default='DETAIL', description="이미지 유형 (MAIN/DETAIL/THUMBNAIL/GALLERY/SPEC/PACKAGE)")
    display_order: int | None = Field(default=0, description="표시 순서")
    is_primary: bool | None = Field(default=False, description="대표 이미지 여부")
    alt_text: str | None = Field(None, max_length=200, description="대체 텍스트 (접근성)")
    file_name: str | None = Field(None, max_length=200, description="파일명")
    file_size: int | None = Field(None, description="파일 크기 (bytes)")
    mime_type: str | None = Field(None, max_length=50, description="MIME 타입 (image/jpeg, image/png 등)")
    width: int | None = Field(None, description="이미지 너비 (픽셀)")
    height: int | None = Field(None, description="이미지 높이 (픽셀)")
    description: str | None = Field(None, description="이미지 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductImagesCreate(ProductImagesBase):
    """Schema for creating ProductImages"""

    # Exclude auto-generated fields
    pass


class ProductImagesUpdate(BaseModel):
    """Schema for updating ProductImages (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    image_url: str | None = Field(None, max_length=500, description="이미지 URL")
    image_type: str | None = Field(max_length=20, default='DETAIL', description="이미지 유형 (MAIN/DETAIL/THUMBNAIL/GALLERY/SPEC/PACKAGE)")
    display_order: int | None = Field(default=0, description="표시 순서")
    is_primary: bool | None = Field(default=False, description="대표 이미지 여부")
    alt_text: str | None = Field(None, max_length=200, description="대체 텍스트 (접근성)")
    file_name: str | None = Field(None, max_length=200, description="파일명")
    file_size: int | None = Field(None, description="파일 크기 (bytes)")
    mime_type: str | None = Field(None, max_length=50, description="MIME 타입 (image/jpeg, image/png 등)")
    width: int | None = Field(None, description="이미지 너비 (픽셀)")
    height: int | None = Field(None, description="이미지 높이 (픽셀)")
    description: str | None = Field(None, description="이미지 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/PENDING)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductImagesResponse(ProductImagesBase):
    """Schema for ProductImages response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductImagesListResponse(BaseModel):
    """Schema for paginated ProductImages list response"""

    items: list[ProductImagesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductImagesBase",
    "ProductImagesCreate",
    "ProductImagesUpdate",
    "ProductImagesResponse",
    "ProductImagesListResponse",
]
