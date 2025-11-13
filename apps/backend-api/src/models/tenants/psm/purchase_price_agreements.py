from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchasePriceAgreements"]


class PurchasePriceAgreements(TenantBaseModel):
    """구매 가격 계약 관리 테이블"""
    __tablename__ = "purchase_price_agreements"
    __table_args__ = {"schema": "psm"}

    agreement_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 계약 번호
    agreement_date: Mapped[date] = mapped_column(Date, nullable=False)  # 계약 일자
    supplier_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("csm.customers.id"), nullable=False)  # 공급업체 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    unit_price: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 계약 단가
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 코드 (KRW, USD 등)
    min_order_qty: Mapped[int | None] = mapped_column(Integer)  # 최소 주문 수량
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)  # 계약 유효 시작일
    valid_to: Mapped[date] = mapped_column(Date, nullable=False)  # 계약 유효 종료일
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 계약 상태 (DRAFT/ACTIVE/EXPIRED/TERMINATED)
    payment_terms: Mapped[str | None] = mapped_column(Text)  # 결제 조건
    delivery_terms: Mapped[str | None] = mapped_column(Text)  # 배송 조건
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()