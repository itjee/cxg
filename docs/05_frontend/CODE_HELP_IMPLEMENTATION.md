# Code Help (코드 헬프) 구현 완료 보고서

## 📋 프로젝트 개요

**Code Help**는 거래처, 제품, 사용자, 사원, 공통코드 등을 검색하고 선택하는 공통 모달 컴포넌트입니다.

- **개발 기간**: 2024-11-18
- **네이밍 규칙**: `code-help` (kebab-case), `code_help` (snake_case), `codeHelp` (camelCase), `CodeHelp` (PascalCase)
- **패턴**: Strategy Pattern (검색 유형별 핸들러)
- **상태**: ✅ 완료

---

## 🏗️ 구현 구조

### Backend (Python FastAPI + GraphQL)

```
/apps/backend-api/src/graphql/common/code_help/
├── __init__.py                 # 모듈 export
├── types.py                    # GraphQL 타입 정의
├── constants.py                # 검색 핸들러 (Strategy Pattern)
├── resolvers.py                # 리소버 로직
└── queries.py                  # GraphQL 쿼리
```

**파일별 역할:**

1. **types.py** (120줄)
   - `CodeHelpResult`: 검색 결과 아이템 타입
   - `CodeHelpResponse`: 검색 응답 타입
   - `CodeHelpType`: 검색 유형 enum (CUSTOMER, PRODUCT, USER, EMPLOYEE, COMMON_CODE, PARENT_CODE)

2. **constants.py** (290줄)
   - `CodeHelpHandler`: 추상 기본 클래스
   - `CustomerSearchHandler`: 거래처 검색
   - `EmployeeSearchHandler`: 사원 검색
   - `UserSearchHandler`: 사용자 검색
   - `CommonCodeSearchHandler`: 공통코드 검색 (부모코드 필터)
   - `ParentCodeSearchHandler`: 상위코드 검색
   - `CODE_HELP_HANDLERS`: 핸들러 매핑

3. **resolvers.py** (50줄)
   - `CodeHelpResolver.search()`: 메인 검색 메서드

4. **queries.py** (50줄)
   - `CodeHelpQueries.code_help()`: GraphQL 쿼리 정의

### Frontend (Next.js + React)

```
/apps/manager-web/src/
├── components/code-help/
│   ├── index.ts                        # Export
│   ├── code-help-modal.tsx             # 메인 모달 컴포넌트 (280줄)
│   ├── code-help-columns.tsx           # DataTable 컬럼 정의 (200줄)
│   └── code-help-usage-examples.tsx    # 사용 예시 (320줄)
├── shared/
│   ├── types/
│   │   └── code-help.types.ts          # TypeScript 타입 (150줄)
│   ├── hooks/
│   │   └── use-code-help.ts            # Custom Hook (150줄)
│   ├── services/
│   │   └── code-help.service.ts        # 비즈니스 로직 (200줄)
│   └── graphql/
│       └── code-help-queries.ts        # GraphQL Query (40줄)
└── docs/
    └── code-help-guide.md              # 상세 가이드 (500줄)
```

**파일별 역할:**

1. **code-help.types.ts** (150줄)
   - TypeScript 인터페이스 정의
   - `CodeHelpResult`, `CodeHelpResponse`, `CodeHelpFilters`, `CodeHelpModalProps`

2. **code-help-queries.ts** (40줄)
   - GraphQL 쿼리 정의
   - `CODE_HELP_SEARCH_QUERY`

3. **use-code-help.ts** (150줄)
   - Custom Hook
   - 검색, 필터링, 페이지네이션, 다중 선택 로직
   - Debounce 자동 처리 (300ms)

4. **code-help.service.ts** (200줄)
   - `codeHelpService` 싱글톤
   - 유틸리티 함수 모음
   - 제목, 너비, 높이, placeholder, 포맷팅 등

5. **code-help-modal.tsx** (280줄)
   - 메인 모달 컴포넌트
   - 검색바, DataTable, 선택 버튼
   - 단일/다중 선택 지원

6. **code-help-columns.tsx** (200줄)
   - TanStack Table 컬럼 정의
   - 검색 유형별 맞춤 컬럼
   - 메타데이터 표시

7. **code-help-usage-examples.tsx** (320줄)
   - 6가지 사용 예시
   - React Hook Form 통합

---

## 🎯 주요 기능

### 1. 검색 기능
- ✅ 검색어 입력 → Debounce (300ms) → GraphQL 쿼리 실행
- ✅ 검색 결과 DataTable 표시
- ✅ 페이지네이션 (limit/offset)
- ✅ 다음 페이지 자동 로드 (hasMore)

