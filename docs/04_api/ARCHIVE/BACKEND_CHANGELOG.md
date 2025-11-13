# 변경 이력

## 2025-10-15 - 폴더 구조 재정리

### 변경사항

#### 폴더명 변경
- `modules/mgmt/` → `modules/manager/` (관리자 시스템)
- `modules/tnnt/` → `modules/tenants/` (테넌트 시스템)
- `models/tenant/` → `models/tenants/`
- `services/tenant/` → `services/tenants/`
- `schemas/tenant/` → `schemas/tenants/`

#### 이유
- **일관성**: 단수형/복수형 혼용 방지
- **명확성**: `manager`와 `tenants`로 명확한 구분
- **확장성**: 향후 멀티 테넌트 확장 시 복수형이 더 자연스러움

### API 엔드포인트 변경 (예정)

```
이전:
- /api/v1/mgmt/...
- /api/v1/tnnt/...

변경:
- /api/v1/manager/...
- /api/v1/tenants/...
```

### 영향 받는 파일

- ✅ `src/main.py` - 라우터 주석 업데이트
- ✅ `src/modules/` - 디렉토리 구조 변경
- ✅ `src/models/` - 디렉토리 구조 변경
- ✅ `src/services/` - 디렉토리 구조 변경
- ✅ `src/schemas/` - 디렉토리 구조 변경
- ✅ `README.md` - 문서 업데이트
- ✅ `STRUCTURE.md` - 문서 업데이트

### 다음 작업

- [ ] 인증 모듈 구현 (`modules/manager/auth/`)
- [ ] 사용자 관리 구현 (`modules/manager/idam/`)
- [ ] 기준정보 구현 (`modules/tenants/adm/`)
- [ ] Alembic 마이그레이션 설정
- [ ] API 라우터 통합

## 2025-10-15 - 인증 모듈 구현

### 추가된 기능

#### 인증 모듈 (modules/manager/auth/)
- ✅ **회원가입** - 사용자 등록 기능
- ✅ **로그인** - JWT 토큰 발급
- ✅ **토큰 갱신** - Refresh Token으로 Access Token 재발급
- ✅ **현재 사용자 조회** - 토큰 기반 사용자 정보 조회
- ✅ **비밀번호 변경** - 기존 비밀번호 확인 후 변경
- ✅ **로그아웃** - 토큰 무효화 (클라이언트 측)

#### Co-location 패턴 적용
```
modules/manager/auth/
├── __init__.py      # 모듈 exports
├── router.py        # API 엔드포인트 (6개)
├── schemas.py       # Pydantic 스키마 (9개)
├── service.py       # 비즈니스 로직 (7개 메서드)
└── model.py         # ORM 모델 (User)
```

#### 데이터베이스
- ✅ **스키마**: idam (Identity & Access Management)
- ✅ **테이블**: user
- ✅ **마이그레이션**: 001_init_auth.py

#### 보안
- ✅ bcrypt 비밀번호 해싱
- ✅ JWT 토큰 (Access + Refresh)
- ✅ OAuth2 Bearer 인증

#### 테스트
- ✅ 통합 테스트 (test_auth.py) - 7개 테스트 케이스
- ✅ conftest.py - 테스트 픽스처

#### 문서
- ✅ AUTH_MODULE.md - 인증 모듈 상세 문서

### API 엔드포인트

| 메서드 | 경로 | 설명 | 인증 필요 |
|--------|------|------|----------|
| POST | `/api/v1/manager/auth/register` | 회원가입 | ❌ |
| POST | `/api/v1/manager/auth/login` | 로그인 | ❌ |
| POST | `/api/v1/manager/auth/refresh` | 토큰 갱신 | ✅ |
| GET | `/api/v1/manager/auth/me` | 현재 사용자 조회 | ✅ |
| POST | `/api/v1/manager/auth/change-password` | 비밀번호 변경 | ✅ |
| POST | `/api/v1/manager/auth/logout` | 로그아웃 | ✅ |

