from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Brands"]


class Brands(TenantBaseModel):
    """브랜드 마스터 정보 관리 테이블"""
    __tablename__ = "brands"
    __table_args__ = {"schema": "pim"}

    maker_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.makers.id"), nullable=False)  # 제조사 식별자
    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 브랜드 코드 (사내 규칙)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 브랜드명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 영문 브랜드명
    type: Mapped[str | None] = mapped_column(String(20), default='PRODUCT')  # 브랜드 유형 (PRODUCT/SERVICE/CORPORATE/SUB_BRAND/PRIVATE_LABEL)
    category: Mapped[str | None] = mapped_column(String(50))  # 브랜드 카테고리
    logo_url: Mapped[str | None] = mapped_column(String(500))  # 로고 이미지 URL
    color: Mapped[str | None] = mapped_column(String(20))  # 브랜드 컬러 (hex 코드)
    tagline: Mapped[str | None] = mapped_column(String(200))  # 브랜드 슬로건
    market_segment: Mapped[str | None] = mapped_column(String(50))  # 시장 세그먼트
    price_range: Mapped[str | None] = mapped_column(String(20))  # 가격대 (BUDGET/MID_RANGE/PREMIUM/LUXURY/ULTRA_LUXURY)
    target_market: Mapped[str | None] = mapped_column(String(100))  # 타겟 시장
    website: Mapped[str | None] = mapped_column(String(255))  # 브랜드 웹사이트
    country_code: Mapped[str | None] = mapped_column(String(3))  # 브랜드 원산지 (ISO 3166-1 alpha-3)
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    is_premium: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 프리미엄 브랜드 여부
    is_private: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 자체 브랜드 여부
    description: Mapped[str | None] = mapped_column(Text)  # 브랜드 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그