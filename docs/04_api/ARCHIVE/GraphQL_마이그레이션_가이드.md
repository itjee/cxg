# RESTful API → GraphQL 마이그레이션 가이드

## 📋 개요

기존 RESTful API 구조를 GraphQL로 점진적으로 마이그레이션하는 실무 가이드입니다.

---

## 🎯 마이그레이션 전략

### 옵션 1: Big Bang (일괄 전환) ❌ 비추천
- 모든 엔드포인트를 한 번에 GraphQL로 전환
- 위험도 높음, 롤백 어려움

### 옵션 2: Strangler Fig Pattern ✅ 추천
- 기존 REST API와 GraphQL을 병행 운영
- 점진적으로 GraphQL로 이전
- 문제 발생 시 즉시 롤백 가능

### 옵션 3: GraphQL 우선, REST 유지
- 신규 기능은 GraphQL로만 개발
- 기존 REST API는 유지보수만

**권장 전략**: **옵션 2 (Strangler Fig)**

---

## 📅 단계별 마이그레이션 계획

### Phase 1: 준비 단계 (1-2주)

#### 1.1 인프라 구축
```bash
# Central Admin DB 생성
createdb central_admin

# 테넌트 메타데이터 테이블 생성
alembic -c alembic_central_admin.ini upgrade head

# 첫 번째 테넌트 프로비저닝 (테스트용)
python scripts/provision_tenant.py \
  --tenant-key test01 \
  --company-name "Test Company" \
  --db-name test01_db \
  --db-user test01_user \
  --db-password "TestPass123!"
```

#### 1.2 GraphQL 기본 구조 구축
```
src/
├── graphql/
│   ├── schema.py          # ✅ 생성
│   ├── context.py         # ✅ 생성
│   ├── types/
│   │   └── base.py        # ✅ 생성
│   └── queries/
│       └── __init__.py    # ✅ 생성
```

#### 1.3 기존 REST API와 병행 운영 설정

**main.py 업데이트:**
```python
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

# 기존 REST 라우터 (유지)
from src.routers.manager.v1 import router as manager_v1_router
from src.routers.tenants.v1 import router as tenants_v1_router

# 신규 GraphQL 라우터
from src.graphql.schema import schema
from src.graphql.context import get_context

app = FastAPI()

# REST API (기존 유지)
app.include_router(manager_v1_router, prefix="/api/v1/manager", tags=["REST - Manager"])
app.include_router(tenants_v1_router, prefix="/api/v1/tenants", tags=["REST - Tenants"])

# GraphQL API (신규)
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql", tags=["GraphQL"])
```

---

### Phase 2: 핵심 모듈 마이그레이션 (2-3주)

#### 우선순위 결정 기준
1. **사용빈도 높음** → 먼저 전환
2. **복잡도 낮음** → 먼저 전환
3. **N+1 문제 심각** → 먼저 전환

#### 추천 순서
1. ✅ **User (사용자)** - 가장 기본, 사용빈도 높음
2. ✅ **Branch (지점)** - 단순, 관계 적음
3. ✅ **Department (부서)** - User와 연관
4. ✅ **Role/Permission (권한)** - 인증/인가 핵심
5. 🔄 **Product (제품)** - 복잡도 중간
6. 🔄 **Order (주문)** - 복잡도 높음, 다중 관계

---

### Phase 3: 모듈별 마이그레이션 예시

#### 3.1 User 모듈 마이그레이션

**기존 REST API (src/modules/tenants/sys/users/router.py):**
```python
@router.get("", response_model=EnvelopeResponse[UsersListResponse])
async def get_users_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_tenant_db),
    current_user: dict = Depends(get_current_user),
):
    """사용자 목록 조회"""
    items = await UsersService.get_list(db, page=page, page_size=page_size)
    return EnvelopeResponse.success_response(items)
```

