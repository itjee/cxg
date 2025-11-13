"""
판매주문 품목 관리 테이블

Pydantic schemas for SalesOrderItems model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesOrderItemsBase(BaseModel):
    """Base schema for SalesOrderItems"""
    model_config = ConfigDict(from_attributes=True)

    so_id: UUID = Field(description="판매주문 헤더 식별자")
    line_no: int = Field(description="라인 번호")
    product_id: UUID = Field(description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int = Field(description="주문 수량")
    unit_price: Decimal = Field(description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal = Field(description="총 금액 (수량 × 단가 × (1 - 할인율))")
    shipped_qty: int | None = Field(default=0, description="출고 완료 수량")


class SalesOrderItemsCreate(SalesOrderItemsBase):
    """Schema for creating SalesOrderItems"""

    # Exclude auto-generated fields
    pass


class SalesOrderItemsUpdate(BaseModel):
    """Schema for updating SalesOrderItems (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    so_id: UUID | None = Field(None, description="판매주문 헤더 식별자")
    line_no: int | None = Field(None, description="라인 번호")
    product_id: UUID | None = Field(None, description="제품 식별자")
    description: str | None = Field(None, description="품목 설명")
    qty: int | None = Field(None, description="주문 수량")
    unit_price: Decimal | None = Field(None, description="단가")
    discount_rate: Decimal | None = Field(default=0, description="할인율 (%)")
    total_amount: Decimal | None = Field(None, description="총 금액 (수량 × 단가 × (1 - 할인율))")
    shipped_qty: int | None = Field(default=0, description="출고 완료 수량")


class SalesOrderItemsResponse(SalesOrderItemsBase):
    """Schema for SalesOrderItems response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesOrderItemsListResponse(BaseModel):
    """Schema for paginated SalesOrderItems list response"""

    items: list[SalesOrderItemsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesOrderItemsBase",
    "SalesOrderItemsCreate",
    "SalesOrderItemsUpdate",
    "SalesOrderItemsResponse",
    "SalesOrderItemsListResponse",
]
