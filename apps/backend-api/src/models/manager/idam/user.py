"""사용자 모델"""

from datetime import date, datetime

from sqlalchemy import ARRAY, Boolean, CheckConstraint, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class User(BaseModel):
    """사용자 모델"""

    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')", name="ck_users__status"
        ),
        CheckConstraint("user_type IN ('MASTER', 'TENANT', 'SYSTEM')", name="ck_users__user_type"),
        CheckConstraint(
            "(sso_provider IS NULL AND sso_subject IS NULL) OR (sso_provider IS NOT NULL AND sso_subject IS NOT NULL)",
            name="ck_users__sso_consistency",
        ),
        {"schema": "idam"},
    )

    # 사용자 기본 정보
    user_type: Mapped[str] = mapped_column(String(20), nullable=False, default="USER")
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20))

    # 인증 정보
    username: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    password: Mapped[str | None] = mapped_column(String(255))
    salt_key: Mapped[str | None] = mapped_column(String(100))

    # SSO 정보
    sso_provider: Mapped[str | None] = mapped_column(String(50))
    sso_subject: Mapped[str | None] = mapped_column(String(255))

    # MFA 설정
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    mfa_secret: Mapped[str | None] = mapped_column(String(255))
    backup_codes: Mapped[list[str] | None] = mapped_column(ARRAY(Text))

    # 계정 상태
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)

    # 보안 정보
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_login_ip: Mapped[str | None] = mapped_column(INET)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    password_changed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    force_password_change: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # 비밀번호 재설정
    password_reset_token: Mapped[str | None] = mapped_column(String(255))
    password_reset_token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # 추가 메타데이터
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    locale: Mapped[str] = mapped_column(String(10), default="ko-KR")
    department: Mapped[str | None] = mapped_column(String(100))
    position: Mapped[str | None] = mapped_column(String(100))

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username}, user_type={self.user_type})>"
