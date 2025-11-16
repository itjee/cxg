# GraphQL 엔드포인트 시스템별 분리 가이드

## 개요

이전의 통합된 `/graphql` 엔드포인트를 시스템별로 분리하여 Manager와 Tenants의 GraphQL 스키마를 독립적으로 관리합니다.

## 엔드포인트 구조

### Manager 시스템
- **엔드포인트**: `POST /graphql/manager`
- **스키마**: `src/graphql/manager/root_schema.py`
- **포함 항목**:
  - 인증 (Auth)
  - Dashboard
  - IDAM (Identity & Access Management)
    - Users, Roles, Permissions, Role-Permissions, User-Roles
  - Tenant Management

### Tenants 시스템
- **엔드포인트**: `POST /graphql/tenants`
- **스키마**: `src/graphql/tenants/root_schema.py`
- **포함 항목**:
  - System (SYS)
    - Users
  - CRM (Customer Relationship Management)
  - HRM (Human Resource Management)

## 파일 구조

```
src/graphql/
├── manager/
│   ├── schema.py              # Manager Query/Mutation 클래스
│   ├── root_schema.py         # Manager 루트 스키마 (NEW)
│   ├── auth/
│   ├── idam/
│   ├── dashboard/
│   └── ...
├── tenants/
│   ├── schema.py              # Tenants Query/Mutation 클래스
│   ├── root_schema.py         # Tenants 루트 스키마 (NEW)
│   ├── sys/
│   └── ...
├── common/                    # 공유 타입/resolver
├── schema.py                  # DEPRECATED - 레거시용만 유지
└── loaders.py
```

## 백엔드 변경사항

### 1. 새로운 루트 스키마 파일 생성

#### Manager (`src/graphql/manager/root_schema.py`)
```python
from .schema import ManagerMutation, ManagerQuery
from .auth.queries import ManagerAuthQueries
from .auth.mutations import ManagerAuthMutations

@strawberry.type
class Query:
    # System Info, Auth, Dashboard, IDAM 등 모든 Query 포함
    pass

@strawberry.type
class Mutation:
    # Auth, IDAM 등 모든 Mutation 포함
    pass

manager_schema = strawberry.Schema(query=Query, mutation=Mutation)
```

#### Tenants (`src/graphql/tenants/root_schema.py`)
```python
from .schema import TenantsMutation, TenantsQuery

@strawberry.type
class Query:
    # System Info, SYS Users 등 모든 Query 포함
    pass

@strawberry.type
class Mutation:
    # SYS Users 등 모든 Mutation 포함
    pass

tenants_schema = strawberry.Schema(query=Query, mutation=Mutation)
```

### 2. Main.py 업데이트

```python
from src.graphql.manager.root_schema import manager_schema
from src.graphql.tenants.root_schema import tenants_schema

# Manager GraphQL
manager_graphql_app = GraphQLRouter(
    manager_schema,
    context_getter=get_context,
)
app.include_router(manager_graphql_app, prefix="/graphql/manager", tags=["GraphQL Manager"])

# Tenants GraphQL
tenants_graphql_app = GraphQLRouter(
    tenants_schema,
    context_getter=get_context,
)
app.include_router(tenants_graphql_app, prefix="/graphql/tenants", tags=["GraphQL Tenants"])
```

### 3. 기존 schema.py 상태
- **상태**: DEPRECATED
- **용도**: 레거시 코드 참조용
- **내용**: 주석만 유지

## 프론트엔드 변경사항

### Manager Web (`apps/manager-web/src/lib/apollo-client.ts`)
```typescript
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  'http://localhost:8100/graphql/manager';
```

### Tenants Web (`apps/tenants-web/src/lib/apollo-client.ts`)
```typescript
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  'http://localhost:8100/graphql/tenants';
```

## 환경 변수 설정

### Backend API
```bash
# .env
API_HOST=0.0.0.0
API_PORT=8100
GRAPHQL_DEBUG=true
```

### Frontend

#### Manager Web (.env.local)
```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8100/graphql/manager
```

#### Tenants Web (.env.local)
```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8100/graphql/tenants
```

## API 문서 접근

### Swagger UI (Strawberry GraphQL)
- **Manager**: `http://localhost:8100/docs?prefix=/graphql/manager`
- **Tenants**: `http://localhost:8100/docs?prefix=/graphql/tenants`

### GraphQL Playground
- **Manager**: `http://localhost:8100/graphql/manager`
- **Tenants**: `http://localhost:8100/graphql/tenants`

## 장점

✅ **시스템별 독립성**
- 각 시스템의 GraphQL 스키마를 독립적으로 관리
- 팀별 작업 독립성 증대

✅ **유지보수성**
- 시스템별로 명확히 구분된 엔드포인트
- 각 시스템의 Query/Mutation을 쉽게 파악

✅ **확장성**
- 향후 새로운 시스템 추가 시 기존 코드 영향 최소화
- Apollo Federation 마이그레이션 가능

✅ **명확성**
- 프론트엔드에서 사용할 엔드포인트가 명확
- API 문서에서 시스템별로 구분됨

## 마이그레이션 가이드

### 기존 클라이언트 코드 업데이트

```typescript
// Before
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://api/graphql'
  }),
});

// After - Manager Web
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://api/graphql/manager'
  }),
});

// After - Tenants Web
const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://api/graphql/tenants'
  }),
});
```

## 테스트

### Manager GraphQL 테스트
```bash
curl -X POST http://localhost:8100/graphql/manager \
  -H "Content-Type: application/json" \
  -d '{"query":"{ version }"}'
```

### Tenants GraphQL 테스트
```bash
curl -X POST http://localhost:8100/graphql/tenants \
  -H "Content-Type: application/json" \
  -d '{"query":"{ version }"}'
```

## 향후 개선사항

1. **Apollo Federation** 도입 검토
   - 게이트웨이 패턴으로 통합
   - 마이크로서비스 아키텍처로 발전

2. **인증 공유 메커니즘**
   - Manager 인증 토큰을 Tenants 엔드포인트와 공유하는 방식 구현

3. **모니터링 및 로깅**
   - 시스템별 GraphQL 요청 통계
   - 성능 모니터링

## 주의사항

⚠️ **기존 `/graphql` 엔드포인트는 더 이상 사용할 수 없습니다**
- 모든 클라이언트는 시스템별 엔드포인트로 업데이트 필요
- `/graphql` 접근 시 404 오류 발생

⚠️ **Context 공유**
- 두 엔드포인트 모두 동일한 `get_context` 함수 사용
- 필요시 시스템별 context 분리 가능

