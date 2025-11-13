from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["ProductUnits"]


class ProductUnits(TenantBaseModel):
    """제품 단위 마스터 테이블 (개, 박스, 팩 등)"""
    __tablename__ = "product_units"
    __table_args__ = {"schema": "pim"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 단위 코드
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # 단위명 (예: 개, 박스, 팩)
    name_en: Mapped[str | None] = mapped_column(String(50))  # 영문 단위명
    symbol: Mapped[str | None] = mapped_column(String(10))  # 단위 기호 (예: EA, BOX, PK)
    unit_type: Mapped[str | None] = mapped_column(String(20), default='COUNT')  # 단위 유형 (COUNT/WEIGHT/VOLUME/LENGTH/AREA/PACKAGE)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그