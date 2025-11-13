from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["CustomerFeedback"]


class CustomerFeedback(TenantBaseModel):
    """고객 피드백/평가 관리 테이블 - 고객 만족도, 피드백 의견 관리"""
    __tablename__ = "customer_feedback"
    __table_args__ = {"schema": "asm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    transaction_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 거래 유형 (SALE: 판매, SERVICE: 서비스, SUPPORT: 지원)
    transaction_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 거래 식별자 (판매주문, 서비스, 티켓 등)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 별점 (1-5, 1: 매우 불만족, 5: 매우 만족)
    comment: Mapped[str | None] = mapped_column(Text)  # 피드백 의견
    feedback_categories: Mapped[str | None] = mapped_column(String(100))  # 피드백 카테고리 배열 (예: {품질, 배송})
    response_text: Mapped[str | None] = mapped_column(Text)  # 회신 내용
    response_by: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 회신자 직원 UUID
    response_date: Mapped[datetime | None] = mapped_column(DateTime)  # 회신 일시
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='NEW')  # 상태 (NEW: 신규, REVIEWED: 검토, RESPONDED: 회신, CLOSED: 종결)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그