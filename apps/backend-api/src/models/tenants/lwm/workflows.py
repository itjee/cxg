from uuid import UUID as PyUUID
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Workflows"]


class Workflows(TenantBaseModel):
    """전자결재 워크플로우 정의 관리 테이블"""
    __tablename__ = "workflows"
    __table_args__ = {"schema": "com"}

    workflow_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 워크플로우 코드
    workflow_name: Mapped[str] = mapped_column(String(100), nullable=False)  # 워크플로우명
    workflow_name_en: Mapped[str | None] = mapped_column(String(100))  # 워크플로우 영문명
    description: Mapped[str | None] = mapped_column(Text)  # 워크플로우 설명
    module_code: Mapped[str] = mapped_column(String(50), nullable=False)  # 모듈 코드 (PSM: 구매, SRM: 판매, FIM: 재무 등)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 문서 유형 (PURCHASE_ORDER: 구매주문, SALES_ORDER: 판매주문, EXPENSE_REPORT: 경비보고 등)
    version: Mapped[int | None] = mapped_column(Integer, default=1)  # 버전
    is_default: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 기본 워크플로우 여부
    priority: Mapped[int | None] = mapped_column(Integer, default=0)  # 우선순위 (낮은 값이 높은 우선순위)
    condition_rule: Mapped[dict | None] = mapped_column(JSON)  # 조건 규칙 (JSON 형식)
    min_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 최소 금액 (조건)
    max_amount: Mapped[Decimal | None] = mapped_column(Numeric(precision=18, scale=4))  # 최대 금액 (조건)
    is_notification_enabled: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 알림 활성화 여부
    escalation_enabled: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 에스컬레이션 활성화 여부
    escalation_hours: Mapped[int | None] = mapped_column(Integer)  # 에스컬레이션 시간 (시간)
    notes: Mapped[str | None] = mapped_column(Text)  # 비고
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 활성 상태
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그