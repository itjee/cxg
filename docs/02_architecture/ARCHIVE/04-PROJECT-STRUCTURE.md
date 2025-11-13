# 프로젝트 구조

## 모노레포 전체 구조

```
cxg/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│       ├── ci-backend.yml
│       ├── ci-frontend.yml
│       └── deploy.yml
├── apps/
│   ├── backend-api/            # 백엔드 API 서버
│   ├── manager-web/            # 관리자 웹
│   └── tenants-web/            # 테넌트 웹
├── packages/
│   ├── shared-types/           # 공유 타입 정의
│   ├── ui-components/          # 공유 UI 컴포넌트
│   ├── utils/                  # 공유 유틸리티
│   └── database/               # DB 스키마 및 마이그레이션
├── infra/
│   ├── terraform/              # 인프라 코드
│   ├── kubernetes/             # K8s 매니페스트
│   ├── docker/                 # Docker 설정
│   └── monitoring/             # 모니터링 설정
├── scripts/
│   ├── setup.sh
│   ├── migrate.sh
│   └── deploy.sh
├── docs/                       # 문서
├── docker-compose.yml          # 로컬 개발 환경
├── docker-compose.dev.yml      # 개발 전용 설정
├── pnpm-workspace.yaml         # pnpm 워크스페이스
├── turbo.json                  # Turborepo 설정
└── README.md
```

## 백엔드 API 구조 (apps/backend-api/)

```
apps/backend-api/
├── src/
│   ├── main.py                 # FastAPI 앱 진입점
│   │
│   ├── core/                   # 핵심 인프라 코드
│   │   ├── __init__.py
│   │   ├── config.py           # 환경 설정
│   │   ├── database.py         # DB 연결 관리
│   │   ├── security.py         # 인증/권한
│   │   ├── tenant_resolver.py  # 테넌트 식별
│   │   ├── exceptions.py       # 커스텀 예외
│   │   ├── middleware.py       # 미들웨어
│   │   ├── logging.py          # 로깅 설정
│   │   ├── deps.py             # 공통 의존성
│   │   └── ai_integration.py   # AI 통합
│   │
│   ├── models/                 # SQLModel ORM 모델
│   │   ├── __init__.py
│   │   ├── base.py             # Base 클래스
│   │   ├── manager/            # 관리자 시스템 모델
│   │   │   ├── __init__.py
│   │   │   ├── tnnt/           # 테넌트 관리
│   │   │   │   ├── tenant.py   # 테넌트 모델
│   │   │   │   └── ...
│   │   │   ├── idam/           # 사용자/권한
│   │   │   │   ├── user.py     # 사용자 모델
│   │   │   │   ├── role.py     # 역할 모델
│   │   │   │   ├── user_role.py    # 사용자/역할 모델
│   │   │   │   ├── session.py  # 세션 모델
│   │   │   │   └── ...
│   │   │   ├── bill/           # 청구
│   │   │   └── ...
│   │   └── tenants/            # 테넌트 시스템 모델
│   │       ├── __init__.py
│   │       ├── adm/            # 기준정보
│   │       ├── psm/            # 구매관리
│   │       ├── srm/            # 영업관리
│   │       └── ...
│   │
│   ├── modules/                # 비즈니스 로직 (Co-location)
│   │   ├── manamer/            # 관리자 모듈
│   │   │   ├── auth/           # 인증
│   │   │   │   ├── router.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py
│   │   │   │   └── __init__.py
│   │   │   ├── idam/           # 사용자/권한 관리
│   │   │   │   ├── user/       # 사용자 리소스
│   │   │   │   │   ├── router.py
│   │   │   │   │   ├── schemas.py
│   │   │   │   │   ├── service.py
│   │   │   │   │   ├── model.py
│   │   │   │   │   └── __init__.py
│   │   │   │   ├── role/       # 역할 리소스
│   │   │   │   ├── permission/ # 권한 리소스
│   │   │   │   └── router.py   # IDAM 메인 라우터
│   │   │   └── tnnt/           # 테넌트 관리
│   │   │       └── tenant/
│   │   ├── tenants/            # 테넌트 비즈니스 모듈
│   │   │   ├── adm/            # 기준정보
│   │   │   ├── psm/            # 구매관리
│   │   │   └── ...
│   │   └── shareds/            # 공통 비즈니스 모듈
│   │       ├── schemas/        # 공통 스키마
│   │       │   ├── __init__.py
│   │       │   ├── response.py     # Envelope 응답
│   │       │   └── pagination.py   # 페이징
│   │       └── services/       # 공통 서비스
│   │           ├── __init__.py
│   │           ├── base_service.py
│   │           ├── auth_service.py
│   │           ├── email_service.py
│   │           └── cache_service.py
│   │
│   ├── routers/                # API 라우터 조합
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   ├── manager/
│   │   │   ├── __init__.py
│   │   │   └── v1.py           # 관리자 API v1 라우터
│   │   └── tenants/
│   │       ├── __init__.py
│   │       └── v1.py           # 테넌트 API v1 라우터
│   │
│   ├── ai/                     # AI 관련 코드
│   │   ├── __init__.py
│   │   ├── agents/             # AI 에이전트
│   │   ├── chains/             # LangChain 체인
│   │   ├── embeddings/         # 임베딩
│   │   ├── prompts/            # 프롬프트 템플릿
│   │   └── tools/              # AI 도구
│   │
│   ├── utils/                  # 유틸리티
│   │   ├── __init__.py
│   │   ├── logger.py
│   │   ├── validators.py
│   │   └── helpers.py
│   │
│   └── tests/                  # 테스트
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_manager/
│       └── test_tenant/
│
├── alembic/                    # DB 마이그레이션
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── scripts/                    # 유틸리티 스크립트
│   ├── migrate.sh
│   └── seed_data.sh
│
├── docs/                       # API 문서
│   └── ARCHITECTURE.md
│
├── pyproject.toml              # Python 프로젝트 설정
├── requirements.txt            # Python 의존성
├── requirements-dev.txt        # 개발 의존성
├── .env.example                # 환경 변수 예시
├── Dockerfile                  # Docker 이미지
└── README.md
```

