from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryAdjustments"]


class InventoryAdjustments(TenantBaseModel):
    """재고 조정 관리 테이블"""
    __tablename__ = "inventory_adjustments"
    __table_args__ = {"schema": "ivm"}

    adjustment_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 조정 코드
    adjustment_date: Mapped[date] = mapped_column(Date, nullable=False)  # 조정 일자
    adjustment_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 조정 유형 (COUNT/DAMAGE/LOSS/QUALITY/FOUND/OTHER)
    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 로케이션 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 시리얼 번호
    before_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 조정 전 수량
    after_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 조정 후 수량
    adjustment_qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 조정 수량 (after_qty - before_qty)
    reason_code: Mapped[str | None] = mapped_column(String(50))  # 사유 코드 (표준 코드)
    reason: Mapped[str] = mapped_column(Text, nullable=False)  # 조정 사유 (필수)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 조정 완료 일시
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='PENDING')  # 상태 (PENDING/APPROVED/REJECTED/COMPLETED)
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()