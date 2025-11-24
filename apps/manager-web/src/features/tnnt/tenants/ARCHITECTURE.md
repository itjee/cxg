# Tenants Feature Architecture

Manager 시스템의 테넌트 관리 기능입니다.

## 개요

테넌트 기능은 GraphQL Apollo Client 기반의 Feature-driven 아키텍처를 따릅니다.

## 파일 구조

```
tenants/
├── components/              # UI 컴포넌트 (7가지 필수 컴포넌트)
│   ├── tenants-columns.tsx  # 테이블 컬럼 정의
│   ├── tenants-table.tsx    # 테넌트 목록 테이블
│   ├── tenants-filter.tsx   # 필터 UI
│   ├── tenants-form.tsx     # 생성/수정 폼
│   ├── tenants-edit.tsx     # 수정 모달
│   ├── tenants-header.tsx   # 헤더 (제목, 버튼 등)
│   ├── tenants-stats.tsx    # 통계 카드
│   └── index.ts
│
├── config/                  # 폼 설정 및 검증 스키마
│   ├── tenants-form-config.ts
│   └── index.ts
│
├── graphql/                 # GraphQL 쿼리/뮤테이션 (Feature별 관리)
│   ├── queries.ts           # GET_TENANTS, GET_TENANT
│   ├── mutations.ts         # CREATE/UPDATE/DELETE_TENANT
│   └── index.ts
│
├── hooks/                   # GraphQL Hooks (Apollo Client)
│   ├── use-tenants.ts       # useTenants, useCreateTenant 등
│   └── index.ts
│
├── services/                # GraphQL Service Layer (선택)
│   ├── tenants.service.ts   # Apollo를 래핑한 서비스 (테스트용)
│   └── index.ts
│
├── stores/                  # Zustand UI 상태 관리
│   ├── tenants.store.ts     # UI 상태만 관리 (필터, 페이지, 폼 등)
│   └── index.ts
│
├── types/                   # TypeScript 타입 (GraphQL 네이티브)
│   ├── tenants.types.ts     # Tenant, CreateTenantRequest 등
│   └── index.ts
│
├── utils/                   # 유틸리티 함수
│   ├── formatters.ts        # 포맷팅 함수 (상태 라벨, 색상 등)
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
Hook: useTenants (GraphQL)
  ↓
Apollo Client Query (GET_TENANTS)
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
Hook: useUpdateTenant (GraphQL)
  ↓
Apollo Client Mutation (UPDATE_TENANT)
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
export const GET_TENANTS = gql`
  query GetTenants($limit: Int, $offset: Int, ...) {
    tenants(...) {
      id
      code
      name
      ...
    }
  }
`;

export interface TenantsQueryVariables {
  limit?: number;
  offset?: number;
  // ...
}
```

### 2. GraphQL Hooks (hooks/)

Apollo Client의 useQuery/useMutation을 래핑한 Hooks입니다.

```typescript
// hooks/use-tenants.ts
export function useTenants(variables?: TenantsQueryVariables) {
  return useQuery<{ tenants: Tenant[] }>(GET_TENANTS, {
    variables: { limit: 20, offset: 0, ...variables },
    fetchPolicy: "cache-and-network",
  });
}
```

**컴포넌트에서 사용:**

```typescript
const { data, loading, error, refetch } = useTenants({ limit: 20 });
```

### 3. 타입 정의 (types/)

GraphQL 스키마와 직접 매칭되는 camelCase 타입입니다.

```typescript
export interface Tenant {
  id: string;
  code: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}
```

**원칙**: GraphQL 네이티브 → 불필요한 변환 없음 → 성능 향상

### 4. Zustand Store (stores/)

**UI 상태만 관리합니다. 서버 상태는 Apollo가 관리합니다.**

```typescript
// stores/tenants.store.ts
interface TenantsStore {
  // UI 상태
  selectedStatus: TenantStatus | "";
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // 액션
  setSelectedStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
  // ...
}
```

**서버 상태 vs UI 상태:**

| 항목          | 관리자  | 저장 위치 | 동기화              |
| ------------- | ------- | --------- | ------------------- |
| 테넌트 데이터 | Apollo  | Cache     | 쿼리/뮤테이션       |
| 필터 상태     | Zustand | Store     | setSelectedStatus() |
| 현재 페이지   | Zustand | Store     | setCurrentPage()    |
| 폼 열림/닫힘  | Zustand | Store     | openForm()          |

### 5. 폼 설정 (config/)

생성/수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.

```typescript
// config/tenants-form-config.ts
export const tenantFormSchema = z.object({
  code: z.string().min(1, "테넌트 코드를 입력해주세요"),
  name: z.string().min(1, "테넌트명을 입력해주세요"),
  type: z.enum(["TRIAL", "STANDARD", "PREMIUM", "ENTERPRISE"]),
  // ...
});

export const tenantFormConfig: FormConfig<TenantFormData> = {
  schema: tenantFormSchema,
  defaultValues: { ... },
  sections: [ ... ]
};
```

### 6. 유틸리티 함수 (utils/)

데이터 포맷팅, 라벨, 색상 등을 관리합니다.

```typescript
// utils/formatters.ts
export const formatTenantStatus = (status: string): string => {
  return tenantStatusLabels[status as keyof typeof tenantStatusLabels] || status;
};

export const getTenantStatusColor = (status: string): string => {
  return tenantStatusColors[status as keyof typeof tenantStatusColors];
};
```

