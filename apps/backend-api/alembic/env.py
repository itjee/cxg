"""Alembic 환경 설정"""

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Core 설정 import
import sys
from pathlib import Path

# src 디렉토리를 Python path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from core.config import settings
from core.database import Base

# 모든 모델 import (마이그레이션 감지를 위해)
from modules.manager.auth.model import User  # noqa: F401

# Alembic Config 객체
config = context.config

# Python logging 설정
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# MetaData 객체 (모든 테이블 정보 포함)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """오프라인 모드에서 마이그레이션 실행"""
    url = settings.mgmt_database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """실제 마이그레이션 실행"""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """비동기로 마이그레이션 실행"""
    # Alembic config에서 설정 가져오기
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = settings.manager_database_url.replace(
        "postgresql://", "postgresql+asyncpg://"
    )

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """온라인 모드에서 마이그레이션 실행"""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
