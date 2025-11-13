from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductUnitConversions"]


class ProductUnitConversions(TenantBaseModel):
    """제품 단위 변환 테이블 (1박스 = 12개)"""
    __tablename__ = "product_unit_conversions"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    from_unit_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.product_units.id"), nullable=False)  # 원단위 식별자
    to_unit_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.product_units.id"), nullable=False)  # 변환단위 식별자
    conversion_rate: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=6), nullable=False)  # 변환 비율 (예: 1박스 = 12개 -> 12)
    is_default: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 기본 변환 여부
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그