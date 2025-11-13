# 거래처관리 (Partner Management) - 문서 인덱스

## 개요

이 인덱스는 거래처관리 (Partner Management) 기능의 구현 및 참고 자료를 정리한 것입니다.
새로운 페이지나 기능을 구현할 때 참고할 수 있는 완전한 구조 가이드입니다.

---

## 문서 구조

### 1. PARTNER_MANAGEMENT_QUICK_REFERENCE.md (빠른 참조)
**읽는 시간**: 5-10분
**대상**: 빠르게 필요한 정보를 찾는 개발자

**포함 내용**:
- 파일 위치 한눈에 보기
- 가장 많이 수정하는 파일 Top 5 (상세 설명)
- 핵심 패턴 3가지 (실제 코드 예시)
- API 엔드포인트 전체 목록
- 자주하는 실수 Top 3
- 개발 팁
- 체크리스트

**사용 시기**:
- 기능을 빨리 구현해야 할 때
- 어떤 파일을 수정해야 하는지 모를 때
- 패턴을 따라 새로운 기능을 추가할 때

---

### 2. PARTNER_MANAGEMENT_REFERENCE.md (상세 참조)
**읽는 시간**: 20-30분
**대상**: 전체 구조를 이해하고 싶은 개발자

**포함 내용**:
- 전체 파일 구조 (페이지, 기능, 컴포넌트)
- 파일별 상세 설명 (299줄 이상)
  - 페이지 파일
  - 타입 정의 (Types)
  - API 서비스 (Services)
  - 커스텀 훅 (Hooks)
  - 컴포넌트 (Components)
  - 인덱스 파일 (Index/Export)
- 디렉토리 구조 (완전한 트리)
- 명명 규칙
- 데이터 흐름
- 참고사항 (현재 상태, 백엔드 모델, API 엔드포인트, 기술 스택)
- 확장성 고려사항

**사용 시기**:
- 첫 번째 설정 또는 온보딩
- 구조를 깊이 있게 이해하고 싶을 때
- 새로운 엔터티를 추가할 때
- 기술 결정을 내려야 할 때

---

### 3. PARTNER_MANAGEMENT_FILE_SUMMARY.md (파일 요약 표)
**읽는 시간**: 10-15분
**대상**: 파일 목록과 의존성을 확인하고 싶은 개발자

**포함 내용**:
- 파일별 요약 표
  - 파일 경로
  - 파일명
  - 크기
  - 목적
  - 주요 내용
- 주요 통계
- 파일별 의존성 다이어그램
- API 엔드포인트 매핑 표
- 타입 계층도
- 사용한 라이브러리
- 구현 체크리스트
- 다음 단계 (Next Steps)

**사용 시기**:
- 전체 파일 구조를 빠르게 파악하고 싶을 때
- 특정 파일의 역할을 확인할 때
- 의존성을 분석할 때
- 구현 진행 상황을 추적할 때

---

## 빠른 시작 가이드

### 시나리오 1: "새로운 페이지를 구현해야 한다"
**추천 순서**:
1. PARTNER_MANAGEMENT_QUICK_REFERENCE.md 읽기 (Top 5 파일 부분)
2. 패턴 섹션에서 해당 패턴 찾기
3. PARTNER_MANAGEMENT_REFERENCE.md에서 상세 코드 확인
4. 실제 파일 열어서 코드 작성

**소요 시간**: 15-30분

---

### 시나리오 2: "기존 기능을 수정해야 한다"
**추천 순서**:
1. PARTNER_MANAGEMENT_QUICK_REFERENCE.md의 "자주 수정되는 파일 속도 순" 표 확인
2. 해당 파일의 상세 설명 읽기
3. 자주하는 실수 Top 3 확인
4. 수정 시작

**소요 시간**: 10-20분

---

