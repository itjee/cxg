"""SystemMetrics 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class SystemMetrics(BaseModel):
    """SystemMetrics 모델"""

    __tablename__ = "system_metrics"
    __table_args__ = {"schema": "mntr"}

    summary_period: Mapped[str | None] = mapped_column(String(20), default="MINUTE")
    alert_triggered: Mapped[bool | None] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<SystemMetrics(id={self.id})>"
