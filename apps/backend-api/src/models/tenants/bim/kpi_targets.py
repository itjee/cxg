from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["KpiTargets"]


class KpiTargets(TenantBaseModel):
    """KPI 목표값 및 실적 관리 테이블"""
    __tablename__ = "kpi_targets"
    __table_args__ = {"schema": "bim"}

    kpi_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("bim.kpi_definitions.id"), nullable=False)  # KPI 정의 식별자
    target_period: Mapped[str] = mapped_column(String(7), nullable=False)  # 목표 기간 (YYYY-MM)
    fiscal_year: Mapped[str | None] = mapped_column(String(4))  # 회계 연도
    quarter: Mapped[str | None] = mapped_column(String(2))  # 분기 (Q1/Q2/Q3/Q4)
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 부서 식별자
    user_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 사용자 식별자
    team_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 팀 식별자
    target_value: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 목표값
    actual_value: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 실적값
    achievement_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 달성률 (%)
    status: Mapped[str | None] = mapped_column(String(20), default='IN_PROGRESS')  # 상태 (NOT_STARTED: 미시작/IN_PROGRESS: 진행중/ACHIEVED: 달성/NOT_ACHIEVED: 미달성/EXCEEDED: 초과달성/CANCELLED: 취소)
    performance_grade: Mapped[str | None] = mapped_column(String(10))  # 성과 등급 (S/A/B/C/D/F)
    variance_value: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 편차값 (실적-목표)
    variance_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 편차율 (%)
    start_date: Mapped[date | None] = mapped_column(Date)  # 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 종료일
    last_measured_at: Mapped[datetime | None] = mapped_column(DateTime)  # 최종 측정 일시
    comments: Mapped[str | None] = mapped_column(Text)  # 코멘트/메모
    action_plan: Mapped[str | None] = mapped_column(Text)  # 실행 계획
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그