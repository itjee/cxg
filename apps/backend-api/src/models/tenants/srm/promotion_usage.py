from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["PromotionUsage"]


class PromotionUsage(TenantBaseModel):
    """프로모션 사용 이력 테이블 - 판매주문에서 적용된 프로모션 기록"""
    __tablename__ = "promotion_usage"
    __table_args__ = {"schema": "srm"}

    promotion_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.promotions.id"), nullable=False)  # 프로모션 식별자
    sales_order_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("srm.sales_orders.id"), nullable=False)  # 판매주문 식별자
    sales_order_item_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("srm.sales_order_items.id"))  # 판매주문 항목 식별자 (NULL이면 전체 주문에 적용)
    discount_applied: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=2), nullable=False)  # 실제 적용된 할인액
    discount_percentage: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 실제 적용된 할인율
    applied_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.current_timestamp())  # 프로모션 적용 일시