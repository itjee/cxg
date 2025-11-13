from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductPriceHistory"]


class ProductPriceHistory(TenantBaseModel):
    """제품 가격 변경 이력 관리 테이블"""
    __tablename__ = "product_price_history"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    price_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 가격 유형 (COST/SELL/MIN_SELL/SUPPLY/RETAIL)
    old_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 변경 전 가격
    new_price: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 변경 후 가격
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)  # 적용 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 적용 종료일
    reason: Mapped[str | None] = mapped_column(String(200))  # 변경 사유
    reason_type: Mapped[str | None] = mapped_column(String(20))  # 사유 유형 (PROMOTION/COST_CHANGE/MARKET/SEASONAL/POLICY/OTHER)
    approved_by: Mapped[PyUUID | None] = mapped_column(UUID)  # 승인자 UUID
    approved_at: Mapped[datetime | None] = mapped_column(DateTime)  # 승인 일시
    description: Mapped[str | None] = mapped_column(Text)  # 상세 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/EXPIRED/CANCELLED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그