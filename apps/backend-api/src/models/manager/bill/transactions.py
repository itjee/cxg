"""거래(결제) 모델 (Bill - Transactions)"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    CHAR,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Transaction(BaseModel):
    """거래(결제) 모델 - 결제, 환불, 지불거절 거래 관리

    데이터베이스 스키마 (bill.transactions)와 동기화된 ORM 모델.
    """

    __tablename__ = "transactions"
    __table_args__ = (
        CheckConstraint(
            "transaction_type IN ('PAYMENT', 'REFUND', 'CHARGEBACK')",
            name="ck_transactions__transaction_type"
        ),
        CheckConstraint(
            "status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED')",
            name="ck_transactions__status"
        ),
        CheckConstraint(
            "payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'PAYPAL', 'KAKAOPAY', 'NAVERPAY')",
            name="ck_transactions__payment_method"
        ),
        CheckConstraint("amount > 0", name="ck_transactions__amount"),
        CheckConstraint(
            "exchange_rate IS NULL OR exchange_rate > 0",
            name="ck_transactions__exchange_rate"
        ),
        CheckConstraint(
            "(status = 'FAILED' AND failed_at IS NOT NULL) OR (status != 'FAILED')",
            name="ck_transactions__failure_logic"
        ),
        CheckConstraint(
            "(status = 'SUCCESS' AND processed_at IS NOT NULL) OR (status != 'SUCCESS')",
            name="ck_transactions__success_logic"
        ),
        {"schema": "bill"},
    )

    # BaseModel 제공 필드 (자동):
    # id: UUID (Primary Key)
    # created_at: datetime (TimestampMixin)
    # updated_at: datetime (TimestampMixin)
    # created_by: UUID | None (UserTrackingMixin)
    # updated_by: UUID | None (UserTrackingMixin)

    # ========== 관련 테이블 연결 ==========
    tenant_id: Mapped[UUID] = mapped_column(
        ForeignKey("tnnt.tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    invoice_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("bill.invoices.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    # ========== 거래 식별 정보 및 유형 ==========
    transaction_no: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True
    )

    transaction_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="PAYMENT",
        index=True
    )

    # ========== 결제 게이트웨이 정보 ==========
    payment_gateway: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    payment_gateway_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )

    # ========== 결제 금액 정보 ==========
    amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False
    )

    currency: Mapped[str] = mapped_column(
        CHAR(3),
        nullable=False,
        default="KRW"
    )

    exchange_rate: Mapped[Decimal | None] = mapped_column(
        Numeric(18, 6),
        nullable=True
    )

    # ========== 결제 수단 정보 ==========
    payment_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    card_digits: Mapped[str | None] = mapped_column(
        String(4),
        nullable=True
    )

    # ========== 처리 시간 정보 ==========
    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True
    )

    failed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True
    )

    failure_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # ========== 상태 관리 ==========
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="PENDING",
        index=True
    )

    deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        index=True
    )

    def __repr__(self) -> str:
        return f"<Transaction(id={self.id}, transaction_no={self.transaction_no}, status={self.status})>"
