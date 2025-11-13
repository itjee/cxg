# Manager-Web 구조 리팩토링 가이드

**작성일**: 2025-01-06  
**목적**: Manager-Web을 Tenants-Web과 동일한 구조로 통일  
**범위**: /app 및 /features 폴더 구조 및 코딩 스타일

---

## 🎯 목표 구조

### Tenants-Web 표준 구조
```
features/{모듈}/{엔티티}/
├── components/          # UI 컴포넌트
├── hooks/               # Custom React Hooks
├── services/            # API 서비스 레이어
├── types/               # TypeScript 타입 정의
├── stores/              # Zustand 상태 관리 (선택적)
└── index.ts             # 통합 export
```

---

## 📊 현재 상태 분석

### Manager-Web (현재)
```
features/
├── auth/               ✅ 이미 완료
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── stores/
│   ├── providers/
│   └── index.ts
│
├── idam/               ⚠️ 리팩토링 필요
│   ├── user/          → users/ (복수형으로 변경)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── ❌ stores/ (없음 - 추가 필요)
│   ├── role/          → roles/ (복수형으로 변경)
│   └── permission/    → permissions/ (복수형으로 변경)
│
├── tnnt/               ⚠️ 리팩토링 필요
│   ├── tenant/        → tenants/
│   └── subscription/  → subscriptions/
│
└── ... (기타 모듈들)
```

### Tenants-Web (목표)
```
features/
├── auth/               ✅ 표준 구조
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── stores/
│   ├── providers/
│   └── index.ts
│
├── sys/                ✅ 표준 구조
│   ├── users/          # 복수형
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── stores/
│   │   └── index.ts
│   ├── roles/
│   └── permissions/
│
└── ...
```

---

## 🔧 리팩토링 체크리스트

### 1. 폴더명 복수형으로 변경
```bash
# Before
features/idam/user/
features/idam/role/
features/idam/permission/
features/tnnt/tenant/
features/tnnt/subscription/

# After
features/idam/users/
features/idam/roles/
features/idam/permissions/
features/tnnt/tenants/
features/tnnt/subscriptions/
```

### 2. stores 폴더 추가
```
features/{모듈}/{엔티티}/
├── stores/
│   └── {entity}.store.ts    # Zustand store
└── index.ts                 # export 추가
```

### 3. index.ts 통합 export 추가
```typescript
/**
 * {Entity} feature exports
 */

// Components
export { {Entity}Header } from "./components/{entity}-header";
export { {Entity}Stats } from "./components/{entity}-stats";
export { {Entity}Filters } from "./components/{entity}-filters";
export { {Entity}Table } from "./components/{entity}-table";
export { {Entity}Edit } from "./components/{entity}-edit";

// Hooks
export { 
  use{Entities},
  use{Entity},
  useCreate{Entity},
  useUpdate{Entity},
  useDelete{Entity}
} from "./hooks/use-{entities}";

// Stores (if exists)
export { use{Entity}Store } from "./stores/{entity}.store";

// Services
export { {entity}Service } from "./services/{entity}.service";

// Types
export type {
  {Entity},
  Create{Entity}Request,
  Update{Entity}Request,
  {Entity}ListResponse,
  {Entity}QueryParams,
} from "./types/{entity}.types";
```

---

## 📝 리팩토링 단계별 가이드

### Phase 1: 구조 정리 (1-2주)

#### Step 1.1: 폴더명 변경
```bash
cd apps/manager-web/src/features

# idam 모듈
mv idam/user idam/users
mv idam/role idam/roles
mv idam/permission idam/permissions

# tnnt 모듈
mv tnnt/tenant tnnt/tenants
mv tnnt/subscription tnnt/subscriptions

# 기타 모듈들도 동일하게 처리
```

#### Step 1.2: stores 폴더 추가
```bash
# 각 엔티티별로 stores 폴더 생성
mkdir -p features/idam/users/stores
mkdir -p features/idam/roles/stores
mkdir -p features/idam/permissions/stores
mkdir -p features/tnnt/tenants/stores
mkdir -p features/tnnt/subscriptions/stores
```

