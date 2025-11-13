from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["TaxInvoiceLines"]


class TaxInvoiceLines(TenantBaseModel):
    """세금계산서 상세: 품목별 공급가액 및 세액"""
    __tablename__ = "tax_invoice_lines"
    __table_args__ = {"schema": "fim"}

    tax_invoice_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("fim.tax_invoices.id"), nullable=False)  # 세금계산서 ID
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호
    product_code: Mapped[str | None] = mapped_column(String(50))  # 품목 코드
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 품목명
    product_spec: Mapped[str | None] = mapped_column(String(200))  # 규격
    unit: Mapped[str | None] = mapped_column(String(20))  # 단위
    quantity: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False, default=0)  # 수량
    unit_price: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 단가
    supply_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 공급가액
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 세액
    total_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False, default=0)  # 합계금액
    remark: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 삭제 여부