from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Attendances"]


class Attendances(TenantBaseModel):
    """근태: 사원별 출퇴근 및 근무 시간 관리"""
    __tablename__ = "attendances"
    __table_args__ = {"schema": "hrm"}

    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 사원 ID
    attendance_date: Mapped[date] = mapped_column(Date, nullable=False)  # 근태 일자
    attendance_type: Mapped[str] = mapped_column(String(20), nullable=False, default='WORK')  # 근태 유형 (WORK/LEAVE/HOLIDAY/SICK_LEAVE/VACATION/BUSINESS_TRIP/ABSENT)
    work_hours: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2), default=0)  # 근무 시간
    overtime_hours: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2), default=0)  # 초과 근무 시간
    night_hours: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2), default=0)  # 야간 근무 시간
    late_minutes: Mapped[int | None] = mapped_column(Integer, default=0)  # 지각 시간 (분)
    early_leave_minutes: Mapped[int | None] = mapped_column(Integer, default=0)  # 조퇴 시간 (분)
    break_minutes: Mapped[int | None] = mapped_column(Integer, default=0)  # 휴게 시간 (분)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='NORMAL')  # 상태 (NORMAL/LATE/EARLY_LEAVE/ABSENT/APPROVED)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부