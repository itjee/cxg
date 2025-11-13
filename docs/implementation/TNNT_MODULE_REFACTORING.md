# TNNT 모듈 리팩토링 완료

**작업일**: 2025-01-06  
**모듈**: features/tnnt (tenants, subscriptions)  
**상태**: ✅ 완료

---

## ✅ 완료된 작업

### 1. 구조 리팩토링

**Before (기존)**
```
tnnt/
├── tenant/          ❌ 단수형
└── subscription/    ❌ 단수형
```

**After (새 구조)**
```
tnnt/
├── tenants/         ✅ 복수형
│   ├── components/
│   │   ├── tenants-header.tsx
│   │   ├── tenants-stats.tsx
│   │   ├── tenants-filters.tsx
│   │   ├── tenants-table.tsx
│   │   ├── tenants-edit.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   └── use-tenants.ts
│   ├── services/
│   │   └── tenants.service.ts
│   ├── types/
│   │   └── tenants.types.ts
│   ├── stores/
│   │   └── tenants.store.ts
│   └── index.ts
│
└── subscriptions/   ✅ 복수형
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
app/(main)/tnnt/
├── tenants/page.tsx          ✅
└── subscriptions/page.tsx    ✅
```

---

### 3. 컴포넌트 패턴 (공통)

각 모듈마다 동일한 5개 컴포넌트:

#### 1. Header
```typescript
// tenants-header.tsx
export function TenantsHeader({ onRefresh, onExport }: TenantsHeaderProps) {
  const { openForm } = useTenantsStore();

  const actions = [
    { label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" },
    { label: "테넌트 추가", icon: Plus, onClick: () => openForm(), variant: "default" },
    { label: "내보내기", icon: Download, onClick: onExport, variant: "outline" },
  ];

  return (
    <ListPageHeader
      title="테넌트 관리"
      description="플랫폼 테넌트를 관리합니다"
      actions={actions}
    />
  );
}
```

#### 2. Stats
```typescript
// tenants-stats.tsx
export function TenantsStats({ tenants }: TenantsStatsProps) {
  const total = tenants.length;
  const active = tenants.filter((t) => t.is_active).length;
  const inactive = total - active;

  const stats = [
    { label: "전체 테넌트", value: total, icon: Building2, color: "text-blue-600" },
    { label: "활성", value: active, icon: CheckCircle, color: "text-green-600" },
    { label: "비활성", value: inactive, icon: XCircle, color: "text-gray-600" },
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
// tenants-filters.tsx
export function TenantsFilters({ tenants }: TenantsFiltersProps) {
  const { selectedStatus, globalFilter, setSelectedStatus, setGlobalFilter } = useTenantsStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="테넌트 검색..."
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
// tenants-table.tsx
export function TenantsTable({ data, totalItems, onEdit, onDelete }: TenantsTableProps) {
  const { currentPage, itemsPerPage, setCurrentPage } = useTenantsStore();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>테넌트명</TableHead>
            <TableHead>도메인</TableHead>
            <TableHead>구독 플랜</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.description}</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>
                <Badge variant={tenant.is_active ? "default" : "secondary"}>
                  {tenant.is_active ? "활성" : "비활성"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button onClick={() => onEdit(tenant)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDelete(tenant)}>
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
// tenants-edit.tsx
const tenantSchema = z.object({
  name: z.string().min(1, "테넌트명을 입력해주세요"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export function TenantsEdit({ tenants }: TenantsEditProps) {
  const { formOpen, selectedId, closeForm } = useTenantsStore();
  const { data: tenant } = useTenantsById(selectedId || "");
  
  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
  });

  const createMutation = useCreateTenants({ onSuccess: () => closeForm() });
  const updateMutation = useUpdateTenants({ onSuccess: () => closeForm() });

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedId ? "테넌트 수정" : "테넌트 추가"}
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
// app/(main)/tnnt/tenants/page.tsx
'use client';

import { toast } from 'sonner';
import {
  TenantsHeader,
  TenantsStats,
  TenantsFilters,
  TenantsTable,
  TenantsEdit,
  useTenants,
  useDeleteTenants,
} from '@/features/tnnt/tenants';
import { useTenantsStore } from '@/features/tnnt/tenants/stores/tenants.store';

export default function TenantsPage() {
  const { selectedStatus, currentPage, itemsPerPage, globalFilter } = useTenantsStore();

  const { data: tenantsResponse, refetch } = useTenants({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : 
            selectedStatus === 'inactive' ? false : undefined,
  });

  const deleteTenantMutation = useDeleteTenants({
    onSuccess: () => toast.success('테넌트가 삭제되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const tenants = tenantsResponse?.items || [];
  const totalItems = tenantsResponse?.total || 0;

  return (
    <div className="space-y-6">
      <TenantsHeader onRefresh={() => refetch()} />
      <TenantsStats tenants={tenants} />
      <TenantsFilters tenants={tenants} />
      <TenantsTable
        data={tenants}
        totalItems={totalItems}
        onEdit={(tenant) => useTenantsStore.getState().openForm(tenant.id)}
        onDelete={(tenant) => {
          if (confirm(`'${tenant.name}' 테넌트를 삭제하시겠습니까?`)) {
            deleteTenantMutation.mutate(tenant.id);
          }
        }}
      />
      <TenantsEdit tenants={tenants} />
    </div>
  );
}
```

