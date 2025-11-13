from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["CustomerSegmentMembers"]


class CustomerSegmentMembers(TenantBaseModel):
    """고객 세그먼트 회원 관리 테이블"""
    __tablename__ = "customer_segment_members"
    __table_args__ = {"schema": "crm"}

    segment_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customer_segments.id"), nullable=False)  # 세그먼트 ID
    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 ID
    assigned_date: Mapped[date] = mapped_column(Date, nullable=False)  # 할당일
    assigned_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 할당자 UUID
    assignment_type: Mapped[str | None] = mapped_column(String(20), default='MANUAL')  # 할당 유형 (MANUAL: 수동, AUTO: 자동, IMPORT: 가져오기)
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 여부
    notes: Mapped[str | None] = mapped_column(Text)  # 비고