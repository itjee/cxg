"""ConexGrow API Main Application"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# GraphQL
from strawberry.fastapi import GraphQLRouter

from src.core.config import settings
from src.core.database import close_db, init_db
from src.core.exceptions import CXGError
from src.core.middleware import RequestIDMiddleware, TimingMiddleware
from src.graphql.context import get_context
from src.graphql.schema import schema as graphql_schema
from src.schemas import EnvelopeResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # 시작 시
    await init_db()
    yield
    # 종료 시
    await close_db()


# FastAPI 앱 생성 - GraphQL API
app = FastAPI(
    title="ConexGrow GraphQL API",
    description="AI 기반 중소기업 업무지원 플랫폼 - GraphQL API",
    version="1.0.0",
    lifespan=lifespan,
    contact={
        "name": "ConexGrow Support",
        "email": "support@cxg.com",
    },
    license_info={
        "name": "Proprietary",
    },
    docs_url="/docs",
    redoc_url="/redoc",
)


# CORS 미들웨어
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 커스텀 미들웨어
app.add_middleware(RequestIDMiddleware)
app.add_middleware(TimingMiddleware)


# 예외 핸들러
@app.exception_handler(CXGError)
async def cxg_exception_handler(request: Request, exc: CXGError):
    """CXG 예외 핸들러"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=EnvelopeResponse.error_response(
            code=exc.code,
            message=exc.message,
            detail=exc.detail,
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """검증 예외 핸들러"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=EnvelopeResponse.error_response(
            code="VALIDATION_ERROR",
            message="입력 데이터 검증 실패",
            detail={"errors": exc.errors()},
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """일반 예외 핸들러"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=EnvelopeResponse.error_response(
            code="INTERNAL_ERROR",
            message="서버 내부 오류가 발생했습니다",
            detail={"error": str(exc)} if settings.debug else {},
        ).model_dump(),
    )


# GraphQL 라우터 등록
graphql_app = GraphQLRouter(
    graphql_schema,
    context_getter=get_context,
)
app.include_router(graphql_app, prefix="/graphql", tags=["GraphQL"])


# RESTful API 라우터 (레거시 - 제거 예정)
# app.include_router(manager_v1_router, prefix="/api/v1/manager")
# app.include_router(tenants_v1_router, prefix="/api/v1/tenants")


# 루트 엔드포인트
@app.get("/", tags=["기본"])
async def root():
    """루트 엔드포인트"""
    return EnvelopeResponse.success_response(
        {
            "message": "ConexGrow API",
            "version": settings.api_version,
            "status": "running",
        }
    )


@app.get("/health", tags=["기본"])
async def health():
    """헬스 체크"""
    return EnvelopeResponse.success_response({"status": "healthy"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
