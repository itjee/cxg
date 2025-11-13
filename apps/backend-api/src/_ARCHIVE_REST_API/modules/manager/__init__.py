"""관리자 시스템 비즈니스 모듈"""

from fastapi import APIRouter

from .auth import router as auth_router


# 관리자 시스템 메인 라우터
router = APIRouter()

# 하위 라우터 등록
router.include_router(auth_router)

__all__ = ["router"]
