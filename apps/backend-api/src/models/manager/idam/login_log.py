"""로그인 이력 모델"""

from uuid import UUID as PyUUID

from sqlalchemy import Boolean, CheckConstraint, String, Text
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class LoginLog(BaseModel):
    """로그인 이력 모델"""

    __tablename__ = "login_logs"
    __table_args__ = (
        CheckConstraint(
            "attempt_type IN ('LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'LOCKED', 'PASSWORD_RESET')",
            name="ck_idam_login_logs__attempt_type",
        ),
        CheckConstraint(
            "user_type IN ('MASTER', 'TENANT', 'SYSTEM')", name="ck_login_logs__user_type"
        ),
        {"schema": "idam"},
    )

    user_id: Mapped[PyUUID | None] = mapped_column(index=True)
    user_type: Mapped[str | None] = mapped_column(String(20), index=True)
    tenant_context: Mapped[PyUUID | None] = mapped_column(index=True)
    username: Mapped[str | None] = mapped_column(String(100), index=True)

    # 로그인 시도 정보
    attempt_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False, index=True)
    failure_reason: Mapped[str | None] = mapped_column(String(100), index=True)

    # 세션 정보
    session_id: Mapped[str | None] = mapped_column(String(255))
    ip_address: Mapped[str] = mapped_column(INET, nullable=False, index=True)
    user_agent: Mapped[str | None] = mapped_column(Text)
    country_code: Mapped[str | None] = mapped_column(String(2))
    city: Mapped[str | None] = mapped_column(String(100))

    # MFA 정보
    mfa_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    mfa_method: Mapped[str | None] = mapped_column(String(50))

    def __repr__(self) -> str:
        return f"<LoginLog(id={self.id}, user_id={self.user_id}, type={self.attempt_type}, success={self.success})>"
