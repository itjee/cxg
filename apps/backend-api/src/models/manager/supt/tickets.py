"""Tickets 모델"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Tickets(BaseModel):
    """Tickets 모델"""

    __tablename__ = "tickets"
    __table_args__ = {"schema": "supt"}

    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="MEDIUM")
    sla_level: Mapped[str] = mapped_column(String(20), nullable=False, default="STANDARD")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="OPEN")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Tickets(id={self.id})>"
