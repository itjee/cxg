# Users Feature Architecture

Manager 시스템의 사용자(Manager Users) 관리 기능입니다.

## 개요

사용자 기능은 GraphQL Apollo Client 기반의 Feature-driven 아키텍처를 따릅니다.

## 파일 구조

```
users/
├── components/              # UI 컴포넌트 (7가지 필수 컴포넌트)
│   ├── users-columns.tsx    # 테이블 컬럼 정의
│   ├── users-table.tsx      # 사용자 목록 테이블
│   ├── users-filters.tsx    # 필터 UI
│   ├── users-form.tsx       # 생성/수정 폼
│   ├── users-edit.tsx       # 수정 모달
│   ├── users-header.tsx     # 헤더 (제목, 버튼 등)
│   ├── users-stats.tsx      # 통계 카드
│   └── index.ts
│
├── graphql/                 # GraphQL 쿼리/뮤테이션 (Feature별 관리)
│   ├── queries.ts           # GET_USERS, GET_USER
│   ├── mutations.ts         # CREATE/UPDATE_USER
│   └── index.ts
│
├── hooks/                   # GraphQL Hooks (Apollo Client)
│   ├── use-users.ts         # useUsers, useCreateUser 등
│   └── index.ts
│
├── services/                # GraphQL Service Layer (선택)
│   ├── users.service.ts     # Apollo를 래핑한 서비스 (테스트용)
│   └── index.ts
│
├── stores/                  # Zustand UI 상태 관리
│   ├── users.store.ts       # UI 상태만 관리 (필터, 페이지, 폼 등)
│   └── index.ts
│
├── types/                   # TypeScript 타입 (GraphQL 네이티브)
│   ├── users.types.ts       # User, CreateUserRequest 등
│   └── index.ts
│
├── index.ts                 # Public API (공개 인터페이스)
└── ARCHITECTURE.md          # 이 파일
```

## 데이터 흐름

### 조회 흐름 (Query)

```
Page
  ↓
Component (UI 렌더링)
  ↓
Hook: useUsers (GraphQL)
  ↓
Apollo Client Query (GET_USERS)
  ↓
Backend GraphQL API
  ↓
Apollo Cache (데이터 관리)
  ↓
Component로 데이터 전달
```

### 수정 흐름 (Mutation)

```
Component (폼 제출)
  ↓
Hook: useUpdateUser (GraphQL)
  ↓
Apollo Client Mutation (UPDATE_USER)
  ↓
Backend GraphQL API
  ↓
refetchQueries로 자동 캐시 갱신
  ↓
UI 자동 업데이트
```

## 주요 개념

### 1. GraphQL 쿼리/뮤테이션 (graphql/)

Feature 내부에서 관리하는 GraphQL 정의입니다.

```typescript
// graphql/queries.ts
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, ...) {
    Users(...) {
      id
      username
      email
      ...
    }
  }
`;

export interface GetUsersVariables {
  limit?: number;
  offset?: number;
  // ...
}
```

### 2. GraphQL Hooks (hooks/)

Apollo Client의 useQuery/useMutation을 래핑한 Hooks입니다.

```typescript
// hooks/use-users.ts
export function useUsers(variables?: GetUsersVariables) {
  return useQuery<{ Users: User[] }>(GET_USERS, {
    variables: { limit: 20, offset: 0, ...variables },
    fetchPolicy: "cache-and-network",
  });
}
```

**컴포넌트에서 사용:**

```typescript
const { data, loading, error, refetch } = useUsers({ limit: 20 });
```

### 3. 타입 정의 (types/)

GraphQL 스키마와 직접 매칭되는 camelCase 타입입니다.

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}
```

**원칙**: GraphQL 네이티브 → 불필요한 변환 없음 → 성능 향상

### 4. Zustand Store (stores/)

**UI 상태만 관리합니다. 서버 상태는 Apollo가 관리합니다.**

```typescript
// stores/users.store.ts
interface UsersStore {
  // UI 상태
  selectedStatus: "ACTIVE" | "INACTIVE" | "";
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  sorting: Array<{ id: string; desc: boolean }>;

  // 액션
  setSelectedStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
  // ...
}
```

**서버 상태 vs UI 상태:**

| 항목          | 관리자  | 저장 위치 | 동기화              |
| ------------- | ------- | --------- | ------------------- |
| 사용자 데이터 | Apollo  | Cache     | 쿼리/뮤테이션       |
| 필터 상태     | Zustand | Store     | setSelectedStatus() |
| 현재 페이지   | Zustand | Store     | setCurrentPage()    |
| 폼 열림/닫힘  | Zustand | Store     | openForm()          |

### 5. Service Layer (services/) - 선택사항

