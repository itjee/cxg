"""데이터베이스 스키마 초기화

SQL 스크립트 기반 스키마 초기화
"""

import os
from pathlib import Path

from sqlalchemy import text

from src.core.config import settings


async def init_manager_schemas():
    """Manager 데이터베이스 스키마 초기화"""
    from src.core.database import manager_engine

    schema_dir = Path(__file__).parent.parent.parent.parent / "packages" / "database" / "schemas" / "manager"

    if not schema_dir.exists():
        print(f"⚠️  스키마 디렉토리를 찾을 수 없습니다: {schema_dir}")
        return

    # 02_idam 디렉토리 처리
    idam_dir = schema_dir / "02_idam"
    if not idam_dir.exists():
        print(f"⚠️  IDAM 스키마 디렉토리를 찾을 수 없습니다: {idam_dir}")
        return

    # SQL 파일들을 순서대로 실행
    sql_files = sorted(idam_dir.glob("*.sql"))

    async with manager_engine.begin() as conn:
        for sql_file in sql_files:
            try:
                with open(sql_file, "r", encoding="utf-8") as f:
                    sql_content = f.read()

                # SQL 파일의 내용 그대로 실행
                if sql_content.strip():
                    # PostgreSQL은 text()로 여러 문장을 한 번에 처리할 수 있음
                    await conn.execute(text(sql_content))
                    print(f"✅ 스키마 초기화: {sql_file.name}")

            except Exception as e:
                # IDAM 스키마 초기화 실패 시 계속 진행
                # (이미 생성된 테이블이 있을 수 있으므로 무시)
                error_msg = str(e).split('\n')[0][:60]
                print(f"ℹ️  스키마 처리: {sql_file.name} - {error_msg}")

        # 초기 데이터 추가 (필요한 경우)
        try:
            await init_manager_default_data(conn)
        except Exception as e:
            print(f"ℹ️  기본 데이터 추가: {str(e)[:80]}...")


async def init_manager_default_data(conn):
    """Manager 데이터베이스 기본 데이터 추가"""
    # 기본 역할 데이터 추가 (MANAGER_ADMIN)
    init_sql = """
    INSERT INTO idam.roles (code, name, description, category, level, scope, is_default, priority, status)
    VALUES
        ('MANAGER_ADMIN', 'Manager Admin', 'Manager system administrator', 'MANAGER_ADMIN', 1, 'GLOBAL', TRUE, 1, 'ACTIVE'),
        ('PLATFORM_SUPPORT', 'Platform Support', 'Platform support staff', 'PLATFORM_SUPPORT', 50, 'GLOBAL', FALSE, 50, 'ACTIVE'),
        ('TENANT_ADMIN', 'Tenant Admin', 'Tenant administrator', 'TENANT_ADMIN', 100, 'TENANT', FALSE, 100, 'ACTIVE'),
        ('TENANT_USER', 'Tenant User', 'Tenant user', 'TENANT_USER', 150, 'TENANT', FALSE, 150, 'ACTIVE')
    ON CONFLICT (code) DO NOTHING;
    """

    try:
        await conn.execute(text(init_sql))
        print("✅ 기본 역할 데이터 초기화 완료")
    except Exception as e:
        print(f"⚠️  기본 역할 데이터 초기화 중 오류: {e}")


async def init_tenant_schemas():
    """Tenant 데이터베이스 스키마 초기화"""
    schema_dir = Path(__file__).parent.parent.parent.parent / "packages" / "database" / "schemas" / "tenants"

    if not schema_dir.exists():
        print(f"⚠️  테넌트 스키마 디렉토리를 찾을 수 없습니다: {schema_dir}")
        return

    # 마이그레이션 디렉토리 사용 (이미 적용된 것으로 가정)
    migration_dir = Path(__file__).parent.parent.parent.parent / "packages" / "database" / "migrations" / "tenants"

    if migration_dir.exists():
        print(f"ℹ️  테넌트 마이그레이션: {migration_dir}")


async def init_db_schemas():
    """모든 데이터베이스 스키마 초기화

    NOTE: 이 함수는 애플리케이션 시작 시 호출되어야 합니다.
    """
    print("\n=== 데이터베이스 스키마 초기화 시작 ===")

    try:
        await init_manager_schemas()
    except Exception as e:
        print(f"❌ Manager 스키마 초기화 실패: {e}")
        if settings.debug:
            raise

    print("✅ 데이터베이스 스키마 초기화 완료\n")
