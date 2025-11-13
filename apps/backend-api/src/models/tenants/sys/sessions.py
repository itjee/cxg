"""테넌트 사용자 세션 관리 모델"""

from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, INET
from datetime import date, datetime

from ..base import TenantBaseModel

__all__ = ["Sessions"]


class Sessions(TenantBaseModel):
    """테넌트 사용자 세션 관리 - 로그인 상태 추적 및 보안 모니터링"""
    __tablename__ = "sessions"
    __table_args__ = {"schema": "sys"}

    user_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("sys.users.id", ondelete="CASCADE"), nullable=False)

    # 세션 정보
    session_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)  # 세션 고유 식별자
    session_token_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)  # 토큰 해시 (보안)

    # 디바이스/클라이언트 정보
    device_type: Mapped[str | None] = mapped_column(String(50), nullable=True)  # WEB, MOBILE, API, DESKTOP
    device_name: Mapped[str | None] = mapped_column(String(255), nullable=True)  # 예: "iPhone 13", "Windows 10"
    browser: Mapped[str | None] = mapped_column(String(100), nullable=True)  # 예: "Chrome", "Safari"
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)  # 전체 User-Agent 헤더

    # 네트워크 정보
    ip_address: Mapped[str] = mapped_column(INET, nullable=False)  # IPv4 또는 IPv6
    country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)  # 국가 코드 (예: KR)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)  # 도시명

    # 세션 라이프사이클
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)  # 세션 만료 시각
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )  # 마지막 활동

    # 상태 관리
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, EXPIRED, REVOKED
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)  # 수동 로그아웃 시각
    revoke_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)  # 로그아웃 사유
