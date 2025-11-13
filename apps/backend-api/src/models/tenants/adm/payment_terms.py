from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["PaymentTerms"]


class PaymentTerms(TenantBaseModel):
    """결제 조건 마스터 테이블 - 구매/판매 시 적용되는 표준 결제 조건"""
    __tablename__ = "payment_terms"
    __table_args__ = {"schema": "adm"}

    code: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)  # 결제 조건 코드 (COD, NET7, NET15, NET30 등)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 결제 조건명 (예: 30일 외상)
    description: Mapped[str | None] = mapped_column(Text)  # 결제 조건 설명
    days_to_pay: Mapped[int | None] = mapped_column(Integer)  # 결제 기간 (일수, NULL이면 특수 조건)
    is_cash_on_delivery: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 착불 여부
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 여부
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그