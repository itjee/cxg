# Jira 스타일 필터 팝업 구현 완료

## 📋 개요

기존의 단순한 Select 기반 필터링을 **Jira 스타일의 고급 멀티 선택 필터 팝업**으로 전환했습니다.

## 🎯 구현 구조

### 좌우 분할 레이아웃

```
┌─────────────────────────────────────────┐
│          필터 설정 팝업                    │
├──────────────────┬──────────────────────┤
│  필터 항목 목록   │   선택 옵션 (체크박스) │
│  (좌측, w-48)   │   (우측, flex-1)      │
│                  │                      │
│ ☑ 상태 [2]      │ ☑ 활성              │
│ ☐ 사용자타입    │ ☐ 비활성            │
│                  │ ☑ 잠금              │
│                  │                      │
│                  │ [이 필터 지우기]    │
├──────────────────┼──────────────────────┤
│                                        │
│ [모두 지우기]      [취소]  [적용]       │
└─────────────────────────────────────────┘
```

## 📁 생성된 파일

### 1. **filter-popup.types.ts** - 타입 정의
```typescript
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterItemConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

export type FilterState = Record<string, string[] | null>;

export interface FilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  items: FilterItemConfig[];
}
```

### 2. **checkbox-group.tsx** - 체크박스 그룹 컴포넌트
- 멀티 선택을 위한 체크박스 목록 렌더링
- 선택/해제 로직 처리
- 라벨과 함께 사용자 친화적 UI

### 3. **filter-popup.tsx** - 필터 팝업 컴포넌트
- 좌측: 필터 항목 선택 (선택된 항목은 하이라이트)
- 우측: 선택된 항목의 옵션 체크박스
- 하단: 모두 지우기 / 이 필터 지우기 / 취소 / 적용 버튼

**주요 기능:**
- ✅ 멀티 선택 지원 (여러 옵션 동시 선택)
- ✅ 필터별 선택 개수 배지 표시
- ✅ 필터 전체 초기화 (모두 지우기)
- ✅ 현재 필터만 초기화 (이 필터 지우기)
- ✅ 팝업 닫기 시 변경사항 미적용 (취소)

## 🔄 업데이트된 파일

### Users 필터 구현 변경사항

#### 1. **users.types.ts** - 필터 상태 타입 변경
```typescript
// 기존 (단일 선택)
status: string | null;

// 변경 (멀티 선택)
status: string[] | null;  // ["ACTIVE", "LOCKED"]
```

#### 2. **users-filter.tsx** - 새로운 구조로 전환
- 기존: SearchFilter 컴포넌트 사용
- 변경: FilterPopup 컴포넌트 직접 사용
- 검색 바와 필터 버튼을 포함한 전체 UI 구성

#### 3. **idam/users/page.tsx** - GraphQL 쿼리 변경
```typescript
// 기존
status: appliedFilters.status || undefined

// 변경 (배열을 쉼표로 구분된 문자열로 변환)
status: filters.status ? filters.status.join(",") : undefined
```

## 🎨 UI 특징

### 스타일링 하이라이트

1. **좌측 필터 패널**
   - 선택된 항목: 진한 배경색 + 흰색 텍스트
   - 선택되지 않음: Hover 시 밝은 배경색
   - 선택 개수 배지: 동그란 배지로 시각화

2. **우측 옵션 패널**
   - 현재 필터 이름과 "이 필터 지우기" 버튼
   - 체크박스로 멀티 선택 가능
   - 옵션이 없을 때: "왼쪽에서 필터를 선택해주세요" 메시지

3. **버튼 레이아웃**
   - 좌측: "모두 지우기" (필터 선택 시에만 활성)
   - 우측: "취소" / "적용" 버튼

## 🔌 사용 방법

### 1. FilterPopup 임포트
```typescript
import { FilterPopup } from "@/components/filters";
import type { FilterItemConfig, FilterState } from "@/components/filters/filter-popup.types";
```