**GraphQL 전환 (src/graphql/types/tenants/user.py):**
```python
import strawberry
from typing import Optional
from uuid import UUID

@strawberry.type
class User:
    id: UUID
    username: str
    email: str
    full_name: str
    phone: Optional[str]
    is_active: bool
    
    # 관계형 필드 (DataLoader 사용)
    @strawberry.field
    async def department(self, info) -> Optional["Department"]:
        if not self.department_id:
            return None
        return await info.context.loaders["department"].load(self.department_id)
```

**Query 리졸버 (src/graphql/queries/tenants/user.py):**
```python
async def get_users_list(
    info,
    first: int = 20,
    after: Optional[str] = None,
) -> UserConnection:
    """사용자 목록 조회"""
    db = info.context.db_session
    
    stmt = select(Users).where(Users.is_deleted == False)
    if after:
        stmt = stmt.where(Users.id > UUID(after))
    
    stmt = stmt.order_by(Users.id).limit(first + 1)
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    # ... (페이지네이션 로직)
    
    return UserConnection(edges=edges, page_info=page_info)
```

#### 3.2 기존 서비스 레이어 재사용

**기존 UsersService 활용:**
```python
# src/services/tenants/users.py (기존 service.py에서 이동)

class UsersService:
    @staticmethod
    async def create_user(db: AsyncSession, data: dict, created_by: UUID):
        """사용자 생성 (REST와 GraphQL 모두 사용)"""
        # 비밀번호 해싱
        hashed_password = get_password_hash(data["password"])
        
        # 사용자 생성
        new_user = Users(
            username=data["username"],
            email=data["email"],
            password=hashed_password,
            full_name=data["full_name"],
            created_by=created_by,
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        return new_user
```

**GraphQL Mutation에서 재사용:**
```python
# src/graphql/mutations/tenants/user.py

from src.services.tenants.users import UsersService

async def create_user(info, input: UserCreateInput) -> User:
    db = info.context.db_session
    creator_id = UUID(info.context.user_id)
    
    # 기존 서비스 레이어 재사용!
    user_model = await UsersService.create_user(
        db,
        data={
            "username": input.username,
            "email": input.email,
            "password": input.password,
            "full_name": input.full_name,
        },
        created_by=creator_id
    )
    
    # ORM → GraphQL 타입 변환
    return User(
        id=user_model.id,
        username=user_model.username,
        email=user_model.email,
        full_name=user_model.full_name,
        is_active=user_model.is_active,
    )
```

---

### Phase 4: 프론트엔드 전환 (3-4주)

#### 4.1 Apollo Client 설정

**기존 (REST - Axios):**
```typescript
// api/users.ts
export const getUsers = async (page: number, pageSize: number) => {
  const response = await axios.get('/api/v1/tenants/sys/users', {
    params: { page, page_size: pageSize }
  });
  return response.data;
};
```

**전환 (GraphQL - Apollo Client):**
```typescript
// graphql/queries/users.ts
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($first: Int!, $after: String) {
    users(first: $first, after: $after) {
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
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
`;

// 사용
const { data, loading, error } = useQuery(GET_USERS, {
  variables: { first: 20, after: null }
});
```

#### 4.2 코드 생성 (graphql-codegen)

**설정 (codegen.yml):**
```yaml
schema: http://localhost:8100/graphql
documents: 'src/**/*.graphql'
generates:
  src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
```

**실행:**
```bash
npm run graphql:codegen
```

**생성된 타입 사용:**
```typescript
import { useGetUsersQuery } from '@/generated/graphql';

const UserList = () => {
  const { data, loading } = useGetUsersQuery({
    variables: { first: 20 }
  });
  
  if (loading) return <Loading />;
  
  return (
    <ul>
      {data?.users.edges.map(({ node }) => (
        <li key={node.id}>{node.fullName}</li>
      ))}
    </ul>
  );
};
```

---

### Phase 5: 모니터링 및 최적화 (2주)

#### 5.1 성능 측정

**REST vs GraphQL 비교:**
```python
# scripts/benchmark.py

