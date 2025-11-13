# 기술 스택

## 백엔드

### 핵심 기술

- **언어**: Python 3.11+
- **프레임워크**: FastAPI
- **ORM**: SQLModel (Pydantic + SQLAlchemy 통합)
- **비동기**: AsyncIO, uvicorn

### 데이터베이스

- **주 데이터베이스**: PostgreSQL 15+
  - 멀티테넌시 지원
  - Row Level Security
  - JSONB 타입 활용
- **캐시**: Redis 7.0+
  - 클러스터 모드
  - 세션 저장
  - API 캐싱
- **벡터 DB**: Pinecone / Weaviate
  - 문서 임베딩 저장
  - 시맨틱 검색

### 메시지 큐

- **Primary**: Redis Stream
- **Alternative**: RabbitMQ
- **용도**: 비동기 작업, 이벤트 처리

### AI/ML

- **LLM**: OpenAI GPT-4, Anthropic Claude
- **프레임워크**: LangChain, LangGraph
- **임베딩**: OpenAI Embeddings
- **벡터 검색**: Pinecone

### 검색

- **엔진**: OpenSearch / Elasticsearch
- **용도**: 전문 검색, 로그 분석

## 프론트엔드

### 핵심 기술

- **메타프레임워크**: Next.js 14+ (App Router)
- **UI 라이브러리**: React 18+
- **언어**: TypeScript 5.0+ (Strict 모드)

### 상태 관리

- **로컬 상태**: Zustand
- **서버 상태**: TanStack Query (React Query)
- **폼 관리**: React Hook Form

### 스타일링

- **CSS 프레임워크**: Tailwind CSS
- **컴포넌트 라이브러리**: shadcn/ui
- **아이콘**: Lucide React

### 빌드 도구

- **번들러**: Turbopack (Next.js 내장)
- **패키지 매니저**: pnpm
- **모노레포**: Turborepo

## 인프라 & DevOps

### 컨테이너

- **컨테이너화**: Docker
- **오케스트레이션**: Docker Compose (개발), Kubernetes (프로덕션)

### 클라우드

- **Provider**: AWS
- **컴퓨팅**: ECS Fargate → EKS
- **스토리지**: S3
- **CDN**: CloudFront
- **데이터베이스**: RDS PostgreSQL
- **캐시**: ElastiCache Redis

### 모니터링

- **메트릭**: Prometheus + Grafana
- **추적**: OpenTelemetry + Jaeger
- **로깅**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: Sentry
- **알림**: Prometheus Alertmanager

### CI/CD

- **CI**: GitHub Actions
- **CD**: ArgoCD (GitOps)
- **컨테이너 레지스트리**: AWS ECR

## 개발 도구

### 패키지 관리

- **Python**: uv (또는 Poetry)
- **Node.js**: pnpm

### 코드 품질

- **Python**:
  - Linter: Ruff
  - Formatter: Black
  - Type Checker: Pyright
- **TypeScript**:
  - Linter: ESLint
  - Formatter: Prettier

### 테스트

- **Python**: pytest, pytest-cov, pytest-asyncio
- **TypeScript**: Jest, React Testing Library
- **E2E**: Playwright

### 버전 관리

- **VCS**: Git
- **Repository**: GitHub
- **브랜칭 전략**: Git Flow

### 데이터베이스 마이그레이션

- **도구**: Alembic
- **전략**: Expand-Migrate-Contract 패턴

## 보안

### 인증/권한

- **프로토콜**: OAuth2
- **토큰**: JWT (JSON Web Token)
- **비밀번호**: bcrypt 해싱
- **라이브러리**: python-jose, passlib

### 보안 스캔

- **의존성 취약점**: Snyk
- **컨테이너 스캔**: Trivy
- **코드 분석**: SonarQube

### 비밀 관리

- **Production**: AWS Secrets Manager
- **Development**: .env 파일 (git ignore)

## 외부 서비스

### 결제

- **Provider**: TBD (Stripe, Toss Payments 등)

### 이메일

- **Provider**: AWS SES

### SMS

- **Provider**: TBD (AWS SNS, Twilio 등)

### 파일 스토리지

- **Provider**: AWS S3

### CDN

- **Provider**: AWS CloudFront

## 개발 환경

### 로컬 개발

- **OS**: WSL2 (Windows), macOS, Linux
- **IDE**: VS Code, PyCharm
- **데이터베이스**: PostgreSQL (Docker)
- **캐시**: Redis (Docker)

### VS Code 확장

- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Ruff (charliermarsh.ruff)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- Docker (ms-azuretools.vscode-docker)

## 라이브러리 버전

### Python (pyproject.toml)

```toml
[project.dependencies]
fastapi = ">=0.109.0"
uvicorn = {extras = ["standard"], version = ">=0.27.0"}
sqlmodel = ">=0.0.14"
pydantic = ">=2.5.0"
pydantic-settings = ">=2.1.0"
alembic = ">=1.13.0"
asyncpg = ">=0.29.0"
redis = ">=5.0.0"
python-jose = {extras = ["cryptography"], version = ">=3.3.0"}
passlib = {extras = ["bcrypt"], version = ">=1.7.4"}
python-multipart = ">=0.0.6"
httpx = ">=0.26.0"
openai = ">=1.10.0"
langchain = ">=0.1.0"
pinecone-client = ">=3.0.0"

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.23.0",
    "pytest-cov>=4.1.0",
    "ruff>=0.1.0",
    "black>=23.12.0",
    "pyright>=1.1.0",
]
```

### Node.js (package.json)

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.5",
    "tailwindcss": "^3.4.1",
    "lucide-react": "^0.312.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.2.4",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@playwright/test": "^1.41.0"
  }
}
```

## 성능 목표

### API 응답 시간

- **평균**: < 200ms
- **P95**: < 500ms
- **P99**: < 1000ms

### 페이지 로드 시간

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.5s

### 동시 사용자

- **목표**: 10,000 동시 사용자
- **API RPS**: 10,000 requests/sec

### 가용성

- **목표**: 99.9% (월 43분 다운타임)
