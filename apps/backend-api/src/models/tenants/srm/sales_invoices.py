from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesInvoices"]


class SalesInvoices(TenantBaseModel):
    """판매송장 헤더 관리 테이블"""
    __tablename__ = "sales_invoices"
    __table_args__ = {"schema": "srm"}

    si_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 송장 코드 (SI 번호)
    so_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"))  # 판매주문 ID (참조)
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 고객 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    warehouse_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouses.id"))  # 출고 창고 식별자
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/CONFIRMED/SHIPPED/COMPLETED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
