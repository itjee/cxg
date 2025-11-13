from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["InventoryTransfers"]


class InventoryTransfers(TenantBaseModel):
    """재고 이동 요청 관리 테이블"""
    __tablename__ = "inventory_transfers"
    __table_args__ = {"schema": "ivm"}

    transfer_code: Mapped[str] = mapped_column(nullable=False)  # 이동 요청 코드
    transfer_date: Mapped[str] = mapped_column(nullable=False)  # 이동 요청 일자
    from_warehouse_id: Mapped[str | None] = mapped_column()  # 출발 창고 식별자
    from_location_id: Mapped[str | None] = mapped_column()  # 출발 로케이션 식별자
    to_warehouse_id: Mapped[str] = mapped_column(nullable=False)  # 도착 창고 식별자
    to_location_id: Mapped[str | None] = mapped_column()  # 도착 로케이션 식별자
    product_id: Mapped[str] = mapped_column(nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column()  # 로트 번호
    serial_number: Mapped[str | None] = mapped_column()  # 시리얼 번호
    qty: Mapped[str] = mapped_column(nullable=False)  # 이동 수량
    started_at: Mapped[str | None] = mapped_column()  # 이동 시작 일시
    completed_at: Mapped[str | None] = mapped_column()  # 이동 완료 일시
    reason: Mapped[str | None] = mapped_column()  # 이동 사유
    notes: Mapped[str | None] = mapped_column()  # 비고
    status: Mapped[str | None] = mapped_column(default='PENDING')  # 상태 (PENDING/IN_TRANSIT/COMPLETED/CANCELLED)
    REFERENCES: Mapped[str | None] = mapped_column()