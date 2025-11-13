# Manager-Web Auto Feature 개선 요약

## 개요

`/apps/manager-web/src/features/auto` 폴더의 workflows 및 schedules 기능을 프론트엔드 가이드 기준에 맞춰 개선했습니다.

## 주요 개선 사항

### 1. 테이블 컴포넌트 통합 및 표준화

#### Before (문제점)
- 구식 UI 컴포넌트 사용 (직접 Table, TableRow 등 사용)
- 별도의 `workflows-paging.tsx`, `workflows-filters.tsx` 컴포넌트
- TanStack Table 미활용
- 중복된 상태 관리 (Store + 개별 컴포넌트)

#### After (개선)
- **TanStack Table 기반 DataTable 사용**
  - 정렬, 필터링, 페이지네이션 통합
  - 일관된 UI/UX
  - 성능 최적화 (가상화, 메모이제이션)

```typescript
// workflows-table.tsx - 개선 후
export function WorkflowsTable({ data, onEdit, onDelete, onToggle }: WorkflowsTableProps) {
  const { sorting, setSorting } = useWorkflowsStore();
  const columns = createWorkflowsColumns(onEdit, onDelete, onToggle);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="워크플로우명 검색..."
      showColumnVisibility={false}
      showPagination={true}
      pageSize={20}
      useCollapsibleFilter={true}
      filters={[
        {
          key: "is_active",
          label: "상태",
          options: [
            { label: "활성", value: "true" },
            { label: "비활성", value: "false" },
          ],
        },
      ]}
    />
  );
}
```

### 2. 컬럼 정의 함수 패턴 적용

#### Before
- 컬럼 정의가 컴포넌트 내부에 하드코딩
- 재사용 불가능

#### After
- **createWorkflowsColumns 함수로 분리**
- 이벤트 핸들러를 파라미터로 받음
- 타입 안전성 확보
- JSDoc 문서화

```typescript
/**
 * 워크플로우 테이블 컬럼 정의 생성 함수
 */
export function createWorkflowsColumns(
  onEditWorkflow: (workflow: Workflows) => void,
  onDeleteWorkflow: (workflow: Workflows) => void,
  onToggleWorkflow?: (workflow: Workflows) => void
): ColumnDef<Workflows>[] {
  return [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    // ... 나머지 컬럼 정의
  ];
}
```

### 3. Zustand Store 간소화

#### Before
- 불필요한 필터/페이징 상태 관리
- DataTable과 중복된 책임

```typescript
interface WorkflowsStore {
  globalFilter: string;
  selectedStatus: string;
  currentPage: number;
  itemsPerPage: number;
  setGlobalFilter: (filter: string) => void;
  setSelectedStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  // ...
}
```

#### After
- **필요한 UI 상태만 관리** (모달, 정렬)
- DataTable이 필터/페이징 담당
- 단일 책임 원칙 준수

```typescript
interface WorkflowsStore {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
}
```

### 4. 컴포넌트 제거 및 통합

#### 삭제된 컴포넌트
- ✂️ `workflows-paging.tsx` - DataTable 내부 페이지네이션 사용
- ✂️ `workflows-filters.tsx` - DataTable 내부 필터 사용
- ✂️ `schedules-paging.tsx` - 동일 이유
- ✂️ `schedules-filters.tsx` - 동일 이유

#### 효과
- 코드 중복 제거
- 유지보수 포인트 감소
- 일관된 사용자 경험

### 5. 페이지 컴포넌트 생성

새로운 워크플로우 페이지 생성:
- `/apps/manager-web/src/app/(main)/auto/workflows/page.tsx`
- 표준 패턴 적용
- TanStack Query hooks 사용
- 에러/로딩 상태 처리
- Toast 알림 통합

```typescript
export default function WorkflowsPage() {
  const { openForm } = useWorkflowsStore();
  const { data: workflowsResponse, isLoading, error, refetch } = useWorkflows();
  
  const deleteWorkflowMutation = useDeleteWorkflow({
    onSuccess: () => toast.success('워크플로우가 삭제되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  // ... 렌더링 로직
}
```

### 6. 문서화 개선

#### 추가된 JSDoc
- 모든 함수/컴포넌트에 설명 추가
- 파라미터 타입 및 설명
- 사용 예제 제공
- 아키텍처 다이어그램

```typescript
/**
 * 날짜/시간 포맷 유틸리티 함수
 * 
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025.11.06") 또는 "-"
 * 
 * @example
 * ```ts
 * formatDate("2025-11-06T10:30:00Z") // "2025.11.06"
 * formatDate(undefined) // "-"
 * ```
 */
function formatDate(dateString?: string): string {
  // ...
}
```

## 변경된 파일 목록

