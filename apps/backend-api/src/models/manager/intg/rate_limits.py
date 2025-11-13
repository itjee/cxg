"""RateLimits 모델"""

from datetime import date, datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class RateLimits(BaseModel):
    """RateLimits 모델"""

    __tablename__ = "rate_limits"
    __table_args__ = {"schema": "intg"}

    current_usage: Mapped[int | None] = mapped_column(Integer, default=0)
    window_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    action_on_exceed: Mapped[str] = mapped_column(String(20), nullable=False, default="BLOCK")
    burst_allowance: Mapped[int | None] = mapped_column(Integer, default=0)
    total_requests: Mapped[int | None] = mapped_column(Integer, default=0)
    blocked_requests: Mapped[int | None] = mapped_column(Integer, default=0)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<RateLimits(id={self.id})>"
