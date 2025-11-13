from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ApprovalRequests"]


class ApprovalRequests(TenantBaseModel):
    """결재 요청 테이블"""
    __tablename__ = "approval_requests"
    __table_args__ = {"schema": "apm"}

    request_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 결재 요청 코드
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 문서 유형 (PO/SO/LEAVE/EXPENSE 등)
    document_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 문서 식별자
    requester_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 요청자 식별자
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 요청 부서
    line_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("apm.approval_lines.id"))  # 사용된 결재선
    current_step: Mapped[int | None] = mapped_column(Integer, default=1)  # 현재 결재 단계
    subject: Mapped[str] = mapped_column(String(500), nullable=False)  # 제목
    content: Mapped[str | None] = mapped_column(Text)  # 내용
    status: Mapped[str | None] = mapped_column(String(20), default='PENDING')  # 결재 상태 (PENDING/IN_PROGRESS/APPROVED/REJECTED/CANCELLED)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 완료 일시
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()