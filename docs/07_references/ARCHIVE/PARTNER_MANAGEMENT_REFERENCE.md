# 거래처관리 (Partner Management) - 구현 참고 구조

## 목차
1. [전체 파일 구조](#전체-파일-구조)
2. [파일별 상세 설명](#파일별-상세-설명)
3. [디렉토리 구조](#디렉토리-구조)
4. [명명 규칙](#명명-규칙)
5. [데이터 흐름](#데이터-흐름)
6. [참고사항](#참고사항)

---

## 전체 파일 구조

### 페이지 파일 (Pages)
```
apps/tenants-web/src/app/(main)/crm/
├── partners/                           # 거래처 관리 메인 페이지
│   └── page.tsx                        # 거래처 목록 페이지 (630줄)
├── partner-addresses/
│   └── page.tsx                        # 거래처 주소 관리 페이지 (스텁)
├── partner-contacts/
│   └── page.tsx                        # 거래처 담당자 페이지 (스텁)
├── partner-managers/
│   └── page.tsx                        # 당사 담당자 할당 페이지 (스텁)
└── partner-banks/
    └── page.tsx                        # 거래처 은행 정보 페이지 (스텁)
```

### 기능 파일 (Features)
```
apps/tenants-web/src/features/crm/partners/
├── types/
│   └── index.ts                        # TypeScript 인터페이스 정의 (299줄)
├── services/
│   └── partnersService.ts              # API 서비스 레이어 (317줄)
├── hooks/
│   ├── usePartners.ts                  # TanStack Query 커스텀 훅 (95줄)
│   └── useData.ts                      # 일반 데이터 훅 (43줄, 템플릿)
├── components/
│   ├── partner-form.tsx                # 거래처 상세 폼 컴포넌트 (562줄)
│   └── partner-detail-tabs.tsx         # 거래처 상세정보 탭 (787줄)
├── stores/                             # Zustand 스토어 (비어있음)
└── index.ts                            # 공개 API 내보내기 (41줄)
```

### 공유 컴포넌트
```
apps/tenants-web/src/components/forms/
└── partner-form.tsx                    # Sheet 형식의 거래처 추가/수정 폼
```

---

## 파일별 상세 설명

### 1. 페이지 파일

#### `/app/(main)/crm/partners/page.tsx`
- **목적**: 거래처 관리의 메인 리스트 페이지
- **주요 기능**:
  - 거래처 목록 표시 (TanStack React Table)
  - 검색 및 필터링 (거래처 구분, 상태)
  - 페이지네이션 (커스텀 구현)
  - 통계 카드 (전체, 활성, 비활성, 공급사)
  - CRUD 작업 (추가, 편집, 삭제)
  - 새로고침, 내보내기 기능

- **주요 라이브러리**:
  - `@tanstack/react-table`: 데이터 테이블
  - `lucide-react`: 아이콘
  - `next/navigation`: 라우팅

- **상태 관리**:
  - Local state (useState)
  - Mock 데이터 사용 (향후 API 연결 필요)

- **구조**:
  ```typescript
  interface Partner {
    id: string;
    code: string;
    name: string;
    type: 'supplier' | 'customer' | 'both';
    bizNo: string;
    tel: string;
    email: string;
    status: 'active' | 'inactive';
  }
  ```

---

### 2. 타입 정의 (Types)

#### `/features/crm/partners/types/index.ts` (299줄)

**핵심 인터페이스들**:

```typescript
// 1. Partner (거래처 기본 정보)
interface Partner {
  id: string;
  code: string;                    // 거래처 코드
  name: string;                    // 거래처명 (한글)
  name_en?: string;                // 거래처명 (영문)
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';
  
  // 사업자 등록 정보
  tax_no?: string;                 // 법인등록번호
  biz_no?: string;                 // 사업자등록번호
  biz_type?: 'C' | 'S';            // C: 법인, S: 개인
  
  // 주소 및 연락처
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  is_deleted: boolean;
  
  // 감사 필드
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

// 2. PartnerContact (거래처 담당자)
interface PartnerContact {
  id: string;
  partner_id: string;
  contact_name: string;
  position?: string;
  contact_type?: 'SALES' | 'PURCHASING' | 'ACCOUNTING' | 'TECHNICAL' | 'MANAGEMENT' | 'OTHER';
  is_primary: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

// 3. PartnerAddress (거래처 주소)
interface PartnerAddress {
  id: string;
  partner_id: string;
  address_type: 'HEADQUARTER' | 'BRANCH' | 'WAREHOUSE' | 'FACTORY' | 'BILLING' | 'SHIPPING' | 'OTHER';
  address_name?: string;
  is_default: boolean;
  is_billing: boolean;
  is_shipping: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// 4. PartnerManager (당사 담당자)
interface PartnerManager {
  id: string;
  partner_id: string;
  employee_id: string;
  employee_name?: string;
  start_date: string;
  end_date?: string;
  manager_type: 'PRIMARY' | 'SECONDARY' | 'BACKUP' | 'TECHNICAL' | 'SALES' | 'SUPPORT';
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'TERMINATED';
}
```

**요청/응답 타입**:
- `CreatePartnerRequest`: 생성 요청
- `UpdatePartnerRequest`: 수정 요청
- `PartnerListResponse`: 목록 응답 (pagination)
- `EnvelopeResponse<T>`: 일반 응답 래퍼

**쿼리 파라미터**:
```typescript
type PartnerQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  active?: boolean;
};
```

---

### 3. API 서비스 (Services)

#### `/features/crm/partners/services/partnersService.ts` (317줄)

**구조**: 객체 기반 싱글톤 패턴

**API 엔드포인트 구성**:
```
Base URL: ${NEXT_PUBLIC_API_URL}/api/v1/crm/partners
```

**메서드 분류**:

**거래처 기본 정보**:
- `list(params?)`: 목록 조회 (페이지네이션)
- `get(id)`: 상세 조회
- `create(data)`: 생성
- `update(id, data)`: 수정 (PATCH)
- `delete(id)`: 삭제

**거래처 담당자**:
- `listContacts(partnerId)`: 목록 조회
- `getContact(partnerId, contactId)`: 상세 조회
- `createContact(partnerId, data)`: 생성
- `updateContact(partnerId, contactId, data)`: 수정
- `deleteContact(partnerId, contactId)`: 삭제

**거래처 주소**:
- `listAddresses(partnerId)`: 목록 조회
- `getAddress(partnerId, addressId)`: 상세 조회
- `createAddress(partnerId, data)`: 생성
- `updateAddress(partnerId, addressId, data)`: 수정
- `deleteAddress(partnerId, addressId)`: 삭제

**당사 담당자**:
- `listManagers(partnerId)`: 목록 조회
- `createManager(partnerId, data)`: 생성
- `deleteManager(partnerId, managerId)`: 삭제

**특징**:
- axios 기반
- 환경변수로 API URL 설정
- 에러 로깅 (console.error)
- 타입 안전성 보장

---

### 4. 커스텀 훅 (Hooks)

#### `/features/crm/partners/hooks/usePartners.ts` (95줄)

**라이브러리**: TanStack Query (React Query v5+)

**제공 훅**:

1. **usePartners(params?)**
   - 거래처 목록 조회
   - staleTime: 5분
   - gcTime: 10분 (가비지 컬렉션)
   - 쿼리 키: `['partners', params]`

2. **usePartner(id?)**
   - 단일 거래처 상세 조회
   - enabled: id가 존재할 때만 실행

3. **useCreatePartner()**
   - 거래처 생성 mutation
   - 성공 시 partners 쿼리 무효화

4. **useUpdatePartner(id)**
   - 거래처 수정 mutation
   - 성공 시 해당 항목과 리스트 무효화

5. **useDeletePartner(id)**
   - 거래처 삭제 mutation
   - 성공 시 리스트 무효화

**특징**:
- 캐싱 전략 구현
- 자동 재검증
- 에러 핸들링 포함

---

### 5. 컴포넌트 (Components)

#### A. `/features/crm/partners/components/partner-form.tsx` (562줄)

**목적**: 거래처 상세 정보 입력/수정 폼

**Props**:
```typescript
interface PartnerFormProps {
  partner?: Partner;      // 수정 모드: 기존 데이터
  onSuccess?: () => void; // 성공 콜백
  onCancel?: () => void;  // 취소 콜백
}
```

**기능**:
- Create/Edit 모드 자동 감지
- 폼 유효성 검증 (정규표현식 기반)
- 다단계 폼 (fieldset으로 구조화)

**폼 섹션**:
1. 기본 정보
   - 거래처 코드 (수정 시 비활성)
   - 거래처명 (한글/영문)
   - 거래처 유형 (필수)
   - 상태, 산업

2. 사업자 정보
   - 사업자 구분
   - 사업자등록번호, 법인명
   - 업태, 종목, 대표자명

3. 주소 및 연락처
   - 우편번호, 기본/상세 주소
   - 전화, 팩스, 이메일, 웹사이트

4. 거래 조건
   - 결제 조건 (선택지: 착불, NET 7-90, 선불)
   - 신용 한도
   - 거래 통화 (ISO 4217)

5. 추가 정보
   - 직원 수
   - 연 매출액
   - 설립일

**유효성 검증**:
```javascript
// 코드: 영문 대문자, 숫자, 언더스코어(_)만 2-50자
// 이메일: 표준 이메일 형식
// 전화/팩스: 8-20자의 숫자와 기호
// 사업자등록번호: 10자리 숫자
// 신용 한도: 0 이상
```

**특징**:
- 실시간 유효성 검증
- 동적 필드 에러 표시
- API 서비스와 직접 연동
- 로딩 상태 관리

---

#### B. `/features/crm/partners/components/partner-detail-tabs.tsx` (787줄)

**목적**: 거래처 상세 정보 관련 탭 인터페이스

**Props**:
```typescript
interface PartnerDetailTabsProps {
  partner: Partner;           // 거래처 데이터
  onUpdate?: () => void;      // 업데이트 콜백
}
```

**탭 구조**:

1. **거래처 담당자 탭**
   - 담당자 목록 표시
   - 담당자 추가 폼 (inline)
   - 담당자 삭제 기능
   
   **담당자 필드**:
   - 담당자명, 직책, 부서, 업무 유형
   - 전화, 휴대폰, 이메일

2. **거래처 주소 탭**
   - 주소 목록 표시
   - 주소 추가 폼 (inline)
   - 주소 삭제 기능
   
   **주소 필드**:
   - 주소 유형, 별칭
   - 기본/상세 주소, 도시, 주/도
   - 연락처 담당자, 전화

3. **당사 담당자 탭**
   - 당사 담당자 목록
   - 담당자 배정 폼 (inline)
   - 담당자 삭제 기능
   
   **담당자 배정 필드**:
   - 사원 ID, 담당자 유형
   - 담당 시작/종료일

**특징**:
- 각 탭 별 독립적 데이터 로딩
- 폼 재사용성 (inline forms)
- API 직접 호출
- 확인 다이얼로그 (삭제 시)

---

#### C. `/components/forms/partner-form.tsx` (Sheet 컴포넌트)

**목적**: Sheet 형식의 빠른 추가/수정 폼 (페이지에서 사용)

**Props**:
```typescript
interface PartnerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}
```

**특징**:
- 코드 자동 생성 (code-generator 유틸리티)
- Sheet UI (Shadcn/ui)
- 임시 구현 (완전하지 않음)

---

### 6. 인덱스 파일 (Index/Export)

#### `/features/crm/partners/index.ts` (41줄)

**공개 API**:
```typescript
// Hooks
export { usePartners, usePartner, useCreatePartner, useUpdatePartner, useDeletePartner }

// Services
export { partnerService }

// Components
export { PartnerForm, PartnerDetailTabs }

// Types
export type { Partner, CreatePartnerRequest, UpdatePartnerRequest, ... }
```

---

## 디렉토리 구조

```
앱 구조:
cxg/
├── apps/
│   ├── tenants-web/
│   │   └── src/
│   │       ├── app/
│   │       │   └── (main)/
│   │       │       └── crm/
│   │       │           ├── partners/
│   │       │           │   └── page.tsx               # 메인 페이지
│   │       │           ├── partner-addresses/
│   │       │           ├── partner-contacts/
│   │       │           ├── partner-managers/
│   │       │           └── partner-banks/
│   │       ├── features/
│   │       │   └── crm/
│   │       │       └── partners/
│   │       │           ├── types/
│   │       │           │   └── index.ts
│   │       │           ├── services/
│   │       │           │   └── partnersService.ts
│   │       │           ├── hooks/
│   │       │           │   ├── usePartners.ts
│   │       │           │   └── useData.ts
│   │       │           ├── components/
│   │       │           │   ├── partner-form.tsx
│   │       │           │   └── partner-detail-tabs.tsx
│   │       │           ├── stores/
│   │       │           └── index.ts
│   │       └── components/
│   │           └── forms/
│   │               └── partner-form.tsx
│   ├── backend-api/
│   │   └── src/
│   │       └── models/
│   │           └── tenants/
│   │               └── crm/
│   │                   ├── partners.py
│   │                   ├── partner_contacts.py
│   │                   ├── partner_addresses.py
│   │                   ├── partner_managers.py
│   │                   └── partner_banks.py
│   └── manager-web/
└── packages/
    └── database/
        └── schemas/
            └── tenants/
                └── 03_crm/
                    ├── 01_partners.sql
                    ├── 02_partner_contacts.sql
                    ├── 03_partner_addresses.sql
                    ├── 04_partner_managers.sql
                    └── 05_partner_banks.sql
```

---

## 명명 규칙

### 파일 및 폴더 명명
- **페이지 폴더**: kebab-case (`partner-addresses`, `partner-contacts`)
- **페이지 파일**: `page.tsx` (Next.js 규칙)
- **컴포넌트 파일**: kebab-case.tsx (`partner-form.tsx`)
- **서비스 파일**: camelCase.ts (`partnersService.ts`)
- **훅 파일**: use + PascalCase.ts (`usePartners.ts`)
- **타입 파일**: index.ts (폴더 내)

### 코드 명명

**변수/상수**:
- camelCase: `const partnerId = '...'`
- UPPER_SNAKE_CASE (상수): `const API_ENDPOINT = '...'`

**타입/인터페이스**:
- PascalCase: `interface Partner`, `type CreatePartnerRequest`

**함수/메서드**:
- camelCase: `listPartners()`, `createPartner()`
- use-로 시작 (커스텀 훅): `usePartners()`

**CSS 클래스**:
- Tailwind utilities 또는 shadcn/ui 사용
- BEM은 사용하지 않음

---

## 데이터 흐름

### 거래처 목록 조회 흐름

```
Page (partners/page.tsx)
  ↓
State: partners (useState)
  ↓
Columns & Table Setup (useReactTable)
  ↓
Filtering & Sorting
  ↓
Render Table
```

### 거래처 CRUD 흐름

```
User Action (Add/Edit/Delete)
  ↓
Sheet/Dialog Open
  ↓
PartnerForm Component
  ↓
Form Validation
  ↓
partnerService (Create/Update/Delete)
  ↓
API Call (axios)
  ↓
Update Local State / Invalidate Query
  ↓
UI Update
```

### 상세 정보 관리 흐름

```
PartnerDetailTabs Component
  ↓
3 Tabs (Contacts, Addresses, Managers)
  ↓
useEffect: Load Data
  ↓
partnerService (List/Get)
  ↓
Display in Cards
  ↓
Add/Delete Forms
  ↓
API Call (Create/Delete)
  ↓
Reload Tab Data
```

---

## 참고사항

### 현재 상태

1. **완성도**:
   - ✅ 거래처 목록 페이지: 완전 구현 (mock 데이터)
   - ✅ 거래처 폼: 완전 구현
   - ✅ 타입 정의: 완전 구현
   - ✅ API 서비스: 완전 구현
   - ✅ 커스텀 훅: 완전 구현
   - ⚠️ 상세 페이지: 부분 구현
   - 🔲 서브페이지 (주소, 담당자 등): 스텁만 존재

2. **이슈**:
   - 페이지에서 임시 목표 코드 생성 (useRouter 직접 호출)
   - mock 데이터 사용 (실제 API 연결 필요)
   - 서브페이지들이 아직 완성되지 않음

### 백엔드 모델

**Python SQLAlchemy 모델** (`apps/backend-api/src/models/tenants/crm/`):
- `partners.py`: Partner 모델
- `partner_contacts.py`: PartnerContact 모델
- `partner_addresses.py`: PartnerAddress 모델
- `partner_managers.py`: PartnerManager 모델
- `partner_banks.py`: PartnerBank 모델

**데이터베이스 스키마** (`packages/database/schemas/tenants/03_crm/`):
- `01_partners.sql`
- `02_partner_contacts.sql`
- `03_partner_addresses.sql`
- `04_partner_managers.sql`
- `05_partner_banks.sql`

### 공개 API 엔드포인트

```
Base: /api/v1/crm/partners

거래처:
  GET    /                  # 목록 조회
  GET    /:id               # 상세 조회
  POST   /                  # 생성
  PATCH  /:id               # 수정
  DELETE /:id               # 삭제

담당자:
  GET    /:partnerId/contacts
  GET    /:partnerId/contacts/:contactId
  POST   /:partnerId/contacts
  PATCH  /:partnerId/contacts/:contactId
  DELETE /:partnerId/contacts/:contactId

주소:
  GET    /:partnerId/addresses
  GET    /:partnerId/addresses/:addressId
  POST   /:partnerId/addresses
  PATCH  /:partnerId/addresses/:addressId
  DELETE /:partnerId/addresses/:addressId

담당자 배정:
  GET    /:partnerId/managers
  POST   /:partnerId/managers
  DELETE /:partnerId/managers/:managerId
```

### 사용 기술 스택

**Frontend**:
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- TanStack React Query v5
- TanStack React Table
- Shadcn/ui
- Tailwind CSS
- Axios (HTTP Client)
- Lucide React (Icons)

**Backend** (참고):
- Python 3.12+
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Alembic (마이그레이션)

### 확장성 고려사항

1. **새로운 페이지 추가 시**:
   - features/crm/{feature}/구조 따라하기
   - types, services, hooks, components 계층 분리
   - API 서비스 작성 후 훅 래핑
   - index.ts로 공개 API 정의

2. **상태 관리**:
   - 현재: Local state + TanStack Query
   - 고려: Zustand 스토어 (complex global state)

3. **폼 관리**:
   - 현재: React Hook Form 미사용
   - 고려: React Hook Form + Zod (복잡한 폼)

4. **API 통신**:
   - 환경변수로 API URL 설정
   - Interceptor 패턴 고려 (인증, 로깅)
   - 에러 경계 컴포넌트

---

## 요약

**파일 수**: 약 15개 핵심 파일
**총 줄 수**: ~3500줄 (주석 제외)
**주요 구조**: Features 폴더 기반 (Types → Services → Hooks → Components)
**상태 관리**: TanStack Query (서버 상태) + useState (로컬 상태)
**API 호출**: axios 기반 서비스 레이어
**UI 컴포넌트**: Shadcn/ui + Tailwind CSS
