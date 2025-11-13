from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Quotations"]


class Quotations(TenantBaseModel):
    """판매 견적서 헤더 관리 테이블"""
    __tablename__ = "quotations"
    __table_args__ = {"schema": "srm"}

    quote_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 견적서 코드 (견적번호)
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 고객 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    valid_until: Mapped[date | None] = mapped_column(Date)  # 유효기간 만료일
    sales_person_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 영업 담당자 식별자
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그