"""Tasks 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Tasks(BaseModel):
    """Tasks 모델"""

    __tablename__ = "tasks"
    __table_args__ = {"schema": "auto"}

    timezone: Mapped[str | None] = mapped_column(String(50), default="Asia/Seoul")
    parameters: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    environment_variables: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    max_execution_time: Mapped[int | None] = mapped_column(Integer, default=60)
    max_instances: Mapped[int | None] = mapped_column(Integer, default=1)
    notify_success: Mapped[bool | None] = mapped_column(Boolean, default=False)
    notify_failure: Mapped[bool | None] = mapped_column(Boolean, default=True)
    total_runs: Mapped[int | None] = mapped_column(Integer, default=0)
    successful_runs: Mapped[int | None] = mapped_column(Integer, default=0)
    failed_runs: Mapped[int | None] = mapped_column(Integer, default=0)
    enabled: Mapped[bool | None] = mapped_column(Boolean, default=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Tasks(id={self.id})>"
