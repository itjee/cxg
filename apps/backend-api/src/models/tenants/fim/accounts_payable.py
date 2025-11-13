from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["AccountsPayable"]


class AccountsPayable(TenantBaseModel):
    """매입채무 정보 관리 테이블"""
    __tablename__ = "accounts_payable"
    __table_args__ = {"schema": "fim"}

    ap_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 매입채무 코드
    vendor_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 공급업체 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 채무 발생 일자
    due_date: Mapped[date] = mapped_column(Date, nullable=False)  # 지급 예정일
    payment_terms: Mapped[str | None] = mapped_column(String(50))  # 지급 조건 (NET30/NET60/COD 등)
    invoice_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 채무 발생 금액 (세금 포함)
    tax_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 세액
    paid_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 지급된 금액
    outstanding_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 미지급금 잔액
    discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 할인 금액
    currency: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 통화 (ISO 4217)
    reference_doc_type: Mapped[str | None] = mapped_column(String(50))  # 참조 문서 유형 (구매전표/세금계산서 등)
    reference_doc_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 참조 문서 식별자
    invoice_number: Mapped[str | None] = mapped_column(String(100))  # 송장 번호
    status: Mapped[str | None] = mapped_column(String(20), default='OPEN')  # 상태 (OPEN: 미지급/PARTIAL: 부분지급/PAID: 완료/OVERDUE: 연체/CANCELLED: 취소)
    last_payment_date: Mapped[date | None] = mapped_column(Date)  # 최근 지급 일자
    overdue_days: Mapped[int | None] = mapped_column(Integer, default=0)  # 연체 일수
    approval_status: Mapped[str | None] = mapped_column(String(20), default='PENDING')  # 승인 상태 (PENDING: 대기/APPROVED: 승인/REJECTED: 반려)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그