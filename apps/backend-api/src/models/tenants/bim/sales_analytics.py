from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesAnalytics"]


class SalesAnalytics(TenantBaseModel):
    """매출 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)"""
    __tablename__ = "sales_analytics"
    __table_args__ = {"schema": "bim"}

    period: Mapped[str] = mapped_column(String(7), nullable=False)  # 분석 기간 (YYYY-MM)
    fiscal_year: Mapped[str | None] = mapped_column(String(4))  # 회계 연도
    quarter: Mapped[str | None] = mapped_column(String(2))  # 분기 (Q1/Q2/Q3/Q4)
    customer_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 고객 식별자
    customer_segment: Mapped[str | None] = mapped_column(String(50))  # 고객 세그먼트
    item_category_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 품목 카테고리 식별자
    item_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 품목 식별자
    sales_person_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 영업 담당자 식별자
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 부서 식별자
    region_code: Mapped[str | None] = mapped_column(String(50))  # 지역 코드
    sales_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 매출액
    sales_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 매출 수량
    order_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 주문 건수
    cost_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 원가
    gross_profit: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 매출 총이익
    gross_profit_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 매출 총이익률 (%)
    return_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 반품액
    return_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 반품 수량
    discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 할인액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=15, scale=6), default=1)  # 환율
    avg_order_value: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 평균 주문 금액 (AOV)
    avg_unit_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 평균 단가
    yoy_growth_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 전년 대비 성장률 (%)
    mom_growth_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 전월 대비 성장률 (%)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그