"""
프로모션 사용 이력 테이블 - 판매주문에서 적용된 프로모션 기록

Pydantic schemas for PromotionUsage model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PromotionUsageBase(BaseModel):
    """Base schema for PromotionUsage"""
    model_config = ConfigDict(from_attributes=True)

    promotion_id: UUID = Field(description="프로모션 식별자")
    sales_order_id: UUID = Field(description="판매주문 식별자")
    sales_order_item_id: UUID | None = Field(None, description="판매주문 항목 식별자 (NULL이면 전체 주문에 적용)")
    discount_applied: Decimal = Field(description="실제 적용된 할인액")
    discount_percentage: Decimal | None = Field(None, description="실제 적용된 할인율")
    applied_at: datetime = Field(description="프로모션 적용 일시")


class PromotionUsageCreate(PromotionUsageBase):
    """Schema for creating PromotionUsage"""

    # Exclude auto-generated fields
    pass


class PromotionUsageUpdate(BaseModel):
    """Schema for updating PromotionUsage (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    promotion_id: UUID | None = Field(None, description="프로모션 식별자")
    sales_order_id: UUID | None = Field(None, description="판매주문 식별자")
    sales_order_item_id: UUID | None = Field(None, description="판매주문 항목 식별자 (NULL이면 전체 주문에 적용)")
    discount_applied: Decimal | None = Field(None, description="실제 적용된 할인액")
    discount_percentage: Decimal | None = Field(None, description="실제 적용된 할인율")
    applied_at: datetime | None = Field(None, description="프로모션 적용 일시")


class PromotionUsageResponse(PromotionUsageBase):
    """Schema for PromotionUsage response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PromotionUsageListResponse(BaseModel):
    """Schema for paginated PromotionUsage list response"""

    items: list[PromotionUsageResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PromotionUsageBase",
    "PromotionUsageCreate",
    "PromotionUsageUpdate",
    "PromotionUsageResponse",
    "PromotionUsageListResponse",
]
