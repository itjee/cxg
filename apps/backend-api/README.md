# CXG Platform Backend API

FastAPI 기반의 AI 업무지원 플랫폼 백엔드 API

## 기술 스택

- **Python**: 3.11+
- **프레임워크**: FastAPI
- **ORM**: SQLAlchemy 2.0 (async)
- **데이터베이스**: PostgreSQL 15+
- **캐시**: Redis 7.0+
- **마이그레이션**: Alembic

## 프로젝트 구조

```
src/
├── main.py              # FastAPI 앱 진입점
├── core/                # 핵심 인프라
│   ├── config.py        # 설정
│   ├── database.py      # DB 연결
│   ├── security.py      # 인증/권한
│   ├── exceptions.py    # 커스텀 예외
│   ├── middleware.py    # 미들웨어
│   ├── deps.py          # 의존성
│   └── logging.py       # 로깅
├── models/              # ORM 모델
│   ├── base.py          # Base 클래스
│   ├── manager/         # 관리자 모델
│   └── tenants/         # 테넌트 모델
├── modules/             # 비즈니스 로직 (Co-location)
│   ├── manager/         # 관리자 모듈
│   └── tenants/         # 테넌트 모듈
├── schemas/             # Pydantic 스키마
│   └── common/          # 공통 스키마
├── services/            # 서비스 레이어
│   ├── manager/         # 관리자 서비스
│   ├── tenants/         # 테넌트 서비스
│   └── shared/          # 공유 서비스
├── ai/                  # AI/ML
│   ├── agents/
│   ├── chains/
│   ├── embeddings/
│   ├── prompts/
│   └── tools/
└── utils/               # 유틸리티
```

## 설치

### 1. 가상환경 생성

```bash
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

### 2. 의존성 설치

```bash
# 기본 설치
uv pip install -e ".[dev]"

# AI 기능 포함
uv pip install -e ".[dev,ai]"
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일 편집
```

### 4. 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE mgmt_db;
CREATE DATABASE tnnt_db;
```

### 5. 마이그레이션 실행

```bash
# 마이그레이션 실행
alembic upgrade head
```

## 실행

### 개발 서버

```bash
# Make 명령어 (권장)
make run

# 직접 실행
uvicorn src.main:app --reload --host 0.0.0.0 --port 8100
```

### 프로덕션

```bash
uvicorn src.main:app --workers 4 --host 0.0.0.0 --port 8100
```

## API 문서

서버 실행 후 다음 URL에서 확인:

- **Swagger UI**: http://localhost:8100/docs
- **ReDoc**: http://localhost:8100/redoc
- **OpenAPI JSON**: http://localhost:8100/openapi.json

## 테스트

```bash
# 모든 테스트 실행
pytest

# 커버리지 포함
pytest --cov=src --cov-report=html

# 특정 테스트
pytest tests/test_user.py
```

## 코드 품질

```bash
# Make 명령어 (권장)
make format      # 포맷팅 + 자동 수정
make lint        # 린팅 체크
make typecheck   # 타입 체크
make check       # 전체 검사

# 직접 명령어
ruff format src/              # 포맷팅
ruff check src/               # 린트
ruff check --fix src/         # 자동 수정
mypy src/                     # 타입 체크
```

상세한 사용법은 [docs/LINTING_SETUP.md](docs/LINTING_SETUP.md)를 참고하세요.

## 마이그레이션

```bash
# 마이그레이션 파일 생성
alembic revision --autogenerate -m "설명"

# 마이그레이션 실행
alembic upgrade head

# 롤백
alembic downgrade -1

# 이력 확인
alembic history
```

## 개발 가이드

### Backend API 문서
- **[빠른 시작](docs/QUICK_START.md)** - 5분 만에 시작하기
- **[린팅 설정](docs/LINTING_SETUP.md)** - Ruff + mypy 사용법
- **[인증 모듈](docs/AUTH_MODULE.md)** - 인증/권한 구현
- **[모델 작성](docs/MODELS.md)** - SQLAlchemy 모델 가이드
- **[변경 이력](docs/CHANGELOG.md)** - 프로젝트 업데이트 내역

### 프로젝트 전체 문서
- [프로젝트 개요](../../docs/01-PROJECT-OVERVIEW.md)
- [아키텍처](../../docs/02-ARCHITECTURE.md)
- [기술 스택](../../docs/03-TECH-STACK.md)
- [프로젝트 구조](../../docs/04-PROJECT-STRUCTURE.md)
- [네이밍 규칙](../../docs/05-NAMING-CONVENTIONS.md)
- [백엔드 가이드](../../docs/06-BACKEND-GUIDE.md)
- [프론트엔드 가이드](../../docs/07-FRONTEND-GUIDE.md)
- [데이터베이스 가이드](../../docs/08-DATABASE-GUIDE.md)
- [API 규격](../../docs/09-API-SPECIFICATION.md)
- [개발 환경 구축](../../docs/10-DEVELOPMENT-SETUP.md)

## 라이선스

Proprietary