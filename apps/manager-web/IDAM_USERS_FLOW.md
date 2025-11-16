# IDAM Users 모듈 - 전체 데이터 흐름 가이드

## 📊 전체 아키텍처 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE / COMPONENT LAYER                       │
│  /app/(main)/idam/users/page.tsx (Users List Page)              │
│  components/users-edit.tsx (Create/Update Dialog)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                      HOOK LAYER                                 │
│  hooks/use-users.ts                                             │
│  - useUsers() → GraphQL 쿼리 (목록 조회)                        │
│  - useCreateUser() → GraphQL 뮤테이션 (생성)                    │
│  - useUpdateUser() → GraphQL 뮤테이션 (수정)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                   GRAPHQL LAYER                                 │
│  graphql/queries.ts                                             │
│  - GET_USERS (사용자 목록 조회)                                 │
│  - GET_USER (사용자 상세 조회)                                  │
│                                                                 │
│  graphql/mutations.ts                                           │
│  - CREATE_USER (사용자 생성)                                    │
│  - UPDATE_USER (사용자 수정)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                        APOLLO CLIENT
                       (Network Layer)
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API                                 │
│  Backend GraphQL Server                                         │
│  (Python Strawberry)                                            │
│                                                                 │
│  manager/idam/users/types.py                                    │
│  - ManagerUser (GraphQL Type)                                   │
│  - ManagerUserCreateInput (GraphQL Input)                       │
│                                                                 │
│  manager/idam/users/queries.py                                  │
│  - @strawberry.field users() → List[ManagerUser]                │
│  - @strawberry.field user(id) → ManagerUser                     │
│                                                                 │
│  manager/idam/users/mutations.py                                │
│  - @strawberry.mutation createUser() → ManagerUser              │
│  - @strawberry.mutation updateUser() → ManagerUser              │
│                                                                 │
│  manager/idam/users/models.py (SQLAlchemy)                      │
│  - ManagerUser (DB Model)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 시나리오 1: 사용자 목록 조회 (GET)

### 1️⃣ PAGE 파일 (데이터 조회 트리거)

**파일:** `apps/manager-web/src/app/(main)/idam/users/page.tsx`

```typescript
export default function UsersPage() {
  // 1. Hook 호출 (사용자 목록 조회)
  const {
    data: usersResponse,  // { users: User[] }
    loading,
    refetch,
  } = useUsers({
    limit: itemsPerPage,           // 20
    offset: currentPage * itemsPerPage,  // 0
    status: selectedStatus || undefined, // null
  });

  // 2. 응답 데이터 추출
  const users = usersResponse?.users || [];  // User[]

  // 3. 컴포넌트에 데이터 전달
  return (
    <div>
      <UsersTable data={users} />  {/* ← User[] 전달 */}
    </div>
  );
}
```

**역할:**
- ✅ UI 상태 관리 (페이지, 필터)
- ✅ Hook 호출
- ✅ 데이터 표시
- ✅ 에러 처리

---

### 2️⃣ HOOK 파일 (GraphQL 쿼리 실행)

**파일:** `apps/manager-web/src/features/idam/users/hooks/use-users.ts`

```typescript
/**
 * 사용자 목록 조회 Hook
 * Apollo Client의 useQuery를 래핑
 */
export function useUsers(variables?: UsersQueryVariables) {
  // 1. useQuery Hook 호출
  return useQuery<
    { users: User[] },      // 응답 타입
    UsersQueryVariables     // 변수 타입
  >(GET_USERS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,  // userType, status
    },
    fetchPolicy: "cache-and-network",
  });
}
```

**반환 값:**
```typescript
{
  data?: {
    users: User[];  // 조회 결과
  },
  loading: boolean,
  error?: Error,
  refetch: Function,
}
```

---

### 3️⃣ GRAPHQL 파일 (쿼리 정의)

**파일:** `apps/manager-web/src/features/idam/users/graphql/queries.ts`

