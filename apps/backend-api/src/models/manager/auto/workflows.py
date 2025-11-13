"""Workflows 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Workflows(BaseModel):
    """Workflows 모델"""

    __tablename__ = "workflows"
    __table_args__ = {"schema": "auto"}

    input_schema: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    output_schema: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    max_concurrent_executions: Mapped[int | None] = mapped_column(Integer, default=1)
    execution_timeout: Mapped[int | None] = mapped_column(Integer, default=60)
    retry_policy: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    execution_context: Mapped[str | None] = mapped_column(String(50), default="SYSTEM")
    notify_success: Mapped[bool | None] = mapped_column(Boolean, default=False)
    notify_failure: Mapped[bool | None] = mapped_column(Boolean, default=True)
    total_executions: Mapped[int | None] = mapped_column(Integer, default=0)
    successful_executions: Mapped[int | None] = mapped_column(Integer, default=0)
    failed_executions: Mapped[int | None] = mapped_column(Integer, default=0)
    version: Mapped[str | None] = mapped_column(String(20), default="1.0")
    enabled: Mapped[bool | None] = mapped_column(Boolean, default=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Workflows(id={self.id})>"
