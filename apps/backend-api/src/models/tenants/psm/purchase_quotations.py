from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseQuotations"]


class PurchaseQuotations(TenantBaseModel):
    """구매 견적 헤더 관리 테이블"""
    __tablename__ = "purchase_quotations"
    __table_args__ = {"schema": "psm"}

    quotation_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 견적 번호 (업체 제공)
    quotation_date: Mapped[date] = mapped_column(Date, nullable=False)  # 견적 일자
    pr_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("psm.purchase_requisitions.id"))  # 구매요청 식별자 (견적 요청의 근거)
    supplier_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("csm.customers.id"), nullable=False)  # 공급업체 식별자
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 견적 상태 (DRAFT/SUBMITTED/REVIEWED/SELECTED/REJECTED/EXPIRED)
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)  # 견적 유효 시작일
    valid_to: Mapped[date] = mapped_column(Date, nullable=False)  # 견적 유효 종료일
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 견적 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 코드 (KRW, USD 등)
    delivery_terms: Mapped[str | None] = mapped_column(Text)  # 배송 조건
    payment_terms: Mapped[str | None] = mapped_column(Text)  # 결제 조건
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_selected: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 선택 여부 (채택된 견적)
    selected_at: Mapped[datetime | None] = mapped_column(DateTime)  # 선택 일시
    selected_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 선택자 UUID
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()