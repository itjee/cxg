"""테넌트 모델"""

from datetime import date

from sqlalchemy import CHAR, Boolean, CheckConstraint, Date, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import BaseModel


class Tenant(BaseModel):
    """테넌트 마스터 정보"""

    __tablename__ = "tenants"
    __table_args__ = (
        CheckConstraint(
            "status IN ('TRIAL', 'ACTIVE', 'SUSPENDED', 'TERMINATED')", name="ck_tenants__status"
        ),
        CheckConstraint(
            "type IN ('TRIAL', 'STANDARD', 'PREMIUM', 'ENTERPRISE')",
            name="ck_tenants__type",
        ),
        CheckConstraint("biz_type IN ('C', 'S')", name="ck_tenants__biz_type"),
        CheckConstraint("employee_count >= 0", name="ck_tenants__employee_count"),
        CheckConstraint("start_date <= CURRENT_DATE", name="ck_tenants__start_date_valid"),
        CheckConstraint(
            "close_date IS NULL OR close_date >= start_date", name="ck_tenants__close_date_valid"
        ),
        CheckConstraint("code ~ '^[a-zA-Z0-9_-]{3,20}$'", name="ck_tenants__code_format"),
        {"schema": "tnnt"},
    )

    # 테넌트 기본 정보
    code: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="STANDARD", index=True)

    # 사업자 등록 정보
    biz_no: Mapped[str | None] = mapped_column(String(20), unique=True)
    biz_name: Mapped[str | None] = mapped_column(String(200), index=True)
    biz_type: Mapped[str] = mapped_column(CHAR(1), default="C")
    ceo_name: Mapped[str | None] = mapped_column(String(50))
    biz_kind: Mapped[str | None] = mapped_column(String(100))
    biz_item: Mapped[str | None] = mapped_column(String(100))

    # 주소 정보
    postcode: Mapped[str | None] = mapped_column(String(10))
    address1: Mapped[str | None] = mapped_column(String(100))
    address2: Mapped[str | None] = mapped_column(String(100))
    phone_no: Mapped[str | None] = mapped_column(String(20))
    employee_count: Mapped[int] = mapped_column(Integer, default=0, index=True)

    # 계약 정보
    start_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    close_date: Mapped[date | None] = mapped_column(Date, index=True)

    # 지역화 설정
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Seoul")
    locale: Mapped[str] = mapped_column(String(10), default="ko-KR")
    currency: Mapped[str] = mapped_column(CHAR(3), default="KRW")

    # 확장 가능한 메타데이터
    extra_data: Mapped[dict] = mapped_column(JSONB, default=dict)

    # 상태 관리
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVE", index=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<Tenant(id={self.id}, code={self.code}, name={self.name})>"