### 실행 방법

```bash
# 1. 마이그레이션 실행
alembic upgrade head

# 2. 서버 실행
uvicorn src.main:app --reload --port 8000

# 3. API 문서 확인
# http://localhost:8000/docs

# 4. 테스트 실행
pytest tests/integration/test_auth.py -v
```

### 다음 작업

- [ ] 사용자 관리 모듈 (IDAM - User CRUD)
- [ ] 역할 관리 모듈 (IDAM - Role)
- [ ] 권한 관리 모듈 (IDAM - Permission)
- [ ] 기준정보 모듈 (Tenants - ADM)

## 2025-10-15 - Backend API 구조 재정리

### 주요 변경사항

#### 1. 모델 구조 재정리 (테이블 단위)

**이전:** 스키마별 단일 파일
```
models/manager/idam.py (8개 모델)
models/manager/tnnt.py (5개 모델)
```

**변경:** 테이블 단위로 파일 분리
```
models/manager/idam/
  ├── user.py
  ├── role.py
  ├── permission.py
  ├── role_permission.py
  ├── user_role.py
  ├── api_key.py
  ├── session.py
  └── login_log.py

models/manager/tnnt/
  ├── tenant.py
  └── subscription.py
```

#### 2. Modules 구조 정리

- ✅ 오타 수정: `manamer` → `manager`
- ✅ 공통 모듈: `shareds/` 추가
  - `shareds/schemas/` - EnvelopeResponse, PaginationParams
  - `shareds/services/` - 공통 서비스

#### 3. Routers 레이어 추가

새로운 API 라우터 조합 레이어 추가:
```
routers/
├── manager/v1.py          # 관리자 API v1
└── tenants/v1.py          # 테넌트 API v1
```

#### 4. Import 경로 업데이트

- `schemas.common` → `modules.shareds.schemas`
- `modules.manager` → `routers.manager.v1`

### 생성된 파일 (26개)

**모델 파일 (10개):**
- `models/manager/idam/user.py`
- `models/manager/idam/role.py`
- `models/manager/idam/permission.py`
- `models/manager/idam/role_permission.py`
- `models/manager/idam/user_role.py`
- `models/manager/idam/api_key.py`
- `models/manager/idam/session.py`
- `models/manager/idam/login_log.py`
- `models/manager/tnnt/tenant.py`
- `models/manager/tnnt/subscription.py`

**Routers (4개):**
- `routers/__init__.py`
- `routers/manager/__init__.py`
- `routers/manager/v1.py`
- `routers/tenants/v1.py`

**Shareds (3개):**
- `modules/shareds/schemas/__init__.py`
- `modules/shareds/schemas/response.py`
- `modules/shareds/services/__init__.py`

**문서 (2개):**
- `NEW_STRUCTURE.md` - 새 구조 설명
- `CLEANUP_NEEDED.md` - 정리 필요 목록

### 삭제 대기 중인 파일/폴더

**주의: 사용자가 직접 삭제해야 함**

```bash
# 이전 구조 (비어있음)
src/api/
src/schemas/
src/services/

# 구버전 단일 파일
src/models/manager/idam.py
src/models/manager/tnnt.py
```

삭제 방법: `CLEANUP_NEEDED.md` 참고

### 지침 준수

✅ 04-PROJECT-STRUCTURE.md 완전 준수
- 테이블 단위 모델 파일 분리
- Co-location 패턴 유지
- Routers 레이어 추가
- 오타 수정 (manamer → manager)

### 다음 작업

1. ⏭️ 불필요한 파일 삭제 (사용자 확인 필요)
2. ⏭️ IDAM 모듈 확장 (user, role, permission CRUD)
3. ⏭️ Tenants 모듈 구현
4. ⏭️ 테스트 업데이트

## 2025-10-15 - 최종 구조 정리 (권장 구조 적용)

