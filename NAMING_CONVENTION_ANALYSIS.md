# 검색 조건 네이밍 컨벤션 분석

## 📋 현재 혼재된 용어

```typescript
// 혼란스러운 이름들
searchText          // 검색어
criteria            // 필터 조건
filterItems         // 필터 항목
SearchFilter        // 컴포넌트
SearchBar           // 바
FilterPopup         // 팝업
onSearchChange      // 핸들러
onCriteriaChange    // 핸들러
```

**문제**: 같은 개념(서버 검색 조건)인데 용어가 다름

---

## 🎯 추천 네이밍 컨벤션 (3가지)

### Option 1: "Query" 기반 통일 ⭐⭐⭐⭐⭐ (강력 추천)

**개념**: 모든 검색 조건을 "검색 쿼리(Query)"로 통일

```typescript
// Props 명명
queryText              // 자유 검색어 (텍스트)
queryFilters           // 필터 조건들 (선택형)
queryItems             // 검색 조건 항목 설정

// 핸들러 명명
onQueryTextChange      // 검색어 변경
onQueryFiltersChange   // 필터 조건 변경
onQueryApply           // 검색 실행

// 컴포넌트 명명
QueryBar               // 검색 바
QueryFilter            // 검색 조건 관리
QueryPanel             // 검색 조건 선택 팝업

// 상태 관리
const [queryText, setQueryText] = useState("");
const [queryFilters, setQueryFilters] = useState({...});

const handleSearch = () => {
  refetch({
    variables: {
      query: queryText,           // 검색어
      filters: queryFilters       // 필터
    }
  });
};
```

**장점:**
- ✅ "Query" = 데이터베이스 쿼리와 동일 개념
- ✅ 모든 것이 "Query"로 통일됨
- ✅ 직관적이고 이해하기 쉬움
- ✅ 개발자 커뮤니티에서 널리 사용됨
- ✅ REST API 용어와 일맥상통 (query parameters)

**사용 예:**
```typescript
// GraphQL 변수도 명확함
query GetUsers($queryText: String, $queryFilters: UserFilters) {
  users(search: $queryText, filters: $queryFilters) {
    id
  }
}
```

---

### Option 2: "Criteria" 기반 통일 ⭐⭐⭐⭐

**개념**: 모든 검색 조건을 "검색 기준(Criteria)"으로 통일

```typescript
criteriaText           // 검색 텍스트
criteriaFilters        // 필터 조건
criteriaItems          // 기준 항목

onCriteriaTextChange
onCriteriaFiltersChange
onCriteriaApply

CriteriaBar
CriteriaFilter
CriteriaPanel

const [criteriaText, setCriteriaText] = useState("");
const [criteriaFilters, setCriteriaFilters] = useState({...});
```

**장점:**
- ✅ "Criteria" = 기준/조건을 의미
- ✅ 포괄적이고 명확함
- ✅ 비즈니스 언어와 일치

**단점:**
- ❌ 약간 길다 (QueryFilter vs CriteriaFilter)
- ❌ 개발자마다 발음이 다를 수 있음

---

### Option 3: "Condition" 기반 통일 ⭐⭐⭐

**개념**: 모든 검색 조건을 "조건(Condition)"으로 통일

```typescript
conditionText
conditionFilters
conditionItems

onConditionTextChange
onConditionFiltersChange
onConditionApply

ConditionBar
ConditionFilter
ConditionPanel
```

**장점:**
- ✅ 간단하고 직관적
- ✅ "조건"이라는 명확한 의미

**단점:**
- ❌ "Condition" = 프로그래밍 조건(if 문)과 혼동 가능
- ❌ 약간 일반적임

---

### Option 4: "Filter" 기반 통합 ⭐⭐⭐

**개념**: 모든 것을 "Filter"로 통일 (자유 검색어도 포함)

```typescript
filterText             // 검색 텍스트 (필터의 일부)
filterItems            // 선택형 필터
filterConditions       // 필터 조건들

onFilterTextChange
onFilterChange
onFilterApply

FilterBar
FilterPanel
FilterModal
```

**장점:**
- ✅ 간단함
- ✅ "FilterBar"는 직관적

**단점:**
- ❌ 검색어를 "필터"라고 부르기 어색
- ❌ 검색(search)의 의미 손실
- ❌ 실제로는 search + filter인데 filter라고만 부름

---

### Option 5: "Search" 기반 통합 ⭐⭐⭐

**개념**: 모든 것을 "Search"로 통일

```typescript
searchKeyword          // 검색어
searchFilters          // 검색 필터 조건들
searchItems            // 검색 조건 항목

onSearchKeywordChange
onSearchFiltersChange
onSearchApply

SearchBar
SearchFilter
SearchPanel

const handleSearch = () => {
  refetch({
    variables: {
      keyword: searchKeyword,
      filters: searchFilters
    }
  });
};
```

**장점:**
- ✅ "Search"는 이미 익숙한 용어
- ✅ 간단함

**단점:**
- ❌ "searchFilters" = 필터를 Search라고 부르기 어색
- ❌ 자유 검색과 선택형 필터의 차이 모호

---

## 🏆 최종 추천: Option 1 "Query" 기반

### 이유

1. **명확한 개념**: "Query" = 데이터 조회 요청
   - 모든 검색 조건을 하나의 쿼리로 봄
   - 데이터베이스 용어와 일치

