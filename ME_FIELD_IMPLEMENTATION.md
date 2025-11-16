# Me 필드 구현 보고서

## 문제점
Frontend에서 로그인 후 현재 사용자 정보를 조회하기 위해 `GET_CURRENT_USER` 쿼리를 사용하는데, 이 쿼리가 `me` 필드를 요청하지만 Backend의 `ManagerQuery`에 `me` 필드가 없어서 다음 에러가 발생했습니다:

```
[GraphQL error]: Message: Cannot query field 'me' on type 'ManagerQuery'
```

## 원인 분석

### Frontend (Manager-Web)
**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/graphql/queries.ts`

```typescript
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      fullName
      userType
      status
      createdAt
    }
  }
`;
```

- `me` 필드를 요청하고 있음
- 로그인 후 사용자 정보를 조회하는 데 사용됨

### Backend (Backend-API)
**파일**: `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/manager/schema.py`

#### Before (수정 전)
```python
@strawberry.type(description="Manager 시스템 Query")
class ManagerQuery:
    """Manager 시스템 Query"""

    # Dashboard, IDAM, 다른 필드들만 있음
    # ❌ me 필드 없음
```

#### After (수정 후)
```python
from .auth.queries import ManagerAuthQueries
from .auth.types import ManagerAuthUser

@strawberry.type(description="Manager 시스템 Query")
class ManagerQuery:
    """Manager 시스템 Query"""

    # Auth
    @strawberry.field(description="현재 로그인한 사용자 정보 조회")
    async def me(self, info) -> "ManagerAuthUser | None":
        """현재 로그인한 사용자 정보를 조회합니다."""
        return await ManagerAuthQueries().me(info)

    # 나머지 필드들...
```

## 해결 방법

### 1. 필요한 Import 추가
Backend의 `schema.py`에 다음을 추가:

```python
from .auth.queries import ManagerAuthQueries
from .auth.types import ManagerAuthUser
```

### 2. ManagerQuery에 me 필드 추가
- 타입: `ManagerAuthUser | None`
- 구현: `ManagerAuthQueries().me(info)` 호출

### 3. 작동 원리

```
Frontend (GET_CURRENT_USER 쿼리)
    ↓
GraphQL Request: query GetCurrentUser { me { ... } }
    ↓
Backend ManagerQuery.me() 필드
    ↓
ManagerAuthQueries().me(info) 호출
    ↓
get_current_user_info() 함수 실행
    ├─ JWT 토큰에서 user_id 추출
    ├─ user_id로 User 조회
    ├─ 계정 상태 확인 (ACTIVE)
    └─ ManagerAuthUser 반환
    ↓
GraphQL Response: { me: { id, username, ... } }
    ↓
Frontend useAuthStore에서 사용자 정보 저장
```

## 구현된 파일

### Backend: `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/manager/schema.py`

#### 변경 사항:
1. **Import 추가** (라인 6-7):
   ```python
   from .auth.queries import ManagerAuthQueries
   from .auth.types import ManagerAuthUser
   ```

2. **me 필드 추가** (라인 31-36):
   ```python
   # Auth
   @strawberry.field(description="현재 로그인한 사용자 정보 조회")
   async def me(self, info) -> "ManagerAuthUser | None":
       """현재 로그인한 사용자 정보를 조회합니다."""
       return await ManagerAuthQueries().me(info)
   ```

## ManagerAuthUser 타입 정보

**파일**: `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/manager/auth/types.py`

```python
@strawberry.type(description="Manager 인증 사용자")
class ManagerAuthUser(Node):
    id: strawberry.ID
    username: str              # 사용자명 (로그인 ID)
    email: str                 # 이메일 주소
    full_name: str             # 전체 이름 (표시명)
    user_type: str             # 사용자 타입 (MASTER, TENANT, SYSTEM)
    status: str                # 계정 상태 (ACTIVE, INACTIVE, LOCKED)
    created_at: datetime       # 계정 생성일시
```

## 로그인 프로세스 플로우

```
1️⃣ 로그인 (signin)
   Frontend → authService.signin()
   ↓
   GraphQL Mutation: mutation { auth { signin(input) } }
   ↓
   Backend: ManagerAuthMutations.signin()
   ├─ User 조회 & 비밀번호 검증
   ├─ LoginLog 기록
   ├─ Session 생성
   └─ JWT Token 발급 (accessToken, refreshToken)
   ↓
   Frontend: accessToken & refreshToken 저장 (localStorage, Cookie)

2️⃣ 현재 사용자 정보 조회 (me) ← 새로 추가됨
   Frontend → authService.getCurrentUser()
   ↓
   GraphQL Query: query { me { ... } }
   ↓
   Backend: ManagerQuery.me()
   ├─ Authorization 헤더에서 accessToken 추출
   ├─ JWT 검증 및 user_id 추출
   ├─ User 조회
   └─ ManagerAuthUser 반환
   ↓
   Frontend: useAuthStore에 사용자 정보 저장
   ↓
   Dashboard로 이동
```