### 🎯 FastAPI 트렌드 적용

**결정:** src/ 직접 구조 (api/ 폴더 제거)

**이유:**
- FastAPI 현재 트렌드 (2023-2025)
- 대부분의 프로덕션 프로젝트가 사용
- 모노레포에서 apps/backend-api/ 자체가 앱 경계
- Import 경로 간결화

### 제거된 폴더/파일

```bash
✅ src/api/                      # 불필요한 중첩
✅ src/schemas/                  # shareds/schemas로 통합
✅ src/services/                 # shareds/services로 통합
✅ src/models/manager/idam.py    # 테이블 단위로 분리
✅ src/models/manager/tnnt.py    # 테이블 단위로 분리
```

### 최종 구조

```
src/
├── main.py                      ✅
├── core/                        ✅ 8개 파일
├── models/                      ✅ 테이블 단위 (10개 모델)
│   ├── manager/idam/           ✅ 8개 모델
│   └── manager/tnnt/           ✅ 2개 모델
├── modules/                     ✅ Co-location
│   ├── manager/auth/           ✅ 5개 파일
│   ├── tenants/
│   └── shareds/                ✅ 공통 모듈
│       ├── schemas/
│       └── services/
├── routers/                     ✅ API 조합
│   ├── manager/v1.py
│   └── tenants/v1.py
├── ai/                          ✅
└── utils/                       ✅
```

### 통계

- **제거된 폴더**: 3개 (api, schemas, services)
- **제거된 파일**: 2개 (idam.py, tnnt.py)
- **생성된 모델 파일**: 10개 (테이블 단위)
- **생성된 __init__.py**: 15개
- **최종 Python 파일**: 35개
- **최종 디렉토리**: 39개

### 검증

✅ FastAPI 트렌드 준수
✅ 04-PROJECT-STRUCTURE.md 지침 준수
✅ Import 경로 간결화
✅ Co-location 패턴 유지
✅ 명확한 레이어 분리

### 문서

- ✅ `FINAL_STRUCTURE.md` 생성
- ✅ `CLEANUP_NEEDED.md` 완료 (삭제 불필요)
- ✅ `NEW_STRUCTURE.md` 업데이트

### 다음 단계

1. ⏭️ IDAM 모듈 확장 (user, role, permission CRUD)
2. ⏭️ Tenants 모듈 구현 (ADM, PSM, SRM)
3. ⏭️ 추가 마이그레이션 파일 생성
4. ⏭️ 테스트 코드 작성

## 2025-10-15 - 모든 Manager 모델 자동 생성

### 🎯 SQL 스키마 기반 모델 자동 생성

packages/database/schemas의 SQL 스키마를 분석하여 SQLAlchemy ORM 모델을 자동 생성했습니다.

### 생성된 모델 (42개)

#### Manager 시스템 (13개 스키마)

| 스키마 | 모델 수 | 테이블 |
|--------|---------|--------|
| idam | 8 | users, roles, permissions, role_permissions, user_roles, api_keys, sessions, login_logs |
| tnnt | 2 | tenants, subscriptions |
| audt | 3 | audit_logs, compliances, policies |
| auto | 3 | workflows, executions, tasks |
| bill | 3 | plans, invoices, transactions |
| bkup | 3 | executions, schedules, recovery_plans |
| cnfg | 4 | configurations, feature_flags, tenant_features, service_quotas |
| ifra | 2 | resources, resource_usages |
| intg | 3 | apis, webhooks, rate_limits |
| mntr | 3 | health_checks, incidents, system_metrics |
| noti | 3 | notifications, templates, campaigns |
| stat | 2 | tenant_stats, usage_stats |
| supt | 3 | tickets, ticket_comments, feedbacks |

**총 42개 모델 생성**

### 디렉토리 구조

