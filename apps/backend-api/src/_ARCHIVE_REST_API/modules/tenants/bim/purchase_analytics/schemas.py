"""
구매 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)

Pydantic schemas for PurchaseAnalytics model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PurchaseAnalyticsBase(BaseModel):
    """Base schema for PurchaseAnalytics"""
    model_config = ConfigDict(from_attributes=True)

    period: str = Field(max_length=7, description="분석 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    vendor_id: UUID | None = Field(None, description="공급업체 식별자")
    vendor_category: str | None = Field(None, max_length=50, description="공급업체 분류")
    item_category_id: UUID | None = Field(None, description="품목 카테고리 식별자")
    item_id: UUID | None = Field(None, description="품목 식별자")
    buyer_id: UUID | None = Field(None, description="구매 담당자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    purchase_amount: Decimal | None = Field(default=0, description="구매액")
    purchase_qty: int | None = Field(default=0, description="구매 수량")
    order_count: int | None = Field(default=0, description="발주 건수")
    return_amount: Decimal | None = Field(default=0, description="반품액")
    return_qty: int | None = Field(default=0, description="반품 수량")
    discount_amount: Decimal | None = Field(default=0, description="할인액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    exchange_rate: Decimal | None = Field(default=1, description="환율")
    avg_order_value: Decimal | None = Field(None, description="평균 발주 금액")
    avg_unit_price: Decimal | None = Field(None, description="평균 단가")
    avg_lead_time_days: Decimal | None = Field(None, description="평균 리드타임 (일)")
    defect_qty: int | None = Field(default=0, description="불량 수량")
    defect_rate: Decimal | None = Field(None, description="불량률 (%)")
    on_time_delivery_rate: Decimal | None = Field(None, description="정시 납품률 (%)")
    yoy_growth_rate: Decimal | None = Field(None, description="전년 대비 성장률 (%)")
    mom_growth_rate: Decimal | None = Field(None, description="전월 대비 성장률 (%)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    AND: time | None = None


class PurchaseAnalyticsCreate(PurchaseAnalyticsBase):
    """Schema for creating PurchaseAnalytics"""

    # Exclude auto-generated fields
    pass


class PurchaseAnalyticsUpdate(BaseModel):
    """Schema for updating PurchaseAnalytics (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    period: str | None = Field(None, max_length=7, description="분석 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    vendor_id: UUID | None = Field(None, description="공급업체 식별자")
    vendor_category: str | None = Field(None, max_length=50, description="공급업체 분류")
    item_category_id: UUID | None = Field(None, description="품목 카테고리 식별자")
    item_id: UUID | None = Field(None, description="품목 식별자")
    buyer_id: UUID | None = Field(None, description="구매 담당자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    purchase_amount: Decimal | None = Field(default=0, description="구매액")
    purchase_qty: int | None = Field(default=0, description="구매 수량")
    order_count: int | None = Field(default=0, description="발주 건수")
    return_amount: Decimal | None = Field(default=0, description="반품액")
    return_qty: int | None = Field(default=0, description="반품 수량")
    discount_amount: Decimal | None = Field(default=0, description="할인액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    exchange_rate: Decimal | None = Field(default=1, description="환율")
    avg_order_value: Decimal | None = Field(None, description="평균 발주 금액")
    avg_unit_price: Decimal | None = Field(None, description="평균 단가")
    avg_lead_time_days: Decimal | None = Field(None, description="평균 리드타임 (일)")
    defect_qty: int | None = Field(default=0, description="불량 수량")
    defect_rate: Decimal | None = Field(None, description="불량률 (%)")
    on_time_delivery_rate: Decimal | None = Field(None, description="정시 납품률 (%)")
    yoy_growth_rate: Decimal | None = Field(None, description="전년 대비 성장률 (%)")
    mom_growth_rate: Decimal | None = Field(None, description="전월 대비 성장률 (%)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    AND: time | None = None


class PurchaseAnalyticsResponse(PurchaseAnalyticsBase):
    """Schema for PurchaseAnalytics response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PurchaseAnalyticsListResponse(BaseModel):
    """Schema for paginated PurchaseAnalytics list response"""

    items: list[PurchaseAnalyticsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PurchaseAnalyticsBase",
    "PurchaseAnalyticsCreate",
    "PurchaseAnalyticsUpdate",
    "PurchaseAnalyticsResponse",
    "PurchaseAnalyticsListResponse",
]
