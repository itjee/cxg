# 컴포넌트 컴포지션 가이드

**작성일**: 2025-10-18 18:02:45 KST  
**버전**: 1.0  
**적용 대상**: tenants-web, manager-web

## 개요

이 문서는 ConexGrow 프로젝트에서 목록 페이지 컴포넌트를 구성하는 표준 아키텍처 패턴을 정의합니다. 컴포지션 패턴(Composition Pattern)을 기반으로 재사용 가능하고 유지보수하기 쉬운 컴포넌트 구조를 제시합니다.

## 설계 원칙

### 1. 단일 책임 원칙 (Single Responsibility Principle)
- 각 컴포넌트는 하나의 명확한 책임만 가집니다
- 통계 표시, 필터링, 데이터 표시 등을 분리

### 2. 컴포지션 우선 (Composition over Configuration)
- 올인원 컴포넌트보다 작은 컴포넌트를 조합하는 방식 선호
- Props 과다보다 컴포넌트 조합으로 유연성 확보

### 3. 재사용성 (Reusability)
- 도메인에 독립적인 컴포넌트 설계
- 다양한 컨텍스트에서 사용 가능

### 4. 확장성 (Extensibility)
- 새로운 기능 추가 시 기존 컴포넌트 수정 최소화
- 인터페이스 확장을 통한 기능 추가

---

## 목록 페이지 구조

목록 페이지는 다음 4가지 영역으로 구성됩니다:

```
┌─────────────────────────────────────────────┐
│  1. 통계 카드 영역 (StatsCards)              │
│  - 주요 지표 및 통계 표시                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  2. 필터 영역 (ListFilter)                   │
│  - 검색, 드롭다운, 날짜 범위 등               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  3. 데이터 테이블 (DataTable)                │
│  - 컬럼 헤더                                  │
│  - 데이터 행                                  │
│  - 정렬, 선택 등 인터랙션                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  4. 페이지네이션 (내장)                       │
│  - 페이지 번호, 이전/다음 버튼                │
└─────────────────────────────────────────────┘
```

---

## 컴포넌트 구조

### 디렉토리 구조

```
src/
├── components/
│   ├── stats/
│   │   ├── stats-card.tsx           # 단일 통계 카드
│   │   └── stats-cards.tsx          # 카드 그리드 컨테이너
│   │
│   ├── filters/
│   │   ├── list-filter.tsx          # 메인 필터 컴포넌트
│   │   ├── filter-field.tsx         # 개별 필드 (text, select, date 등)
│   │   └── filter-presets.tsx       # 저장된 필터 (선택사항)
│   │
│   ├── data-table/
│   │   ├── data-table.tsx           # 메인 테이블 + 페이지네이션
│   │   ├── data-table-header.tsx    # 테이블 헤더
│   │   ├── data-table-row.tsx       # 테이블 행
│   │   ├── data-table-cell.tsx      # 테이블 셀
│   │   ├── data-table-pagination.tsx # 페이지네이션 (내부)
│   │   └── data-table-toolbar.tsx   # 툴바 (정렬, 필터 등)
│   │
│   └── layouts/
│       ├── list-page-layout.tsx     # 목록 페이지 레이아웃
│       └── detail-page-layout.tsx   # 상세 페이지 레이아웃
│
└── app/
    └── (main)/
        └── [module]/
            └── [feature]/
                ├── page.tsx         # 목록 페이지 (컴포넌트 조합)
                ├── [id]/
                │   └── page.tsx     # 상세 페이지
                └── _components/     # 페이지 전용 컴포넌트
                    └── custom-cell.tsx
```

---

## 1. 통계 카드 (StatsCards)

### 역할
- 주요 지표 및 통계 데이터 시각화
- 트렌드, 증감률 등 표시

### 인터페이스

```typescript
// src/components/stats/stats-cards.tsx

interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

interface StatsCardsProps {
  cards: StatCard[];
  columns?: 2 | 3 | 4;  // 그리드 컬럼 수
  className?: string;
}

export function StatsCards({ cards, columns = 4, className }: StatsCardsProps) {
  // 구현
}
```

### 사용 예시

