# IDAM 모듈 리팩토링 완료

**작업일**: 2025-01-06  
**모듈**: features/idam (users, roles, permissions, access-logs)  
**상태**: ✅ 완료

---

## ✅ 완료된 작업

### 1. 구조 리팩토링

**Before (기존)**
```
idam/
├── user/           ❌ 단수형
├── role/           ❌ 단수형
├── permission/     ❌ 단수형
└── access-log/     ❌ 단수형
```

**After (새 구조)**
```
idam/
├── users/          ✅ 복수형
│   ├── components/
│   │   ├── users-header.tsx
│   │   ├── users-stats.tsx
│   │   ├── users-filters.tsx
│   │   ├── users-table.tsx
│   │   ├── users-edit.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   └── use-users.ts
│   ├── services/
│   │   └── users.service.ts
│   ├── types/
│   │   └── users.types.ts
│   ├── stores/
│   │   └── users.store.ts
│   └── index.ts
│
├── roles/          ✅ 복수형
│   ├── components/ (5개)
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── stores/
│   └── index.ts
│
├── permissions/    ✅ 복수형
│   ├── components/ (5개)
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── stores/
│   └── index.ts
│
└── access-logs/    ✅ 복수형
    ├── components/ (5개)
    ├── hooks/
    ├── services/
    ├── types/
    ├── stores/
    └── index.ts
```

---

### 2. 페이지 생성

**생성된 페이지**
```
app/(main)/idam/
├── users/page.tsx          ✅
├── roles/page.tsx          ✅
├── permissions/page.tsx    ✅
└── access-logs/page.tsx    ✅
```

---

### 3. 컴포넌트 패턴 (공통)

각 모듈마다 동일한 5개 컴포넌트:

#### 1. Header
```typescript
// users-header.tsx
export function UsersHeader({ onRefresh, onExport }: UsersHeaderProps) {
  const { openForm } = useUsersStore();

  const actions = [
    { label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" },
    { label: "사용자 추가", icon: Plus, onClick: () => openForm(), variant: "default" },
    { label: "내보내기", icon: Download, onClick: onExport, variant: "outline" },
  ];

  return (
    <ListPageHeader
      title="사용자 관리"
      description="플랫폼 사용자를 관리합니다"
      actions={actions}
    />
  );
}
```

