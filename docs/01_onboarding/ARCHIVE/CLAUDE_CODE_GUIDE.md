# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ConexGrow by CXG** is an AI-powered business support platform designed for small and medium-sized companies (under 50 employees). It's a multi-tenant SaaS solution with two main systems:

- **ConexGrow Manager** (`manager-web`): Service provider interface for managing tenants
- **ConexGrow Workspace** (`tenants-web`): Client interface integrating ERP, CRM, SCM, WMS, and workflow automation

### Brand Architecture

- **CXG**: Company name and domain (cxg.com)
- **ConexGrow**: Product brand name
  - ConexGrow Manager: Admin/management interface
  - ConexGrow Workspace: Tenant/client interface

## Architecture

This is a **Turborepo monorepo** with:

- **Backend**: Python FastAPI with dual-database architecture (manager DB + tenant DB)
- **Frontend**: Two Next.js 15 applications with App Router
- **Shared Packages**: Reusable components and utilities

### Directory Structure

```
apps/
  backend-api/          # Python FastAPI backend
    src/api/
      models/           # SQLAlchemy models split by domain
        manager/        # Manager system models (audt, bill, idam, ifra, mntr, tnnt)
        tenant/         # Tenant system models (adm, apm, asm, bim, csm, fim, ivm, lwm, psm, srm, sys)
      routers/          # API routes
        mgmt/           # Manager API routes
        tnnt/           # Tenant API routes
      schemas/          # Pydantic schemas
      services/         # Business logic
      ai/               # AI/ML modules (agents, chains, embeddings, prompts, tools)
      core/             # Core config and database setup
      utils/            # Shared utilities
  manager-web/          # Next.js manager app
  tenants-web/          # Next.js tenant app
packages/
  database/             # Shared database utilities
  shared-types/         # TypeScript type definitions
  ui-components/        # Shared React components
  utils/                # Shared utilities
```

### Dual Database Pattern

The backend uses **two separate PostgreSQL databases**:

1. **Manager Database** (`mgmt_db`): For service provider operations (tenant management, billing, infrastructure, monitoring)
2. **Tenant Database** (`tnnt_db`): For client operations (ERP, CRM, SCM, workflow, etc.)

Connection strings are configured via `DATABASE_URL` and `MGMT_DATABASE_URL` environment variables.

### Module Abbreviations

Backend models use abbreviated folder names to keep paths concise:

**Manager Models:**
- `audt` - Audit
- `bill` - Billing
- `idam` - Identity & Access Management
- `ifra` - Infrastructure
- `mntr` - Monitoring
- `tnnt` - Tenant Management

**Tenant Models:**
- `adm` - Administration (Common Master Data: codes, glossary, settings, currencies, units)
- `apm` - Approval Management (Electronic Approval Workflow)
- `asm` - Asset Management
- `bim` - BI/Analytics
- `csm` - Customer/CRM
- `fim` - Finance/Accounting
- `ivm` - Inventory Management
- `lwm` - Workflow Management (Generic Workflow Automation)
- `psm` - Procurement/Purchasing
- `srm` - Sales/Revenue
- `sys` - System Configuration

## Development Commands

### Package Manager

This project uses **pnpm** (v8.15.0+). Do not use npm or yarn.

### Root Commands (Turborepo)

```bash
pnpm dev          # Run all apps in development mode
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Run tests for all apps
pnpm clean        # Clean all build artifacts and node_modules
```

### Backend (Python FastAPI)

```bash
cd apps/backend-api

# Setup (uses uv for dependency management)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"

# Install with AI dependencies
uv pip install -e ".[dev,ai]"

# Run development server
uvicorn api.main:app --reload

# Run on specific port (default is 8100, configured in settings)
uvicorn api.main:app --reload --port 8100

# Code quality
black .                    # Format code
ruff check .              # Lint code
ruff check --fix .        # Auto-fix linting issues
mypy src/                 # Type checking

# Tests
pytest                    # Run all tests
pytest tests/path/test_file.py  # Run specific test file
pytest -k test_name       # Run specific test by name
pytest --cov              # Run with coverage
```

API documentation available at `http://localhost:8100/docs` (Swagger) or `/redoc` (ReDoc).

### Frontend (Next.js)

```bash
cd apps/manager-web   # or apps/tenants-web

pnpm install          # Install dependencies
pnpm dev              # Start dev server (uses Turbopack)
pnpm build            # Production build (uses Turbopack)
pnpm start            # Start production server
```

Manager app runs on port 8200 by default. Tenant app runs on port 8300.

## Tech Stack

### Backend
- Python 3.11+
- FastAPI (async web framework)
- SQLAlchemy 2.0+ with asyncio support
- PostgreSQL 15+ (asyncpg driver)
- Redis 7.0+ for caching
- Alembic for migrations
- Pydantic v2 for validation
- python-jose for JWT
- AI: OpenAI API, LangChain, Pinecone

### Frontend
- Next.js 15 with App Router
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui components (Radix UI)
- Zustand for state management
- TanStack Query (React Query) for data fetching
- Axios for HTTP client
- date-fns for date utilities
- lucide-react for icons

### Code Quality (Backend)
- black (line length: 100)
- ruff (linting)
- mypy (type checking)
- pytest with pytest-asyncio

## Environment Setup

