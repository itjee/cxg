# Code Help 구현 가이드

## 개요

**Code Help**는 거래처, 제품, 사용자, 사원, 공통코드 등을 검색하고 선택하는 공통 모달 컴포넌트입니다.

- **네이밍**: `code-help`, `code_help`, `codeHelp`, `CodeHelp` (컨텍스트에 맞게 사용)
- **구조**: Backend GraphQL + Frontend React 컴포넌트
- **패턴**: Strategy Pattern (검색 유형별 핸들러)

---

## 파일 구조

### Backend

```
/apps/backend-api/src/graphql/common/code_help/
├── __init__.py                 # 모듈 export
├── types.py                    # GraphQL 타입 정의
├── constants.py                # 검색 핸들러 정의
├── resolvers.py                # 리소버 로직
└── queries.py                  # GraphQL 쿼리
```

### Frontend

```
/apps/manager-web/src/
├── components/code-help/
│   ├── index.ts                        # Export
│   ├── code-help-modal.tsx             # 메인 컴포넌트
│   ├── code-help-columns.tsx           # DataTable 컬럼
│   ├── code-help-usage-examples.tsx    # 사용 예시
│   └── code-help-modal.types.ts        # 타입 (shared로 이동)
├── shared/
│   ├── types/
│   │   └── code-help.types.ts          # TypeScript 타입
│   ├── hooks/
│   │   └── use-code-help.ts            # Custom Hook
│   ├── services/
│   │   └── code-help.service.ts        # 비즈니스 로직
│   └── graphql/
│       └── code-help-queries.ts        # GraphQL Query
└── docs/
    └── code-help-guide.md              # 이 문서
```

---

## 지원하는 검색 유형

| 유형 | 설명 | 메타데이터 | 필터 |
|------|------|-----------|------|
| `customer` | 거래처 | phone, address, category | status, category |
| `product` | 제품 | category, price | status, category |
| `user` | 사용자 (Manager) | email, phone, user_type | status, user_type |
| `employee` | 사원 | department, position, email | status, department |
| `common_code` | 공통코드 | parent_code | status, parent_code |
| `parent_code` | 상위코드 (부모만) | - | status |

---

## 기본 사용법

### 1. 단일 선택 (거래처)

```typescript
"use client";

import { useState } from "react";
import { CodeHelpModal } from "@/components/code-help";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CodeHelpResult } from "@/shared/types/code-help.types";
import { codeHelpService } from "@/shared/services/code-help.service";

export function CustomerForm() {
  const [selectedCustomer, setSelectedCustomer] = useState<CodeHelpResult | null>(null);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const handleSelectCustomer = (item: CodeHelpResult) => {
    setSelectedCustomer(item);
    console.log("선택된 거래처:", item);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="거래처를 선택하세요"
          value={
            selectedCustomer
              ? codeHelpService.formatSelectedItem(selectedCustomer)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="customer"
        width="700px"
        height="600px"
        onSelect={handleSelectCustomer}
        showMetadata
      />
    </div>
  );
}
```

---

### 2. 필터 적용 (부서별 사원 검색)

```typescript
import { CodeHelpModal } from "@/components/code-help";
import type { CodeHelpFilters } from "@/shared/types/code-help.types";

export function EmployeeSearchWithFilter() {
  const [open, setOpen] = useState(false);

  // IT 부서 사원만 검색
  const filters: CodeHelpFilters = {
    department: "IT",
    status: "ACTIVE",
  };

  return (
    <CodeHelpModal
      open={open}
      onOpenChange={setOpen}
      searchType="employee"
      title="IT 부서 사원 검색"
      filters={filters}
      onSelect={(item) => {
        console.log("선택된 사원:", item);
      }}
    />
  );
}
```

---

### 3. 공통코드 검색 (부모코드 필터)

```typescript
export function CommonCodeSelector({ parentCode }: { parentCode: string }) {
  const [open, setOpen] = useState(false);

  const filters: CodeHelpFilters = {
    parentCode, // 예: "DEPT_TYPE"
  };

  return (
    <CodeHelpModal
      open={open}
      onOpenChange={setOpen}
      searchType="common_code"
      title={`${parentCode} 선택`}
      filters={filters}
      onSelect={(item) => {
        console.log("선택된 코드:", item);
      }}
    />
  );
}
```

---

### 4. 다중 선택

```typescript
export function UserMultiSelect() {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<CodeHelpResult[]>([]);

  return (
    <>
      <CodeHelpModal
        open={open}
        onOpenChange={setOpen}
        searchType="user"
        multiSelect={true}
        onSelect={(item) => {
          // 단일 선택 콜백
        }}
        onMultiSelect={(items) => {
          // 다중 선택 콜백
          setSelectedUsers(items);
        }}
      />
    </>
  );
}
```

