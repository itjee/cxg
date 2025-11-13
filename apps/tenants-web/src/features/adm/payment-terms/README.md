# 결제조건 관리 (Payment Terms)

거래처와의 결제 조건을 관리하는 기능입니다. 결제 기한과 조건을 설정할 수 있습니다.

## 구조

```
payment-terms/
├── types/
│   └── payment-term.types.ts    # 타입 정의
├── services/
│   └── payment-term.service.ts  # API 통신
├── stores/
│   └── payment-term.store.ts    # Zustand 상태 관리
├── hooks/
│   └── use-payment-term.ts      # TanStack Query 훅
├── components/
│   ├── payment-term-table.tsx   # 테이블 컴포넌트
│   ├── payment-term-filter.tsx  # 필터 컴포넌트
│   └── payment-term-form.tsx    # 폼 컴포넌트
└── README.md                     # 문서
```

## 특징

### 기한(일) 특수값 처리
결제 기한은 특수한 의미를 갖는 값으로 처리됩니다:

- **-1**: 선금 (납품 전 지급)
- **0**: 현금 (배송 시 지급)
- **양수**: n일 후 지급 (예: 30 = 30일 후)

```typescript
// types/payment-term.types.ts
export function formatPaymentDays(days: number): string {
  if (days === -1) return '선금';
  if (days === 0) return '현금';
  return `${days}일`;
}
```

### 코드 자동 대문자 변환
- 결제조건 코드 입력 시 자동으로 대문자로 변환됩니다
- `className="uppercase"` 스타일과 `toUpperCase()` 변환 적용

### 필터 기능
- **검색**: 코드, 이름, 설명으로 검색
- **상태**: 전체, 활성, 비활성

### 통계
- 전체 결제조건 수
- 활성 결제조건 수
- 비활성 결제조건 수
- 결제조건 수 (total과 동일)

### 테이블 컬럼
1. 결제조건 (2줄 표시: 코드 + 이름)
2. 기한(일) (특수값 처리)
3. 설명
4. 상태 (활성/비활성)
5. 생성일시
6. 수정일시
7. 작업 (수정/삭제)

## 사용법

### 1. 타입 정의

```typescript
import type { PaymentTerm } from './types/payment-term.types';
import { formatPaymentDays } from './types/payment-term.types';

const paymentTerm: PaymentTerm = {
  id: '1',
  code: 'NET30',
  name: '30일 후 지급',
  days: 30,
  description: '납품 후 30일 이내 지급',
  is_active: true,
  created_at: '2025-10-01T00:00:00Z',
  updated_at: '2025-10-01T00:00:00Z',
};

console.log(formatPaymentDays(30));  // "30일"
console.log(formatPaymentDays(0));   // "현금"
console.log(formatPaymentDays(-1));  // "선금"
```

### 2. 훅 사용

```typescript
import {
  usePaymentTermList,
  usePaymentTermStats,
  useCreatePaymentTerm,
  useUpdatePaymentTerm,
  useDeletePaymentTerm,
} from './hooks/use-payment-term';

function MyComponent() {
  // 목록 조회
  const { paymentTerms, isLoading } = usePaymentTermList();

  // 통계 조회
  const stats = usePaymentTermStats();

  // 생성
  const { createPaymentTerm } = useCreatePaymentTerm();

  // 수정
  const { updatePaymentTerm } = useUpdatePaymentTerm();

  // 삭제
  const { deletePaymentTerm } = useDeletePaymentTerm();

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
import { PaymentTermTable } from './components/payment-term-table';
import { PaymentTermFilter } from './components/payment-term-filter';
import { PaymentTermForm } from './components/payment-term-form';

function PaymentTermsPage() {
  const { paymentTerms, isLoading } = usePaymentTermList();
  const { deletePaymentTerm } = useDeletePaymentTerm();

  return (
    <div>
      <PaymentTermFilter />
      <PaymentTermTable
        paymentTerms={paymentTerms}
        isLoading={isLoading}
        onDelete={(term) => {
          if (confirm('삭제하시겠습니까?')) {
            deletePaymentTerm(term.id);
          }
        }}
      />
    </div>
  );
}
```

