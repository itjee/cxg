"""응답 스키마"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel


T = TypeVar("T")


class EnvelopeResponse(BaseModel, Generic[T]):
    """표준 Envelope 응답 구조"""

    success: bool
    data: T | None = None
    error: dict[str, Any] | None = None

    @classmethod
    def success_response(cls, data: T) -> "EnvelopeResponse[T]":
        """성공 응답 생성"""
        return cls(success=True, data=data, error=None)

    @classmethod
    def error_response(
        cls, code: str, message: str, detail: dict[str, Any] | None = None
    ) -> "EnvelopeResponse":
        """에러 응답 생성"""
        return cls(
            success=False,
            data=None,
            error={"code": code, "message": message, "detail": detail or {}},
        )


class PaginationParams(BaseModel):
    """페이징 파라미터"""

    page: int = 1
    size: int = 20

    @property
    def skip(self) -> int:
        """스킵할 개수"""
        return (self.page - 1) * self.size

    @property
    def limit(self) -> int:
        """제한 개수"""
        return self.size


class PaginatedResponse(BaseModel, Generic[T]):
    """페이징 응답"""

    items: list[T]
    total: int
    page: int
    size: int
    pages: int
