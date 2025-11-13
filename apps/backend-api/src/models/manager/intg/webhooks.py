"""Webhooks 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Webhooks(BaseModel):
    """Webhooks 모델"""

    __tablename__ = "webhooks"
    __table_args__ = {"schema": "intg"}

    event_filters: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    signature_algorithm: Mapped[str | None] = mapped_column(String(20), default="HMAC_SHA256")
    http_method: Mapped[str | None] = mapped_column(String(10), default="POST")
    content_type: Mapped[str | None] = mapped_column(String(50), default="application/json")
    custom_headers: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    timeout: Mapped[int | None] = mapped_column(Integer, default=30)
    max_retry_attempts: Mapped[int | None] = mapped_column(Integer, default=3)
    retry_backoff: Mapped[int | None] = mapped_column(Integer, default=60)
    total_deliveries: Mapped[int | None] = mapped_column(Integer, default=0)
    successful_deliveries: Mapped[int | None] = mapped_column(Integer, default=0)
    failed_deliveries: Mapped[int | None] = mapped_column(Integer, default=0)
    enabled: Mapped[bool | None] = mapped_column(Boolean, default=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Webhooks(id={self.id})>"
