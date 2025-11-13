# 거래처관리 (Partner Management) - 빠른 참조 가이드

## 파일 위치 한눈에 보기

### 페이지 (가장 많이 수정)
```
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/
├── partners/page.tsx                    # 거래처 목록 - 메인 페이지
├── partner-addresses/page.tsx           # 거래처 주소 관리 (스텁)
├── partner-contacts/page.tsx            # 거래처 담당자 (스텁)
├── partner-managers/page.tsx            # 당사 담당자 (스텁)
└── partner-banks/page.tsx               # 은행 정보 (스텁)
```

### 기능 레이어 (재사용 가능)
```
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/
├── types/index.ts                       # 타입 정의 ⭐ 자주 수정
├── services/partnersService.ts          # API 서비스 ⭐ 자주 수정
├── hooks/usePartners.ts                 # TanStack Query 훅
├── components/partner-form.tsx          # 거래처 입력 폼 ⭐ 자주 수정
├── components/partner-detail-tabs.tsx   # 상세정보 탭 ⭐ 자주 수정
└── index.ts                             # 공개 API
```

### 공유 컴포넌트
```
/home/itjee/workspace/cxg/apps/tenants-web/src/components/forms/
└── partner-form.tsx                     # Sheet 폼 (페이지에서 사용)
```

---

## 가장 많이 수정하는 파일 Top 5

### 1️⃣ `/features/crm/partners/types/index.ts` (299줄)
**왜**: 데이터 구조가 변할 때마다 여기를 먼저 수정
- Partner, PartnerContact, PartnerAddress, PartnerManager 인터페이스 정의
- CreatePartnerRequest, UpdatePartnerRequest 등 요청 타입

**수정할 때**:
```typescript
// 새로운 필드 추가 예시
interface Partner {
  id: string;
  // ... 기존 필드들 ...
  new_field?: string;  // 추가됨
}

// 요청 타입도 함께 수정
interface CreatePartnerRequest {
  // ... 기존 필드들 ...
  new_field?: string;  // 추가됨
}
```

---

### 2️⃣ `/features/crm/partners/services/partnersService.ts` (317줄)
**왜**: 백엔드 API가 변할 때 여기를 수정
- API 엔드포인트 구성
- CRUD 메서드 구현

**구조**:
```typescript
export const partnerService = {
  // 거래처 기본 정보
  async list(params?: PartnerQueryParams): Promise<PartnerListResponse>,
  async get(id: string): Promise<Partner>,
  async create(data: CreatePartnerRequest): Promise<Partner>,
  async update(id: string, data: UpdatePartnerRequest): Promise<Partner>,
  async delete(id: string): Promise<void>,
  
  // 거래처 담당자
  async listContacts(partnerId: string): Promise<PartnerContactListResponse>,
  async createContact(partnerId: string, data: CreatePartnerContactRequest): Promise<PartnerContact>,
  // ...
}
```

**API URL 설정**:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/crm/partners`;
```

---

### 3️⃣ `/features/crm/partners/components/partner-form.tsx` (562줄)
**왜**: 거래처 입력 필드가 변할 때 수정
- 5단계 폼 구조 (기본정보, 사업자정보, 주소/연락처, 거래조건, 추가정보)
- 각 필드별 유효성 검증

**폼 섹션 추가 방법**:
```typescript
<fieldset className="space-y-4">
  <legend className="text-lg font-semibold">새로운 섹션</legend>
  {/* 새로운 필드들 */}
</fieldset>
```

**필드 추가 방법**:
```typescript
<div className="space-y-2">
  <Label htmlFor="field_name">필드명 *</Label>
  <Input
    id="field_name"
    name="field_name"
    value={formData.field_name}
    onChange={handleChange}
    placeholder="플레이스홀더"
  />
  {validationErrors.field_name && (
    <p className="text-sm text-red-600">{validationErrors.field_name}</p>
  )}
</div>
```

---

### 4️⃣ `/features/crm/partners/components/partner-detail-tabs.tsx` (787줄)
**왜**: 상세 정보 탭 구조가 변할 때 수정
- 거래처 담당자, 주소, 당사 담당자 3개 탭
- 각 탭의 CRUD 기능

**탭 구조**:
```typescript
<Tabs defaultValue="contacts" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="contacts">거래처 담당자</TabsTrigger>
    <TabsTrigger value="addresses">거래처 주소</TabsTrigger>
    <TabsTrigger value="managers">당사 담당자</TabsTrigger>
  </TabsList>

  <TabsContent value="contacts">
    {/* 담당자 탭 내용 */}
  </TabsContent>
  {/* ... */}
</Tabs>
```

