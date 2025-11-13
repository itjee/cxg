from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PaymentTransactions"]


class PaymentTransactions(TenantBaseModel):
    """입출금 거래 내역 관리 테이블"""
    __tablename__ = "payment_transactions"
    __table_args__ = {"schema": "fim"}

    transaction_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 거래 코드
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False)  # 거래 일자
    transaction_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 거래 유형 (RECEIPT: 입금/PAYMENT: 출금)
    payment_method: Mapped[str] = mapped_column(String(20), nullable=False)  # 결제 수단 (CASH: 현금/BANK_TRANSFER: 계좌이체/CREDIT_CARD: 신용카드/CHECK: 수표 등)
    payment_status: Mapped[str | None] = mapped_column(String(20), default='COMPLETED')  # 결제 상태 (PENDING: 대기/COMPLETED: 완료/CANCELLED: 취소/FAILED: 실패)
    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    partner_type: Mapped[str | None] = mapped_column(String(20))  # 거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)
    account_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fim.accounts.id"), nullable=False)  # 계정과목 식별자
    amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 거래 금액
    currency: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 통화 (ISO 4217)
    exchange_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=15, scale=6), default=1)  # 환율
    fee_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 수수료 금액
    reference_doc_type: Mapped[str | None] = mapped_column(String(50))  # 참조 문서 유형 (AR: 매출채권/AP: 매입채무/기타)
    reference_doc_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 참조 문서 식별자
    reference_number: Mapped[str | None] = mapped_column(String(100))  # 참조 번호
    bank_name: Mapped[str | None] = mapped_column(String(100))  # 은행명
    bank_account: Mapped[str | None] = mapped_column(String(50))  # 은행 계좌 번호
    bank_account_holder: Mapped[str | None] = mapped_column(String(100))  # 예금주명
    card_number: Mapped[str | None] = mapped_column(String(20))  # 카드 번호 (마스킹 처리)
    description: Mapped[str | None] = mapped_column(Text)  # 거래 설명
    memo: Mapped[str | None] = mapped_column(Text)  # 메모
    approval_code: Mapped[str | None] = mapped_column(String(50))  # 승인 코드 (카드 거래)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    status: Mapped[str | None] = mapped_column(String(20), default='COMPLETED')  # 상태 (COMPLETED: 완료/CANCELLED: 취소/PENDING: 대기/FAILED: 실패)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그