#### Step 1.3: index.ts 파일 추가
```bash
# 각 엔티티별로 index.ts 생성
touch features/idam/users/index.ts
touch features/idam/roles/index.ts
touch features/idam/permissions/index.ts
touch features/tnnt/tenants/index.ts
touch features/tnnt/subscriptions/index.ts
```

---

### Phase 2: 코드 스타일 통일 (2-3주)

#### 2.1 TypeScript 타입 정의 표준화

**Before (기존)**
```typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
}

export interface UserCreate {
  name: string;
}
```

**After (표준)**
```typescript
// types/users.types.ts
/**
 * @file users.types.ts
 * @description 사용자 관리 TypeScript 타입 정의
 */

/**
 * 사용자 정보 (DB 스키마 기반)
 */
export interface User {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;

  // 사용자 정보
  username: string;
  email: string;
  full_name?: string;
  
  // 상태
  is_active: boolean;
  is_deleted: boolean;
}

/**
 * 사용자 생성 요청
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

/**
 * 사용자 수정 요청
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
}

/**
 * 사용자 목록 응답 (페이징)
 */
export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 사용자 쿼리 파라미터
 */
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
```

#### 2.2 서비스 레이어 표준화

**Before (기존)**
```typescript
// services/user.service.ts
export const getUsers = async () => {
  return await api.get('/users');
};
```

**After (표준)**
```typescript
// services/users.service.ts
/**
 * @file users.service.ts
 * @description 사용자 관리 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserQueryParams,
} from "../types/users.types";

/**
 * 백엔드 API 응답 인터페이스
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/idam/users";

/**
 * 사용자 서비스 객체
 */
export const userService = {
  /**
   * 사용자 목록 조회
   */
  async listUsers(
    params?: UserQueryParams,
    signal?: AbortSignal
  ): Promise<UserListResponse> {
    try {
      const response = await api.get<ApiResponse<UserListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          active: params?.active,
        },
        signal,
      });
      
      return response.data.data || { 
        items: [], 
        total: 0, 
        page: 1, 
        page_size: 10,
        total_pages: 0
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listUsers");
    }
  },

  /**
   * 사용자 상세 조회
   */
  async getUser(id: string, signal?: AbortSignal): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('User not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getUser(${id})`);
    }
  },

  /**
   * 사용자 생성
   */
  async createUser(
    data: CreateUserRequest,
    signal?: AbortSignal
  ): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as User);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createUser");
    }
  },

  /**
   * 사용자 수정
   */
  async updateUser(
    id: string,
    data: UpdateUserRequest,
    signal?: AbortSignal
  ): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as User);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateUser(${id})`);
    }
  },

  /**
   * 사용자 삭제
   */
  async deleteUser(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteUser(${id})`);
    }
  },
};
```

#### 2.3 React Hooks 표준화

**Before (기존)**
```typescript
// hooks/useUsers.ts
export const useUsers = () => {
  return useQuery(['users'], getUsers);
};
```

**After (표준)**
```typescript
// hooks/use-users.ts
/**
 * @file use-users.ts
 * @description 사용자 관리 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/users.service';
import type { UserQueryParams } from '../types/users.types';

/**
 * 사용자 목록 조회 hook
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: ({ signal }) => userService.listUsers(params, signal),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
  });
}

/**
 * 사용자 상세 조회 hook
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: ({ signal }) => userService.getUser(id, signal),
    enabled: !!id,
  });
}

/**
 * 사용자 생성 mutation hook
 */
export function useCreateUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 사용자 수정 mutation hook
 */
export function useUpdateUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 사용자 삭제 mutation hook
 */
