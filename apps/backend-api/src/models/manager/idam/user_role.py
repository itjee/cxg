"""사용자-역할 매핑 모델"""

from datetime import date, datetime
from uuid import UUID as PyUUID

from sqlalchemy import CheckConstraint, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class UserRole(BaseModel):
    """사용자-역할 매핑 모델"""

    __tablename__ = "user_roles"
    __table_args__ = (
        CheckConstraint(
            "status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')", name="ck_user_roles__status"
        ),
        CheckConstraint("scope IN ('GLOBAL', 'TENANT')", name="ck_user_roles__scope"),
        {"schema": "idam"},
    )

    user_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)
    role_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)

    # 권한 컨텍스트
    scope: Mapped[str] = mapped_column(String(20), nullable=False, default="GLOBAL", index=True)
    tenant_context: Mapped[PyUUID | None] = mapped_column(index=True)

    # 역할 부여 정보
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    granted_by: Mapped[PyUUID | None]
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)

    # 상태
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)

    def __repr__(self) -> str:
        return f"<UserRole(user_id={self.user_id}, role_id={self.role_id}, scope={self.scope})>"