## GraphQL 스키마 변경

### Before (수정 전)
```graphql
type ManagerQuery {
  dashboard: DashboardStats!
  tenant_growth(period: String = "month"): [TenantGrowthData!]!
  activities(limit: Int = 10, orderBy: String = "createdAt"): [Activity!]!
  user(id: ID!): ManagerUser
  users(limit: Int = 20, offset: Int = 0, userType: String, status: String): [ManagerUser!]!
  # ... roles, permissions, etc
}
```

### After (수정 후)
```graphql
type ManagerQuery {
  me: ManagerAuthUser            # ✅ 새로 추가됨
  dashboard: DashboardStats!
  tenant_growth(period: String = "month"): [TenantGrowthData!]!
  activities(limit: Int = 10, orderBy: String = "createdAt"): [Activity!]!
  user(id: ID!): ManagerUser
  users(limit: Int = 20, offset: Int = 0, userType: String, status: String): [ManagerUser!]!
  # ... roles, permissions, etc
}

type ManagerAuthUser {
  id: ID!
  username: String!
  email: String!
  fullName: String!
  userType: String!
  status: String!
  createdAt: DateTime!
}
```

## Frontend 코드 (변경 없음)

Frontend는 이미 올바르게 구현되어 있으므로 변경이 필요 없습니다:

**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/services/auth.service.ts`

```typescript
async getCurrentUser(): Promise<User> {
  try {
    const result = await apolloClient.query<GetCurrentUserResponse>({
      query: GET_CURRENT_USER,      // ✅ Backend의 me 필드를 요청
      fetchPolicy: "network-only",
    });

    if (!result.data?.me) {
      throw new Error("사용자 정보 조회에 실패했습니다.");
    }

    return result.data.me;
  } catch (error) {
    // 에러 처리
  }
}
```

**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/stores/auth.store.ts`

```typescript
signin: async (username: string, password: string) => {
  set({ isLoading: true });
  try {
    const tokenData = await authService.signin({ username, password });

    // 토큰 저장
    localStorage.setItem("access_token", tokenData.accessToken);
    localStorage.setItem("refresh_token", tokenData.refreshToken);
    setCookie("access_token", tokenData.accessToken, 7);
    setCookie("refresh_token", tokenData.refreshToken, 7);

    set({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      isAuthenticated: true,
    });

    // 사용자 정보 조회 (me 필드 사용)
    const user = await authService.getCurrentUser();  // ✅ 이제 정상 작동
    set({ user });
  }
  // ...
}
```

## 보안 고려사항

### 1. 인증 필수 (require_auth 데코레이터)
`me` 필드는 인증이 필요한 쿼리가 아니므로, 필요시 `@require_auth` 데코레이터를 추가할 수 있습니다:

```python
from src.graphql.decorators import require_auth

@strawberry.field(description="현재 로그인한 사용자 정보 조회")
@require_auth  # ✅ 추가 가능
async def me(self, info) -> "ManagerAuthUser | None":
    """현재 로그인한 사용자 정보를 조회합니다."""
    return await ManagerAuthQueries().me(info)
```

### 2. 현재 구현의 안전성
`ManagerAuthQueries.me()` 메서드는 이미 내부적으로:
- JWT 토큰 검증 (info.context.user_id 추출)
- User 존재 여부 확인
- 계정 활성화 여부 확인

를 수행하므로 안전합니다.

## 테스트 GraphQL 쿼리

### 로그인 후 사용자 정보 조회
```graphql
query GetCurrentUser {
  me {
    id
    username
    email
    fullName
    userType
    status
    createdAt
  }
}

# Response
{
  "data": {
    "me": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "user123",
      "email": "user@example.com",
      "fullName": "User Full Name",
      "userType": "MASTER",
      "status": "ACTIVE",
      "createdAt": "2024-11-16T08:00:00+00:00"
    }
  }
}
```

## 요약

| 항목 | 상세 |
|------|------|
| **문제** | Frontend의 `GET_CURRENT_USER` 쿼리가 `me` 필드를 요청하지만 Backend에 없음 |
| **원인** | Backend `ManagerQuery`에 `me` 필드 미구현 |
| **해결책** | ManagerQuery에 `me` 필드 추가 |
| **변경파일** | `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/manager/schema.py` |
| **로그인 프로세스** | 로그인 성공 → 토큰 저장 → **`me` 쿼리로 사용자 정보 조회** → 대시보드 로드 |
| **상태** | ✅ 완료 |