export function useDeleteUser(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
```

#### 2.4 Components 표준화

**파일명 규칙**
```
components/
├── users-header.tsx      # 페이지 헤더
├── users-stats.tsx       # 통계 카드
├── users-filters.tsx     # 검색/필터
├── users-table.tsx       # 데이터 테이블
├── users-edit.tsx        # 생성/수정 폼
└── index.ts              # 통합 export
```

**컴포넌트 구조**
```typescript
/**
 * @file users-table.tsx
 * @description 사용자 데이터 테이블 컴포넌트
 */

'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { User } from '../types/users.types';

interface UsersTableProps {
  data: User[];
  totalItems: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * 사용자 테이블 컴포넌트
 */
export function UsersTable({
  data,
  totalItems,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="space-y-4">
      {/* 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자명</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.is_active ? '활성' : '비활성'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

#### 2.5 Page 컴포넌트 표준화

**Before (기존)**
```typescript
// app/(main)/idam/user/page.tsx
export default function UserPage() {
  // ...
}
```

**After (표준)**
```typescript
// app/(main)/idam/users/page.tsx
/**
 * @file page.tsx
 * @description 사용자 관리 페이지
 * 
 * @features
 * - 서버 사이드 페이징
 * - 실시간 필터링
 * - CRUD 작업
 * - 통계 대시보드
 */

'use client';

import { toast } from 'sonner';
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useDeleteUser,
} from '@/features/idam/users';
import { useUserStore } from '@/features/idam/users/stores';

/**
 * 사용자 관리 페이지 컴포넌트
 */
export default function UsersPage() {
  const {
    selectedRole,
    selectedStatus,
    currentPage,
    itemsPerPage,
    globalFilter,
  } = useUserStore();

  const { data: usersResponse, isLoading, refetch } = useUsers({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : 
            selectedStatus === 'inactive' ? false : undefined,
  });

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success('사용자가 삭제되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '사용자 삭제에 실패했습니다');
    },
  });

  const users = usersResponse?.items || [];
  const totalItems = usersResponse?.total || 0;

  const handleRefresh = () => refetch();

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={handleRefresh} />
      <UsersStats users={users} />
      <UsersFilters users={users} />
      <UsersTable
        data={users}
        totalItems={totalItems}
        onEdit={(user) => useUserStore.getState().openForm(user.id)}
        onDelete={(user) => {
          if (confirm(`'${user.full_name || user.username}' 사용자를 삭제하시겠습니까?`)) {
            deleteUserMutation.mutate(user.id);
          }
        }}
      />
      <UsersEdit users={users} />
    </div>
  );
}
```

---

## 📁 파일명 규칙

### 1. 복수형 사용
```
✅ users/      (O)
❌ user/       (X)

✅ roles/      (O)
❌ role/       (X)

✅ permissions/ (O)
❌ permission/  (X)
```

### 2. Kebab-case 사용
```
✅ users-table.tsx      (O)
❌ UsersTable.tsx       (X)
❌ users_table.tsx      (X)

✅ use-users.ts         (O)
❌ useUsers.ts          (X)

✅ users.service.ts     (O)
❌ users.Service.ts     (X)
```

### 3. 확장자 명확히
```
✅ users.types.ts       (타입 정의)
✅ users.service.ts     (서비스 로직)
✅ users.store.ts       (상태 관리)
✅ use-users.ts         (React Hook)
✅ users-table.tsx      (컴포넌트)
```

---

## 🎨 코딩 스타일 가이드

### 1. JSDoc 주석 필수
```typescript
/**
 * @file users.service.ts
 * @description 사용자 관리 서비스 레이어
 */

/**
 * 사용자 목록 조회
 * 
 * @param params - 쿼리 파라미터
 * @param signal - AbortSignal
 * @returns UserListResponse
 * @throws {ApiError}
 */
async listUsers(params?: UserQueryParams, signal?: AbortSignal): Promise<UserListResponse>
```

### 2. 명확한 타입 정의
```typescript
// ❌ Bad
const data: any = await api.get('/users');

// ✅ Good
const response = await api.get<ApiResponse<UserListResponse>>('/users');
const data: UserListResponse = response.data.data;
```

### 3. 에러 처리 표준화
```typescript
try {
  const response = await api.get('/users');
  return response.data.data;
} catch (error) {
  throw ApiError.fromAxiosError(error, "listUsers");
}
```

### 4. 일관된 네이밍
```typescript
// Services
export const userService = { ... };
export const roleService = { ... };

// Hooks
export function useUsers() { ... }
export function useUser(id: string) { ... }
export function useCreateUser() { ... }

// Components
export function UsersTable() { ... }
export function UsersHeader() { ... }
export function UsersEdit() { ... }

// Stores
export const useUserStore = create<UserStore>()( ... );
```

---

## 🚀 자동화 스크립트

### 1. 폴더 생성 스크립트
```bash
#!/bin/bash
# scripts/create-feature.sh

MODULE=$1
ENTITY=$2

if [ -z "$MODULE" ] || [ -z "$ENTITY" ]; then
  echo "Usage: ./create-feature.sh {module} {entity}"
  echo "Example: ./create-feature.sh idam users"
  exit 1
fi

BASE_DIR="apps/manager-web/src/features/${MODULE}/${ENTITY}"

# 폴더 생성
mkdir -p "${BASE_DIR}/components"
mkdir -p "${BASE_DIR}/hooks"
mkdir -p "${BASE_DIR}/services"
mkdir -p "${BASE_DIR}/types"
mkdir -p "${BASE_DIR}/stores"

# index.ts 생성
cat > "${BASE_DIR}/index.ts" << 'EOF'
/**
 * ${ENTITY^} feature exports
 */

// Components
export * from "./components";

// Hooks
export * from "./hooks/use-${ENTITY}";

// Services
export { ${ENTITY}Service } from "./services/${ENTITY}.service";

// Types
export type * from "./types/${ENTITY}.types";

// Stores
export { use${ENTITY^}Store } from "./stores/${ENTITY}.store";
EOF

echo "✅ Feature structure created: ${BASE_DIR}"
```

### 2. 사용 예시
```bash
cd /home/itjee/workspace/cxg
chmod +x scripts/create-feature.sh

# 새로운 feature 생성
./scripts/create-feature.sh idam users
./scripts/create-feature.sh tnnt tenants
./scripts/create-feature.sh bill invoices
```

---

## 📋 모듈별 리팩토링 우선순위

### Priority 1 (즉시) - 핵심 모듈
- [ ] `idam/user` → `idam/users`
- [ ] `idam/role` → `idam/roles`
- [ ] `idam/permission` → `idam/permissions`
- [ ] `tnnt/tenant` → `tnnt/tenants`
- [ ] `tnnt/subscription` → `tnnt/subscriptions`

### Priority 2 (1주 내) - 자주 사용하는 모듈
- [ ] `bill/invoice` → `bill/invoices`
- [ ] `bill/payment` → `bill/payments`
- [ ] `noti/notification` → `noti/notifications`
- [ ] `noti/campaign` → `noti/campaigns`
- [ ] `supt/ticket` → `supt/tickets`

### Priority 3 (2주 내) - 나머지 모듈
- [ ] `auto/workflow` → `auto/workflows`
- [ ] `auto/schedule` → `auto/schedules`
- [ ] `cnfg/feature` → `cnfg/features`
- [ ] `bkup/backup` → `bkup/backups`
- [ ] 기타 모듈들

---

## ✅ 완료 기준

각 모듈이 다음 조건을 만족하면 완료:

1. **구조**
   - [ ] 복수형 폴더명
   - [ ] components/, hooks/, services/, types/, stores/ 폴더 존재
   - [ ] index.ts 파일 존재 및 통합 export 구현

2. **파일명**
   - [ ] Kebab-case 사용
   - [ ] 명확한 확장자 (.types.ts, .service.ts, .store.ts)

3. **코드**
   - [ ] JSDoc 주석 작성
   - [ ] TypeScript 타입 명확히 정의
   - [ ] 에러 처리 표준화
   - [ ] 일관된 네이밍 규칙

4. **테스트**
   - [ ] TypeScript 컴파일 에러 없음
   - [ ] Import 경로 정상 동작
   - [ ] 빌드 성공

---

## 📚 참고 문서

- `/docs/implementation/MANAGER_WEB_AUTH_REFACTORING.md` - Auth 모듈 리팩토링 예시
- `/docs/implementation/USER_INVITATION_IMPLEMENTATION.md` - 사용자 초대 구현 예시
- Tenants-Web 소스 코드: `apps/tenants-web/src/features/`

---

**작성일**: 2025-01-06  
**예상 소요 시간**: 4-6주 (전체 모듈 완료 기준)  
**점진적 적용**: 모듈별로 하나씩 리팩토링 권장
