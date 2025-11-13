from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseRequisitionItems"]


class PurchaseRequisitionItems(TenantBaseModel):
    """구매요청 품목 관리 테이블"""
    __tablename__ = "purchase_requisition_items"
    __table_args__ = {"schema": "psm"}

    pr_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_requisitions.id"), nullable=False)  # 구매요청 헤더 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호 (1부터 시작)
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    description: Mapped[str | None] = mapped_column(Text)  # 품목 설명 (특이사항 등)
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 요청 수량
    unit_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 단가
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액 (qty × unit_price)
    required_date: Mapped[date | None] = mapped_column(Date)  # 필요 일자 (납품 요청일)
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()