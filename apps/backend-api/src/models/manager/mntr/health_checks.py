"""HealthChecks 모델"""

from sqlalchemy import Boolean, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class HealthChecks(BaseModel):
    """HealthChecks 모델"""

    __tablename__ = "health_checks"
    __table_args__ = {"schema": "mntr"}

    timeout_duration: Mapped[int | None] = mapped_column(Integer, default=5000)
    check_data: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<HealthChecks(id={self.id})>"
