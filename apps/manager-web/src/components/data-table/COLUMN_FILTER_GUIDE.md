# DataTable 컬럼 필터 가이드

## 개요

DataTable 컴포넌트에서 컬럼별 필터 기능을 구현하는 방법입니다.

---

## 1. 기본 사용법

### DataTableColumnHeader 컴포넌트 사용

```typescript
import { DataTableColumnHeader } from "@/components/data-table";

// 컬럼 정의에서 header 커스터마이징
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="사용자명"
        canSort={true}
        canFilter={true}  // 필터 활성화
      />
    ),
  },
];
```

### 필터 함수 추가

```typescript
import {
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { textFilterFn } from "@/components/data-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="사용자명"
        canFilter={true}
      />
    ),
    // 필터 함수 지정
    filterFn: textFilterFn,
  },
];
```

---

## 2. 필터 함수 종류

### textFilterFn
대소문자 구분 없이 포함 여부로 필터링

```typescript
{
  accessorKey: "email",
  filterFn: textFilterFn, // "test@example.com" 검색하면 "test" 입력으로도 매칭
}
```

### exactFilterFn
정확히 일치하는 경우만 필터링

```typescript
{
  accessorKey: "status",
  filterFn: exactFilterFn, // "ACTIVE" 입력 시 정확히 "ACTIVE"인 항목만
}
```

### statusFilterFn
상태값 필터링 (쉼표로 구분된 여러 값 지원)

```typescript
{
  accessorKey: "status",
  filterFn: statusFilterFn, // "ACTIVE,INACTIVE" 검색하면 둘 다 표시
}
```

### dateRangeFilterFn
날짜 범위 필터링 (형식: "2024-01-01,2024-12-31")

```typescript
{
  accessorKey: "createdAt",
  filterFn: dateRangeFilterFn,
}
```

### numberRangeFilterFn
숫자 범위 필터링 (형식: "1-100")

```typescript
{
  accessorKey: "age",
  filterFn: numberRangeFilterFn,
}
```

---

## 3. 완전한 예제

### Users 테이블에서 여러 컬럼 필터링

```typescript
// apps/manager-web/src/features/idam/users/components/users-columns.tsx

import {
  DataTableColumnHeader,
  textFilterFn,
  statusFilterFn,
} from "@/components/data-table";

export const getUsersColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="사용자명"
        canSort={true}
        canFilter={true}
      />
    ),
    filterFn: textFilterFn,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="이메일"
        canSort={true}
        canFilter={true}
      />
    ),
    filterFn: textFilterFn,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="상태"
        canSort={false}
        canFilter={true}
      />
    ),
    filterFn: statusFilterFn,
  },
];
```

---

## 4. 커스텀 필터 함수 만들기

필터 함수는 다음 서명을 따릅니다:

```typescript
function myCustomFilter(
  row: Row<TData>,
  columnId: string,
  filterValue: string
): boolean {
  // true면 행 표시, false면 숨김
  const cellValue = row.getValue(columnId);
  return /* 필터 로직 */;
}

// 사용 예
const columns = [
  {
    accessorKey: "phone",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const phone = row.getValue(columnId) as string;
      return phone.replace(/[^0-9]/g, "").includes(
        filterValue.replace(/[^0-9]/g, "")
      );
    },
  },
];
```

---

## 5. 필터링 구조

DataTable에서의 필터링은 3단계로 이루어집니다:

```
┌─────────────────────────────────┐
│ 1️⃣ searchText (서버 필터)        │
│ → GraphQL 쿼리변수 전달          │
│ → 서버에서 데이터 필터링         │
└─────────────────────────────────┘
              ↓
    조회된 데이터 (예: 100개)
              ↓
┌─────────────────────────────────┐
│ 2️⃣ searchInResults (클라이언트)  │
│ → 전체 컬럼 통합 검색            │
│ → globalFilter 사용              │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ 3️⃣ columnFilters (컬럼별)       │
│ → 특정 컬럼만 필터링             │
│ → TanStack Table columnFilters   │
└─────────────────────────────────┘
```

---

## 6. API 참고

### DataTableColumnHeader Props

| Props | Type | Default | 설명 |
|-------|------|---------|------|
| column | Column | - | TanStack Table의 Column 객체 |
| title | string | - | 헤더 제목 |
| canSort | boolean | true | 정렬 기능 활성화 |
| canFilter | boolean | false | 필터 기능 활성화 |

### filterFn Signature

```typescript
type FilterFn<TData> = (
  row: Row<TData>,
  columnId: string,
  filterValue: string
) => boolean;
```

---

## 7. 주의사항

1. **필터와 정렬의 차이**
   - 정렬: 데이터 순서 변경
   - 필터: 조건을 만족하는 행만 표시

2. **성능 고려**
   - 매우 많은 데이터(1000개+)는 서버 필터링 권장
   - 클라이언트 필터는 보조 필터로 사용

3. **필터값 초기화**
   - 검색 결과가 empty일 때 필터 상태 자동 유지
   - 필터를 초기화하려면 컬럼 헤더의 필터 버튼에서 '필터 초기화' 선택

---

## 8. 전체 예제

```typescript
// apps/manager-web/src/features/idam/users/components/users-columns.tsx

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  DataTableColumnHeader,
  textFilterFn,
  statusFilterFn,
  dateRangeFilterFn,
} from "@/components/data-table";
import type { User } from "../types/users.types";

export const getUsersColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="사용자명"
        canSort={true}
        canFilter={true}
      />
    ),
    filterFn: textFilterFn,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="이메일"
        canSort={true}
        canFilter={true}
      />
    ),
    filterFn: textFilterFn,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="상태"
        canSort={false}
        canFilter={true}
      />
    ),
    filterFn: statusFilterFn,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="생성일"
        canSort={true}
        canFilter={true}
      />
    ),
    filterFn: dateRangeFilterFn,
  },
];
```

---

## 🎯 요약

1. **서버 필터**: `searchText` - 백엔드에서 처리 (효율적)
2. **결과 내 검색**: `searchInResults` - 클라이언트 글로벌 필터 (빠른 응답)
3. **컬럼별 필터**: `columnFilters` - 특정 컬럼만 필터링 (정밀함)

세 가지 필터가 함께 작동하여 강력한 검색/필터링 기능을 제공합니다!
