from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["InventorySerialNumbers"]


class InventorySerialNumbers(TenantBaseModel):
    """시리얼 번호 마스터 관리 테이블"""
    __tablename__ = "inventory_serial_numbers"
    __table_args__ = {"schema": "ivm"}

    serial_number: Mapped[str] = mapped_column(String(100), nullable=False)  # 시리얼 번호
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    lot_number: Mapped[str | None] = mapped_column(String(100))  # 로트 번호
    manufactured_date: Mapped[date | None] = mapped_column(Date)  # 제조 일자
    manufacturer_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 제조사 식별자
    current_warehouse_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouses.id"))  # 현재 창고 식별자
    current_location_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.warehouse_locations.id"))  # 현재 로케이션 식별자
    owner_type: Mapped[str | None] = mapped_column()  # 소유 타입 (COMPANY/CUSTOMER/SUPPLIER)
    owner_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 소유자 식별자
    ownership_date: Mapped[date | None] = mapped_column(Date)  # 소유권 이전 일자
    warranty_start_date: Mapped[str | None] = mapped_column()  # 워런티 시작일
    warranty_end_date: Mapped[str | None] = mapped_column()  # 워런티 종료일
    warranty_months: Mapped[int | None] = mapped_column(Integer)  # 워런티 기간 (개월)
    status: Mapped[str | None] = mapped_column(String(20), default='AVAILABLE')  # 상태 (AVAILABLE/RESERVED/SHIPPED/SOLD/RETURNED/IN_SERVICE/SCRAPPED)
    condition_grade: Mapped[str | None] = mapped_column()  # 상태 등급 (NEW/GOOD/FAIR/POOR/REFURBISHED)
    sold_date: Mapped[date | None] = mapped_column(Date)  # 판매 일자
    shipped_date: Mapped[date | None] = mapped_column(Date)  # 배송 일자
    delivered_date: Mapped[date | None] = mapped_column(Date)  # 배송 완료 일자
    return_date: Mapped[date | None] = mapped_column(Date)  # 반품 일자
    return_reason: Mapped[str | None] = mapped_column(Text)  # 반품 사유
    last_service_date: Mapped[date | None] = mapped_column(Date)  # 최종 A/S 일자
    service_count: Mapped[int | None] = mapped_column(Integer, default=0)  # A/S 횟수
    scrapped_date: Mapped[date | None] = mapped_column(Date)  # 폐기 일자
    scrapped_reason: Mapped[str | None] = mapped_column(Text)  # 폐기 사유
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()