### 4. Zustand 스토어 사용

```typescript
import { usePaymentTermStore } from './stores/payment-term.store';

function MyComponent() {
  const {
    isSidebarOpen,
    selectedPaymentTerm,
    searchQuery,
    statusFilter,
    openSidebar,
    closeSidebar,
    setSearchQuery,
    setStatusFilter,
    resetFilters,
  } = usePaymentTermStore();

  return (
    <div>
      <button onClick={() => openSidebar(false)}>추가</button>
      <button onClick={() => openSidebar(true, paymentTerm)}>수정</button>
    </div>
  );
}
```

## 더미 데이터

5개의 결제조건 데이터가 포함되어 있습니다:

1. **NET30**: 30일 후 지급
2. **NET60**: 60일 후 지급
3. **COD**: 착불 (현금)
4. **ADVANCE**: 선금
5. **INSTALLMENT**: 할부 (90일)

## API 연동

현재는 더미 데이터를 사용하고 있으며, 실제 API 연동 시 `services/payment-term.service.ts`의 주석 처리된 코드를 활성화하면 됩니다.

```typescript
// 주석을 해제하고 더미 데이터 부분을 제거
const response = await api.get<EnvelopeResponse<PaymentTerm[]>>('/payment-terms');
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

### 새로운 특수값 추가

```typescript
// types/payment-term.types.ts
export function formatPaymentDays(days: number): string {
  if (days === -2) return '즉시';  // 새로운 특수값
  if (days === -1) return '선금';
  if (days === 0) return '현금';
  return `${days}일`;
}
```

### 폼 도움말 커스터마이징

```typescript
// components/payment-term-form.tsx
const getDaysHelperText = () => {
  if (formData.days === -2) return '즉시 지급';
  if (formData.days === -1) return '선금 (납품 전 지급)';
  if (formData.days === 0) return '현금 (배송 시 지급)';
  if (formData.days > 0) return `${formData.days}일 후 지급`;
  return '기한을 입력하세요';
};
```

### 새로운 필터 추가

```typescript
// stores/payment-term.store.ts
interface PaymentTermState {
  // ... 기존 필터
  paymentTypeFilter: 'all' | 'advance' | 'cash' | 'credit';
  setPaymentTypeFilter: (value: string) => void;
}

// hooks/use-payment-term.ts
export function usePaymentTermList() {
  const { searchQuery, statusFilter, paymentTypeFilter } = usePaymentTermStore();

  const { data } = useQuery({
    queryKey: ['payment-terms', searchQuery, statusFilter, paymentTypeFilter],
    // ...
  });
}
```

### 새로운 컬럼 추가

```typescript
// components/payment-term-table.tsx
const columns: ColumnDef<PaymentTerm>[] = [
  // ... 기존 컬럼
  {
    accessorKey: 'discount_rate',
    header: '할인율',
    cell: ({ row }) => (
      <span>{row.original.discount_rate}%</span>
    ),
    size: 100,
  },
];
```

## 비즈니스 로직 예제

### 결제 기한 계산

```typescript
function calculateDueDate(orderDate: Date, days: number): Date | string {
  if (days === -1) return '선금';
  if (days === 0) return '현금';

  const dueDate = new Date(orderDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

// 사용 예
const orderDate = new Date('2025-10-28');
const paymentTerm = { days: 30 };
const dueDate = calculateDueDate(orderDate, paymentTerm.days);
console.log(dueDate); // 2025-11-27
```

### 결제 조건별 분류

```typescript
function categorizePaymentTerms(terms: PaymentTerm[]) {
  return {
    advance: terms.filter(t => t.days === -1),
    cash: terms.filter(t => t.days === 0),
    credit: terms.filter(t => t.days > 0),
  };
}
```

## 라이선스

이 프로젝트는 프로젝트 루트의 라이선스를 따릅니다.