import asyncio
import time
from statistics import mean, stdev

async def benchmark_rest():
    """REST API 벤치마크"""
    times = []
    for _ in range(100):
        start = time.time()
        # REST API 호출
        response = await client.get("/api/v1/tenants/sys/users?page=1&page_size=20")
        times.append(time.time() - start)
    
    return {
        "mean": mean(times),
        "stdev": stdev(times),
        "min": min(times),
        "max": max(times),
    }

async def benchmark_graphql():
    """GraphQL API 벤치마크"""
    query = """
    query {
      users(first: 20) {
        edges {
          node {
            id
            username
            fullName
          }
        }
      }
    }
    """
    times = []
    for _ in range(100):
        start = time.time()
        response = await client.post("/graphql", json={"query": query})
        times.append(time.time() - start)
    
    return {
        "mean": mean(times),
        "stdev": stdev(times),
        "min": min(times),
        "max": max(times),
    }
```

#### 5.2 N+1 문제 검증

**로깅 추가:**
```python
# src/core/database.py

tenant_engine = create_async_engine(
    url,
    echo=True,  # SQL 로그 출력
    pool_pre_ping=True,
)
```

**DataLoader 효과 측정:**
```
# DataLoader 사용 전
SELECT * FROM users LIMIT 20;          -- 1번
SELECT * FROM departments WHERE id=1;  -- 20번 (N+1 문제!)
SELECT * FROM departments WHERE id=2;
...

# DataLoader 사용 후
SELECT * FROM users LIMIT 20;          -- 1번
SELECT * FROM departments WHERE id IN (1,2,3,...,20);  -- 1번 (배치!)
```

---

### Phase 6: REST API 단계적 제거 (2-3주)

#### 6.1 사용량 모니터링

```python
# src/core/middleware.py

from collections import defaultdict

API_USAGE = defaultdict(int)

class APIUsageMiddleware:
    async def __call__(self, request: Request, call_next):
        if request.url.path.startswith("/api/v1/"):
            API_USAGE[request.url.path] += 1
        
        response = await call_next(request)
        return response

# 주기적으로 사용량 확인
@app.get("/admin/api-usage")
async def get_api_usage():
    return dict(API_USAGE)
```

#### 6.2 Deprecation Warning 추가

```python
@router.get("", deprecated=True)
async def get_users_list_deprecated(...):
    """
    ⚠️ DEPRECATED: 2025년 3월 31일 제거 예정
    
    GraphQL 엔드포인트를 사용하세요:
    POST /graphql
    query { users { ... } }
    """
    # 경고 헤더 추가
    response = await get_users_list(...)
    response.headers["X-Deprecated"] = "true"
    response.headers["X-Sunset"] = "2025-03-31"
    return response
```

#### 6.3 제거 체크리스트

- [ ] 모든 프론트엔드가 GraphQL로 전환 완료
- [ ] 2주간 REST API 호출 0건 확인
- [ ] 파트너사/외부 API 사용자에게 공지 (최소 3개월 전)
- [ ] 롤백 계획 수립
- [ ] REST 라우터 제거
- [ ] 코드 정리 및 문서 업데이트

---

## 🛠 마이그레이션 도구

### 자동 변환 스크립트

**scripts/convert_rest_to_graphql.py:**
```python
"""REST 엔드포인트를 GraphQL 타입으로 자동 변환"""

import ast
import re
from pathlib import Path

def parse_pydantic_model(file_path: Path) -> dict:
    """Pydantic 모델 파싱"""
    # schemas.py 파일에서 모델 추출
    with open(file_path) as f:
        content = f.read()
    
    # AST 파싱으로 필드 추출
    tree = ast.parse(content)
    models = {}
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            if any(base.id == "BaseModel" for base in node.bases if hasattr(base, 'id')):
                fields = extract_fields(node)
                models[node.name] = fields
    
    return models

