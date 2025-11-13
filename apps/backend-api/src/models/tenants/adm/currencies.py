from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Currencies"]


class Currencies(TenantBaseModel):
    """통화 테이블 - ISO 4217 표준 통화 코드 관리"""
    __tablename__ = "currencies"
    __table_args__ = {"schema": "adm"}

    code: Mapped[str] = mapped_column(String(3), nullable=False)  # 통화 코드 (ISO 4217 - 3자리 영대문자, 예: KRW, USD, JPY)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 통화명 (한글명, 예: 대한민국 원)
    name_en: Mapped[str | None] = mapped_column(String(100))  # 통화명 (영문명, 예: South Korean Won)
    symbol: Mapped[str | None] = mapped_column(String(10))  # 심볼 (¥, $, € 등)
    decimal_places: Mapped[int | None] = mapped_column(Integer, default=2)  # 소수점 자릿수 (통화별 자릿수, 0-4)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_base_currency: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 기준 통화 여부 (환율 계산 기준)