from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesReturnItems"]


class SalesReturnItems(TenantBaseModel):
    """판매 반품 품목 관리 테이블"""
    __tablename__ = "sales_return_items"
    __table_args__ = {"schema": "srm"}

    return_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.sales_returns.id"), nullable=False)  # 반품 헤더 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호
    delivery_item_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_delivery_items.id"))  # 출고 품목 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    description: Mapped[str | None] = mapped_column(Text)  # 품목 설명
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 반품 수량
    unit_price: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 단가
    discount_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2), default=0)  # 할인율 (%)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 총 금액 (수량 × 단가 × (1 - 할인율))
    reason_code: Mapped[str | None] = mapped_column(String(20))  # 반품 사유 코드
    reason_desc: Mapped[str | None] = mapped_column(Text)  # 반품 사유 설명