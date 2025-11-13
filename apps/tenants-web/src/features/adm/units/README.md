# 단위 관리 (Units)

제품 및 서비스에 사용되는 단위를 관리하는 기능입니다.

## 구조

```
units/
├── types/
│   └── unit.types.ts       # 타입 정의
├── services/
│   └── unit.service.ts     # API 통신
├── stores/
│   └── unit.store.ts       # Zustand 상태 관리
├── hooks/
│   └── use-unit.ts         # TanStack Query 훅
├── components/
│   ├── unit-table.tsx      # 테이블 컴포넌트
│   ├── unit-filter.tsx     # 필터 컴포넌트
│   └── unit-form.tsx       # 폼 컴포넌트
└── README.md               # 문서
```

## 특징

### 코드 자동 대문자 변환
- 단위 코드 입력 시 자동으로 대문자로 변환됩니다
- `className="uppercase"` 스타일과 `toUpperCase()` 변환 적용

### 필터 기능
- **검색**: 코드, 이름, 설명으로 검색
- **상태**: 전체, 활성, 비활성

### 통계
- 전체 단위 수
- 활성 단위 수
- 비활성 단위 수
- 단위 수 (total과 동일)

### 테이블 컬럼
1. 단위코드 (2줄 표시: 코드 + 이름)
2. 설명
3. 상태 (활성/비활성)
4. 생성일시
5. 수정일시
6. 작업 (수정/삭제)

## 사용법

### 1. 타입 정의

```typescript
import type { Unit } from './types/unit.types';

const unit: Unit = {
  id: '1',
  code: 'EA',
  name: '개',
  description: '낱개 단위',
  is_active: true,
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
};
```

### 2. 훅 사용

```typescript
import {
  useUnitList,
  useUnitStats,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
} from './hooks/use-unit';

function MyComponent() {
  // 목록 조회
  const { units, isLoading } = useUnitList();

  // 통계 조회
  const stats = useUnitStats();

  // 생성
  const { createUnit } = useCreateUnit();

  // 수정
  const { updateUnit } = useUpdateUnit();

  // 삭제
  const { deleteUnit } = useDeleteUnit();

  return (
    <div>
      <p>전체: {stats.total}</p>
      <p>활성: {stats.active}</p>
    </div>
  );
}
```

### 3. 컴포넌트 사용

```typescript
import { UnitTable } from './components/unit-table';
import { UnitFilter } from './components/unit-filter';
import { UnitForm } from './components/unit-form';

function UnitsPage() {
  const { units, isLoading } = useUnitList();
  const { deleteUnit } = useDeleteUnit();

  return (
    <div>
      <UnitFilter />
      <UnitTable
        units={units}
        isLoading={isLoading}
        onDelete={(unit) => {
          if (confirm('삭제하시겠습니까?')) {
            deleteUnit(unit.id);
          }
        }}
      />
    </div>
  );
}
```

### 4. Zustand 스토어 사용

```typescript
import { useUnitStore } from './stores/unit.store';

function MyComponent() {
  const {
    isSidebarOpen,
    selectedUnit,
    searchQuery,
    statusFilter,
    openSidebar,
    closeSidebar,
    setSearchQuery,
    setStatusFilter,
    resetFilters,
  } = useUnitStore();

  return (
    <div>
      <button onClick={() => openSidebar(false)}>추가</button>
      <button onClick={() => openSidebar(true, unit)}>수정</button>
    </div>
  );
}
```

## 더미 데이터

5개의 단위 데이터가 포함되어 있습니다:

1. **EA (개)**: 낱개 단위
2. **BOX (박스)**: 박스 단위
3. **KG (킬로그램)**: 무게 단위
4. **M (미터)**: 길이 단위
5. **SET (세트)**: 세트 단위

## API 연동

현재는 더미 데이터를 사용하고 있으며, 실제 API 연동 시 `services/unit.service.ts`의 주석 처리된 코드를 활성화하면 됩니다.

```typescript
// 주석을 해제하고 더미 데이터 부분을 제거
const response = await api.get<EnvelopeResponse<Unit[]>>('/units');
```

## 아키텍처 패턴

### 관심사 분리
- **Page**: 페이지 레벨 로직
- **Component**: UI 렌더링
- **Hook**: 데이터 페칭 및 상태 관리
- **Service**: API 통신
- **Store**: UI 상태 관리

### Early Return 패턴
```typescript
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage />;
}

return <DataDisplay />;
```

## 기술 스택

- **TypeScript**: 타입 안정성
- **React 19**: UI 프레임워크
- **TanStack React Query v5**: 서버 상태 관리
- **Zustand v5**: 클라이언트 상태 관리
- **Tailwind CSS v4**: 스타일링
- **Lucide React**: 아이콘

## 개발 가이드

### 새로운 필터 추가

```typescript
// stores/unit.store.ts
interface UnitState {
  // ... 기존 필터
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

// hooks/use-unit.ts
export function useUnitList() {
  const { searchQuery, statusFilter, categoryFilter } = useUnitStore();

  const { data } = useQuery({
    queryKey: ['units', searchQuery, statusFilter, categoryFilter],
    // ...
  });
}
```

### 새로운 컬럼 추가

```typescript
// components/unit-table.tsx
const columns: ColumnDef<Unit>[] = [
  // ... 기존 컬럼
  {
    accessorKey: 'category',
    header: '카테고리',
    cell: ({ row }) => <span>{row.original.category}</span>,
    size: 100,
  },
];
```

### 코드 자동 변환 커스터마이징

```typescript
// components/unit-form.tsx
const handleChange = (field: string, value: any) => {
  if (field === 'code') {
    // 대문자 변환 + 공백 제거
    setFormData((prev) => ({
      ...prev,
      [field]: value.toUpperCase().replace(/\s/g, '')
    }));
  } else {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }
};
```

## 라이선스

이 프로젝트는 프로젝트 루트의 라이선스를 따릅니다.
