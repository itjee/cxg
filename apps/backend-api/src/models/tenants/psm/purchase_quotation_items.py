from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseQuotationItems"]


class PurchaseQuotationItems(TenantBaseModel):
    """구매 견적 품목 관리 테이블"""
    __tablename__ = "purchase_quotation_items"
    __table_args__ = {"schema": "psm"}

    quotation_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_quotations.id"), nullable=False)  # 견적 헤더 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호 (1부터 시작)
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    description: Mapped[str | None] = mapped_column(Text)  # 품목 설명 (특이사항 등)
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 견적 수량
    unit_price: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 단가
    total_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 총 금액 (qty × unit_price)
    lead_time_days: Mapped[int | None] = mapped_column(Integer)  # 납기 (일)
    min_order_qty: Mapped[int | None] = mapped_column(Integer)  # 최소 주문 수량
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()