## 프론트엔드 구조 (apps/web-mgmt/, apps/web-tnnt/)

```
apps/web-mgmt/  (또는 web-tnnt/)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 인증 라우트 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (main)/             # 메인 애플리케이션 그룹
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── user/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── loading.tsx         # 로딩 UI
│   │   ├── error.tsx           # 에러 UI
│   │   └── globals.css         # 전역 스타일
│   │
│   ├── features/               # Feature 모듈
│   │   ├── user/
│   │   │   ├── components/     # UI 컴포넌트
│   │   │   │   ├── user-table.tsx
│   │   │   │   ├── user-form.tsx
│   │   │   │   └── user-detail.tsx
│   │   │   ├── hooks/          # 커스텀 훅
│   │   │   │   ├── use-user.ts
│   │   │   │   └── use-user-form.ts
│   │   │   ├── services/       # API 서비스
│   │   │   │   └── user.service.ts
│   │   │   ├── stores/         # 상태 관리 (선택)
│   │   │   │   └── user.store.ts
│   │   │   └── types/          # 타입 정의
│   │   │       └── user.types.ts
│   │   ├── auth/
│   │   └── dashboard/
│   │
│   ├── components/             # 공통 컴포넌트
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── footer.tsx
│   │   └── common/             # 기타 공통
│   │       ├── loading.tsx
│   │       ├── error-message.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/                    # 유틸리티
│   │   ├── api.ts              # API 클라이언트
│   │   ├── auth.ts             # 인증 유틸
│   │   ├── utils.ts            # 기타 유틸
│   │   └── validations.ts      # 검증 함수
│   │
│   ├── hooks/                  # 전역 훅
│   │   ├── use-auth.ts
│   │   └── use-toast.ts
│   │
│   ├── types/                  # 전역 타입
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   │
│   └── styles/                 # 스타일
│       └── globals.css
│
├── public/                     # 정적 파일
│   ├── icons/
│   ├── images/
│   └── manifest.json
│
├── package.json                # Node.js 프로젝트 설정
├── next.config.js              # Next.js 설정
├── tailwind.config.ts          # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
├── components.json             # shadcn/ui 설정
├── .eslintrc.json              # ESLint 설정
├── .prettierrc                 # Prettier 설정
├── .env.example                # 환경 변수 예시
├── Dockerfile                  # Docker 이미지
└── README.md
```

## 공유 패키지 구조 (packages/)

