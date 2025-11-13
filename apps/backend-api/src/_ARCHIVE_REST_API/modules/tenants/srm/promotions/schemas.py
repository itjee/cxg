"""
판매 프로모션/할인 관리 테이블 - 프로모션 및 할인 정책 관리

Pydantic schemas for Promotions model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PromotionsBase(BaseModel):
    """Base schema for Promotions"""
    model_config = ConfigDict(from_attributes=True)

    promotion_code: str = Field(max_length=50, description="프로모션 코드 (고유)")
    promotion_name: str = Field(max_length=200, description="프로모션명")
    promotion_type: str = Field(max_length=30, description="프로모션 유형 (DISCOUNT_PERCENT: 할인율, DISCOUNT_AMOUNT: 할인액, BUY_X_GET_Y: 묶음할인, BUNDLE: 번들, SEASONAL: 시즌할인, OTHER: 기타)")
    description: str | None = Field(None, description="프로모션 설명/상세 조건")
    discount_percent: Decimal | None = Field(None, description="할인율 (%, 예: 10.5)")
    discount_amount: Decimal | None = Field(None, description="할인액 (원화)")
    min_order_amount: Decimal | None = Field(None, description="최소 주문액 (이 금액 이상일 때만 적용)")
    max_discount_amount: Decimal | None = Field(None, description="최대 할인액 (할인이 이 금액을 초과하지 않음)")
    customer_segment_id: UUID | None = Field(None, description="고객 세그먼트 식별자 (NULL이면 전체 고객)")
    product_id: UUID | None = Field(None, description="제품 식별자 (NULL이면 전체 상품)")
    start_date: date = Field(description="프로모션 시작일")
    end_date: date | None = Field(None, description="프로모션 종료일 (NULL이면 무기한)")
    priority: int | None = Field(default=0, description="우선순위 (높을수록 먼저 적용, 여러 프로모션 중복 시 사용)")
    is_active: bool | None = Field(default=True, description="활성 여부 (false: 일시 중단, 기간과 관계없이 적용 안 됨)")
    is_deleted: bool = Field(default=False, description="논리 삭제 플래그")


class PromotionsCreate(PromotionsBase):
    """Schema for creating Promotions"""

    # Exclude auto-generated fields
    pass


class PromotionsUpdate(BaseModel):
    """Schema for updating Promotions (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    promotion_code: str | None = Field(None, max_length=50, description="프로모션 코드 (고유)")
    promotion_name: str | None = Field(None, max_length=200, description="프로모션명")
    promotion_type: str | None = Field(None, max_length=30, description="프로모션 유형 (DISCOUNT_PERCENT: 할인율, DISCOUNT_AMOUNT: 할인액, BUY_X_GET_Y: 묶음할인, BUNDLE: 번들, SEASONAL: 시즌할인, OTHER: 기타)")
    description: str | None = Field(None, description="프로모션 설명/상세 조건")
    discount_percent: Decimal | None = Field(None, description="할인율 (%, 예: 10.5)")
    discount_amount: Decimal | None = Field(None, description="할인액 (원화)")
    min_order_amount: Decimal | None = Field(None, description="최소 주문액 (이 금액 이상일 때만 적용)")
    max_discount_amount: Decimal | None = Field(None, description="최대 할인액 (할인이 이 금액을 초과하지 않음)")
    customer_segment_id: UUID | None = Field(None, description="고객 세그먼트 식별자 (NULL이면 전체 고객)")
    product_id: UUID | None = Field(None, description="제품 식별자 (NULL이면 전체 상품)")
    start_date: date | None = Field(None, description="프로모션 시작일")
    end_date: date | None = Field(None, description="프로모션 종료일 (NULL이면 무기한)")
    priority: int | None = Field(default=0, description="우선순위 (높을수록 먼저 적용, 여러 프로모션 중복 시 사용)")
    is_active: bool | None = Field(default=True, description="활성 여부 (false: 일시 중단, 기간과 관계없이 적용 안 됨)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class PromotionsResponse(PromotionsBase):
    """Schema for Promotions response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PromotionsListResponse(BaseModel):
    """Schema for paginated Promotions list response"""

    items: list[PromotionsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PromotionsBase",
    "PromotionsCreate",
    "PromotionsUpdate",
    "PromotionsResponse",
    "PromotionsListResponse",
]