2. **일관된 네이밍**
   ```typescript
   queryText              ← 검색어 부분
   queryFilters           ← 필터 조건 부분
   // 모두 Query의 구성 요소
   ```

3. **컴포넌트 이름도 자연스러움**
   ```typescript
   QueryBar               // 쿼리 입력 바
   QueryFilter            // 쿼리 필터 관리
   QueryPanel             // 쿼리 조건 선택
   ```

4. **API와 일치**
   ```typescript
   // GraphQL
   query GetUsers($queryText: String, $queryFilters: Filters) {
     users(query: { text: $queryText, filters: $queryFilters })
   }

   // REST (query parameters)
   GET /api/users?query[text]=...&query[filters][status]=...
   ```

5. **다른 프레임워크와 일치**
   - React Query
   - TanStack Query
   - Apollo Query

---

## 🔄 마이그레이션 계획 (Query 기반)

### 변경 사항

**현재:**
```typescript
searchText
criteria / filters
onSearchChange
onCriteriaChange / onFiltersChange
SearchFilter
SearchBar
```

**변경 후:**
```typescript
queryText
queryFilters
onQueryTextChange
onQueryFiltersChange
QueryFilter
QueryBar
```

### 파일별 변경 사항

#### 1️⃣ search-bar.tsx → query-bar.tsx (또는 유지)

```typescript
// Props 변경
export interface QueryBarProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  queryFilters: Record<string, any>;
  onFilterClick: () => void;
  // ...
}

export function QueryBar({
  queryText,
  onQueryTextChange,
  queryFilters,
  // ...
}: QueryBarProps) {
  // ...
}
```

#### 2️⃣ search-filter.tsx → query-filter.tsx (또는 유지)

```typescript
export interface QueryFilterProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  queryFilters: Record<string, any>;
  onQueryFiltersChange: (filters: Record<string, any>) => void;
  onApply: () => void;
  filterItems: FilterItemConfig[];
}

export function QueryFilter({
  queryText,
  onQueryTextChange,
  queryFilters,
  onQueryFiltersChange,
  onApply,
  filterItems,
}: QueryFilterProps) {
  // ...
}
```

#### 3️⃣ users-filter.tsx

```typescript
export function UsersFilter({
  queryText,           // ← 변경
  onQueryTextChange,   // ← 변경
  queryFilters,        // ← 변경
  onQueryFiltersChange,// ← 변경
  onApplyQuery,        // ← 변경
}: UsersFilterProps) {
  return (
    <QueryFilter
      queryText={queryText}
      onQueryTextChange={onQueryTextChange}
      queryFilters={queryFilters}
      onQueryFiltersChange={onQueryFiltersChange}
      onApply={onApplyQuery}
      filterItems={filterItems}
      searchPlaceholder="사용자명, 이메일, 아이디 검색..."
    />
  );
}
```

#### 4️⃣ users/page.tsx

```typescript
const [queryText, setQueryText] = useState("");
const [queryFilters, setQueryFilters] = useState({
  status: null,
  userType: null,
});

const handleApplyQuery = () => {
  // 서버 쿼리 실행
  refetch({
    variables: {
      search: queryText,
      status: queryFilters.status?.join(","),
      userType: queryFilters.userType?.join(","),
    }
  });
};

<UsersFilter
  queryText={queryText}
  onQueryTextChange={setQueryText}
  queryFilters={queryFilters}
  onQueryFiltersChange={setQueryFilters}
  onApplyQuery={handleApplyQuery}
/>
```

---

## 📊 네이밍 비교표

| 항목 | Query | Criteria | Filter | Search |
|------|-------|----------|--------|--------|
| 직관성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 일관성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 단순성 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| API 호환 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 확장성 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## ✅ 최종 결론

### 추천: **Query 기반 네이밍**

```typescript
// 통합된 네이밍
queryText              // 검색 쿼리 텍스트
queryFilters           // 검색 쿼리 필터 조건
onQueryTextChange      // 쿼리 텍스트 변경
onQueryFiltersChange   // 쿼리 필터 변경
onApplyQuery           // 쿼리 적용 (서버 검색)

QueryBar               // 쿼리 입력 바
QueryFilter            // 쿼리 필터 관리 컴포넌트
FilterPopup            // 필터 조건 선택 팝업 (이 이름 유지 가능)
```

### 이 방식의 장점

1. **명확함**: "Query" = 데이터 조회 요청
2. **일관성**: 모든 것이 "Query"로 통일
3. **확장성**: 복잡한 쿼리 추가 시에도 자연스러움
4. **전문성**: 개발자 커뮤니티에서 인정하는 용어
5. **유지보수**: 코드 읽기와 이해가 쉬움

---

## 🚀 다음 단계

원하신다면 다음과 같이 진행할 수 있습니다:

1. **Query 기반으로 완전 리팩토링**
   - 파일명 변경 (search-filter.tsx → query-filter.tsx 또는 유지)
   - Props 명명 변경
   - 변수명 변경
   - 문서 업데이트

2. **또는 현재 상태 유지**
   - criteria를 모두 queryFilters로 변경만
   - searchText를 queryText로 변경만
   - 파일명은 유지

3. **커스텀 네이밍**
   - 팀의 컨벤션에 맞는 용어 선택

어느 방식으로 진행하시겠습니까?

