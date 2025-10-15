# CXG Platform

AI 기반 업무지원 플랫폼 - 50인 미만 중소기업을 위한 통합 SaaS 솔루션

## 구성

- **관리자 시스템**: 서비스 제공자가 테넌트를 관리하는 시스템
- **사용자 시스템**: ERP, CRM, SCM, WMS, 전자결재 등 회사 내부 시스템 통합 플랫폼

## 기술 스택

### 백엔드
- Python 3.11+ + FastAPI
- SQLAlchemy 2.0+ (Async)
- PostgreSQL 15+ + Redis 7.0+

### 프론트엔드
- Next.js 14+ (App Router)
- React 18+ + TypeScript 5.0+
- Tailwind CSS + shadcn/ui
- Zustand + TanStack Query

### 인프라
- Docker + Docker Compose
- Prometheus + Grafana

### AI/ML
- OpenAI API + LangChain + Pinecone

## 시작하기

### 백엔드
```bash
cd apps/backend-api
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
uvicorn api.main:app --reload
```

### 프론트엔드
```bash
cd apps/manager-web
pnpm install
pnpm dev
```

## 문서

- [아키텍처](docs/architecture/)
- [API 문서](docs/api/)
- [배포 가이드](docs/deployment/)
# cxg