```tsx
import { StatsCards } from "@/components/stats/stats-cards";
import { Building2, Users, CheckCircle, XCircle } from "lucide-react";

const stats = [
  {
    title: "전체 회사",
    value: 125,
    icon: <Building2 className="h-5 w-5" />,
    trend: { value: 12, isPositive: true, label: "전월 대비" },
    color: "primary"
  },
  {
    title: "활성 회사",
    value: 98,
    description: "정상 운영 중",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "success"
  },
  {
    title: "전체 사용자",
    value: "1,234",
    icon: <Users className="h-5 w-5" />,
    color: "primary"
  },
  {
    title: "비활성 회사",
    value: 15,
    icon: <XCircle className="h-5 w-5" />,
    color: "warning"
  }
];

<StatsCards cards={stats} columns={4} />
```

### 디자인 스타일링

통계 카드는 다음과 같은 세련된 스타일을 적용합니다:

#### 배경 그라디언트
- **방향**: 좌상단에서 우하단으로 (`bg-gradient-to-br`)
- **3단계 그라디언트**: `from-{color}/10 via-{color}/5 to-transparent`
- **색상별 적용**:
  - `default`: `from-muted/30 via-transparent to-transparent`
  - `primary`: `from-primary/10 via-primary/5 to-transparent`
  - `success`: `from-emerald-500/10 via-emerald-500/5 to-transparent`
  - `warning`: `from-orange-500/10 via-orange-500/5 to-transparent`
  - `danger`: `from-destructive/10 via-destructive/5 to-transparent`

#### 배경 아이콘
- **위치**: 우상단 (`absolute -right-1 -top-1`)
- **투명도**: 5% (`opacity-5`)
- **회전**: 12도 시계방향 (`rotate-12`)
- **크기**: 112px × 112px (`w-28 h-28`)
- **색상**: 카드 color variant에 따라 자동 적용

#### Hover 효과
카드에 마우스를 올리면 다음 효과가 적용됩니다:

1. **카드 전체**:
   - 위로 떠오름: `hover:-translate-y-1`
   - 그림자 생성: `hover:shadow-lg hover:shadow-primary/10`
   - 부드러운 전환: `transition-all duration-300`
   - 커서 변경: `cursor-pointer`

2. **배경 그라디언트**:
   - 투명도 증가: `group-hover:opacity-100`
   - 전환 시간: `transition-opacity duration-300`

3. **배경 아이콘**:
   - 투명도 증가: `5% → 15%` (`group-hover:opacity-15`)
   - 크기 확대: `110%` (`group-hover:scale-110`)
   - 회전 감소: `12도 → 6도` (`group-hover:rotate-6`)
   - 전환 시간: `transition-all duration-500`

4. **텍스트**:
   - 제목 색상 진하게: `group-hover:text-foreground`
   - 값 확대: `5%` (`group-hover:scale-105`)
   - 전환 시간: `transition-all duration-300`

#### 구현 예시

```tsx
// src/components/stats/stats-card.tsx
export function StatCard({ title, value, description, icon, trend, color = "default" }: StatCardProps) {
  return (
    <Card className={cn(
      colorClasses[color],
      "relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    )}>
      <CardContent className="p-6 relative">
        {/* 배경 그라디언트 */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          gradientClasses[color]
        )} />

        {/* 배경 아이콘 */}
        {icon && (
          <div className={cn(
            "absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6",
            iconColorClasses[color]
          )}>
            <div className="w-28 h-28">
              {React.cloneElement(icon as React.ReactElement, {
                className: "w-full h-full"
              })}
            </div>
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="relative z-10">
          <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
              {value}
            </p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-600 dark:text-emerald-500" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                {trend.label && ` ${trend.label}`}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 색상 시스템

```tsx
const colorClasses = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  warning: "border-orange-500/20 bg-orange-500/5",
  danger: "border-destructive/20 bg-destructive/5",
};

const iconColorClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-orange-600 dark:text-orange-500",
  danger: "text-destructive",
};

const gradientClasses = {
  default: "from-muted/30 via-transparent to-transparent",
  primary: "from-primary/10 via-primary/5 to-transparent",
  success: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  warning: "from-orange-500/10 via-orange-500/5 to-transparent",
  danger: "from-destructive/10 via-destructive/5 to-transparent",
};
```

---

## 2. 검색 필터 (ListFilter)

### 역할
- 데이터 필터링 UI 제공
- 검색, 드롭다운, 날짜 범위 등 다양한 필드 타입 지원
- 필터 초기화 기능

### 인터페이스

```typescript
// src/components/filters/list-filter.tsx

type FilterFieldType = 'text' | 'select' | 'multiSelect' | 'dateRange' | 'date' | 'number';

