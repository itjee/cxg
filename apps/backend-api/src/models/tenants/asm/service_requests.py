from uuid import UUID as PyUUID
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["ServiceRequests"]


class ServiceRequests(TenantBaseModel):
    """A/S 요청 및 처리 정보 관리 테이블"""
    __tablename__ = "service_requests"
    __table_args__ = {"schema": "asm"}

    sr_code: Mapped[str] = mapped_column(String(50), nullable=False)  # A/S 요청 코드
    customer_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 고객 식별자
    product_id: Mapped[PyUUID | None] = mapped_column(UUID, ForeignKey("pim.products.id"))  # 제품 식별자
    serial_number: Mapped[str | None] = mapped_column(String(100))  # 제품 시리얼 번호
    purchase_date: Mapped[date | None] = mapped_column(Date)  # 제품 구매 일자
    warranty_end_date: Mapped[date | None] = mapped_column(Date)  # 보증 종료일
    is_warranty: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 보증기간 내 A/S 여부
    issue_description: Mapped[str] = mapped_column(Text, nullable=False)  # 문제 및 고장 내용 설명
    issue_category: Mapped[str | None] = mapped_column(String(50))  # 문제 카테고리 (하드웨어/소프트웨어/외관/기타)
    service_type: Mapped[str | None] = mapped_column(String(20), default='REPAIR')  # A/S 유형 (REPAIR: 수리/REPLACE: 교체/MAINTENANCE: 유지보수/INSPECTION: 점검)
    priority: Mapped[str | None] = mapped_column(String(20), default='MEDIUM')  # 우선순위 (LOW: 낮음/MEDIUM: 보통/HIGH: 높음/URGENT: 긴급)
    status: Mapped[str | None] = mapped_column(String(20), ForeignKey("adm.employees.id"), default='RECEIVED')  # 상태 (RECEIVED: 접수/DIAGNOSED: 진단완료/IN_PROGRESS: 진행중/COMPLETED: 완료/CLOSED: 종료/CANCELLED: 취소)
    assigned_technician_id: Mapped[PyUUID | None] = mapped_column(UUID)  # 배정된 기술자 식별자
    scheduled_date: Mapped[date | None] = mapped_column(Date)  # 예약 작업일
    expected_completion_date: Mapped[date | None] = mapped_column(Date)  # 예상 완료일
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)  # 실제 완료 일시
    estimated_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 예상 비용
    actual_cost: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4), default=0)  # 실제 비용
    currency: Mapped[str | None] = mapped_column(String(3), ForeignKey("adm.currencies.id"), default='KRW')  # 통화 코드 (ISO 4217)
    customer_notes: Mapped[str | None] = mapped_column(Text)  # 고객 요청사항
    technician_notes: Mapped[str | None] = mapped_column(Text)  # 기술자 메모
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그