from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesDeliveryItems"]


class SalesDeliveryItems(TenantBaseModel):
    """판매 출고/배송 품목 관리 테이블"""
    __tablename__ = "sales_delivery_items"
    __table_args__ = {"schema": "srm"}

    delivery_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.sales_deliveries.id"), nullable=False)  # 출고 헤더 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호
    so_item_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.sales_order_items.id"), nullable=False)  # 판매주문 품목 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    description: Mapped[str | None] = mapped_column(Text)  # 품목 설명
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 출고 수량