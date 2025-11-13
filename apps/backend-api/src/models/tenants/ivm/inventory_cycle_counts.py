from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["InventoryCycleCounts"]


class InventoryCycleCounts(TenantBaseModel):
    """순환 재고 조사 관리 테이블"""
    __tablename__ = "inventory_cycle_counts"
    __table_args__ = {"schema": "ivm"}

    product_id: Mapped[str] = mapped_column(nullable=False)  # 제품 식별자
    warehouse_id: Mapped[str] = mapped_column(nullable=False)  # 창고 식별자
    abc_class: Mapped[str | None] = mapped_column()  # ABC 등급 (A: 고중요도, B: 중중요도, C: 저중요도)
    frequency_type: Mapped[str] = mapped_column(nullable=False)  # 빈도 유형 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY)
    frequency_value: Mapped[str] = mapped_column(nullable=False)  # 빈도 값 (예: 1=매일, 2=격일, 7=매주)
    last_count_date: Mapped[str | None] = mapped_column()  # 마지막 조사 일자
    last_count_id: Mapped[str | None] = mapped_column()  # 마지막 조사 식별자
    last_variance_qty: Mapped[str | None] = mapped_column()  # 마지막 차이 수량
    next_count_date: Mapped[str | None] = mapped_column()  # 다음 조사 예정일
    total_count_times: Mapped[str | None] = mapped_column(default=0)  # 총 조사 횟수
    variance_count_times: Mapped[str | None] = mapped_column()  # 차이 발생 횟수
    accuracy_rate: Mapped[str | None] = mapped_column()  # 정확도 (%)
    is_active: Mapped[str | None] = mapped_column(default=True)  # 활성 여부
    notes: Mapped[str | None] = mapped_column()  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()