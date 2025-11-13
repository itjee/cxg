from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["InventoryCountItems"]


class InventoryCountItems(TenantBaseModel):
    """재고 실사 상세 항목 테이블"""
    __tablename__ = "inventory_count_items"
    __table_args__ = {"schema": "ivm"}

    count_id: Mapped[str] = mapped_column(nullable=False)  # 실사 식별자
    warehouse_id: Mapped[str] = mapped_column(nullable=False)  # 창고 식별자
    location_id: Mapped[str | None] = mapped_column()  # 로케이션 식별자
    product_id: Mapped[str] = mapped_column(nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column()  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column()  # 시리얼 번호
    system_qty: Mapped[str] = mapped_column(nullable=False)  # 시스템 수량 (장부 재고)
    counted_qty: Mapped[str | None] = mapped_column()  # 실사 수량 (실제 재고)
    variance_qty: Mapped[str | None] = mapped_column()  # 차이 수량 (counted_qty - system_qty)
    counted_by: Mapped[str | None] = mapped_column()  # 실사자 UUID
    counted_at: Mapped[str | None] = mapped_column()  # 실사 일시
    is_recount_required: Mapped[str | None] = mapped_column(default=False)  # 재실사 필요 여부
    recount_count: Mapped[str | None] = mapped_column(default=0)  # 재실사 횟수
    variance_reason_code: Mapped[str | None] = mapped_column()  # 차이 사유 코드
    variance_reason: Mapped[str | None] = mapped_column()  # 차이 사유
    adjustment_id: Mapped[str | None] = mapped_column()  # 조정 식별자 (연동된 조정)
    notes: Mapped[str | None] = mapped_column()  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()