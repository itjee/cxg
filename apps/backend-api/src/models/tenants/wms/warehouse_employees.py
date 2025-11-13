from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["WarehouseEmployees"]


class WarehouseEmployees(TenantBaseModel):
    """창고별 사원 배정 및 알림 설정 관리 테이블"""
    __tablename__ = "warehouse_employees"
    __table_args__ = {"schema": "wms"}

    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.employees.id"), nullable=False)  # 사원 식별자
    role_type: Mapped[str | None] = mapped_column(String(20), default='OPERATOR')  # 역할 유형 (MANAGER/SUPERVISOR/OPERATOR/PICKER/PACKER/LOADER/CHECKER/ADMIN)
    is_primary: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 주담당자 여부
    access_level: Mapped[str | None] = mapped_column(String(20), default='READ_write')  # 접근 권한 (read_only/read_write/admin/full_control)
    should_notify_receipt: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 입고 알림 여부
    should_notify_shipment: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 출고 알림 여부
    should_notify_cancel: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 취소 알림 여부
    should_notify_adjust: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 재고조정 알림 여부
    should_notify_emergency: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 긴급상황 알림 여부
    notify_method: Mapped[str | None] = mapped_column(String(20), default='EMAIL')  # 알림 방법 (EMAIL/SMS/PHONE/PUSH/ALL)
    notify_email: Mapped[str | None] = mapped_column(String(255))  # 알림용 이메일
    notify_phone: Mapped[str | None] = mapped_column(String(50))  # 알림용 전화번호
    work_shift: Mapped[str | None] = mapped_column(String(20))  # 근무 시간대 (DAY/NIGHT/SWING/ROTATING/FLEXIBLE)
    start_date: Mapped[date | None] = mapped_column(Date)  # 배정 시작일
    close_date: Mapped[date | None] = mapped_column(Date)  # 배정 종료일
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    REFERENCES: Mapped[str | None] = mapped_column()