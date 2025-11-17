# 통합 검색 + 필터 아키텍처 구현

## 📋 개요

기존의 혼재된 용어와 중복된 코드를 **통합 검색 조건 아키텍처**로 재설계했습니다.

모든 검색 및 필터링은 "검색 조건(Search Criteria)"이라는 하나의 개념으로 통일되었습니다.

---

## 🎯 용어 통일

### 개념 정의

모든 페이지에서 서버로 전송되는 데이터:

```typescript
검색 조건 (Search Criteria)
├─ searchText: string          // 자유 검색어 (텍스트 입력)
└─ criteria: Record<...>       // 필터 조건들 (선택형 옵션)
```

### 용어 매핑

| 기존 용어 | 새 개념 | 설명 |
|----------|--------|------|
| SearchText | searchText | 자유 검색어 |
| Filters | criteria | 필터 조건들 |
| SearchFilter | SearchFilter (컴포넌트) | 통합 검색 조건 관리 |
| SearchFilterPopup | FilterPopup (팝업) | 필터 조건 선택 |

---

## 🏗️ 컴포넌트 아키텍처

### 계층 구조

```
Page (예: UsersPage)
  ↓
Module Filter (예: UsersFilter)
  ↓
SearchFilter (공통 컴포넌트)
  ├─ SearchBar (검색 바 UI)
  └─ FilterPopup (필터 팝업)
    └─ CheckboxGroup (체크박스 그룹)
```

### 컴포넌트 설명

#### 1️⃣ **SearchBar** (검색 바 UI)
```typescript
// 위치: components/filters/search-bar.tsx

Props:
  - searchText: 검색어
  - onSearchChange: 검색어 변경 핸들러
  - criteria: 필터 조건들
  - onFilterClick: 필터 버튼 클릭 (팝업 오픈)
  - customButtons?: 커스텀 버튼

기능:
  - 검색 입력란 + 필터 버튼 UI
  - 활성 조건 개수 배지 표시
  - 검색어 초기화 버튼
```

#### 2️⃣ **SearchFilter** (검색 + 필터 조건 관리)
```typescript
// 위치: components/filters/search-filter.tsx

Props:
  - searchText: 검색어
  - onSearchChange: 검색어 변경
  - criteria: 필터 조건들
  - onCriteriaChange: 필터 조건 변경
  - onApply: 적용 (서버 검색 실행)
  - filterItems: 필터 항목 설정

구조:
  - SearchBar (검색 바 UI)
  - FilterPopup (필터 팝업)
```

#### 3️⃣ **FilterPopup** (필터 조건 선택 팝업)
```typescript
// 위치: components/filters/filter-popup.tsx

구조:
  - 좌측: 필터 항목 목록
  - 우측: 선택된 필터의 옵션 (체크박스)
  - 하단: 버튼 (모두 지우기 / 취소 / 적용)

기능:
  - 좌우 분할 레이아웃
  - 멀티 선택 지원
```

---

## 📁 파일 구조

```
components/filters/
├── search-bar.tsx              (새로운) 검색 바 UI
├── search-filter.tsx           (개선) 검색 + 필터 조건 관리
├── filter-popup.tsx            (유지) Jira 스타일 필터 팝업
├── checkbox-group.tsx          (유지) 체크박스 그룹
├── filter-popup.types.ts       (유지) 타입 정의
├── index.ts                    (개선) export 정리
└── search-filter-popup.tsx     ❌ 삭제 (불필요)
```

---

## 🔄 데이터 흐름

### Users 모듈 예제

```typescript
// 1. 상태 정의 (Page)
const [filters, setFilters] = useState<UsersFilterState>({
  status: null,
  userType: null,
});
const [searchText, setSearchText] = useState("");

// 2. UsersFilter 컴포넌트에 전달
<UsersFilter
  searchText={searchText}
  onSearchChange={setSearchText}
  filters={filters}
  onFiltersChange={setFilters}
  onApplyFilters={handleApply}
/>

// 3. UsersFilter는 SearchFilter 사용
<SearchFilter
  searchText={searchText}
  onSearchChange={onSearchChange}
  criteria={filters}              // ← 용어: criteria = 필터 조건들
  onCriteriaChange={onFiltersChange}
  onApply={onApplyFilters}
  filterItems={filterItems}
/>

// 4. SearchFilter는 SearchBar + FilterPopup 구성
<SearchBar
  searchText={searchText}
  onSearchChange={onSearchChange}
  criteria={criteria}
  onFilterClick={() => setFilterOpen(true)}
/>
<FilterPopup
  open={filterOpen}
  onOpenChange={setFilterOpen}
  filters={criteria}
  onFiltersChange={onCriteriaChange}
  onApply={onApply}
  items={filterItems}
/>

// 5. 서버 전송
const useUsers = useQuery(GET_USERS, {
  variables: {
    search: searchText,           // 자유 검색어
    status: filters.status?.join(","),    // 필터 조건
    userType: filters.userType?.join(","), // 필터 조건
  }
});
```

---

## 💡 주요 설계 원칙

