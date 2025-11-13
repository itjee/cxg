from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["RolePermissions"]


class RolePermissions(TenantBaseModel):
    """역할과 권한의 매핑 테이블 (RBAC 구현을 위한 역할별 권한 할당 관리)"""
    __tablename__ = "role_permissions"
    __table_args__ = {"schema": "sys"}

    role_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.roles.id"), nullable=False)  # 역할 ID
    permission_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.permissions.id"), nullable=False)  # 권한 ID
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 상태