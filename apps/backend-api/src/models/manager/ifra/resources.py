"""Resources 모델"""

from uuid import UUID
from decimal import Decimal

from sqlalchemy import CHAR, Boolean, CheckConstraint, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Resources(BaseModel):
    """클라우드 리소스 관리 모델"""

    __tablename__ = "resources"
    __table_args__ = (
        CheckConstraint(
            "resource IN ('DATABASE', 'STORAGE', 'COMPUTE', 'NETWORK', 'CACHE', 'LOAD_BALANCER', 'CDN')",
            name="ck_resources__resource_type"
        ),
        CheckConstraint(
            "status IN ('PROVISIONING', 'RUNNING', 'STOPPED', 'TERMINATED', 'ERROR', 'MAINTENANCE')",
            name="ck_resources__status"
        ),
        CheckConstraint(
            "currency IN ('USD', 'KRW', 'EUR', 'JPY')",
            name="ck_resources__currency"
        ),
        CheckConstraint("cpu_cores IS NULL OR cpu_cores > 0", name="ck_resources__cpu_cores"),
        CheckConstraint("memory_size IS NULL OR memory_size > 0", name="ck_resources__memory_size"),
        CheckConstraint("storage_size IS NULL OR storage_size > 0", name="ck_resources__storage_size"),
        CheckConstraint("hourly_cost IS NULL OR hourly_cost >= 0", name="ck_resources__hourly_cost"),
        CheckConstraint("monthly_cost IS NULL OR monthly_cost >= 0", name="ck_resources__monthly_cost"),
        {"schema": "ifra"},
    )

    # 테넌트 연결
    tenant_id: Mapped[UUID | None] = mapped_column(nullable=True, index=True)

    # 리소스 기본 정보
    resource: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    resource_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_arn: Mapped[str | None] = mapped_column(String(500))
    resource_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)

    # 리소스 위치 정보
    region: Mapped[str] = mapped_column(String(50), nullable=False, default="ap-northeast-2", index=True)
    availability_zone: Mapped[str | None] = mapped_column(String(50))

    # 리소스 스펙 정보
    instance_type: Mapped[str | None] = mapped_column(String(50), index=True)
    cpu_cores: Mapped[int | None] = mapped_column(Integer)
    memory_size: Mapped[int | None] = mapped_column(Integer)
    storage_size: Mapped[int | None] = mapped_column(Integer)

    # 비용 관리 정보
    hourly_cost: Mapped[Decimal | None] = mapped_column(Numeric(18, 4))
    monthly_cost: Mapped[Decimal | None] = mapped_column(Numeric(18, 4), index=True)
    currency: Mapped[str] = mapped_column(CHAR(3), nullable=False, default="USD")

    # 확장 가능한 메타데이터
    tags: Mapped[dict | None] = mapped_column(JSONB, default="{}")
    configuration: Mapped[dict | None] = mapped_column(JSONB, default="{}")

    # 리소스 상태 관리
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PROVISIONING", index=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Resources(id={self.id}, resource_name={self.resource_name}, resource={self.resource})>"
