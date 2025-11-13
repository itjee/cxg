from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PayrollRecords"]


class PayrollRecords(TenantBaseModel):
    """급여 내역: 사원별 월별 급여 계산 및 지급 내역"""
    __tablename__ = "payroll_records"
    __table_args__ = {"schema": "hrm"}

    payroll_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 급여 번호 (자동 채번)
    payroll_date: Mapped[date] = mapped_column(Date, nullable=False)  # 급여 지급일
    payment_month: Mapped[str] = mapped_column(String(7), nullable=False)  # 귀속월 (YYYY-MM)
    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 사원 ID
    employee_code: Mapped[str | None] = mapped_column(String(50))  # 사원 코드 (스냅샷)
    employee_name: Mapped[str | None] = mapped_column(String(100))  # 사원명 (스냅샷)
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 부서 ID
    position_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.positions.id"))  # 직위 ID
    work_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 근무 일수
    work_hours: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2), nullable=False, default=0)  # 근무 시간
    overtime_hours: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2), nullable=False, default=0)  # 초과 근무 시간
    night_hours: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2), nullable=False, default=0)  # 야간 근무 시간
    holiday_hours: Mapped[Decimal] = mapped_column(Numeric(precision=10, scale=2), nullable=False, default=0)  # 휴일 근무 시간
    base_salary: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 기본급
    overtime_pay: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 초과근무수당
    night_pay: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 야간근무수당
    holiday_pay: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 휴일근무수당
    meal_allowance: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 식대
    transport_allowance: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 교통비
    position_allowance: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 직책수당
    other_allowances: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 기타수당
    total_allowances: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 총 수당
    gross_salary: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 총 급여 (지급액)
    income_tax: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 소득세
    resident_tax: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 주민세
    national_pension: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 국민연금
    health_insurance: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 건강보험
    long_term_care: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 장기요양보험
    employment_insurance: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 고용보험
    other_deductions: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 기타공제
    total_deductions: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 총 공제액
    net_salary: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 실 지급액
    payment_method: Mapped[str | None] = mapped_column(String(20))  # 지급 방법 (BANK_TRANSFER/CASH/CHECK)
    bank_name: Mapped[str | None] = mapped_column(String(100))  # 은행명
    account_number: Mapped[str | None] = mapped_column(String(100))  # 계좌번호
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False, default='PENDING')  # 지급 상태 (PENDING/APPROVED/PAID/CANCELLED)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime)  # 지급 일시
    journal_entry_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("fim.journal_entries.id"))  # 분개 ID (연결)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부