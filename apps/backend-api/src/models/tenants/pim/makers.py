from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Makers"]


class Makers(TenantBaseModel):
    """제조사 마스터 정보 관리 테이블"""
    __tablename__ = "makers"
    __table_args__ = {"schema": "pim"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 제조사 코드 (사내 규칙)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 제조사명
    name_en: Mapped[str | None] = mapped_column(String(200))  # 영문 제조사명
    country_code: Mapped[str | None] = mapped_column(String(3))  # 본사 국가 코드 (ISO 3166-1 alpha-3)
    postcode: Mapped[str | None] = mapped_column(String(10))  # 우편번호
    address1: Mapped[str | None] = mapped_column(String(100))  # 주소1 (기본주소)
    address2: Mapped[str | None] = mapped_column(String(100))  # 주소2 (상세주소)
    phone: Mapped[str | None] = mapped_column(String(50))  # 전화번호
    email: Mapped[str | None] = mapped_column(String(255))  # 이메일
    website: Mapped[str | None] = mapped_column(String(255))  # 웹사이트 URL
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    logo_url: Mapped[str | None] = mapped_column(String(500))  # 로고 이미지 URL
    description: Mapped[str | None] = mapped_column(Text)  # 제조사 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그