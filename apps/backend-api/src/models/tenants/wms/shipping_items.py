from uuid import UUID as PyUUID

from sqlalchemy import ForeignKey, Integer, String, VARCHAR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel

__all__ = ["ShippingItems"]


class ShippingItems(TenantBaseModel):
    """출고 라인 (상세) 정보 관리 테이블"""

    __tablename__ = "shipping_items"
    __table_args__ = {"schema": "wms"}

    gi_id: Mapped[PyUUID] = mapped_column(
        UUID, ForeignKey("wms.shipping.id"), nullable=False
    )  # 출고 헤더 식별자
    line_no: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # 라인 번호
    so_line_id: Mapped[PyUUID | None] = mapped_column(
        UUID, ForeignKey("srm.sales_order_items.id")
    )  # 판매주문 라인 식별자
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
    requested_qty: Mapped[int | None] = mapped_column(
        Integer, default=0
    )  # 요청 수량
    picked_qty: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # 피킹 수량
