from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey, DateTime, JSON, func
from datetime import date, datetime

from ..base import TenantBaseModel

__all__ = ["Tasks"]


class Tasks(TenantBaseModel):
    """워크플로우 작업 테이블"""
    __tablename__ = "tasks"
    __table_args__ = {"schema": "lwm"}

    workflow_id: Mapped[PyUUID] = mapped_column(ForeignKey("lwm.workflows.id"), nullable=False)  # 워크플로우 ID
    step_id: Mapped[PyUUID] = mapped_column(ForeignKey("lwm.steps.id"), nullable=False)  # 단계 ID
    request_id: Mapped[PyUUID | None] = mapped_column()  # 요청 ID (승인 요청 참조)
    assigned_to: Mapped[PyUUID | None] = mapped_column()  # 할당 대상 (사용자 ID)
    assigned_group: Mapped[PyUUID | None] = mapped_column()  # 할당 그룹 (그룹 ID)
    task_status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)  # 작업 상태 (pending, in_progress, completed, rejected)
    priority: Mapped[str] = mapped_column(String(20), default="normal", nullable=False)  # 우선순위 (low, normal, high, urgent)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))  # 마감일
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))  # 완료일
    completed_by: Mapped[PyUUID | None] = mapped_column()  # 완료자
    comments: Mapped[str | None] = mapped_column(Text)  # 의견/코멘트
    config: Mapped[dict | None] = mapped_column(JSON)  # 작업 설정 (JSON)
    created_by: Mapped[PyUUID | None] = mapped_column(nullable=True)  # 생성자
    updated_by: Mapped[PyUUID | None] = mapped_column(nullable=True)  # 수정자
