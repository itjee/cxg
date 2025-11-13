"""UsageStats 모델"""

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class UsageStats(BaseModel):
    """UsageStats 모델"""

    __tablename__ = "usage_stats"
    __table_args__ = {"schema": "stat"}

    total_users: Mapped[int | None] = mapped_column(Integer, default=0)
    active_users: Mapped[int | None] = mapped_column(Integer, default=0)
    new_users: Mapped[int | None] = mapped_column(Integer, default=0)
    churned_users: Mapped[int | None] = mapped_column(Integer, default=0)
    total_logins: Mapped[int | None] = mapped_column(Integer, default=0)
    total_api_calls: Mapped[int | None] = mapped_column(Integer, default=0)
    total_ai_requests: Mapped[int | None] = mapped_column(Integer, default=0)
    total_storage_used: Mapped[float | None] = mapped_column(Numeric, default=0)
    revenue: Mapped[float | None] = mapped_column(Numeric, default=0)
    churn_rate: Mapped[float | None] = mapped_column(Numeric, default=0)
    acquisition_cost: Mapped[float | None] = mapped_column(Numeric, default=0)
    lifetime_value: Mapped[float | None] = mapped_column(Numeric, default=0)
    avg_response_time: Mapped[float | None] = mapped_column(Numeric, default=0)
    error_count: Mapped[int | None] = mapped_column(Integer, default=0)
    uptime_minutes: Mapped[int | None] = mapped_column(Integer, default=0)
    downtime_minutes: Mapped[int | None] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<UsageStats(id={self.id})>"
