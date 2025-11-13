"""
판매주문 헤더 관리 테이블

Pydantic schemas for SalesOrders model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesOrdersBase(BaseModel):
    """Base schema for SalesOrders"""
    model_config = ConfigDict(from_attributes=True)

    so_code: str = Field(max_length=50, description="판매주문 코드 (SO 번호)")
    customer_id: UUID = Field(description="고객 식별자")
    doc_date: date = Field(description="전표 일자")
    delivery_date: date | None = Field(None, description="납품 희망일")
    warehouse_id: UUID | None = Field(None, description="출고 창고 식별자")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    payment_terms: str | None = Field(None, max_length=20, description="결제 조건 (COD/NET30/NET60 등)")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SalesOrdersCreate(SalesOrdersBase):
    """Schema for creating SalesOrders"""

    # Exclude auto-generated fields
    pass


class SalesOrdersUpdate(BaseModel):
    """Schema for updating SalesOrders (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    so_code: str | None = Field(None, max_length=50, description="판매주문 코드 (SO 번호)")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    doc_date: date | None = Field(None, description="전표 일자")
    delivery_date: date | None = Field(None, description="납품 희망일")
    warehouse_id: UUID | None = Field(None, description="출고 창고 식별자")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    payment_terms: str | None = Field(None, max_length=20, description="결제 조건 (COD/NET30/NET60 등)")
    total_amount: Decimal | None = Field(default=0, description="총 금액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    status: str | None = Field(max_length=20, default='DRAFT', description="상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SalesOrdersResponse(SalesOrdersBase):
    """Schema for SalesOrders response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesOrdersListResponse(BaseModel):
    """Schema for paginated SalesOrders list response"""

    items: list[SalesOrdersResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesOrdersBase",
    "SalesOrdersCreate",
    "SalesOrdersUpdate",
    "SalesOrdersResponse",
    "SalesOrdersListResponse",
]
