"""
제품 가격 변경 이력 관리 테이블

Pydantic schemas for ProductPriceHistory model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class ProductPriceHistoryBase(BaseModel):
    """Base schema for ProductPriceHistory"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID = Field(description="제품 식별자")
    price_type: str = Field(max_length=20, description="가격 유형 (COST/SELL/MIN_SELL/SUPPLY/RETAIL)")
    old_price: Decimal | None = Field(None, description="변경 전 가격")
    new_price: Decimal = Field(description="변경 후 가격")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    effective_date: date = Field(description="적용 시작일")
    end_date: date | None = Field(None, description="적용 종료일")
    reason: str | None = Field(None, max_length=200, description="변경 사유")
    reason_type: str | None = Field(None, max_length=20, description="사유 유형 (PROMOTION/COST_CHANGE/MARKET/SEASONAL/POLICY/OTHER)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    description: str | None = Field(None, description="상세 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductPriceHistoryCreate(ProductPriceHistoryBase):
    """Schema for creating ProductPriceHistory"""

    # Exclude auto-generated fields
    pass


class ProductPriceHistoryUpdate(BaseModel):
    """Schema for updating ProductPriceHistory (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID | None = Field(None, description="제품 식별자")
    price_type: str | None = Field(None, max_length=20, description="가격 유형 (COST/SELL/MIN_SELL/SUPPLY/RETAIL)")
    old_price: Decimal | None = Field(None, description="변경 전 가격")
    new_price: Decimal | None = Field(None, description="변경 후 가격")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    effective_date: date | None = Field(None, description="적용 시작일")
    end_date: date | None = Field(None, description="적용 종료일")
    reason: str | None = Field(None, max_length=200, description="변경 사유")
    reason_type: str | None = Field(None, max_length=20, description="사유 유형 (PROMOTION/COST_CHANGE/MARKET/SEASONAL/POLICY/OTHER)")
    approved_by: UUID | None = Field(None, description="승인자 UUID")
    approved_at: datetime | None = Field(None, description="승인 일시")
    description: str | None = Field(None, description="상세 설명")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/EXPIRED/CANCELLED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class ProductPriceHistoryResponse(ProductPriceHistoryBase):
    """Schema for ProductPriceHistory response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class ProductPriceHistoryListResponse(BaseModel):
    """Schema for paginated ProductPriceHistory list response"""

    items: list[ProductPriceHistoryResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "ProductPriceHistoryBase",
    "ProductPriceHistoryCreate",
    "ProductPriceHistoryUpdate",
    "ProductPriceHistoryResponse",
    "ProductPriceHistoryListResponse",
]
