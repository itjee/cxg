"""Executions 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Executions(BaseModel):
    """Executions 모델"""

    __tablename__ = "executions"
    __table_args__ = {"schema": "bkup"}

    backup_method: Mapped[str] = mapped_column(String(50), nullable=False, default="AUTOMATED")
    backup_format: Mapped[str] = mapped_column(String(20), nullable=False, default="COMPRESSED")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING")
    retry_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    retention_days: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Executions(id={self.id})>"
