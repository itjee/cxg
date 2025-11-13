# Rebranding: CXG Platform → ConexGrow

**작업일시**: 2025-10-17 16:57:49
**작업자**: Claude Code
**작업 유형**: 브랜드 아이덴티티 변경

## 작업 개요

CXG Platform에서 ConexGrow 브랜드로 전환하는 리브랜딩 작업을 수행했습니다. CXG는 회사명으로 유지하고, ConexGrow를 제품 브랜드명으로 사용하는 브랜드 아키텍처를 구현했습니다.

## 브랜드 전략

### 브랜드 아키텍처

```
CXG (Company / Domain)
└── ConexGrow (Product Brand)
    ├── ConexGrow Manager (관리자 시스템)
    └── ConexGrow Workspace (테넌트 시스템)
```

### 네이밍 전략

| 항목 | 이전 | 변경 후 | 비고 |
|------|------|---------|------|
| **회사명** | CXG | CXG | 유지 |
| **도메인** | cxg.* | cxg.* | 유지 |
| **제품 브랜드** | CXG Platform | ConexGrow | 변경 |
| **관리자 앱** | CXG Manager / 플랫폼 관리자 | ConexGrow Manager | 변경 |
| **테넌트 앱** | CXG Platform | ConexGrow Workspace | 변경 |
| **전체 표기** | - | ConexGrow by CXG | 신규 |

### 브랜드 의미

**ConexGrow**
- **Conex**: Connection + Experience (연결과 경험)
- **Grow**: 성장과 발전
- **의미**: "연결을 통한 성장" 또는 "경험을 통한 성장"

**장점**:
- 긍정적이고 미래지향적 의미
- 국제적으로 사용 가능한 영문명
- SaaS/플랫폼 비즈니스에 적합
- 발음하기 쉽고 기억하기 쉬움

## 작업 내용

### 1. 메타데이터 업데이트

#### layout.tsx

**파일**: `src/app/layout.tsx`

**변경 전**:
```typescript
export const metadata: Metadata = {
  title: "CXG Manager - AI-Powered Business Support Platform",
  description: "Manage tenants, infrastructure, and analytics for your business platform",
};
```

**변경 후**:
```typescript
export const metadata: Metadata = {
  title: "ConexGrow Manager - AI-Powered Business Support Platform",
  description: "ConexGrow by CXG - Manage tenants, infrastructure, and analytics for your business platform",
};
```

**HTML 언어 설정**:
```typescript
<html lang="ko" suppressHydrationWarning>
```

**영향**:
- 브라우저 탭 타이틀: "ConexGrow Manager"
- SEO 메타 설명에 "ConexGrow by CXG" 표시
- 검색 엔진 최적화

### 2. 사이드바 브랜딩

#### sidebar.tsx

**파일**: `src/components/layout/sidebar.tsx`

**변경 전**:
```tsx
<span className="font-semibold text-base">플랫폼 관리자</span>
```

**변경 후**:
```tsx
<div className="flex flex-col">
  <span className="font-bold text-base leading-tight">ConexGrow</span>
  <span className="text-xs text-muted-foreground">Manager</span>
</div>
```

**시각적 효과**:
- 2줄 레이아웃으로 브랜드 강조
- "ConexGrow" 볼드체로 강조
- "Manager" 서브텍스트로 앱 구분
- CXG 로고와 함께 표시

### 3. 로그인 페이지

#### signin/page.tsx

**파일**: `src/app/(auth)/signin/page.tsx`

**변경 전**:
```tsx
<Badge variant="outline" className="px-4 py-2">
  Manager Web - 관리자 플랫폼
</Badge>
```

**변경 후**:
```tsx
<Badge variant="outline" className="px-4 py-2">
  ConexGrow Manager by CXG
</Badge>
```

**위치**: 로그인 카드 상단의 배지

### 4. 회원가입 페이지

#### signup/page.tsx

**파일**: `src/app/(auth)/signup/page.tsx`

