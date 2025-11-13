# API Keys Feature

API 키 관리 기능 모듈

## 📋 개요

이 Feature는 manager-web 애플리케이션의 API 키 관리 기능을 제공합니다.

**데이터베이스 스키마**: `/packages/database/schemas/manager/02_idam/06_api_keys.sql`

## 🏗️ 구조

```
api_keys/
├── components/          # UI 컴포넌트 (7개 필수 컴포넌트)
│   ├── api-keys-columns.tsx     # ✅ 테이블 컬럼 정의
│   ├── api-keys-table.tsx       # ✅ 데이터 테이블
│   ├── api-keys-edit.tsx        # ✅ 수정 모달
│   ├── api-keys-form.tsx        # ✅ 생성/수정 폼
│   ├── api-keys-header.tsx      # ✅ 페이지 헤더
│   ├── api-keys-filters.tsx     # ✅ 검색/필터
│   ├── api-keys-stats.tsx       # ✅ 통계 카드
│   └── index.ts
├── hooks/              # TanStack Query hooks
│   ├── use-api-keys.ts
│   └── index.ts
├── services/           # API 통신
│   ├── api_keys.service.ts
│   └── index.ts
├── stores/             # Zustand 상태 관리
│   ├── api_keys.store.ts
│   └── index.ts
├── types/              # TypeScript 타입
│   ├── api_keys.types.ts
│   └── index.ts
├── index.ts            # Public API
└── README.md
```

## 📊 데이터베이스 스키마

### 주요 필드

- **기본 정보**
  - `id`: UUID, API 키 고유 식별자
  - `key_id`: 공개 키 ID (ak_xxxxxxxxxx)
  - `key_name`: 키 이름/설명
  - `key_hash`: 해시된 실제 키

- **소유자 정보**
  - `user_id`: 사용자 ID (필수)
  - `tenant_context`: 테넌트 컨텍스트
  - `service_account`: 서비스 계정명

- **권한 및 스코프**
  - `scopes`: API 키 권한 스코프 배열
  - `allowed_ips`: 허용 IP 주소 배열

- **사용 제한**
  - `rate_limit_per_minute`: 분당 요청 제한 (기본: 1000)
  - `rate_limit_per_hour`: 시간당 요청 제한 (기본: 10000)
  - `rate_limit_per_day`: 일당 요청 제한 (기본: 100000)

- **상태 및 만료**
  - `status`: ACTIVE | INACTIVE | REVOKED
  - `expires_at`: 만료일시

- **사용 통계**
  - `last_used_at`: 마지막 사용일시
  - `last_used_ip`: 마지막 사용 IP
  - `usage_count`: 사용 횟수

## 🎯 주요 기능

### 1. 목록 조회
- 페이지네이션 지원
- 검색 (키 이름, 키 ID)
- 필터링 (상태, 사용자, 테넌트)
- 정렬

### 2. 생성
- API 키 자동 생성
- 권한 스코프 설정
- IP 제한 설정
- Rate Limit 설정
- 만료일 설정

### 3. 수정
- 키 이름 변경
- 스코프 수정
- Rate Limit 조정
- 상태 변경

### 4. 삭제
- 키 영구 삭제
- 확인 다이얼로그

### 5. 상태 관리
- 활성화/비활성화 토글
- 취소 (Revoke)

## 💻 사용 예시

### 페이지에서 사용

```typescript
import {
  ApiKeysHeader,
  ApiKeysStats,
  ApiKeysFilters,
  ApiKeysTable,
  ApiKeysEdit,
  useApiKeys,
  useDeleteApiKey,
} from '@/features/idam/api_keys';

export default function ApiKeysPage() {
  const { data, isLoading } = useApiKeys({ page: 1, pageSize: 20 });
  const deleteMutation = useDeleteApiKey();

  return (
    <div className="space-y-6">
      <ApiKeysHeader />
      <ApiKeysStats {...stats} />
      <ApiKeysFilters />
      <ApiKeysTable data={data} onDelete={(key) => deleteMutation.mutate(key.id)} />
      <ApiKeysEdit />
    </div>
  );
}
```

