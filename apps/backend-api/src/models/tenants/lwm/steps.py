from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey, JSON
from datetime import datetime

from ..base import TenantBaseModel

__all__ = ["Steps"]


class Steps(TenantBaseModel):
    """워크플로우 단계 테이블"""
    __tablename__ = "steps"
    __table_args__ = {"schema": "lwm"}

    workflow_id: Mapped[PyUUID] = mapped_column(ForeignKey("lwm.workflows.id"), nullable=False)  # 워크플로우 ID
    step_number: Mapped[int] = mapped_column(nullable=False)  # 단계 번호
    name: Mapped[str] = mapped_column(String(255), nullable=False)  # 단계명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    step_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 단계 유형 (sequential, parallel, conditional)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 작업 유형 (approve, reject, review, etc)
    required_approvers: Mapped[int | None] = mapped_column(default=1)  # 필요한 승인자 수
    timeout_days: Mapped[int | None] = mapped_column()  # 타임아웃 (일 수)
    config: Mapped[dict | None] = mapped_column(JSON)  # 단계 설정 (JSON)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # 활성 여부
    created_by: Mapped[PyUUID | None] = mapped_column(nullable=True)  # 생성자
    updated_by: Mapped[PyUUID | None] = mapped_column(nullable=True)  # 수정자
