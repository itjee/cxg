# GraphQL API 자주 묻는 질문 (FAQ)

## 📌 기본 개념

### Q1. GraphQL이 REST보다 항상 좋은가요?

**A:** 아닙니다. 각각 장단점이 있습니다.

**GraphQL 장점:**
- 클라이언트가 필요한 데이터만 요청
- 단일 엔드포인트로 모든 데이터 조회
- 타입 시스템으로 자동 문서화
- N+1 문제 해결 (DataLoader)

**GraphQL 단점:**
- 초기 학습 곡선
- 캐싱 복잡도 증가
- 파일 업로드 복잡
- 쿼리 복잡도 관리 필요

**권장 사용 시나리오:**
- ✅ 복잡한 데이터 관계가 많은 경우
- ✅ 다양한 클라이언트(웹, 모바일, 파트너)
- ✅ 빠른 프론트엔드 개발 필요
- ❌ 단순 CRUD만 필요한 경우
- ❌ 파일 업로드/다운로드가 주 기능

---

### Q2. REST API를 모두 제거해야 하나요?

**A:** 아닙니다. 병행 운영을 권장합니다.

```python
# main.py - REST와 GraphQL 병행

# REST API (기존 유지)
app.include_router(rest_router, prefix="/api/v1")

# GraphQL API (신규)
app.include_router(graphql_router, prefix="/graphql")

# 파일 업로드는 REST로 유지
app.include_router(upload_router, prefix="/api/v1/upload")
```

**병행 운영 시나리오:**
- GraphQL: 복잡한 데이터 조회, 관계형 데이터
- REST: 파일 업로드, Webhook, 외부 API 연동

---

### Q3. 테넌트별 DB 분리가 꼭 필요한가요?

**A:** 비즈니스 요구사항에 따라 다릅니다.

| 방식 | 장점 | 단점 | 적합한 경우 |
|------|------|------|-------------|
| **Database-per-tenant** | 데이터 격리, 성능 독립, 규정 준수 | 관리 복잡, 비용 증가 | B2B SaaS, 금융, 의료 |
| **Schema-per-tenant** | 관리 용이, 비용 절감 | 성능 간섭, 마이그레이션 복잡 | 중소 SaaS |
| **Row-level tenant** | 가장 단순, 비용 최소 | 데이터 격리 약함 | 소규모 멀티테넌트 |

**현재 프로젝트 (50인 미만 사업자):**
→ Database-per-tenant 권장 (데이터 보안, GDPR 준수)

---

## 🔧 구현 관련

### Q4. ORM 모델을 GraphQL 타입으로 자동 변환할 수 있나요?

**A:** 가능하지만 권장하지 않습니다.

**❌ 안티패턴:**
```python
# ORM 모델을 직접 노출
@strawberry.experimental.pydantic.type(model=Users)
class User:
    pass
```

**✅ 권장 방식:**
```python
# 명시적 GraphQL 타입 정의
@strawberry.type
class User:
    id: UUID
    username: str
    email: str
    # DB 필드와 GraphQL 필드 분리
    
    @classmethod
    def from_orm(cls, user_model):
        return cls(
            id=user_model.id,
            username=user_model.username,
            email=user_model.email,
        )
```

**이유:**
- DB 스키마 변경이 API에 직접 영향
- 민감한 필드 노출 위험 (password_hash 등)
- API 버전 관리 어려움

---

### Q5. N+1 문제를 어떻게 해결하나요?

**A:** DataLoader를 사용합니다.

**문제 상황:**
```python
# ❌ N+1 문제 발생
@strawberry.type
class User:
    @strawberry.field
    async def department(self, info) -> Department:
        # 각 사용자마다 개별 쿼리 실행!
        db = info.context.db_session
        dept = await db.get(Departments, self.department_id)
        return dept

# 100명 조회 시 → 1 (users) + 100 (departments) = 101번 쿼리!
```

**해결:**
```python
# ✅ DataLoader로 배치 로딩
@strawberry.type
class User:
    @strawberry.field
    async def department(self, info) -> Department:
        # DataLoader가 자동으로 배치 처리
        return await info.context.loaders["department"].load(self.department_id)

# 100명 조회 시 → 1 (users) + 1 (departments batch) = 2번 쿼리!
```

**DataLoader 구현:**
```python
# graphql/loaders.py
from aiodataloader import DataLoader

class DepartmentLoader(DataLoader):
    def __init__(self, db):
        super().__init__()
        self.db = db
    
    async def batch_load_fn(self, keys: List[UUID]):
        # IN 쿼리로 일괄 조회
        stmt = select(Departments).where(Departments.id.in_(keys))
        result = await self.db.execute(stmt)
        depts = result.scalars().all()
        
        # 키 순서대로 매핑
        dept_map = {d.id: d for d in depts}
        return [dept_map.get(k) for k in keys]
```

---

### Q6. 페이지네이션은 어떻게 구현하나요?

**A:** Relay 스타일 커서 페이지네이션을 권장합니다.

**Offset 방식 (비추천):**
```graphql
# ❌ 문제: 대량 데이터 시 성능 저하, 중복/누락 가능
query {
  users(page: 10, pageSize: 20) {
    items { id name }
    totalCount
  }
}
```

