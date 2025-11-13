from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventoryCounts"]


class InventoryCounts(TenantBaseModel):
    """재고 실사 관리 테이블"""
    __tablename__ = "inventory_counts"
    __table_args__ = {"schema": "ivm"}

    count_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 실사 코드
    count_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 실사명
    count_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 실사 유형 (FULL/CYCLE/SPOT)
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)  # 예정 일자
    started_at: Mapped[datetime | None] = mapped_column(DateTime)  # 시작 일시
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 완료 일시
    warehouse_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouses.id"))  # 대상 창고 (NULL: 전체)
    location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 대상 로케이션 (NULL: 전체)
    product_category_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 대상 제품 카테고리 (NULL: 전체)
    supervisor_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 감독자 UUID
    counter_ids: Mapped[PyUUID | None] = mapped_column(UUID)  # 실사자 UUID 배열
    total_items: Mapped[int | None] = mapped_column(Integer, default=0)  # 전체 항목 수
    counted_items: Mapped[str | None] = mapped_column()  # 실사 완료 항목 수
    variance_items: Mapped[str | None] = mapped_column()  # 차이 발생 항목 수
    is_adjustment_approved: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 조정 승인 여부
    status: Mapped[str | None] = mapped_column(String(20), default='PLANNED')  # 상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()