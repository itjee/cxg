"""FeatureFlags 모델"""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class FeatureFlags(BaseModel):
    """FeatureFlags 모델"""

    __tablename__ = "feature_flags"
    __table_args__ = {"schema": "cnfg"}

    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    rollout_rate: Mapped[int | None] = mapped_column(Integer, default=0)
    target_environment: Mapped[str | None] = mapped_column(String(20), default="PRODUCTION")
    activation_conditions: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    deactivation_conditions: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    usage_count: Mapped[int | None] = mapped_column(Integer, default=0)
    error_count: Mapped[int | None] = mapped_column(Integer, default=0)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<FeatureFlags(id={self.id})>"
