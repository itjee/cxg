from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseOrderReceipts"]


class PurchaseOrderReceipts(TenantBaseModel):
    """구매발주 입고 헤더 관리 테이블"""
    __tablename__ = "purchase_order_receipts"
    __table_args__ = {"schema": "psm"}

    receipt_no: Mapped[str] = mapped_column(String(50), nullable=False)  # 입고 번호
    receipt_date: Mapped[date] = mapped_column(Date, nullable=False)  # 입고 일자
    po_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("psm.purchase_orders.id"), nullable=False)  # 구매발주 식별자
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("ivm.warehouses.id"), nullable=False)  # 입고 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("ivm.warehouse_locations.id"))  # 입고 로케이션 식별자
    delivery_note_no: Mapped[str | None] = mapped_column(String(50))  # 배송 전표 번호
    carrier: Mapped[str | None] = mapped_column(String(100))  # 배송 업체명
    tracking_no: Mapped[str | None] = mapped_column(String(100))  # 송장 번호
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='DRAFT')  # 입고 상태 (DRAFT/IN_PROGRESS/INSPECTING/COMPLETED/REJECTED)
    inspected_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 검수자 UUID
    inspected_at: Mapped[datetime | None] = mapped_column(DateTime)  # 검수 일시
    inspection_result: Mapped[str | None] = mapped_column(String(20))  # 검수 결과 (PASS/PARTIAL/FAIL)
    inspection_notes: Mapped[str | None] = mapped_column(Text)  # 검수 비고 (불량 사유 등)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()