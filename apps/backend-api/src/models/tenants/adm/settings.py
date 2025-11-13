from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Settings"]


class Settings(TenantBaseModel):
    """시스템 설정 테이블 - 애플리케이션 설정 및 환경 변수 관리"""
    __tablename__ = "settings"
    __table_args__ = {"schema": "adm"}

    key: Mapped[str] = mapped_column(String(100), nullable=False)  # 설정 키 (도메인.기능.속성 형태 권장, 예: app.email.smtp_host)
    value: Mapped[str | None] = mapped_column(Text)  # 설정 값
    value_type: Mapped[str] = mapped_column(String(20), nullable=False, default='STRING')  # 값 타입 (STRING/NUMBER/BOOLEAN/JSON)
    default_value: Mapped[str | None] = mapped_column(Text)  # 기본값 (설정 초기화용)
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리 (system/tenant/feature 등)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)  # 활성 여부
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 시스템 설정 여부 (수정 제한)
    is_encrypted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 암호화 여부 (민감정보 표시)