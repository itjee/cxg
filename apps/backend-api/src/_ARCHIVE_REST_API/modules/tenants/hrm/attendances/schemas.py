"""
근태: 사원별 출퇴근 및 근무 시간 관리

Pydantic schemas for Attendances model.
Auto-generated on 2025-10-24 23:26:33
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class AttendancesBase(BaseModel):
    """Base schema for Attendances"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID = Field(description="사원 ID")
    attendance_date: date = Field(description="근태 일자")
    attendance_type: str = Field(max_length=20, default='WORK', description="근태 유형 (WORK/LEAVE/HOLIDAY/SICK_LEAVE/VACATION/BUSINESS_TRIP/ABSENT)")
    work_hours: Decimal | None = Field(default=0, description="근무 시간")
    overtime_hours: Decimal | None = Field(default=0, description="초과 근무 시간")
    night_hours: Decimal | None = Field(default=0, description="야간 근무 시간")
    late_minutes: int | None = Field(default=0, description="지각 시간 (분)")
    early_leave_minutes: int | None = Field(default=0, description="조퇴 시간 (분)")
    break_minutes: int | None = Field(default=0, description="휴게 시간 (분)")
    status: str = Field(max_length=20, default='NORMAL', description="상태 (NORMAL/LATE/EARLY_LEAVE/ABSENT/APPROVED)")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool = Field(default=False, description="삭제 여부")


class AttendancesCreate(AttendancesBase):
    """Schema for creating Attendances"""

    # Exclude auto-generated fields
    pass


class AttendancesUpdate(BaseModel):
    """Schema for updating Attendances (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    employee_id: UUID | None = Field(None, description="사원 ID")
    attendance_date: date | None = Field(None, description="근태 일자")
    attendance_type: str | None = Field(max_length=20, default='WORK', description="근태 유형 (WORK/LEAVE/HOLIDAY/SICK_LEAVE/VACATION/BUSINESS_TRIP/ABSENT)")
    work_hours: Decimal | None = Field(default=0, description="근무 시간")
    overtime_hours: Decimal | None = Field(default=0, description="초과 근무 시간")
    night_hours: Decimal | None = Field(default=0, description="야간 근무 시간")
    late_minutes: int | None = Field(default=0, description="지각 시간 (분)")
    early_leave_minutes: int | None = Field(default=0, description="조퇴 시간 (분)")
    break_minutes: int | None = Field(default=0, description="휴게 시간 (분)")
    status: str | None = Field(max_length=20, default='NORMAL', description="상태 (NORMAL/LATE/EARLY_LEAVE/ABSENT/APPROVED)")
    notes: str | None = Field(None, description="비고")
    is_deleted: bool | None = Field(default=False, description="삭제 여부")


class AttendancesResponse(AttendancesBase):
    """Schema for Attendances response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class AttendancesListResponse(BaseModel):
    """Schema for paginated Attendances list response"""

    items: list[AttendancesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "AttendancesBase",
    "AttendancesCreate",
    "AttendancesUpdate",
    "AttendancesResponse",
    "AttendancesListResponse",
]
