from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Products"]


class Products(TenantBaseModel):
    """제품/품목 마스터 정보 관리 테이블"""
    __tablename__ = "products"
    __table_args__ = {"schema": "pim"}

    code: Mapped[str] = mapped_column(String(20), nullable=False)  # 제품 코드 (사내 규칙)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 제품명
    type: Mapped[str | None] = mapped_column(String(10))  # 제품 유형
    no: Mapped[str | None] = mapped_column(String(10))  # 제품 번호
    item_type: Mapped[str | None] = mapped_column(String(10))  # 품목 유형
    category_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.categories.id"))  # 카테고리 식별자
    maker_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.makers.id"))  # 제조사 식별자
    brand_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.brands.id"))  # 브랜드 식별자
    model_name: Mapped[str | None] = mapped_column(String(100))  # 모델명
    barcode: Mapped[str | None] = mapped_column(String(50))  # 바코드
    is_taxfree: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 면세 여부
    is_bigdeal: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 거액 거래 여부
    is_barcode: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 바코드 보유 여부
    is_serial: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 시리얼 관리 여부
    is_inventory: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 재고 관리 여부
    cto_id: Mapped[str | None] = mapped_column(String(50))  # CTO ID
    eclipse_id: Mapped[str | None] = mapped_column(String(20))  # Eclipse ID
    procure_id: Mapped[str | None] = mapped_column(String(20))  # 조달 ID
    std_cost_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 표준 원가
    std_sell_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 표준 판매가
    min_sell_price: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 최소 판매가
    currency: Mapped[str | None] = mapped_column(String(3), default='KRW')  # 통화 (ISO 4217)
    manager_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 제품 담당자 식별자
    image_url: Mapped[str | None] = mapped_column(String(200))  # 이미지 URL
    description: Mapped[str | None] = mapped_column(Text)  # 제품 설명
    specifications: Mapped[dict | None] = mapped_column(JSON)  # 제품 사양 (JSON 형태: {"cpu": "Intel i7", "memory": "16GB", "storage": "512GB SSD"})
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    status: Mapped[str | None] = mapped_column(String(20), default='ACTIVE')  # 상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING/EOL)
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그