---

### 5. React Hook Form 통합

```typescript
import { useForm } from "react-hook-form";

interface FormData {
  customerId: string;
  customerCode: string;
  customerName: string;
}

export function OrderForm() {
  const { register, setValue, watch } = useForm<FormData>();
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const handleSelectCustomer = (item: CodeHelpResult) => {
    // 폼 값 자동 설정
    setValue("customerId", item.id);
    setValue("customerCode", item.code);
    setValue("customerName", item.name);
    setOpenCodeHelp(false);
  };

  return (
    <form>
      <div className="grid grid-cols-3 gap-4">
        <input {...register("customerCode")} readOnly />
        <input {...register("customerName")} readOnly />
        <button onClick={() => setOpenCodeHelp(true)}>검색</button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="customer"
        onSelect={handleSelectCustomer}
      />
    </form>
  );
}
```

---

## Props 상세

### CodeHelpModalProps

```typescript
interface CodeHelpModalProps {
  // 필수
  open: boolean;                                    // 모달 오픈 여부
  onOpenChange: (open: boolean) => void;           // 오픈 상태 변경
  searchType: CodeHelpType;                        // 검색 유형
  onSelect: (item: CodeHelpResult) => void;        // 선택 콜백

  // 선택사항
  title?: string;                                  // 모달 제목 (기본값: 자동 설정)
  width?: string;                                  // 모달 너비 (예: "700px")
  height?: string;                                 // 모달 높이 (예: "600px")
  multiSelect?: boolean;                           // 다중 선택 여부 (기본값: false)
  onMultiSelect?: (items: CodeHelpResult[]) => void; // 다중 선택 콜백
  filters?: CodeHelpFilters;                       // 초기 필터
  onFiltersChange?: (filters: CodeHelpFilters) => void; // 필터 변경 콜백
  showMetadata?: boolean;                          // 메타데이터 표시 여부 (기본값: true)
  allowNewEntry?: boolean;                         // 새 항목 추가 버튼 (기본값: false)
  emptyMessage?: string;                           // 검색 결과 없음 메시지
}
```

---

## Hook: useCodeHelp

커스텀 Hook으로 검색, 필터링, 페이지네이션을 자동으로 처리합니다.

```typescript
const {
  // 데이터
  items,              // CodeHelpResult[]
  totalCount,         // 전체 개수
  hasMore,            // 다음 페이지 여부
  selectedItems,      // 선택된 항목 배열

  // 상태
  loading,            // 로딩 상태
  error,              // 에러 정보

  // 액션
  setSearchQuery,     // 검색어 설정 (debounce 자동 적용)
  loadMore,           // 다음 페이지 로드
  handleSelect,       // 항목 선택/해제
  clearSelection,     // 선택 초기화
  handleFiltersChange, // 필터 변경

  // 현재 상태값
  searchQuery,        // 현재 검색어
  offset,             // 현재 오프셋
  filters,            // 현재 필터
} = useCodeHelp({
  searchType: "customer",
  initialFilters: { status: "ACTIVE" },
  pageSize: 20,
  debounceMs: 300,
});
```

---

## Service: codeHelpService

유틸리티 함수 모음

```typescript
// 제목 가져오기
codeHelpService.getDefaultTitle("customer"); // "거래처 검색"

// 기본 너비/높이
codeHelpService.getDefaultWidth("customer"); // "700px"
codeHelpService.getDefaultHeight("customer"); // "600px"

// 검색 placeholder
codeHelpService.getSearchPlaceholder("customer");
// "거래처 코드 또는 명칭으로 검색..."

// 항목 포맷팅
codeHelpService.formatSelectedItem(item);
// "C001 - ABC 거래처"

// 다중 선택 포맷팅
codeHelpService.formatMultipleSelection([item1, item2]);
// "2개 선택됨"

// 메타데이터 필드 가져오기
codeHelpService.getMetadataField(item, "phone");

// 상태 배지 색상
codeHelpService.getStatusVariant("ACTIVE"); // "default"
codeHelpService.getStatusLabel("ACTIVE");   // "활성"

// 기본 필터 가져오기
codeHelpService.getDefaultFilters("customer");
// { status: "ACTIVE" }
```

---

## Backend GraphQL 쿼리

### 요청 형식

```graphql
query {
  codeHelp(
    searchType: CUSTOMER
    searchQuery: "ABC"
    limit: 20
    offset: 0
    filters: { status: "ACTIVE", category: "VIP" }
  ) {
    totalCount
    items {
      id
      code
      name
      description
      metadata
      status
      createdAt
      updatedAt
    }
    hasMore
  }
}
```

### 응답 형식

