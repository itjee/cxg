"""커스텀 예외 클래스"""

from typing import Any


class CXGError(Exception):
    """기본 예외 클래스"""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        detail: dict[str, Any] | None = None,
    ):
        self.message = message
        self.code = code
        self.detail = detail or {}
        super().__init__(self.message)


class ValidationError(CXGError):
    """검증 예외"""

    def __init__(self, message: str, detail: dict[str, Any] | None = None):
        super().__init__(message=message, code="VALIDATION_ERROR", detail=detail)


class NotFoundError(CXGError):
    """리소스를 찾을 수 없음"""

    def __init__(
        self, message: str = "리소스를 찾을 수 없습니다", detail: dict[str, Any] | None = None
    ):
        super().__init__(message=message, code="RESOURCE_NOT_FOUND", detail=detail)


class AlreadyExistsError(CXGError):
    """리소스가 이미 존재함"""

    def __init__(
        self, message: str = "리소스가 이미 존재합니다", detail: dict[str, Any] | None = None
    ):
        super().__init__(message=message, code="RESOURCE_ALREADY_EXISTS", detail=detail)


class UnauthorizedError(CXGError):
    """인증 실패"""

    def __init__(self, message: str = "인증이 필요합니다", detail: dict[str, Any] | None = None):
        super().__init__(message=message, code="AUTHENTICATION_REQUIRED", detail=detail)


class ForbiddenError(CXGError):
    """권한 없음"""

    def __init__(self, message: str = "권한이 없습니다", detail: dict[str, Any] | None = None):
        super().__init__(message=message, code="PERMISSION_DENIED", detail=detail)


class DatabaseError(CXGError):
    """데이터베이스 예외"""

    def __init__(
        self,
        message: str = "데이터베이스 오류가 발생했습니다",
        detail: dict[str, Any] | None = None,
    ):
        super().__init__(message=message, code="DATABASE_ERROR", detail=detail)
