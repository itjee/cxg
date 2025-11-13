from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductTags"]


class ProductTags(TenantBaseModel):
    """제품 태그 관리 테이블 (신제품, 인기, 할인 등)"""
    __tablename__ = "product_tags"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    tag_name: Mapped[str] = mapped_column(String(50), nullable=False)  # 태그명
    tag_type: Mapped[str | None] = mapped_column(String(20), default='GENERAL')  # 태그 유형 (GENERAL/PROMOTION/SEASONAL/NEW/BEST/SALE/FEATURED)
    color_code: Mapped[str | None] = mapped_column(String(20))  # 색상 코드 (hex)
    start_date: Mapped[date | None] = mapped_column(Date)  # 시작일 (시즌, 프로모션 태그)
    end_date: Mapped[date | None] = mapped_column(Date)  # 종료일 (시즌, 프로모션 태그)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/EXPIRED)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그