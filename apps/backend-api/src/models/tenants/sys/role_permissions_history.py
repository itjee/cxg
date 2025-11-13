"""역할 권한 변경 이력 모델"""

from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from datetime import date, datetime

from src.core.database import Base

__all__ = ["RolePermissionsHistory"]


class RolePermissionsHistory(Base):
    """역할 권한 변경 이력 (감시/감사용)"""
    __tablename__ = "role_permissions_history"
    __table_args__ = {"schema": "sys"}

    id: Mapped[PyUUID] = mapped_column(primary_key=True, default=lambda: __import__('uuid').uuid4())

    # 테넌트, 역할, 권한
    tenant_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    role_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.roles.id", ondelete="CASCADE"), nullable=False)
    permission_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.permissions.id", ondelete="CASCADE"), nullable=False)

    # 변경 정보
    action: Mapped[str] = mapped_column(String(20), nullable=False)  # GRANTED, REVOKED
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )  # 변경 시각
    changed_by: Mapped[PyUUID | None] = mapped_column(UUID, nullable=True)  # 누가 변경했나

    # 변경 사유
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)  # 예: "Audit compliance", "User request"
