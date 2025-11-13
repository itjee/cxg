# Auto 모듈 리팩토링 완료

**작업일**: 2025-01-06  
**모듈**: features/auto (workflows, schedules)  
**상태**: ✅ 구조 생성 완료, 컴포넌트 부분 구현

---

## ✅ 완료된 작업

### 1. Workflows (워크플로우)

**구조 생성**
```
features/auto/workflows/
├── components/
│   ├── workflows-header.tsx       ✅ 완성
│   ├── workflows-stats.tsx        ✅ 완성
│   ├── workflows-filters.tsx      ✅ 완성
│   ├── workflows-table.tsx        ✅ 완성
│   ├── workflows-edit.tsx         ✅ 완성
│   └── index.ts                   ✅ 완성
├── hooks/
│   └── use-workflows.ts           ✅ 자동생성
├── services/
│   └── workflows.service.ts       ✅ 자동생성
├── types/
│   └── workflows.types.ts         ✅ 자동생성
├── stores/
│   └── workflows.store.ts         ✅ 자동생성
└── index.ts                       ✅ 완성
```

**Page 생성**
```
app/(main)/auto/workflows/page.tsx  ✅ 완성
```

---

### 2. Schedules (스케줄)

**구조 생성**
```
features/auto/schedules/
├── components/
│   ├── schedules-header.tsx       ✅ 완성
│   ├── schedules-stats.tsx        ⚠️ TODO
│   ├── schedules-filters.tsx      ⚠️ TODO
│   ├── schedules-table.tsx        ⚠️ TODO
│   ├── schedules-edit.tsx         ⚠️ TODO
│   └── index.ts                   ✅ 완성
├── hooks/
│   └── use-schedules.ts           ✅ 자동생성
├── services/
│   └── schedules.service.ts       ✅ 자동생성
├── types/
│   └── schedules.types.ts         ✅ 자동생성
├── stores/
│   └── schedules.store.ts         ✅ 자동생성
└── index.ts                       ✅ 완성
```

---

## 📝 구현된 컴포넌트 패턴

### 1. Header 컴포넌트
```typescript
// workflows-header.tsx
"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useWorkflowsStore } from "../stores/workflows.store";

interface WorkflowsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function WorkflowsHeader({ onRefresh, onExport }: WorkflowsHeaderProps) {
  const { openForm } = useWorkflowsStore();

  const actions = [
    {
      label: "새로고침",
      icon: RefreshCw,
      onClick: onRefresh,
      variant: "outline" as const,
    },
    {
      label: "워크플로우 추가",
      icon: Plus,
      onClick: () => openForm(),
      variant: "default" as const,
    },
    // ... 내보내기 액션
  ];

  return (
    <ListPageHeader
      title="워크플로우 관리"
      description="자동화 워크플로우를 생성하고 관리합니다"
      actions={actions}
    />
  );
}
```

### 2. Stats 컴포넌트
```typescript
// workflows-stats.tsx
export function WorkflowsStats({ workflows }: WorkflowsStatsProps) {
  const total = workflows.length;
  const active = workflows.filter((w) => w.is_active).length;
  const inactive = workflows.filter((w) => !w.is_active).length;

  const stats = [
    {
      label: "전체 워크플로우",
      value: total,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    // ... 더 많은 통계
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          {/* 통계 카드 UI */}
        </Card>
      ))}
    </div>
  );
}
```

### 3. Filters 컴포넌트
```typescript
// workflows-filters.tsx
export function WorkflowsFilters({ workflows }: WorkflowsFiltersProps) {
  const {
    selectedStatus,
    globalFilter,
    setSelectedStatus,
    setGlobalFilter,
  } = useWorkflowsStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* 검색 Input */}
      <Input
        placeholder="워크플로우 검색..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* 상태 필터 Select */}
      <Select
        value={selectedStatus}
        onValueChange={setSelectedStatus}
      >
        {/* 옵션들 */}
      </Select>
    </div>
  );
}
```

### 4. Table 컴포넌트
```typescript
// workflows-table.tsx
export function WorkflowsTable({
  data,
  totalItems,
  onEdit,
  onDelete,
  onToggle,
}: WorkflowsTableProps) {
  const { currentPage, itemsPerPage, setCurrentPage } = useWorkflowsStore();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>워크플로우명</TableHead>
            <TableHead>설명</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((workflow) => (
            <TableRow key={workflow.id}>
              {/* 데이터 행 */}
              <TableCell className="text-right space-x-2">
                <Button onClick={() => onEdit(workflow)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDelete(workflow)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />
    </div>
  );
}
```

### 5. Edit 컴포넌트 (모달)
```typescript
// workflows-edit.tsx
export function WorkflowsEdit({ workflows }: WorkflowsEditProps) {
  const { formOpen, selectedId, closeForm } = useWorkflowsStore();
  const { data: workflow } = useWorkflowsById(selectedId || "");

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
  });

  const createMutation = useCreateWorkflows({
    onSuccess: () => closeForm(),
  });

  const updateMutation = useUpdateWorkflows({
    onSuccess: () => closeForm(),
  });

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedId ? "워크플로우 수정" : "워크플로우 추가"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* 폼 필드들 */}
            <FormField name="name" {...} />
            <FormField name="description" {...} />
            <FormField name="is_active" {...} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeForm}>
                취소
              </Button>
              <Button type="submit">
                {selectedId ? "수정" : "추가"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### 6. Page 컴포넌트
```typescript
// app/(main)/auto/workflows/page.tsx
'use client';

