# 마케팅 페이지 구현 (기능, 가격, 문의)

## 작업 일시
2025-10-17 08:17:02

## 작업 내용

### 1. 기능 페이지 (Features) 구현
- **경로**: `/features`
- **파일**: `apps/tenants-web/src/app/(marketing)/features/page.tsx`
- **주요 기능**:
  - 9개 핵심 업무 모듈 소개 (SRM, CSM, PSM, IVM, FIM, LWM, ASM, BIM, COM)
  - 각 모듈별 주요 기능 4개씩 표시
  - 플랫폼 핵심 가치 4가지 강조 (AI 자동화, 통합 플랫폼, 실시간 분석, 확장 가능)
  - CTA (회원가입/문의) 섹션

### 2. 가격 페이지 (Pricing) 구현
- **경로**: `/pricing`
- **파일**: `apps/tenants-web/src/app/(marketing)/pricing/page.tsx`
- **주요 기능**:
  - 3가지 요금제 (Starter, Professional, Enterprise)
  - Starter: 99,000원/월 (최대 10명, 기본 모듈 5개)
  - Professional: 249,000원/월 (최대 30명, 전체 모듈 9개) - 인기 플랜
  - Enterprise: 맞춤 견적 (무제한 사용자, 맞춤 개발)
  - 추가 옵션 4가지 (사용자, 스토리지, AI 분석, 커스텀 개발)
  - FAQ 6개 항목
  - 14일 무료 체험 강조

### 3. 문의 페이지 (Contact) 구현
- **경로**: `/contact`
- **파일**: `apps/tenants-web/src/app/(marketing)/contact/page.tsx`
- **주요 기능**:
  - 연락처 정보 카드 4개 (전화, 이메일, 위치, 운영시간)
  - 상담 신청 폼 (이름, 회사명, 이메일, 연락처, 직원 수, 문의 내용)
  - 폼 검증 및 제출 처리 (클라이언트 사이드)
  - 성공/오류 메시지 표시
  - 빠른 답변 팁 제공
  - 무료 데모 안내
  - FAQ 3개 항목

### 4. 디자인 특징
- ConnexGrow 브랜드 컬러 (Blue-Cyan 그라데이션) 일관성 유지
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- Pretendard + Geist Mono 폰트 사용
- 부드러운 애니메이션 및 호버 효과
- 명확한 계층 구조 및 시각적 그룹화
- 접근성 고려 (시맨틱 HTML, 명확한 레이블)

### 5. 사용자 경험 (UX)
- 명확한 CTA 배치
- 단계별 정보 제공
- 신뢰성 강조 (14일 무료 체험, 카드 등록 불필요, 언제든 해지 가능)
- 실용적인 FAQ 제공
- 쉬운 문의 절차

## 기술 스택
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React (아이콘)

## 다음 작업 제안
1. 실제 API 연동 (문의 폼 제출)
2. 메타 태그 및 SEO 최적화
3. 오픈 그래프 이미지 추가
4. 구글 애널리틱스 연동
5. 챗봇/라이브 채팅 추가
6. 고객 후기/사례 연구 페이지
7. 블로그/리소스 센터
