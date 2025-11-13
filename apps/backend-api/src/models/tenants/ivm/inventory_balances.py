from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryBalances"]


class InventoryBalances(TenantBaseModel):
    """재고 현황 관리 테이블"""
    __tablename__ = "inventory_balances"
    __table_args__ = {"schema": "ivm"}

    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 로케이션 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 시리얼 번호
    on_hand_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 현재고 수량
    available_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 가용 수량 (현재고 - 예약)
    reserved_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 예약 수량
    avg_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 평균 단가
    last_movement_date: Mapped[datetime | None] = mapped_column(DateTime)  # 최종 이동 일시
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()