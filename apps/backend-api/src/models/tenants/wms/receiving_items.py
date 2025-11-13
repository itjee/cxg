from uuid import UUID as PyUUID

from sqlalchemy import ForeignKey, Integer, Numeric, String, VARCHAR
from sqlalchemy.dialects.postgresql import UUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel

__all__ = ["ReceivingItems"]


class ReceivingItems(TenantBaseModel):
    """입고 라인 (상세) 정보 관리 테이블"""

    __tablename__ = "receiving_items"
    __table_args__ = {"schema": "wms"}

    gr_id: Mapped[PyUUID] = mapped_column(
        UUID, ForeignKey("wms.receiving.id"), nullable=False
    )  # 입고 헤더 식별자
    line_no: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # 라인 번호
    po_line_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("psm.purchase_order_items.id")
    )  # 구매발주 라인 식별자
    item_id: Mapped[PyUUID] = mapped_column(
        UUID, ForeignKey("pim.products.id"), nullable=False
    )  # 제품 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("wms.warehouse_locations.id")
    )  # 로케이션 식별자
    lot_number: Mapped[str | None] = mapped_column(
        VARCHAR(100)
    )  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(
        VARCHAR(100)
    )  # 시리얼 번호
    ordered_qty: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 발주 수량
    received_qty: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # 입고 수량
    rejected_qty: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 불량 수량
    unit_cost: Mapped[Decimal | None] = mapped_column(
        Numeric(precision=18, scale=4), default=0
    )  # 단가
