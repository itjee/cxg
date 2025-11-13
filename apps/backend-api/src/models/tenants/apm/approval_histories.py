from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ApprovalHistories"]


class ApprovalHistories(TenantBaseModel):
    """결재 이력 테이블"""
    __tablename__ = "approval_histories"
    __table_args__ = {"schema": "apm"}

    request_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("apm.approval_requests.id"), nullable=False)  # 결재 요청 식별자
    step_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 결재 단계
    approver_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 결재자 식별자
    action: Mapped[str] = mapped_column(String(20), nullable=False)  # 결재 행동 (APPROVED/REJECTED/RETURNED/DELEGATED)
    comment: Mapped[str | None] = mapped_column(Text)  # 의견
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, server_default=func.current_timestamp())  # 결재 일시
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()