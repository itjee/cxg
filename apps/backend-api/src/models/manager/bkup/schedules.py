"""Schedules 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Schedules(BaseModel):
    """Schedules 모델"""

    __tablename__ = "schedules"
    __table_args__ = {"schema": "bkup"}

    target_scope: Mapped[str] = mapped_column(String(50), nullable=False, default="ALL_TENANTS")
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="Asia/Seoul")
    backup_format: Mapped[str] = mapped_column(String(20), nullable=False, default="COMPRESSED")
    retention_days: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    max_parallel_jobs: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    notify_success: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    notify_failure: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Schedules(id={self.id})>"