### 2. 필터 항목 정의
```typescript
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
```

### 3. 상태 관리
```typescript
const [filters, setFilters] = useState<FilterState>({
  status: null,
  userType: null,
});

const [open, setOpen] = useState(false);

// 필터 적용 시 서버 쿼리 실행
const handleApply = () => {
  // filters를 GraphQL 변수로 전달
  setFilters(localFilters);
};
```

### 4. 컴포넌트 렌더링
```typescript
<FilterPopup
  open={open}
  onOpenChange={setOpen}
  filters={filters}
  onFiltersChange={setLocalFilters}
  onApply={handleApply}
  items={filterItems}
/>
```

## 📊 데이터 흐름

```
사용자가 필터 버튼 클릭
    ↓
팝업 열기 (open = true)
    ↓
좌측에서 필터 항목 선택 (예: "상태")
    ↓
우측에 옵션 표시 (활성, 비활성, 잠금)
    ↓
사용자가 옵션 체크박스 선택 (예: "활성", "잠금")
    ↓
상태 업데이트: filters.status = ["ACTIVE", "LOCKED"]
    ↓
"적용" 버튼 클릭
    ↓
GraphQL 쿼리 실행 with filters
    ↓
서버에서 "활성" 또는 "잠금" 상태의 사용자만 반환
```

## 🚀 GraphQL 호환성

### 백엔드 쿼리 수정 필요

현재 Users GraphQL 쿼리:
```graphql
query GetUsers(
  $status: String      # 단일 문자열
  $userType: String
) {
  users(status: $status, userType: $userType) {
    id
    ...
  }
}
```

권장 변경:
```graphql
query GetUsers(
  $status: String      # "ACTIVE,LOCKED" (쉼표 구분)
  $userType: String    # "ADMIN,USER"
) {
  # 백엔드에서 배열 파싱 필요
  users(status: $status, userType: $userType) {
    id
    ...
  }
}
```

또는 배열 타입 지원:
```graphql
query GetUsers(
  $status: [String!]   # 배열 타입
  $userType: [String!]
) {
  users(status: $status, userType: $userType) {
    id
    ...
  }
}
```

## ✅ 체크리스트

### 구현 완료
- [x] FilterPopup 컴포넌트 구현
- [x] CheckboxGroup 컴포넌트 구현
- [x] 좌우 분할 레이아웃
- [x] 멀티 선택 로직
- [x] 필터 초기화 기능
- [x] Users 모듈에 적용
- [x] 스타일링 및 레이아웃 최적화

### 향후 개선사항
- [ ] 다른 모듈에 FilterPopup 적용 (API Keys, Roles, Sessions 등)
- [ ] 필터 아이콘 추가
- [ ] 필터 카테고리 그룹화
- [ ] 검색 필터 추가 (옵션이 많을 때)
- [ ] 필터 저장/로드 기능
- [ ] 백엔드 GraphQL 배열 타입 지원 확인

## 📝 주의사항

1. **GraphQL 변수 변환**: 배열 필터를 서버에 전달할 때 쉼표로 구분된 문자열로 변환 필요
   ```typescript
   status: filters.status ? filters.status.join(",") : undefined
   ```

2. **백엔드 호환성**: 기존에 단일 값을 받던 GraphQL 쿼리는 쉼표로 구분된 문자열 파싱 필요

3. **필터 상태 초기화**: 팝업 닫기 시 변경사항이 적용되지 않으려면 "취소" 버튼 사용

## 🎓 학습 포인트

- **Jira 스타일 UI 패턴**: 좌우 분할 레이아웃으로 직관적인 필터 선택
- **상태 관리 분리**: 임시 상태(localFilters)와 확정 상태(filters) 분리
- **멀티 선택 구현**: 배열 기반 필터 상태 관리
- **재사용 가능한 컴포넌트**: 다른 모듈에서 쉽게 적용 가능한 구조

---

**구현 완료 일자**: 2025-11-17
**담당자**: Claude Code
