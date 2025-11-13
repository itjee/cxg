from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalaryStructures"]


class SalaryStructures(TenantBaseModel):
    """급여 구조: 직위/부서별 급여 체계 정의"""
    __tablename__ = "salary_structures"
    __table_args__ = {"schema": "hrm"}

    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 급여 구조 코드
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 급여 구조명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    position_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.positions.id"))  # 적용 직위 (선택)
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 적용 부서 (선택)
    employment_type: Mapped[str | None] = mapped_column(String(20))  # 고용 형태 (FULL_TIME/PART_TIME/CONTRACT/INTERN)
    base_salary: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 기본급
    currency_code: Mapped[str] = mapped_column(String(3), ForeignKey("adm.currencies.id"), nullable=False, default='KRW')  # 통화 코드
    payment_cycle: Mapped[str] = mapped_column(String(20), nullable=False, default='MONTHLY')  # 지급 주기 (DAILY/WEEKLY/BIWEEKLY/MONTHLY/ANNUAL)
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)  # 유효 시작일
    effective_to: Mapped[date | None] = mapped_column(Date)  # 유효 종료일
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부