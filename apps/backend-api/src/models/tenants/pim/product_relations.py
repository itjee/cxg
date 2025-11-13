from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductRelations"]


class ProductRelations(TenantBaseModel):
    """제품 연관 관계 관리 테이블 (관련상품, 대체상품, 구성상품 등)"""
    __tablename__ = "product_relations"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    related_product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 연관 제품 식별자
    relation_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 관계 유형 (RELATED/ALTERNATIVE/ACCESSORY/BUNDLE/UPGRADE/CROSS_SELL/UP_SELL)
    quantity: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2), default=1)  # 수량 (세트 구성 시)
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그