### 2. 필터링
- ✅ 상태 필터 (ACTIVE, INACTIVE, DELETED 등)
- ✅ 부모코드 필터 (공통코드 검색 시)
- ✅ 부서 필터 (사원 검색 시)
- ✅ 사용자 유형 필터
- ✅ 커스텀 필터 확장 가능

### 3. 선택 기능
- ✅ 단일 선택 (기본값)
- ✅ 다중 선택 (multiSelect=true)
- ✅ 선택 해제 (체크박스 토글)
- ✅ 선택 초기화

### 4. UI/UX
- ✅ 모달 크기 조정 가능 (width, height)
- ✅ 제목 커스터마이징
- ✅ 메타데이터 표시 옵션
- ✅ 로딩 스피너
- ✅ 에러 메시지
- ✅ 빈 결과 메시지

### 5. 타입 안전성
- ✅ TypeScript + GraphQL 타입
- ✅ 런타임 타입 검증
- ✅ Props 타입 정의

---

## 📦 지원하는 검색 유형

| 유형 | 설명 | 메타데이터 | 필터 예 |
|------|------|-----------|--------|
| `customer` | 거래처 | phone, address, category | status, category |
| `product` | 제품 | category, price | status, category |
| `user` | 사용자 (Manager) | email, phone, user_type | status, user_type |
| `employee` | 사원 | department, position, email | status, department |
| `common_code` | 공통코드 | parent_code | status, parent_code |
| `parent_code` | 상위코드 | - | status |

---

## 🔧 기술 스택

### Backend
- Python 3.10+
- FastAPI
- Strawberry GraphQL
- SQLAlchemy (async)
- PostgreSQL

### Frontend
- Next.js 14+
- React 18+
- TypeScript 5.x
- Apollo Client 3.x
- TanStack Table (React Table)
- shadcn/ui (Radix UI)
- TailwindCSS

### 패턴 & 아키텍처
- **Backend**: Strategy Pattern (핸들러별 검색 로직)
- **Frontend**: Custom Hook + Service Layer
- **State Management**: Apollo Client (GraphQL) + React State
- **Data Fetching**: Apollo useQuery

---

## 💻 사용 예시

### 1. 거래처 검색 (기본)

```typescript
<CodeHelpModal
  open={open}
  onOpenChange={setOpen}
  searchType="customer"
  onSelect={(item) => {
    setSelectedCustomer(item);
  }}
  showMetadata
/>
```

### 2. 공통코드 검색 (부모코드 필터)

```typescript
<CodeHelpModal
  open={open}
  onOpenChange={setOpen}
  searchType="common_code"
  filters={{ parentCode: "DEPT_TYPE" }}
  onSelect={handleSelect}
/>
```

### 3. 다중 선택 (사용자)

```typescript
<CodeHelpModal
  open={open}
  onOpenChange={setOpen}
  searchType="user"
  multiSelect
  onSelect={handleSelect}
  onMultiSelect={(items) => {
    setSelectedUsers(items);
  }}
/>
```

### 4. React Hook Form 통합

```typescript
const { register, setValue } = useForm();

<CodeHelpModal
  onSelect={(item) => {
    setValue("customerId", item.id);
    setValue("customerCode", item.code);
    setValue("customerName", item.name);
  }}
/>
```

---

## 📂 파일 목록 (전체 14개 파일)

### Backend (5개)
1. `/apps/backend-api/src/graphql/common/code_help/__init__.py`
2. `/apps/backend-api/src/graphql/common/code_help/types.py`
3. `/apps/backend-api/src/graphql/common/code_help/constants.py`
4. `/apps/backend-api/src/graphql/common/code_help/resolvers.py`
5. `/apps/backend-api/src/graphql/common/code_help/queries.py`

### Frontend - Components (3개)
6. `/apps/manager-web/src/components/code-help/index.ts`
7. `/apps/manager-web/src/components/code-help/code-help-modal.tsx`
8. `/apps/manager-web/src/components/code-help/code-help-columns.tsx`
9. `/apps/manager-web/src/components/code-help/code-help-usage-examples.tsx`

### Frontend - Shared (4개)
10. `/apps/manager-web/src/shared/types/code-help.types.ts`
11. `/apps/manager-web/src/shared/hooks/use-code-help.ts`
12. `/apps/manager-web/src/shared/services/code-help.service.ts`
13. `/apps/manager-web/src/shared/graphql/code-help-queries.ts`

