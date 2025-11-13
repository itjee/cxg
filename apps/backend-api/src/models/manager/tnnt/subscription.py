"""구독 모델"""

from datetime import date
from uuid import UUID as PyUUID

from sqlalchemy import CHAR, Boolean, CheckConstraint, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Subscription(BaseModel):
    """테넌트 구독 및 요금제 관리"""

    __tablename__ = "subscriptions"
    __table_args__ = (
        CheckConstraint(
            "status IN ('ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELED')",
            name="ck_subscriptions__status",
        ),
        CheckConstraint(
            "billing_cycle IN ('MONTHLY', 'QUARTERLY', 'YEARLY')",
            name="ck_subscriptions__billing_cycle",
        ),
        CheckConstraint("max_users IS NULL OR max_users > 0", name="ck_subscriptions__max_users"),
        CheckConstraint(
            "max_storage IS NULL OR max_storage > 0", name="ck_subscriptions__max_storage"
        ),
        CheckConstraint(
            "max_api_calls IS NULL OR max_api_calls > 0", name="ck_subscriptions__max_api_calls"
        ),
        CheckConstraint("base_amount >= 0", name="ck_subscriptions__base_amount"),
        CheckConstraint("user_amount >= 0", name="ck_subscriptions__user_amount"),
        CheckConstraint(
            "close_date IS NULL OR close_date >= start_date", name="ck_subscriptions__date_valid"
        ),
        {"schema": "tnnt"},
    )

    # 테넌트 연결
    tenant_id: Mapped[PyUUID] = mapped_column(
        ForeignKey("tnnt.tenants.id"), nullable=False, index=True
    )

    # 구독 계획 정보
    plan_id: Mapped[PyUUID] = mapped_column(nullable=False, index=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    close_date: Mapped[date | None] = mapped_column(Date, index=True)
    billing_cycle: Mapped[str] = mapped_column(
        String(20), nullable=False, default="MONTHLY", index=True
    )

    # 사용량 제한 설정
    max_users: Mapped[int | None] = mapped_column(Integer, default=50)
    max_storage: Mapped[int | None] = mapped_column(Integer, default=100)
    max_api_calls: Mapped[int | None] = mapped_column(Integer, default=10000)

    # 요금 정보
    base_amount: Mapped[float] = mapped_column(nullable=False)
    user_amount: Mapped[float] = mapped_column(default=0)
    currency: Mapped[str] = mapped_column(CHAR(3), nullable=False, default="KRW")

    # 갱신 설정
    auto_renewal: Mapped[bool] = mapped_column(Boolean, default=True)
    noti_renewal: Mapped[bool] = mapped_column(Boolean, default=False)

    # 상태 관리
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)
    deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Subscription(id={self.id}, tenant_id={self.tenant_id}, plan_id={self.plan_id})>"
