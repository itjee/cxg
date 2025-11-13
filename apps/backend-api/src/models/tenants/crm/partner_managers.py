from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PartnerManagers"]


class PartnerManagers(TenantBaseModel):
    """거래처 담당자 배정 관리 테이블 - 자사 영업/관리 담당자 매핑"""
    __tablename__ = "partner_managers"
    __table_args__ = {"schema": "crm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 거래처 식별자
    employee_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 담당 사원 식별자
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # 담당 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 담당 종료일 (NULL이면 현재 담당 중)
    manager_type: Mapped[str] = mapped_column(String(20), nullable=False, default='PRIMARY')  # 담당자 유형 (PRIMARY: 주담당, SECONDARY: 부담당, BACKUP: 백업, TECHNICAL: 기술, SALES: 영업, SUPPORT: 지원)
    description: Mapped[str | None] = mapped_column(Text)  # 담당 업무/역할
    notes: Mapped[str | None] = mapped_column(Text)  # 비고/메모
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 상태 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 종료)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그