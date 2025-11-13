"""Executions 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Executions(BaseModel):
    """Executions 모델"""

    __tablename__ = "executions"
    __table_args__ = {"schema": "auto"}

    input_data: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    output_data: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING")
    error_details: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    retry_count: Mapped[int | None] = mapped_column(Integer, default=0)
    execution_logs: Mapped[dict | None] = mapped_column(JSONB, default="[]")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Executions(id={self.id})>"
