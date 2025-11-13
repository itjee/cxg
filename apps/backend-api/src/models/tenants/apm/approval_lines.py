from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ApprovalLines"]


class ApprovalLines(TenantBaseModel):
    """결재선 정의 테이블"""
    __tablename__ = "approval_lines"
    __table_args__ = {"schema": "apm"}

    line_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 결재선 코드
    line_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 결재선명
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 문서 유형 (PO/SO/LEAVE/EXPENSE 등)
    department_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 적용 부서 (NULL이면 전체)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 여부
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그