from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryMovements"]


class InventoryMovements(TenantBaseModel):
    """재고 이동 이력 관리 테이블"""
    __tablename__ = "inventory_movements"
    __table_args__ = {"schema": "ivm"}

    movement_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 이동 코드 (이동번호)
    doc_date: Mapped[date] = mapped_column(Date, nullable=False)  # 전표 일자
    movement_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 이동 유형 (IN/OUT/TRANSFER/ADJUSTMENT)
    reference_doc_type: Mapped[str | None] = mapped_column(String(50))  # 참조 문서 유형 (PO/SO/TRANSFER 등)
    reference_doc_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 참조 문서 식별자
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 로케이션 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 시리얼 번호
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 이동 수량 (입고: 양수, 출고: 음수)
    unit_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 단가
    total_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 총 원가 (수량 × 단가)
    reason_code: Mapped[str | None] = mapped_column(String(50))  # 사유 코드
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()