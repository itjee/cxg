"""Configurations 모델"""

from datetime import date, datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Configurations(BaseModel):
    """Configurations 모델"""

    __tablename__ = "configurations"
    __table_args__ = {"schema": "cnfg"}

    config_type: Mapped[str] = mapped_column(String(20), nullable=False, default="STRING")
    required: Mapped[bool | None] = mapped_column(Boolean, default=False)
    validation_rules: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    environment: Mapped[str] = mapped_column(String(20), nullable=False, default="PRODUCTION")
    applies_to_all: Mapped[bool | None] = mapped_column(Boolean, default=True)
    start_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Configurations(id={self.id})>"