interface FilterField {
  name: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
  validation?: (value: any) => boolean;
}

interface ListFilterProps {
  fields: FilterField[];
  defaultValues?: Record<string, any>;
  onFilter: (values: Record<string, any>) => void;
  onReset: () => void;
  className?: string;
}

export function ListFilter({
  fields,
  defaultValues,
  onFilter,
  onReset,
  className
}: ListFilterProps) {
  // 구현
}
```

### 사용 예시

```tsx
import { ListFilter } from "@/components/filters/list-filter";

const filterFields = [
  {
    name: "search",
    type: "text" as const,
    placeholder: "회사명 또는 사업자번호 검색"
  },
  {
    name: "status",
    type: "select" as const,
    label: "상태",
    options: [
      { label: "전체", value: "" },
      { label: "활성", value: "active" },
      { label: "비활성", value: "inactive" },
      { label: "대기", value: "pending" }
    ]
  },
  {
    name: "industry",
    type: "select" as const,
    label: "업종",
    options: [
      { label: "전체", value: "" },
      { label: "제조업", value: "manufacturing" },
      { label: "IT", value: "it" },
      { label: "서비스", value: "service" }
    ]
  },
  {
    name: "createdAt",
    type: "dateRange" as const,
    label: "등록일"
  }
];

<ListFilter
  fields={filterFields}
  onFilter={(values) => {
    console.log('Filter values:', values);
    // API 호출 또는 로컬 필터링
  }}
  onReset={() => {
    console.log('Reset filters');
    // 초기 상태로 복원
  }}
/>
```

---

## 3. 데이터 테이블 + 페이지네이션 (DataTable)

### 역할
- 데이터 표시 (행, 컬럼)
- 정렬, 선택, 행 클릭 등 인터랙션
- 페이지네이션 (내장)

### 인터페이스

```typescript
// src/components/data-table/data-table.tsx

interface DataTableColumn<T> {
  accessorKey: keyof T | string;
  header: string | React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pagination?: PaginationState;
  onPaginationChange?: (pagination: Partial<PaginationState>) => void;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pagination,
  onPaginationChange,
  enableSelection = false,
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = "데이터가 없습니다",
  className
}: DataTableProps<T>) {
  // 구현
}
```

### 사용 예시

```tsx
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Company {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  employeeCount: number;
  createdAt: Date;
}

const columns: DataTableColumn<Company>[] = [
  {
    accessorKey: "name",
    header: "회사명",
    sortable: true
  },
  {
    accessorKey: "industry",
    header: "업종"
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: (row) => {
      const statusMap = {
        active: { label: "활성", variant: "success" },
        inactive: { label: "비활성", variant: "secondary" },
        pending: { label: "대기", variant: "warning" }
      };
      const status = statusMap[row.status];
      return <Badge variant={status.variant}>{status.label}</Badge>;
    }
  },
  {
    accessorKey: "employeeCount",
    header: "직원 수",
    align: "right"
  },
  {
    accessorKey: "createdAt",
    header: "등록일",
    cell: (row) => format(new Date(row.createdAt), "yyyy-MM-dd")
  }
];

const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
  totalPages: 10,
  totalItems: 100
});

<DataTable
  columns={columns}
  data={companies}
  pagination={pagination}
  onPaginationChange={(newPagination) => {
    setPagination({ ...pagination, ...newPagination });
    // API 호출로 새 데이터 가져오기
  }}
  enableSelection
  onSelectionChange={(selected) => {
    console.log('Selected rows:', selected);
  }}
  onRowClick={(row) => {
    router.push(`/adm/companies/${row.id}`);
  }}
  loading={isLoading}
/>
```

---

## 4. 페이지 레이아웃 (ListPageLayout)

### 역할
- 목록 페이지의 일관된 레이아웃 제공
- 페이지 제목, 설명, 액션 버튼 영역

### 인터페이스

```typescript
// src/components/layouts/list-page-layout.tsx

interface ListPageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
  className?: string;
}

export function ListPageLayout({
  title,
  description,
  actions,
  breadcrumbs,
  children,
  className
}: ListPageLayoutProps) {
  // 구현
}
```

### 사용 예시

```tsx
import { ListPageLayout } from "@/components/layouts/list-page-layout";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

<ListPageLayout
  title="회사 관리"
  description="회사 정보를 조회하고 관리합니다"
  actions={
    <div className="flex gap-2">
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        내보내기
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        회사 추가
      </Button>
    </div>
  }