---

## 📊 통계

### 생성된 파일 수

| 모듈 | 컴포넌트 | Hooks | Services | Types | Stores | Pages | 합계 |
|------|----------|-------|----------|-------|--------|-------|------|
| **tenants** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **subscriptions** | 6개 | 1개 | 1개 | 1개 | 1개 | 1개 | **11개** |
| **합계** | **12개** | **2개** | **2개** | **2개** | **2개** | **2개** | **22개** |

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
tnnt/
├── tenant.old/        # 백업 (삭제 가능)
└── subscription.old/  # 백업 (삭제 가능)
```

**정리 명령**
```bash
# 충분한 테스트 후 백업 폴더 삭제
cd /home/itjee/workspace/cxg/apps/manager-web/src/features/tnnt
rm -rf tenant.old subscription.old
```

---

## 📝 다음 단계

### 1. 타입 정의 수정
각 모듈의 `types/{entity}.types.ts`에서 실제 필드 정의:
```typescript
// types/tenants.types.ts
export interface Tenants {
  id: string;
  created_at: string;
  updated_at?: string;
  
  // 실제 필드 추가
  tenant_code: string;     // ✅ 추가
  domain: string;          // ✅ 추가
  subscription_plan?: string;  // ✅ 추가
  
  is_active: boolean;
  is_deleted: boolean;
}
```

### 2. API 엔드포인트 확인
```typescript
// services/tenants.service.ts
const ENDPOINT = "/api/v1/manager/tnnt/tenants";  // ✅ 확인 필요
```

### 3. 테스트
```bash
cd /home/itjee/workspace/cxg/apps/manager-web
npm run dev

# 각 페이지 접속
# - http://localhost:3000/tnnt/tenants
# - http://localhost:3000/tnnt/subscriptions
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
- [x] pages 생성 (2개)
- [ ] 타입 필드 정의 (TODO)
- [ ] API 엔드포인트 확인 (TODO)
- [ ] 테스트 (TODO)
- [ ] 백업 폴더 삭제 (TODO)

---

## 📚 관련 문서

- **Auto 모듈**: `/docs/implementation/AUTO_MODULE_REFACTORING.md`
- **IDAM 모듈**: `/docs/implementation/IDAM_MODULE_REFACTORING.md`
- **구조 가이드**: `/docs/implementation/MANAGER_WEB_STRUCTURE_REFACTORING_GUIDE.md`
- **Toast 구현**: `/docs/implementation/SONNER_TOAST_IMPLEMENTATION.md`

---

**완료**: 2025-01-06  
**모듈**: tnnt (tenants, subscriptions)  
**생성 파일**: 22개  
**패턴**: Tenants-Web 공통 컴포넌트 방식  
**다음**: 타입 정의 및 API 엔드포인트 수정
