"""Incidents 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Incidents(BaseModel):
    """Incidents 모델"""

    __tablename__ = "incidents"
    __table_args__ = {"schema": "mntr"}

    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="MEDIUM")
    impact_scope: Mapped[str] = mapped_column(String(20), nullable=False, default="PARTIAL")
    escalation_level: Mapped[int | None] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="OPEN")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Incidents(id={self.id})>"