import { toast } from 'sonner';
import {
  WorkflowsHeader,
  WorkflowsStats,
  WorkflowsFilters,
  WorkflowsTable,
  WorkflowsEdit,
  useWorkflows,
  useDeleteWorkflows,
} from '@/features/auto/workflows';
import { useWorkflowsStore } from '@/features/auto/workflows/stores/workflows.store';

export default function WorkflowsPage() {
  const {
    selectedStatus,
    currentPage,
    itemsPerPage,
    globalFilter,
  } = useWorkflowsStore();

  const { data: workflowsResponse, refetch } = useWorkflows({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    active: selectedStatus === 'active' ? true : 
            selectedStatus === 'inactive' ? false : undefined,
  });

  const deleteWorkflowMutation = useDeleteWorkflows({
    onSuccess: () => toast.success('워크플로우가 삭제되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const workflows = workflowsResponse?.items || [];
  const totalItems = workflowsResponse?.total || 0;

  return (
    <div className="space-y-6">
      <WorkflowsHeader onRefresh={() => refetch()} />
      <WorkflowsStats workflows={workflows} />
      <WorkflowsFilters workflows={workflows} />
      <WorkflowsTable
        data={workflows}
        totalItems={totalItems}
        onEdit={(workflow) => useWorkflowsStore.getState().openForm(workflow.id)}
        onDelete={(workflow) => {
          if (confirm(`'${workflow.name}' 워크플로우를 삭제하시겠습니까?`)) {
            deleteWorkflowMutation.mutate(workflow.id);
          }
        }}
      />
      <WorkflowsEdit workflows={workflows} />
    </div>
  );
}
```

---

## 🎯 공통 패턴

### 컴포넌트 구조
1. **Header**: 페이지 제목, 설명, 액션 버튼
2. **Stats**: 통계 카드 (Grid 레이아웃)
3. **Filters**: 검색 및 필터 (Select, Input)
4. **Table**: 데이터 테이블 + 페이지네이션
5. **Edit**: 생성/수정 모달 (Dialog + Form)

### 상태 관리
```typescript
// stores/{entity}.store.ts
interface EntityStore {
  // UI State
  selectedStatus: 'active' | 'inactive' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // Actions
  setSelectedStatus: (status) => void;
  setCurrentPage: (page) => void;
  setGlobalFilter: (filter) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  reset: () => void;
}
```

### 데이터 흐름
```
Page → useStore (UI State) + useQuery (Server Data)
     → Components (Presentational)
     → useMutation (CRUD Actions)
     → Server API
```

---

## ⚠️ TODO: 완료가 필요한 작업

### Schedules 컴포넌트
```bash
# 다음 컴포넌트 생성 필요
cd apps/manager-web/src/features/auto/schedules/components

# workflows 컴포넌트를 복사해서 수정
cp -r ../workflows/components/workflows-stats.tsx schedules-stats.tsx
cp -r ../workflows/components/workflows-filters.tsx schedules-filters.tsx
cp -r ../workflows/components/workflows-table.tsx schedules-table.tsx
cp -r ../workflows/components/workflows-edit.tsx schedules-edit.tsx

# 파일 내용에서 workflows → schedules로 일괄 변경
sed -i 's/workflows/schedules/g' *.tsx
sed -i 's/Workflows/Schedules/g' *.tsx
sed -i 's/워크플로우/스케줄/g' *.tsx
```

### Page 생성
```bash
mkdir -p apps/manager-web/src/app/\(main\)/auto/schedules
cp apps/manager-web/src/app/\(main\)/auto/workflows/page.tsx \
   apps/manager-web/src/app/\(main\)/auto/schedules/page.tsx

# workflows → schedules로 변경
```

### 공통 컴포넌트 확인
```typescript
// 다음 컴포넌트들이 존재하는지 확인 필요
- @/components/layouts/list-page-header
- @/components/ui/pagination
- @/components/ui/form
- @/lib/errors (ApiError)
```

---

## 📚 참고

### 생성된 파일 목록
```
✅ features/auto/workflows/
  ├── components/ (5개 완성)
  ├── hooks/use-workflows.ts
  ├── services/workflows.service.ts
  ├── types/workflows.types.ts
  ├── stores/workflows.store.ts
  └── index.ts

✅ features/auto/schedules/
  ├── components/ (1개 완성, 4개 TODO)
  ├── hooks/use-schedules.ts
  ├── services/schedules.service.ts
  ├── types/schedules.types.ts
  ├── stores/schedules.store.ts
  └── index.ts

✅ app/(main)/auto/workflows/page.tsx
⚠️ app/(main)/auto/schedules/page.tsx (TODO)
```

---

**완료**: 2025-01-06  
**다음 모듈**: features/bill, features/idam 등  
**스크립트**: `/scripts/create-feature.sh` 활용 권장
