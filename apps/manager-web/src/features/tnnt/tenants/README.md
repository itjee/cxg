# Tenants Feature

테넌트 관리 기능 모듈

## 📁 구조

```
tenants/
├── README.md
├── components/
│   ├── tenants-columns.tsx    # 테이블 컬럼 정의 (필수) ✨ NEW
│   ├── tenants-table.tsx      # 데이터 테이블 (필수)
│   ├── tenants-edit.tsx       # 수정 Drawer (필수)
│   ├── tenants-form.tsx       # 생성/수정 폼 (필수)
│   ├── tenants-header.tsx     # 페이지 헤더 (필수)
│   ├── tenants-filters.tsx    # 검색/필터 UI (필수)
│   ├── tenants-stats.tsx      # 통계 카드 (필수)
│   └── index.ts
├── hooks/
│   ├── use-tenants.ts         # TanStack Query hooks (개선됨)
│   └── index.ts
├── services/
│   ├── tenants.service.ts     # API 서비스
│   └── index.ts
├── stores/
│   ├── tenants.store.ts       # Zustand store
│   └── index.ts
├── types/
│   ├── tenants.types.ts       # 타입 정의
│   └── index.ts
└── index.ts
```

## 🎯 주요 컴포넌트

### 필수 컴포넌트 (7개)

1. **tenants-columns.tsx** - 테이블 컬럼 정의 ✨ NEW
   - 포맷 함수 (상태, 날짜)
   - 상수 정의 (색상, 라벨)
   - 컬럼 정의

2. **tenants-table.tsx** - 데이터 테이블 (개선됨)
   - DataTable 컴포넌트 사용
   - 정렬 상태 연동
   - 페이지네이션

3. **tenants-edit.tsx** - 수정 Drawer
   - EntityDrawer 사용
   - 생성/수정 모드 분기
   - Mutation 처리

4. **tenants-form.tsx** - 생성/수정 폼
   - React Hook Form + Zod
   - 유효성 검증
   - 활성 상태 Switch

5. **tenants-header.tsx** - 페이지 헤더
   - 액션 버튼 (새로고침, 추가)

6. **tenants-filters.tsx** - 검색/필터
   - 텍스트 검색
   - 상태 필터

7. **tenants-stats.tsx** - 통계 카드
   - 통계 정보 (전체, 활성, 비활성)

## 📊 상태 관리

### 서버 상태 (TanStack Query)

- `useTenants` - 목록 조회
- `useTenant` - 상세 조회
- `useCreateTenant` - 생성
- `useUpdateTenant` - 수정
- `useDeleteTenant` - 삭제

### Query Key Factory ✨ NEW

```typescript
export const tenantsKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantsKeys.all, 'list'] as const,
  list: (params?) => [...tenantsKeys.lists(), params] as const,
  detail: (id) => [...tenantsKeys.all, 'detail', id] as const,
};
```

**장점:**
- 타입 안전성 향상
- 캐시 무효화 로직 일관성
- Query Key 관리 용이

### UI 상태 (Zustand)

- `globalFilter` - 검색어
- `selectedStatus` - 상태 필터
- `sorting` - 정렬 상태
- `formOpen` - 폼 Drawer 열림 여부
- `editingId` - 편집 중인 테넌트 ID
- `currentPage` - 현재 페이지
- `itemsPerPage` - 페이지당 아이템 수

## 🔌 API 엔드포인트

- `GET /api/v1/manager/tenants` - 목록 조회
- `GET /api/v1/manager/tenants/:id` - 상세 조회
- `POST /api/v1/manager/tenants` - 생성
- `PUT /api/v1/manager/tenants/:id` - 수정
- `DELETE /api/v1/manager/tenants/:id` - 삭제

## 📝 타입

### Tenant

```typescript
interface Tenant {
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted: boolean;
}
```

### CreateTenantRequest

```typescript
interface CreateTenantRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}
```

### UpdateTenantRequest

```typescript
interface UpdateTenantRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}
```

## 🚀 사용 예시

```typescript
import {
  TenantsHeader,
  TenantsStats,
  TenantsFilters,
  TenantsTable,
  TenantsEdit,
  useTenants,
  useTenantStore,
} from "@/features/tnnt/tenants";

export default function TenantsPage() {
  const { data, refetch } = useTenants();
  const { openForm } = useTenantStore();

  return (
    <div className="space-y-6">
      <TenantsHeader onRefresh={refetch} />
      <TenantsStats tenants={data?.data || []} />
      <TenantsFilters />
      <TenantsTable
        data={data?.data || []}
        onEdit={(tenant) => openForm(tenant.id)}
        onDelete={(tenant) => console.log("Delete", tenant)}
      />
      <TenantsEdit />
    </div>
  );
}
```

## 🔄 최근 변경사항

### 2025-01-07

1. **tenants-columns.tsx 생성** ✨ NEW
   - columns + table 분리 패턴 적용
   - 포맷 함수 및 상수 정의
   - 다크 모드 색상 지원

2. **use-tenants.ts 개선**
   - Query Key Factory 패턴 적용
   - 캐시 무효화 로직 개선

3. **tenants-table.tsx 개선**
   - columns 파일 사용하도록 변경
   - 제네릭 타입 제거하고 명시적 Tenant 타입 사용

## 📚 참고

- [프론트엔드 개발 가이드](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md)
- [Feature 구조 표준](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md#feature-구조-표준)