### 시나리오 3: "전체 구조를 이해하고 싶다"
**추천 순서**:
1. PARTNER_MANAGEMENT_REFERENCE.md 전체 읽기
2. PARTNER_MANAGEMENT_FILE_SUMMARY.md의 "파일별 의존성" 다이어그램 확인
3. 실제 파일들을 열어서 코드 살펴보기
4. 백엔드 모델과 비교 분석

**소요 시간**: 45-60분

---

### 시나리오 4: "새로운 필드를 추가해야 한다"
**추천 순서**:
1. PARTNER_MANAGEMENT_QUICK_REFERENCE.md에서 "패턴 2: 기존 필드 수정" 확인
2. PARTNER_MANAGEMENT_QUICK_REFERENCE.md의 "체크리스트: 새로운 필드 추가할 때" 따라하기
3. PARTNER_MANAGEMENT_FILE_SUMMARY.md에서 영향 받는 파일들 확인
4. 해당 파일들 수정

**소요 시간**: 20-40분

---

## 문서 선택 플로우

```
당신의 상황
├─ "5분 안에 무엇을 수정할지 알고 싶다"
│  └─ PARTNER_MANAGEMENT_QUICK_REFERENCE.md
│
├─ "전체 구조를 이해하고 싶다"
│  └─ PARTNER_MANAGEMENT_REFERENCE.md
│
├─ "파일 목록과 의존성을 보고 싶다"
│  └─ PARTNER_MANAGEMENT_FILE_SUMMARY.md
│
├─ "특정 파일의 역할을 알고 싶다"
│  ├─ PARTNER_MANAGEMENT_FILE_SUMMARY.md (파일 요약 표)
│  └─ PARTNER_MANAGEMENT_REFERENCE.md (파일별 상세 설명)
│
└─ "새로운 기능을 추가하고 싶다"
   ├─ PARTNER_MANAGEMENT_QUICK_REFERENCE.md (패턴 섹션)
   ├─ PARTNER_MANAGEMENT_REFERENCE.md (상세 코드)
   └─ PARTNER_MANAGEMENT_FILE_SUMMARY.md (체크리스트)
```

---

## 주요 파일 위치 (절대 경로)

### 페이지
```
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/partners/page.tsx
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/partner-addresses/page.tsx
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/partner-contacts/page.tsx
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/partner-managers/page.tsx
/home/itjee/workspace/cxg/apps/tenants-web/src/app/(main)/crm/partner-banks/page.tsx
```

### 기능 (Features)
```
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/types/index.ts
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/services/partnersService.ts
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/hooks/usePartners.ts
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/components/partner-form.tsx
/home/itjee/workspace/cxg/apps/tenants-web/src/features/crm/partners/components/partner-detail-tabs.tsx
```

### 공유 컴포넌트
```
/home/itjee/workspace/cxg/apps/tenants-web/src/components/forms/partner-form.tsx
```

---

## 통계

| 항목 | 값 |
|------|-----|
| 전체 문서 수 | 3개 |
| 총 줄 수 | 1,292줄 |
| 참고 가능한 파일 | 15개 |
| 핵심 코드 | ~3,500줄 |
| API 메서드 | 20+ 개 |
| 타입 정의 | 10+ 개 |
| 컴포넌트 | 3개 |

---

## 문서별 특징

### PARTNER_MANAGEMENT_QUICK_REFERENCE.md
| 특징 | 설명 |
|------|------|
| 길이 | 중간 (435줄) |
| 난이도 | 낮음 |
| 코드 예시 | 많음 |
| 다이어그램 | 적음 |
| 읽는 시간 | 5-10분 |
| 추천 빈도 | 높음 |

### PARTNER_MANAGEMENT_REFERENCE.md
| 특징 | 설명 |
|------|------|
| 길이 | 길음 (686줄) |
| 난이도 | 중간 |
| 코드 예시 | 중간 |
| 다이어그램 | 중간 |
| 읽는 시간 | 20-30분 |
| 추천 빈도 | 중간 |

