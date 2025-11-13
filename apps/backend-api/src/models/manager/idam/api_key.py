"""API 키 모델"""

from datetime import date, datetime
from uuid import UUID as PyUUID

from sqlalchemy import ARRAY, CheckConstraint, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class ApiKey(BaseModel):
    """API 키 모델"""

    __tablename__ = "api_keys"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'REVOKED')", name="ck_api_keys__status"),
        {"schema": "idam"},
    )

    # API 키 정보
    key_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    key_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    key_name: Mapped[str] = mapped_column(String(100), nullable=False)

    # 소유자 정보
    user_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)
    tenant_context: Mapped[PyUUID | None] = mapped_column(index=True)
    service_account: Mapped[str | None] = mapped_column(String(100), index=True)

    # 권한 및 스코프
    scopes: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    allowed_ips: Mapped[list[str] | None] = mapped_column(ARRAY(INET))

    # 사용 제한
    rate_limit_per_minute: Mapped[int] = mapped_column(Integer, default=1000)
    rate_limit_per_hour: Mapped[int] = mapped_column(Integer, default=10000)
    rate_limit_per_day: Mapped[int] = mapped_column(Integer, default=100000)

    # 상태 및 만료
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)

    # 사용 통계
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    last_used_ip: Mapped[str | None] = mapped_column(INET)
    usage_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)

    def __repr__(self) -> str:
        return f"<ApiKey(id={self.id}, key_id={self.key_id})>"
