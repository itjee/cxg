from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PurchaseOrders"]


class PurchaseOrders(TenantBaseModel):
    """구매발주 헤더 관리 테이블"""
    __tablename__ = "purchase_orders"
    __table_args__ = {"schema": "psm"}

    po_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 구매발주 코드 (PO-YYYYMMDD-001)
    vendor_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 공급업체 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    delivery_date: Mapped[date | None] = mapped_column(Date)  # 납품 희망일
    warehouse_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouses.id"))  # 입고 창고 식별자
    payment_terms: Mapped[str | None] = mapped_column(String(20))  # 결제 조건 (COD/NET30/NET60/NET90 등)
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액 (모든 라인의 합계)
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217 - KRW/USD/JPY 등)
    status: Mapped[str | None] = mapped_column(String(20), ForeignKey("hrm.employees.id"), default='DRAFT')  # 상태 (DRAFT/APPROVED/ORDERED/RECEIVING/COMPLETED/CANCELLED)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()