# CXG Platform API Documentation

## Overview

CXG Platform은 중소기업(50인 미만)을 위한 AI 기반 업무지원 플랫폼입니다.
멀티테넌트 SaaS 구조로 관리자 시스템과 테넌트 시스템으로 구성되어 있습니다.

## Architecture

### Dual Database Design

- **Manager Database** (`mgmt_db`): 서비스 제공자용 관리 시스템
- **Tenant Database** (`tnnt_db`): 테넌트(고객사)용 업무 시스템

### Technology Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0+
- **Database**: PostgreSQL 15+ (asyncpg)
- **Cache**: Redis 7.0+
- **Auth**: JWT (python-jose)

## API Endpoints

### Base URL

- Development: `http://localhost:8100`
- API Version: `/api/v1`

### Authentication

대부분의 API는 Bearer 토큰 인증이 필요합니다.

```bash
# 1. 로그인
POST /api/v1/manager/auth/login
{
  "username": "admin",
  "password": "password"
}

# 2. 응답에서 access_token 획득
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  }
}

# 3. 이후 요청에 헤더 추가
Authorization: Bearer eyJ...
```

## Manager System APIs

### 1. Authentication (인증)
- `POST /api/v1/manager/auth/register` - 회원가입
- `POST /api/v1/manager/auth/login` - 로그인
- `POST /api/v1/manager/auth/refresh` - 토큰 갱신
- `GET /api/v1/manager/auth/me` - 현재 사용자 정보
- `POST /api/v1/manager/auth/change-password` - 비밀번호 변경
- `POST /api/v1/manager/auth/logout` - 로그아웃

### 2. IDAM (Identity & Access Management)

#### Users (사용자)
- `POST /api/v1/manager/idam/users` - 사용자 생성
- `GET /api/v1/manager/idam/users` - 사용자 목록 조회
- `GET /api/v1/manager/idam/users/{user_id}` - 사용자 상세 조회
- `PATCH /api/v1/manager/idam/users/{user_id}` - 사용자 수정
- `DELETE /api/v1/manager/idam/users/{user_id}` - 사용자 삭제

#### Roles (역할)
- `POST /api/v1/manager/idam/roles` - 역할 생성
- `GET /api/v1/manager/idam/roles` - 역할 목록 조회
- `GET /api/v1/manager/idam/roles/{role_id}` - 역할 상세 조회
- `PATCH /api/v1/manager/idam/roles/{role_id}` - 역할 수정
- `DELETE /api/v1/manager/idam/roles/{role_id}` - 역할 삭제

#### Permissions (권한)
- CRUD operations for permissions

#### User Roles, Role Permissions, Sessions, Login Logs, API Keys
- Full CRUD operations available

### 3. TNNT (Tenant Management)

#### Tenants (테넌트)
- `POST /api/v1/manager/tenants` - 테넌트 생성
- `GET /api/v1/manager/tenants` - 테넌트 목록 조회
- `GET /api/v1/manager/tenants/{tenant_id}` - 테넌트 상세 조회
- `PATCH /api/v1/manager/tenants/{tenant_id}` - 테넌트 수정
- `DELETE /api/v1/manager/tenants/{tenant_id}` - 테넌트 삭제

#### Subscriptions (구독)
- Full CRUD for subscription management

### 4. BILL (Billing)

- **Plans** - 요금제 관리
- **Invoices** - 청구서 관리
- **Transactions** - 거래 내역 관리

### 5. IFRA (Infrastructure)

- **Resources** - 리소스 관리
- **Resource Usages** - 리소스 사용량 추적

### 6. MNTR (Monitoring)

- **System Metrics** - 시스템 메트릭
- **Health Checks** - 헬스 체크
- **Incidents** - 인시던트 관리

### 7. AUDT (Audit)

- **Audit Logs** - 감사 로그
- **Policies** - 감사 정책
- **Compliances** - 컴플라이언스

### 8. BKUP (Backup)

- **Schedules** - 백업 스케줄
- **Executions** - 백업 실행
- **Recovery Plans** - 복구 계획

### 9. CNFG (Configuration)

- **Configurations** - 시스템 설정
- **Feature Flags** - 기능 플래그
- **Tenant Features** - 테넌트별 기능
- **Service Quotas** - 서비스 할당량

### 10. INTG (Integration)

- **APIs** - 외부 API 통합
- **Webhooks** - 웹훅 관리
- **Rate Limits** - API 제한

### 11. NOTI (Notification)

- **Notifications** - 알림
- **Templates** - 알림 템플릿
- **Campaigns** - 알림 캠페인

### 12. SUPT (Support)

- **Tickets** - 지원 티켓
- **Ticket Comments** - 티켓 댓글
- **Feedbacks** - 피드백

### 13. STAT (Statistics)

- **Usage Stats** - 사용 통계
- **Tenant Stats** - 테넌트 통계

### 14. AUTO (Automation)

- **Workflows** - 워크플로우
- **Tasks** - 작업
- **Executions** - 실행 내역

## Tenant System APIs

### 1. ADM (Administration)

