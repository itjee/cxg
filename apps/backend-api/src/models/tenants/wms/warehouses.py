from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Warehouses"]


class Warehouses(TenantBaseModel):
    """창고 마스터 정보 관리 테이블"""
    __tablename__ = "warehouses"
    __table_args__ = {"schema": "wms"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 창고 코드 (사내 규칙)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 창고명
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # 창고 유형 (MAIN/BRANCH/DISTRIBUTION/COLD_STORAGE/FREEZER/EXTERNAL/VIRTUAL/QUARANTINE/RETURN)
    manager_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("wms.employees.id"))  # 창고 관리자 식별자
    is_primary: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 주창고 여부
    is_external: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 외부창고 여부 (3PL 등)
    phone: Mapped[str | None] = mapped_column(String(50))  # 전화번호
    fax: Mapped[str | None] = mapped_column(String(50))  # 팩스번호
    email: Mapped[str | None] = mapped_column(String(255))  # 이메일
    postcode: Mapped[str | None] = mapped_column(String(20))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(200))  # 기본 주소
    address2: Mapped[str | None] = mapped_column(String(200))  # 상세 주소
    building_name: Mapped[str | None] = mapped_column(String(200))  # 건물명
    city: Mapped[str | None] = mapped_column(String(100))  # 도시
    state_province: Mapped[str | None] = mapped_column(String(100))  # 주/도
    country_code: Mapped[str | None] = mapped_column(String(3), default='KOR')  # 국가 코드 (ISO 3166-1 alpha-3)
    operating_hours: Mapped[str | None] = mapped_column(String(100))  # 운영 시간
    capacity_sqm: Mapped[Decimal | None] = mapped_column(Numeric(precision=12, scale=2))  # 면적 (제곱미터)
    capacity_volume: Mapped[Decimal | None] = mapped_column(Numeric(precision=12, scale=2))  # 용적 (세제곱미터)
    max_weight: Mapped[Decimal | None] = mapped_column(Numeric(precision=12, scale=2))  # 최대 중량 (kg)
    has_dock: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 도크 보유 여부
    has_crane: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 크레인 보유 여부
    has_cold_storage: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 냉장 시설 여부
    has_freezer: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 냉동 시설 여부
    monthly_rent: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 월 임대료
    storage_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 단위당 보관비
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    external_provider: Mapped[str | None] = mapped_column(String(100))  # 외부 업체명 (3PL 등)
    contract_start_date: Mapped[date | None] = mapped_column(Date)  # 계약 시작일
    contract_close_date: Mapped[date | None] = mapped_column(Date)  # 계약 종료일
    description: Mapped[str | None] = mapped_column(Text)  # 창고 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/MAINTENANCE/SUSPENDED/CLOSED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그