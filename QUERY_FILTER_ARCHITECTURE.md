# Query 기반 필터 컴포넌트 아키텍처

## 📊 컴포넌트 관계도

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Module Pages                                   │
│  (users/page.tsx, audit-logs/page.tsx, workflows/page.tsx 등)          │
│                                                                          │
│  - 상태: queryText, queryFilters                                        │
│  - 핸들러: handleQueryTextChange, handleApplyQuery                      │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ imports
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         QueryFilter (복합)                              │
│                                                                          │
│  Props:                                                                  │
│  - queryText: string                                                     │
│  - onQueryTextChange: (text) => void                                    │
│  - queryFilters: Record<string, string[] | null>                       │
│  - onQueryFiltersChange: (filters) => void                             │
│  - onApply: () => void                                                  │
│  - filterItems: FilterItemConfig[]                                      │
│  - queryPlaceholder?: string                                            │
│  - customButtons?: React.ReactNode                                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 내부 상태:                                                       │   │
│  │ - queryFilterOpen: boolean (팝업 표시/숨김)                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────┬────────────────────────────────────────┬────────────────┘
                │                                        │
                │ children                               │ children
                ▼                                        ▼
    ┌─────────────────────────┐          ┌──────────────────────────────┐
    │     QueryBar (UI)       │          │   QueryFilterPopup (Modal)   │
    │                         │          │                              │
    │ Props:                  │          │ Props:                       │
    │ - queryText             │          │ - open: boolean              │
    │ - onQueryTextChange     │          │ - onOpenChange: (open) => {} │
    │ - queryFilters          │          │ - queryFilters               │
    │ - onQueryFilterClick    │          │ - onQueryFiltersChange       │
    │ - queryPlaceholder      │          │ - onApply: () => void        │
    │ - customButtons         │          │ - items: FilterItemConfig[]  │
    │                         │          │                              │
    │ 렌더링:                 │          │ 렌더링:                      │
    │ ┌─────────────────────┐ │          │ ┌──────────────────────────┐ │
    │ │ 🔍 검색 입력란      │ │          │ │ 좌측: 필터 항목 목록    │ │
    │ │ (queryText)         │ │          │ │ ┌────────────────────┐  │ │
    │ │                     │ │          │ │ │ • Status ✓ (1)    │  │ │
    │ │ [필터] (1) [⋯]     │ │          │ │ │ • UserType        │  │ │
    │ │                     │ │          │ │ │ • Role            │  │ │
    │ │ [Custom Buttons]    │ │          │ │ └────────────────────┘  │ │
    │ └─────────────────────┘ │          │ │                        │ │
    │                         │          │ │ 우측: 선택된 필터 옵션 │ │
    │ 기능:                   │          │ │ ┌────────────────────┐ │ │
    │ - 검색어 입력/수정      │          │ │ │ ☐ ACTIVE          │ │ │
    │ - 검색어 초기화 (X)     │          │ │ │ ☑ INACTIVE        │ │ │
    │ - 필터 버튼 클릭        │          │ │ │ ☐ LOCKED          │ │ │
    │ - 활성 필터 개수 표시   │          │ │ │                   │ │ │
    │                         │          │ │ │ [이 필터 지우기]  │ │ │
    │                         │          │ │ └────────────────────┘ │ │
    │                         │          │ │                        │ │
    │                         │          │ │ 하단: [모두 지우기]    │ │
    │                         │          │ │ [취소] [적용]          │ │
    │                         │          │ └──────────────────────────┘ │
    └─────────────────────────┘          └──────────────────────────────┘
                                                    │
                                                    │ imports
                                                    ▼
                                        ┌──────────────────────────────┐
                                        │  QueryCheckboxGroup (내부)   │
                                        │                              │
                                        │ Props:                       │
                                        │ - options: FilterOption[]    │
                                        │ - selectedValues: string[]   │
                                        │ - onValuesChange: (vals) => {}
                                        │                              │
                                        │ 렌더링:                      │
                                        │ ┌──────────────────────────┐ │
                                        │ │ ☐ Option 1              │ │
                                        │ │ ☑ Option 2              │ │
                                        │ │ ☐ Option 3              │ │
                                        │ │ ...                      │ │
                                        │ └──────────────────────────┘ │
                                        │                              │
                                        │ 기능:                        │
                                        │ - 체크박스 토글              │
                                        │ - 다중 선택 지원             │
                                        │ - 값 배열로 반환             │
                                        └──────────────────────────────┘
