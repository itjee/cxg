from uuid import UUID as PyUUID
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["CustomerSegments"]


class CustomerSegments(TenantBaseModel):
    """고객 세그먼트 관리 테이블"""
    __tablename__ = "customer_segments"
    __table_args__ = {"schema": "crm"}

    segment_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 세그먼트 코드 (고유번호)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # 세그먼트명
    description: Mapped[str | None] = mapped_column(Text)  # 설명
    segment_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 세그먼트 유형 (STATIC/DYNAMIC/BEHAVIORAL/DEMOGRAPHIC/GEOGRAPHIC/VALUE_BASED/CUSTOM)
    criteria: Mapped[dict | None] = mapped_column(JSON)  # 세그먼트 조건 (JSON 형식, 예: {"industry": "IT", "revenue": ">1000000"})
    member_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 회원 수 (캐시)
    last_calculated_at: Mapped[datetime | None] = mapped_column(DateTime)  # 마지막 계산 일시
    is_dynamic: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 동적 세그먼트 여부 (조건에 따라 자동 추가/제거)
    is_auto_update: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 자동 업데이트 여부
    update_frequency: Mapped[str | None] = mapped_column(String(20))  # 업데이트 주기 (HOURLY/DAILY/WEEKLY/MONTHLY)
    owner_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 담당자 UUID
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='ACTIVE')  # 세그먼트 상태 (ACTIVE: 활성, INACTIVE: 비활성, ARCHIVED: 보관)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그
    notes: Mapped[str | None] = mapped_column(Text)  # 비고