```typescript
/**
 * 사용자 목록 조회 GraphQL 쿼리
 * 변수: limit, offset, userType, status
 */
export const GET_USERS = gql`
  query GetUsers(
    $limit: Int
    $offset: Int
    $userType: String
    $status: String
  ) {
    users(
      limit: $limit
      offset: $offset
      userType: $userType
      status: $status
    ) {
      id
      userType
      fullName
      email
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * 쿼리 변수 타입 (복수형 - 목록 조회)
 */
export interface UsersQueryVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}
```

**전송되는 데이터:**
```json
{
  "operationName": "GetUsers",
  "variables": {
    "limit": 20,
    "offset": 0,
    "userType": null,
    "status": null
  },
  "query": "query GetUsers(...) { users(...) { id userType ... } }"
}
```

---

### 4️⃣ TYPE 파일 (데이터 모델)

**파일:** `apps/manager-web/src/features/idam/users/types/users.types.ts`

```typescript
/**
 * 단일 사용자 엔티티 타입 (GraphQL 응답)
 * camelCase (GraphQL 표준)
 */
export interface User {
  id: string;
  userType: string;        // MASTER, TENANT, SYSTEM
  fullName: string;
  email: string;
  phone?: string;
  username: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED" | "SUSPENDED";
  lastLoginAt?: string;
  failedLoginAttempts: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 사용자 목록 조회 응답 (GraphQL 응답)
 */
export interface GetUsersResponse {
  users: User[];
}
```

---

### 5️⃣ APOLLO CLIENT (네트워크 요청)

**자동 흐름:**

```
useQuery(GET_USERS, { variables })
    ↓
Apollo Client
    ↓
HTTP POST to GraphQL Endpoint
    ↓
Request Body:
{
  operationName: "GetUsers",
  variables: { limit: 20, offset: 0, ... },
  query: "query GetUsers(...) { ... }"
}
```

---

### 6️⃣ BACKEND (Python Strawberry GraphQL)

**파일:** `apps/backend-api/src/graphql/manager/idam/users/queries.py`

```python
@strawberry.type
class Query:
    @strawberry.field
    async def users(
        self,
        info: Info,
        limit: int = 20,
        offset: int = 0,
        user_type: str | None = None,
        status: str | None = None,
    ) -> list[ManagerUser]:
        """
        사용자 목록 조회

        GraphQL 쿼리 변수:
        - limit: 조회 수
        - offset: 페이지 오프셋
        - user_type: 사용자 타입 필터
        - status: 상태 필터
        """
        # 1. 데이터베이스 쿼리
        query = session.query(ManagerUserModel)

        if user_type:
            query = query.filter(ManagerUserModel.user_type == user_type)
        if status:
            query = query.filter(ManagerUserModel.status == status)

        # 2. 페이지네이션
        users = query.offset(offset).limit(limit).all()

        # 3. GraphQL 타입으로 변환 (snake_case → camelCase)
        return [ManagerUser.from_model(user) for user in users]
```

**파일:** `apps/backend-api/src/graphql/manager/idam/users/types.py`

```python
@strawberry.type(name="ManagerUser")
class ManagerUser(Node):
    """
    Manager 사용자 GraphQL Type
    (Python snake_case → GraphQL camelCase 자동 변환)
    """
    id: strawberry.ID

    # Strawberry가 자동으로 변환
    user_type: str              # → userType
    full_name: str              # → fullName
    email: str
    phone: str | None = None
    status: str
    last_login_at: datetime | None = None
    failed_login_attempts: int
    created_at: datetime        # → createdAt
    updated_at: datetime | None # → updatedAt
```

**파일:** `apps/backend-api/src/models/manager/users.py`

```python
from sqlalchemy import Column, String, DateTime

class ManagerUser(Base):
    """
    사용자 데이터베이스 모델
    (SQLAlchemy ORM)
    """
    __tablename__ = "manager_users"

    id = Column(UUID, primary_key=True)
    user_type = Column(String(20))  # snake_case
    full_name = Column(String(100))
    email = Column(String(100))
    username = Column(String(100))
    status = Column(String(20))
    last_login_at = Column(DateTime)
    failed_login_attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime)
```

---

### 📥 응답 흐름 (역순)

```
Backend Database (PostgreSQL)
    ↓
ManagerUser 모델 → ManagerUser GraphQL Type
    ↓
    Strawberry 자동 변환
    user_type → userType
    full_name → fullName
    created_at → createdAt
    ↓
GraphQL JSON 응답
{
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "userType": "MASTER",          ← camelCase
        "fullName": "Admin User",
        "email": "admin@example.com",
        "status": "ACTIVE",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
    ↓
Apollo Client
    ↓
useQuery Hook 반환
{
  data: {
    users: User[]
  }
}
    ↓
React Component 렌더링
<UsersTable data={users} />
```

---

## 🔄 시나리오 2: 사용자 등록 (CREATE)

### 1️⃣ 컴포넌트 (등록 폼)

**파일:** `apps/manager-web/src/features/idam/users/components/users-edit.tsx`

```typescript
export function UsersEdit() {
  // 1. 생성 뮤테이션 Hook
  const [createUser, { loading: createLoading }] = useCreateUser();

  // 2. 폼 제출 핸들러
  const handleSubmit = async (formData: CreateUserInput) => {
    try {
      // GraphQL 뮤테이션 실행
      await createUser({
        variables: {
          input: {
            userType: formData.userType,    // "MASTER"
            fullName: formData.fullName,    // "New User"
            email: formData.email,          // "user@example.com"
            username: formData.username,    // "newuser"
            password: formData.password,    // "hashed"
            phone: formData.phone,
            department: formData.department,
          },
        },
      });

      toast.success("사용자가 생성되었습니다");
      closeForm();
    } catch (error) {
      toast.error("사용자 생성 실패");
    }
  };

  return (
    <EntityDrawer>
      <UsersForm onSubmit={handleSubmit} />
    </EntityDrawer>
  );
}
```

**입력 데이터:**
```typescript
{
  userType: "MASTER",
  fullName: "New User",
  email: "user@example.com",
  username: "newuser",
  password: "SecurePassword123!",
  phone: "010-1234-5678",
  department: "Engineering",
}
```

---

### 2️⃣ HOOK (뮤테이션)

**파일:** `apps/manager-web/src/features/idam/users/hooks/use-users.ts`

```typescript
/**
 * 사용자 생성 Hook
 * Apollo Client의 useMutation 래핑
 */
export function useCreateUser() {
  return useMutation<
    { createUser: User },      // 응답 타입
    CreateUserVariables        // 변수 타입
  >(CREATE_USER, {
    // 성공 후 목록 자동 새로고침
    refetchQueries: [
      {
        query: GET_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
```

**사용 방식:**
```typescript
const [createUser, { loading, error, data }] = useCreateUser();

await createUser({
  variables: {
    input: { ... }  // CreateUserInput
  }
});
```

---

### 3️⃣ GRAPHQL (뮤테이션 정의)

**파일:** `apps/manager-web/src/features/idam/users/graphql/mutations.ts`

```typescript
/**
 * 사용자 생성 GraphQL 뮤테이션
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      userType
      fullName
      email
      username
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * 생성 뮤테이션 변수 (단수형)
 */
export interface CreateUserVariables {
  input: CreateUserInput;
}
```

**전송되는 GraphQL 요청:**
```json
{
  "operationName": "CreateUser",
  "variables": {
    "input": {
      "userType": "MASTER",
      "fullName": "New User",
      "email": "user@example.com",
      "username": "newuser",
      "password": "hashed",
      "phone": "010-1234-5678",
      "department": "Engineering"
    }
  },
  "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { ... } }"
}
```

---

### 4️⃣ TYPE (입력 모델)

**파일:** `apps/manager-web/src/features/idam/users/types/users.types.ts`

```typescript
/**
 * 사용자 생성 입력 (단수형)
 */
export interface CreateUserInput {
  userType: string;           // MASTER, TENANT, SYSTEM
  fullName: string;
  email: string;
  username: string;
  password: string;           // 평문 (HTTPS로 전송)
  phone?: string;
  department?: string;
  position?: string;
}

/**
 * 사용자 생성 응답
 */
export interface CreateUserResponse {
  createUser: User;
}
```

---

### 5️⃣ BACKEND (Python 뮤테이션)

**파일:** `apps/backend-api/src/graphql/manager/idam/users/mutations.py`

```python
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def createUser(
        self,
        info: Info,
        input: ManagerUserCreateInput,
    ) -> ManagerUser:
        """
        사용자 생성 뮤테이션

        입력:
        - input: CreateUserInput (GraphQL Input Type)
          {
            user_type: "MASTER",
            full_name: "New User",
            email: "user@example.com",
            username: "newuser",
            password: "plaintext",
            phone: "010-1234-5678"
          }
        """
        session = info.context["session"]

        # 1. 비밀번호 해싱
        hashed_password = hash_password(input.password)

        # 2. 데이터베이스 모델 생성
        new_user = ManagerUserModel(
            user_type=input.user_type,
            full_name=input.full_name,
            email=input.email,
            username=input.username,
            password_hash=hashed_password,
            phone=input.phone,
            status="ACTIVE",
            created_at=datetime.utcnow(),
        )

        # 3. 데이터베이스에 저장
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # 4. GraphQL 타입으로 변환
        return ManagerUser.from_model(new_user)
```

**파일:** `apps/backend-api/src/graphql/manager/idam/users/types.py`

```python
@strawberry.input(description="Manager 사용자 생성 입력")
class ManagerUserCreateInput:
    """GraphQL Input Type for user creation"""
    user_type: str              # MASTER, TENANT, SYSTEM
    full_name: str
    email: str
    username: str
    password: str               # 평문 전송 (HTTPS)
    phone: str | None = None
    department: str | None = None
    position: str | None = None
```

---

### 📤 생성 응답 흐름

```
Backend Database 저장 성공
    ↓
INSERT INTO manager_users (id, user_type, full_name, ...)
VALUES (uuid, 'MASTER', 'New User', ...)
    ↓
ManagerUserModel 인스턴스
    ↓
ManagerUser GraphQL Type으로 변환
user_type → userType (자동)
created_at → createdAt (자동)
    ↓
GraphQL JSON 응답
{
  "data": {
    "createUser": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userType": "MASTER",
      "fullName": "New User",
      "email": "user@example.com",
      "username": "newuser",
      "status": "ACTIVE",
      "createdAt": "2024-01-20T15:30:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  }
}
    ↓
Apollo Client 캐시 업데이트
    ↓
refetchQueries 실행 (GET_USERS 자동 갱신)
    ↓
useCreateUser() 반환
{
  data: {
    createUser: User
  }
}
    ↓
컴포넌트 성공 메시지 표시
toast.success("사용자가 생성되었습니다")
    ↓
폼 닫기 & 목록 자동 새로고침
```

---

## 📋 타입 매핑 요약

### Frontend → Backend

| Frontend (TypeScript) | GraphQL | Backend (Python) | 데이터베이스 |
|----------------------|---------|-----------------|----------|
| `User` | `ManagerUser` | `ManagerUser (Type)` | `manager_users (Table)` |
| `CreateUserInput` | `CreateUserInput` | `ManagerUserCreateInput` | N/A |
| `UsersQueryVariables` | Query Parameters | Function Parameters | N/A |

### 필드명 변환

| Frontend (camelCase) | GraphQL (camelCase) | Backend Python (snake_case) | Database (snake_case) |
|-------------------|------------------|-------------------------|-------------------|
| `userId` | `userId` | `user_id` | `user_id` |
| `fullName` | `fullName` | `full_name` | `full_name` |
| `createdAt` | `createdAt` | `created_at` | `created_at` |
| `userType` | `userType` | `user_type` | `user_type` |

**변환 방식:**
```
Frontend (camelCase)
    ↓
GraphQL (camelCase) ← Strawberry 자동 변환
    ↓
Backend Python (snake_case)
    ↓
Database (snake_case)
```

---

## 🔐 데이터 흐름 보안

```
클라이언트 입력 (HTTPS)
    ↓
React 컴포넌트 검증
    ↓
GraphQL 쿼리 생성
    ↓
Apollo Client 전송 (HTTPS)
    ↓
Backend 입력 검증
    ↓
비밀번호 해싱
    ↓
데이터베이스 저장
    ↓
응답 생성 (민감 정보 제외)
    ↓
클라이언트에 반환
```

---

## 📝 전체 파일 체크리스트

### Frontend (Manager Web)

```
apps/manager-web/src/
├── app/(main)/idam/users/
│   └── page.tsx                          ← 페이지 (진입점)
│
└── features/idam/users/
    ├── components/
    │   ├── users-edit.tsx                ← 생성/수정 폼
    │   ├── users-form.tsx                ← 폼 컴포넌트
    │   ├── users-table.tsx               ← 목록 테이블
    │   └── users-filters.tsx             ← 필터
    │
    ├── hooks/
    │   └── use-users.ts                  ← Apollo Hooks
    │       ├── useUsers()                ← 목록 조회
    │       ├── useCreateUser()           ← 생성
    │       └── useUpdateUser()           ← 수정
    │
    ├── graphql/
    │   ├── queries.ts                    ← GET_USERS, GET_USER
    │   ├── mutations.ts                  ← CREATE_USER, UPDATE_USER
    │   └── index.ts                      ← Export
    │
    ├── types/
    │   └── users.types.ts                ← User, CreateUserInput, ...
    │
    └── services/
        └── users.service.ts              ← apolloClient 직접 호출
```

### Backend (API Server)

```
apps/backend-api/src/
└── graphql/manager/idam/users/
    ├── types.py                          ← ManagerUser, ManagerUserCreateInput
    ├── queries.py                        ← users(), user(id)
    ├── mutations.py                      ← createUser(), updateUser()
    └── resolvers.py                      ← 비즈니스 로직

apps/backend-api/src/models/
└── manager/
    └── users.py                          ← ManagerUser (SQLAlchemy Model)
```

---

## 🎯 실행 순서

### 조회 시나리오
```
1. UsersPage() 렌더링
2. useUsers({ limit, offset, ... }) 호출
3. GET_USERS 쿼리 생성
4. Apollo Client가 GraphQL 요청 전송
5. Backend users() 쿼리 실행
6. Database 쿼리 실행
7. ManagerUser 모델 → ManagerUser Type 변환
8. JSON 응답 반환
9. Apollo Client 캐시 저장
10. useUsers() data 업데이트
11. 컴포넌트 리렌더링
12. UsersTable에 데이터 표시
```

### 생성 시나리오
```
1. UsersEdit() 폼 제출
2. handleSubmit(formData) 호출
3. createUser({ variables: { input } }) 호출
4. CREATE_USER 뮤테이션 생성
5. Apollo Client가 GraphQL 요청 전송
6. Backend createUser() 뮤테이션 실행
7. 비밀번호 해싱
8. Database에 INSERT
9. 생성된 ManagerUser 반환
10. Apollo Client 캐시 업데이트
11. refetchQueries 실행 (GET_USERS)
12. 목록 자동 새로고침
13. 토스트 메시지 표시
14. 폼 닫기
```

이것이 **전체 데이터 흐름**입니다! 각 계층이 어떻게 연결되는지 이제 명확할 것입니다. 🎉
