"""데이터베이스 설정"""

from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings


class Base(DeclarativeBase):
    """SQLAlchemy Base 클래스"""

    pass


# Engines
tenant_engine = create_async_engine(
    settings.tenants_database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10,
)

manager_engine = create_async_engine(
    settings.manager_database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10,
)

# Session Makers
TenantSessionLocal = async_sessionmaker(
    tenant_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

ManagerSessionLocal = async_sessionmaker(
    manager_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Dependencies
async def get_tenant_db() -> AsyncGenerator[AsyncSession, None]:
    """테넌트 DB 세션 가져오기"""
    async with TenantSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_manager_db() -> AsyncGenerator[AsyncSession, None]:
    """관리자 DB 세션 가져오기"""
    async with ManagerSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """데이터베이스 연결 확인"""
    # 디버그 모드에서만 연결 테스트 수행
    if settings.debug:
        try:
            # 테넌트 DB 연결 테스트
            async with tenant_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print("✅ 테넌트 데이터베이스 연결 성공")
        except Exception as e:
            print(f"⚠️ 테넌트 데이터베이스 연결 실패: {e}")
            print(f"⚠️ 연결 정보: {tenant_engine.url}")
            print("⚠️ 데이터베이스 서버가 실행 중인지, .env 파일의 연결 정보가 올바른지 확인하세요.")

        try:
            # 관리자 DB 연결 테스트
            async with manager_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print("✅ 관리자 데이터베이스 연결 성공")
        except Exception as e:
            print(f"⚠️ 관리자 데이터베이스 연결 실패: {e}")
            print(f"⚠️ 연결 정보: {manager_engine.url}")
            print("⚠️ 데이터베이스 서버가 실행 중인지, .env 파일의 연결 정보가 올바른지 확인하세요.")


async def close_db():
    """데이터베이스 연결 종료"""
    try:
        await tenant_engine.dispose()
        await manager_engine.dispose()
    except Exception:
        pass


# GraphQL용 세션 함수
async def get_manager_db_session() -> AsyncSession:
    """Manager DB 세션 생성 (GraphQL용)"""
    return ManagerSessionLocal()


async def get_tenant_db_session(tenant_key: str) -> AsyncSession:
    """
    Tenant DB 세션 생성 (GraphQL용)

    TODO: tenant_key로 tenant별 DB 연결 정보 조회 및 세션 생성
    현재는 단일 tenant DB를 사용
    """
    return TenantSessionLocal()
