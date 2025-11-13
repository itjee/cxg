from uuid import UUID as PyUUID
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID

from ..base import TenantBaseModel

__all__ = ["NpsSurveys"]


class NpsSurveys(TenantBaseModel):
    """NPS(Net Promoter Score) 설문 관리 테이블 - 고객 추천도 조사"""
    __tablename__ = "nps_surveys"
    __table_args__ = {"schema": "asm"}

    partner_id: Mapped[PyUUID] = mapped_column(UUID, ForeignKey("crm.partners.id"), nullable=False)  # 거래처 식별자
    nps_score: Mapped[int] = mapped_column(Integer, nullable=False)  # NPS 점수 (0-10, 0-6: Detractor, 7-8: Passive, 9-10: Promoter)
    recommendation_reason: Mapped[str | None] = mapped_column(String(20))  # 추천 의향 분류 (PROMOTER: 추천함, PASSIVE: 중립, DETRACTOR: 비추천)
    recommendation_text: Mapped[str | None] = mapped_column(Text)  # 추천 사유 또는 개선점
    sent_date: Mapped[date | None] = mapped_column(Date)  # 설문 발송일
    response_date: Mapped[date | None] = mapped_column(Date)  # 응답일
    response_time_days: Mapped[int | None] = mapped_column(Integer)  # 응답까지 소요 일수
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='PENDING')  # 상태 (PENDING: 대기, SENT: 발송, RESPONDED: 응답, CLOSED: 완료)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)  # 논리 삭제 플래그