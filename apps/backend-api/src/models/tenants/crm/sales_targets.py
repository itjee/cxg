from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["SalesTargets"]


class SalesTargets(TenantBaseModel):
    """영업 목표 및 실적 관리 테이블"""
    __tablename__ = "sales_targets"
    __table_args__ = {"schema": "crm"}

    target_code: Mapped[str] = mapped_column(nullable=False)  # 목표 코드 (고유번호)
    name: Mapped[str] = mapped_column(nullable=False)  # 목표명
    description: Mapped[str | None] = mapped_column()  # 설명
    target_type: Mapped[str] = mapped_column(nullable=False)  # 목표 유형 (INDIVIDUAL: 개인, TEAM: 팀, DEPARTMENT: 부서, COMPANY: 회사)
    employee_id: Mapped[str | None] = mapped_column(ForeignKey("hrm.employees.id"))  # 대상 직원 UUID
    team_id: Mapped[str | None] = mapped_column(ForeignKey("hrm.departments.id"))  # 대상 팀/부서 UUID
    period_type: Mapped[str] = mapped_column(nullable=False)  # 기간 유형 (MONTH: 월별, QUARTER: 분기별, YEAR: 연도별, CUSTOM: 사용자 정의)
    start_date: Mapped[str] = mapped_column(nullable=False)  # 시작일
    end_date: Mapped[str] = mapped_column(nullable=False)  # 종료일
    year: Mapped[str] = mapped_column(nullable=False)  # 연도
    quarter: Mapped[str | None] = mapped_column()  # 분기 (1-4)
    month: Mapped[str | None] = mapped_column()  # 월 (1-12)
    target_revenue: Mapped[str | None] = mapped_column(default=0)  # 목표 매출
    actual_revenue: Mapped[str | None] = mapped_column(default=0)  # 실제 매출
    revenue_achievement_rate: Mapped[str | None] = mapped_column(default=0)  # 매출 달성률 (%)
    target_deals: Mapped[str | None] = mapped_column(default=0)  # 목표 계약 건수
    actual_deals: Mapped[str | None] = mapped_column(default=0)  # 실제 계약 건수
    deals_achievement_rate: Mapped[str | None] = mapped_column(default=0)  # 건수 달성률 (%)
    target_leads: Mapped[str | None] = mapped_column(default=0)  # 목표 리드 수
    actual_leads: Mapped[str | None] = mapped_column(default=0)  # 실제 리드 수
    target_opportunities: Mapped[str | None] = mapped_column(default=0)  # 목표 영업기회 수
    actual_opportunities: Mapped[str | None] = mapped_column(default=0)  # 실제 영업기회 수
    target_conversion_rate: Mapped[str | None] = mapped_column()  # 목표 전환율 (%)
    actual_conversion_rate: Mapped[str | None] = mapped_column()  # 실제 전환율 (%)
    currency: Mapped[str | None] = mapped_column(default='KRW')  # 통화 (ISO 4217)
    status: Mapped[str | None] = mapped_column(default='ACTIVE')  # 상태 (ACTIVE: 활성, COMPLETED: 완료, CANCELLED: 취소)
    is_deleted: Mapped[str | None] = mapped_column(default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column()  # 비고