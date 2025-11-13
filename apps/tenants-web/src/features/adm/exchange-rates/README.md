# 환율 관리 (Exchange Rates)

환율 정보를 관리하는 기능입니다. 통화 간 환율을 등록하고 조회할 수 있습니다.

## 구조

```
exchange-rates/
├── types/
│   └── exchange-rate.types.ts    # 타입 정의
├── services/
│   └── exchange-rate.service.ts  # API 통신
├── stores/
│   └── exchange-rate.store.ts    # Zustand 상태 관리
├── hooks/
│   └── use-exchange-rate.ts      # TanStack Query 훅
├── components/
│   ├── exchange-rate-table.tsx   # 테이블 컴포넌트
│   ├── exchange-rate-filter.tsx  # 필터 컴포넌트
│   └── exchange-rate-form.tsx    # 폼 컴포넌트
└── README.md                      # 문서
```

## 특징

### 환율 소수점 처리
- 환율은 소수점 4자리로 표시됩니다 (`toFixed(4)`)
- 입력 시에도 `step="0.0001"`로 정밀한 입력이 가능합니다

### 필터 기능
- **검색**: 통화 코드, 설명으로 검색
- **상태**: 전체, 활성, 비활성

### 통계
- 전체 환율 수
- 활성 환율 수
- 비활성 환율 수
- 통화쌍 수

### 테이블 컬럼
1. 기준통화 (예: USD)
2. 대상통화 (예: KRW)
3. 환율 (정렬 가능, 4자리 소수점)
4. 적용일
5. 상태 (활성/비활성)
6. 생성일시
7. 수정일시
8. 작업 (수정/삭제)

## 사용법

### 1. 타입 정의

```typescript
import type { ExchangeRate } from './types/exchange-rate.types';

const exchangeRate: ExchangeRate = {
  id: '1',
  from_currency: 'USD',
  to_currency: 'KRW',
  rate: 1320.5000,
  effective_date: '2025-10-28',
  description: '미국 달러 → 한국 원',
  is_active: true,
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-28T00:00:00Z',
};
```

### 2. 훅 사용

```typescript
import {
  useExchangeRateList,
  useExchangeRateStats,
  useCreateExchangeRate,
  useUpdateExchangeRate,
  useDeleteExchangeRate,
} from './hooks/use-exchange-rate';

function MyComponent() {
  // 목록 조회
  const { exchangeRates, isLoading } = useExchangeRateList();

  // 통계 조회
  const stats = useExchangeRateStats();

  // 생성
  const { createExchangeRate } = useCreateExchangeRate();

  // 수정
  const { updateExchangeRate } = useUpdateExchangeRate();

  // 삭제
  const { deleteExchangeRate } = useDeleteExchangeRate();

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
import { ExchangeRateTable } from './components/exchange-rate-table';
import { ExchangeRateFilter } from './components/exchange-rate-filter';
import { ExchangeRateForm } from './components/exchange-rate-form';

function ExchangeRatesPage() {
  const { exchangeRates, isLoading } = useExchangeRateList();
  const { deleteExchangeRate } = useDeleteExchangeRate();

  return (
    <div>
      <ExchangeRateFilter />
      <ExchangeRateTable
        exchangeRates={exchangeRates}
        isLoading={isLoading}
        onDelete={(er) => {
          if (confirm('삭제하시겠습니까?')) {
            deleteExchangeRate(er.id);
          }
        }}
      />
    </div>
  );
}
```

### 4. Zustand 스토어 사용

```typescript
import { useExchangeRateStore } from './stores/exchange-rate.store';

function MyComponent() {
  const {
    isSidebarOpen,
    selectedExchangeRate,
    searchQuery,
    statusFilter,
    openSidebar,
    closeSidebar,
    setSearchQuery,
    setStatusFilter,
    resetFilters,
  } = useExchangeRateStore();

  return (
    <div>
      <button onClick={() => openSidebar(false)}>추가</button>
      <button onClick={() => openSidebar(true, exchangeRate)}>수정</button>
    </div>
  );
}
```

## 더미 데이터

5개의 환율 데이터가 포함되어 있습니다:

1. **USD → KRW**: 1320.5000
2. **EUR → KRW**: 1435.2500
3. **JPY → KRW**: 8.8500
4. **GBP → USD**: 1.2650
5. **CNY → KRW**: 182.3500

## API 연동

현재는 더미 데이터를 사용하고 있으며, 실제 API 연동 시 `services/exchange-rate.service.ts`의 주석 처리된 코드를 활성화하면 됩니다.

```typescript
// 주석을 해제하고 더미 데이터 부분을 제거
const response = await api.get<EnvelopeResponse<ExchangeRate[]>>('/exchange-rates');
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
// stores/exchange-rate.store.ts
interface ExchangeRateState {
  // ... 기존 필터
  newFilter: string;
  setNewFilter: (value: string) => void;
}

// hooks/use-exchange-rate.ts
export function useExchangeRateList() {
  const { searchQuery, statusFilter, newFilter } = useExchangeRateStore();

  const { data } = useQuery({
    queryKey: ['exchange-rates', searchQuery, statusFilter, newFilter],
    // ...
  });
}
```

### 새로운 컬럼 추가

```typescript
// components/exchange-rate-table.tsx
const columns: ColumnDef<ExchangeRate>[] = [
  // ... 기존 컬럼
  {
    accessorKey: 'newField',
    header: '새 필드',
    cell: ({ row }) => <span>{row.original.newField}</span>,
    size: 100,
  },
];
```

## 라이선스

이 프로젝트는 프로젝트 루트의 라이선스를 따릅니다.
