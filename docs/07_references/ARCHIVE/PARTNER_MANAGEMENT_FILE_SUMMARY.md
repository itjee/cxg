# 거래처관리 - 파일 요약 표

| 파일 경로 | 파일명 | 크기 | 목적 | 주요 내용 |
|---------|--------|------|------|---------|
| **페이지 (Pages)** |
| `src/app/(main)/crm/partners/` | `page.tsx` | 630줄 | 거래처 관리 메인 페이지 | 목록 조회, 필터링, 페이지네이션, CRUD UI |
| `src/app/(main)/crm/partner-addresses/` | `page.tsx` | 10줄 | 거래처 주소 관리 (스텁) | 구현 예정 |
| `src/app/(main)/crm/partner-contacts/` | `page.tsx` | 10줄 | 거래처 담당자 페이지 (스텁) | 구현 예정 |
| `src/app/(main)/crm/partner-managers/` | `page.tsx` | 10줄 | 당사 담당자 페이지 (스텁) | 구현 예정 |
| `src/app/(main)/crm/partner-banks/` | `page.tsx` | 10줄 | 은행 정보 페이지 (스텁) | 구현 예정 |
| **타입 정의 (Types)** |
| `src/features/crm/partners/types/` | `index.ts` | 299줄 | TypeScript 인터페이스 | Partner, PartnerContact, PartnerAddress, PartnerManager, Request/Response 타입 |
| **API 서비스 (Services)** |
| `src/features/crm/partners/services/` | `partnersService.ts` | 317줄 | API 통신 계층 | CRUD 메서드 (거래처, 담당자, 주소, 담당자 배정) |
| **커스텀 훅 (Hooks)** |
| `src/features/crm/partners/hooks/` | `usePartners.ts` | 95줄 | TanStack Query 훅 | usePartners, usePartner, useCreatePartner, useUpdatePartner, useDeletePartner |
| `src/features/crm/partners/hooks/` | `useData.ts` | 43줄 | 일반 데이터 훅 (템플릿) | 기본 CRUD 훅 템플릿 |
| **컴포넌트 (Components)** |
| `src/features/crm/partners/components/` | `partner-form.tsx` | 562줄 | 거래처 상세 폼 | 5단계 입력 폼 (기본정보, 사업자정보, 주소/연락처, 거래조건, 추가정보) |
| `src/features/crm/partners/components/` | `partner-detail-tabs.tsx` | 787줄 | 상세정보 탭 UI | 담당자, 주소, 당사 담당자 관리 탭 |
| `src/components/forms/` | `partner-form.tsx` | 100줄+ | Sheet 폼 | 빠른 추가/수정 폼 |
| **공개 API (Index)** |
| `src/features/crm/partners/` | `index.ts` | 41줄 | 모듈 내보내기 | hooks, services, components, types export |
| **기타** |
| `src/features/crm/partners/stores/` | (비어있음) | - | Zustand 스토어 | 향후 확장용 |

## 주요 통계

- **페이지 파일**: 5개 (1개 완성, 4개 스텁)
- **기능 파일**: 10개 (all 완성)
- **총 핵심 코드**: ~3,500줄
- **타입 정의**: 10+ 인터페이스
- **API 메서드**: 20+ 메서드
- **커스텀 훅**: 5개
- **컴포넌트**: 3개

## 파일별 의존성

```
page.tsx (partners)
├── PartnerForm (from components/forms)
├── StatsCards (from components/stats)
├── useReactTable (from @tanstack/react-table)
├── useState (from react)
└── Mock data

partner-form.tsx (feature component)
├── partnerService (from ./services)
├── Partner type (from ./types)
├── shadcn/ui components
└── React hooks

partner-detail-tabs.tsx (feature component)
├── partnerService (from ./services)
├── Partner types (from ./types)
├── shadcn/ui components
└── React hooks

usePartners.ts
├── useQuery, useMutation (from @tanstack/react-query)
├── partnerService (from ./services)
└── Partner types (from ./types)

partnersService.ts
├── axios
├── Partner types (from ./types)
└── Environment variables
```

## API 엔드포인트 매핑

