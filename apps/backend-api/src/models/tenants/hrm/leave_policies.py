from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["LeavePolicies"]


class LeavePolicies(TenantBaseModel):
    """휴가 정책 관리 테이블 - 연차, 병가, 출산휴가 등 휴가 정책 정의"""
    __tablename__ = "leave_policies"
    __table_args__ = {"schema": "hrm"}

    leave_type: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)  # 휴가 유형 (ANNUAL: 연차, SICK: 병가, MATERNITY: 출산휴가, UNPAID: 무급)
    leave_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 휴가명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    entitled_days_per_year: Mapped[int | None] = mapped_column(Integer)  # 연간 부여 일수 (NULL이면 무제한)
    is_paid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 유급 여부 (true: 유급, false: 무급)
    validity_years: Mapped[int | None] = mapped_column(Integer, default=2)  # 유효 기간 (연, 연차는 일반적으로 2년)
    is_carryover_allowed: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 이월 가능 여부
    carryover_max_days: Mapped[int | None] = mapped_column(Integer)  # 이월 최대 일수 (NULL이면 무제한)
    is_compensation_required: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 미사용 보상금 필요 여부
    compensation_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2), default=100)  # 보상금 비율 (%)
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 여부
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그