"""
급여 내역: 사원별 월별 급여 계산 및 지급 내역

Pydantic schemas for PayrollRecords model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class PayrollRecordsBase(BaseModel):
    """Base schema for PayrollRecords"""
    model_config = ConfigDict(from_attributes=True)

    payroll_no: str = Field(max_length=50, description="급여 번호 (자동 채번)")
    payroll_date: date = Field(description="급여 지급일")
    payment_month: str = Field(max_length=7, description="귀속월 (YYYY-MM)")
    employee_id: UUID = Field(description="사원 ID")
    employee_code: str | None = Field(None, max_length=50, description="사원 코드 (스냅샷)")
    employee_name: str | None = Field(None, max_length=100, description="사원명 (스냅샷)")
    department_id: UUID | None = Field(None, description="부서 ID")
    position_id: UUID | None = Field(None, description="직위 ID")
    work_days: int = Field(default=0, description="근무 일수")
    work_hours: Decimal = Field(default=0, description="근무 시간")
    overtime_hours: Decimal = Field(default=0, description="초과 근무 시간")
    night_hours: Decimal = Field(default=0, description="야간 근무 시간")
    holiday_hours: Decimal = Field(default=0, description="휴일 근무 시간")
    base_salary: Decimal = Field(default=0, description="기본급")
    overtime_pay: Decimal = Field(default=0, description="초과근무수당")
    night_pay: Decimal = Field(default=0, description="야간근무수당")
    holiday_pay: Decimal = Field(default=0, description="휴일근무수당")
    meal_allowance: Decimal = Field(default=0, description="식대")
    transport_allowance: Decimal = Field(default=0, description="교통비")
    position_allowance: Decimal = Field(default=0, description="직책수당")
    other_allowances: Decimal = Field(default=0, description="기타수당")
    total_allowances: Decimal = Field(default=0, description="총 수당")
    gross_salary: Decimal = Field(default=0, description="총 급여 (지급액)")
    income_tax: Decimal = Field(default=0, description="소득세")
    resident_tax: Decimal = Field(default=0, description="주민세")
    national_pension: Decimal = Field(default=0, description="국민연금")
    health_insurance: Decimal = Field(default=0, description="건강보험")
    long_term_care: Decimal = Field(default=0, description="장기요양보험")
    employment_insurance: Decimal = Field(default=0, description="고용보험")
    other_deductions: Decimal = Field(default=0, description="기타공제")
    total_deductions: Decimal = Field(default=0, description="총 공제액")
    net_salary: Decimal = Field(default=0, description="실 지급액")
    payment_method: str | None = Field(None, max_length=20, description="지급 방법 (BANK_TRANSFER/CASH/CHECK)")
    bank_name: str | None = Field(None, max_length=100, description="은행명")
    account_number: str | None = Field(None, max_length=100, description="계좌번호")
    payment_status: str = Field(max_length=20, default='PENDING', description="지급 상태 (PENDING/APPROVED/PAID/CANCELLED)")
    paid_at: datetime | None = Field(None, description="지급 일시")
    journal_entry_id: UUID | None = Field(None, description="분개 ID (연결)")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class PayrollRecordsCreate(PayrollRecordsBase):
    """Schema for creating PayrollRecords"""

    # Exclude auto-generated fields
    pass


class PayrollRecordsUpdate(BaseModel):
    """Schema for updating PayrollRecords (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    payroll_no: str | None = Field(None, max_length=50, description="급여 번호 (자동 채번)")
    payroll_date: date | None = Field(None, description="급여 지급일")
    payment_month: str | None = Field(None, max_length=7, description="귀속월 (YYYY-MM)")
    employee_id: UUID | None = Field(None, description="사원 ID")
    employee_code: str | None = Field(None, max_length=50, description="사원 코드 (스냅샷)")
    employee_name: str | None = Field(None, max_length=100, description="사원명 (스냅샷)")
    department_id: UUID | None = Field(None, description="부서 ID")
    position_id: UUID | None = Field(None, description="직위 ID")
    work_days: int | None = Field(default=0, description="근무 일수")
    work_hours: Decimal | None = Field(default=0, description="근무 시간")
    overtime_hours: Decimal | None = Field(default=0, description="초과 근무 시간")
    night_hours: Decimal | None = Field(default=0, description="야간 근무 시간")
    holiday_hours: Decimal | None = Field(default=0, description="휴일 근무 시간")
    base_salary: Decimal | None = Field(default=0, description="기본급")
    overtime_pay: Decimal | None = Field(default=0, description="초과근무수당")
    night_pay: Decimal | None = Field(default=0, description="야간근무수당")
    holiday_pay: Decimal | None = Field(default=0, description="휴일근무수당")
    meal_allowance: Decimal | None = Field(default=0, description="식대")
    transport_allowance: Decimal | None = Field(default=0, description="교통비")
    position_allowance: Decimal | None = Field(default=0, description="직책수당")
    other_allowances: Decimal | None = Field(default=0, description="기타수당")
    total_allowances: Decimal | None = Field(default=0, description="총 수당")
    gross_salary: Decimal | None = Field(default=0, description="총 급여 (지급액)")
    income_tax: Decimal | None = Field(default=0, description="소득세")
    resident_tax: Decimal | None = Field(default=0, description="주민세")
    national_pension: Decimal | None = Field(default=0, description="국민연금")
    health_insurance: Decimal | None = Field(default=0, description="건강보험")
    long_term_care: Decimal | None = Field(default=0, description="장기요양보험")
    employment_insurance: Decimal | None = Field(default=0, description="고용보험")
    other_deductions: Decimal | None = Field(default=0, description="기타공제")
    total_deductions: Decimal | None = Field(default=0, description="총 공제액")
    net_salary: Decimal | None = Field(default=0, description="실 지급액")
    payment_method: str | None = Field(None, max_length=20, description="지급 방법 (BANK_TRANSFER/CASH/CHECK)")
    bank_name: str | None = Field(None, max_length=100, description="은행명")
    account_number: str | None = Field(None, max_length=100, description="계좌번호")
    payment_status: str | None = Field(max_length=20, default='PENDING', description="지급 상태 (PENDING/APPROVED/PAID/CANCELLED)")
    paid_at: datetime | None = Field(None, description="지급 일시")
    journal_entry_id: UUID | None = Field(None, description="분개 ID (연결)")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class PayrollRecordsResponse(PayrollRecordsBase):
    """Schema for PayrollRecords response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class PayrollRecordsListResponse(BaseModel):
    """Schema for paginated PayrollRecords list response"""

    items: list[PayrollRecordsResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "PayrollRecordsBase",
    "PayrollRecordsCreate",
    "PayrollRecordsUpdate",
    "PayrollRecordsResponse",
    "PayrollRecordsListResponse",
]