| HTTP 메서드 | 경로 | 서비스 메서드 | 설명 |
|-----------|------|-------------|------|
| GET | `/api/v1/crm/partners` | `list(params?)` | 거래처 목록 조회 |
| GET | `/api/v1/crm/partners/:id` | `get(id)` | 거래처 상세 조회 |
| POST | `/api/v1/crm/partners` | `create(data)` | 거래처 생성 |
| PATCH | `/api/v1/crm/partners/:id` | `update(id, data)` | 거래처 수정 |
| DELETE | `/api/v1/crm/partners/:id` | `delete(id)` | 거래처 삭제 |
| GET | `/api/v1/crm/partners/:partnerId/contacts` | `listContacts(partnerId)` | 담당자 목록 |
| POST | `/api/v1/crm/partners/:partnerId/contacts` | `createContact(partnerId, data)` | 담당자 추가 |
| DELETE | `/api/v1/crm/partners/:partnerId/contacts/:contactId` | `deleteContact(partnerId, contactId)` | 담당자 삭제 |
| GET | `/api/v1/crm/partners/:partnerId/addresses` | `listAddresses(partnerId)` | 주소 목록 |
| POST | `/api/v1/crm/partners/:partnerId/addresses` | `createAddress(partnerId, data)` | 주소 추가 |
| DELETE | `/api/v1/crm/partners/:partnerId/addresses/:addressId` | `deleteAddress(partnerId, addressId)` | 주소 삭제 |
| GET | `/api/v1/crm/partners/:partnerId/managers` | `listManagers(partnerId)` | 담당자 배정 목록 |
| POST | `/api/v1/crm/partners/:partnerId/managers` | `createManager(partnerId, data)` | 담당자 배정 |
| DELETE | `/api/v1/crm/partners/:partnerId/managers/:managerId` | `deleteManager(partnerId, managerId)` | 담당자 배정 제거 |

## 타입 계층도

```
Partner (기본)
├── PartnerContact (담당자)
├── PartnerAddress (주소)
└── PartnerManager (당사 담당자)

요청 타입:
├── CreatePartnerRequest
├── UpdatePartnerRequest
├── CreatePartnerContactRequest
├── UpdatePartnerContactRequest
├── CreatePartnerAddressRequest
└── CreatePartnerManagerRequest

응답 타입:
├── PartnerListResponse
├── PartnerContactListResponse
├── PartnerAddressListResponse
├── PartnerManagerListResponse
└── EnvelopeResponse<T>

쿼리 파라미터:
└── PartnerQueryParams
```

## 사용한 라이브러리 (Frontend)

| 라이브러리 | 버전 | 용도 |
|----------|------|------|
| React | 18+ | UI 라이브러리 |
| Next.js | 14+ | Framework (App Router) |
| TypeScript | 5+ | 타입 안전성 |
| TanStack React Query | v5 | 서버 상태 관리 |
| TanStack React Table | 최신 | 데이터 테이블 |
| Shadcn/ui | 최신 | UI 컴포넌트 |
| Tailwind CSS | 3+ | 스타일링 |
| Axios | 최신 | HTTP 클라이언트 |
| Lucide React | 최신 | 아이콘 |

## 구현 체크리스트

- [x] 타입 정의 완료
- [x] API 서비스 완료
- [x] 커스텀 훅 완료
- [x] 거래처 폼 컴포넌트 완료
- [x] 상세정보 탭 컴포넌트 완료
- [x] 거래처 목록 페이지 완료 (mock 데이터)
- [ ] 거래처 상세 페이지
- [ ] 거래처 주소 페이지
- [ ] 거래처 담당자 페이지
- [ ] 당사 담당자 할당 페이지
- [ ] 은행 정보 페이지
- [ ] 실제 API 연결
- [ ] 에러 처리 강화
- [ ] 로딩 상태 UI
- [ ] 유효성 검증 강화
- [ ] 테스트 추가

## 다음 단계 (Next Steps)

### 1단기 (Immediate)
- [ ] mock 데이터를 실제 API로 교체
- [ ] 서브페이지들 (addresses, contacts, managers) 구현
- [ ] 에러 처리 및 로딩 상태 UI 개선

### 2중기 (Short-term)
- [ ] React Hook Form + Zod로 폼 개선
- [ ] Zustand 스토어 구현 (복잡한 상태)
- [ ] 기본 테스트 (unit, integration)

### 3장기 (Long-term)
- [ ] E2E 테스트 (Cypress/Playwright)
- [ ] 성능 최적화 (코드 분할, lazy loading)
- [ ] 접근성 개선 (a11y)
- [ ] 다국어 지원 (i18n)

## 참고 문서

- 거래처 관리 구현 가이드: `/PARTNER_MANAGEMENT_REFERENCE.md`
- 백엔드 API 문서: `/docs/implementation/01_backend_api/`
- 데이터베이스 스키마: `/packages/database/schemas/tenants/03_crm/`
