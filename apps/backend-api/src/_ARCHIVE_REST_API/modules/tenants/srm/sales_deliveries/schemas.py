"""
판매 출고/배송 헤더 관리 테이블

Pydantic schemas for SalesDeliveries model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesDeliveriesBase(BaseModel):
    """Base schema for SalesDeliveries"""
    model_config = ConfigDict(from_attributes=True)

    delivery_code: str = Field(max_length=50, description="출고 코드 (출고번호)")
    so_id: UUID = Field(description="판매주문 식별자")
    customer_id: UUID = Field(description="고객 식별자")
    doc_date: date = Field(description="전표 일자")
    delivery_date: date | None = Field(None, description="실제 배송일")
    warehouse_id: UUID = Field(description="출고 창고 식별자")
    tracking_no: str | None = Field(None, max_length=100, description="송장 번호")
    carrier: str | None = Field(None, max_length=100, description="배송업체")
    shipping_address: str | None = Field(None, description="배송 주소")
    shipping_contact: str | None = Field(None, max_length=100, description="배송 연락처")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/PACKED/SHIPPED/DELIVERED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesDeliveriesCreate(SalesDeliveriesBase):
    """Schema for creating SalesDeliveries"""

    # Exclude auto-generated fields
    pass


class SalesDeliveriesUpdate(BaseModel):
    """Schema for updating SalesDeliveries (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    delivery_code: str | None = Field(None, max_length=50, description="출고 코드 (출고번호)")
    so_id: UUID | None = Field(None, description="판매주문 식별자")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    doc_date: date | None = Field(None, description="전표 일자")
    delivery_date: date | None = Field(None, description="실제 배송일")
    warehouse_id: UUID | None = Field(None, description="출고 창고 식별자")
    tracking_no: str | None = Field(None, max_length=100, description="송장 번호")
    carrier: str | None = Field(None, max_length=100, description="배송업체")
    shipping_address: str | None = Field(None, description="배송 주소")
    shipping_contact: str | None = Field(None, max_length=100, description="배송 연락처")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/PACKED/SHIPPED/DELIVERED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    notes: str | None = Field(None, description="비고")


class SalesDeliveriesResponse(SalesDeliveriesBase):
    """Schema for SalesDeliveries response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesDeliveriesListResponse(BaseModel):
    """Schema for paginated SalesDeliveries list response"""

    items: list[SalesDeliveriesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesDeliveriesBase",
    "SalesDeliveriesCreate",
    "SalesDeliveriesUpdate",
    "SalesDeliveriesResponse",
    "SalesDeliveriesListResponse",
]
