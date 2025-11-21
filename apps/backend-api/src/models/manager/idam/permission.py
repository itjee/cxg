"""권한 모델"""

from sqlalchemy import Boolean, CheckConstraint, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Permission(BaseModel):
    """권한 모델"""

    __tablename__ = "permissions"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE')", name="ck_permissions__status"),
        CheckConstraint(
            "action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LIST', 'MANAGE')",
            name="ck_permissions__action",
        ),
        CheckConstraint("scope IN ('GLOBAL', 'TENANT')", name="ck_permissions__scope"),
        CheckConstraint(
            "applies_to IN ('ALL', 'MASTER', 'TENANT', 'SYSTEM')", name="ck_permissions__applies_to"
        ),
        {"schema": "idam"},
    )

    # 권한 정보
    code: Mapped[str] = mapped_column(
        String(100), nullable=False, unique=True, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # 권한 레벨
    resource: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # 권한 스코프
    scope: Mapped[str] = mapped_column(String(20), nullable=False, default="GLOBAL", index=True)
    applies_to: Mapped[str] = mapped_column(String(20), nullable=False, default="ALL", index=True)

    # 메타데이터
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)

    def __repr__(self) -> str:
        return f"<Permission(id={self.id}, code={self.code})>"