def generate_strawberry_type(model_name: str, fields: dict) -> str:
    """Strawberry 타입 생성"""
    type_def = f"@strawberry.type\nclass {model_name}:\n"
    
    for field_name, field_type in fields.items():
        graphql_type = map_python_to_graphql_type(field_type)
        type_def += f"    {field_name}: {graphql_type}\n"
    
    return type_def

# 실행
if __name__ == "__main__":
    schemas_path = Path("src/modules/tenants/sys/users/schemas.py")
    models = parse_pydantic_model(schemas_path)
    
    for model_name, fields in models.items():
        graphql_type = generate_strawberry_type(model_name, fields)
        print(graphql_type)
```

---

## 📊 마이그레이션 진행 상황 추적

### 진행률 대시보드

**scripts/migration_progress.py:**
```python
"""마이그레이션 진행 상황 추적"""

import os
from pathlib import Path

# 모듈별 상태
MODULES = {
    # 시스템 관리
    "sys.users": "✅ 완료",
    "sys.branches": "✅ 완료",
    "sys.departments": "✅ 완료",
    "sys.roles": "🔄 진행중",
    "sys.permissions": "🔄 진행중",
    
    # 고객 관리
    "crm.customers": "📅 예정",
    "crm.contacts": "📅 예정",
    
    # 제품 관리
    "pim.products": "📅 예정",
    "pim.categories": "📅 예정",
}

def print_progress():
    total = len(MODULES)
    completed = sum(1 for v in MODULES.values() if "완료" in v)
    in_progress = sum(1 for v in MODULES.values() if "진행중" in v)
    planned = total - completed - in_progress
    
    print("=" * 60)
    print("🚀 GraphQL 마이그레이션 진행 상황")
    print("=" * 60)
    print(f"전체 모듈: {total}")
    print(f"✅ 완료: {completed} ({completed/total*100:.1f}%)")
    print(f"🔄 진행중: {in_progress} ({in_progress/total*100:.1f}%)")
    print(f"📅 예정: {planned} ({planned/total*100:.1f}%)")
    print("=" * 60)
    print("\n모듈별 상세:")
    
    for module, status in MODULES.items():
        print(f"  {status:<15} {module}")

if __name__ == "__main__":
    print_progress()
```

**출력:**
```
============================================================
🚀 GraphQL 마이그레이션 진행 상황
============================================================
전체 모듈: 10
✅ 완료: 3 (30.0%)
🔄 진행중: 2 (20.0%)
📅 예정: 5 (50.0%)
============================================================

모듈별 상세:
  ✅ 완료         sys.users
  ✅ 완료         sys.branches
  ✅ 완료         sys.departments
  🔄 진행중       sys.roles
  🔄 진행중       sys.permissions
  📅 예정         crm.customers
  📅 예정         crm.contacts
  📅 예정         pim.products
  📅 예정         pim.categories
```

---

## ⚠️ 주의사항

### 1. Breaking Changes 최소화
```python
# ❌ 나쁜 예: 필드명 변경
@strawberry.type
class User:
    user_id: UUID  # REST에서는 'id'였음 → Breaking Change!

# ✅ 좋은 예: 기존 필드명 유지
@strawberry.type
class User:
    id: UUID  # 기존과 동일
```

### 2. 점진적 롤아웃
```python
# Feature Flag 사용
if settings.use_graphql:
    return await graphql_handler(request)
else:
    return await rest_handler(request)
```

### 3. 롤백 계획
```bash
# Git tag로 버전 관리
git tag -a graphql-migration-phase2 -m "Phase 2 완료"

# 롤백 시
git revert <commit-hash>
```

---

## 📈 성공 지표

### KPI
- [ ] REST API 호출 수 → 0
- [ ] GraphQL API 응답 시간 < 200ms (p95)
- [ ] N+1 쿼리 제거 (DataLoader 적용률 100%)
- [ ] API 에러율 < 0.1%
- [ ] 프론트엔드 번들 크기 감소 (타입 생성 자동화)

---

**마이그레이션 성공을 기원합니다! 🎉**
