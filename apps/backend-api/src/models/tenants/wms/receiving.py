from uuid import UUID as PyUUID
from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel

__all__ = ["Receiving"]


class Receiving(TenantBaseModel):
    """입고 헤더 정보 관리 테이블"""

    __tablename__ = "receiving"
    __table_args__ = {"schema": "wms"}

    gr_code: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # 입고 코드
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    po_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("psm.purchase_orders.id")
    )  # 구매발주 식별자
    vendor_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("crm.partners.id")
    )  # 공급업체 식별자
    warehouse_id: Mapped[PyUUID] = mapped_column(
        UUID, ForeignKey("wms.warehouses.id"), nullable=False
    )  # 창고 식별자
    receiver_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("hrm.employees.id")
    )  # 입고 담당자 식별자
    total_qty: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 총 수량
    status: Mapped[str] = mapped_column(
        String(20), default="DRAFT"
    )  # 상태
    is_deleted: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )  # 논리 삭제 플래그