```

## 🔄 데이터 흐름 (Data Flow)

### 1️⃣ 검색어 입력 흐름

```
User Input (검색창)
        │
        ▼
QueryBar.onQueryTextChange()
        │
        ▼
Module Page.handleQueryTextChange()
        │
        ▼
setQueryText() [상태 업데이트]
        │
        ▼
서버 쿼리 (선택사항: 실시간 또는 적용 시)
```

### 2️⃣ 필터 선택 흐름

```
User Click (필터 버튼)
        │
        ▼
QueryBar.onQueryFilterClick()
        │
        ▼
QueryFilter: setQueryFilterOpen(true)
        │
        ▼
QueryFilterPopup 표시
        │
        ├─ 좌측 필터 항목 선택
        │   │
        │   ▼
        │ setSelectedItemKey()
        │
        └─ 우측 체크박스 변경
            │
            ▼
        QueryCheckboxGroup.onValuesChange()
            │
            ▼
        QueryFilterPopup.handleCheckboxChange()
            │
            ▼
        onQueryFiltersChange() [콜백]
            │
            ▼
        Module Page.setLocalQueryFilters()
```

### 3️⃣ 필터 적용 흐름

```
User Click (적용 버튼)
        │
        ▼
QueryFilterPopup.handleApply()
        │
        ├─ onApply() [콜백]
        │   │
        │   ▼
        │ Module Page.handleApplyQuery()
        │   │
        │   ▼
        │ setQueryFilters(localQueryFilters)
        │   │
        │   ▼
        │ 서버 쿼리 실행
        │
        └─ onOpenChange(false)
            │
            ▼
        QueryFilterPopup 닫기
```

## 📋 Props 데이터 구조

### FilterItemConfig (필터 항목 설정)

```typescript
interface FilterItemConfig {
  key: string;                    // "status", "userType" 등
  label: string;                  // "상태", "사용자 유형"
  options: FilterOption[];        // 선택 옵션 배열
}

interface FilterOption {
  value: string;                  // "ACTIVE", "INACTIVE" 등
  label: string;                  // "활성", "비활성"
}
```

### 상태 관리 (State Management)

```typescript
// Module Page Level
const [queryText, setQueryText] = useState<string>("");
const [queryFilters, setQueryFilters] = useState<UsersFilterState>({
  status: null,        // null | ["ACTIVE", "LOCKED"]
  userType: null,      // null | ["ADMIN", "USER"]
});

// QueryFilter 내부
const [queryFilterOpen, setQueryFilterOpen] = useState<boolean>(false);

// QueryFilterPopup 내부
const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
const [localQueryFilters, setLocalQueryFilters] = useState(queryFilters);
```

## 🎯 컴포넌트별 책임

### QueryFilter (복합 컴포넌트)
- ✅ QueryBar + QueryFilterPopup 조율
- ✅ 팝업 열기/닫기 상태 관리
- ✅ 부모와 자식 컴포넌트 통신

### QueryBar (UI)
- ✅ 검색 입력 필드 렌더링
- ✅ 필터 버튼 렌더링
- ✅ 활성 필터 개수 배지 표시
- ✅ 커스텀 버튼 렌더링
- ✅ 검색어 변경 콜백

### QueryFilterPopup (모달)
- ✅ 필터 팝업 UI 렌더링
- ✅ 필터 항목 목록 좌측 패널
- ✅ 선택된 필터의 옵션 우측 패널
- ✅ 체크박스 토글 처리
- ✅ 모두 지우기/이 필터 지우기 기능
- ✅ 적용/취소 버튼 처리

### QueryCheckboxGroup (내부)
- ✅ 체크박스 목록 렌더링
- ✅ 다중 선택 처리
- ✅ 선택값 배열로 반환

## 📌 모듈별 사용 패턴

### Users 모듈 (QueryFilter 사용)

```typescript
// users/page.tsx
const [queryText, setQueryText] = useState("");
const [queryFilters, setQueryFilters] = useState({
  status: null,
  userType: null,
});

