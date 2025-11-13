"""
매출 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)

Pydantic schemas for SalesAnalytics model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class SalesAnalyticsBase(BaseModel):
    """Base schema for SalesAnalytics"""
    model_config = ConfigDict(from_attributes=True)

    period: str = Field(max_length=7, description="분석 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    customer_segment: str | None = Field(None, max_length=50, description="고객 세그먼트")
    item_category_id: UUID | None = Field(None, description="품목 카테고리 식별자")
    item_id: UUID | None = Field(None, description="품목 식별자")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    region_code: str | None = Field(None, max_length=50, description="지역 코드")
    sales_amount: Decimal | None = Field(default=0, description="매출액")
    sales_qty: int | None = Field(default=0, description="매출 수량")
    order_count: int | None = Field(default=0, description="주문 건수")
    cost_amount: Decimal | None = Field(default=0, description="원가")
    gross_profit: Decimal | None = Field(default=0, description="매출 총이익")
    gross_profit_rate: Decimal | None = Field(None, description="매출 총이익률 (%)")
    return_amount: Decimal | None = Field(default=0, description="반품액")
    return_qty: int | None = Field(default=0, description="반품 수량")
    discount_amount: Decimal | None = Field(default=0, description="할인액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    exchange_rate: Decimal | None = Field(default=1, description="환율")
    avg_order_value: Decimal | None = Field(None, description="평균 주문 금액 (AOV)")
    avg_unit_price: Decimal | None = Field(None, description="평균 단가")
    yoy_growth_rate: Decimal | None = Field(None, description="전년 대비 성장률 (%)")
    mom_growth_rate: Decimal | None = Field(None, description="전월 대비 성장률 (%)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SalesAnalyticsCreate(SalesAnalyticsBase):
    """Schema for creating SalesAnalytics"""

    # Exclude auto-generated fields
    pass


class SalesAnalyticsUpdate(BaseModel):
    """Schema for updating SalesAnalytics (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    period: str | None = Field(None, max_length=7, description="분석 기간 (YYYY-MM)")
    fiscal_year: str | None = Field(None, max_length=4, description="회계 연도")
    quarter: str | None = Field(None, max_length=2, description="분기 (Q1/Q2/Q3/Q4)")
    customer_id: UUID | None = Field(None, description="고객 식별자")
    customer_segment: str | None = Field(None, max_length=50, description="고객 세그먼트")
    item_category_id: UUID | None = Field(None, description="품목 카테고리 식별자")
    item_id: UUID | None = Field(None, description="품목 식별자")
    sales_person_id: UUID | None = Field(None, description="영업 담당자 식별자")
    department_id: UUID | None = Field(None, description="부서 식별자")
    region_code: str | None = Field(None, max_length=50, description="지역 코드")
    sales_amount: Decimal | None = Field(default=0, description="매출액")
    sales_qty: int | None = Field(default=0, description="매출 수량")
    order_count: int | None = Field(default=0, description="주문 건수")
    cost_amount: Decimal | None = Field(default=0, description="원가")
    gross_profit: Decimal | None = Field(default=0, description="매출 총이익")
    gross_profit_rate: Decimal | None = Field(None, description="매출 총이익률 (%)")
    return_amount: Decimal | None = Field(default=0, description="반품액")
    return_qty: int | None = Field(default=0, description="반품 수량")
    discount_amount: Decimal | None = Field(default=0, description="할인액")
    currency: str | None = Field(max_length=3, default='KRW', description="통화 (ISO 4217)")
    exchange_rate: Decimal | None = Field(default=1, description="환율")
    avg_order_value: Decimal | None = Field(None, description="평균 주문 금액 (AOV)")
    avg_unit_price: Decimal | None = Field(None, description="평균 단가")
    yoy_growth_rate: Decimal | None = Field(None, description="전년 대비 성장률 (%)")
    mom_growth_rate: Decimal | None = Field(None, description="전월 대비 성장률 (%)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")


class SalesAnalyticsResponse(SalesAnalyticsBase):
    """Schema for SalesAnalytics response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class SalesAnalyticsListResponse(BaseModel):
    """Schema for paginated SalesAnalytics list response"""

    items: list[SalesAnalyticsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "SalesAnalyticsBase",
    "SalesAnalyticsCreate",
    "SalesAnalyticsUpdate",
    "SalesAnalyticsResponse",
    "SalesAnalyticsListResponse",
]
