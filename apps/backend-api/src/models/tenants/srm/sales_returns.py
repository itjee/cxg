from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesReturns"]


class SalesReturns(TenantBaseModel):
    """판매 반품 헤더 관리 테이블"""
    __tablename__ = "sales_returns"
    __table_args__ = {"schema": "srm"}

    return_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 반품 코드 (반품번호)
    return_type: Mapped[str] = mapped_column(String(20), nullable=False, default='RETURN')  # 반품 유형 (RETURN/EXCHANGE/DEFECT)
    so_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"))  # 판매주문 식별자
    delivery_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_deliveries.id"))  # 출고 식별자
    invoice_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_invoices.id"))  # 송장 식별자
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 고객 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    return_date: Mapped[date | None] = mapped_column(Date)  # 실제 반품일
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 입고 창고 식별자
    reason_code: Mapped[str | None] = mapped_column(String(20))  # 반품 사유 코드
    reason_desc: Mapped[str | None] = mapped_column(Text)  # 반품 사유 설명
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/CONFIRMED/RECEIVED/REFUNDED/CANCELLED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고