**Cursor 방식 (추천):**
```graphql
# ✅ 안정적, 성능 우수
query {
  users(first: 20, after: "cursor-xyz") {
    edges {
      cursor
      node { id name }
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

**구현:**
```python
async def get_users_list(info, first: int = 20, after: str = None):
    stmt = select(Users)
    
    # 커서 기반 필터링
    if after:
        cursor_id = decode_cursor(after)  # Base64 디코딩
        stmt = stmt.where(Users.id > cursor_id)
    
    # 정렬 및 제한 (first + 1로 hasNextPage 판단)
    stmt = stmt.order_by(Users.id).limit(first + 1)
    
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    # 다음 페이지 확인
    has_next = len(users) > first
    if has_next:
        users = users[:first]
    
    # Edge 생성
    edges = [
        UserEdge(
            cursor=encode_cursor(user.id),
            node=User.from_orm(user)
        )
        for user in users
    ]
    
    return UserConnection(
        edges=edges,
        page_info=PageInfo(
            has_next_page=has_next,
            end_cursor=edges[-1].cursor if edges else None,
            total_count=await count_total(db)
        )
    )
```

---

## 🔐 보안 관련

### Q7. GraphQL에서 권한 제어는 어떻게 하나요?

**A:** 필드 레벨, 타입 레벨, 리졸버 레벨 권한 제어가 모두 가능합니다.

**1) 리졸버 레벨 (권장):**
```python
from src.graphql.permissions import check_permission

@strawberry.mutation
async def create_user(info, input: UserCreateInput) -> User:
    # 권한 체크
    check_permission(info.context, "users:write")
    
    # 비즈니스 로직
    ...
```

**2) 데코레이터 방식:**
```python
from src.graphql.permissions import require_permission

@require_permission("users:write")
@strawberry.mutation
async def create_user(info, input: UserCreateInput) -> User:
    # 권한이 있을 때만 실행
    ...
```

**3) 필드 레벨:**
```python
@strawberry.type
class User:
    id: UUID
    username: str
    
    @strawberry.field
    async def email(self, info) -> str:
        # 본인 또는 관리자만 이메일 조회 가능
        if info.context.user_id != str(self.id) and info.context.role != "admin":
            raise PermissionDenied("이메일을 볼 권한이 없습니다")
        return self._email
```

**4) Directive 방식 (고급):**
```python
@strawberry.type
class User:
    id: UUID
    username: str
    
    email: str = strawberry.field(
        directives=[HasPermission("users:read_email")]
    )
```

---

### Q8. JWT 토큰은 어떻게 관리하나요?

**A:** Access Token (짧은 TTL) + Refresh Token (긴 TTL) 패턴을 사용합니다.

```python
# 로그인 시
@strawberry.mutation
async def login(username: str, password: str) -> LoginResponse:
    user = await authenticate_user(username, password)
    
    # Access Token (15분)
    access_token = create_access_token({
        "sub": str(user.id),
        "tenant_key": user.tenant_key,
        "role": user.role,
        "permissions": user.permissions,
    })
    
    # Refresh Token (7일)
    refresh_token = create_refresh_token({
        "sub": str(user.id),
    })
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=900,  # 15분
    )

# 토큰 갱신
@strawberry.mutation
async def refresh(refresh_token: str) -> LoginResponse:
    # Refresh Token 검증
    payload = decode_refresh_token(refresh_token)
    user = await get_user(payload["sub"])
    
    # 새 Access Token 발급
    new_access_token = create_access_token({...})
    
    return LoginResponse(access_token=new_access_token, ...)
```

**클라이언트 사용:**
```typescript
// Apollo Client 설정
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// 토큰 만료 시 자동 갱신
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        // Refresh Token으로 갱신
        return fromPromise(
          refreshToken()
        ).flatMap(() => forward(operation));
      }
    }
  }
});
```

---

## 🚀 성능 최적화

### Q9. GraphQL 쿼리가 너무 복잡해지면 어떻게 하나요?

**A:** 쿼리 복잡도 제한과 깊이 제한을 설정합니다.

```python
from strawberry.extensions import QueryDepthLimiter, ValidationCache

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        QueryDepthLimiter(max_depth=10),  # 최대 깊이 10
        ValidationCache(),  # 쿼리 캐싱
    ]
)
```

**복잡도 계산 예시:**
```graphql
# ❌ 복잡도 초과 (깊이 > 10)
query TooDeep {
  users {
    department {
      manager {
        department {
          manager {
            department {
              # ... 계속 중첩
            }
          }
        }
      }
    }
  }
}
```

**해결:**
```graphql
# ✅ 프래그먼트로 분리
fragment DepartmentInfo on Department {
  id
  name
  manager {
    id
    name
  }
}

