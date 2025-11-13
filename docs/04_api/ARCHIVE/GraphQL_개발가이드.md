# CXG 플랫폼 - GraphQL 개발 가이드

> **Python + FastAPI + Strawberry(GraphQL) 기반 멀티테넌트 플랫폼 개발 가이드**
> - **대상 독자**: 백엔드 개발자, API 아키텍트
> - **기술 스택**: Python 3.11+, FastAPI, Strawberry GraphQL, SQLAlchemy 2.0+, PostgreSQL
> - **아키텍처**: Database-per-Tenant (테넌트별 독립 DB)
> - **대상 규모**: 50인 미만 사업자용 플랫폼
> - **최종 업데이트**: 2024년 11월

---

## 목차

1. [개요](#1-개요)
2. [아키텍처 설계](#2-아키텍처-설계)
3. [디렉토리 구조](#3-디렉토리-구조)
4. [핵심 구성요소](#4-핵심-구성요소)
5. [인증 및 테넌트 라우팅](#5-인증-및-테넌트-라우팅)
6. [GraphQL 스키마 설계](#6-graphql-스키마-설계)
7. [실무 구현 가이드](#7-실무-구현-가이드)
8. [데이터로더와 성능 최적화](#8-데이터로더와-성능-최적화)
9. [마이그레이션 및 프로비저닝](#9-마이그레이션-및-프로비저닝)
10. [보안 및 권한 관리](#10-보안-및-권한-관리)
11. [모니터링 및 운영](#11-모니터링-및-운영)
12. [테스트 전략](#12-테스트-전략)
13. [배포 가이드](#13-배포-가이드)

---

## 1. 개요

### 1.1 전환 목표

기존 RESTful API 구조를 GraphQL로 전환하여 다음 목표를 달성합니다:

- **단일 엔드포인트**: `/graphql` 하나로 모든 API 처리
- **유연한 데이터 조회**: 클라이언트가 필요한 필드만 선택적으로 요청
- **타입 안정성**: 자동 타입 검증 및 문서화
- **N+1 문제 해결**: DataLoader를 통한 효율적인 데이터 로딩
- **강력한 권한 제어**: 필드/타입 레벨 권한 관리

### 1.2 현재 구조 분석

**현재 RESTful 구조** (`apps/backend-api/src/`):
```
src/
├── core/                    # 프레임워크 설정
│   ├── config.py           # 환경 설정
│   ├── database.py         # DB 연결 (tenant/manager)
│   ├── security.py         # JWT 인증
│   └── middleware.py       # 미들웨어
├── models/                  # SQLAlchemy ORM
│   ├── manager/            # 매니저 DB 모델
│   └── tenants/            # 테넌트 DB 모델
│       ├── sys/            # 시스템 (users, roles, branches...)
│       ├── crm/            # 고객관리
│       ├── hrm/            # 인사관리
│       └── ...             # 기타 모듈
├── modules/                 # 비즈니스 로직
│   ├── manager/
│   └── tenants/
│       └── sys/
│           ├── users/
│           │   ├── router.py
│           │   ├── service.py
│           │   └── schemas.py
│           └── ...
└── routers/                 # API 라우터
    ├── manager/v1.py
    └── tenants/v1.py
```

### 1.3 GraphQL 전환 후 구조

```
src/
├── core/                    # [유지] 프레임워크 설정
│   ├── config.py           
│   ├── database.py         
│   ├── security.py         
│   └── tenant_router.py    # [신규] 테넌트 DB 라우팅
├── models/                  # [유지] ORM 모델
├── graphql/                 # [신규] GraphQL 레이어
│   ├── schema.py           # 메인 스키마
│   ├── context.py          # Context 팩토리
│   ├── loaders.py          # DataLoader 구현
│   ├── types/              # GraphQL 타입 정의
│   │   ├── __init__.py
│   │   ├── base.py         # 공통 타입
│   │   ├── user.py         # User 타입
│   │   ├── branch.py       # Branch 타입
│   │   └── ...
│   ├── queries/            # Query 리졸버
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   ├── mutations/          # Mutation 리졸버
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── ...
│   └── permissions.py      # 권한 체크 로직
├── services/                # [유지/개선] 비즈니스 로직
│   └── tenants/
│       └── users.py        # service.py에서 이동
└── utils/
    ├── migrations.py       # 마이그레이션 헬퍼
    └── tenant_provisioning.py
```

---

## 2. 아키텍처 설계

### 2.1 멀티테넌시 모델

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                   │
│                   (Single Instance)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          │ /graphql
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Strawberry GraphQL Router                   │
│  - JWT 검증                                              │
│  - tenant_key 추출                                       │
│  - Context 생성                                          │
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Central Admin DB   │    │  Tenant Router       │
│   (central_admin)    │    │  (Connection Cache)  │
│                      │    │                      │
│  - tenants           │    │  tenant_key →        │
│  - tenant_configs    │    │  AsyncEngine Cache   │
└──────────────────────┘    └──────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  Tenant DB   │  │  Tenant DB   │  │  Tenant DB   │
            │  (acme01)    │  │  (beta02)    │  │  (corp03)    │
            │              │  │              │  │              │
            │  - sys       │  │  - sys       │  │  - sys       │
            │  - crm       │  │  - crm       │  │  - crm       │
            │  - hrm       │  │  - hrm       │  │  - hrm       │
            │  - ...       │  │  - ...       │  │  - ...       │
            └──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 요청 흐름

```
1. 클라이언트 요청
   POST /graphql
   Headers: Authorization: Bearer <JWT_TOKEN>
   Body: { query: "...", variables: {...} }
   
2. FastAPI 미들웨어
   - RequestID 생성
   - CORS 검증
   - Timing 측정
   
3. Strawberry Context 생성
   - JWT 토큰 파싱 → tenant_key, user_id, role 추출
   - Tenant DB 세션 생성 (캐시된 엔진 사용)
   - DataLoader 인스턴스 생성
   
4. GraphQL 실행
   - Query/Mutation 리졸버 실행
   - 권한 체크 (@permission 데코레이터)
   - 서비스 레이어 호출
   
5. 응답
   - JSON 직렬화
   - DB 세션 정리
   - 응답 반환
```

### 2.3 데이터베이스 전략

#### Central Admin DB (central_admin)
```sql
-- 테넌트 메타데이터
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    tenant_key VARCHAR(64) UNIQUE NOT NULL,      -- 예: acme01, beta02
    company_name VARCHAR(255) NOT NULL,
    db_host VARCHAR(255) NOT NULL,
    db_port INTEGER DEFAULT 5432,
    db_name VARCHAR(128) NOT NULL,
    db_user VARCHAR(128) NOT NULL,
    db_password_encrypted TEXT NOT NULL,         -- Vault 참조 또는 암호화
    is_active BOOLEAN DEFAULT TRUE,
    plan VARCHAR(50) DEFAULT 'starter',          -- starter, pro, enterprise
    max_users INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 테넌트 설정
CREATE TABLE tenant_configs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    config_key VARCHAR(128) NOT NULL,
    config_value JSONB,
    UNIQUE(tenant_id, config_key)
);
```

#### Tenant DB (각 테넌트별)
- 현재 `models/tenants/` 구조 그대로 사용
- 모든 테넌트가 동일한 스키마 구조
- Alembic 마이그레이션으로 일관성 유지

---

## 3. 디렉토리 구조

### 3.1 전체 구조

```
apps/backend-api/
├── alembic/
│   ├── versions/           # 마이그레이션 파일
│   ├── env.py             # Alembic 설정
│   └── central_admin/     # Central Admin DB 마이그레이션
├── src/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   ├── tenant_router.py        # [신규]
│   │   ├── exceptions.py
│   │   ├── middleware.py
│   │   └── logging.py
│   │
│   ├── models/                      # [유지] ORM 모델
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── central/                # [신규] Central Admin 모델
│   │   │   ├── __init__.py
│   │   │   └── tenant.py
│   │   ├── manager/
│   │   └── tenants/
│   │       ├── sys/
│   │       ├── crm/
│   │       └── ...
│   │
│   ├── graphql/                     # [신규] GraphQL 레이어
│   │   ├── __init__.py
│   │   ├── schema.py               # 메인 스키마
│   │   ├── context.py              # Context 팩토리
│   │   ├── loaders.py              # DataLoader
│   │   ├── permissions.py          # 권한 체커
│   │   │
│   │   ├── types/                  # GraphQL 타입
│   │   │   ├── __init__.py
│   │   │   ├── base.py            # 공통 타입 (PageInfo, Connection 등)
│   │   │   ├── scalars.py         # 커스텀 스칼라 (DateTime, UUID 등)
│   │   │   ├── enums.py           # Enum 타입
│   │   │   │
│   │   │   └── tenants/           # 테넌트 타입
│   │   │       ├── __init__.py
│   │   │       ├── user.py
│   │   │       ├── branch.py
│   │   │       ├── role.py
│   │   │       ├── department.py
│   │   │       └── ...
│   │   │
│   │   ├── queries/                # Query 리졸버
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   └── tenants/
│   │   │       ├── __init__.py
│   │   │       ├── user.py
│   │   │       ├── branch.py
│   │   │       └── ...
│   │   │
│   │   ├── mutations/              # Mutation 리졸버
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   └── tenants/
│   │   │       ├── __init__.py
│   │   │       ├── user.py
│   │   │       ├── branch.py
│   │   │       └── ...
│   │   │
│   │   └── subscriptions/          # [선택] 실시간 구독
│   │       └── __init__.py
│   │
│   ├── services/                    # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── central/                # Central Admin 서비스
│   │   │   └── tenant_service.py
│   │   └── tenants/
│   │       ├── __init__.py
│   │       ├── user_service.py
│   │       ├── branch_service.py
│   │       └── ...
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── migrations.py           # 마이그레이션 헬퍼
│   │   ├── tenant_provisioning.py  # 테넌트 프로비저닝
│   │   └── cache.py                # 캐싱 유틸
│   │
│   └── main.py                      # FastAPI 앱
│
├── tests/
│   ├── graphql/
│   │   ├── test_queries.py
│   │   └── test_mutations.py
│   └── services/
│
├── scripts/
│   ├── provision_tenant.py         # 테넌트 생성 스크립트
│   ├── migrate_all_tenants.py      # 전체 테넌트 마이그레이션
│   └── seed_data.py
│
├── pyproject.toml
├── requirements.txt
└── README.md
```

### 3.2 파일별 역할

| 파일 | 역할 | 비고 |
|------|------|------|
| `core/tenant_router.py` | 테넌트별 DB 연결 캐싱 및 라우팅 | 핵심 컴포넌트 |
| `graphql/schema.py` | Strawberry 스키마 정의 | Query, Mutation 통합 |
| `graphql/context.py` | 요청별 컨텍스트 생성 | DB 세션, 사용자 정보, 로더 |
| `graphql/loaders.py` | DataLoader 구현 | N+1 문제 해결 |
| `graphql/types/` | GraphQL 타입 정의 | ORM → GraphQL 타입 변환 |
| `graphql/queries/` | Query 리졸버 | 조회 로직 |
| `graphql/mutations/` | Mutation 리졸버 | 생성/수정/삭제 로직 |
| `services/` | 비즈니스 로직 | DB 독립적인 로직 |

---

## 4. 핵심 구성요소

### 4.1 의존성 관리 (pyproject.toml)

```toml
[project]
name = "cxg-backend-api"
version = "2.0.0"
description = "CXG Platform GraphQL API"
requires-python = ">=3.11"

dependencies = [
    # FastAPI & ASGI
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
    
    # GraphQL
    "strawberry-graphql[fastapi]>=0.220.0",
    
    # Database
    "sqlalchemy[asyncio]>=2.0.25",
    "asyncpg>=0.29.0",
    "psycopg2-binary>=2.9.9",
    "greenlet>=3.0.0",
    "alembic>=1.13.0",
    
    # Pydantic
    "pydantic>=2.5.0",
    "pydantic-settings>=2.1.0",
    
    # Authentication & Security
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "bcrypt>=4.0.0,<5.0.0",
    "python-multipart>=0.0.6",
    
    # DataLoader (N+1 방지)
    "aiodataloader>=0.4.0",
    
    # Redis (캐싱)
    "redis>=5.0.0",
    "aioredis>=2.0.0",
    
    # Utilities
    "python-dotenv>=1.0.0",
    "orjson>=3.9.0",  # 빠른 JSON 직렬화
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.23.0",
    "pytest-cov>=4.1.0",
    "httpx>=0.26.0",
    "faker>=22.0.0",
    "ruff>=0.3.0",
    "mypy>=1.8.0",
]
```

### 4.2 환경 설정 (core/config.py)

```python
"""환경 설정 관리"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 설정"""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )

    # 환경
    environment: str = "development"
    debug: bool = True

    # API
    api_title: str = "ConexGrow GraphQL API"
    api_version: str = "2.0.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8100

    # Central Admin Database
    central_admin_database_url: str = "postgresql://admin:password@localhost:5432/central_admin"

    # 기본 Manager Database (하위 호환)
    manager_database_url: str = "postgresql://admin:password@localhost:5432/mgmt"

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_cache_ttl: int = 300  # 5분

    # 보안
    secret_key: str = "your-secret-key-change-in-production-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:8200",  # Manager UI
        "http://localhost:8300",  # Tenant UI
    ]

    # GraphQL
    graphql_depth_limit: int = 10  # 쿼리 깊이 제한
    graphql_complexity_limit: int = 1000  # 복잡도 제한
    
    # Tenant Router
    tenant_connection_pool_size: int = 5
    tenant_connection_max_overflow: int = 10
    tenant_connection_cache_ttl: int = 3600  # 1시간

    # Vault/KMS (프로덕션)
    vault_url: str = ""
    vault_token: str = ""
    
    # 로깅
    log_level: str = "INFO"
    log_format: str = "json"  # json or text


settings = Settings()
```

### 4.3 Central Admin 모델 (models/central/tenant.py)

```python
"""Central Admin DB - Tenant 모델"""

from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from src.core.database import CentralAdminBase


class Tenant(CentralAdminBase):
    """테넌트 메타데이터 모델"""

    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tenant_key = Column(String(64), unique=True, nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    
    # DB 연결 정보
    db_host = Column(String(255), nullable=False)
    db_port = Column(Integer, default=5432)
    db_name = Column(String(128), nullable=False)
    db_user = Column(String(128), nullable=False)
    db_password_encrypted = Column(Text, nullable=False)  # Vault 참조 또는 암호화
    
    # 상태 및 플랜
    is_active = Column(Boolean, default=True)
    plan = Column(String(50), default="starter")  # starter, pro, enterprise
    max_users = Column(Integer, default=50)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Tenant {self.tenant_key}: {self.company_name}>"
```

---

## 5. 인증 및 테넌트 라우팅

### 5.1 JWT 토큰 구조

```python
# JWT Payload 예시
{
    "sub": "user-uuid-here",           # 사용자 ID
    "tenant_key": "acme01",            # 테넌트 키
    "role": "tenant_admin",            # 역할 (manager, tenant_admin, tenant_user)
    "permissions": ["users:read", "users:write"],  # 권한 목록
    "exp": 1704067200,                 # 만료 시간
    "type": "access"                   # 토큰 타입
}
```

### 5.2 JWT 유틸리티 (core/security.py 확장)

```python
"""인증 및 보안 유틸리티"""

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenData(BaseModel):
    """JWT 토큰 데이터"""
    sub: str  # user_id
    tenant_key: str | None = None
    role: str
    permissions: list[str] = []
    exp: int
    type: str = "access"


def decode_token(token: str) -> TokenData:
    """JWT 토큰 디코딩"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return TokenData(**payload)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 만료되었습니다",
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 인증 토큰입니다",
        )


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """Access Token 생성"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    password_bytes = plain_password.encode('utf-8')[:72]  # bcrypt 72바이트 제한
    return pwd_context.verify(password_bytes, hashed_password)


def get_password_hash(password: str) -> str:
    """비밀번호 해싱"""
    password_bytes = password.encode('utf-8')[:72]
    return pwd_context.hash(password_bytes)
```

### 5.3 테넌트 DB 라우터 (core/tenant_router.py)

```python
"""테넌트 DB 연결 라우팅 및 캐싱"""

import asyncio
from typing import Dict

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from src.core.config import settings
from src.core.database import get_central_admin_session
from src.models.central.tenant import Tenant


# 캐시: tenant_key -> (engine, sessionmaker)
ENGINE_CACHE: Dict[str, AsyncEngine] = {}
SESSIONMAKER_CACHE: Dict[str, sessionmaker] = {}
ENGINE_LOCK = asyncio.Lock()


async def get_tenant_db_info(tenant_key: str) -> dict | None:
    """Central Admin DB에서 테넌트 연결 정보 조회"""
    async with get_central_admin_session() as session:
        stmt = select(Tenant).where(
            Tenant.tenant_key == tenant_key,
            Tenant.is_active == True
        )
        result = await session.execute(stmt)
        tenant = result.scalar_one_or_none()
        
        if not tenant:
            return None
        
        # TODO: Vault에서 실제 비밀번호 복호화
        # 현재는 단순 예시
        return {
            "tenant_key": tenant.tenant_key,
            "db_host": tenant.db_host,
            "db_port": tenant.db_port,
            "db_name": tenant.db_name,
            "db_user": tenant.db_user,
            "db_password": decrypt_password(tenant.db_password_encrypted),
            "is_active": tenant.is_active,
        }


def decrypt_password(encrypted: str) -> str:
    """
    비밀번호 복호화 (Vault/KMS 연동)
    
    프로덕션에서는 Hashicorp Vault 또는 AWS KMS 사용
    """
    # TODO: 실제 복호화 로직 구현
    # 예: Vault에서 조회
    # import hvac
    # client = hvac.Client(url=settings.vault_url, token=settings.vault_token)
    # secret = client.secrets.kv.v2.read_secret_version(path=f'tenants/{encrypted}')
    # return secret['data']['data']['password']
    
    # 개발 환경: 단순 반환
    return encrypted


async def get_tenant_sessionmaker(tenant_key: str) -> sessionmaker:
    """
    테넌트별 AsyncSession Maker 반환 (캐싱)
    
    Args:
        tenant_key: 테넌트 키 (예: acme01)
    
    Returns:
        sessionmaker: 테넌트 DB용 세션 메이커
    
    Raises:
        RuntimeError: 테넌트를 찾을 수 없거나 비활성 상태
    """
    # 캐시 확인
    if tenant_key in SESSIONMAKER_CACHE:
        return SESSIONMAKER_CACHE[tenant_key]
    
    # 락 획득 (동시 생성 방지)
    async with ENGINE_LOCK:
        # 더블 체크
        if tenant_key in SESSIONMAKER_CACHE:
            return SESSIONMAKER_CACHE[tenant_key]
        
        # DB 정보 조회
        info = await get_tenant_db_info(tenant_key)
        if not info:
            raise RuntimeError(f"테넌트를 찾을 수 없습니다: {tenant_key}")
        
        if not info["is_active"]:
            raise RuntimeError(f"비활성 상태의 테넌트입니다: {tenant_key}")
        
        # 연결 문자열 생성
        db_url = (
            f"postgresql+asyncpg://{info['db_user']}:{info['db_password']}"
            f"@{info['db_host']}:{info['db_port']}/{info['db_name']}"
        )
        
        # 엔진 생성
        engine = create_async_engine(
            db_url,
            echo=settings.debug,
            pool_size=settings.tenant_connection_pool_size,
            max_overflow=settings.tenant_connection_max_overflow,
            pool_pre_ping=True,  # 연결 유효성 체크
        )
        
        # SessionMaker 생성
        async_session_maker = sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
        
        # 캐시 저장
        ENGINE_CACHE[tenant_key] = engine
        SESSIONMAKER_CACHE[tenant_key] = async_session_maker
        
        return async_session_maker


async def get_tenant_session(tenant_key: str) -> AsyncSession:
    """
    테넌트 DB 세션 생성
    
    Usage:
        async with get_tenant_session("acme01") as session:
            # DB 작업
            pass
    """
    session_maker = await get_tenant_sessionmaker(tenant_key)
    return session_maker()


async def dispose_all_engines():
    """모든 테넌트 엔진 정리 (애플리케이션 종료 시)"""
    for tenant_key, engine in ENGINE_CACHE.items():
        try:
            await engine.dispose()
            print(f"✅ 테넌트 {tenant_key} 엔진 정리 완료")
        except Exception as e:
            print(f"⚠️ 테넌트 {tenant_key} 엔진 정리 실패: {e}")
    
    ENGINE_CACHE.clear()
    SESSIONMAKER_CACHE.clear()


async def clear_tenant_cache(tenant_key: str):
    """특정 테넌트 캐시 제거 (연결 정보 변경 시)"""
    if tenant_key in ENGINE_CACHE:
        await ENGINE_CACHE[tenant_key].dispose()
        del ENGINE_CACHE[tenant_key]
        del SESSIONMAKER_CACHE[tenant_key]
```

### 5.4 Database 초기화 업데이트 (core/database.py)

```python
"""데이터베이스 설정"""

from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings


# Base Classes
class CentralAdminBase(DeclarativeBase):
    """Central Admin DB Base"""
    pass


class TenantBase(DeclarativeBase):
    """Tenant DB Base"""
    pass


class ManagerBase(DeclarativeBase):
    """Manager DB Base (하위 호환)"""
    pass


# Central Admin Engine (전역 관리 DB)
central_admin_engine = create_async_engine(
    settings.central_admin_database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=5,
)

CentralAdminSessionLocal = async_sessionmaker(
    central_admin_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Manager Engine (하위 호환 - 기존 코드용)
manager_engine = create_async_engine(
    settings.manager_database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=5,
)

ManagerSessionLocal = async_sessionmaker(
    manager_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Dependencies
async def get_central_admin_session() -> AsyncGenerator[AsyncSession, None]:
    """Central Admin DB 세션"""
    async with CentralAdminSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_manager_db() -> AsyncGenerator[AsyncSession, None]:
    """Manager DB 세션 (하위 호환)"""
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
    if settings.debug:
        try:
            async with central_admin_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print("✅ Central Admin 데이터베이스 연결 성공")
        except Exception as e:
            print(f"⚠️ Central Admin 데이터베이스 연결 실패: {e}")

        try:
            async with manager_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print("✅ Manager 데이터베이스 연결 성공")
        except Exception as e:
            print(f"⚠️ Manager 데이터베이스 연결 실패: {e}")


async def close_db():
    """데이터베이스 연결 종료"""
    from src.core.tenant_router import dispose_all_engines
    
    try:
        await central_admin_engine.dispose()
        await manager_engine.dispose()
        await dispose_all_engines()  # 모든 테넌트 엔진 정리
        print("✅ 모든 데이터베이스 연결 종료")
    except Exception as e:
        print(f"⚠️ 데이터베이스 연결 종료 중 오류: {e}")
```

---

## 6. GraphQL 스키마 설계

### 6.1 GraphQL Context (graphql/context.py)

```python
"""GraphQL Context 팩토리"""

from dataclasses import dataclass
from typing import Any

import strawberry
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import TokenData, decode_token
from src.core.tenant_router import get_tenant_session
from src.graphql.loaders import create_loaders


@dataclass
class GraphQLContext:
    """GraphQL 실행 컨텍스트"""
    
    request: Request
    token_data: TokenData
    db_session: AsyncSession
    loaders: dict[str, Any]
    
    @property
    def user_id(self) -> str:
        """현재 사용자 ID"""
        return self.token_data.sub
    
    @property
    def tenant_key(self) -> str:
        """현재 테넌트 키"""
        if not self.token_data.tenant_key:
            raise RuntimeError("tenant_key가 토큰에 없습니다")
        return self.token_data.tenant_key
    
    @property
    def role(self) -> str:
        """현재 사용자 역할"""
        return self.token_data.role
    
    @property
    def permissions(self) -> list[str]:
        """현재 사용자 권한 목록"""
        return self.token_data.permissions
    
    def has_permission(self, permission: str) -> bool:
        """권한 체크"""
        return permission in self.permissions or self.role == "manager"


async def get_context(request: Request) -> GraphQLContext:
    """
    GraphQL Context 생성
    
    각 요청마다 호출되어 Context를 생성합니다.
    """
    # 1. 토큰 추출 및 파싱
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise RuntimeError("인증이 필요합니다")
    
    try:
        token = auth_header.split(" ")[1]  # "Bearer <token>"
        token_data = decode_token(token)
    except IndexError:
        raise RuntimeError("잘못된 Authorization 헤더 형식입니다")
    
    # 2. 테넌트 키 확인
    tenant_key = token_data.tenant_key
    if not tenant_key:
        raise RuntimeError("토큰에 tenant_key가 없습니다")
    
    # 3. 테넌트 DB 세션 생성
    db_session = await get_tenant_session(tenant_key)
    
    # 4. DataLoader 생성
    loaders = create_loaders(db_session)
    
    return GraphQLContext(
        request=request,
        token_data=token_data,
        db_session=db_session,
        loaders=loaders,
    )
```

### 6.2 커스텀 스칼라 타입 (graphql/types/scalars.py)

```python
"""커스텀 스칼라 타입"""

from datetime import datetime
from typing import Any
from uuid import UUID

import strawberry


@strawberry.scalar(
    serialize=lambda v: str(v),
    parse_value=lambda v: UUID(v),
)
class UUIDScalar(UUID):
    """UUID 스칼라"""
    pass


@strawberry.scalar(
    serialize=lambda v: v.isoformat() if v else None,
    parse_value=lambda v: datetime.fromisoformat(v) if v else None,
)
class DateTimeScalar(datetime):
    """DateTime 스칼라"""
    pass
```

### 6.3 공통 타입 (graphql/types/base.py)

```python
"""GraphQL 공통 타입"""

from typing import Generic, TypeVar

import strawberry


@strawberry.type
class PageInfo:
    """페이지네이션 정보"""
    
    has_next_page: bool
    has_previous_page: bool
    start_cursor: str | None
    end_cursor: str | None
    total_count: int


T = TypeVar("T")


@strawberry.type
class Connection(Generic[T]):
    """연결 타입 (Relay 스타일 페이지네이션)"""
    
    edges: list[T]
    page_info: PageInfo


@strawberry.type
class SuccessResponse:
    """성공 응답"""
    
    success: bool
    message: str | None = None


@strawberry.type
class ErrorResponse:
    """에러 응답"""
    
    code: str
    message: str
    detail: dict | None = None
```

### 6.4 User 타입 예시 (graphql/types/tenants/user.py)

```python
"""User GraphQL 타입"""

from datetime import datetime
from typing import Optional
from uuid import UUID

import strawberry
from strawberry import relay

from src.graphql.types.scalars import DateTimeScalar, UUIDScalar


@strawberry.type
class User:
    """사용자 타입"""
    
    id: UUIDScalar
    username: str
    email: str
    full_name: str
    phone: Optional[str] = None
    department_id: Optional[UUIDScalar] = None
    position: Optional[str] = None
    role_id: Optional[UUIDScalar] = None
    is_active: bool
    is_system_user: bool
    last_login_at: Optional[DateTimeScalar] = None
    created_at: DateTimeScalar
    updated_at: Optional[DateTimeScalar] = None
    
    # Relations (lazy loading with DataLoader)
    @strawberry.field
    async def department(self, info) -> Optional["Department"]:
        """소속 부서"""
        if not self.department_id:
            return None
        return await info.context.loaders["department"].load(self.department_id)
    
    @strawberry.field
    async def role(self, info) -> Optional["Role"]:
        """역할"""
        if not self.role_id:
            return None
        return await info.context.loaders["role"].load(self.role_id)


@strawberry.input
class UserCreateInput:
    """사용자 생성 입력"""
    
    username: str
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    department_id: Optional[UUIDScalar] = None
    position: Optional[str] = None
    role_id: Optional[UUIDScalar] = None


@strawberry.input
class UserUpdateInput:
    """사용자 수정 입력"""
    
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[UUIDScalar] = None
    position: Optional[str] = None
    role_id: Optional[UUIDScalar] = None
    is_active: Optional[bool] = None


@strawberry.type
class UserEdge:
    """사용자 엣지 (페이지네이션용)"""
    
    cursor: str
    node: User


@strawberry.type
class UserConnection:
    """사용자 연결"""
    
    edges: list[UserEdge]
    page_info: "PageInfo"
```

---

## 7. 실무 구현 가이드

### 7.1 Query 리졸버 (graphql/queries/tenants/user.py)

```python
"""User Query 리졸버"""

from typing import Optional
from uuid import UUID

import strawberry
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.permissions import check_permission
from src.graphql.types.base import PageInfo
from src.graphql.types.tenants.user import User, UserConnection, UserEdge
from src.models.tenants.sys import Users


async def get_user_by_id(
    info,
    user_id: UUID,
) -> Optional[User]:
    """
    사용자 단건 조회
    
    Args:
        user_id: 사용자 ID
    
    Returns:
        User 객체 또는 None
    """
    # 권한 체크
    check_permission(info.context, "users:read")
    
    db: AsyncSession = info.context.db_session
    
    stmt = select(Users).where(
        Users.id == user_id,
        Users.is_deleted == False
    )
    result = await db.execute(stmt)
    user_model = result.scalar_one_or_none()
    
    if not user_model:
        return None
    
    # ORM 모델 → GraphQL 타입 변환
    return User(
        id=user_model.id,
        username=user_model.username,
        email=user_model.email,
        full_name=user_model.full_name,
        phone=user_model.phone,
        department_id=user_model.department_id,
        position=user_model.position,
        role_id=user_model.role_id,
        is_active=user_model.is_active,
        is_system_user=user_model.is_system_user,
        last_login_at=user_model.last_login_at,
        created_at=user_model.created_at,
        updated_at=user_model.updated_at,
    )


async def get_users_list(
    info,
    first: int = 20,
    after: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
) -> UserConnection:
    """
    사용자 목록 조회 (Relay 스타일 커서 페이지네이션)
    
    Args:
        first: 조회할 아이템 수
        after: 커서 (이전 페이지의 마지막 커서)
        search: 검색어 (username, full_name, email)
        is_active: 활성 상태 필터
    
    Returns:
        UserConnection
    """
    check_permission(info.context, "users:read")
    
    db: AsyncSession = info.context.db_session
    
    # 기본 쿼리
    stmt = select(Users).where(Users.is_deleted == False)
    
    # 필터 적용
    if search:
        search_pattern = f"%{search}%"
        stmt = stmt.where(
            (Users.username.ilike(search_pattern)) |
            (Users.full_name.ilike(search_pattern)) |
            (Users.email.ilike(search_pattern))
        )
    
    if is_active is not None:
        stmt = stmt.where(Users.is_active == is_active)
    
    # 커서 페이지네이션
    if after:
        # 커서 디코딩 (Base64 등으로 인코딩된 경우)
        cursor_id = UUID(after)  # 간단히 UUID를 그대로 사용
        stmt = stmt.where(Users.id > cursor_id)
    
    # 정렬 및 제한
    stmt = stmt.order_by(Users.created_at.desc(), Users.id).limit(first + 1)
    
    # 실행
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    # 전체 개수 조회
    count_stmt = select(func.count()).select_from(Users).where(Users.is_deleted == False)
    if search:
        count_stmt = count_stmt.where(
            (Users.username.ilike(search_pattern)) |
            (Users.full_name.ilike(search_pattern)) |
            (Users.email.ilike(search_pattern))
        )
    if is_active is not None:
        count_stmt = count_stmt.where(Users.is_active == is_active)
    
    total_count = await db.scalar(count_stmt)
    
    # 다음 페이지 존재 여부
    has_next = len(users) > first
    if has_next:
        users = users[:first]
    
    # Edge 생성
    edges = [
        UserEdge(
            cursor=str(user.id),
            node=User(
                id=user.id,
                username=user.username,
                email=user.email,
                full_name=user.full_name,
                phone=user.phone,
                department_id=user.department_id,
                position=user.position,
                role_id=user.role_id,
                is_active=user.is_active,
                is_system_user=user.is_system_user,
                last_login_at=user.last_login_at,
                created_at=user.created_at,
                updated_at=user.updated_at,
            )
        )
        for user in users
    ]
    
    # PageInfo 생성
    page_info = PageInfo(
        has_next_page=has_next,
        has_previous_page=after is not None,
        start_cursor=edges[0].cursor if edges else None,
        end_cursor=edges[-1].cursor if edges else None,
        total_count=total_count or 0,
    )
    
    return UserConnection(edges=edges, page_info=page_info)
```

### 7.2 Mutation 리졸버 (graphql/mutations/tenants/user.py)

```python
"""User Mutation 리졸버"""

from uuid import UUID

import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import get_password_hash
from src.graphql.permissions import check_permission
from src.graphql.types.base import SuccessResponse
from src.graphql.types.tenants.user import User, UserCreateInput, UserUpdateInput
from src.models.tenants.sys import Users


async def create_user(
    info,
    input: UserCreateInput,
) -> User:
    """
    사용자 생성
    
    Args:
        input: 사용자 생성 데이터
    
    Returns:
        생성된 User
    """
    check_permission(info.context, "users:write")
    
    db: AsyncSession = info.context.db_session
    creator_id = UUID(info.context.user_id)
    
    # 중복 체크
    stmt = select(Users).where(
        (Users.username == input.username) | (Users.email == input.email),
        Users.is_deleted == False
    )
    existing = await db.execute(stmt)
    if existing.scalar_one_or_none():
        raise ValueError("이미 존재하는 사용자명 또는 이메일입니다")
    
    # 비밀번호 해싱
    hashed_password = get_password_hash(input.password)
    
    # 사용자 생성
    new_user = Users(
        username=input.username,
        email=input.email,
        password=hashed_password,
        full_name=input.full_name,
        phone=input.phone,
        department_id=input.department_id,
        position=input.position,
        role_id=input.role_id,
        is_active=True,
        is_system_user=False,
        failed_login_attempts=0,
        created_by=creator_id,
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return User(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        full_name=new_user.full_name,
        phone=new_user.phone,
        department_id=new_user.department_id,
        position=new_user.position,
        role_id=new_user.role_id,
        is_active=new_user.is_active,
        is_system_user=new_user.is_system_user,
        last_login_at=new_user.last_login_at,
        created_at=new_user.created_at,
        updated_at=new_user.updated_at,
    )


async def update_user(
    info,
    user_id: UUID,
    input: UserUpdateInput,
) -> User:
    """
    사용자 정보 수정
    
    Args:
        user_id: 사용자 ID
        input: 수정할 데이터
    
    Returns:
        수정된 User
    """
    check_permission(info.context, "users:write")
    
    db: AsyncSession = info.context.db_session
    updater_id = UUID(info.context.user_id)
    
    # 사용자 조회
    stmt = select(Users).where(Users.id == user_id, Users.is_deleted == False)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ValueError("사용자를 찾을 수 없습니다")
    
    # 업데이트
    if input.email is not None:
        user.email = input.email
    if input.full_name is not None:
        user.full_name = input.full_name
    if input.phone is not None:
        user.phone = input.phone
    if input.department_id is not None:
        user.department_id = input.department_id
    if input.position is not None:
        user.position = input.position
    if input.role_id is not None:
        user.role_id = input.role_id
    if input.is_active is not None:
        user.is_active = input.is_active
    
    user.updated_by = updater_id
    
    await db.commit()
    await db.refresh(user)
    
    return User(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        department_id=user.department_id,
        position=user.position,
        role_id=user.role_id,
        is_active=user.is_active,
        is_system_user=user.is_system_user,
        last_login_at=user.last_login_at,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


async def delete_user(
    info,
    user_id: UUID,
) -> SuccessResponse:
    """
    사용자 삭제 (소프트 삭제)
    
    Args:
        user_id: 사용자 ID
    
    Returns:
        SuccessResponse
    """
    check_permission(info.context, "users:delete")
    
    db: AsyncSession = info.context.db_session
    deleter_id = UUID(info.context.user_id)
    
    stmt = select(Users).where(Users.id == user_id, Users.is_deleted == False)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ValueError("사용자를 찾을 수 없습니다")
    
    # 소프트 삭제
    user.is_deleted = True
    user.deleted_by = deleter_id
    
    await db.commit()
    
    return SuccessResponse(
        success=True,
        message=f"사용자 '{user.username}'이(가) 삭제되었습니다"
    )
```

### 7.3 권한 체크 (graphql/permissions.py)

```python
"""GraphQL 권한 체크"""

from functools import wraps
from typing import Callable

import strawberry
from strawberry.types import Info

from src.graphql.context import GraphQLContext


class PermissionDenied(Exception):
    """권한 거부 예외"""
    pass


def check_permission(context: GraphQLContext, permission: str):
    """
    권한 체크
    
    Args:
        context: GraphQL 컨텍스트
        permission: 필요한 권한 (예: "users:read", "users:write")
    
    Raises:
        PermissionDenied: 권한이 없을 경우
    """
    if not context.has_permission(permission):
        raise PermissionDenied(
            f"권한이 부족합니다: {permission} (현재 역할: {context.role})"
        )


def require_permission(permission: str):
    """
    권한 체크 데코레이터
    
    Usage:
        @require_permission("users:write")
        async def create_user(info, input):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(info: Info, *args, **kwargs):
            check_permission(info.context, permission)
            return await func(info, *args, **kwargs)
        return wrapper
    return decorator


def require_role(role: str):
    """
    역할 체크 데코레이터
    
    Usage:
        @require_role("manager")
        async def admin_only_query(info):
            ...
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(info: Info, *args, **kwargs):
            context: GraphQLContext = info.context
            if context.role != role:
                raise PermissionDenied(f"'{role}' 역할이 필요합니다")
            return await func(info, *args, **kwargs)
        return wrapper
    return decorator
```

### 7.4 메인 스키마 (graphql/schema.py)

```python
"""Strawberry GraphQL 스키마"""

from typing import Optional
from uuid import UUID

import strawberry

from src.graphql.context import GraphQLContext, get_context
from src.graphql.mutations.tenants.user import create_user, delete_user, update_user
from src.graphql.queries.tenants.user import get_user_by_id, get_users_list
from src.graphql.types.base import SuccessResponse
from src.graphql.types.tenants.user import User, UserConnection, UserCreateInput, UserUpdateInput


@strawberry.type
class Query:
    """GraphQL Query 루트"""
    
    @strawberry.field(description="사용자 단건 조회")
    async def user(
        self,
        info: strawberry.Info[GraphQLContext, None],
        user_id: UUID,
    ) -> Optional[User]:
        """사용자 조회"""
        return await get_user_by_id(info, user_id)
    
    @strawberry.field(description="사용자 목록 조회")
    async def users(
        self,
        info: strawberry.Info[GraphQLContext, None],
        first: int = 20,
        after: Optional[str] = None,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> UserConnection:
        """사용자 목록"""
        return await get_users_list(info, first, after, search, is_active)
    
    @strawberry.field(description="현재 로그인한 사용자 정보")
    async def me(
        self,
        info: strawberry.Info[GraphQLContext, None],
    ) -> Optional[User]:
        """내 정보"""
        user_id = UUID(info.context.user_id)
        return await get_user_by_id(info, user_id)


@strawberry.type
class Mutation:
    """GraphQL Mutation 루트"""
    
    @strawberry.mutation(description="사용자 생성")
    async def create_user(
        self,
        info: strawberry.Info[GraphQLContext, None],
        input: UserCreateInput,
    ) -> User:
        """사용자 생성"""
        return await create_user(info, input)
    
    @strawberry.mutation(description="사용자 정보 수정")
    async def update_user(
        self,
        info: strawberry.Info[GraphQLContext, None],
        user_id: UUID,
        input: UserUpdateInput,
    ) -> User:
        """사용자 수정"""
        return await update_user(info, user_id, input)
    
    @strawberry.mutation(description="사용자 삭제")
    async def delete_user(
        self,
        info: strawberry.Info[GraphQLContext, None],
        user_id: UUID,
    ) -> SuccessResponse:
        """사용자 삭제"""
        return await delete_user(info, user_id)


# 스키마 생성
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    # subscription=Subscription,  # 실시간 구독이 필요한 경우
)
```

### 7.5 FastAPI 통합 (main.py 업데이트)

```python
"""ConexGrow GraphQL API Main Application"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from strawberry.fastapi import GraphQLRouter

from src.core.config import settings
from src.core.database import close_db, init_db
from src.core.middleware import RequestIDMiddleware, TimingMiddleware
from src.graphql.context import get_context
from src.graphql.schema import schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # 시작 시
    await init_db()
    print("🚀 GraphQL API 서버 시작")
    yield
    # 종료 시
    await close_db()
    print("👋 GraphQL API 서버 종료")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="ConexGrow GraphQL API - Multi-tenant Platform",
    lifespan=lifespan,
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


# GraphQL 라우터
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
    graphiql=settings.debug,  # 개발 환경에서만 GraphiQL UI 활성화
)

app.include_router(graphql_app, prefix="/graphql", tags=["GraphQL"])


# 헬스체크 엔드포인트
@app.get("/health", tags=["System"])
async def health():
    """헬스 체크"""
    return {
        "status": "healthy",
        "version": settings.api_version,
        "api_type": "graphql"
    }


@app.get("/", tags=["System"])
async def root():
    """루트 엔드포인트"""
    return {
        "message": "ConexGrow GraphQL API",
        "version": settings.api_version,
        "graphql_endpoint": "/graphql",
        "health_endpoint": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
```

---

## 8. 데이터로더와 성능 최적화

### 8.1 DataLoader 구현 (graphql/loaders.py)

```python
"""DataLoader 구현 - N+1 문제 해결"""

from typing import List
from uuid import UUID

from aiodataloader import DataLoader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys import Departments, Roles, Users


class DepartmentLoader(DataLoader):
    """부서 DataLoader"""
    
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, keys: List[UUID]) -> List:
        """부서 일괄 로딩"""
        stmt = select(Departments).where(Departments.id.in_(keys))
        result = await self.db.execute(stmt)
        departments = result.scalars().all()
        
        # ID로 매핑
        dept_map = {dept.id: dept for dept in departments}
        
        # 키 순서대로 반환 (None 포함)
        return [dept_map.get(key) for key in keys]


class RoleLoader(DataLoader):
    """역할 DataLoader"""
    
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, keys: List[UUID]) -> List:
        """역할 일괄 로딩"""
        stmt = select(Roles).where(Roles.id.in_(keys))
        result = await self.db.execute(stmt)
        roles = result.scalars().all()
        
        role_map = {role.id: role for role in roles}
        return [role_map.get(key) for key in keys]


class UserLoader(DataLoader):
    """사용자 DataLoader"""
    
    def __init__(self, db: AsyncSession):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, keys: List[UUID]) -> List:
        """사용자 일괄 로딩"""
        stmt = select(Users).where(Users.id.in_(keys), Users.is_deleted == False)
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        user_map = {user.id: user for user in users}
        return [user_map.get(key) for key in keys]


def create_loaders(db: AsyncSession) -> dict:
    """
    DataLoader 인스턴스 생성
    
    각 요청마다 새로운 로더 생성 (배치 캐싱)
    """
    return {
        "department": DepartmentLoader(db),
        "role": RoleLoader(db),
        "user": UserLoader(db),
    }
```

### 8.2 DataLoader 사용 예시

**Before (N+1 문제):**
```python
# 100명의 사용자 조회 시
# → 1번의 사용자 쿼리 + 100번의 부서 쿼리 = 101번의 DB 쿼리
for user in users:
    department = await db.get(Departments, user.department_id)  # N번 실행!
```

**After (DataLoader 사용):**
```python
# 100명의 사용자 조회 시
# → 1번의 사용자 쿼리 + 1번의 부서 배치 쿼리 = 2번의 DB 쿼리
for user in users:
    department = await info.context.loaders["department"].load(user.department_id)  # 배치 처리!
```

### 8.3 쿼리 복잡도 제한

```python
"""GraphQL 쿼리 복잡도 제한"""

import strawberry
from strawberry.extensions import QueryDepthLimiter

from src.core.config import settings


# 스키마에 확장 추가
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        QueryDepthLimiter(max_depth=settings.graphql_depth_limit),
    ]
)
```

### 8.4 Redis 캐싱 (선택사항)

```python
"""Redis 캐싱 유틸리티"""

import json
from typing import Any, Optional

import aioredis
from src.core.config import settings


class RedisCache:
    """Redis 캐시 클라이언트"""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
    
    async def connect(self):
        """Redis 연결"""
        self.redis = await aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def get(self, key: str) -> Any:
        """캐시 조회"""
        if not self.redis:
            return None
        
        value = await self.redis.get(key)
        if value:
            return json.loads(value)
        return None
    
    async def set(self, key: str, value: Any, ttl: int = None):
        """캐시 저장"""
        if not self.redis:
            return
        
        ttl = ttl or settings.redis_cache_ttl
        await self.redis.setex(
            key,
            ttl,
            json.dumps(value, default=str)
        )
    
    async def delete(self, key: str):
        """캐시 삭제"""
        if self.redis:
            await self.redis.delete(key)
    
    async def close(self):
        """연결 종료"""
        if self.redis:
            await self.redis.close()


# 전역 인스턴스
redis_cache = RedisCache()
```

---

## 9. 마이그레이션 및 프로비저닝

### 9.1 Central Admin DB 마이그레이션

```bash
# alembic/central_admin/ 폴더 생성
mkdir -p alembic/central_admin/versions

# Central Admin용 alembic.ini 생성
cp alembic.ini alembic_central_admin.ini
```

**alembic_central_admin.ini:**
```ini
[alembic]
script_location = alembic/central_admin
sqlalchemy.url = postgresql://admin:password@localhost:5432/central_admin

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

**초기 마이그레이션 생성:**
```bash
# Central Admin DB 초기 마이그레이션
alembic -c alembic_central_admin.ini revision --autogenerate -m "Create tenants table"

# 마이그레이션 적용
alembic -c alembic_central_admin.ini upgrade head
```

### 9.2 테넌트 프로비저닝 스크립트

**scripts/provision_tenant.py:**
```python
"""테넌트 프로비저닝 스크립트"""

import asyncio
import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from src.core.database import get_central_admin_session
from src.models.central.tenant import Tenant


async def provision_tenant(
    tenant_key: str,
    company_name: str,
    db_host: str,
    db_port: int,
    db_name: str,
    db_user: str,
    db_password: str,
):
    """
    새 테넌트 프로비저닝
    
    1. Central Admin DB에 테넌트 메타데이터 등록
    2. 테넌트 DB 생성
    3. 테넌트 DB에 스키마 마이그레이션 적용
    """
    print(f"🚀 테넌트 프로비저닝 시작: {tenant_key}")
    
    # 1. Central Admin DB에 등록
    async with get_central_admin_session() as session:
        tenant = Tenant(
            tenant_key=tenant_key,
            company_name=company_name,
            db_host=db_host,
            db_port=db_port,
            db_name=db_name,
            db_user=db_user,
            db_password_encrypted=db_password,  # TODO: 실제로는 암호화 필요
            is_active=True,
        )
        session.add(tenant)
        await session.commit()
        print(f"✅ Central Admin DB에 테넌트 등록 완료")
    
    # 2. 테넌트 DB 생성
    # 관리자 계정으로 연결하여 DB 생성
    admin_url = f"postgresql+asyncpg://postgres:adminpassword@{db_host}:{db_port}/postgres"
    admin_engine = create_async_engine(admin_url)
    
    async with admin_engine.connect() as conn:
        await conn.execution_options(isolation_level="AUTOCOMMIT")
        await conn.execute(text(f"CREATE DATABASE {db_name}"))
        print(f"✅ 데이터베이스 '{db_name}' 생성 완료")
    
    await admin_engine.dispose()
    
    # 3. 사용자 생성 및 권한 부여
    admin_engine = create_async_engine(admin_url)
    async with admin_engine.connect() as conn:
        await conn.execution_options(isolation_level="AUTOCOMMIT")
        await conn.execute(text(f"CREATE USER {db_user} WITH PASSWORD '{db_password}'"))
        await conn.execute(text(f"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {db_user}"))
        print(f"✅ 사용자 '{db_user}' 생성 및 권한 부여 완료")
    
    await admin_engine.dispose()
    
    # 4. 마이그레이션 적용
    # Alembic을 프로그래밍 방식으로 실행
    # 또는 subprocess로 alembic upgrade head 실행
    print(f"📦 마이그레이션 적용 중...")
    import subprocess
    
    # 환경 변수 설정
    env = {
        "TENANT_DATABASE_URL": f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    }
    
    result = subprocess.run(
        ["alembic", "upgrade", "head"],
        env={**os.environ, **env},
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print(f"✅ 마이그레이션 적용 완료")
    else:
        print(f"❌ 마이그레이션 실패: {result.stderr}")
        return
    
    print(f"🎉 테넌트 '{tenant_key}' 프로비저닝 완료!")


if __name__ == "__main__":
    import argparse
    import os
    
    parser = argparse.ArgumentParser(description="테넌트 프로비저닝")
    parser.add_argument("--tenant-key", required=True, help="테넌트 키 (예: acme01)")
    parser.add_argument("--company-name", required=True, help="회사명")
    parser.add_argument("--db-host", default="localhost", help="DB 호스트")
    parser.add_argument("--db-port", type=int, default=5432, help="DB 포트")
    parser.add_argument("--db-name", required=True, help="DB 이름")
    parser.add_argument("--db-user", required=True, help="DB 사용자")
    parser.add_argument("--db-password", required=True, help="DB 비밀번호")
    
    args = parser.parse_args()
    
    asyncio.run(provision_tenant(
        tenant_key=args.tenant_key,
        company_name=args.company_name,
        db_host=args.db_host,
        db_port=args.db_port,
        db_name=args.db_name,
        db_user=args.db_user,
        db_password=args.db_password,
    ))
```

**사용 예시:**
```bash
python scripts/provision_tenant.py \
    --tenant-key acme01 \
    --company-name "ACME Corporation" \
    --db-name acme01_db \
    --db-user acme01_user \
    --db-password "SecurePassword123!"
```

### 9.3 전체 테넌트 마이그레이션

**scripts/migrate_all_tenants.py:**
```python
"""전체 테넌트에 마이그레이션 적용"""

import asyncio
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select

from src.core.database import get_central_admin_session
from src.models.central.tenant import Tenant


async def migrate_all_tenants():
    """모든 활성 테넌트에 마이그레이션 적용"""
    print("🚀 전체 테넌트 마이그레이션 시작")
    
    async with get_central_admin_session() as session:
        stmt = select(Tenant).where(Tenant.is_active == True)
        result = await session.execute(stmt)
        tenants = result.scalars().all()
        
        print(f"📋 총 {len(tenants)}개 테넌트 발견")
        
        for tenant in tenants:
            print(f"\n🔧 테넌트: {tenant.tenant_key} ({tenant.company_name})")
            
            # 데이터베이스 URL 생성
            db_url = (
                f"postgresql://{tenant.db_user}:"
                f"{decrypt_password(tenant.db_password_encrypted)}"
                f"@{tenant.db_host}:{tenant.db_port}/{tenant.db_name}"
            )
            
            # Alembic 실행
            env = {"DATABASE_URL": db_url}
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                env={**os.environ, **env},
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print(f"✅ {tenant.tenant_key} 마이그레이션 성공")
            else:
                print(f"❌ {tenant.tenant_key} 마이그레이션 실패:")
                print(result.stderr)
    
    print("\n🎉 전체 테넌트 마이그레이션 완료")


def decrypt_password(encrypted: str) -> str:
    """비밀번호 복호화"""
    # TODO: 실제 복호화 로직
    return encrypted


if __name__ == "__main__":
    import os
    asyncio.run(migrate_all_tenants())
```

---

## 10. 보안 및 권한 관리

### 10.1 보안 체크리스트

| 항목 | 설명 | 구현 |
|------|------|------|
| **JWT 보안** | - 짧은 TTL (15분)<br>- Refresh Token 사용<br>- 비밀키 안전 관리 | ✅ |
| **비밀번호** | - bcrypt 해싱<br>- 최소 8자, 복잡도 검증 | ✅ |
| **SQL Injection** | - SQLAlchemy ORM 사용<br>- Prepared Statements | ✅ |
| **XSS 방지** | - 입력 검증<br>- 출력 이스케이핑 | ✅ |
| **CSRF 방지** | - SameSite 쿠키<br>- CORS 설정 | ✅ |
| **Rate Limiting** | - API Gateway 레벨<br>- Redis 기반 제한 | 🔧 |
| **쿼리 제한** | - Depth Limit<br>- Complexity Limit | ✅ |

### 10.2 환경변수 관리

**.env.example:**
```bash
# 환경
ENVIRONMENT=development
DEBUG=true

# API
API_TITLE="ConexGrow GraphQL API"
API_VERSION="2.0.0"
API_HOST=0.0.0.0
API_PORT=8100

# Central Admin Database
CENTRAL_ADMIN_DATABASE_URL=postgresql://admin:password@localhost:5432/central_admin

# Manager Database (하위 호환)
MANAGER_DATABASE_URL=postgresql://admin:password@localhost:5432/mgmt

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=300

# Security
SECRET_KEY=change-this-to-a-random-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:8200,http://localhost:8300

# GraphQL
GRAPHQL_DEPTH_LIMIT=10
GRAPHQL_COMPLEXITY_LIMIT=1000

# Vault (프로덕션)
VAULT_URL=
VAULT_TOKEN=
```

### 10.3 Vault 연동 (프로덕션)

```python
"""Hashicorp Vault 연동"""

import hvac
from src.core.config import settings


class VaultClient:
    """Vault 클라이언트"""
    
    def __init__(self):
        if not settings.vault_url:
            raise ValueError("VAULT_URL이 설정되지 않았습니다")
        
        self.client = hvac.Client(
            url=settings.vault_url,
            token=settings.vault_token
        )
        
        if not self.client.is_authenticated():
            raise ValueError("Vault 인증 실패")
    
    def get_tenant_db_password(self, tenant_key: str) -> str:
        """테넌트 DB 비밀번호 조회"""
        secret_path = f"tenants/{tenant_key}/database"
        secret = self.client.secrets.kv.v2.read_secret_version(path=secret_path)
        return secret['data']['data']['password']
    
    def set_tenant_db_password(self, tenant_key: str, password: str):
        """테넌트 DB 비밀번호 저장"""
        secret_path = f"tenants/{tenant_key}/database"
        self.client.secrets.kv.v2.create_or_update_secret(
            path=secret_path,
            secret={'password': password}
        )


# 전역 인스턴스
vault_client = VaultClient() if settings.vault_url else None
```

---

## 11. 모니터링 및 운영

### 11.1 로깅

```python
"""구조화된 로깅"""

import logging
import sys
from typing import Any

from pythonjsonlogger import jsonlogger

from src.core.config import settings


def setup_logging():
    """로깅 설정"""
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, settings.log_level.upper()))
    
    handler = logging.StreamHandler(sys.stdout)
    
    if settings.log_format == "json":
        formatter = jsonlogger.JsonFormatter(
            "%(asctime)s %(name)s %(levelname)s %(message)s"
        )
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
    
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger


logger = setup_logging()


# 사용 예시
logger.info("GraphQL query executed", extra={
    "tenant_key": "acme01",
    "user_id": "uuid-here",
    "query_name": "users",
    "duration_ms": 45
})
```

### 11.2 메트릭 수집 (Prometheus)

```python
"""Prometheus 메트릭"""

from prometheus_client import Counter, Histogram, generate_latest
from fastapi import Response


# 메트릭 정의
graphql_requests_total = Counter(
    "graphql_requests_total",
    "Total GraphQL requests",
    ["tenant_key", "operation_type", "operation_name"]
)

graphql_request_duration = Histogram(
    "graphql_request_duration_seconds",
    "GraphQL request duration",
    ["tenant_key", "operation_type"]
)


@app.get("/metrics")
async def metrics():
    """Prometheus 메트릭 엔드포인트"""
    return Response(content=generate_latest(), media_type="text/plain")
```

### 11.3 헬스체크 상세

```python
"""상세 헬스체크"""

from fastapi import status
from sqlalchemy import text

from src.core.database import central_admin_engine, manager_engine
from src.core.tenant_router import ENGINE_CACHE


@app.get("/health/detailed", tags=["System"])
async def detailed_health():
    """상세 헬스체크"""
    health_status = {
        "status": "healthy",
        "version": settings.api_version,
        "checks": {}
    }
    
    # Central Admin DB 체크
    try:
        async with central_admin_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        health_status["checks"]["central_admin_db"] = "healthy"
    except Exception as e:
        health_status["checks"]["central_admin_db"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
    
    # Manager DB 체크
    try:
        async with manager_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        health_status["checks"]["manager_db"] = "healthy"
    except Exception as e:
        health_status["checks"]["manager_db"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
    
    # 테넌트 DB 캐시 상태
    health_status["checks"]["tenant_connections"] = len(ENGINE_CACHE)
    
    # Redis 체크 (선택)
    # ...
    
    status_code = status.HTTP_200_OK if health_status["status"] == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return JSONResponse(content=health_status, status_code=status_code)
```

---

## 12. 테스트 전략

### 12.1 유닛 테스트

**tests/graphql/test_queries.py:**
```python
"""GraphQL Query 테스트"""

import pytest
from uuid import uuid4

from src.graphql.queries.tenants.user import get_user_by_id
from src.models.tenants.sys import Users


@pytest.mark.asyncio
async def test_get_user_by_id(db_session, mock_context):
    """사용자 조회 테스트"""
    # Given: 테스트 사용자 생성
    user_id = uuid4()
    test_user = Users(
        id=user_id,
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        password="hashed",
        is_active=True,
        is_system_user=False,
    )
    db_session.add(test_user)
    await db_session.commit()
    
    # When: 사용자 조회
    result = await get_user_by_id(mock_context, user_id)
    
    # Then: 결과 검증
    assert result is not None
    assert result.id == user_id
    assert result.username == "testuser"
```

### 12.2 통합 테스트

**tests/graphql/test_integration.py:**
```python
"""GraphQL 통합 테스트"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_user_query(client: AsyncClient, auth_token: str):
    """사용자 조회 GraphQL 쿼리 테스트"""
    query = """
    query {
        users(first: 10) {
            edges {
                node {
                    id
                    username
                    email
                }
            }
            pageInfo {
                totalCount
            }
        }
    }
    """
    
    response = await client.post(
        "/graphql",
        json={"query": query},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "users" in data["data"]
```

---

## 13. 배포 가이드

### 13.1 Docker 컨테이너화

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드
COPY . .

# 환경 변수
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 8100

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8100"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8100:8100"
    environment:
      - CENTRAL_ADMIN_DATABASE_URL=postgresql://admin:password@db:5432/central_admin
      - MANAGER_DATABASE_URL=postgresql://admin:password@db:5432/mgmt
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: unless-stopped
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 13.2 Kubernetes 배포

**k8s/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cxg-graphql-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cxg-graphql-api
  template:
    metadata:
      labels:
        app: cxg-graphql-api
    spec:
      containers:
      - name: api
        image: cxg/graphql-api:latest
        ports:
        - containerPort: 8100
        env:
        - name: CENTRAL_ADMIN_DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: central-admin-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8100
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8100
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: cxg-graphql-api
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8100
  selector:
    app: cxg-graphql-api
```

---

## 부록

### A. GraphQL 쿼리 예시

```graphql
# 사용자 목록 조회
query GetUsers {
  users(first: 20, search: "john") {
    edges {
      cursor
      node {
        id
        username
        fullName
        email
        department {
          id
          name
        }
        role {
          id
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      totalCount
    }
  }
}

# 사용자 생성
mutation CreateUser {
  createUser(input: {
    username: "newuser"
    email: "new@example.com"
    password: "Password123!"
    fullName: "New User"
    departmentId: "dept-uuid"
  }) {
    id
    username
    email
  }
}

# 내 정보 조회
query Me {
  me {
    id
    username
    fullName
    role {
      name
      permissions {
        code
      }
    }
  }
}
```

### B. 마이그레이션 체크리스트

- [ ] Central Admin DB 생성
- [ ] Central Admin DB 마이그레이션 적용
- [ ] 테넌트 프로비저닝 스크립트 테스트
- [ ] 전체 테넌트 마이그레이션 테스트
- [ ] 롤백 시나리오 검증
- [ ] 백업 정책 수립

### C. 참고 자료

- [Strawberry GraphQL 공식 문서](https://strawberry.rocks/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 문서](https://docs.sqlalchemy.org/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Relay Cursor Connections Specification](https://relay.dev/graphql/connections.htm)

---

**문서 버전**: 2.0.0  
**최종 업데이트**: 2024년 11월  
**작성자**: CXG 개발팀

