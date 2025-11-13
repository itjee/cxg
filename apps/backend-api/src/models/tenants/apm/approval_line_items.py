from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ApprovalLineItems"]


class ApprovalLineItems(TenantBaseModel):
    """결재선 상세 테이블"""
    __tablename__ = "approval_line_items"
    __table_args__ = {"schema": "apm"}

    line_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("apm.approval_lines.id"), nullable=False)  # 결재선 식별자
    step_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 결재 단계 번호
    approver_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 결재자 식별자
    approver_type: Mapped[str | None] = mapped_column(String(20), default='EMPLOYEE')  # 결재자 유형 (EMPLOYEE/POSITION/DEPARTMENT)
    is_required: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 필수 결재 여부
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()