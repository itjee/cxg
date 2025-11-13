from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Inventory"]


class Inventory(TenantBaseModel):
    """재고 현황 관리 테이블 (실시간 재고)"""
    __tablename__ = "inventory"
    __table_args__ = {"schema": "wms"}

    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 로케이션 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 시리얼 번호
    quantity_on_hand: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 재고 수량
    quantity_allocated: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=0)  # 할당 수량 (예약)
    quantity_available: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 가용 수량 (재고 - 할당)
    quality_status: Mapped[str | None] = mapped_column(String(20), default='GOOD')  # 품질 상태 (GOOD/DAMAGED/QUARANTINE/HOLD/RETURNED)
    manufactured_date: Mapped[date | None] = mapped_column(Date)  # 제조 일자
    expiry_date: Mapped[date | None] = mapped_column(Date)  # 유효 기한
    received_date: Mapped[date | None] = mapped_column(Date)  # 입고 일자
    unit_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 단가
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/LOCKED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그