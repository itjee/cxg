# CXG Platform API - Quick Start Guide

## 🚀 서버 실행

```bash
# 1. 백엔드 디렉토리로 이동
cd apps/backend-api

# 2. 가상환경 활성화 (이미 설정된 경우)
source .venv/bin/activate  # Linux/Mac
# 또는
.venv\Scripts\activate     # Windows

# 3. 의존성 설치 (처음 실행시)
uv pip install -e ".[dev]"

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 설정 등을 수정

# 5. 서버 실행
uvicorn src.main:app --reload --port 8100
```

## 📚 API 문서 접근

서버 실행 후 브라우저에서:

- **Swagger UI**: http://localhost:8100/docs
- **ReDoc**: http://localhost:8100/redoc
- **OpenAPI JSON**: http://localhost:8100/openapi.json

## 🔐 인증 테스트

### 1. 회원가입 (선택사항)
```bash
curl -X POST http://localhost:8100/api/v1/manager/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### 2. 로그인
```bash
curl -X POST http://localhost:8100/api/v1/manager/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

응답:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

### 3. 인증된 요청
```bash
# access_token을 환경 변수로 저장
export TOKEN="eyJ..."

# 현재 사용자 정보 조회
curl -X GET http://localhost:8100/api/v1/manager/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 주요 API 엔드포인트

### Manager System

#### 테넌트 관리
```bash
# 테넌트 목록
GET /api/v1/manager/tenants?page=1&page_size=20

# 테넌트 생성
POST /api/v1/manager/tenants
{
  "name": "Company A",
  "domain": "company-a",
  "status": "ACTIVE"
}

# 테넌트 조회
GET /api/v1/manager/tenants/{tenant_id}
```

#### 사용자 관리
```bash
# 사용자 목록
GET /api/v1/manager/idam/users?page=1

# 사용자 생성
POST /api/v1/manager/idam/users
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "New User"
}
```

### Tenant System

#### 고객 관리 (CRM)
```bash
# 고객 목록
GET /api/v1/tenants/crm/customers

# 고객 생성
POST /api/v1/tenants/crm/customers
{
  "name": "Customer A",
  "email": "customer@example.com",
  "phone": "010-1234-5678"
}
```

#### 재고 관리 (Inventory)
```bash
# 제품 목록
GET /api/v1/tenants/inventory/products

# 제품 생성
POST /api/v1/tenants/inventory/products
{
  "name": "Product A",
  "sku": "PROD-001",
  "price": 10000
}
```

## 🧪 Swagger UI에서 테스트

1. **http://localhost:8100/docs** 접속
2. 우측 상단 **Authorize** 버튼 클릭
3. Bearer Token 입력: `eyJ...` (로그인으로 받은 access_token)
4. **Authorize** 클릭
5. 원하는 API 엔드포인트 선택
6. **Try it out** 클릭
7. 파라미터 입력
8. **Execute** 클릭

## 📁 프로젝트 구조

```
apps/backend-api/
├── src/
│   ├── main.py                    # FastAPI 앱
│   ├── core/                      # 핵심 설정
│   │   ├── config.py              # 환경 설정
│   │   ├── database.py            # DB 연결
│   │   └── security.py            # 인증/보안
│   ├── models/                    # SQLAlchemy 모델
│   │   ├── manager/               # Manager DB 모델
│   │   └── tenants/               # Tenant DB 모델
│   ├── modules/                   # 비즈니스 로직
│   │   ├── manager/               # Manager 모듈
│   │   │   ├── auth/
│   │   │   ├── idam/
│   │   │   ├── tnnt/
│   │   │   └── ...
│   │   ├── tenants/               # Tenant 모듈
│   │   │   ├── adm/
│   │   │   ├── csm/
│   │   │   ├── fim/
│   │   │   └── ...
│   │   └── shareds/               # 공유 유틸리티
│   └── routers/                   # API 라우터
│       ├── manager/
│       │   └── v1.py              # Manager API v1
│       └── tenants/
│           └── v1.py              # Tenant API v1
├── tests/                         # 테스트
├── alembic/                       # DB 마이그레이션
├── pyproject.toml                 # 프로젝트 설정
└── .env                           # 환경 변수
```

## 🔍 유용한 명령어

### 코드 품질
```bash
# 코드 포맷팅
black .

# 린팅
ruff check .

# 자동 수정
ruff check --fix .

# 타입 체크
mypy src/
```

### 테스트
```bash
# 모든 테스트 실행
pytest

# 커버리지 포함
pytest --cov

# 특정 파일
pytest tests/test_auth.py

# Verbose 모드
pytest -v
```

### 데이터베이스
```bash
# 마이그레이션 생성
alembic revision --autogenerate -m "Add new table"

# 마이그레이션 적용
alembic upgrade head

# 롤백
alembic downgrade -1
```

## 🐛 문제 해결

### 서버가 시작되지 않음
1. 가상환경이 활성화되었는지 확인
2. 의존성이 설치되었는지 확인: `uv pip install -e ".[dev]"`
3. 환경 변수가 설정되었는지 확인: `.env` 파일 확인

### 데이터베이스 연결 오류
1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 DATABASE_URL 확인
3. 데이터베이스가 생성되었는지 확인

### 인증 오류
1. 토큰이 만료되었는지 확인 (기본 15분)
2. Bearer 토큰 형식 확인: `Authorization: Bearer {token}`
3. 로그인하여 새 토큰 발급

## 📖 추가 문서

- **API_DOCUMENTATION.md** - 전체 API 문서
- **IMPLEMENTATION_REPORT.md** - 구현 상세 내역
- **API_STRUCTURE.txt** - API 구조 다이어그램
- **CLAUDE.md** - 프로젝트 개요 및 가이드

## 💡 팁

1. **Swagger UI 활용**: API 문서를 보면서 바로 테스트 가능
2. **페이지네이션**: 목록 API는 `page`와 `page_size` 파라미터 지원
3. **필터링**: 대부분의 목록 API는 `search` 파라미터로 검색 가능
4. **에러 처리**: 모든 응답은 `success` 필드로 성공/실패 확인 가능
5. **Request ID**: 모든 응답에 `request_id` 포함 (디버깅용)

## 🎯 다음 단계

1. 데이터베이스 모델 완성
2. 서비스 로직 구현
3. 테스트 작성
4. 프론트엔드 연동
5. 배포 설정

---

**CXG Platform Backend API**  
Version: 1.0.0  
Last Updated: 2025-10-15