>
  {/* 통계, 필터, 테이블 등 */}
</ListPageLayout>
```

---

## 전체 페이지 구성 예시

### 완전한 목록 페이지 구현

```tsx
// app/(main)/adm/companies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ListPageLayout } from "@/components/layouts/list-page-layout";
import { StatsCards } from "@/components/stats/stats-cards";
import { ListFilter } from "@/components/filters/list-filter";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Building2, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Company {
  id: string;
  name: string;
  businessNumber: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  employeeCount: number;
  createdAt: Date;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [filters, pagination.pageIndex, pagination.pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      // API 호출
      const response = await fetch('/api/companies', {
        method: 'POST',
        body: JSON.stringify({ filters, pagination })
      });
      const data = await response.json();
      setCompanies(data.items);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalItems: data.totalItems
      }));
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터
  const stats = [
    {
      title: "전체 회사",
      value: 125,
      icon: <Building2 className="h-5 w-5" />,
      trend: { value: 12, isPositive: true, label: "전월 대비" }
    },
    {
      title: "활성 회사",
      value: 98,
      description: "정상 운영 중",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "success" as const
    },
    {
      title: "전체 사용자",
      value: "1,234",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "비활성 회사",
      value: 15,
      icon: <XCircle className="h-5 w-5" />,
      color: "warning" as const
    }
  ];

  // 필터 설정
  const filterFields = [
    {
      name: "search",
      type: "text" as const,
      placeholder: "회사명 또는 사업자번호 검색"
    },
    {
      name: "status",
      type: "select" as const,
      label: "상태",
      options: [
        { label: "전체", value: "" },
        { label: "활성", value: "active" },
        { label: "비활성", value: "inactive" },
        { label: "대기", value: "pending" }
      ]
    },
    {
      name: "industry",
      type: "select" as const,
      label: "업종",
      options: [
        { label: "전체", value: "" },
        { label: "제조업", value: "manufacturing" },
        { label: "IT", value: "it" },
        { label: "서비스", value: "service" }
      ]
    },
    {
      name: "createdAt",
      type: "dateRange" as const,
      label: "등록일"
    }
  ];

  // 테이블 컬럼
  const columns = [
    {
      accessorKey: "name",
      header: "회사명",
      sortable: true
    },
    {
      accessorKey: "businessNumber",
      header: "사업자번호"
    },
    {
      accessorKey: "industry",
      header: "업종"
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: (row: Company) => {
        const statusMap = {
          active: { label: "활성", variant: "success" },
          inactive: { label: "비활성", variant: "secondary" },
          pending: { label: "대기", variant: "warning" }
        };
        const status = statusMap[row.status];
        return <Badge variant={status.variant}>{status.label}</Badge>;
      }
    },
    {
      accessorKey: "employeeCount",
      header: "직원 수",
      align: "right" as const
    },
    {
      accessorKey: "createdAt",
      header: "등록일",
      cell: (row: Company) => format(new Date(row.createdAt), "yyyy-MM-dd")
    }
  ];

  return (
    <ListPageLayout
      title="회사 관리"
      description="회사 정보를 조회하고 관리합니다"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button onClick={() => router.push('/adm/companies/new')}>
            <Plus className="h-4 w-4 mr-2" />
            회사 추가
          </Button>
        </div>
      }
    >
      {/* 1. 통계 카드 */}
      <StatsCards cards={stats} columns={4} />

      {/* 2. 필터 */}
      <ListFilter
        fields={filterFields}
        onFilter={(values) => {
          setFilters(values);
          setPagination(prev => ({ ...prev, pageIndex: 0 }));
        }}
        onReset={() => {
          setFilters({});
          setPagination(prev => ({ ...prev, pageIndex: 0 }));
        }}
      />

      {/* 3. 데이터 테이블 + 페이지네이션 */}
      <DataTable
        columns={columns}
        data={companies}
        pagination={pagination}
        onPaginationChange={(newPagination) => {
          setPagination({ ...pagination, ...newPagination });
        }}
        enableSelection
        onSelectionChange={(selected) => {
          console.log('Selected companies:', selected);
        }}
        onRowClick={(row) => {
          router.push(`/adm/companies/${row.id}`);
        }}
        loading={loading}
        emptyMessage="등록된 회사가 없습니다"
      />
    </ListPageLayout>
  );
}
```

---

## 컴포넌트 재사용 예시

### 1. 필터 없이 사용

```tsx
<ListPageLayout title="간단한 목록">
  <DataTable columns={columns} data={data} />
