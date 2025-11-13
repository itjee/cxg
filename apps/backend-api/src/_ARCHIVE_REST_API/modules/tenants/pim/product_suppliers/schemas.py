"""
제품 공급업체 관리 테이블

Pydantic schemas for ProductSuppliers model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductSuppliersBase(BaseModel):
    """Base schema for ProductSuppliers"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    supplier_id: UUID = Field(description="공급업체 식별자")
    supplier_code: str | None = Field(None, max_length=50, description="공급업체의 제품 코드")
    supplier_name: str | None = Field(None, max_length=200, description="공급업체의 제품명")
    supply_price: Decimal | None = Field(None, description="공급 가격")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    lead_time_days: int | None = Field(None, description="리드타임 (일수)")
    moq: Decimal | None = Field(None, description="최소 주문 수량 (Minimum Order Quantity)")
    moq_unit: str | None = Field(None, max_length=20, description="MOQ 단위")
    is_preferred: bool | None = Field(default=False, description="주 공급업체 여부")
    priority: int | None = Field(default=0, description="우선순위 (낮을수록 우선)")
    contract_start_date: date | None = Field(None, description="계약 시작일")
    contract_end_date: date | None = Field(None, description="계약 종료일")
    contract_no: str | None = Field(None, max_length=50, description="계약 번호")
    quality_rating: int | None = Field(None, description="품질 평가 (1-5점)")
    delivery_rating: int | None = Field(None, description="납기 평가 (1-5점)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductSuppliersCreate(ProductSuppliersBase):
    """Schema for creating ProductSuppliers"""

    # Exclude auto-generated fields
    pass


class ProductSuppliersUpdate(BaseModel):
    """Schema for updating ProductSuppliers (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    supplier_id: UUID | None = Field(None, description="공급업체 식별자")
    supplier_code: str | None = Field(None, max_length=50, description="공급업체의 제품 코드")
    supplier_name: str | None = Field(None, max_length=200, description="공급업체의 제품명")
    supply_price: Decimal | None = Field(None, description="공급 가격")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    lead_time_days: int | None = Field(None, description="리드타임 (일수)")
    moq: Decimal | None = Field(None, description="최소 주문 수량 (Minimum Order Quantity)")
    moq_unit: str | None = Field(None, max_length=20, description="MOQ 단위")
    is_preferred: bool | None = Field(default=False, description="주 공급업체 여부")
    priority: int | None = Field(default=0, description="우선순위 (낮을수록 우선)")
    contract_start_date: date | None = Field(None, description="계약 시작일")
    contract_end_date: date | None = Field(None, description="계약 종료일")
    contract_no: str | None = Field(None, max_length=50, description="계약 번호")
    quality_rating: int | None = Field(None, description="품질 평가 (1-5점)")
    delivery_rating: int | None = Field(None, description="납기 평가 (1-5점)")
    description: str | None = Field(None, description="설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductSuppliersResponse(ProductSuppliersBase):
    """Schema for ProductSuppliers response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductSuppliersListResponse(BaseModel):
    """Schema for paginated ProductSuppliers list response"""

    items: list[ProductSuppliersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductSuppliersBase",
    "ProductSuppliersCreate",
    "ProductSuppliersUpdate",
    "ProductSuppliersResponse",
    "ProductSuppliersListResponse",
]