### 1️⃣ **단일 책임 원칙 (Single Responsibility)**
- **SearchBar**: UI만 담당 (팝업 관리 X)
- **SearchFilter**: 전체 조합 컴포넌트
- **FilterPopup**: 필터 조건 선택만 담당

### 2️⃣ **용어 통일**
- 모든 필터 조건을 `criteria`로 표현
- 자유 검색은 `searchText`로 표현
- 혼란 없는 일관된 API

### 3️⃣ **재사용성**
- SearchBar: 다양한 컴포넌트에서 재사용 가능
- SearchFilter: 모든 검색 페이지에서 사용
- FilterPopup: 다양한 필터 UI에서 활용 가능

### 4️⃣ **확장성**
- 새로운 필터 조건 추가 시 filterItems만 수정
- 팝업 타입 변경 가능 (select → checkbox)
- 다른 모듈에 쉽게 적용 가능

---

## 📖 사용 가이드

### 기본 사용 방법

#### Step 1: 필터 항목 정의
```typescript
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
```

#### Step 2: 상태 관리 (Page)
```typescript
const [filters, setFilters] = useState({
  status: null,
});
const [searchText, setSearchText] = useState("");

const handleApply = () => {
  // 서버 검색 실행
  refetch();
};
```

#### Step 3: 모듈 필터 컴포넌트에서 SearchFilter 사용
```typescript
export function MyModuleFilter({
  searchText,
  onSearchChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}) {
  return (
    <SearchFilter
      searchText={searchText}
      onSearchChange={onSearchChange}
      criteria={filters}
      onCriteriaChange={onFiltersChange}
      onApply={onApplyFilters}
      filterItems={filterItems}
      searchPlaceholder="모듈별 검색..."
    />
  );
}
```

#### Step 4: Page에서 사용
```typescript
<MyModuleFilter
  searchText={searchText}
  onSearchChange={setSearchText}
  filters={filters}
  onFiltersChange={setFilters}
  onApplyFilters={handleApply}
/>
```

---

## 🚀 마이그레이션 가이드 (다른 모듈)

기존 다른 모듈(API Keys, Roles, Sessions 등)을 새 구조로 변경:

### 기존 구조
```typescript
<SearchFilter
  searchText={searchText}
  onSearchChange={onSearchChange}
  filters={filters}              // ← Record<string, string | null>
  onFiltersChange={onFiltersChange}
  onApplyFilters={onApplyFilters}
  filterItems={filterItems}
/>
```

### 새 구조
```typescript
<SearchFilter
  searchText={searchText}
  onSearchChange={onSearchChange}
  criteria={filters}             // ← Record<string, string[] | null>
  onCriteriaChange={onFiltersChange}
  onApply={onApplyFilters}
  filterItems={filterItems}
/>
```

**변경사항:**
1. `filters` → `criteria` (Props명 변경)
2. `onFiltersChange` → `onCriteriaChange` (Props명 변경)
3. `onApplyFilters` → `onApply` (Props명 변경)
4. `string | null` → `string[] | null` (타입 변경, 멀티 선택)

---

## 📊 비교: 이전 vs 현재

### 이전 구조의 문제점
```
SearchFilter ─┬─ SearchFilterPopup (단일 선택)
              └─ (UI 코드 중복)

UsersFilter ──┬─ FilterPopup (멀티 선택)
              └─ (동일한 UI 코드 재작성)
```

**문제:**
- ❌ 검색 바 UI가 중복됨
- ❌ SearchFilter와 UsersFilter의 관계 불명확
- ❌ 용어 혼란 (Filter vs FilterPopup)

### 현재 구조의 개선점
```
SearchFilter ──┬─ SearchBar (UI)
               └─ FilterPopup (팝업)

UsersFilter ───> SearchFilter (위 컴포넌트 사용)
```

**개선:**
- ✅ UI 코드 완전 제거
- ✅ 명확한 계층 구조
- ✅ 용어 통일 (searchText, criteria)
- ✅ 재사용 가능한 공통 컴포넌트

---

## ✅ 구현 완료 체크리스트

- [x] SearchBar 컴포넌트 생성
- [x] SearchFilter 리팩토링 (FilterPopup 적용)
- [x] UsersFilter 단순화 (SearchFilter 직접 사용)
- [x] 불필요한 SearchFilterPopup 삭제
- [x] 용어 통일 (criteria, searchText)
- [x] 타입 정의 정리
- [x] Export 정리

---

## 🎓 학습 포인트

1. **계층 분리**: UI와 로직을 명확하게 분리
2. **용어 통일**: 일관된 네이밍 컨벤션의 중요성
3. **재사용성**: 공통 컴포넌트로 코드 중복 제거
4. **확장성**: 새로운 필터 추가 시 쉽게 확장 가능

---

## 📝 향후 개선사항

- [ ] 다른 모듈(API Keys, Roles, Sessions)도 SearchFilter 적용
- [ ] 필터 검색 기능 (옵션이 많을 때)
- [ ] 필터 카테고리 그룹화
- [ ] 필터 프리셋 저장/로드
- [ ] 고급 필터 조건 (AND/OR 로직)

---

**구현 완료 일자**: 2025-11-17
**최종 수정**: 아키텍처 통합 및 용어 통일