</ListPageLayout>
```

### 2. 통계 없이 사용

```tsx
<ListPageLayout title="목록">
  <ListFilter fields={filterFields} onFilter={handleFilter} onReset={handleReset} />
  <DataTable columns={columns} data={data} />
</ListPageLayout>
```

### 3. 다른 도메인에 재사용

```tsx
// 부서 관리 페이지
const departmentStats = [
  { title: "전체 부서", value: 45 },
  { title: "활성 부서", value: 42 }
];

<StatsCards cards={departmentStats} />
<DataTable columns={departmentColumns} data={departments} />

// 사원 관리 페이지
const employeeFilters = [
  { name: "search", type: "text", placeholder: "사원명 검색" },
  { name: "department", type: "select", label: "부서", options: [...] }
];

<ListFilter fields={employeeFilters} onFilter={handleFilter} />
<DataTable columns={employeeColumns} data={employees} />
```

---

## 장점 및 이점

### 1. 재사용성
- ✅ 동일한 컴포넌트를 여러 페이지에서 사용
- ✅ 도메인 독립적 설계

### 2. 유지보수성
- ✅ 컴포넌트별 독립적 수정 가능
- ✅ 버그 수정 시 한 곳만 수정

### 3. 테스트 용이성
- ✅ 각 컴포넌트를 독립적으로 테스트
- ✅ 단위 테스트 작성 용이

### 4. 확장성
- ✅ 새로운 기능 추가 시 기존 코드 영향 최소화
- ✅ 커스텀 컴포넌트 추가 가능

### 5. 일관성
- ✅ 모든 목록 페이지에서 동일한 UX
- ✅ 디자인 시스템 유지

---

## 안티패턴 (피해야 할 방식)

### ❌ 올인원 컴포넌트

```tsx
// 나쁜 예
<MegaListComponent
  title="회사 관리"
  stats={stats}
  filters={filters}
  columns={columns}
  data={data}
  pagination={pagination}
  onStatsClick={...}
  onFilterChange={...}
  onSort={...}
  onPageChange={...}
  enableSelection
  enableExport
  enablePrint
  // Props가 너무 많아짐!
/>
```

**문제점:**
- Props 과다
- 재사용 불가능
- 테스트 어려움
- 커스터마이징 제한

### ❌ 과도한 추상화

```tsx
// 나쁜 예 - 지나친 추상화
<GenericComponent
  config={{
    type: "list",
    sections: [
      { type: "stats", config: {...} },
      { type: "filter", config: {...} },
      { type: "table", config: {...} }
    ]
  }}
/>
```

**문제점:**
- 복잡한 설정 객체
- 타입 안정성 부족
- 디버깅 어려움

---

## 체크리스트

새로운 목록 페이지를 만들 때 다음을 확인하세요:

- [ ] `ListPageLayout`으로 페이지 구조 생성
- [ ] 통계가 필요하면 `StatsCards` 사용
- [ ] 필터가 필요하면 `ListFilter` 사용
- [ ] `DataTable`로 데이터 표시
- [ ] 페이지네이션 상태 관리 구현
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 빈 데이터 상태 처리
- [ ] 행 클릭 이벤트 구현 (상세 페이지 이동)
- [ ] 선택 기능 필요시 구현

---

## 참고 자료

### 관련 라이브러리
- [TanStack Table](https://tanstack.com/table) - 강력한 테이블 라이브러리
- [shadcn/ui](https://ui.shadcn.com) - 재사용 가능한 컴포넌트
- [Radix UI](https://www.radix-ui.com) - 접근성 좋은 primitive

### 디자인 패턴
- Composition Pattern
- Container/Presentational Pattern
- Compound Component Pattern

### 프로젝트 문서
- [07-FRONTEND-GUIDE.md](./07-FRONTEND-GUIDE.md)
- [04-PROJECT-STRUCTURE.md](./04-PROJECT-STRUCTURE.md)
- [05-NAMING-CONVENTIONS.md](./05-NAMING-CONVENTIONS.md)

---

## 버전 히스토리

- **v1.0** (2025-10-18): 초기 작성
  - 컴포지션 패턴 정의
  - 4가지 핵심 컴포넌트 구조 확립
  - 사용 예시 및 가이드라인 추가
