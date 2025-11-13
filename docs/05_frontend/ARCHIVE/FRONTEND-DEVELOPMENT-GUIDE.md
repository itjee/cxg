# ConexGrow 프론트엔드 개발 가이드

> **최종 업데이트**: 2025-01-07  
> **버전**: 2.0  
> **적용 대상**: manager-web, tenants-web

## 목차

1. [개발 원칙](#개발-원칙)
2. [아키텍처](#아키텍처)
3. [Feature 구조 표준](#feature-구조-표준)
4. [컴포넌트 개발](#컴포넌트-개발)
5. [목록 페이지 개발](#목록-페이지-개발)
6. [상태 관리](#상태-관리)
7. [API 통신](#api-통신)
8. [스타일링](#스타일링)
9. [체크리스트](#체크리스트)

---

## 개발 원칙

### 1. Feature-Driven Architecture (필수)

모든 기능은 독립적인 Feature 단위로 개발합니다.

```
features/
└── [domain]/           # 도메인별 feature
    ├── components/     # UI 컴포넌트
    ├── hooks/          # 커스텀 훅
    ├── services/       # API 통신
    ├── stores/         # 상태 관리
    ├── types/          # 타입 정의
    └── index.ts        # Public exports
```

### 2. 관심사의 분리 (Separation of Concerns)

```
Page (라우팅)
    ↓
Component (UI 렌더링)
    ↓
Hook (로직 재사용)
    ↓
Service (API 통신)
    ↓
Store (상태 관리)
```

### 3. 일관성 우선 (Consistency First)

- **모든 목록 페이지는 동일한 구조**
- **모든 테이블은 columns + table 분리**
- **7개 필수 컴포넌트 준수**
- **예외 없이 표준 패턴 적용**

### 4. 타입 안전성 (Type Safety)

- TypeScript strict 모드 필수
- `any` 타입 사용 금지
- 모든 함수에 명시적 타입 지정
- API 응답 타입 정의

---

## 아키텍처

### 기술 스택

**공통:**

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui
- TanStack Query v5
- Zustand

**manager-web:**

- 운영자용 관리 시스템
- 멀티테넌트 관리
- 청구/모니터링

**tenants-web:**

- 클라이언트용 ERP
- 제품/매출/구매/재고 관리

### 프로젝트 구조

```
apps/[app-name]/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 라우트 그룹
│   │   ├── (main)/            # 메인 라우트 그룹
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈 페이지
│   │
│   ├── components/            # 공통 컴포넌트
│   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   ├── layouts/          # 레이아웃 컴포넌트
│   │   ├── data-table/       # DataTable 컴포넌트
│   │   └── filters/          # Filters 컴포넌트
│   │
│   ├── features/             # Feature 모듈 (도메인별)
│   │   ├── [domain]/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── hooks/                # 전역 커스텀 훅
│   ├── lib/                  # 유틸리티, 설정
│   │   ├── api.ts           # Axios 설정
│   │   ├── utils.ts         # 유틸리티 함수
│   │   └── errors.ts        # 에러 처리
│   │
│   ├── providers/            # Context Providers
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   └── types/                # 전역 타입 정의
│
├── public/                   # 정적 파일
├── .env.local               # 환경 변수
└── package.json
```

---

## Feature 구조 표준

### 필수 파일 구조

```
features/[domain]/
├── components/
│   ├── [domain]-columns.tsx     # 테이블 컬럼 정의 (필수)
│   ├── [domain]-table.tsx       # 데이터 테이블 (필수)
│   ├── [domain]-edit.tsx        # 수정 모달/페이지 (필수)
│   ├── [domain]-form.tsx        # 생성/수정 폼 (필수)
│   ├── [domain]-header.tsx      # 페이지 헤더 (필수)
│   ├── [domain]-filters.tsx     # 검색/필터 UI (필수)
│   ├── [domain]-stats.tsx       # 통계 카드 (필수)
│   ├── [domain]-detail.tsx      # 상세 보기 (선택)
│   └── index.ts                 # Export
│
├── hooks/
│   ├── use-[domain].ts          # TanStack Query hooks
│   └── index.ts
│
├── services/
│   ├── [domain].service.ts      # API 통신
│   └── index.ts
│
├── stores/
│   ├── [domain].store.ts        # Zustand store
│   └── index.ts
│
├── types/
│   ├── [domain].types.ts        # 타입 정의
│   └── index.ts
│
└── index.ts                      # Feature public API
```

### 필수 컴포넌트 7개

| 컴포넌트               | 역할                 | 필수 여부 |
| ---------------------- | -------------------- | --------- |
| `[domain]-columns.tsx` | 테이블 컬럼 정의     | ✅ 필수   |
| `[domain]-table.tsx`   | 데이터 테이블 렌더링 | ✅ 필수   |
| `[domain]-edit.tsx`    | 수정 모달/페이지     | ✅ 필수   |
| `[domain]-form.tsx`    | 생성/수정 폼         | ✅ 필수   |
| `[domain]-header.tsx`  | 페이지 헤더          | ✅ 필수   |
| `[domain]-filters.tsx` | 검색/필터 UI         | ✅ 필수   |
| `[domain]-stats.tsx`   | 통계 카드            | ✅ 필수   |

### 컴포넌트별 책임

#### 1. columns.tsx - 테이블 컬럼 정의

**역할:**

- TanStack Table 컬럼 정의
- 포맷 함수 (날짜, 통화, 상태 등)
- 상수 (색상, 라벨 매핑)
- 액션 핸들러 타입

**예시:**

```typescript
// features/invoice/components/invoice-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Invoice } from "../types";

// 포맷 함수
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// 상수 정의
const statusColors: Record<InvoiceStatus, string> = {
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  OVERDUE: "bg-red-100 text-red-800",
};

// 컬럼 생성 함수
interface GetColumnsParams {
  onViewDetails?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

export const getInvoiceColumns = ({
  onViewDetails,
  onDownload,
}: GetColumnsParams = {}): ColumnDef<Invoice>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  // 청구서 번호
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="청구서 번호" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue("invoiceNumber")}
      </code>
    ),
  },
  // 금액
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="금액" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  // 상태
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue("status") as InvoiceStatus;
      return <Badge className={statusColors[status]}>{status}</Badge>;
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" onClick={() => onViewDetails?.(row.original)}>
          상세
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDownload?.(row.original)}
        >
          다운로드
        </Button>
      </div>
    ),
  },
];
```

#### 2. table.tsx - 데이터 테이블 렌더링

**역할:**

- columns 파일에서 컬럼 정의 import
- DataTable 컴포넌트 설정
- Zustand 스토어 연동
- 페이지네이션/필터 설정

**예시:**

```typescript
// features/invoice/components/invoice-table.tsx
import { DataTable } from "@/components/ui/data-table";
import { useInvoiceStore } from "../stores";
import { getInvoiceColumns } from "./invoice-columns";
import type { Invoice } from "../types";

interface InvoiceTableProps {
  data: Invoice[];
  onViewDetails?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

export function InvoiceTable({
  data,
  onViewDetails,
  onDownload,
}: InvoiceTableProps) {
  const { sorting, setSorting } = useInvoiceStore();
  const columns = getInvoiceColumns({ onViewDetails, onDownload });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="invoiceNumber"
      searchPlaceholder="청구서 번호 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
      filters={[
        {
          key: "status",
          label: "상태",
          options: [
            { label: "지급 완료", value: "PAID" },
            { label: "미지급", value: "PENDING" },
            { label: "연체", value: "OVERDUE" },
          ],
        },
      ]}
    />
  );
}
```

#### 3. edit.tsx - 수정 모달/페이지

**역할:**

- 수정 UI (모달 또는 페이지)
- form 컴포넌트 통합
- mutation 호출
- 성공/실패 처리

**예시:**

```typescript
// features/invoice/components/invoice-edit.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvoiceStore } from "../stores";
import { useInvoice, useUpdateInvoice } from "../hooks";
import { InvoiceForm } from "./invoice-form";
import { toast } from "sonner";

export function InvoiceEdit() {
  const { editingId, closeForm } = useInvoiceStore();
  const { data: invoice, isLoading } = useInvoice(editingId);

  const updateMutation = useUpdateInvoice({
    onSuccess: () => {
      toast.success("청구서가 수정되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "수정 실패");
    },
  });

  if (!editingId) return null;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Dialog open={!!editingId} onOpenChange={closeForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>청구서 수정</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          initialData={invoice}
          onSubmit={(data) => updateMutation.mutate({ id: editingId, data })}
          onCancel={closeForm}
          isSubmitting={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
```

#### 4. form.tsx - 생성/수정 폼

**역할:**

- React Hook Form + Zod
- 폼 필드 정의
- Validation
- 제출 핸들러

**예시:**

```typescript
// features/invoice/components/invoice-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Invoice, CreateInvoiceRequest } from "../types";

const invoiceSchema = z.object({
  tenantId: z.string().min(1, "테넌트를 선택하세요"),
  amount: z.number().positive("금액은 0보다 커야 합니다"),
  dueDate: z.string().min(1, "마감일을 선택하세요"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: CreateInvoiceRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: InvoiceFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      tenantId: "",
      amount: 0,
      dueDate: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>테넌트</FormLabel>
              <FormControl>
                <Input {...field} placeholder="테넌트 선택" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>금액</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

#### 5. header.tsx - 페이지 헤더

**역할:**

- 페이지 제목/설명
- 주요 액션 버튼
- ListPageHeader 컴포넌트 사용

**예시:**

```typescript
// features/invoice/components/invoice-header.tsx
import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useInvoiceStore } from "../stores";

interface InvoiceHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function InvoiceHeader({ onRefresh, onExport }: InvoiceHeaderProps) {
  const { openForm } = useInvoiceStore();

  return (
    <ListPageHeader
      title="청구서 관리"
      description="청구서를 생성하고 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: onRefresh,
          variant: "outline",
        },
        {
          label: "청구서 생성",
          icon: Plus,
          onClick: () => openForm(),
          variant: "default",
        },
        {
          label: "내보내기",
          icon: Download,
          onClick: onExport,
          variant: "outline",
        },
      ]}
    />
  );
}
```

#### 6. filters.tsx - 검색/필터 UI

**역할:**

- 검색 입력
- 필터 옵션
- Filters 컴포넌트 사용
- 스토어 연동

**예시:**

```typescript
// features/invoice/components/invoice-filters.tsx
import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { useInvoiceStore } from "../stores";
import type { Invoice } from "../types";

interface InvoiceFiltersProps {
  data: Invoice[];
}

export function InvoiceFilters({ data }: InvoiceFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedStatus,
    setSelectedStatus,
    selectedTenant,
    setSelectedTenant,
    resetFilters,
  } = useInvoiceStore();

  const uniqueTenants = useMemo(() => {
    return Array.from(new Set(data.map((inv) => inv.tenantName)));
  }, [data]);

  const filterConfigs: FilterConfig[] = [
    {
      key: "globalFilter",
      label: "검색",
      description: "청구서 번호, 테넌트명...",
      type: "search",
    },
    {
      key: "selectedStatus",
      label: "상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "지급 완료", value: "PAID" },
        { label: "미지급", value: "PENDING" },
        { label: "연체", value: "OVERDUE" },
      ],
    },
    {
      key: "selectedTenant",
      label: "테넌트",
      description: "전체 테넌트",
      type: "select",
      options: uniqueTenants.map((t) => ({ label: t, value: t })),
    },
  ];

  const filterValues = {
    globalFilter,
    selectedStatus,
    selectedTenant,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      globalFilter: setGlobalFilter,
      selectedStatus: setSelectedStatus,
      selectedTenant: setSelectedTenant,
    };
    handlers[key]?.(value);
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
```

#### 7. stats.tsx - 통계 카드

**역할:**

- StatsCards 컴포넌트 사용
- 주요 지표 계산
- 트렌드 정보

**예시:**

```typescript
// features/invoice/components/invoice-stats.tsx
import { useMemo } from "react";
import { Building2, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { StatsCards, type StatCardData } from "@/components/stats";
import type { Invoice } from "../types";

interface InvoiceStatsProps {
  data: Invoice[];
}

export function InvoiceStats({ data }: InvoiceStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const paid = data.filter((inv) => inv.status === "PAID").length;
    const pending = data.filter((inv) => inv.status === "PENDING").length;
    const overdue = data.filter((inv) => inv.status === "OVERDUE").length;
    const totalAmount = data.reduce((sum, inv) => sum + inv.amount, 0);

    return [
      {
        title: "전체 청구서",
        value: total.toString(),
        description: "총 청구서 수",
        icon: <Building2 className="h-5 w-5" />,
        color: "primary",
      },
      {
        title: "총 금액",
        value: `$${totalAmount.toLocaleString()}`,
        description: "전체 청구 금액",
        icon: <DollarSign className="h-5 w-5" />,
        color: "success",
      },
      {
        title: "지급 완료",
        value: paid.toString(),
        description: `${((paid / total) * 100).toFixed(1)}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success",
        trend: {
          value: 5,
          isPositive: true,
          label: "지난달 대비",
        },
      },
      {
        title: "연체",
        value: overdue.toString(),
        description: `${((overdue / total) * 100).toFixed(1)}%`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: "warning",
        trend: {
          value: 2,
          isPositive: false,
          label: "지난달 대비",
        },
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
```

---

## 컴포넌트 개발

### 컴포넌트 작성 구조

```typescript
"use client"; // 1. 클라이언트 컴포넌트 선언

// 2. Import (순서 중요)
import { useState } from "react"; // React
import { useQuery } from "@tanstack/react-query"; // 서드파티
import { Button } from "@/components/ui/button"; // 로컬
import { useUser } from "./hooks/use-user"; // Feature 내부

// 3. 타입 정의
interface UserTableProps {
  onEdit: (user: User) => void;
}

// 4. 컴포넌트
export function UserTable({ onEdit }: UserTableProps) {
  // 4-1. 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 4-2. 훅
  const { users, isLoading } = useUser();

  // 4-3. 이벤트 핸들러
  const handleEdit = (user: User) => {
    onEdit(user);
  };

  // 4-4. 조건부 렌더링 (Early Return)
  if (isLoading) return <LoadingSpinner />;
  if (!users?.length) return <EmptyState />;

  // 4-5. JSX 반환
  return <div>{/* ... */}</div>;
}
```

### Props 타입 정의

```typescript
// ✅ 올바른 예 - 명시적 인터페이스
interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserCreateRequest) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  // ...
}

// ❌ 잘못된 예 - any 사용
function UserForm(props: any) {}

// ❌ 잘못된 예 - 인라인 타입
function UserForm(props: { data: any; onClick: any }) {}
```

### 조건부 렌더링 (Early Return 패턴)

```typescript
function UserList() {
  const { users, isLoading, error } = useUsers();

  // Early Return 패턴
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!users?.length) return <EmptyState message="사용자가 없습니다" />;

  // 정상 렌더링
  return <UserTable users={users} />;
}
```

---

## 목록 페이지 개발

### 메인 페이지 통합

```typescript
// app/(main)/invoices/page.tsx
"use client";

import { toast } from "sonner";
import {
  InvoiceHeader,
  InvoiceStats,
  InvoiceFilters,
  InvoiceTable,
  InvoiceEdit,
} from "@/features/invoice";
import { useInvoices, useDeleteInvoice } from "@/features/invoice/hooks";
import { useInvoiceStore } from "@/features/invoice/stores";

export default function InvoicesPage() {
  const {
    globalFilter,
    selectedStatus,
    selectedTenant,
    currentPage,
    itemsPerPage,
    openForm,
  } = useInvoiceStore();

  // 서버 사이드 페이징 조회
  const {
    data: invoicesResponse,
    isLoading,
    error,
    refetch,
  } = useInvoices({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    status: selectedStatus || undefined,
    tenant: selectedTenant || undefined,
  });

  // 삭제 mutation
  const deleteInvoiceMutation = useDeleteInvoice({
    onSuccess: () => toast.success("청구서가 삭제되었습니다"),
    onError: (error) => toast.error(error.message || "삭제 실패"),
  });

  const invoices = invoicesResponse?.items || [];
  const totalItems = invoicesResponse?.total || 0;

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <InvoiceHeader onRefresh={() => refetch()} />
      <InvoiceStats data={invoices} />
      <InvoiceFilters data={invoices} />
      <InvoiceTable
        data={invoices}
        onViewDetails={(invoice) => console.log(invoice)}
        onDownload={(invoice) => console.log("Download", invoice)}
      />
      <InvoiceEdit />
    </div>
  );
}
```

---

## 상태 관리

### 1. 로컬 상태 (useState)

단일 컴포넌트 내에서만 사용:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

### 2. 서버 상태 (TanStack Query)

API 데이터 관리:

```typescript
// hooks/use-invoices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "../services";

const invoicesKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoicesKeys.all, "list"] as const,
  list: (params?: InvoiceQueryParams) =>
    [...invoicesKeys.lists(), params] as const,
  detail: (id: string) => [...invoicesKeys.all, "detail", id] as const,
};

export function useInvoices(params?: InvoiceQueryParams) {
  return useQuery({
    queryKey: invoicesKeys.list(params),
    queryFn: () => invoiceService.listInvoices(params),
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
}

export function useCreateInvoice(options?: {
  onSuccess?: (invoice: Invoice) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) =>
      invoiceService.createInvoice(data),
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      options?.onSuccess?.(newInvoice);
    },
    onError: options?.onError,
  });
}
```

### 3. 전역 UI 상태 (Zustand)

UI 상태 관리 (모달, 필터, 페이징):

```typescript
// stores/invoice.store.ts
import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface InvoiceStoreState {
  // 모달 상태
  formOpen: boolean;
  editingId: string | null;

  // 필터 상태
  globalFilter: string;
  selectedStatus: string;
  selectedTenant: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션
  currentPage: number;
  itemsPerPage: number;

  // 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedTenant: (tenant: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

export const useInvoiceStore = create<InvoiceStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: "",
  selectedStatus: "",
  selectedTenant: "",
  sorting: [],
  currentPage: 0,
  itemsPerPage: 20,

  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: null }),
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter:
        typeof filter === "function" ? filter(state.globalFilter) : filter,
    })),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
  resetFilters: () =>
    set({
      globalFilter: "",
      selectedStatus: "",
      selectedTenant: "",
      sorting: [],
    }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
}));
```

---

## API 통신

### API 클라이언트 설정

```typescript
// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);
```

### API 서비스 작성

```typescript
// services/invoice.service.ts
import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Invoice,
  InvoiceListResponse,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/invoices";

export const invoiceService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listInvoices(
    params?: InvoiceQueryParams,
    signal?: AbortSignal
  ): Promise<InvoiceListResponse> {
    try {
      const response = await api.get<{ data: InvoiceListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          status: params?.status,
        },
        signal,
      });
      return (
        response.data.data || {
          items: [],
          total: 0,
          page: 1,
          page_size: 20,
          total_pages: 0,
        }
      );
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listInvoices");
    }
  },

  /**
   * 상세 조회
   */
  async getInvoice(id: string): Promise<Invoice> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getInvoice(${id})`);
    }
  },

  /**
   * 생성
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createInvoice");
    }
  },

  /**
   * 수정
   */
  async updateInvoice(
    id: string,
    data: UpdateInvoiceRequest
  ): Promise<Invoice> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateInvoice(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteInvoice(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteInvoice(${id})`);
    }
  },
};
```

### 타입 정의

```typescript
// types/invoice.types.ts

/**
 * 엔티티 타입
 */
export interface Invoice {
  id: string;
  created_at: string;
  updated_at?: string;

  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  description?: string;
}

/**
 * 상태 enum
 */
export type InvoiceStatus = "PAID" | "PENDING" | "OVERDUE" | "CANCELLED";

/**
 * 생성 요청 DTO
 */
export interface CreateInvoiceRequest {
  tenantId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  description?: string;
}

/**
 * 수정 요청 DTO
 */
export interface UpdateInvoiceRequest {
  amount?: number;
  status?: InvoiceStatus;
  dueDate?: string;
  description?: string;
}

/**
 * 목록 응답 (서버 사이드 페이징)
 */
export interface InvoiceListResponse {
  items: Invoice[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 쿼리 파라미터
 */
export interface InvoiceQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: InvoiceStatus;
  tenant?: string;
}
```

---

## 스타일링

### Tailwind CSS v4 사용 원칙

1. **유틸리티 클래스 우선**: 인라인 스타일 대신 Tailwind 클래스
2. **반응형 디자인**: `md:`, `lg:`, `xl:` 접두사
3. **다크 모드 지원**: `dark:` 접두사
4. **일관된 spacing**: 4px 기본 단위 (p-4 = 16px)
5. **CSS 변수 활용**: `--color-primary`, `--radius`

### 클래스명 순서

```typescript
<div className="
  flex items-center justify-between     // Layout
  p-4 mt-2 mb-4                         // Spacing
  w-full h-auto                         // Sizing
  text-lg font-bold                     // Typography
  bg-white border rounded-lg shadow-sm  // Visual
  hover:bg-gray-50 cursor-pointer       // Interactive
  md:flex-row md:p-6                    // Responsive
  dark:bg-gray-800                      // Dark mode
">
```

### CSS 변수 활용

```typescript
// 테마 색상 사용
<div className="bg-primary text-primary-foreground">
  Primary 색상 사용
</div>

// Border radius 사용
<div className="rounded-lg">  {/* --radius-lg */}
  둥근 모서리
</div>

// 커스텀 CSS 변수
<div style={{
  background: 'var(--gradient-primary)',
  color: 'var(--foreground)'
}}>
  CSS 변수 직접 사용
</div>
```

### shadcn/ui 컴포넌트

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 기본 사용
<Button>클릭</Button>

// variant
<Button variant="outline">취소</Button>
<Button variant="destructive">삭제</Button>

// size
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>
```

**자세한 스타일 가이드**: [CSS-STYLING-GUIDE.md](./CSS-STYLING-GUIDE.md)

---

## 체크리스트

### 새로운 기능 추가 시

- [ ] Feature 디렉토리 구조 생성
- [ ] 타입 정의 작성 (Entity, DTO, QueryParams)
- [ ] API 서비스 작성 (CRUD)
- [ ] TanStack Query hooks 작성
- [ ] Zustand store 작성 (UI 상태)
- [ ] 로딩/에러 상태 처리
- [ ] 접근성 고려 (ARIA, 키보드)
- [ ] 반응형 디자인
- [ ] 성능 최적화 검토

### 목록 페이지 추가 시

- [ ] **필수 컴포넌트 7개 작성**
  - [ ] `[domain]-columns.tsx` - 컬럼 정의 (필수)
  - [ ] `[domain]-table.tsx` - 테이블 렌더링 (필수)
  - [ ] `[domain]-edit.tsx` - 수정 모달/페이지 (필수)
  - [ ] `[domain]-form.tsx` - 생성/수정 폼 (필수)
  - [ ] `[domain]-header.tsx` - 페이지 헤더 (필수)
  - [ ] `[domain]-filters.tsx` - 검색/필터 UI (필수)
  - [ ] `[domain]-stats.tsx` - 통계 카드 (필수)
- [ ] **선택 컴포넌트** (필요시)
  - [ ] `[domain]-detail.tsx` - 상세 보기
  - [ ] `[domain]-[custom].tsx` - 도메인별 추가 컴포넌트
- [ ] 메인 페이지 통합 (app/[route]/page.tsx)
- [ ] 서버 사이드 페이징 구현
- [ ] Query Key Factory 정의
- [ ] 필터/검색/정렬 구현

### 테이블 컴포넌트 작성 시

- [ ] **무조건 columns + table 분리** (일관성 유지)
- [ ] columns.tsx: 컬럼 정의, 포맷 함수, 상수
- [ ] table.tsx: DataTable 설정, 스토어 연동
- [ ] NO 컬럼 (행 번호) 포함
- [ ] 정렬 가능한 컬럼에 DataTableColumnHeader 사용
- [ ] 액션 컬럼 (수정/삭제 등) 포함
- [ ] 빈 데이터 상태 처리

---

## 베스트 프랙티스

### DO ✅

- **일관성 준수**: 모든 feature는 동일한 구조
- **필수 7개 컴포넌트**: 예외 없이 모두 생성
- **테이블 분리**: columns + table 항상 분리
- **TypeScript strict**: any 타입 금지
- **Early Return**: 조건부 렌더링 패턴
- **TanStack Query**: 서버 상태 관리
- **Zustand**: 전역 UI 상태 관리
- **에러 핸들링**: 모든 API 호출에 에러 처리
- **접근성**: ARIA 속성, 키보드 네비게이션

### DON'T ❌

- **any 타입**: 절대 사용 금지
- **Props Drilling**: 3단계 이상 props 전달
- **인라인 스타일**: Tailwind CSS 사용
- **localStorage**: Artifact 미지원
- **직접 DOM 조작**: React 방식 준수
- **전역 상태 남용**: 필요한 경우만 사용
- **에러 무시**: try-catch 또는 onError 필수
- **예외 패턴**: 일관성 깨는 구조 금지

---

## 참고 문서

- [CSS 스타일링 가이드](./CSS-STYLING-GUIDE.md)
- [컴포넌트 구성 가이드](./COMPONENT-COMPOSITION-GUIDE.md)
- [아키텍처 결정](./FRONTEND_ARCHITECTURE_DECISION.md)

---

## 참고 구현

- **tenants-web**: `/apps/tenants-web/src/features/sys/users`
- **manager-web**: `/apps/manager-web/src/features/bill/invoice`

위 두 feature는 본 가이드의 모든 표준을 준수하는 참고 구현입니다.

---

**문서 버전**: 2.0  
**최종 업데이트**: 2025-01-07  
**작성자**: ConexGrow Development Team