### PARTNER_MANAGEMENT_FILE_SUMMARY.md
| 특징 | 설명 |
|------|------|
| 길이 | 짧음 (171줄) |
| 난이도 | 낮음 |
| 코드 예시 | 적음 |
| 다이어그램 | 많음 |
| 읽는 시간 | 10-15분 |
| 추천 빈도 | 중간 |

---

## 추가 리소스

### 백엔드 관련
```
/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/crm/
├── partners.py
├── partner_contacts.py
├── partner_addresses.py
├── partner_managers.py
└── partner_banks.py

/home/itjee/workspace/cxg/packages/database/schemas/tenants/03_crm/
├── 01_partners.sql
├── 02_partner_contacts.sql
├── 03_partner_addresses.sql
├── 04_partner_managers.sql
└── 05_partner_banks.sql
```

### 문서
```
/home/itjee/workspace/cxg/docs/implementation/01_backend_api/
└── 거래처_통합관리_partners_전환_20251023164528.md
```

---

## 자주 묻는 질문 (FAQ)

### Q1. "어떤 문서부터 읽어야 할까요?"
**A**: 시간이 없으면 QUICK_REFERENCE, 시간이 많으면 REFERENCE부터 읽으세요.

### Q2. "코드를 직접 보고 싶어요"
**A**: 파일 경로가 모두 절대 경로로 제시되어 있습니다. 에디터에서 바로 열 수 있습니다.

### Q3. "새로운 엔터티(예: PartnerBank)를 추가하고 싶어요"
**A**: QUICK_REFERENCE.md의 "패턴 1: 새로운 엔터티 추가" 섹션을 따르세요.

### Q4. "특정 파일이 어떤 역할을 하는지 궁금해요"
**A**: FILE_SUMMARY.md의 파일 요약 표에서 찾을 수 있습니다.

### Q5. "전체 API 엔드포인트가 뭔가요?"
**A**: QUICK_REFERENCE.md와 FILE_SUMMARY.md에 모두 나열되어 있습니다.

### Q6. "백엔드와의 통신 방식이 뭔가요?"
**A**: REFERENCE.md의 "API 서비스" 섹션을 참고하세요.

### Q7. "어떤 라이브러리를 사용하나요?"
**A**: FILE_SUMMARY.md의 "사용한 라이브러리" 테이블을 참고하세요.

### Q8. "이 코드의 구현 상태는 어떻게 되나요?"
**A**: FILE_SUMMARY.md의 "구현 체크리스트"를 확인하세요.

---

## 버전 정보

| 항목 | 정보 |
|------|------|
| 생성 일자 | 2025-11-01 |
| 기준 커밋 | e471df4 (first commit) |
| 적용 브랜치 | main |
| 상태 | 참고 자료 완성 |

---

## 관련 페이지 구조

```
CRM (Customer Relationship Management)
├── Partners (거래처) ⭐ 본 가이드의 대상
│   ├── 목록 (list)
│   ├── 상세 (detail)
│   ├── 담당자 (contacts)
│   ├── 주소 (addresses)
│   ├── 당사 담당자 (managers)
│   └── 은행 정보 (banks)
├── Leads (리드)
├── Opportunities (영업기회)
├── Campaigns (캠페인)
├── Interactions (상호작용)
├── Activities (활동)
└── ...
```

---

## 다음 단계

### 즉시 (Immediate)
- [ ] 이 문서들을 즐겨찾기에 추가
- [ ] QUICK_REFERENCE 한번 읽어보기
- [ ] 파일 위치들 확인해보기

### 단기 (Short-term)
- [ ] 해당 파일들 열어서 코드 살펴보기
- [ ] 새로운 기능 추가 시도해보기
- [ ] 패턴들이 작동하는지 확인

### 장기 (Long-term)
- [ ] 더 많은 페이지 구현
- [ ] 이 구조로 다른 기능도 구현
- [ ] 문서 개선 및 업데이트

---

## 문의 및 피드백

이 문서에 오류가 있거나 개선할 사항이 있으면 알려주세요.
최신 코드 상태에 맞게 유지하겠습니다.

---

**Happy coding! 🚀**
