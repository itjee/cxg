from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["WarehouseLocations"]


class WarehouseLocations(TenantBaseModel):
    """창고 로케이션 정보 관리 테이블"""
    __tablename__ = "warehouse_locations"
    __table_args__ = {"schema": "wms"}

    warehouse_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("wms.warehouses.id"), nullable=False)  # 창고 식별자
    location_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 로케이션 코드
    location_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 로케이션명
    location_type: Mapped[str | None] = mapped_column(String(20), ForeignKey("wms.warehouse_locations.id"), default='BIN')  # 로케이션 유형 (ZONE/AISLE/RACK/SHELF/BIN/PALLET/FLOOR/DOOR/STAGING/VIRTUAL)
    parent_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 상위 로케이션 식별자 (계층구조)
    level_depth: Mapped[int | None] = mapped_column(Integer, default=1)  # 계층 깊이 (1=ZONE, 2=AISLE, 3=RACK, 4=BIN)
    full_path: Mapped[str | None] = mapped_column(String(500))  # 전체 경로 (ZONE-A/AISLE-01/RACK-001/BIN-A001)
    zone_code: Mapped[str | None] = mapped_column(String(20))  # 구역 코드
    aisle_code: Mapped[str | None] = mapped_column(String(20))  # 통로 코드
    rack_code: Mapped[str | None] = mapped_column(String(20))  # 랙 코드
    bin_code: Mapped[str | None] = mapped_column(String(20))  # 빈 코드
    x_coordinate: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # X 좌표
    y_coordinate: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # Y 좌표
    z_coordinate: Mapped[Decimal | None] = mapped_column(Numeric(precision=10, scale=2))  # Z 좌표 (높이)
    capacity_weight: Mapped[Decimal | None] = mapped_column(Numeric(precision=12, scale=2))  # 중량 용량 (kg)
    capacity_volume: Mapped[Decimal | None] = mapped_column(Numeric(precision=12, scale=2))  # 부피 용량 (㎥)
    capacity_units: Mapped[int | None] = mapped_column(Integer)  # 단위 용량 (개수)
    width_cm: Mapped[Decimal | None] = mapped_column(Numeric(precision=8, scale=2))  # 가로 (cm)
    height_cm: Mapped[Decimal | None] = mapped_column(Numeric(precision=8, scale=2))  # 세로 (cm)
    depth_cm: Mapped[Decimal | None] = mapped_column(Numeric(precision=8, scale=2))  # 깊이 (cm)
    is_pickable: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 피킹 가능 여부
    is_receivable: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 입고 가능 여부
    is_virtual: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 가상 로케이션 여부
    is_damaged_area: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 불량품 구역 여부
    is_quarantine: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 격리 구역 여부
    temperature_min: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 최저 온도 (℃)
    temperature_max: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 최고 온도 (℃)
    humidity_min: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 최저 습도 (%)
    humidity_max: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 최고 습도 (%)
    sort_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    picking_priority: Mapped[int | None] = mapped_column(Integer, default=0)  # 피킹 우선순위
    barcode: Mapped[str | None] = mapped_column(String(100))  # 바코드
    rfid_tag: Mapped[str | None] = mapped_column(String(100))  # RFID 태그
    description: Mapped[str | None] = mapped_column(Text)  # 로케이션 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/MAINTENANCE/BLOCKED/DAMAGED/RESERVED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그
    REFERENCES: Mapped[str | None] = mapped_column()
    ON: Mapped[str | None] = mapped_column()