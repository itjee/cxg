"""Notifications 모델"""

from datetime import date, datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Notifications(BaseModel):
    """Notifications 모델"""

    __tablename__ = "notifications"
    __table_args__ = {"schema": "noti"}

    target_type: Mapped[str] = mapped_column(String(20), nullable=False, default="USER")
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="MEDIUM")
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    delivery_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    action_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING")
    delivery_status: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Notifications(id={self.id})>"
