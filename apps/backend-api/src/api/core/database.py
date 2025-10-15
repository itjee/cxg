from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from api.core.config import settings


class Base(DeclarativeBase):
    pass


# Engines
tenant_engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
)

manager_engine = create_async_engine(
    settings.mgmt_database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
)

# Session Makers
TenantSessionLocal = async_sessionmaker(tenant_engine, class_=AsyncSession, expire_on_commit=False)
ManagerSessionLocal = async_sessionmaker(manager_engine, class_=AsyncSession, expire_on_commit=False)


# Dependencies
async def get_tenant_db() -> AsyncGenerator[AsyncSession, None]:
    async with TenantSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def get_manager_db() -> AsyncGenerator[AsyncSession, None]:
    async with ManagerSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    async with tenant_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with manager_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    await tenant_engine.dispose()
    await manager_engine.dispose()