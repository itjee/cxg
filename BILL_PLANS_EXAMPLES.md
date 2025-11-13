# Bill Plans 모듈 - 실제 사용 예제

## 1. 요금제 생성 예제

### ① 최소한의 필드로 생성
```bash
curl -X POST http://localhost:8100/api/v1/manager/bill/plans \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PLAN_TRIAL",
    "name": "무료 체험판",
    "type": "TRIAL",
    "base_price": 0,
    "start_time": "2024-01-01"
  }'
```

**응답 (성공):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "PLAN_TRIAL",
    "name": "무료 체험판",
    "type": "TRIAL",
    "description": null,
    "base_price": 0,
    "user_price": 0,
    "currency": "KRW",
    "billing_cycle": "MONTHLY",
    "max_users": 50,
    "max_storage": 100,
    "max_api_calls": 10000,
    "features": null,
    "start_time": "2024-01-01",
    "close_time": null,
    "status": "ACTIVE",
    "deleted": false,
    "created_at": "2024-11-08T10:30:00+00:00",
    "updated_at": null,
    "created_by": "123e4567-e89b-12d3-a456-426614174000",
    "updated_by": null
  },
  "error": null
}
```

### ② 완전한 필드로 생성
```bash
curl -X POST http://localhost:8100/api/v1/manager/bill/plans \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PLAN_PREMIUM",
    "name": "프리미엄 플랜",
    "type": "PREMIUM",
    "description": "엔터프라이즈급 기능을 모두 포함한 프리미엄 플랜",
    "base_price": 199000,
    "user_price": 10000,
    "currency": "KRW",
    "billing_cycle": "YEARLY",
    "max_users": 1000,
    "max_storage": 5000,
    "max_api_calls": 1000000,
    "features": {
      "analytics": true,
      "advanced_reporting": true,
      "api_access": true,
      "webhook_support": true,
      "custom_domain": true,
      "sso": true,
      "audit_logs": true,
      "support_level": "premium"
    },
    "start_time": "2024-01-01",
    "close_time": "2026-12-31",
    "status": "ACTIVE"
  }'
```

---

## 2. 목록 조회 예제

### ① 기본 목록 조회
```bash
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&page_size=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**응답:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "code": "PLAN_TRIAL",
        "name": "무료 체험판",
        "type": "TRIAL",
        "base_price": 0,
        ...
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "code": "PLAN_PREMIUM",
        "name": "프리미엄 플랜",
        "type": "PREMIUM",
        "base_price": 199000,
        ...
      }
    ],
    "total": 2,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  },
  "error": null
}
```

### ② 상태별 필터링
```bash
# 활성 상태의 요금제만 조회
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&status=ACTIVE" \
  -H "Authorization: Bearer ..."

# 프리미엄 유형만 조회
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&type=PREMIUM" \
  -H "Authorization: Bearer ..."

# 연간 청구만 조회
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&billing_cycle=YEARLY" \
  -H "Authorization: Bearer ..."
```

### ③ 검색
```bash
# 코드나 이름으로 검색
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&search=PREMIUM" \
  -H "Authorization: Bearer ..."

# 결합된 필터링 + 검색
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&search=프리&status=ACTIVE&type=PREMIUM" \
  -H "Authorization: Bearer ..."
```

### ④ 정렬
```bash
# 가격순 오름차순 정렬
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&sort_by=base_price&sort_order=asc" \
  -H "Authorization: Bearer ..."

# 이름순 내림차순 정렬
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&sort_by=name&sort_order=desc" \
  -H "Authorization: Bearer ..."

# 생성일순 정렬 (기본값)
curl "http://localhost:8100/api/v1/manager/bill/plans?page=1&sort_by=created_at&sort_order=desc" \
  -H "Authorization: Bearer ..."
```

### ⑤ 복합 쿼리
```bash
# 모든 조건 적용
curl "http://localhost:8100/api/v1/manager/bill/plans?\
page=1&\
page_size=10&\
search=프리&\
status=ACTIVE&\
type=PREMIUM&\
billing_cycle=YEARLY&\
sort_by=base_price&\
sort_order=asc" \
  -H "Authorization: Bearer ..."
```

---

## 3. 상세 조회 예제

```bash
curl "http://localhost:8100/api/v1/manager/bill/plans/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "PLAN_TRIAL",
    "name": "무료 체험판",
    "type": "TRIAL",
    "description": "14일간 무료로 모든 기능을 사용할 수 있습니다",
    "base_price": 0,
    "user_price": 0,
    "currency": "KRW",
    "billing_cycle": "MONTHLY",
    "max_users": 5,
    "max_storage": 10,
    "max_api_calls": 1000,
    "features": {
      "basic_analytics": true,
      "api_access": false,
      "webhook_support": false,
      "sso": false,
      "audit_logs": false
    },
    "start_time": "2024-01-01",
    "close_time": null,
    "status": "ACTIVE",
    "deleted": false,
    "created_at": "2024-01-01T00:00:00+00:00",
    "updated_at": null,
    "created_by": "123e4567-e89b-12d3-a456-426614174000",
    "updated_by": null
  },
  "error": null
}
```

---

## 4. 수정 예제

### ① 부분 수정 (필드 일부만)
```bash
curl -X PUT "http://localhost:8100/api/v1/manager/bill/plans/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INACTIVE"
  }'
