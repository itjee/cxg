from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseOrderReceiptItems"]


class PurchaseOrderReceiptItems(TenantBaseModel):
    """구매발주 입고 품목 관리 테이블"""
    __tablename__ = "purchase_order_receipt_items"
    __table_args__ = {"schema": "psm"}

    receipt_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_order_receipts.id"), nullable=False)  # 입고 헤더 식별자
    line_no: Mapped[int] = mapped_column(Integer, nullable=False)  # 라인 번호 (1부터 시작)
    po_item_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_order_items.id"), nullable=False)  # 구매발주 품목 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    ordered_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 발주 수량
    received_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 입고 수량
    accepted_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 합격 수량 (검수 통과)
    rejected_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 불합격 수량 (검수 불통과)
    inspection_status: Mapped[str | None] = mapped_column(String(20), ForeignKey("ivm.warehouse_locations.id"), default='PENDING')  # 검수 상태 (PENDING/IN_PROGRESS/PASS/PARTIAL/FAIL)
    rejection_reason: Mapped[str | None] = mapped_column(Text)  # 불합격 사유
    location_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 입고 로케이션 식별자
    lot_no: Mapped[str | None] = mapped_column(String(100))  # LOT 번호
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()