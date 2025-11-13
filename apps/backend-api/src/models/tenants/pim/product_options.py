from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductOptions"]


class ProductOptions(TenantBaseModel):
    """제품 옵션 그룹 관리 테이블 (색상, 사이즈 등)"""
    __tablename__ = "product_options"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 옵션 코드
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 옵션명 (예: 색상, 사이즈)
    name_en: Mapped[str | None] = mapped_column(String(100))  # 영문 옵션명
    option_type: Mapped[str | None] = mapped_column(String(20), default='SELECT')  # 옵션 유형 (SELECT/RADIO/TEXT/COLOR/IMAGE)
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    is_required: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 필수 선택 여부
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그