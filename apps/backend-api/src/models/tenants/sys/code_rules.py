from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["CodeRules"]


class CodeRules(TenantBaseModel):
    """엔티티별 코드 자동 생성 규칙 관리 테이블 (Prefix 및 일련번호 관리)"""
    __tablename__ = "code_rules"
    __table_args__ = {"schema": "sys"}

    entity_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 엔티티명 (예: 거래처, 제품, 창고)
    entity_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)
    prefix: Mapped[str] = mapped_column(String(3), nullable=False)  # 코드 Prefix (3자리 영문 대문자, 예: MBP, MPD, MWH)
    current_number: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 현재 일련번호 (다음 발급될 번호)
    digit_length: Mapped[int] = mapped_column(Integer, nullable=False, default=4)  # 일련번호 자릿수 (2-10)
    description: Mapped[str | None] = mapped_column(Text)  # 규칙 설명
    example_code: Mapped[str | None] = mapped_column(String(20))  # 코드 형식 예시 (예: MBP0001)
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 상태
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그