### Hooks 사용

```typescript
// 목록 조회
const { data, isLoading } = useApiKeys({
  page: 1,
  pageSize: 20,
  search: '검색어',
  status: 'ACTIVE'
});

// 생성
const createMutation = useCreateApiKey();
createMutation.mutate({
  key_name: 'Production Key',
  user_id: 'uuid',
  scopes: ['read:data', 'write:data']
});

// 수정
const updateMutation = useUpdateApiKey();
updateMutation.mutate({
  id: 'uuid',
  data: { key_name: 'Updated Name' }
});

// 삭제
const deleteMutation = useDeleteApiKey();
deleteMutation.mutate('uuid');

// 상태 변경
const statusMutation = useUpdateApiKeyStatus();
statusMutation.mutate({ id: 'uuid', status: 'INACTIVE' });
```

## 🎨 컴포넌트 설명

### 1. api-keys-columns.tsx
테이블 컬럼 정의, 포맷 함수, 상수 정의

### 2. api-keys-table.tsx
DataTable 컴포넌트 설정, Zustand 스토어 연동

### 3. api-keys-header.tsx
페이지 제목, 설명, 액션 버튼 (추가, 새로고침)

### 4. api-keys-filters.tsx
검색 입력, 상태 필터, 초기화 버튼

### 5. api-keys-stats.tsx
통계 카드 (전체, 활성, 비활성, 취소됨, 총 사용 횟수)

### 6. api-keys-form.tsx
생성/수정 폼 (React Hook Form + Zod 검증)

### 7. api-keys-edit.tsx
Drawer 컨테이너 (생성/수정 비즈니스 로직)

## 🔧 API 엔드포인트

- `GET /api/v1/manager/idam/api_keys` - 목록 조회
- `GET /api/v1/manager/idam/api_keys/:id` - 상세 조회
- `POST /api/v1/manager/idam/api_keys` - 생성
- `PUT /api/v1/manager/idam/api_keys/:id` - 수정
- `DELETE /api/v1/manager/idam/api_keys/:id` - 삭제

## 📝 타입 정의

### ApiKey
```typescript
interface ApiKey {
  id: string;
  created_at: string;
  key_id: string;
  key_name: string;
  user_id: string;
  tenant_context?: string;
  service_account?: string;
  scopes?: string[];
  allowed_ips?: string[];
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  rate_limit_per_day: number;
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED';
  expires_at?: string;
  last_used_at?: string;
  last_used_ip?: string;
  usage_count: number;
}
```

## 🔒 보안 고려사항

1. **API 키 표시**: 생성 시 한 번만 표시, 이후 조회 불가
2. **해시 저장**: 실제 키는 해시된 형태로 저장 (`key_hash`)
3. **IP 제한**: `allowed_ips` 배열로 접근 제어
4. **Rate Limiting**: 분/시간/일 단위 요청 제한
5. **만료 처리**: `expires_at` 기반 자동 만료
6. **상태 관리**: ACTIVE/INACTIVE/REVOKED로 세밀한 제어

## 📚 관련 문서

- [Frontend Development Guide](/docs/05_frontend/FRONTEND-DEVELOPMENT-GUIDE.md)
- [Component Composition Guide](/docs/05_frontend/COMPONENT-COMPOSITION-GUIDE.md)
- [Database Schema](/packages/database/schemas/manager/02_idam/06_api_keys.sql)

## ✅ 체크리스트

- [x] 7개 필수 컴포넌트 작성
- [x] TypeScript 타입 정의
- [x] API 서비스 구현
- [x] TanStack Query hooks
- [x] Zustand 상태 관리
- [x] 페이지 통합
- [x] README 문서화

## 📅 버전 히스토리

- **v1.0** (2025-01-07): 초기 생성
  - 7개 필수 컴포넌트 구현
  - CRUD 기능 완성
  - 상태 관리 토글 기능
  - 통계 대시보드
