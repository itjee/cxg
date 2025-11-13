"""TenantFeatures 모델"""

from datetime import date, datetime

from sqlalchemy import Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class TenantFeatures(BaseModel):
    """TenantFeatures 모델"""

    __tablename__ = "tenant_features"
    __table_args__ = {"schema": "cnfg"}

    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<TenantFeatures(id={self.id})>"
