from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["TicketComments"]


class TicketComments(TenantBaseModel):
    """지원 티켓의 댓글 및 처리 이력 관리 테이블"""
    __tablename__ = "ticket_comments"
    __table_args__ = {"schema": "asm"}

    ticket_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("asm.support_tickets.id"), nullable=False)  # 티켓 식별자
    comment_text: Mapped[str] = mapped_column(Text, nullable=False)  # 댓글 내용
    comment_type: Mapped[str | None] = mapped_column(String(20), default='COMMENT')  # 댓글 유형 (COMMENT: 일반댓글/STATUS_CHANGE: 상태변경/ASSIGNMENT: 담당자배정)
    is_internal: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 내부 메모 여부 (true: 내부용, false: 고객 공개)
    attachments: Mapped[dict | None] = mapped_column(JSON)  # 첨부파일 정보 (JSON 배열 형식: [{"name": "file.pdf", "url": "..."}])
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그