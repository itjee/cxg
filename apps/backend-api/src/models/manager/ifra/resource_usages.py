"""ResourceUsages 모델"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class ResourceUsages(BaseModel):
    """리소스 사용량 메트릭 모델"""

    __tablename__ = "resource_usages"
    __table_args__ = (
        CheckConstraint(
            "summary_period IN ('MINUTE', 'HOURLY', 'DAILY', 'MONTHLY')",
            name="ck_resource_usages__summary_period",
        ),
        CheckConstraint(
            "metric_name IN ('CPU_UTILIZATION', 'MEMORY_USAGE', 'DISK_USAGE', 'NETWORK_IN', 'NETWORK_OUT', 'IOPS', 'LATENCY')",
            name="ck_resource_usages__metric_name",
        ),
        CheckConstraint(
            "metric_unit IN ('PERCENT', 'BYTES', 'COUNT', 'MBPS', 'MILLISECONDS')",
            name="ck_resource_usages__metric_unit",
        ),
        CheckConstraint("metric_value >= 0", name="ck_resource_usages__metric_value"),
        {"schema": "ifra"},
    )

    # 리소스 연결
    resource_id: Mapped[UUID] = mapped_column(ForeignKey("ifra.resources.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id: Mapped[UUID | None] = mapped_column(ForeignKey("tnnt.tenants.id", ondelete="CASCADE"), nullable=True, index=True)

    # 메트릭 정보
    metric_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    metric_value: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    metric_unit: Mapped[str] = mapped_column(String(20), nullable=False)

    # 시간 정보
    measure_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    summary_period: Mapped[str] = mapped_column(String(20), nullable=False, default="HOURLY", index=True)

    def __repr__(self) -> str:
        return f"<ResourceUsages(id={self.id}, resource_id={self.resource_id}, metric_name={self.metric_name})>"