```

### ② 전체 수정
```bash
curl -X PUT "http://localhost:8100/api/v1/manager/bill/plans/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PLAN_TRIAL_V2",
    "name": "무료 체험판 (개선됨)",
    "description": "30일간 무료로 모든 기능을 사용할 수 있습니다",
    "base_price": 0,
    "user_price": 0,
    "currency": "KRW",
    "billing_cycle": "MONTHLY",
    "max_users": 10,
    "max_storage": 50,
    "max_api_calls": 5000,
    "features": {
      "basic_analytics": true,
      "advanced_reporting": true,
      "api_access": true,
      "webhook_support": false,
      "sso": false,
      "audit_logs": false
    },
    "start_time": "2024-01-01",
    "close_time": "2024-12-31",
    "status": "ACTIVE"
  }'
```

---

## 5. 삭제 예제

```bash
curl -X DELETE "http://localhost:8100/api/v1/manager/bill/plans/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**응답:**
```json
{
  "success": true,
  "data": {
    "message": "요금제가 삭제되었습니다"
  },
  "error": null
}
```

---

## 6. 에러 예제

### ① 중복 코드로 생성 시도
```bash
curl -X POST http://localhost:8100/api/v1/manager/bill/plans \
  -H "Authorization: Bearer ..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PLAN_TRIAL",  # 이미 존재하는 코드
    "name": "다른 체험판",
    "type": "TRIAL",
    "base_price": 0,
    "start_time": "2024-01-01"
  }'
```

**응답 (실패):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "코드 'PLAN_TRIAL'는 이미 존재합니다",
    "detail": null
  }
}
```

### ② 유효하지 않은 type 값
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "String should match pattern '^(TRIAL|STANDARD|PREMIUM|ENTERPRISE)$' [type=string_pattern, input_value='INVALID', input_type=str]",
    "detail": null
  }
}
```

### ③ 종료일 < 시작일
```bash
curl -X POST http://localhost:8100/api/v1/manager/bill/plans \
  -H "Authorization: Bearer ..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PLAN_TEST",
    "name": "테스트",
    "type": "STANDARD",
    "base_price": 10000,
    "start_time": "2024-12-31",
    "close_time": "2024-01-01"  # 시작일보다 전
  }'
```

**응답:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "종료일은 시작일보다 늦어야 합니다",
    "detail": null
  }
}
```

### ④ 존재하지 않는 ID로 조회
```bash
curl "http://localhost:8100/api/v1/manager/bill/plans/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer ..."
```

**응답:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "요금제를 찾을 수 없습니다",
    "detail": null
  }
}
```

---

## 7. 프론트엔드 통합 예제

### TypeScript
```typescript
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from '@/features/bill/plans';
import { usePlansStore } from '@/features/bill/plans/stores';
import type { CreatePlanRequest, UpdatePlanRequest } from '@/features/bill/plans/types';

export function PlansPage() {
  // 스토어에서 필터 및 페이지 상태 가져오기
  const { filters, pageState } = usePlansStore();

  // API 호출
  const { data: listData, isLoading } = usePlans({
    page: pageState.currentPage + 1,  // 0-based to 1-based
    pageSize: pageState.pageSize,
    search: filters.search,
    status: filters.status,
    type: filters.type,
    billing_cycle: filters.billing_cycle,
  });

  // 생성
  const { mutate: createPlan } = useCreatePlan({
    onSuccess: () => toast.success('요금제가 생성되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const handleCreate = (data: CreatePlanRequest) => {
    createPlan(data);
  };

  // 수정
  const { mutate: updatePlan } = useUpdatePlan({
    onSuccess: () => toast.success('요금제가 수정되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const handleUpdate = (id: string, data: UpdatePlanRequest) => {
    updatePlan({ id, data });
  };

  // 삭제
  const { mutate: deletePlan } = useDeletePlan({
    onSuccess: () => toast.success('요금제가 삭제되었습니다'),
    onError: (error) => toast.error(error.message),
  });

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deletePlan(id);
    }
  };

  return (
    <div>
      <PlansHeader onAddClick={handleCreate} />
      <PlansFilters />
      <PlansTable
        data={listData?.items || []}
        isLoading={isLoading}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

---

## 8. 검증 규칙 요약

### 필수 필드
- `code` (3-50자, 고유)
- `name` (1-100자)
- `base_price` (≥ 0, ≤ 999,999,999,999,999.9999)
- `start_time` (YYYY-MM-DD 형식)

### 선택 필드 (기본값 있음)
- `type`: STANDARD (TRIAL|STANDARD|PREMIUM|ENTERPRISE)
- `billing_cycle`: MONTHLY (MONTHLY|QUARTERLY|YEARLY)
- `currency`: KRW
- `user_price`: 0
- `status`: ACTIVE (ACTIVE|INACTIVE|ARCHIVED)
- `max_users`: 50
- `max_storage`: 100
- `max_api_calls`: 10000

### 검증 규칙
- `close_time` >= `start_time` (또는 NULL)
- `max_users`, `max_storage`, `max_api_calls` > 0 (또는 NULL)
- `user_price` >= 0

---

## 9. 동작 확인 체크리스트

- [ ] 요금제 생성 가능
- [ ] 목록 조회 (페이지네이션)
- [ ] 필터링 (상태, 유형, 청구주기)
- [ ] 검색
- [ ] 정렬 (6개 필드)
- [ ] 상세 조회
- [ ] 수정 (부분/전체)
- [ ] 삭제 (소프트 삭제)
- [ ] 중복 코드 방지
- [ ] 에러 처리 (유효성 검사)
- [ ] 감사 추적 (created_by, updated_by)

---

마지막 업데이트: 2024년 11월 8일
