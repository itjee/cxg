from uuid import UUID as PyUUID
from datetime import time
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseAnalytics"]


class PurchaseAnalytics(TenantBaseModel):
    """구매 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)"""
    __tablename__ = "purchase_analytics"
    __table_args__ = {"schema": "bim"}

    period: Mapped[str] = mapped_column(String(7), nullable=False)  # 분석 기간 (YYYY-MM)
    fiscal_year: Mapped[str | None] = mapped_column(String(4))  # 회계 연도
    quarter: Mapped[str | None] = mapped_column(String(2))  # 분기 (Q1/Q2/Q3/Q4)
    vendor_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 공급업체 식별자
    vendor_category: Mapped[str | None] = mapped_column(String(50))  # 공급업체 분류
    item_category_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 품목 카테고리 식별자
    item_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 품목 식별자
    buyer_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 구매 담당자 식별자
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 부서 식별자
    purchase_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 구매액
    purchase_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 구매 수량
    order_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 발주 건수
    return_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 반품액
    return_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 반품 수량
    discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 할인액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=15, scale=6), default=1)  # 환율
    avg_order_value: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 평균 발주 금액
    avg_unit_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 평균 단가
    avg_lead_time_days: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=1))  # 평균 리드타임 (일)
    defect_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 불량 수량
    defect_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 불량률 (%)
    on_time_delivery_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 정시 납품률 (%)
    yoy_growth_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 전년 대비 성장률 (%)
    mom_growth_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 전월 대비 성장률 (%)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    AND: Mapped[time | None] = mapped_column(Time)