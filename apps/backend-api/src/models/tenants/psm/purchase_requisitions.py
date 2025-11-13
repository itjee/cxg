from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseRequisitions"]


class PurchaseRequisitions(TenantBaseModel):
    """구매요청 헤더 관리 테이블"""
    __tablename__ = "purchase_requisitions"
    __table_args__ = {"schema": "psm"}

    pr_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 구매요청 코드 (PR-YYYYMMDD-001)
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    requester_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("hrm.employees.id"), nullable=False)  # 요청자 식별자
    department_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.departments.id"))  # 부서 식별자
    required_date: Mapped[date | None] = mapped_column(Date)  # 필요 일자 (납품 요청일)
    purpose: Mapped[str | None] = mapped_column(Text)  # 구매 목적
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액 (모든 라인의 합계)
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217 - KRW/USD/JPY 등)
    status: Mapped[str | None] = mapped_column(String(20), ForeignKey("hrm.employees.id"), default='DRAFT')  # 상태 (DRAFT/SUBMITTED/APPROVED/REJECTED/ORDERED)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()