```
src/models/manager/
├── idam/           # 8개 모델
├── tnnt/           # 2개 모델
├── audt/           # 3개 모델
├── auto/           # 3개 모델
├── bill/           # 3개 모델
├── bkup/           # 3개 모델
├── cnfg/           # 4개 모델
├── ifra/           # 2개 모델
├── intg/           # 3개 모델
├── mntr/           # 3개 모델
├── noti/           # 3개 모델
├── stat/           # 2개 모델
└── supt/           # 3개 모델
```

### 자동 생성 스크립트

- `generate_models_v2.py` - SQL 파싱 및 모델 생성
- 각 스키마별 __init__.py 자동 생성
- models/manager/__init__.py 통합

### Tenants 시스템

현재 SQL 스키마 파일이 비어있어 향후 작성 예정:
- adm, psm, srm, ivm, lwm, csm, asm, fim, bim, com, sys

### 문서

- ✅ `MODELS_COMPLETE.md` 생성

### 다음 작업

1. ⏭️ Tenants SQL 스키마 작성
2. ⏭️ Tenants 모델 생성
3. ⏭️ Relationship 설정
4. ⏭️ 마이그레이션 생성

## 2025-10-15 - Ruff + mypy 코드 품질 도구 적용

### 🎯 최신 트렌드 적용: Ruff + mypy 조합

**도구 변경:**
- ✅ Ruff 추가: 린팅 + 포매팅 + import 정렬 (올인원)
- ✅ mypy 유지: 타입 체크
- ❌ Black 제거: Ruff로 대체
- ❌ Flake8 제거: Ruff가 포함
- ❌ isort 제거: Ruff가 포함

### 생성된 파일 및 설정

#### 1. 설정 파일
- ✅ `pyproject.toml` - Ruff + mypy 설정 업데이트
- ✅ `.pre-commit-config.yaml` - Pre-commit hooks
- ✅ `.gitignore` - 캐시 디렉토리 추가

#### 2. Scripts (scripts/)
- ✅ `lint.sh` - Ruff 린팅
- ✅ `format.sh` - Ruff 포매팅 + 자동 수정
- ✅ `typecheck.sh` - mypy 타입 체크
- ✅ `check.sh` - 전체 검사 (CI/CD용)

#### 3. Make 명령어
- ✅ `Makefile` - 편리한 명령어 모음
  - `make lint` - 린팅
  - `make format` - 포매팅
  - `make typecheck` - 타입 체크
  - `make check` - 전체 검사

#### 4. VS Code 설정 (.vscode/)
- ✅ `settings.json` - Ruff 자동 포매팅
- ✅ `extensions.json` - 권장 익스텐션

#### 5. CI/CD
- ✅ `.github/workflows/ci.yml` - GitHub Actions

#### 6. 문서
- ✅ `LINTING_SETUP.md` - 완전한 사용 가이드

### Ruff 설정 (pyproject.toml)

```toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E", "W",    # pycodestyle
    "F",         # pyflakes
    "I",         # isort
    "B",         # bugbear
    "C4",        # comprehensions
    "UP",        # pyupgrade
    "ARG",       # unused-arguments
    "SIM",       # simplify
    "TCH",       # type-checking
    "N",         # naming
    "ASYNC",     # async
]
```

### 사용법

```bash
# 개발 의존성 설치
make dev

# 포매팅 (권장)
make format

# 린팅
make lint

# 타입 체크
make typecheck

# 전체 검사 (CI/CD)
make check

# Pre-commit 설치
pip install pre-commit
pre-commit install
```

### 장점

1. **속도**: Ruff는 기존 도구보다 10-100배 빠름
2. **단순성**: 5개 도구 → 2개 도구
3. **표준**: FastAPI, Pandas 등 주요 프로젝트 채택
4. **자동화**: pre-commit, CI/CD 통합

### 다음 단계

1. ⏭️ 팀원들 VS Code 익스텐션 설치
2. ⏭️ Pre-commit hooks 적용
3. ⏭️ CI/CD 파이프라인 테스트
