"""세션 모델"""

from datetime import date, datetime, timezone
from uuid import UUID as PyUUID

from sqlalchemy import Boolean, CheckConstraint, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Session(BaseModel):
    """세션 모델"""

    __tablename__ = "sessions"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'EXPIRED', 'REVOKED')", name="ck_sessions__status"),
        CheckConstraint(
            "session_type IN ('WEB', 'API', 'MOBILE')", name="ck_sessions__session_type"
        ),
        {"schema": "idam"},
    )

    # 세션 정보
    session_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    user_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)

    # 세션 컨텍스트
    tenant_context: Mapped[PyUUID | None] = mapped_column(index=True)
    session_type: Mapped[str] = mapped_column(String(20), nullable=False, default="WEB")

    # 세션 메타데이터
    fingerprint: Mapped[str | None] = mapped_column(String(255), index=True)
    user_agent: Mapped[str | None] = mapped_column(Text)
    ip_address: Mapped[str] = mapped_column(INET, nullable=False, index=True)
    country_code: Mapped[str | None] = mapped_column(String(2))
    city: Mapped[str | None] = mapped_column(String(100))

    # 세션 상태
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )

    # MFA 정보
    mfa_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    mfa_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    def __repr__(self) -> str:
        return f"<Session(id={self.id}, user_id={self.user_id}, type={self.session_type})>"