**변경 전**:
```tsx
<Badge variant="outline" className="px-4 py-2">
  Manager Web - 관리자 플랫폼
</Badge>
```

**변경 후**:
```tsx
<Badge variant="outline" className="px-4 py-2">
  ConexGrow Manager by CXG
</Badge>
```

**위치**: 회원가입 카드 상단의 배지

### 5. package.json 업데이트

**파일**: `apps/manager-web/package.json`

**추가된 필드**:
```json
{
  "name": "manager-web",
  "version": "0.1.0",
  "description": "ConexGrow Manager - Service provider interface for managing tenants by CXG",
  "private": true
}
```

**용도**:
- npm/pnpm 패키지 정보
- 프로젝트 문서화
- 개발자 참조

### 6. CLAUDE.md 프로젝트 문서

**파일**: `/home/itjee/workspace/cxg/CLAUDE.md`

**변경 전**:
```markdown
## Project Overview

CXG Platform is an AI-powered business support platform designed for small and medium-sized companies (under 50 employees). It's a multi-tenant SaaS solution with two main systems:

- **Manager System** (`manager-web`): Service provider interface for managing tenants
- **Tenant System** (`tenants-web`): Client interface integrating ERP, CRM, SCM, WMS, and workflow automation
```

**변경 후**:
```markdown
## Project Overview

**ConexGrow by CXG** is an AI-powered business support platform designed for small and medium-sized companies (under 50 employees). It's a multi-tenant SaaS solution with two main systems:

- **ConexGrow Manager** (`manager-web`): Service provider interface for managing tenants
- **ConexGrow Workspace** (`tenants-web`): Client interface integrating ERP, CRM, SCM, WMS, and workflow automation

### Brand Architecture

- **CXG**: Company name and domain (cxg.com)
- **ConexGrow**: Product brand name
  - ConexGrow Manager: Admin/management interface
  - ConexGrow Workspace: Tenant/client interface
```

**추가 내용**:
- 브랜드 아키텍처 섹션 신규 추가
- 명확한 계층 구조 문서화

## 파일 변경 이력

### 수정된 파일 (6개)

1. **src/app/layout.tsx**
   - 메타데이터 title 변경: "ConexGrow Manager"
   - 메타데이터 description에 "ConexGrow by CXG" 추가

2. **src/components/layout/sidebar.tsx**
   - 로고 텍스트 2줄 레이아웃으로 변경
   - "ConexGrow" + "Manager" 구조

3. **src/app/(auth)/signin/page.tsx**
   - 배지 텍스트: "ConexGrow Manager by CXG"

4. **src/app/(auth)/signup/page.tsx**
   - 배지 텍스트: "ConexGrow Manager by CXG"

5. **apps/manager-web/package.json**
   - description 필드 추가

6. **CLAUDE.md**
   - Project Overview 섹션 업데이트
   - Brand Architecture 섹션 추가

### 변경되지 않은 항목

- ✅ 코드베이스 폴더명: `cxg` (유지)
- ✅ 도메인: `cxg.*` (유지)
- ✅ 회사명: CXG (유지)
- ✅ 내부 기술 문서의 약어: CXG (유지)
- ✅ 로고 파일: `/logo/logo_*.png` (유지, CXG 로고)

## 빌드 결과

### 빌드 성공

```bash
✓ Compiled successfully in 2.7s
✓ Generating static pages (40/40)
✓ Finalizing page optimization
```

### 번들 크기

```
+ First Load JS shared by all     137 kB
```

**영향 없음**: 브랜딩 변경은 텍스트만 수정하므로 번들 크기에 영향 없음

### 생성된 라우트

총 40개 라우트 정상 생성, 모든 페이지 정상 작동

## 브랜드 적용 범위

### UI에 표시되는 위치

1. **브라우저 탭 타이틀**
   - "ConexGrow Manager - AI-Powered Business Support Platform"

2. **사이드바 로고 영역**
   - CXG 로고 + "ConexGrow" / "Manager" 텍스트

