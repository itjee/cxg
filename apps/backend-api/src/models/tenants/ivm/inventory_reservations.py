from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryReservations"]


class InventoryReservations(TenantBaseModel):
    """재고 예약 관리 테이블"""
    __tablename__ = "inventory_reservations"
    __table_args__ = {"schema": "ivm"}

    reservation_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 예약 코드
    reservation_date: Mapped[date] = mapped_column(Date, nullable=False)  # 예약 일자
    reference_doc_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 참조 문서 유형 (SO/WO/TRANSFER 등)
    reference_doc_id: Mapped[PyUUID] = mapped_column(UUID, nullable=False)  # 참조 문서 식별자
    reference_line_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 참조 라인 식별자
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 로케이션 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 시리얼 번호
    reserved_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 예약 수량
    fulfilled_qty: Mapped[int | None] = mapped_column(Integer, default=0)  # 이행 수량
    remaining_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 잔여 수량 (reserved_qty - fulfilled_qty)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime)  # 예약 만료 일시
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/FULFILLED/RELEASED/EXPIRED)
    released_at: Mapped[datetime | None] = mapped_column(DateTime)  # 해제 일시
    released_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 해제자 UUID
    release_reason: Mapped[str | None] = mapped_column(Text)  # 해제 사유
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()