<UsersFilter
  queryText={queryText}
  onQueryTextChange={setQueryText}
  queryFilters={queryFilters}
  onQueryFiltersChange={setLocalQueryFilters}
  onApplyQuery={handleApplyQuery}
/>
```

### Audit-logs 모듈 (QueryFilters 사용)

```typescript
// audit-logs-filters.tsx
const filterConfigs: FilterConfig[] = [
  {
    key: "searchText",
    label: "검색",
    type: "search",
    // ...
  },
  {
    key: "eventType",
    label: "이벤트 유형",
    type: "multiSelect",
    options: [...]
  }
];

<QueryFilters
  filters={filterConfigs}
  values={filterValues}
  onChange={handleFilterChange}
  onReset={handleReset}
/>
```

## 🔗 의존성 그래프

```
index.ts (export)
├── query-bar.tsx (UI)
├── query-filter.tsx (복합)
│   ├── query-bar.tsx (import)
│   └── query-filter-popup.tsx (import)
│       ├── query-checkbox-group.tsx (import)
│       └── query-popup.types.ts (import)
├── query-filter-popup.tsx (모달)
│   ├── query-checkbox-group.tsx (import)
│   └── query-popup.types.ts (import)
├── query-checkbox-group.tsx (내부)
├── query-filters.tsx (기본 필터 UI)
└── query-popup.types.ts (타입)
```

## 💡 사용 예시

### Users 모듈 (QueryFilter 사용 - 권장)

```tsx
import { QueryFilter, type FilterItemConfig } from "@/components/filters";

const filterItems: FilterItemConfig[] = [
  {
    key: "status",
    label: "상태",
    options: [
      { value: "ACTIVE", label: "활성" },
      { value: "INACTIVE", label: "비활성" },
    ],
  },
];

export default function UsersPage() {
  const [queryText, setQueryText] = useState("");
  const [queryFilters, setQueryFilters] = useState({ status: null });

  const handleApplyQuery = () => {
    // 서버 쿼리 실행
    refetch({ variables: { search: queryText, status: queryFilters.status } });
  };

  return (
    <QueryFilter
      queryText={queryText}
      onQueryTextChange={setQueryText}
      queryFilters={queryFilters}
      onQueryFiltersChange={setQueryFilters}
      onApply={handleApplyQuery}
      filterItems={filterItems}
      queryPlaceholder="검색..."
    />
  );
}
```

### Audit-logs 모듈 (QueryFilters 사용)

```tsx
import { QueryFilters, type FilterConfig } from "@/components/filters";

export function AuditLogsFilters() {
  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      type: "search",
      placeholder: "설명, IP로 검색...",
    },
    {
      key: "eventType",
      label: "이벤트 유형",
      type: "multiSelect",
      options: [
        { value: "LOGIN", label: "로그인" },
        { value: "LOGOUT", label: "로그아웃" },
      ],
    },
  ];

  const handleFilterChange = (key: string, value: any) => {
    // 필터 값 업데이트
  };

  return (
    <QueryFilters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      onReset={handleReset}
    />
  );
}
```

## 🎨 스타일링 및 커스터마이징

### QueryBar 너비 제어

```tsx
<QueryFilter
  queryPlaceholder="검색..."
  queryInputClassName="w-96" // Tailwind 클래스
/>
```

### 커스텀 버튼 추가

```tsx
<QueryFilter
  customButtons={
    <>
      <Button onClick={handleExport}>내보내기</Button>
      <Button onClick={handleImport}>가져오기</Button>
    </>
  }
/>
```

## ✨ 주요 특징

1. **통일된 네이밍**: 모든 Query 기반 컴포넌트
2. **명확한 책임 분리**: UI, 상태, 로직 분리
3. **재사용 가능**: QueryFilter(자유 + 선택형), QueryFilters(다양한 타입)
4. **타입 안전성**: TypeScript 완벽 지원
5. **확장성**: 새로운 필터 타입 추가 용이
6. **접근성**: ARIA 레이블, 키보드 네비게이션 지원
