"""RecoveryPlans 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class RecoveryPlans(BaseModel):
    """RecoveryPlans 모델"""

    __tablename__ = "recovery_plans"
    __table_args__ = {"schema": "bkup"}

    automated_steps: Mapped[dict] = mapped_column(JSONB, nullable=False, default="[]")
    manual_steps: Mapped[dict] = mapped_column(JSONB, nullable=False, default="[]")
    minimum_backup_age: Mapped[int] = mapped_column(Integer, nullable=False, default=24)
    test_frequency_days: Mapped[int] = mapped_column(Integer, nullable=False, default=90)
    test_results: Mapped[dict] = mapped_column(JSONB, nullable=False, default="{}")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<RecoveryPlans(id={self.id})>"
