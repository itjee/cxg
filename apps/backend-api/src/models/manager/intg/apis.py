"""Apis 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Apis(BaseModel):
    """Apis 모델"""

    __tablename__ = "apis"
    __table_args__ = {"schema": "intg"}

    authentication_type: Mapped[str] = mapped_column(String(50), nullable=False, default="API_KEY")
    configuration: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    mapping_rules: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    sync_frequency: Mapped[str] = mapped_column(String(20), nullable=False, default="HOURLY")
    consecutive_failures: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_requests: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    successful_requests: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    failed_requests: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rate_limit: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    daily_limit: Mapped[int] = mapped_column(Integer, nullable=False, default=10000)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Apis(id={self.id})>"
