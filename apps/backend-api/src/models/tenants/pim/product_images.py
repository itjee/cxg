from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ProductImages"]


class ProductImages(TenantBaseModel):
    """제품 이미지 관리 테이블"""
    __tablename__ = "product_images"
    __table_args__ = {"schema": "pim"}

    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 제품 식별자
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)  # 이미지 URL
    image_type: Mapped[str | None] = mapped_column(String(20), default='DETAIL')  # 이미지 유형 (MAIN/DETAIL/THUMBNAIL/GALLERY/SPEC/PACKAGE)
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 표시 순서
    is_primary: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 대표 이미지 여부
    alt_text: Mapped[str | None] = mapped_column(String(200))  # 대체 텍스트 (접근성)
    file_name: Mapped[str | None] = mapped_column(String(200))  # 파일명
    file_size: Mapped[int | None] = mapped_column(Integer)  # 파일 크기 (bytes)
    mime_type: Mapped[str | None] = mapped_column(String(50))  # MIME 타입 (image/jpeg, image/png 등)
    width: Mapped[int | None] = mapped_column(Integer)  # 이미지 너비 (픽셀)
    height: Mapped[int | None] = mapped_column(Integer)  # 이미지 높이 (픽셀)
    description: Mapped[str | None] = mapped_column(Text)  # 이미지 설명
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/PENDING)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그