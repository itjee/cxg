from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesDeliveries"]


class SalesDeliveries(TenantBaseModel):
    """판매 출고/배송 헤더 관리 테이블"""
    __tablename__ = "sales_deliveries"
    __table_args__ = {"schema": "srm"}

    delivery_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 출고 코드 (출고번호)
    so_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"), nullable=False)  # 판매주문 식별자
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 고객 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    delivery_date: Mapped[date | None] = mapped_column(Date)  # 실제 배송일
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 출고 창고 식별자
    tracking_no: Mapped[str | None] = mapped_column(String(100))  # 송장 번호
    carrier: Mapped[str | None] = mapped_column(String(100))  # 배송업체
    shipping_address: Mapped[str | None] = mapped_column(Text)  # 배송 주소
    shipping_contact: Mapped[str | None] = mapped_column(String(100))  # 배송 연락처
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/CONFIRMED/PACKED/SHIPPED/DELIVERED/CANCELLED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고