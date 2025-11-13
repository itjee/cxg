from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["CategoryManagers"]


class CategoryManagers(TenantBaseModel):
    """카테고리 담당자 이력 관리 테이블"""
    __tablename__ = "category_managers"
    __table_args__ = {"schema": "pim"}

    category_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.categories.id"), nullable=False)  # 카테고리 식별자
    employee_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 담당자 식별자
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # 담당 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 담당 종료일
    manager_type: Mapped[str | None] = mapped_column(String(20), default='PRIMARY')  # 담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING/ANALYST)
    description: Mapped[str | None] = mapped_column(Text)  # 담당 업무/역할
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그