#### 2. Stats
```typescript
// users-stats.tsx
export function UsersStats({ users }: UsersStatsProps) {
  const total = users.length;
  const active = users.filter((u) => u.is_active).length;

  const stats = [
    { label: "전체 사용자", value: total, icon: UsersIcon, color: "text-blue-600" },
    { label: "활성", value: active, icon: UserCheck, color: "text-green-600" },
    // ...
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            {/* 통계 카드 UI */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### 3. Filters
```typescript
// users-filters.tsx
export function UsersFilters({ users }: UsersFiltersProps) {
  const { selectedStatus, globalFilter, setSelectedStatus, setGlobalFilter } = useUsersStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="사용자 검색..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">전체</SelectItem>
          <SelectItem value="active">활성</SelectItem>
          <SelectItem value="inactive">비활성</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

#### 4. Table
```typescript
// users-table.tsx
export function UsersTable({ data, totalItems, onEdit, onDelete }: UsersTableProps) {
  const { currentPage, itemsPerPage, setCurrentPage } = useUsersStore();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>사용자명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.description}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? "활성" : "비활성"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button onClick={() => onEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDelete(user)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage + 1}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />
    </div>
  );
}
```

#### 5. Edit (Modal)
```typescript
// users-edit.tsx
const userSchema = z.object({
  name: z.string().min(1, "사용자명을 입력해주세요"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export function UsersEdit({ users }: UsersEditProps) {
  const { formOpen, selectedId, closeForm } = useUsersStore();
  const { data: user } = useUsersById(selectedId || "");
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const createMutation = useCreateUsers({ onSuccess: () => closeForm() });
  const updateMutation = useUpdateUsers({ onSuccess: () => closeForm() });

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedId ? "사용자 수정" : "사용자 추가"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="name" {...} />
            <FormField name="description" {...} />
            <FormField name="is_active" {...} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>취소</Button>
              <Button type="submit">{selectedId ? "수정" : "추가"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 4. Page 패턴 (공통)

```typescript
// app/(main)/idam/users/page.tsx
'use client';

import { toast } from 'sonner';
import {
  UsersHeader,
  UsersStats,
  UsersFilters,
  UsersTable,
  UsersEdit,
  useUsers,
  useDeleteUsers,
} from '@/features/idam/users';
import { useUsersStore } from '@/features/idam/users/stores/users.store';

export default function UsersPage() {
  const { selectedStatus, currentPage, itemsPerPage, globalFilter } = useUsersStore();

  const { data: usersResponse, refetch } = useUsers({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : 
            selectedStatus === 'inactive' ? false : undefined,
  });

  const deleteUserMutation = useDeleteUsers({
    onSuccess: () => toast.success('사용자가 삭제되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const users = usersResponse?.items || [];
  const totalItems = usersResponse?.total || 0;

  return (
    <div className="space-y-6">
      <UsersHeader onRefresh={() => refetch()} />
      <UsersStats users={users} />
      <UsersFilters users={users} />
      <UsersTable
        data={users}
        totalItems={totalItems}
        onEdit={(user) => useUsersStore.getState().openForm(user.id)}
        onDelete={(user) => {
          if (confirm(`'${user.name}' 사용자를 삭제하시겠습니까?`)) {
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

## 📊 통계

### 생성된 파일 수

| 모듈 | 컴포넌트 | Hooks | Services | Types | Stores | Pages | 합계 |
|------|----------|-------|----------|-------|--------|-------|------|
| **users** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **roles** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **permissions** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **access-logs** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **합계** | **24개** | **4개** | **4개** | **4개** | **4개** | **4개** | **44개** |

---

## 🎯 공통 패턴

### 1. 폴더 구조
```
{entity}/
├── components/
│   ├── {entity}-header.tsx
│   ├── {entity}-stats.tsx
│   ├── {entity}-filters.tsx
│   ├── {entity}-table.tsx
│   ├── {entity}-edit.tsx
│   └── index.ts
├── hooks/
│   └── use-{entity}.ts
├── services/
│   └── {entity}.service.ts
├── types/
│   └── {entity}.types.ts
├── stores/
│   └── {entity}.store.ts
└── index.ts
```

### 2. 상태 관리
```typescript
// stores/{entity}.store.ts
interface EntityStore {
  selectedStatus: 'active' | 'inactive' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  
  setSelectedStatus: (status) => void;
  setCurrentPage: (page) => void;
  setGlobalFilter: (filter) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  reset: () => void;
}
```

### 3. 데이터 흐름
```
Page Component
  ↓
useStore (UI State) + useQuery (Server Data)
  ↓
Presentational Components (Header, Stats, Filters, Table, Edit)
  ↓
useMutation (CRUD Actions)
  ↓
API Service Layer
  ↓
Backend API
```

---

## 💾 백업 폴더

**기존 폴더 보존**
```
idam/
├── user.old/           # 백업 (삭제 가능)
├── role.old/           # 백업 (삭제 가능)
├── permission.old/     # 백업 (삭제 가능)
└── access-log.old/     # 백업 (삭제 가능)
```

**정리 명령**
```bash
# 충분한 테스트 후 백업 폴더 삭제
cd /home/itjee/workspace/cxg/apps/manager-web/src/features/idam
rm -rf user.old role.old permission.old access-log.old
```

---

## 📝 다음 단계

### 1. 타입 정의 수정
각 모듈의 `types/{entity}.types.ts`에서 실제 필드 정의:
```typescript
// types/users.types.ts
export interface Users {
  id: string;
  created_at: string;
  updated_at?: string;
  
  // 실제 필드 추가
  username: string;    // ✅ 추가
  email: string;       // ✅ 추가
  full_name?: string;  // ✅ 추가
  
  is_active: boolean;
  is_deleted: boolean;
}
```

### 2. API 엔드포인트 확인
```typescript
// services/users.service.ts
const ENDPOINT = "/api/v1/manager/idam/users";  // ✅ 확인 필요
```

### 3. 테스트
```bash
cd /home/itjee/workspace/cxg/apps/manager-web
npm run dev

# 각 페이지 접속
# - http://localhost:3000/idam/users
# - http://localhost:3000/idam/roles
# - http://localhost:3000/idam/permissions
# - http://localhost:3000/idam/access-logs
```

---

## ✅ 완료 체크리스트

- [x] 폴더명 복수형으로 변경
- [x] stores 폴더 추가
- [x] components 5개 생성 (Header, Stats, Filters, Table, Edit)
- [x] hooks 자동 생성
- [x] services 자동 생성
- [x] types 자동 생성
- [x] stores 자동 생성
- [x] index.ts 통합 export
- [x] pages 생성 (4개)
- [ ] 타입 필드 정의 (TODO)
- [ ] API 엔드포인트 확인 (TODO)
- [ ] 테스트 (TODO)
- [ ] 백업 폴더 삭제 (TODO)

---

**완료**: 2025-01-06  
**모듈**: idam (users, roles, permissions, access-logs)  
**생성 파일**: 44개  
**패턴**: Tenants-Web 공통 컴포넌트 방식  
**다음**: 타입 정의 및 API 엔드포인트 수정
