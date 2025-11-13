"""Plans 모델 - 요금제 마스터"""

from datetime import date

from sqlalchemy import CHAR, Boolean, CheckConstraint, Date, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Plans(BaseModel):
    """
    Plans 모델 - 요금제 마스터.

    서비스 요금제의 가격 정책, 사용량 제한, 포함 기능을 정의하는 핵심 테이블.

    속성:
        code: 요금제 식별 코드 (예: PLAN_TRIAL, PLAN_STD, PLAN_PRO)
        name: 사용자에게 표시되는 요금제명
        type: 요금제 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)
        description: 요금제 상세 설명
        base_price: 기본 요금 (월/분기/년 단위)
        user_price: 사용자당 추가 요금
        currency: 통화 단위 (ISO 4217 코드)
        billing_cycle: 청구 주기 (MONTHLY/QUARTERLY/YEARLY)
        max_users: 최대 사용자 수 제한
        max_storage: 최대 스토리지 용량 (GB)
        max_api_calls: 월간 최대 API 호출 수
        features: 포함된 기능 목록 (JSON 형태)
        start_time: 요금제 적용 시작일
        close_time: 요금제 적용 종료일 (NULL: 무기한)
        status: 요금제 상태 (ACTIVE/INACTIVE/ARCHIVED)
        deleted: 논리적 삭제 플래그
    """

    __tablename__ = "plans"
    __table_args__ = (
        CheckConstraint("type IN ('TRIAL', 'STANDARD', 'PREMIUM', 'ENTERPRISE')", name="ck_plans__type"),
        CheckConstraint("billing_cycle IN ('MONTHLY', 'QUARTERLY', 'YEARLY')", name="ck_plans__billing_cycle"),
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')", name="ck_plans__status"),
        CheckConstraint("base_price >= 0", name="ck_plans__base_price"),
        CheckConstraint("user_price >= 0", name="ck_plans__user_price"),
        CheckConstraint("max_users IS NULL OR max_users > 0", name="ck_plans__max_users"),
        CheckConstraint("max_storage IS NULL OR max_storage > 0", name="ck_plans__max_storage"),
        CheckConstraint("max_api_calls IS NULL OR max_api_calls > 0", name="ck_plans__max_api_calls"),
        CheckConstraint("close_time IS NULL OR close_time >= start_time", name="ck_plans__valid_period"),
        {"schema": "bill"},
    )

    # 요금제 기본 정보
    code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
        comment="요금제 식별 코드 (예: PLAN_TRIAL, PLAN_STD, PLAN_PRO)"
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="사용자에게 표시되는 요금제명"
    )
    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="STANDARD",
        index=True,
        comment="요금제 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)"
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        comment="요금제 상세 설명"
    )

    # 가격 정보
    base_price: Mapped[float] = mapped_column(
        Numeric(18, 4),
        nullable=False,
        comment="기본 요금 (월/분기/년 단위)"
    )
    user_price: Mapped[float] = mapped_column(
        Numeric(18, 4),
        default=0,
        comment="사용자당 추가 요금"
    )
    currency: Mapped[str] = mapped_column(
        CHAR(3),
        nullable=False,
        default="KRW",
        comment="통화 단위 (ISO 4217 코드)"
    )
    billing_cycle: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="MONTHLY",
        index=True,
        comment="청구 주기 (MONTHLY/QUARTERLY/YEARLY)"
    )

    # 사용량 제한 정보
    max_users: Mapped[int | None] = mapped_column(
        Integer,
        default=50,
        comment="최대 사용자 수 제한"
    )
    max_storage: Mapped[int | None] = mapped_column(
        Integer,
        default=100,
        comment="최대 스토리지 용량 (GB)"
    )
    max_api_calls: Mapped[int | None] = mapped_column(
        Integer,
        default=10000,
        comment="월간 최대 API 호출 수"
    )

    # 기능 제한 정보
    features: Mapped[dict | None] = mapped_column(
        JSONB,
        default="{}",
        comment="포함된 기능 목록 (JSON 형태)"
    )

    # 유효 기간 관리
    start_time: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        comment="요금제 적용 시작일"
    )
    close_time: Mapped[date | None] = mapped_column(
        Date,
        comment="요금제 적용 종료일 (NULL: 무기한)"
    )

    # 상태 관리
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="ACTIVE",
        index=True,
        comment="요금제 상태 (ACTIVE/INACTIVE/ARCHIVED)"
    )
    deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        comment="논리적 삭제 플래그"
    )

    def __repr__(self) -> str:
        return f"<Plans(id={self.id}, code={self.code}, name={self.name}, type={self.type}, status={self.status})>"
