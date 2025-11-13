from uuid import UUID as PyUUID
from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel

__all__ = ["Shipping"]


class Shipping(TenantBaseModel):
    """출고 헤더 정보 관리 테이블"""

    __tablename__ = "shipping"
    __table_args__ = {"schema": "wms"}

    gi_code: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # 출고 코드
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    so_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("srm.sales_orders.id")
    )  # 판매주문 식별자
    customer_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("crm.partners.id")
    )  # 고객 식별자
    warehouse_id: Mapped[PyUUID] = mapped_column(
        UUID, ForeignKey("wms.warehouses.id"), nullable=False
    )  # 창고 식별자
    picker_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("hrm.employees.id")
    )  # 피킹 담당자 식별자
    total_qty: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 총 수량
    status: Mapped[str] = mapped_column(
        String(20), default="DRAFT"
    )  # 상태
    is_deleted: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )  # 논리 삭제 플래그