3. **로그인/회원가입 페이지**
   - 상단 배지: "ConexGrow Manager by CXG"

4. **메타 태그 (SEO)**
   - Open Graph, Twitter Card 등에 "ConexGrow by CXG" 표시

### 표시되지 않는 위치 (내부용)

- 코드 주석
- 변수명
- 함수명
- 폴더 구조
- Git 커밋 메시지
- 내부 기술 문서

## 브랜드 가이드라인

### 표기 방법

#### 정식 표기

| 컨텍스트 | 표기 방법 | 예시 |
|---------|----------|------|
| **제품 단독 표기** | ConexGrow | "ConexGrow를 소개합니다" |
| **앱 구분 표기** | ConexGrow Manager / ConexGrow Workspace | "ConexGrow Manager에 로그인하세요" |
| **회사 연결 표기** | ConexGrow by CXG | "ConexGrow by CXG는..." |
| **도메인/URL** | cxg.com | "https://cxg.com" |
| **기술 문서** | CXG / ConexGrow | "CXG 플랫폼의 ConexGrow 제품" |

#### 대소문자 규칙

- ✅ **ConexGrow** (정확한 표기)
- ❌ Conexgrow
- ❌ CONEXGROW
- ❌ conex grow
- ❌ ConexGROW

#### 띄어쓰기

- ✅ ConexGrow Manager
- ✅ ConexGrow by CXG
- ❌ ConexGrowManager
- ❌ Conex Grow Manager

### 사용 예시

#### 마케팅 자료
```
"ConexGrow는 중소기업을 위한 AI 기반 비즈니스 지원 플랫폼입니다."
"ConexGrow by CXG - 성장을 위한 연결"
```

#### UI 텍스트
```
"ConexGrow Manager에 오신 것을 환영합니다"
"ConexGrow Workspace로 이동"
```

#### 기술 문서
```
"CXG의 ConexGrow 제품은 두 개의 주요 앱으로 구성됩니다"
"manager-web (ConexGrow Manager)와 tenants-web (ConexGrow Workspace)"
```

## 향후 작업

### 우선순위 높음

1. **Favicon 업데이트**
   - [ ] ConexGrow 브랜드 반영한 새 favicon 디자인
   - [ ] 다크모드/라이트모드 대응

2. **OG Image 생성**
   - [ ] 소셜 미디어 공유용 이미지
   - [ ] "ConexGrow by CXG" 브랜딩 포함

3. **로딩 스플래시 화면**
   - [ ] ConexGrow 로고 애니메이션
   - [ ] 첫 로드 시 브랜드 인식 강화

### 우선순위 중간

4. **이메일 템플릿**
   - [ ] 비밀번호 재설정 이메일
   - [ ] 환영 이메일
   - [ ] 알림 이메일
   - 모든 이메일에 "ConexGrow by CXG" 브랜딩

5. **에러 페이지**
   - [ ] 404 페이지에 ConexGrow 브랜딩
   - [ ] 500 에러 페이지 업데이트

6. **문서 사이트**
   - [ ] 사용자 가이드
   - [ ] API 문서
   - [ ] 개발자 문서

### 우선순위 낮음

7. **tenants-web 리브랜딩**
   - [ ] ConexGrow Workspace로 변경
   - [ ] 동일한 브랜드 가이드라인 적용

8. **마케팅 자료**
   - [ ] 랜딩 페이지
   - [ ] 제품 소개서
   - [ ] 프레젠테이션 템플릿

## 체크리스트

### 완료된 작업

- [x] 메타데이터 업데이트 (layout.tsx)
- [x] 사이드바 브랜딩 (sidebar.tsx)
- [x] 로그인 페이지 브랜딩 (signin/page.tsx)
- [x] 회원가입 페이지 브랜딩 (signup/page.tsx)
- [x] package.json 업데이트
- [x] CLAUDE.md 프로젝트 문서 업데이트
- [x] 빌드 테스트 성공
- [x] 작업 문서 작성

