from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["ExchangeRates"]


class ExchangeRates(TenantBaseModel):
    """환율 테이블 - 통화간 환율 정보 관리"""
    __tablename__ = "exchange_rates"
    __table_args__ = {"schema": "adm"}

    from_currency: Mapped[str] = mapped_column(String(3), ForeignKey("adm.currencies.id"), nullable=False)  # 기준 통화 (ISO 4217, 예: USD)
    to_currency: Mapped[str] = mapped_column(String(3), ForeignKey("adm.currencies.id"), nullable=False)  # 대상 통화 (ISO 4217, 예: KRW)
    rate: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=6), nullable=False)  # 환율 (기준통화 1단위당 대상통화 환산율, 소수점 6자리까지)
    rate_date: Mapped[date] = mapped_column(Date, nullable=False)  # 환율 적용일
    source: Mapped[str | None] = mapped_column(String(50))  # 환율 출처 (중앙은행, API 등)
    rate_type: Mapped[str | None] = mapped_column(String(20), default='SPOT')  # 환율 유형 (SPOT: 현물환율, FORWARD: 선물환율, BUYING: 매입율, SELLING: 매도율)