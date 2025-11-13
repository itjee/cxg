"""ServiceQuotas 모델"""

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class ServiceQuotas(BaseModel):
    """ServiceQuotas 모델"""

    __tablename__ = "service_quotas"
    __table_args__ = {"schema": "cnfg"}

    quota_used: Mapped[int | None] = mapped_column(Integer, default=0)
    quota_period: Mapped[str] = mapped_column(String(20), nullable=False, default="MONTHLY")
    warning_threshold_rate: Mapped[int | None] = mapped_column(Integer, default=80)
    critical_threshold_rate: Mapped[int | None] = mapped_column(Integer, default=95)
    warning_alert_sent: Mapped[bool | None] = mapped_column(Boolean, default=False)
    critical_alert_sent: Mapped[bool | None] = mapped_column(Boolean, default=False)
    allow_overage: Mapped[bool | None] = mapped_column(Boolean, default=False)
    overage_unit_charge: Mapped[float | None] = mapped_column(Numeric, default=0)
    max_overage_rate: Mapped[int | None] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE")
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<ServiceQuotas(id={self.id})>"