---

### 5️⃣ `/app/(main)/crm/partners/page.tsx` (630줄)
**왜**: UI/UX 레이아웃이나 기능이 변할 때 수정
- 테이블 컬럼 정의
- 필터 UI
- 페이지네이션

**테이블 컬럼 추가 방법**:
```typescript
const columns: ColumnDef<Partner>[] = [
  // 기존 컬럼들...
  {
    accessorKey: 'new_field',
    header: '새필드',
    cell: ({ row }) => <div>{row.getValue('new_field')}</div>,
  },
];
```

---

## 핵심 패턴

### 패턴 1: 새로운 엔터티 추가
**예**: 거래처 은행 정보 (PartnerBank) 추가

1. **Types 수정** (`types/index.ts`)
   ```typescript
   interface PartnerBank {
     id: string;
     partner_id: string;
     bank_name: string;
     account_number: string;
     account_holder: string;
   }
   ```

2. **Service 메서드 추가** (`services/partnersService.ts`)
   ```typescript
   async listBanks(partnerId: string): Promise<PartnerBankListResponse>,
   async createBank(partnerId: string, data: CreatePartnerBankRequest): Promise<PartnerBank>,
   async deleteBank(partnerId: string, bankId: string): Promise<void>,
   ```

3. **Hook 추가** (필요시)
   ```typescript
   export function useBanks(partnerId: string) {
     return useQuery({
       queryKey: [...PARTNERS_QUERY_KEY, 'banks', partnerId],
       queryFn: () => partnerService.listBanks(partnerId),
     });
   }
   ```

4. **컴포넌트 추가** 또는 탭 추가
   - `partner-detail-tabs.tsx`에 새 탭 추가

5. **페이지 구현**
   - 필요시 `/partner-banks/page.tsx` 구현

---

### 패턴 2: 기존 필드 수정
**예**: `Partner.email` → `Partner.primary_email`, `Partner.secondary_email`

1. **Types 수정**
   ```typescript
   interface Partner {
     primary_email?: string;
     secondary_email?: string;
     // email은 제거
   }
   ```

2. **Service는 그대로** (API가 맞춰줄 때까지)

3. **Form 수정** (`partner-form.tsx`)
   ```typescript
   // 기존 email 필드 제거
   // 새로운 필드 2개 추가
   <Input id="primary_email" name="primary_email" />
   <Input id="secondary_email" name="secondary_email" />
   ```

4. **Table 수정** (`page.tsx`)
   ```typescript
   {
     accessorKey: 'primary_email',
     header: '주 이메일',
     cell: ({ row }) => <div>{row.getValue('primary_email')}</div>,
   },
   ```

---

### 패턴 3: 유효성 검증 추가
**예**: `Partner.biz_no` 자리수 검증 추가

In `partner-form.tsx`:
```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  
  // ... 기존 검증 ...
  
  if (formData.biz_no) {
    const bizNoClean = formData.biz_no.replace(/[^0-9]/g, '');
    if (bizNoClean.length !== 10) {
      errors.biz_no = '사업자등록번호는 10자리입니다';
    }
  }
  
  // ... 나머지 ...
};
```

---

## API 엔드포인트 전체 목록

```
POST   /api/v1/crm/partners                    # 거래처 생성
GET    /api/v1/crm/partners                    # 거래처 목록
GET    /api/v1/crm/partners/:id                # 거래처 상세
PATCH  /api/v1/crm/partners/:id                # 거래처 수정
DELETE /api/v1/crm/partners/:id                # 거래처 삭제

POST   /api/v1/crm/partners/:id/contacts       # 담당자 추가
GET    /api/v1/crm/partners/:id/contacts       # 담당자 목록
DELETE /api/v1/crm/partners/:id/contacts/:cid  # 담당자 삭제

POST   /api/v1/crm/partners/:id/addresses      # 주소 추가
GET    /api/v1/crm/partners/:id/addresses      # 주소 목록
DELETE /api/v1/crm/partners/:id/addresses/:aid # 주소 삭제

POST   /api/v1/crm/partners/:id/managers       # 담당자 배정
GET    /api/v1/crm/partners/:id/managers       # 담당자 목록
DELETE /api/v1/crm/partners/:id/managers/:mid  # 담당자 제거
```