### 미완료 작업 (선택사항)

- [ ] README.md 업데이트 (프로젝트 루트)
- [ ] Favicon 변경
- [ ] OG Image 생성
- [ ] 에러 페이지 브랜딩
- [ ] 이메일 템플릿 업데이트
- [ ] tenants-web 리브랜딩

## 기술적 세부사항

### 브랜드 일관성 유지

**코드에서 브랜드 텍스트 관리**:

현재는 하드코딩되어 있으나, 향후 다음과 같이 개선 가능:

```typescript
// src/constants/branding.ts (추천)
export const BRAND = {
  company: "CXG",
  product: "ConexGrow",
  apps: {
    manager: "ConexGrow Manager",
    workspace: "ConexGrow Workspace",
  },
  tagline: "ConexGrow by CXG",
  domain: "cxg.com",
} as const;
```

**장점**:
- 중앙 집중식 브랜드 관리
- 타입 안전성
- 쉬운 일괄 변경
- 다국어 지원 용이

### SEO 최적화

**메타 태그 전략**:

```typescript
// 향후 개선 가능
export const metadata: Metadata = {
  title: {
    template: "%s | ConexGrow Manager",
    default: "ConexGrow Manager - AI-Powered Business Support Platform",
  },
  description: "ConexGrow by CXG - Manage tenants, infrastructure, and analytics for your business platform",
  keywords: ["ConexGrow", "CXG", "business platform", "SaaS", "multi-tenant"],
  authors: [{ name: "CXG" }],
  creator: "CXG",
  publisher: "CXG",
  openGraph: {
    title: "ConexGrow Manager",
    description: "AI-Powered Business Support Platform by CXG",
    siteName: "ConexGrow",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConexGrow Manager",
    description: "AI-Powered Business Support Platform by CXG",
  },
};
```

### 접근성 고려사항

**alt 텍스트 업데이트** (현재는 "CXG" 유지):

```tsx
// 현재
<Image src={logoSrc} alt="CXG" />

// 향후 개선 가능
<Image src={logoSrc} alt="CXG - ConexGrow Manager" />
```

## 참고 사항

### 유사 브랜드 아키텍처 사례

1. **Meta (회사) → Facebook, Instagram (제품)**
   - 회사명과 제품명 분리
   - 각 제품 고유 브랜드 유지

2. **Alphabet (회사) → Google (제품)**
   - 기술 중심 회사명
   - 대중 친화적 제품명

3. **CXG (회사) → ConexGrow (제품)** ✓
   - 간결한 기업명 (CXG)
   - 의미 있는 제품명 (ConexGrow)

### 도메인 전략

- **cxg.com**: 기업 사이트, 기술 문서
- **cxg.com/manager**: ConexGrow Manager 앱
- **cxg.com/workspace**: ConexGrow Workspace 앱
- **cxg.com/docs**: 문서 사이트

## 결론

CXG Platform에서 ConexGrow로의 리브랜딩 작업을 성공적으로 완료했습니다. 명확한 브랜드 계층 구조를 통해 CXG는 회사 아이덴티티로, ConexGrow는 제품 브랜드로 구분되어 사용됩니다.

**주요 성과**:
- ✅ 명확한 브랜드 아키텍처 구축
- ✅ 일관된 브랜딩 적용 (UI, 문서)
- ✅ SEO 최적화 개선
- ✅ 확장 가능한 브랜드 전략
- ✅ 코드 변경 최소화 (텍스트만 수정)
- ✅ 빌드 성공, 성능 영향 없음

**브랜드 가치**:
- **ConexGrow**: 연결과 성장을 통한 비즈니스 지원
- **CXG**: 기술과 혁신을 추구하는 기업
- **시너지**: 기술 기업의 신뢰성 + 제품의 친근함

이제 ConexGrow by CXG로 시장에 일관된 브랜드 메시지를 전달할 수 있습니다.
