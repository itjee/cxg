from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Categories"]


class Categories(TenantBaseModel):
    """제품/품목 카테고리 정보 관리 테이블"""
    __tablename__ = "categories"
    __table_args__ = {"schema": "pim"}

    parent_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.categories.id"))  # 상위 카테고리 식별자 (계층구조)
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 카테고리 코드 (사내 규칙)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 카테고리명
    level_depth: Mapped[int | None] = mapped_column(Integer, default=1)  # 계층 깊이 (1=대분류, 2=중분류, 3=소분류)
    full_path: Mapped[str | None] = mapped_column(String(500))  # 전체 경로 (대분류>중분류>소분류)
    type: Mapped[str | None] = mapped_column(String(20), default='PRODUCT')  # 카테고리 유형 (PRODUCT/SERVICE/BUNDLE/VIRTUAL/SUBSCRIPTION/DIGITAL/PHYSICAL)
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    tax_category: Mapped[str | None] = mapped_column(String(20))  # 세금 분류 (TAXABLE/EXEMPT/ZERO_RATED/REVERSE_CHARGE/SPECIAL)
    account_code: Mapped[str | None] = mapped_column(String(30))  # 회계 코드
    manager_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 카테고리 담당자
    buyer_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 구매 담당자
    icon_url: Mapped[str | None] = mapped_column(String(500))  # 아이콘 URL
    image_url: Mapped[str | None] = mapped_column(String(500))  # 이미지 URL
    external_code: Mapped[str | None] = mapped_column(String(50))  # 외부 시스템 코드
    marketplace: Mapped[str | None] = mapped_column(String(100))  # 마켓플레이스 카테고리
    description: Mapped[str | None] = mapped_column(Text)  # 카테고리 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그