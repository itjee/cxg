"""역할-권한 매핑 모델"""

from datetime import date, datetime
from uuid import UUID as PyUUID

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class RolePermission(BaseModel):
    """역할-권한 매핑 모델"""

    __tablename__ = "role_permissions"
    __table_args__ = {"schema": "idam"}

    role_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)
    permission_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)

    # 권한 부여 조건
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    granted_by: Mapped[PyUUID | None]

    def __repr__(self) -> str:
        return f"<RolePermission(role_id={self.role_id}, permission_id={self.permission_id})>"
