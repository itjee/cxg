from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Units"]


class Units(TenantBaseModel):
    """단위 테이블 - 재고, 수량, 길이, 무게 등의 측정 단위 관리"""
    __tablename__ = "units"
    __table_args__ = {"schema": "adm"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 단위 코드 (영대문자, 숫자 1-20자, 예: EA, KG, M, L)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 단위명 (한글명, 예: 개, 킬로그램, 미터, 리터)
    name_en: Mapped[str | None] = mapped_column(String(100))  # 단위명 (영문명, 예: Each, Kilogram, Meter, Liter)
    unit_type: Mapped[str | None] = mapped_column(String(20))  # 단위 유형 (QUANTITY: 개수, WEIGHT: 무게, LENGTH: 길이, VOLUME: 부피, AREA: 면적 등)
    symbol: Mapped[str | None] = mapped_column(String(10))  # 단위 심볼 (예: kg, m, L, ㎡)
    base_unit_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("adm.units.id"))  # 기준 단위 식별자 (단위 환산용, 예: g의 기준은 kg)
    conversion_rate: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=6))  # 기준 단위 환산율 (예: 1kg = 1000g 이면 g의 환산율은 0.001)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_base_unit: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 기준 단위 여부 (유형별 기준 단위 표시)