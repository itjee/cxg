from uuid import UUID as PyUUID
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["Promotions"]


class Promotions(TenantBaseModel):
    """판매 프로모션/할인 관리 테이블 - 프로모션 및 할인 정책 관리"""
    __tablename__ = "promotions"
    __table_args__ = {"schema": "srm"}

    promotion_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)  # 프로모션 코드 (고유)
    promotion_name: Mapped[str] = mapped_column(String(200), nullable=False)  # 프로모션명
    promotion_type: Mapped[str] = mapped_column(String(30), nullable=False)  # 프로모션 유형 (DISCOUNT_PERCENT: 할인율, DISCOUNT_AMOUNT: 할인액, BUY_X_GET_Y: 묶음할인, BUNDLE: 번들, SEASONAL: 시즌할인, OTHER: 기타)
    description: Mapped[str | None] = mapped_column(Text)  # 프로모션 설명/상세 조건
    discount_percent: Mapped[Decimal | None] = mapped_column(Numeric(precision=5, scale=2))  # 할인율 (%, 예: 10.5)
    discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 할인액 (원화)
    min_order_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 최소 주문액 (이 금액 이상일 때만 적용)
    max_discount_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=2))  # 최대 할인액 (할인이 이 금액을 초과하지 않음)
    customer_segment_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("crm.customer_segments.id"))  # 고객 세그먼트 식별자 (NULL이면 전체 고객)
    product_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.products.id"))  # 제품 식별자 (NULL이면 전체 상품)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)  # 프로모션 시작일
    end_date: Mapped[date | None] = mapped_column(Date)  # 프로모션 종료일 (NULL이면 무기한)
    priority: Mapped[int | None] = mapped_column(Integer, default=0)  # 우선순위 (높을수록 먼저 적용, 여러 프로모션 중복 시 사용)
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 여부 (false: 일시 중단, 기간과 관계없이 적용 안 됨)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그