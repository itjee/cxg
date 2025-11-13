"""Schemas for Plans module."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class PlansBase(BaseModel):
    """기본 요금제 스키마."""

    code: str = Field(..., min_length=3, max_length=50, description="요금제 식별 코드 (예: PLAN_TRIAL, PLAN_STD)")
    name: str = Field(..., min_length=1, max_length=100, description="사용자에게 표시되는 요금제명")
    type: str = Field(
        default="STANDARD",
        pattern="^(TRIAL|STANDARD|PREMIUM|ENTERPRISE)$",
        description="요금제 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)"
    )
    description: str | None = Field(None, max_length=2000, description="요금제 상세 설명")
    base_price: float = Field(..., ge=0, description="기본 요금 (월/분기/년 단위)")
    user_price: float = Field(default=0, ge=0, description="사용자당 추가 요금")
    currency: str = Field(
        default="KRW",
        min_length=3,
        max_length=3,
        description="통화 단위 (ISO 4217 코드, 예: KRW, USD, EUR)"
    )
    billing_cycle: str = Field(
        default="MONTHLY",
        pattern="^(MONTHLY|QUARTERLY|YEARLY)$",
        description="청구 주기 (MONTHLY/QUARTERLY/YEARLY)"
    )
    max_users: int | None = Field(None, gt=0, description="최대 사용자 수 제한")
    max_storage: int | None = Field(None, gt=0, description="최대 스토리지 용량 (GB)")
    max_api_calls: int | None = Field(None, gt=0, description="월간 최대 API 호출 수")
    features: dict | None = Field(default=None, description="포함된 기능 목록 (JSON 형태)")
    start_time: date = Field(..., description="요금제 적용 시작일 (YYYY-MM-DD)")
    close_time: date | None = Field(None, description="요금제 적용 종료일 (NULL: 무기한)")
    status: str = Field(
        default="ACTIVE",
        pattern="^(ACTIVE|INACTIVE|ARCHIVED)$",
        description="요금제 상태 (ACTIVE/INACTIVE/ARCHIVED)"
    )

    @field_validator("close_time")
    @classmethod
    def validate_close_time(cls, v: date | None, info) -> date | None:
        """종료일이 시작일보다 늦은지 검증."""
        if v and "start_time" in info.data:
            start_time = info.data["start_time"]
            if v < start_time:
                raise ValueError("종료일은 시작일보다 늦어야 합니다")
        return v

    @field_validator("base_price", "user_price")
    @classmethod
    def validate_prices(cls, v: float) -> float:
        """가격이 최대 18자리 4소수 이내인지 검증."""
        if v > 999999999999999.9999:
            raise ValueError("가격은 최대 999,999,999,999,999.9999를 초과할 수 없습니다")
        return v


class PlansCreate(PlansBase):
    """요금제 생성 요청 스키마."""

    pass


class PlansUpdate(BaseModel):
    """요금제 수정 요청 스키마 (모든 필드 선택사항)."""

    code: str | None = Field(None, min_length=3, max_length=50, description="요금제 코드")
    name: str | None = Field(None, min_length=1, max_length=100, description="요금제 이름")
    type: str | None = Field(None, pattern="^(TRIAL|STANDARD|PREMIUM|ENTERPRISE)$", description="요금제 유형")
    description: str | None = Field(None, max_length=2000, description="요금제 설명")
    base_price: float | None = Field(None, ge=0, description="기본 요금")
    user_price: float | None = Field(None, ge=0, description="사용자당 추가 요금")
    currency: str | None = Field(None, min_length=3, max_length=3, description="통화")
    billing_cycle: str | None = Field(None, pattern="^(MONTHLY|QUARTERLY|YEARLY)$", description="청구 주기")
    max_users: int | None = Field(None, gt=0, description="최대 사용자 수")
    max_storage: int | None = Field(None, gt=0, description="최대 스토리지")
    max_api_calls: int | None = Field(None, gt=0, description="최대 API 호출 수")
    features: dict | None = Field(None, description="포함된 기능")
    start_time: date | None = Field(None, description="시작일")
    close_time: date | None = Field(None, description="종료일")
    status: str | None = Field(None, pattern="^(ACTIVE|INACTIVE|ARCHIVED)$", description="상태")

    @field_validator("close_time")
    @classmethod
    def validate_close_time(cls, v: date | None, info) -> date | None:
        """종료일 검증."""
        if v and "start_time" in info.data and info.data["start_time"]:
            if v < info.data["start_time"]:
                raise ValueError("종료일은 시작일보다 늦어야 합니다")
        return v


class PlansResponse(PlansBase):
    """요금제 응답 스키마."""

    id: UUID = Field(..., description="요금제 고유 식별자 (UUID)")
    deleted: bool = Field(default=False, description="논리적 삭제 플래그")
    created_at: datetime = Field(..., description="요금제 생성 일시")
    updated_at: datetime | None = Field(None, description="요금제 수정 일시")
    created_by: UUID | None = Field(None, description="요금제 생성자 UUID")
    updated_by: UUID | None = Field(None, description="요금제 수정자 UUID")

    class Config:
        """Pydantic config."""

        from_attributes = True


class PlansListResponse(BaseModel):
    """요금제 목록 응답 스키마."""

    items: list[PlansResponse] = Field(..., description="요금제 항목 목록")
    total: int = Field(..., ge=0, description="전체 항목 수")
    page: int = Field(..., ge=1, description="현재 페이지 번호 (1부터 시작)")
    page_size: int = Field(..., ge=1, le=100, description="페이지 크기")
    total_pages: int = Field(..., ge=0, description="전체 페이지 수")
