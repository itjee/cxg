"""TenantStats 모델"""

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class TenantStats(BaseModel):
    """TenantStats 모델"""

    __tablename__ = "tenant_stats"
    __table_args__ = {"schema": "stat"}

    analysis_period: Mapped[str] = mapped_column(String(20), nullable=False, default="DAILY")
    active_users_count: Mapped[int | None] = mapped_column(Integer, default=0)
    new_users_count: Mapped[int | None] = mapped_column(Integer, default=0)
    login_count: Mapped[int | None] = mapped_column(Integer, default=0)
    avg_session_duration: Mapped[float | None] = mapped_column(Numeric, default=0)
    api_calls_count: Mapped[int | None] = mapped_column(Integer, default=0)
    uploads_count: Mapped[int | None] = mapped_column(Integer, default=0)
    executions_count: Mapped[int | None] = mapped_column(Integer, default=0)
    ai_requests_count: Mapped[int | None] = mapped_column(Integer, default=0)
    used_storage: Mapped[float | None] = mapped_column(Numeric, default=0)
    grow_storage: Mapped[float | None] = mapped_column(Numeric, default=0)
    avg_response_time: Mapped[float | None] = mapped_column(Numeric, default=0)
    error_rate: Mapped[float | None] = mapped_column(Numeric, default=0)
    uptime_rate: Mapped[float | None] = mapped_column(Numeric, default=100)
    feature_adoption_rate: Mapped[float | None] = mapped_column(Numeric, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<TenantStats(id={self.id})>"