Apollo를 직접 호출하는 대신 Service를 통해 호출할 수 있습니다.
테스트나 특수한 상황에서만 사용합니다.

```typescript
// 일반적인 방식 (권장)
const { data } = useUsers();

// Service를 통한 방식 (테스트용)
const users = await usersService.listUsers({ limit: 20 });
```

## 컴포넌트 개발 가이드

### 목록 페이지 예시

```typescript
"use client";

import { useUsers, useUpdateUser } from "@/features/idam/users";
import { useUsersStore } from "@/features/idam/users";
import { UsersTable, UsersFilters, UsersHeader } from "@/features/idam/users";

export default function UsersPage() {
  // 1. Store에서 UI 상태 가져오기
  const { selectedStatus, currentPage, itemsPerPage } = useUsersStore();

  // 2. GraphQL 쿼리 (Apollo Hooks)
  const { data, loading, error, refetch } = useUsers({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: selectedStatus || undefined,
  });

  // 3. GraphQL 뮤테이션 (수정)
  const [updateUser, { loading: updating }] = useUpdateUser();

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateUser({
        variables: { id, input: data },
      });
      toast.success("사용자가 수정되었습니다");
    } catch (err) {
      toast.error("수정 실패");
    }
  };

  if (loading) return <div>로딩...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={() => refetch()} />
      <UsersFilters />
      <UsersTable
        data={data?.Users || []}
        onUpdate={handleUpdate}
        isLoading={updating}
      />
    </div>
  );
}
```

## 주요 Hooks

### 조회 Hooks

```typescript
// 목록 조회
const { data, loading, error, refetch } = useUsers({
  limit: 20,
  offset: 0,
  status: "ACTIVE",
});

// 상세 조회
const { data, loading, error } = useUser("user-id");
```

### 수정 Hooks

```typescript
// 생성
const [createUser, { loading }] = useCreateUser();
await createUser({
  variables: {
    input: {
      username: "admin",
      email: "admin@example.com",
      password: "...",
      fullName: "Administrator",
      userType: "MASTER"
    }
  }
});

// 수정
const [updateUser, { loading }] = useUpdateUser();
await updateUser({
  variables: {
    id: "user-id",
    input: { email: "newemail@example.com", ... }
  }
});
```

## 베스트 프랙티스

### ✅ DO

```typescript
// 1. Hook 사용 (권장)
const { data } = useUsers();

// 2. GraphQL 네이티브 타입 사용
const user: User = { id: '1', ... };

// 3. Apollo Cache 활용
// refetchQueries로 자동 캐시 갱신

// 4. 에러 처리
if (error) {
  toast.error(error.message);
}
```

### ❌ DON'T

```typescript
// 1. Service를 일반적으로 사용 (테스트용만)
// const users = await usersService.listUsers();

// 2. snake_case 타입 (REST 스타일)
// interface Users { user_name: string; ... }

// 3. 수동 캐시 관리
// apollo.cache.modify(...)

// 4. 직접 Apollo 호출 (Hooks 사용)
// useQuery(GET_USERS)
```

## 타입 안전성

### GraphQL 응답 타입

```typescript
interface GetUsersResponse {
  Users: User[];
}

const { data } = useUsers();
// data: { Users: User[] } | undefined
```

### 변수 타입

```typescript
interface GetUsersVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}
```

## 성능 최적화

### 1. fetchPolicy 설정

- `cache-and-network`: 캐시 먼저, 동시에 네트워크 요청 (기본값)
- `network-only`: 항상 네트워크 요청
- `cache-first`: 캐시만 사용

### 2. 페이지네이션

```typescript
const { data, refetch } = useUsers({
  limit: itemsPerPage,
  offset: currentPage * itemsPerPage,
});
```

### 3. 필터링

```typescript
const { data } = useUsers({
  status: selectedStatus || undefined,
});
```

## 마이그레이션 가이드

### 기존 코드 (React Query)

```typescript
import { useUsers } from "@/features/idam/users";

const { data } = useUsers({ page: 1 });
```

### 새로운 코드 (Apollo GraphQL)

```typescript
import { useUsers } from "@/features/idam/users";

const { data } = useUsers({ limit: 20, offset: 0 });
```

## 참고자료

- [Apollo Client 공식 문서](https://www.apollographql.com/docs/react/)
- [프론트엔드 개발 가이드](../../../../docs/05_frontend/00_프론트엔드_개발가이드_20241114.md)
- [Feature-driven 아키텍처](../../../../docs/05_frontend/00_프론트엔드_개발가이드_20241114.md#feature-driven-architecture)

---

**상태**: ✅ GraphQL 마이그레이션 완료
**마지막 업데이트**: 2024년 11월 14일
