from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Roles"]


class Roles(TenantBaseModel):
    """시스템 역할 정보를 관리하는 테이블 (RBAC - Role-Based Access Control 구현)"""
    __tablename__ = "roles"
    __table_args__ = {"schema": "sys"}

    code: Mapped[str] = mapped_column(String(50), nullable=False)  # 역할 코드 (테넌트 내 유니크, 예: ADMIN, MANAGER, USER)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # 역할명 (사용자에게 표시되는 이름)
    description: Mapped[str | None] = mapped_column(Text)  # 역할 설명
    is_system_role: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 시스템 기본 역할 여부 (true: 시스템 기본 역할/삭제 불가, false: 사용자 정의 역할)
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 상태
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그