Backend requires `.env` file (see `.env.example`):

```bash
# Two separate database URLs
DATABASE_URL=postgresql://user:pass@localhost:5432/tnnt_db
MGMT_DATABASE_URL=postgresql://user:pass@localhost:5432/mgmt_db

REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-change-in-production
OPENAI_API_KEY=sk-...
```

## Key Patterns

### Backend Service Layer

Business logic should be in `services/`, not directly in routers. Routers handle HTTP concerns, services handle domain logic.

### Async/Await

The backend is fully async. Always use `async def` for route handlers and database operations. Use `asyncpg` for PostgreSQL operations.

### Database Sessions

Use dependency injection for database sessions. Do not create sessions manually in route handlers.

### Frontend API Calls

Use TanStack Query for data fetching. Zustand manages global state. Axios is configured for API calls.

### Shared Code

When adding utilities or types used by multiple apps, place them in appropriate `packages/` directories rather than duplicating code.

## Testing

Backend uses pytest with async support:

```bash
pytest                     # All tests
pytest tests/unit/         # Unit tests only
pytest tests/integration/  # Integration tests only
pytest -v                  # Verbose output
pytest --asyncio-mode=auto # Auto async mode (configured in pyproject.toml)
```

Frontend testing commands not yet configured in package.json.

## 문서화 표준

코드베이스의 모든 중요한 변경사항은 `docs/implementation/` 디렉토리에 문서화해야 합니다.

### 문서 구조

```
docs/
  implementation/
    backend-api/          # 백엔드 API 구현 문서
    manager-web/          # 매니저 웹 구현 문서
    tenants-web/          # 테넌트 웹 구현 문서
    shared/               # 공통/전체 시스템 구현 문서
```

### 파일명 규칙

모든 구현 문서는 다음 패턴을 따라야 합니다:

```
{변경내용_한글}_{yyyymmddhhmmss}.md
```

**예시**:
- `인증플로우_수정_20251017210930.md`
- `테마시스템_스크롤바_구현_20251017211208.md`
- `사용자관리_API_구현_20251015213022.md`

**타임스탬프**: 한국시간(KST) 기준 `yyyymmddhhmmss` 형식
- yyyy: 연도 (4자리)
- mm: 월 (2자리)
- dd: 일 (2자리)
- hh: 시 (24시간, 2자리)
- mm: 분 (2자리)
- ss: 초 (2자리)

### 문서 템플릿

각 구현 문서는 다음 구조를 포함해야 합니다:

```markdown
# [기능/변경사항 제목]

**날짜**: YYYY-MM-DD HH:MM:SS KST
**작성자**: [이름/시스템]
**유형**: [기능 구현 | 버그 수정 | 리팩토링 | 개선]
**컴포넌트**: [영향받은 컴포넌트 목록]

## 개요
변경된 내용과 이유에 대한 간단한 설명

## 식별된 문제점 (해당시)
이 변경을 하게 된 문제점

## 변경 내용
수정 사항에 대한 상세 설명

### 코드 예시
수정 전/후 비교를 포함한 관련 코드 스니펫

## 변경된 파일 목록
이 변경으로 영향받은 모든 파일 목록

## 테스트
변경사항을 테스트하거나 검증하는 방법

## 향후 개선사항 (선택)
잠재적인 개선사항이나 처리할 기술 부채

## 참고사항
추가 컨텍스트나 고려사항
```

### 문서화 대상

다음의 경우 문서를 작성합니다:
- ✅ 새로운 기능 또는 주요 기능 추가
- ✅ 여러 파일에 영향을 주는 버그 수정
- ✅ 아키텍처 또는 디자인 패턴 변경
- ✅ Breaking changes 또는 API 수정
- ✅ 보안 관련 변경사항
- ✅ 성능 최적화
- ✅ 데이터베이스 스키마 변경
- ✅ 인증/권한 관련 변경
- ✅ 여러 페이지에 영향을 주는 UI/UX 개선

다음의 경우 문서화를 생략할 수 있습니다:
- ❌ 단순 오타 수정
- ❌ 코드 포맷팅만 변경
- ❌ 코드 변경 없는 주석 업데이트
- ❌ 의존성 버전 업데이트 (코드 변경이 필요 없는 경우)

### 문서 작성 가이드라인

1. **한글 작성**: 모든 문서는 일관성을 위해 한글로 작성합니다
2. **구체적으로**: 파일 경로, 함수명, 코드 스니펫을 포함합니다
3. **맥락 포함**: 무엇이 변경되었는지뿐만 아니라 왜 변경했는지 설명합니다
4. **예시 추가**: 사용 예시와 테스트 시나리오를 제공합니다
5. **관련 문서 연결**: 관련된 다른 문서를 참조합니다
6. **최신 유지**: 관련 변경 시 문서를 업데이트합니다
7. **마크다운 사용**: 헤더, 코드 블록, 목록 등 적절한 포맷팅을 사용합니다

### 자동 문서화

변경사항 구현 시:
1. 영향받은 애플리케이션 식별 (backend-api, manager-web, tenants-web, shared)
2. 해당 `docs/implementation/{app}/` 디렉토리에 마크다운 파일 생성
3. 파일명에 현재 한국시간 타임스탬프 사용
4. 템플릿 구조 따르기
5. 코드 변경과 함께 문서를 커밋