query GetUsers {
  users {
    id
    name
    department {
      ...DepartmentInfo
    }
  }
}
```

---

### Q10. 캐싱은 어떻게 하나요?

**A:** 여러 레벨에서 캐싱이 가능합니다.

**1) DataLoader 캐싱 (요청 스코프):**
```python
# 자동으로 같은 요청 내에서 캐싱됨
loader = info.context.loaders["user"]
user1 = await loader.load(user_id)  # DB 쿼리
user2 = await loader.load(user_id)  # 캐시에서 조회
```

**2) Redis 캐싱 (글로벌):**
```python
@strawberry.field
async def user(info, user_id: UUID) -> User:
    # Redis 캐시 확인
    cache_key = f"user:{user_id}"
    cached = await redis_cache.get(cache_key)
    if cached:
        return User(**cached)
    
    # DB 조회
    user = await get_user_from_db(user_id)
    
    # 캐시 저장 (TTL 5분)
    await redis_cache.set(cache_key, user.dict(), ttl=300)
    
    return user
```

**3) HTTP 캐싱 (CDN/프록시):**
```python
from fastapi import Response

@app.post("/graphql")
async def graphql_endpoint(request: Request, response: Response):
    # 쿼리가 읽기 전용이면 캐시 가능
    if is_query_only(request):
        response.headers["Cache-Control"] = "public, max-age=60"
    
    return await graphql_app(request)
```

---

## 🐛 트러블슈팅

### Q11. "테넌트를 찾을 수 없습니다" 에러가 발생합니다

**원인:**
1. JWT에 tenant_key가 없음
2. Central Admin DB에 테넌트 미등록
3. 테넌트가 비활성 상태

**해결:**
```bash
# 1. JWT 페이로드 확인
echo "YOUR_JWT_TOKEN" | base64 -d
# 또는 https://jwt.io 에서 디코딩

# 2. Central Admin DB 확인
psql -d central_admin
SELECT * FROM tenants WHERE tenant_key = 'acme01';

# 3. 테넌트 활성화
UPDATE tenants SET is_active = true WHERE tenant_key = 'acme01';

# 4. 테넌트 프로비저닝 (없는 경우)
python scripts/provision_tenant.py --tenant-key acme01 ...
```

---

### Q12. DataLoader가 작동하지 않습니다

**증상:**
```
여전히 N+1 쿼리가 발생함
```

**원인과 해결:**

**1) DataLoader를 생성하지 않음:**
```python
# ❌ 잘못된 코드
@strawberry.type
class User:
    @strawberry.field
    async def department(self, info):
        # 직접 DB 조회 → N+1 발생!
        return await db.get(Departments, self.department_id)

# ✅ 올바른 코드
@strawberry.type
class User:
    @strawberry.field
    async def department(self, info):
        # DataLoader 사용
        return await info.context.loaders["department"].load(self.department_id)
```

**2) Context에 로더가 없음:**
```python
# context.py 확인
async def get_context(request: Request):
    loaders = create_loaders(db_session)  # 이 부분 확인!
    
    return GraphQLContext(
        request=request,
        db_session=db_session,
        loaders=loaders,  # 로더 전달 확인
        ...
    )
```

**3) 요청마다 새 로더 생성 안 함:**
```python
# ❌ 전역 로더 (배치 캐싱 안 됨)
GLOBAL_LOADER = DepartmentLoader(db)

# ✅ 요청마다 새 로더
def create_loaders(db):
    return {
        "department": DepartmentLoader(db),  # 매번 새로 생성
    }
```

---

### Q13. 마이그레이션이 일부 테넌트에서만 실패합니다

**해결:**
```python
# scripts/migrate_all_tenants.py 수정

async def migrate_all_tenants():
    async with get_central_admin_session() as session:
        tenants = await get_all_active_tenants(session)
        
        results = []
        for tenant in tenants:
            try:
                await migrate_tenant(tenant)
                results.append({"tenant": tenant.tenant_key, "status": "✅ 성공"})
            except Exception as e:
                results.append({
                    "tenant": tenant.tenant_key,
                    "status": "❌ 실패",
                    "error": str(e)
                })
                
                # 로그 저장
                logger.error(f"테넌트 {tenant.tenant_key} 마이그레이션 실패", exc_info=e)
        
        # 결과 리포트
        print_migration_report(results)
        
        # 실패한 테넌트만 재시도
        failed_tenants = [r for r in results if "실패" in r["status"]]
        if failed_tenants:
            print("\n⚠️ 실패한 테넌트:")
            for t in failed_tenants:
                print(f"  - {t['tenant']}: {t['error']}")
```

---

## 📚 추가 학습 자료

### 추천 읽을거리
1. [Strawberry GraphQL 공식 문서](https://strawberry.rocks/)
2. [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
3. [Relay Cursor Connections](https://relay.dev/graphql/connections.htm)
4. [DataLoader 패턴](https://github.com/graphql/dataloader)

### 추천 도구
- **GraphQL Playground**: 개발 중 쿼리 테스트
- **Apollo Studio**: 프로덕션 모니터링
- **graphql-codegen**: 타입 자동 생성
- **graphql-inspector**: 스키마 변경 감지

---

**더 궁금한 점이 있으신가요?**
- 📧 개발팀 이메일: dev@cxg.com
- 💬 Slack 채널: #graphql-help
- 📖 [전체 개발 가이드](./GraphQL_개발가이드.md)
