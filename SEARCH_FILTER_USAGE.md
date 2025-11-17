# SearchFilter 컴포넌트 사용 가이드

## 개요

Jira 스타일의 검색 + 필터 바를 구현한 공통 컴포넌트입니다.

```
[검색입력란 + 필터버튼]    [커스텀 버튼들(선택사항)]
      (좌측)                    (우측)
```

---

## 레이아웃 설명

### 좌측 섹션
- **검색 입력란**: 고정 너비 (기본값: w-80, 조정 가능)
- **필터 버튼**: 검색 입력란 우측
- 필터 활성화 시 배지로 개수 표시

### 우측 섹션
- **커스텀 버튼들**: 페이지별로 추가 가능 (선택사항)
- flex-end 정렬로 우측 고정
- 추가 작업이 필요한 경우에만 사용

---

## 기본 사용법

### 1. 필터 설정 정의

```typescript
import { type FilterItemConfig } from "@/components/filters";

const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
    ],
  },
  {
    key: "userType",
    label: "사용자 유형",
    options: [
      { value: "ADMIN", label: "관리자" },
      { value: "USER", label: "사용자" },
    ],
  },
];
```

### 2. 기본 구현 (커스텀 버튼 없음)

```typescript
import { useState } from "react";
import { UsersFilter } from "@/features/idam/users/components";

export default function UsersPage() {
  const [localFilters, setLocalFilters] = useState({
    status: null,
    userType: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    status: null,
    userType: null,
  });

  const [searchText, setSearchText] = useState("");

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
  };

  return (
    <div>
      <UsersFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
      />
      {/* 테이블 및 기타 콘텐츠 */}
    </div>
  );
}
```

---

## 고급 사용법 (커스텀 버튼 추가)

### 3. 커스텀 버튼과 함께 사용

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { SearchFilter } from "@/components/filters";

export default function UsersPage() {
  // ... 상태 관리 코드 ...

  // === 커스텀 버튼들 ===
  const customButtons = (
    <>
      {/* 새로 추가 버튼 */}
      <Button
        size="sm"
        onClick={handleCreateUser}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>사용자 추가</span>
      </Button>

      {/* 내보내기 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        <span>내보내기</span>
      </Button>
    </>
  );

  return (
    <div>
      <SearchFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApplyFilters={handleApplyFilters}
        filterItems={filterItems}
        searchPlaceholder="사용자명, 이메일 검색..."
        // === 커스텀 버튼 추가 ===
        customButtons={customButtons}
      />
      {/* 테이블 및 기타 콘텐츠 */}
    </div>
  );
}
```

---

## Props 상세 설명

### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `searchText` | `string` | 검색 입력란의 현재 값 |
| `onSearchChange` | `(text: string) => void` | 검색어 변경 콜백 |
| `filters` | `Record<string, string \| null>` | 필터 상태 객체 |
| `onFiltersChange` | `(filters: ...) => void` | 필터 변경 콜백 |
| `onApplyFilters` | `() => void` | 필터 적용 버튼 클릭 콜백 |
| `filterItems` | `FilterItemConfig[]` | 필터 정의 배열 |

### 선택 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|-------|------|
| `searchPlaceholder` | `string` | `"검색..."` | 검색 입력란 placeholder |
| `searchInputClassName` | `string` | `"w-80"` | 검색 입력란 Tailwind 클래스 |
| `customButtons` | `ReactNode` | `undefined` | 우측에 배치할 커스텀 버튼들 |

---

## FilterItemConfig 타입

```typescript
interface FilterItemConfig {
  /** 필터의 고유 키 (필터 상태 객체의 key) */
  key: string;

  /** UI에 표시될 필터 레이블 */
  label: string;

  /** Select 드롭다운의 옵션 배열 */
  options: Array<{
    value: string;
    label: string;
  }>;

  /** Placeholder 텍스트 (선택사항) */
  placeholder?: string;
}
```

---

## 모듈별 필터 래퍼 예시

### users-filter.tsx

```typescript
/**
 * @file users-filter.tsx
 * @description 사용자 모듈 필터 컴포넌트
 *
 * 공통 SearchFilter를 사용하여 사용자 관련 필터를 제공합니다.
 */

import { SearchFilter, type FilterItemConfig } from "@/components/filters";
import type { UsersFilterState } from "./users-filter-popup";

interface UsersFilterProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filters: UsersFilterState;
  onFiltersChange: (filters: UsersFilterState) => void;
  onApplyFilters: () => void;
  customButtons?: React.ReactNode;
}

// === 사용자 필터 옵션 정의 ===
const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
      { value: "LOCKED", label: "잠금" },
    ],
  },
  {
    key: "userType",
    label: "사용자 유형",
    options: [
      { value: "ADMIN", label: "관리자" },
      { value: "USER", label: "사용자" },
    ],
  },
];

/**
 * 사용자 모듈 검색 + 필터 바
 *
 * 사용자 관련 필터를 제공하고, 페이지에서 커스텀 버튼을 추가할 수 있습니다.
 */
export function UsersFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
  customButtons,
}: UsersFilterProps) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="사용자명, 이메일, 아이디 검색..."
      customButtons={customButtons}
    />
  );
}
```

---

## 데이터 플로우

```
┌─────────────────────────────────────────┐
│ 사용자 입력 (검색/필터)                  │
└────────────┬────────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ SearchFilter       │
    │ (로컬 상태 관리)   │
    └────────┬───────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
localFilters    (임시 필터)
   │
   │ 적용 버튼 클릭
   │
   ▼
handleApplyFilters()
   │
   ▼
appliedFilters (확정 필터)
   │
   ▼
GraphQL 쿼리 실행 (서버 사이드 필터링)
```

---

## 스타일 커스터마이징

### 검색 입력란 너비 조정

```typescript
<SearchFilter
  // ... 필수 props ...
  searchInputClassName="w-96"  // 더 넓게
  // 또는
  searchInputClassName="w-60"  // 더 좁게
/>
```

### 커스텀 버튼 스타일

```typescript
const customButtons = (
  <>
    <Button
      size="sm"
      variant="outline"
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      <span>액션</span>
    </Button>
  </>
);
```

---

## 주의사항

1. **로컬 vs 적용 필터**: 필터는 "적용" 버튼을 클릭할 때만 서버에 전달됩니다.
2. **검색어**: 검색어는 실시간으로 반영됩니다 (GraphQL 쿼리 실행).
3. **커스텀 버튼**: 선택사항이므로 필요한 경우에만 추가하세요.
4. **접근성**: title 속성으로 버튼 기능을 명확히 설명합니다.

---

## 더 보기

- [SearchFilterPopup 컴포넌트](/docs/search-filter-popup.md)
- [Jira 스타일 필터링 아키텍처](/docs/jira-style-filtering.md)
- [GraphQL 쿼리 변수 정의](/docs/graphql-patterns.md)
