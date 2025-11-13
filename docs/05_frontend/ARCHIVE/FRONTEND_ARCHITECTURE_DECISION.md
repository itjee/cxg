# 프론트엔드 아키텍처 결정: 홍보 사이트 vs 업무 시스템

## 질문

tenants-web을 2가지로 구현하려고 하는데:

1. 홍보용 홈페이지 기능
2. 사용자 업무시스템 (로그인 후)

**옵션 A**: 하나의 Next.js 앱에서 라우팅으로 분리  
**옵션 B**: 별도 도메인/앱으로 완전 분리

## 추천: 하나의 Next.js 앱 + 라우트 그룹 분리 (옵션 A)

### ✅ 이유

#### 1. **현대 트렌드와 베스트 프랙티스**

- **Vercel, Linear, Notion 등**: 한 앱에서 관리
- Next.js 15 App Router는 이를 위해 설계됨
- Route Groups로 깔끔하게 분리 가능

#### 2. **개발 효율성**

```
✅ 하나의 앱
- 공통 컴포넌트 재사용 (UI 라이브러리)
- 통합된 빌드/배포 파이프라인
- 일관된 개발 환경
- 팀 간 협업 용이

❌ 분리된 앱
- 컴포넌트 중복
- 별도 배포 관리
- 일관성 유지 어려움
- 유지보수 비용 2배
```

#### 3. **SEO 및 성능**

```
✅ 통합 도메인 (app.cxg.com)
- 도메인 권위 집중
- 사용자 경험 일관성
- SSR/SSG 최적화 공유
- 검색엔진 크롤링 효율적

❌ 분리된 도메인
- www.cxg.com (홍보)
- app.cxg.com (시스템)
→ 도메인 권위 분산
→ 브랜드 혼란 가능성
```

#### 4. **사용자 경험**

```
✅ 매끄러운 전환
/ (홍보) → /auth/signin → /dashboard (업무)
- 별도 리디렉션 없음
- 세션 관리 단순
- 상태 공유 가능

❌ 도메인 간 전환
www → app 이동 시
- 쿠키/세션 처리 복잡
- CORS 이슈
- 느린 전환
```

## 권장 구조: Next.js Route Groups

```
apps/tenants-web/
├── src/
│   └── app/
│       ├── (marketing)/          # 홍보 사이트 (공개)
│       │   ├── layout.tsx       # 마케팅 레이아웃
│       │   ├── page.tsx         # 홈페이지
│       │   ├── features/
│       │   ├── pricing/
│       │   ├── about/
│       │   └── contact/
│       │
│       ├── (auth)/               # 인증 (공개)
│       │   ├── layout.tsx       # 인증 레이아웃
│       │   ├── singin/
│       │   ├── signup/
│       │   └── forgot-password/
│       │
│       ├── (app)/                # 업무 시스템 (로그인 필요)
│       │   ├── layout.tsx       # 앱 레이아웃 (사이드바, 헤더)
│       │   ├── dashboard/
│       │   ├── crm/
│       │   ├── finance/
│       │   ├── inventory/
│       │   ├── procurement/
│       │   ├── sales/
│       │   └── settings/
│       │
│       ├── layout.tsx            # 루트 레이아웃 (공통)
│       └── globals.css
```

### Route Groups 장점

1. **URL 구조 깔끔**

```
✅ 좋은 구조
/ → 홈페이지
/features → 기능 소개
/pricing → 가격
/signin → 로그인
/dashboard → 대시보드
/crm/customers → 고객 관리

❌ 나쁜 구조
/marketing/
/app/crm/customers (불필요한 prefix)
```

2. **레이아웃 분리**

```tsx
// (marketing)/layout.tsx - 간단한 레이아웃
export default function MarketingLayout({ children }) {
  return (
    <>
      <Header /> {/* 마케팅 헤더 */}
      {children}
      <Footer />
    </>
  );
}

// (app)/layout.tsx - 복잡한 앱 레이아웃
export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        <AppHeader />
        {children}
      </main>
    </div>
  );
}
```

3. **미들웨어로 보안**

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 업무 시스템 보호
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/fim")
  ) {
    const token = request.cookies.get("auth-token");
    if (!token) {
      return NextResponse.redirect("/signin");
    }
  }

  return NextResponse.next();
}
```

## 예외 케이스: 분리가 필요한 경우

### 다음 경우에만 별도 앱 고려:

1. **기술 스택이 완전히 다른 경우**
   - 홍보: WordPress/Webflow
   - 앱: Next.js
2. **규모가 매우 큰 경우**

   - 각 팀이 완전 독립적
   - 배포 사이클이 완전히 다름
   - 10+ 개발자 규모

3. **성능 요구사항이 극단적으로 다른 경우**
   - 홍보: 글로벌 CDN 최적화
   - 앱: 특정 지역 최적화

**CXG Platform의 경우**: 위 케이스에 해당하지 않음 → **통합 권장**

## 실제 사례 비교

### ✅ 통합 아키텍처 사용

- **Vercel**: vercel.com (마케팅 + 대시보드)
- **Linear**: linear.app (홈페이지 + 이슈 트래커)
- **Notion**: notion.so (소개 + 워크스페이스)
- **Stripe**: stripe.com (문서 + 대시보드)
- **GitHub**: github.com (프로필 + 저장소)

### ❌ 분리 아키텍처 사용 (레거시)

- Salesforce (오래된 아키텍처)
- Oracle (복잡도 높음)

## 구현 로드맵

### Phase 1: 기본 구조 (현재)

```
✅ / (홍보 페이지) - 완료
□ (auth) 그룹 추가
  - /signin
  - /signup
□ (app) 그룹 추가
  - /dashboard (기본 레이아웃)
```

### Phase 2: 인증 시스템

```
□ 미들웨어 설정
□ 세션 관리 (Zustand)
□ API 클라이언트 (Axios + React Query)
```

### Phase 3: 업무 모듈

```
□ CRM 모듈
□ Finance 모듈
□ Inventory 모듈
... (순차적으로)
```

## 마이그레이션 전략 (나중에 분리가 필요한 경우)

```
현재: tenants-web (통합)
    ↓ 필요시 분리 (쉬움)
나중: marketing-web + tenants-web
```

Next.js 앱은 쉽게 분리 가능:

1. `(marketing)` 폴더를 새 앱으로 복사
2. `(app)` 폴더만 남김
3. 라우팅 업데이트

## 최종 추천

### ✅ **하나의 Next.js 앱 + Route Groups 사용**

**이유 요약:**

1. 개발 효율성 최대화
2. 유지보수 비용 최소화
3. 사용자 경험 최적화
4. 현대 트렌드와 일치
5. CXG Platform 규모에 적합
6. 필요시 쉽게 분리 가능

**도메인 구조:**

```
app.cxg.com (또는 cxg.com)
├── / → 홍보 페이지
├── /features → 기능 소개
├── /pricing → 가격
├── /signin → 로그인
└── /dashboard → 업무 시스템
```

## 다음 단계

1. Route Groups 구조 생성
2. 인증 시스템 구현
3. 공통 레이아웃 컴포넌트 작성
4. 미들웨어 설정

---

**결론**: 하나의 Next.js 앱으로 구현하되, Route Groups로 명확히 분리하는 것이 최선입니다.
