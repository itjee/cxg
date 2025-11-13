"""
창고별 사원 배정 및 알림 설정 관리 테이블

Pydantic schemas for WarehouseEmployees model.
Auto-generated on 2025-10-24 23:26:42
"""

from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID


class WarehouseEmployeesBase(BaseModel):
    """Base schema for WarehouseEmployees"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID = Field(description="창고 식별자")
    employee_id: UUID = Field(description="사원 식별자")
    role_type: str | None = Field(max_length=20, default='OPERATOR', description="역할 유형 (MANAGER/SUPERVISOR/OPERATOR/PICKER/PACKER/LOADER/CHECKER/ADMIN)")
    is_primary: bool | None = Field(default=False, description="주담당자 여부")
    access_level: str | None = Field(max_length=20, default='READ_write', description="접근 권한 (read_only/read_write/admin/full_control)")
    should_notify_receipt: bool | None = Field(default=True, description="입고 알림 여부")
    should_notify_shipment: bool | None = Field(default=True, description="출고 알림 여부")
    should_notify_cancel: bool | None = Field(default=True, description="취소 알림 여부")
    should_notify_adjust: bool | None = Field(default=False, description="재고조정 알림 여부")
    should_notify_emergency: bool | None = Field(default=True, description="긴급상황 알림 여부")
    notify_method: str | None = Field(max_length=20, default='EMAIL', description="알림 방법 (EMAIL/SMS/PHONE/PUSH/ALL)")
    notify_email: str | None = Field(None, max_length=255, description="알림용 이메일")
    notify_phone: str | None = Field(None, max_length=50, description="알림용 전화번호")
    work_shift: str | None = Field(None, max_length=20, description="근무 시간대 (DAY/NIGHT/SWING/ROTATING/FLEXIBLE)")
    start_date: date | None = Field(None, description="배정 시작일")
    close_date: date | None = Field(None, description="배정 종료일")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None


class WarehouseEmployeesCreate(WarehouseEmployeesBase):
    """Schema for creating WarehouseEmployees"""

    # Exclude auto-generated fields
    pass


class WarehouseEmployeesUpdate(BaseModel):
    """Schema for updating WarehouseEmployees (all fields optional)"""
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: UUID | None = Field(None, description="창고 식별자")
    employee_id: UUID | None = Field(None, description="사원 식별자")
    role_type: str | None = Field(max_length=20, default='OPERATOR', description="역할 유형 (MANAGER/SUPERVISOR/OPERATOR/PICKER/PACKER/LOADER/CHECKER/ADMIN)")
    is_primary: bool | None = Field(default=False, description="주담당자 여부")
    access_level: str | None = Field(max_length=20, default='READ_write', description="접근 권한 (read_only/read_write/admin/full_control)")
    should_notify_receipt: bool | None = Field(default=True, description="입고 알림 여부")
    should_notify_shipment: bool | None = Field(default=True, description="출고 알림 여부")
    should_notify_cancel: bool | None = Field(default=True, description="취소 알림 여부")
    should_notify_adjust: bool | None = Field(default=False, description="재고조정 알림 여부")
    should_notify_emergency: bool | None = Field(default=True, description="긴급상황 알림 여부")
    notify_method: str | None = Field(max_length=20, default='EMAIL', description="알림 방법 (EMAIL/SMS/PHONE/PUSH/ALL)")
    notify_email: str | None = Field(None, max_length=255, description="알림용 이메일")
    notify_phone: str | None = Field(None, max_length=50, description="알림용 전화번호")
    work_shift: str | None = Field(None, max_length=20, description="근무 시간대 (DAY/NIGHT/SWING/ROTATING/FLEXIBLE)")
    start_date: date | None = Field(None, description="배정 시작일")
    close_date: date | None = Field(None, description="배정 종료일")
    notes: str | None = Field(None, description="비고")
    status: str | None = Field(max_length=20, default='ACTIVE', description="상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)")
    is_deleted: bool | None = Field(default=False, description="논리 삭제 플래그")
    REFERENCES: str | None = None


class WarehouseEmployeesResponse(WarehouseEmployeesBase):
    """Schema for WarehouseEmployees response"""

    id: UUID
    tenant_id: UUID
    created_at: datetime
    updated_at: datetime | None = None
    created_by: UUID | None = None
    updated_by: UUID | None = None


class WarehouseEmployeesListResponse(BaseModel):
    """Schema for paginated WarehouseEmployees list response"""

    items: list[WarehouseEmployeesResponse]
    total: int
    page: int = 1
    page_size: int = 50
    total_pages: int


__all__ = [
    "WarehouseEmployeesBase",
    "WarehouseEmployeesCreate",
    "WarehouseEmployeesUpdate",
    "WarehouseEmployeesResponse",
    "WarehouseEmployeesListResponse",
]
