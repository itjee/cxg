"""Feedbacks 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Feedbacks(BaseModel):
    """Feedbacks 모델"""

    __tablename__ = "feedbacks"
    __table_args__ = {"schema": "supt"}

    feature_ratings: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    urgency: Mapped[str | None] = mapped_column(String(20), default="MEDIUM")
    implement_status: Mapped[str | None] = mapped_column(String(20), default="SUBMITTED")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Feedbacks(id={self.id})>"