```
packages/
├── shared-types/               # 공유 타입
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── ui-components/              # 공유 UI 컴포넌트
│   ├── src/
│   │   ├── components/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── utils/                      # 공유 유틸리티
    ├── src/
    │   ├── date.ts
    │   ├── format.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## 인프라 구조 (infra/)

```
infra/
├── terraform/                  # Terraform IaC
│   ├── modules/
│   │   ├── vpc/
│   │   ├── eks/
│   │   ├── rds/
│   │   └── s3/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   └── main.tf
│
├── kubernetes/                 # K8s 매니페스트
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── overlays/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   └── kustomization.yaml
│
├── docker/                     # Docker 설정
│   ├── api/
│   │   └── Dockerfile
│   ├── web-mgmt/
│   │   └── Dockerfile
│   └── web-tnnt/
│       └── Dockerfile
│
└── monitoring/                 # 모니터링 설정
    ├── prometheus/
    │   └── prometheus.yml
    ├── grafana/
    │   └── dashboards/
    └── alertmanager/
        └── alertmanager.yml
```

## 디렉토리 역할

### 백엔드 디렉토리

- **core/**: 인프라 레이어 (DB, 인증, 설정)
- **models/**: 데이터 모델 (ORM)
- **modules/**: 비즈니스 로직 (도메인별 Co-location)
- **api/**: API 라우터 조합 레이어
- **schemas/**: 공통 스키마 (응답, 페이징 등)
- **services/**: 상위 레벨 서비스 (외부 연동 등)
- **ai/**: AI/ML 관련 코드
- **utils/**: 유틸리티 함수
- **tests/**: 테스트 코드

### 프론트엔드 디렉토리

- **app/**: Next.js App Router (라우팅)
- **features/**: Feature 모듈 (도메인별)
- **components/**: 공통 컴포넌트
- **lib/**: 유틸리티 (API 클라이언트 등)
- **hooks/**: 전역 커스텀 훅
- **types/**: 전역 타입 정의
- **styles/**: 전역 스타일

### 모듈 구조 규칙

- **Co-location**: 관련 파일을 같은 디렉토리에 배치
- **표준 파일명**: router.py, schemas.py, service.py, model.py
- **단수형 디렉토리**: user/, role/ (복수형 금지)
- **명확한 역할**: 각 파일은 하나의 책임만

## 파일 네이밍 패턴

### 백엔드 (Python)

- **디렉토리**: `snake_case` (예: `user/`, `api_key/`)
- **파일**: `snake_case.py` (예: `router.py`, `user_service.py`)
- **모듈 파일**: `__init__.py` (모든 디렉토리)

### 프론트엔드 (TypeScript)

- **컴포넌트**: `kebab-case.tsx` (예: `user-table.tsx`)
- **훅**: `use-resource.ts` (예: `use-user.ts`)
- **서비스**: `resource.service.ts` (예: `user.service.ts`)
- **스토어**: `resource.store.ts` (예: `user.store.ts`)
- **타입**: `resource.types.ts` (예: `user.types.ts`)

## Import 규칙

### 백엔드

```python
# 표준 라이브러리
import os
from datetime import datetime

# 서드파티
from fastapi import APIRouter
from sqlalchemy.orm import Session

# 로컬 (절대 경로)
from src.core.database import get_db
from src.models.user import User

# 로컬 (상대 경로, 같은 모듈 내)
from .schemas import UserCreate
from .service import UserService
```

### 프론트엔드

```typescript
// React
import { useState } from "react";

// 서드파티
import { useQuery } from "@tanstack/react-query";

// 로컬 (절대 경로)
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// 로컬 (상대 경로, 같은 feature 내)
import { UserTable } from "./components/user-table";
import { useUser } from "./hooks/use-user";
```

## 환경 변수 관리

### 백엔드 (.env)

```bash
# 데이터베이스
DATABASE_URL=postgresql://user:pass@localhost:5432/db
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379

# 보안
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

# AI
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...

# 환경
ENVIRONMENT=development
DEBUG=true
```

### 프론트엔드 (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1

# 환경
NEXT_PUBLIC_ENVIRONMENT=development
```

## 설정 파일 위치

### 루트 레벨

- `pnpm-workspace.yaml`: pnpm 워크스페이스
- `turbo.json`: Turborepo 설정
- `docker-compose.yml`: 로컬 개발 환경

### 백엔드

- `pyproject.toml`: Python 프로젝트 설정
- `alembic.ini`: Alembic 설정

### 프론트엔드

- `package.json`: Node.js 프로젝트
- `next.config.js`: Next.js 설정
- `tailwind.config.ts`: Tailwind CSS
- `tsconfig.json`: TypeScript
- `components.json`: shadcn/ui
