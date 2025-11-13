from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductOptionValues"]


class ProductOptionValues(TenantBaseModel):
    """제품 옵션 값 관리 테이블 (빨강, 파랑, S, M, L 등)"""
    __tablename__ = "product_option_values"
    __table_args__ = {"schema": "pim"}

    option_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.product_options.id"), nullable=False)  # 옵션 그룹 식별자
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 옵션 값 코드
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 옵션 값명 (예: 빨강, S)
    name_en: Mapped[str | None] = mapped_column(String(100))  # 영문 옵션 값명
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    color_code: Mapped[str | None] = mapped_column(String(20))  # 색상 코드 (hex)
    image_url: Mapped[str | None] = mapped_column(String(500))  # 이미지 URL
    price_adjustment: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 가격 조정 금액
    adjustment_type: Mapped[str | None] = mapped_column(String(20), default='FIXED')  # 조정 유형 (FIXED/PERCENT)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/OUT_OF_STOCK)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그