### 7. Service Layer (services/) - 선택사항

Apollo를 직접 호출하는 대신 Service를 통해 호출할 수 있습니다.
테스트나 특수한 상황에서만 사용합니다.

```typescript
// 일반적인 방식 (권장)
const { data } = useTenants();

// Service를 통한 방식 (테스트용)
const tenants = await tenantsService.listTenants({ limit: 20 });
```

## 컴포넌트 개발 가이드

### 목록 페이지 예시

```typescript
"use client";

import { useTenants, useUpdateTenant } from "@/features/tnnt/tenants";
import { useTenantsStore } from "@/features/tnnt/tenants";
import { TenantsTable, TenantsFilter, TenantsHeader } from "@/features/tnnt/tenants";

export default function TenantsPage() {
  // 1. Store에서 UI 상태 가져오기
  const { selectedStatus, currentPage, itemsPerPage } = useTenantsStore();

  // 2. GraphQL 쿼리 (Apollo Hooks)
  const { data, loading, error, refetch } = useTenants({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    status: selectedStatus || undefined,
  });

  // 3. GraphQL 뮤테이션 (수정)
  const [updateTenant, { loading: updating }] = useUpdateTenant();

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateTenant({
        variables: { id, input: data },
      });
      toast.success("테넌트가 수정되었습니다");
    } catch (err) {
      toast.error("수정 실패");
    }
  };

  if (loading) return <div>로딩...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <TenantsHeader onRefresh={() => refetch()} />
      <TenantsFilter />
      <TenantsTable
        data={data?.tenants || []}
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
const { data, loading, error, refetch } = useTenants({
  limit: 20,
  offset: 0,
  status: "ACTIVE",
});

// 상세 조회
const { data, loading, error } = useTenant("tenant-id");
```

### 수정 Hooks

```typescript
// 생성
const [createTenant, { loading }] = useCreateTenant();
await createTenant({
  variables: {
    input: {
      code: "tenant-001",
      name: "Tenant Name",
      type: "STANDARD",
      // ...
    }
  }
});

// 수정
const [updateTenant, { loading }] = useUpdateTenant();
await updateTenant({
  variables: {
    id: "tenant-id",
    input: { name: "Updated Name", ... }
  }
});

// 삭제
const [deleteTenant, { loading }] = useDeleteTenant();
await deleteTenant({
  variables: { id: "tenant-id" }
});
```

## 베스트 프랙티스

### ✅ DO

```typescript
// 1. Hook 사용 (권장)
const { data } = useTenants();

// 2. GraphQL 네이티브 타입 사용
const tenant: Tenant = { id: '1', ... };

// 3. Apollo Cache 활용
// refetchQueries로 자동 캐시 갱신

// 4. 에러 처리
if (error) {
  toast.error(error.message);
}

// 5. 유틸리티 함수 사용
const label = formatTenantStatus(tenant.status);
const color = getTenantStatusColor(tenant.status);
```

### ❌ DON'T

```typescript
// 1. Service를 일반적으로 사용 (테스트용만)
// const tenants = await tenantsService.listTenants();

// 2. snake_case 타입 (REST 스타일)
// interface Tenants { tenant_code: string; ... }

// 3. 수동 캐시 관리
// apollo.cache.modify(...)

// 4. 직접 Apollo 호출 (Hooks 사용)
// useQuery(GET_TENANTS)
```

## 타입 안전성

### GraphQL 응답 타입

```typescript
interface GetTenantsResponse {
  tenants: Tenant[];
}

const { data } = useTenants();
// data: { tenants: Tenant[] } | undefined
```

### 변수 타입

```typescript
interface TenantsQueryVariables {
  limit?: number;
  offset?: number;
  status?: TenantStatus;
  type?: TenantType;
}
```

## 성능 최적화

### 1. fetchPolicy 설정

- `cache-and-network`: 캐시 먼저, 동시에 네트워크 요청 (기본값)
- `network-only`: 항상 네트워크 요청
- `cache-first`: 캐시만 사용

### 2. 페이지네이션

```typescript
const { data, refetch } = useTenants({
  limit: itemsPerPage,
  offset: currentPage * itemsPerPage,
});
```

### 3. 필터링

```typescript
const { data } = useTenants({
  status: selectedStatus || undefined,
  type: selectedType || undefined,
});
```

## 마이그레이션 가이드

### 기존 코드 (React Query)

```typescript
import { useTenants } from "@/features/tnnt/tenants";

const { data } = useTenants({ page: 1 });
```

### 새로운 코드 (Apollo GraphQL)

```typescript
import { useTenants } from "@/features/tnnt/tenants";

const { data } = useTenants({ limit: 20, offset: 0 });
```

## 참고자료

- [Apollo Client 공식 문서](https://www.apollographql.com/docs/react/)
- [프론트엔드 개발 가이드](../../../../docs/05_frontend/00_프론트엔드_개발가이드_20241114.md)
- [Feature-driven 아키텍처](../../../../docs/05_frontend/00_프론트엔드_개발가이드_20241114.md#feature-driven-architecture)

---

**상태**: ✅ GraphQL 아키텍처 구성 완료
**마지막 업데이트**: 2025년 11월 23일