### Workflows Feature
- ✏️ `features/auto/workflows/components/workflows-table.tsx` - 전면 개선
- ✂️ `features/auto/workflows/components/workflows-paging.tsx` - 삭제
- ✂️ `features/auto/workflows/components/workflows-filters.tsx` - 삭제
- ✏️ `features/auto/workflows/components/index.ts` - 수정
- ✏️ `features/auto/workflows/stores/workflows.store.ts` - 간소화
- ✅ `app/(main)/auto/workflows/page.tsx` - 신규 생성

### Schedules Feature
- ✏️ `features/auto/schedules/components/schedules-table.tsx` - 전면 개선
- ✂️ `features/auto/schedules/components/schedules-paging.tsx` - 삭제
- ✂️ `features/auto/schedules/components/schedules-filters.tsx` - 삭제
- ✏️ `features/auto/schedules/components/index.ts` - 수정
- ✏️ `features/auto/schedules/stores/schedules.store.ts` - 간소화

## 적용된 프론트엔드 가이드 원칙

### 1. ✅ Feature-driven 아키텍처
- 도메인별 코드 그룹화 유지
- 독립적인 모듈 구조

### 2. ✅ 관심사의 분리
```
Page → Component → Hook → Service
         ↓
    DataTable (필터, 페이징, 정렬)
         ↓
      Store (모달, 정렬 상태만)
```

### 3. ✅ 계층별 책임
- **Page**: 라우팅, 최소한의 로직
- **Component**: UI 렌더링, 이벤트 전달
- **DataTable**: 테이블 기능 (필터, 페이징, 정렬)
- **Hook**: 서버 상태 관리 (TanStack Query)
- **Store**: UI 상태 관리 (모달, 정렬)

### 4. ✅ 타입 안전성
- 모든 함수에 명시적 타입
- 인터페이스 정의
- Generic 타입 활용

### 5. ✅ 컴포넌트 패턴
- 컬럼 정의 함수 패턴
- Props 인터페이스 정의
- 이벤트 핸들러 Props로 전달

## 장점 및 효과

### 코드 품질
- ✅ 중복 코드 제거 (4개 컴포넌트 삭제)
- ✅ 타입 안전성 향상
- ✅ 문서화 개선
- ✅ 표준 패턴 준수

### 유지보수성
- ✅ 단일 책임 원칙 (SRP)
- ✅ 일관된 구조
- ✅ 재사용 가능한 컴포넌트
- ✅ 명확한 데이터 흐름

### 사용자 경험
- ✅ 통합된 필터링 UI
- ✅ 빠른 페이지네이션
- ✅ 정렬 기능
- ✅ Toast 알림

### 성능
- ✅ TanStack Table 최적화
- ✅ 메모이제이션
- ✅ 가상화 지원
- ✅ 불필요한 리렌더링 방지

## 다음 단계

### 권장 사항
1. **다른 feature 폴더에 동일한 패턴 적용**
   - `features/sys/*`
   - `features/org/*`
   - 기타 list 페이지

2. **공통 유틸리티 함수 추출**
   - `formatDate`, `formatDateTime` 등
   - `/lib/utils/date.ts`

3. **DataTable 커스터마이징**
   - 프로젝트별 기본 설정
   - 테마 통일

4. **E2E 테스트 추가**
   - 워크플로우 CRUD 플로우
   - 필터링/정렬/페이징

## 마이그레이션 가이드

기존 list 페이지를 개선하려면:

1. **테이블 컴포넌트 교체**
   ```typescript
   // Before
   <Table>
     <TableHeader>...</TableHeader>
     <TableBody>...</TableBody>
   </Table>
   <Pagination ... />
   
   // After
   <DataTable
     columns={createColumns(onEdit, onDelete)}
     data={data}
     searchKey="name"
     showPagination={true}
   />
   ```

2. **컬럼 정의 함수 생성**
   ```typescript
   export function createXxxColumns(
     onEdit: (item: Xxx) => void,
     onDelete: (item: Xxx) => void
   ): ColumnDef<Xxx>[] {
     return [/* ... */];
   }
   ```

3. **Store 간소화**
   - 필터/페이징 상태 제거
   - 모달, 정렬 상태만 유지

4. **별도 필터/페이징 컴포넌트 삭제**
   - DataTable이 통합 처리

## 참고 자료

- 프론트엔드 가이드: `/docs/05_frontend/07-FRONTEND-GUIDE.md`
- TanStack Table 문서: https://tanstack.com/table
- 참고 구현: `/apps/tenants-web/src/features/sys/users`

## 요약

Manager-Web의 auto feature를 최신 프론트엔드 가이드 기준에 맞춰 대대적으로 개선했습니다. 주요 개선 사항은:

1. ✅ TanStack Table 기반 DataTable 통합 사용
2. ✅ 컬럼 정의 함수 패턴 적용
3. ✅ Zustand Store 간소화 (모달, 정렬만)
4. ✅ 중복 컴포넌트 제거 (필터, 페이징)
5. ✅ 표준 페이지 패턴 적용
6. ✅ 문서화 개선 (JSDoc)

이 패턴을 다른 feature 폴더에도 적용하여 일관된 코드베이스를 유지하실 수 있습니다.
