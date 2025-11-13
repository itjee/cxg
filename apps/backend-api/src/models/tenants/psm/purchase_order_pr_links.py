from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseOrderPrLinks"]


class PurchaseOrderPrLinks(TenantBaseModel):
    """구매요청-발주 연결 관리 테이블 (하나의 PR이 여러 PO로 분할 가능)"""
    __tablename__ = "purchase_order_pr_links"
    __table_args__ = {"schema": "psm"}

    po_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_orders.id"), nullable=False)  # 구매발주 식별자
    po_item_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_order_items.id"), nullable=False)  # 구매발주 품목 식별자
    pr_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_requisitions.id"), nullable=False)  # 구매요청 식별자
    pr_item_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_requisition_items.id"), nullable=False)  # 구매요청 품목 식별자
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 연결된 수량 (PR 품목 수량 중 해당 PO에 포함된 수량)
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()