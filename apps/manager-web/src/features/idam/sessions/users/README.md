# Users Feature

사용자 관리 기능 모듈

## 📁 구조

```
users/
├── components/          # UI 컴포넌트 (7개 필수 컴포넌트)
│   ├── users-columns.tsx    # 테이블 컬럼 정의 (필수)
│   ├── users-table.tsx      # 데이터 테이블 (필수)
│   ├── users-edit.tsx       # 수정 모달/페이지 (필수)
│   ├── users-form.tsx       # 생성/수정 폼 (필수)
│   ├── users-header.tsx     # 페이지 헤더 (필수)
│   ├── users-filters.tsx    # 검색/필터 UI (필수)
│   ├── users-stats.tsx      # 통계 카드 (필수)
│   └── index.ts
├── hooks/              # TanStack Query hooks
│   └── use-users.ts
├── services/           # API 통신
│   └── users.service.ts
├── stores/             # Zustand 상태 관리
│   └── users.store.ts
├── types/              # 타입 정의
│   └── users.types.ts
├── index.ts            # Public API
└── README.md
```

## 🎯 주요 컴포넌트

### 필수 컴포넌트 (7개)

1. **users-columns.tsx** - 테이블 컬럼 정의
   - 포맷 함수 (상태)
   - 상수 정의 (색상, 라벨)
   - 컬럼 정의

2. **users-table.tsx** - 데이터 테이블
   - DataTable 컴포넌트 사용
   - 정렬 상태 연동
   - 페이지네이션

3. **users-edit.tsx** - 수정 Drawer
   - EntityDrawer 사용
   - 생성/수정 모드 분기
   - Mutation 처리

4. **users-form.tsx** - 생성/수정 폼
   - React Hook Form + Zod
   - 유효성 검증
   - 활성 상태 Switch

5. **users-header.tsx** - 페이지 헤더
   - ListPageHeader 사용
   - 액션 버튼 (새로고침, 추가, 내보내기)

6. **users-filters.tsx** - 검색/필터
   - ListFilter 컴포넌트 사용
   - 텍스트 검색
   - 상태 필터

7. **users-stats.tsx** - 통계 카드
   - StatsCards 컴포넌트 사용
   - 4개 지표 (전체, 활성, 비활성, 관리자)

## 📊 상태 관리

### 서버 상태 (TanStack Query)

- `useUsers` - 목록 조회
- `useUsersById` - 상세 조회
- `useCreateUsers` - 생성
- `useUpdateUsers` - 수정
- `useDeleteUsers` - 삭제

### UI 상태 (Zustand)

- `globalFilter` - 검색어
- `selectedStatus` - 상태 필터
- `sorting` - 정렬 상태
- `formOpen` - 폼 모달 열림 여부
- `selectedId` - 선택된 사용자 ID
- `currentPage` - 현재 페이지
- `itemsPerPage` - 페이지당 아이템 수

## 🔌 API 엔드포인트

- `GET /api/v1/manager/idam/users` - 목록 조회
- `GET /api/v1/manager/idam/users/:id` - 상세 조회
- `POST /api/v1/manager/idam/users` - 생성
- `PUT /api/v1/manager/idam/users/:id` - 수정
- `DELETE /api/v1/manager/idam/users/:id` - 삭제

## 📝 타입

### Users

```typescript
interface Users {
  id: string;
  created_at: string;
  updated_at?: string;
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted: boolean;
}
```

### CreateUsersRequest

```typescript
interface CreateUsersRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}
```

### UpdateUsersRequest

```typescript
interface UpdateUsersRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}
```

## 🚀 사용 예시

```typescript
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useUsersStore,
} from "@/features/idam/users";

export default function UsersPage() {
  const { data, refetch } = useUsers();
  const { openForm } = useUsersStore();

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={refetch} />
      <UsersStats users={data?.items || []} />
      <UsersFilters users={data?.items || []} />
      <UsersTable
        data={data?.items || []}
        onEdit={(user) => openForm(user.id)}
        onDelete={(user) => console.log("Delete", user)}
      />
      <UsersEdit users={data?.items || []} />
    </div>
  );
}
```

## 📚 참고

- [프론트엔드 개발 가이드](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md)
- [Feature 구조 표준](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md#feature-구조-표준)
