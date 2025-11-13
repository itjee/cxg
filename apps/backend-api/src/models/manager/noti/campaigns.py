"""Campaigns 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Campaigns(BaseModel):
    """Campaigns 모델"""

    __tablename__ = "campaigns"
    __table_args__ = {"schema": "noti"}

    target_type: Mapped[str] = mapped_column(String(20), nullable=False, default="users")
    sender_name: Mapped[str] = mapped_column(String(100), nullable=False, default="AI")
    sender_email: Mapped[str] = mapped_column(
        String(255), nullable=False, default="noreply@platform.com"
    )
    send_immediately: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, default="Asia/Seoul")
    total_recipients: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sent_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    delivered_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    opened_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    clicked_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bounced_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    unsubscribed_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_ab_test: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Campaigns(id={self.id})>"
