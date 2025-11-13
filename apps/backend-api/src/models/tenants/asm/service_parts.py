from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ServiceParts"]


class ServiceParts(TenantBaseModel):
    """A/S 작업시 사용된 부품 내역 관리 테이블"""
    __tablename__ = "service_parts"
    __table_args__ = {"schema": "asm"}

    service_request_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("asm.service_requests.id"), nullable=False)  # A/S 요청 식별자
    product_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("pim.products.id"), nullable=False)  # 부품(제품) 식별자
    part_name: Mapped[str | None] = mapped_column(String(200))  # 부품명
    part_code: Mapped[str | None] = mapped_column(String(50))  # 부품 코드
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 부품 시리얼 번호
    qty: Mapped[int] = mapped_column(Integer, nullable=False)  # 사용 수량
    unit_cost: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 부품 단가
    total_cost: Mapped[Decimal] = mapped_column(Numeric(precision=18, scale=4), nullable=False)  # 총 비용 (단가 × 수량)
    part_condition: Mapped[str | None] = mapped_column(String(20))  # 부품 상태 (NEW: 신품/REFURBISHED: 리퍼/USED: 중고)
    warranty_months: Mapped[int | None] = mapped_column(Integer)  # 부품 보증 개월수
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그