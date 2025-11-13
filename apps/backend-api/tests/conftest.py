"""테스트 설정 및 픽스처"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from src.main import app
from src.core.config import settings
from src.core.database import Base, get_manager_db


# 테스트 데이터베이스 URL
TEST_DATABASE_URL = settings.mgmt_database_url.replace(
    "mgmt_db", "test_mgmt_db"
).replace("postgresql://", "postgresql+asyncpg://")


# 테스트용 엔진
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)

TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """이벤트 루프 설정"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """테스트용 데이터베이스 세션"""
    # 테이블 생성
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 세션 제공
    async with TestSessionLocal() as session:
        yield session

    # 테이블 삭제
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """테스트용 HTTP 클라이언트"""

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_manager_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