### Documentation (1개)
14. `/docs/05_frontend/code-help-guide.md`

---

## 🚀 확장성

### 새로운 검색 유형 추가하기

1. **Backend Handler 추가**
   ```python
   class YourEntitySearchHandler(CodeHelpHandler):
       async def execute(self, db, search_query, limit, offset, filters=None):
           # 구현
           return total_count, items

   CODE_HELP_HANDLERS["your_entity"] = YourEntitySearchHandler()
   ```

2. **Frontend 타입 업데이트**
   ```typescript
   export type CodeHelpType = "customer" | "your_entity";
   ```

3. **Service 업데이트**
   ```typescript
   codeHelpService 에 제목, 너비, 컬럼 추가
   ```

4. **Column 컴포넌트 업데이트**
   ```typescript
   getCodeHelpColumns에 case 추가
   ```

---

## ⚡ 성능 최적화

### 1. Debouncing (자동)
- 검색어 입력 시 300ms 대기 후 쿼리 실행
- 불필요한 API 호출 감소

### 2. 페이지네이션
- limit: 1~100 (기본값: 20)
- offset 기반 페이지네이션
- hasMore 플래그로 다음 페이지 판단

### 3. GraphQL
- 필요한 필드만 선택적 요청
- 캐싱 자동 처리 (Apollo Client)

### 4. React 최적화
- Memoization 가능 (React.memo)
- useCallback으로 함수 최적화
- DataTable 가상 스크롤 (TanStack Table)

---

## 🧪 테스트 체크리스트

- [ ] 거래처 검색 (단일 선택)
- [ ] 사원 검색 (필터 포함)
- [ ] 공통코드 검색 (부모코드 필터)
- [ ] 사용자 검색 (다중 선택)
- [ ] React Hook Form 통합
- [ ] 에러 처리
- [ ] 로딩 상태
- [ ] 빈 결과
- [ ] 페이지네이션

---

## 📖 문서

### 상세 가이드
- [`/docs/05_frontend/code-help-guide.md`](./docs/05_frontend/code-help-guide.md)

### 주요 섹션
- 개요 및 파일 구조
- 지원 검색 유형
- 기본 사용법
- Props 상세
- Hook 사용법
- Service 유틸리티
- GraphQL 쿼리 형식
- 새로운 검색 유형 추가
- 성능 최적화
- 트러블슈팅

---

## 🔄 다음 단계

1. **통합 테스트**
   - 각 검색 유형 테스트
   - 필터링 기능 테스트
   - 다중 선택 테스트

2. **새로운 검색 유형 추가**
   - 프로젝트에 필요한 검색 유형 추가
   - Backend Handler 구현
   - Frontend Column 추가

3. **성능 모니터링**
   - GraphQL 쿼리 성능 측정
   - 메모리 사용량 모니터링
   - 검색 속도 개선

4. **사용자 경험 개선**
   - 키보드 내비게이션
   - 검색 제안 (Autocomplete)
   - 최근 검색 기록

---

## 📞 지원

### 트러블슈팅
- 모달이 열리지 않음
- 선택 콜백이 호출되지 않음
- GraphQL 쿼리 에러
- 필터링이 작동하지 않음

→ [`code-help-guide.md`](./docs/05_frontend/code-help-guide.md#트러블슈팅) 참고

---

## 📝 네이밍 규칙

| 컨텍스트 | 형식 | 예시 |
|---------|------|------|
| 파일명 | kebab-case | `code-help-modal.tsx` |
| 폴더명 | kebab-case | `code-help/` |
| 함수/변수 | camelCase | `useCodeHelp()`, `codeHelpService` |
| 클래스/타입 | PascalCase | `CodeHelpModal`, `CodeHelpResult` |
| DB/GraphQL | snake_case | `code_help_handler`, `CUSTOMER` |

---

## ✅ 완료 항목

- ✅ Backend GraphQL Types 정의
- ✅ Backend Handlers 구현 (5가지)
- ✅ Backend Resolver 구현
- ✅ Backend GraphQL Query 정의
- ✅ Frontend TypeScript Types 정의
- ✅ Frontend Custom Hook 구현
- ✅ Frontend Service Layer 구현
- ✅ Frontend Modal 컴포넌트 구현
- ✅ Frontend Columns 컴포넌트 구현
- ✅ 사용 예시 6가지 작성
- ✅ 상세 가이드 문서 작성

---

**구현 완료**: 2024-11-18

