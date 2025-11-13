"""청구서 모델 (Bill - Invoices)"""

from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import CHAR, Boolean, Date, ForeignKey, Integer, Numeric, String, DateTime, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Invoice(BaseModel):
    """청구서 모델 - 테넌트별 월간/주기별 청구서 관리

    데이터베이스 스키마 (bill.invoices)와 동기화된 ORM 모델.
    """

    __tablename__ = "invoices"
    __table_args__ = (
        CheckConstraint(
            "status IN ('PENDING', 'SENT', 'PAID', 'OVERDUE', 'CANCELED')",
            name="ck_invoices__status"
        ),
        CheckConstraint(
            "payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'WIRE_TRANSFER', 'CHECK', NULL)",
            name="ck_invoices__payment_method"
        ),
        CheckConstraint("base_amount >= 0", name="ck_invoices__base_amount"),
        CheckConstraint("usage_amount >= 0", name="ck_invoices__usage_amount"),
        CheckConstraint("discount_amount >= 0", name="ck_invoices__discount_amount"),
        CheckConstraint("tax_amount >= 0", name="ck_invoices__tax_amount"),
        CheckConstraint("total_amount >= 0", name="ck_invoices__total_amount"),
        CheckConstraint("user_count > 0", name="ck_invoices__user_count"),
        CheckConstraint("used_storage >= 0", name="ck_invoices__used_storage"),
        CheckConstraint("api_calls >= 0", name="ck_invoices__api_calls"),
        CheckConstraint("due_date >= invoice_date AND close_date >= start_date", name="ck_invoices__date_sequence"),
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

    subscription_id: Mapped[UUID] = mapped_column(
        ForeignKey("tnnt.subscriptions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ========== 청구서 기본 정보 ==========
    invoice_no: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
        index=True
    )

    invoice_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    due_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    close_date: Mapped[date] = mapped_column(Date, nullable=False)

    # ========== 청구 금액 정보 ==========
    base_amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False
    )

    usage_amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False,
        default=Decimal("0")
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False,
        default=Decimal("0")
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False,
        default=Decimal("0")
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False
    )

    currency: Mapped[str] = mapped_column(
        CHAR(3),
        nullable=False,
        default="KRW"
    )

    # ========== 사용량 상세 정보 ==========
    user_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    used_storage: Mapped[Decimal] = mapped_column(
        Numeric(18, 4),
        nullable=False,
        default=Decimal("0")
    )

    api_calls: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    # ========== 결제 정보 ==========
    paid_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True),
        default=None
    )

    payment_method: Mapped[str | None] = mapped_column(
        String(50),
        default=None
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
        return f"<Invoice(id={self.id}, invoice_no={self.invoice_no}, status={self.status})>"
