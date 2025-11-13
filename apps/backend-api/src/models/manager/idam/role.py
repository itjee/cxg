"""역할 모델"""

from sqlalchemy import Boolean, CheckConstraint, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Role(BaseModel):
    """역할 모델"""

    __tablename__ = "roles"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE')", name="ck_roles__status"),
        CheckConstraint(
            "category IN ('MANAGER_ADMIN', 'PLATFORM_SUPPORT', 'TENANT_ADMIN', 'TENANT_USER')",
            name="ck_roles__category",
        ),
        CheckConstraint("level >= 1 AND level <= 200", name="ck_roles__level"),
        CheckConstraint("scope IN ('GLOBAL', 'TENANT')", name="ck_roles__scope"),
        CheckConstraint(
            """(category = 'MANAGER_ADMIN' AND scope = 'GLOBAL') OR
               (category = 'PLATFORM_SUPPORT' AND scope = 'GLOBAL') OR
               (category = 'TENANT_ADMIN' AND scope IN ('GLOBAL', 'TENANT')) OR
               (category = 'TENANT_USER' AND scope = 'TENANT')""",
            name="ck_roles__category_scope",
        ),
        {"schema": "idam"},
    )

    # 역할 정보
    code: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    # 역할 속성 - type을 category와 level로 변경
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="TENANT_USER", index=True)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=100, index=True)
    scope: Mapped[str] = mapped_column(String(20), nullable=False, default="GLOBAL", index=True)
    is_default: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False, default=100, index=True)

    # 상태
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)

    def __repr__(self) -> str:
        return f"<Role(id={self.id}, code={self.code}, category={self.category}, level={self.level})>"