```json
{
  "data": {
    "codeHelp": {
      "totalCount": 150,
      "items": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "code": "C001",
          "name": "ABC 거래처",
          "description": "서울 본점",
          "metadata": {
            "phone": "02-1234-5678",
            "address": "서울시 강남구",
            "category": "VIP"
          },
          "status": "ACTIVE",
          "createdAt": "2024-11-18T10:00:00Z",
          "updatedAt": "2024-11-18T10:00:00Z"
        }
      ],
      "hasMore": true
    }
  }
}
```

---

## 새로운 검색 유형 추가하기

### 1. Backend Handler 추가

```python
# /apps/backend-api/src/graphql/common/code_help/constants.py

class YourEntitySearchHandler(CodeHelpHandler):
    """귀사 엔티티 검색 핸들러"""

    async def execute(self, db, search_query, limit, offset, filters=None):
        from ...tenants.your.module.models import YourEntity

        query = select(YourEntity)

        # 검색어 필터
        if search_query.strip():
            query = query.filter(
                (YourEntity.code.ilike(f"%{search_query}%")) |
                (YourEntity.name.ilike(f"%{search_query}%"))
            )

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(YourEntity.status == filters["status"])

        # ... 나머지 구현

        return total_count, items

# 핸들러 등록
CODE_HELP_HANDLERS = {
    # ... 기존 핸들러
    "your_entity": YourEntitySearchHandler(),
}
```

### 2. Frontend 타입 업데이트

```typescript
// /src/shared/types/code-help.types.ts

export type CodeHelpType =
  | "customer"
  | "product"
  | "user"
  | "employee"
  | "common_code"
  | "parent_code"
  | "your_entity"; // 추가
```

### 3. Service 업데이트

```typescript
// /src/shared/services/code-help.service.ts

const titles: Record<CodeHelpType, string> = {
  // ... 기존
  your_entity: "귀사 엔티티 검색",
};

const columns: Record<CodeHelpType, string[]> = {
  // ... 기존
  your_entity: ["code", "name", "customField1", "customField2", "status"],
};
```

### 4. Column 컴포넌트 업데이트

```typescript
// /src/components/code-help/code-help-columns.tsx

case "your_entity":
  return [
    {
      accessorKey: "metadata",
      header: "Custom Field 1",
      cell: ({ row }) => (
        <div className="text-sm">
          {codeHelpService.getMetadataField(row.original, "customField1") || "-"}
        </div>
      ),
    },
  ];
```

---

## 성능 최적화

### 1. Debouncing (자동)

검색어는 자동으로 300ms debounce 처리됨:

```typescript
const { searchQuery, setSearchQuery } = useCodeHelp({
  debounceMs: 500, // 기본값: 300
});
```

### 2. 페이지네이션

limit 제한 (1~100, 기본값: 20):

```typescript
const { loadMore } = useCodeHelp({
  pageSize: 50, // 기본값: 20
});
```

### 3. Memo 활용

컴포넌트는 필요시 React.memo로 감싸기:

```typescript
export const CodeHelpModal = React.memo(function CodeHelpModal(props: CodeHelpModalProps) {
  // ...
});
```

---

## 트러블슈팅

### 모달이 열리지 않음

```typescript
// ❌ 잘못된 사용
const [open, setOpen] = useState(false);
<CodeHelpModal open={open} onOpenChange={setOpen} /> {/* 초기값 false */}

// ✅ 올바른 사용
const [open, setOpen] = useState(false);
<button onClick={() => setOpen(true)}>열기</button>
<CodeHelpModal open={open} onOpenChange={setOpen} />
```

### 선택 콜백이 호출되지 않음

```typescript
// ❌ 잘못된 사용
<CodeHelpModal
  onSelect={(item) => {
    // 여기서 setOpen(false)를 호출하지 않음
  }}
/>

// ✅ 올바른 사용 (자동으로 닫힘)
<CodeHelpModal
  onSelect={(item) => {
    setSelectedItem(item);
    setOpen(false); // 명시적으로 필요시에만
  }}
/>
```

### GraphQL 쿼리 에러

```typescript
// ❌ 잘못된 searchType (대소문자 구분)
<CodeHelpModal searchType="Customer" />

// ✅ 올바른 searchType
<CodeHelpModal searchType="customer" />
```

---

## 예시 코드

전체 사용 예시는 다음 파일에서 확인하세요:

```typescript
import {
  CustomerSearchExample,
  EmployeeSearchWithFilterExample,
  CommonCodeSearchExample,
  UserMultiSelectExample,
  CodeHelpIntegrationFormExample,
  ParentCodeSearchExample,
} from "@/components/code-help/code-help-usage-examples";
```

---

## 관련 문서

- [GraphQL 문서](./graphql-guide.md)
- [컴포넌트 가이드](./components-guide.md)
- [Hook 가이드](./hooks-guide.md)

