# 거래처 포탈 페이지 (Partner Portal)

Salesforce의 Account 360-Degree View와 유사한 통합 거래처 정보 포탈입니다.

## 📁 디렉토리 구조

```
partners-portal/[id]/
├── page.tsx                           # 메인 페이지
├── README.md                          # 이 문서
└── components/
    ├── partner-header.tsx             # 헤더 영역 (기본정보, 재무요약, 액션버튼)
    ├── partner-tabs.tsx               # 탭 레이아웃 및 탭 전환 로직
    ├── partner-summary-tab.tsx        # 탭1: 요약 (활동, 기회, 견적, 서비스요청)
    ├── partner-performance-tab.tsx    # 탭2: 실적 및 재무 (매출, 채권, 변경이력)
    ├── partner-marketing-tab.tsx      # 탭3: 마케팅 및 리드 (캠페인, 리드, 설문)
    ├── partner-details-tab.tsx        # 탭4: 상세정보 (기본 필드 편집)
    └── partner-sidebar.tsx            # 우측 사이드바 (연락처, 협업피드, 파일)
```

## 🎨 주요 기능

### 1. 헤더 영역 (Partner Header)
- **기본정보 섹션**
  - 거래처 로고 (또는 기본 아이콘)
  - 거래처명, 코드
  - 등급(Tier), 업종, 거래처 구분 배지
  - 주소, 전화, 이메일, 담당 영업사원

- **핵심 재무 요약**
  - 최근 12개월 매출
  - 미결채권잔액
  - 진행 중인 기획 건수

- **액션 버튼**
  - 새 기회 (New Opportunity)
  - 새 서비스 요청 (New Service Request)
  - 활동 기록 (Log Activity)

### 2. 탭 기반 상세 정보

#### 탭1: 요약 (Summary)
- **영업 활동 내역**: 최근 3개월 활동 (미팅, 통화, 이메일)
- **진행 중인 기회**: 파이프라인 기회 목록 (단계, 금액, 예상 마감)
- **발송된 견적**: 진행 중인 견적 (상태, 금액)
- **미결 서비스요청**: Open 상태의 서비스 요청

#### 탭2: 실적 및 재무
- **월별 매출 추이**: 최근 12개월 매출 차트 (실적 vs 목표)
- **카테고리별 매출**: 제품/서비스 분류별 판매액 및 비율
- **미수금 상세**: 청구서별 미수금 현황 (금액, 연체 일수)
- **신용등급 변동**: 현재 신용등급, 변동이력
- **담당자 변경 이력**: 관리자 변경 로그

#### 탭3: 마케팅 및 리드
- **캠페인 히스토리**: 참여한 캠페인 (유형, 기간, 오픈율, 클릭율)
- **잠재 리드 목록**: 아직 기회로 전환되지 않은 리드
- **피드백/설문 응답**: CSAT, NPS, 의견 수집

#### 탭4: 상세정보
- **편집 가능한 모든 필드**
  - 기본정보: 코드, 명칭, 사업자번호, 거래처 구분, 상태
  - 연락처: 주소, 전화, 팩스, 이메일, 웹사이트
  - 담당정보: 영업사원, 담당 부서
  - 재무정보: 연간 매출액, 설립년도, 임직원 수, 결제조건, 신용한도
  - 은행정보: 은행명, 계좌번호, 세금ID
  - 비고: 특기사항

### 3. 우측 사이드바

#### 연락처 (Contacts)
- 거래처의 모든 담당자 목록
- 직급, 이메일, 전화번호
- 주담당자 표시

#### 협업 피드 (Chatter Feed)
- 내부 팀의 거래처 관련 협업 메모
- 파일 첨부 지원
- 좋아요/댓글 기능

#### 참조 파일 (Related Files)
- 계약서, 협약서, 제안서, 보고서 등
- 파일 유형 아이콘
- 업로드 날짜 및 담당자

## 🔌 Props 인터페이스

### PartnerHeader Props
```typescript
interface PartnerHeaderProps {
  partner: {
    id: string;
    code: string;
    name: string;
    type: 'supplier' | 'customer' | 'both';
    tier?: string;
    industry?: string;
    address?: string;
    tel?: string;
    email?: string;
    accountOwner?: string;
    logo?: string;
  };
  onNewOpportunity?: () => void;
  onNewServiceRequest?: () => void;
  onLogActivity?: () => void;
}
```

### PartnerTabs Props
```typescript
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

interface PartnerTabsProps {
  tabs: Tab[];
}
```

## 🚀 사용 방법

```tsx
import { PartnerHeader } from './components/partner-header';
import { PartnerTabs } from './components/partner-tabs';
import { PartnerSummaryTab } from './components/partner-summary-tab';
// ... 다른 탭 임포트

export default function PartnerPortalPage() {
  const partner = { /* 거래처 데이터 */ };

  return (
    <div className="space-y-6">
      <PartnerHeader partner={partner} />
      <PartnerTabs tabs={[/* 탭 목록 */]} />
    </div>
  );
}
```

## 📊 데이터 구조

### 거래처 기본 정보
```typescript
interface Partner {
  id: string;
  code: string;
  name: string;
  englishName?: string;
  bizNo: string;
  type: 'supplier' | 'customer' | 'both';
  status: 'active' | 'inactive';
  tier?: string;
  industry?: string;
  address: string;
  tel: string;
  email: string;
  accountOwner: string;
}
```

### 영업 활동
```typescript
interface ActivityRecord {
  id: string;
  type: 'meeting' | 'call' | 'email';
  subject: string;
  date: string;
  owner: string;
  notes?: string;
}
```

### 영업 기회
```typescript
interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount: number;
  expectedCloseDate: string;
  owner: string;
}
```

## 🎯 향후 개선사항

- [ ] 실시간 데이터 연동 (API)
- [ ] 차트 라이브러리 통합 (recharts, chart.js)
- [ ] 활동/기회/견적 생성 모달
- [ ] 고급 필터 및 검색
- [ ] PDF 내보내기 기능
- [ ] 대시보드 커스터마이징
- [ ] 권한 기반 필드 숨김
- [ ] 감사 로그 (Audit Trail)

## 📝 주석

현재 모든 데이터는 **모의 데이터(Mock Data)**로 구성되어 있습니다.
실제 운영을 위해서는 backend API와 연동이 필요합니다.

## 🔗 관련 페이지

- 거래처 목록: `/crm/partners`
- 거래처 생성: `/crm/partners/new`
- 거래처 연락처: `/crm/partner-contacts`
- 영업 기회: `/crm/opportunities`
- 활동 기록: `/crm/activities`

## 📍 라우트 경로

- **포탈 페이지**: `/crm/partners-portal/[id]`
- **컴포넌트 경로**: `src/app/(main)/crm/partners-portal/[id]/components/`
