from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["SalesOrders"]


class SalesOrders(TenantBaseModel):
    """판매주문 헤더 관리 테이블"""
    __tablename__ = "sales_orders"
    __table_args__ = {"schema": "srm"}

    so_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 판매주문 코드 (SO 번호)
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.customers.id"), nullable=False)  # 고객 식별자
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    delivery_date: Mapped[date | None] = mapped_column(Date)  # 납품 희망일
    warehouse_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouses.id"))  # 출고 창고 식별자
    sales_person_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("hrm.employees.id"))  # 영업 담당자 식별자
    payment_terms: Mapped[str | None] = mapped_column(String(20))  # 결제 조건 (COD/NET30/NET60 등)
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 금액
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    status: Mapped[str | None] = mapped_column(String(20), default='DRAFT')  # 상태 (DRAFT/CONFIRMED/PROCESSING/SHIPPED/COMPLETED/CANCELLED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그