---

## 호출 흐름 (예: 거래처 생성)

```
User: "거래처 추가" 버튼 클릭
  ↓
PartnerForm 호출 (Sheet open)
  ↓
User: 폼 입력 및 제출
  ↓
validateForm()
  ↓
partnerService.create(data)
  ↓
axios POST /api/v1/crm/partners
  ↓
Backend: 거래처 생성
  ↓
Response: Partner 객체
  ↓
onSuccess callback
  ↓
State 업데이트 + UI 리렌더
```

---

## 자주하는 실수 Top 3

### 1. Types와 Service가 불일치
```typescript
// ❌ 나쁜 예
interface Partner {
  email: string;
}
// 하지만 service는 email_address로 요청

// ✅ 좋은 예
// Types 수정 → Service 수정 → Component 수정
// 순서대로 한다
```

### 2. 환경변수 없이 API URL 하드코딩
```typescript
// ❌ 나쁜 예
const API_URL = 'http://localhost:8100/api/v1/crm/partners';

// ✅ 좋은 예
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/crm/partners`;
```

### 3. 쿼리 무효화 빼먹기
```typescript
// ❌ 나쁜 예
export function useCreatePartner() {
  return useMutation({
    mutationFn: (data) => partnerService.create(data),
    // onSuccess에서 쿼리 무효화 안함
  });
}

// ✅ 좋은 예
export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => partnerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
  });
}
```

---

## 개발 팁

### Tip 1: mock 데이터로 테스트
`/app/(main)/crm/partners/page.tsx`에 이미 mock 데이터 있음:
```typescript
const mockPartners: Partner[] = [
  { id: '1', code: 'SUPP_001', name: '(주)협력업체1', ... },
  // ...
];
```
실제 API 연결 전에 여기서 테스트 가능

### Tip 2: 타입 정의부터 시작
새로운 기능 추가 시:
1. Types 정의 (`types/index.ts`)
2. Service 메서드 추가 (`services/partnersService.ts`)
3. Hook 추가 (`hooks/usePartners.ts`)
4. Component 구현

이 순서를 지키면 타입 오류 방지 가능

### Tip 3: console.error 활용
Service 파일에 이미 에러 로깅 있음:
```typescript
try {
  const response = await axios.get(API_ENDPOINT);
  return response.data;
} catch (error) {
  console.error('Error fetching partners:', error);  // ← 개발 시 보임
  throw error;
}
```
브라우저 DevTools > Console에서 확인

---

## 체크리스트: 새로운 필드 추가할 때

- [ ] `types/index.ts`에 필드 추가
- [ ] `services/partnersService.ts`가 올바른지 확인
- [ ] Form 컴포넌트에 입력 필드 추가
- [ ] 유효성 검증 로직 추가
- [ ] 테이블에 컬럼 추가 (필요시)
- [ ] 상세 탭에 필드 표시 (필요시)
- [ ] 타입 정의와 Service 일치 확인
- [ ] 쿼리 무효화 설정 확인
- [ ] mock 데이터에 새 필드 추가해서 테스트

---

## 자주 수정되는 파일 속도 순

| 파일 | 수정 빈도 | 난이도 | 영향 범위 |
|------|---------|------|---------|
| `types/index.ts` | ⭐⭐⭐⭐⭐ | 낮음 | 전체 |
| `partner-form.tsx` | ⭐⭐⭐⭐⭐ | 중간 | 폼 영역 |
| `partners/page.tsx` | ⭐⭐⭐⭐ | 중간 | 목록 페이지 |
| `services/partnersService.ts` | ⭐⭐⭐⭐ | 낮음 | 데이터 영역 |
| `partner-detail-tabs.tsx` | ⭐⭐⭐ | 높음 | 상세 영역 |
| `hooks/usePartners.ts` | ⭐⭐ | 낮음 | 데이터 흐름 |

---

## 최종 체크: 배포 전

- [ ] mock 데이터 제거 또는 실제 API로 교체
- [ ] console.log/console.error 확인
- [ ] 환경변수 설정 (NEXT_PUBLIC_API_URL)
- [ ] 타입 검사: `npm run type-check`
- [ ] 린트 확인: `npm run lint`
- [ ] 테스트 실행: `npm test`
- [ ] 최종 UI 테스트
- [ ] 에러 처리 확인
- [ ] 로딩 상태 UI 확인
- [ ] 반응형 디자인 확인

