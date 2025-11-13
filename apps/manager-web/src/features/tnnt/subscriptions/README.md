# Subscriptions Feature

구독 관리 기능 모듈

## 📁 구조

```
subscriptions/
├── README.md
├── components/
│   ├── subscriptions-columns.tsx    # 테이블 컬럼 정의 (필수)
│   ├── subscriptions-table.tsx      # 데이터 테이블 (필수)
│   ├── subscriptions-form.tsx       # 생성/수정 폼 (필수)
│   ├── subscriptions-edit.tsx       # 수정 모달 (필수)
│   ├── subscriptions-header.tsx     # 페이지 헤더 (필수)
│   ├── subscriptions-filters.tsx    # 검색/필터 UI (필수)
│   ├── subscriptions-stats.tsx      # 통계 카드 (필수)
│   └── index.ts
├── hooks/
│   ├── use-subscriptions.ts         # TanStack Query hooks
│   └── index.ts
├── services/
│   ├── subscriptions.service.ts     # API 서비스
│   └── index.ts
├── stores/
│   ├── subscriptions.store.ts       # Zustand store
│   └── index.ts
├── types/
│   ├── subscriptions.types.ts       # 타입 정의
│   └── index.ts
└── index.ts

## 🎯 필수 컴포넌트 7개

### 1. subscriptions-columns.tsx - 테이블 컬럼 정의
- TanStack Table 컬럼 정의
- 포맷 함수 (날짜, 통화, 상태)
- 상수 (색상, 라벨 매핑)
- 액션 핸들러 타입

### 2. subscriptions-table.tsx - 데이터 테이블 렌더링
- columns 파일에서 컬럼 정의 import
- DataTable 컴포넌트 설정
- Zustand 스토어 연동
- 페이지네이션/필터 설정

### 3. subscriptions-form.tsx - 생성/수정 폼
- React Hook Form + Zod
- 폼 필드 정의
- Validation
- 제출 핸들러

### 4. subscriptions-edit.tsx - 수정 모달
- 수정 UI (모달)
- form 컴포넌트 통합
- mutation 호출
- 성공/실패 처리

### 5. subscriptions-header.tsx - 페이지 헤더
- 페이지 제목/설명
- 주요 액션 버튼
- ListPageHeader 컴포넌트 사용

### 6. subscriptions-filters.tsx - 검색/필터 UI
- 검색 입력
- 필터 옵션 (상태, 청구주기, 자동갱신)
- Filters 컴포넌트 사용
- 스토어 연동

### 7. subscriptions-stats.tsx - 통계 카드
- StatsCards 컴포넌트 사용
- 주요 지표 계산 (전체, 활성, 일시중단, 만료, 해지, 자동갱신, 수익)
- 통계 표시

## 📊 상태 관리

### 서버 상태 (TanStack Query)

- `useSubscriptions` - 목록 조회 (페이지네이션, 필터링)
- `useSubscription` - 상세 조회
- `useCreateSubscription` - 생성
- `useUpdateSubscription` - 수정
- `useDeleteSubscription` - 삭제

### Query Key Factory

```typescript
export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionsKeys.all, 'list'] as const,
  list: (params?: SubscriptionQueryParams) =>
    [...subscriptionsKeys.lists(), params] as const,
  detail: (id: string) =>
    [...subscriptionsKeys.all, 'detail', id] as const,
};
```

### UI 상태 (Zustand)

```typescript
interface SubscriptionsStore {
  // Form/Modal 상태
  formOpen: boolean;
  selectedId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedStatus: SubscriptionStatus | '';
  selectedBillingCycle: BillingCycle | '';
  selectedAutoRenewal: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션 상태
  currentPage: number;
  itemsPerPage: number;

  // 액션들...
}
```

## 🔌 API 엔드포인트

- `GET /api/v1/manager/tnnt/subscriptions` - 목록 조회
- `GET /api/v1/manager/tnnt/subscriptions/:id` - 상세 조회
- `POST /api/v1/manager/tnnt/subscriptions` - 생성
- `PUT /api/v1/manager/tnnt/subscriptions/:id` - 수정
- `DELETE /api/v1/manager/tnnt/subscriptions/:id` - 삭제

## 📝 데이터베이스 스키마

데이터베이스: `tnnt.subscriptions`

주요 필드:
- `id` - UUID, 구독 고유 식별자
- `tenant_id` - UUID, 구독 대상 테넌트 ID
- `plan_id` - UUID, 구독 계획 ID
- `start_date` - DATE, 구독 시작일
- `close_date` - DATE, 구독 종료일 (NULL: 무기한)
- `billing_cycle` - VARCHAR(20), 청구 주기 (MONTHLY/QUARTERLY/YEARLY)
- `max_users` - INTEGER, 최대 허용 사용자 수
- `max_storage` - INTEGER, 최대 스토리지 용량 (GB)
- `max_api_calls` - INTEGER, 월간 최대 API 호출 횟수
- `base_amount` - NUMERIC(18,4), 기본 요금
- `user_amount` - NUMERIC(18,4), 사용자당 추가 요금
- `currency` - CHAR(3), 통화 단위 (ISO 4217)
- `auto_renewal` - BOOLEAN, 자동 갱신 여부
- `noti_renewal` - BOOLEAN, 갱신 알림 발송 여부
- `status` - VARCHAR(20), 구독 상태 (ACTIVE/SUSPENDED/EXPIRED/CANCELED)
- `is_deleted` - BOOLEAN, 논리적 삭제 플래그

## 🚀 사용 예시

```typescript
import {
  SubscriptionsHeader,
  SubscriptionsStats,
  SubscriptionsFilters,
  SubscriptionsTable,
  SubscriptionsEdit,
  useSubscriptions,
  useDeleteSubscription,
  useSubscriptionsStore,
} from "@/features/tnnt/subscriptions";

export default function SubscriptionsPage() {
  const { data, refetch, isLoading } = useSubscriptions();
  const { openForm } = useSubscriptionsStore();

  const handleEdit = (subscription) => {
    openForm(subscription.id);
  };

  const handleDelete = (subscription) => {
    // deleteMutation.mutate(subscription.id)
  };

  return (
    <div className="space-y-6">
      <SubscriptionsHeader onRefresh={refetch} />
      <SubscriptionsStats data={data?.data || []} />
      <SubscriptionsFilters data={data?.data || []} />
      <SubscriptionsTable
        data={data?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SubscriptionsEdit />
    </div>
  );
}
```

## 📚 참고

- [프론트엔드 개발 가이드](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md)
- [컴포넌트 컴포지션 가이드](/docs/05_frontend/COMPONENT-COMPOSITION-GUIDE.md)
- [데이터베이스 스키마](/packages/database/schemas/manager/01_tnnt/02_subscriptions.sql)
