from uuid import UUID as PyUUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Date, Time, JSON, Numeric, ForeignKey, func

from ..base import TenantBaseModel

__all__ = ["Faqs"]


class Faqs(TenantBaseModel):
    """자주 묻는 질문(FAQ) 관리 테이블"""
    __tablename__ = "faqs"
    __table_args__ = {"schema": "asm"}

    category: Mapped[str | None] = mapped_column(String(50))  # 카테고리 (제품/기술지원/정책/기타)
    sub_category: Mapped[str | None] = mapped_column(String(50))  # 하위 카테고리
    tags: Mapped[str | None] = mapped_column(String(200))  # 태그 (쉼표로 구분)
    question: Mapped[str] = mapped_column(Text, nullable=False)  # 질문
    question_en: Mapped[str | None] = mapped_column(Text)  # 질문 (영문)
    answer: Mapped[str] = mapped_column(Text, nullable=False)  # 답변
    answer_en: Mapped[str | None] = mapped_column(Text)  # 답변 (영문)
    answer_summary: Mapped[str | None] = mapped_column(String(500))  # 답변 요약
    related_articles: Mapped[dict | None] = mapped_column(JSON)  # 관련 문서 (JSON 배열: [{"title": "...", "url": "..."}])
    video_url: Mapped[str | None] = mapped_column(String(500))  # 설명 동영상 URL
    display_order: Mapped[int | None] = mapped_column(Integer, default=0)  # 정렬 순서
    view_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 조회수
    helpful_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 도움됨 카운트
    not_helpful_count: Mapped[int | None] = mapped_column(Integer, default=0)  # 도움안됨 카운트
    is_published: Mapped[bool | None] = mapped_column(Boolean, default=True)  # 공개 여부
    is_featured: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 추천 FAQ 여부
    is_deleted: Mapped[bool | None] = mapped_column(Boolean, default=False)  # 논리 삭제 플래그