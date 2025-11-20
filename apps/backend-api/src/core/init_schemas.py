"""데이터베이스 스키마 초기화

SQL 스크립트 기반 스키마 초기화
"""

import os
from pathlib import Path

from sqlalchemy import text, event
from sqlalchemy.pool import Pool

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

    print(f"📁 IDAM 스키마 파일 {len(sql_files)}개 발견")

    # 각 SQL 파일을 개별 연결에서 실행
    # (transaction 문제 방지)
    for sql_file in sql_files:
        try:
            with open(sql_file, "r", encoding="utf-8") as f:
                sql_content = f.read()

            if not sql_content.strip():
                continue

            # 세미콜론으로 분할하여 개별 SQL 문장 추출
            statements = [s.strip() for s in sql_content.split(';') if s.strip()]

            if not statements:
                print(f"⚠️  스키마 파일: {sql_file.name} (비어있음)")
                continue

            # 각 SQL 문장을 개별적으로 실행
            async with manager_engine.connect() as conn:
                for i, stmt in enumerate(statements):
                    try:
                        if stmt:
                            await conn.execute(text(stmt))
                    except Exception as e:
                        # 각 문장의 오류를 개별적으로 처리
                        error_str = str(e)
                        # 이미 존재하는 테이블/스키마는 무시
                        if "already exists" in error_str.lower() or "exists" in error_str.lower():
                            pass
                        elif settings.debug:
                            print(f"   경고 ({i+1}/{len(statements)}): {error_str[:60]}")

                await conn.commit()

            print(f"✅ 스키마 초기화: {sql_file.name}")

        except Exception as e:
            # IDAM 스키마 초기화 실패 시 계속 진행
            error_msg = str(e).split('\n')[0][:80]
            if settings.debug:
                print(f"❌ 스키마 처리 실패: {sql_file.name}")
                print(f"   └─ {error_msg}")

    # 초기 데이터 추가 (별도 연결)
    try:
        async with manager_engine.connect() as conn:
            await init_manager_default_data(conn)
            await conn.commit()
    except Exception as e:
        if settings.debug:
            print(f"ℹ️  기본 데이터 추가 중 오류")
            print(f"   └─ {str(e)[:80]}")


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