#### Users (사용자)
- `POST /api/v1/tenants/adm/users` - 테넌트 사용자 생성
- `GET /api/v1/tenants/adm/users` - 사용자 목록 조회
- `GET /api/v1/tenants/adm/users/{user_id}` - 사용자 상세 조회
- `PATCH /api/v1/tenants/adm/users/{user_id}` - 사용자 수정
- `DELETE /api/v1/tenants/adm/users/{user_id}` - 사용자 삭제

### 2. CRM (Customer Relationship Management)

#### Customers (고객)
- `GET /api/v1/tenants/crm/customers` - 고객 목록
- `POST /api/v1/tenants/crm/customers` - 고객 생성
- `GET /api/v1/tenants/crm/customers/{customer_id}` - 고객 조회
- `PATCH /api/v1/tenants/crm/customers/{customer_id}` - 고객 수정
- `DELETE /api/v1/tenants/crm/customers/{customer_id}` - 고객 삭제

#### Contacts (연락처)
- Full CRUD for contact management

#### Opportunities (영업기회)
- Sales opportunity tracking and management

#### Activities (활동)
- Customer activity logging and tracking

### 3. FIM (Finance/Accounting)

#### Accounts (계정)
- Chart of accounts management

#### Transactions (거래)
- Financial transaction recording

#### Budgets (예산)
- Budget planning and tracking

#### Invoices (송장)
- Invoice generation and management

### 4. IVM (Inventory Management)

#### Products (제품)
- Product catalog management

#### Warehouses (창고)
- Warehouse management

#### Stock Movements (재고이동)
- Inventory movement tracking

#### Adjustments (재고조정)
- Stock adjustment management

### 5. PSM (Procurement/Purchasing)

#### Purchase Orders (구매주문)
- Purchase order management

#### Vendors (공급업체)
- Vendor management

#### Requisitions (구매요청)
- Purchase requisition workflow

#### Receiving (입고)
- Goods receiving management

### 6. SRM (Sales/Revenue Management)

#### Sales Orders (판매주문)
- Sales order processing

#### Quotes (견적)
- Quote generation and management

#### Customers (고객)
- Sales customer management

#### Sales Activities (판매활동)
- Sales activity tracking

### 7. LWM (Workflow Management)

#### Workflows (워크플로우)
- Workflow definition and management

#### Approvals (승인)
- Approval process management

#### Tasks (작업)
- Task management

#### Steps (단계)
- Workflow step configuration

## Response Format

모든 API 응답은 표준 Envelope 형식을 사용합니다:

### Success Response
```json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "message": null,
  "code": null,
  "timestamp": "2025-10-15T13:05:59.826Z",
  "request_id": "uuid"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "오류 메시지",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-15T13:05:59.826Z",
  "request_id": "uuid",
  "detail": {
    // 추가 오류 정보
  }
}
```

## Pagination

목록 조회 API는 페이지네이션을 지원합니다:

### Query Parameters
- `page`: 페이지 번호 (기본값: 1)
- `page_size`: 페이지 크기 (기본값: 20, 최대: 100)

### Response
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | 입력 데이터 검증 실패 |
| `UNAUTHORIZED` | 인증 실패 |
| `FORBIDDEN` | 권한 없음 |
| `NOT_FOUND` | 리소스를 찾을 수 없음 |
| `CONFLICT` | 데이터 충돌 |
| `INTERNAL_ERROR` | 서버 내부 오류 |
| `NOT_IMPLEMENTED` | 구현되지 않은 기능 |

## Rate Limiting

API 요청 제한:
- 인증된 사용자: 1000 requests/hour
- 미인증 사용자: 100 requests/hour

## Swagger Documentation

Swagger UI를 통해 인터랙티브한 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8100/docs
- **ReDoc**: http://localhost:8100/redoc
- **OpenAPI JSON**: http://localhost:8100/openapi.json

## Development Setup

### Requirements
- Python 3.11+
- PostgreSQL 15+
- Redis 7.0+

### Installation

```bash
# Virtual environment
cd apps/backend-api
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install -e ".[dev]"

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Run development server
uvicorn src.main:app --reload --port 8100
```

### Database Setup

```bash
# Create databases
createdb mgmt_db
createdb tnnt_db

# Run migrations (if using Alembic)
alembic upgrade head
```

## Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov

# Specific test file
pytest tests/test_auth.py
```

## Code Quality

```bash
# Format code
black .

# Lint
ruff check .

# Type check
mypy src/
```

## Module Count Summary

- **Manager Modules**: 43 routers across 14 domains
- **Tenant Modules**: 25 routers across 7 domains
- **Total API Endpoints**: 68+ routers with full CRUD operations

## Implementation Status

### Fully Implemented
- ✅ Authentication (Auth)
- ✅ User Management (IDAM - Users)
- ✅ Tenant Management (TNNT - Tenants, Subscriptions)
- ✅ Billing (BILL - Plans, Invoices, Transactions)
- ✅ All other Manager modules (router structure)

### Partially Implemented
- ⚠️ Tenant ADM Users (router + schema + service structure)
- ⚠️ All other Tenant modules (router structure only)

### Next Steps
1. Complete database models for all modules
2. Implement service layer logic
3. Add comprehensive validation
4. Implement unit and integration tests
5. Add AI/ML features
6. Implement caching strategies
7. Add monitoring and logging
8. Performance optimization

## Contact

For questions or support, contact the development team.
