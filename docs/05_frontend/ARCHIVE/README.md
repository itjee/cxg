# 프론트엔드 (Frontend)

ConexGrow의 Next.js 기반 프론트엔드 애플리케이션 가이드 및 설계 문서입니다.

## 📚 주요 문서

### 🎯 [프론트엔드 개발 가이드](./FRONTEND-DEVELOPMENT-GUIDE.md) ⭐ **필독**

**ConexGrow 프론트엔드 개발의 모든 것**

- ✅ Feature 구조 표준 (7개 필수 컴포넌트)
- ✅ 테이블 분리 패턴 (columns + table)
- ✅ 컴포넌트 개발 방법
- ✅ 목록 페이지 개발 가이드
- ✅ 상태 관리 (TanStack Query + Zustand)
- ✅ API 통신 패턴
- ✅ 스타일링 (Tailwind CSS v4)
- ✅ 체크리스트 및 베스트 프랙티스

**버전**: 2.0 (2025-01-07 업데이트)

### 📖 보조 문서

- [CSS 스타일링 가이드](./CSS-STYLING-GUIDE.md) - Tailwind CSS v4 상세 가이드
- [컴포넌트 구성 가이드](./COMPONENT-COMPOSITION-GUIDE.md) - shadcn/ui 컴포넌트 활용
- [아키텍처 결정](./FRONTEND_ARCHITECTURE_DECISION.md) - 기술 스택 선정 배경

---

## 🏢 프론트엔드 애플리케이션

### 1. Manager Web (`apps/manager-web`)
운영자용 관리 시스템
- 테넌트 관리
- 청구 및 모니터링
- 플랫폼 운영

### 2. Tenant Web (`apps/tenants-web`)
클라이언트용 ERP 시스템
- 제품 기본정보 관리
- 매출/구매/재고 관리
- 그 외 여러 모듈

**기술 스택**:
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui
- TanStack Query v5
- Zustand

---

## 📁 프로젝트 구조

```
apps/[app-name]/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 라우트 그룹
│   │   ├── (main)/            # 메인 라우트 그룹
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/            # 공통 컴포넌트
│   │   ├── ui/               # shadcn/ui
│   │   ├── layouts/          # 레이아웃
│   │   ├── data-table/       # DataTable
│   │   └── filters/          # Filters
│   │
│   ├── features/             # Feature 모듈 ⭐
│   │   └── [domain]/
│   │       ├── components/   # 7개 필수 컴포넌트
│   │       ├── hooks/        # TanStack Query hooks
│   │       ├── services/     # API 통신
│   │       ├── stores/       # Zustand stores
│   │       ├── types/        # 타입 정의
│   │       └── index.ts
│   │
│   ├── hooks/                # 전역 커스텀 훅
│   ├── lib/                  # 유틸리티, 설정
│   ├── providers/            # Context Providers
│   └── types/                # 전역 타입
│
├── public/
└── package.json
```

---

## 🚀 빠른 시작

### 1. 개발 환경 설정

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

### 2. 새 Feature 생성

[프론트엔드 개발 가이드](./FRONTEND-DEVELOPMENT-GUIDE.md)의 "Feature 구조 표준" 섹션을 참조하세요.

**필수 파일 구조:**
```
features/[domain]/
├── components/
│   ├── [domain]-columns.tsx    (필수)
│   ├── [domain]-table.tsx      (필수)
│   ├── [domain]-edit.tsx       (필수)
│   ├── [domain]-form.tsx       (필수)
│   ├── [domain]-header.tsx     (필수)
│   ├── [domain]-filters.tsx    (필수)
│   └── [domain]-stats.tsx      (필수)
├── hooks/
├── services/
├── stores/
├── types/
└── index.ts
```

### 3. 참고 구현

- ✅ **tenants-web**: `apps/tenants-web/src/features/sys/users`
- ✅ **manager-web**: `apps/manager-web/src/features/bill/invoice`

---

## 📋 개발 체크리스트

### 목록 페이지 개발 시

- [ ] 7개 필수 컴포넌트 모두 생성
- [ ] 테이블은 columns + table로 분리
- [ ] TanStack Query hooks 작성
- [ ] Zustand store (UI 상태)
- [ ] 서버 사이드 페이징 구현
- [ ] 필터/검색/정렬 구현
- [ ] 로딩/에러 상태 처리

---

## 🎯 핵심 원칙

1. **일관성 우선**: 모든 feature는 동일한 구조
2. **필수 7개 컴포넌트**: 예외 없이 모두 생성
3. **테이블 분리**: columns + table 항상 분리
4. **타입 안전성**: TypeScript strict 모드, any 금지
5. **에러 핸들링**: 모든 API 호출에 에러 처리

---

## 📚 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

**최종 업데이트**: 2025-01-07  
**개발팀**: ConexGrow Development Team
│   ├── public/
│   └── package.json
└── tenants-web/
    ├── src/
    │   ├── app/           # Next.js App Router
    │   ├── components/    # React 컴포넌트
    │   ├── features/      # Feature-based modules
    │   ├── hooks/         # Custom hooks
    │   ├── lib/           # 유틸리티 함수
    │   ├── store/         # Zustand stores
    │   └── types/         # TypeScript types
    ├── public/
    └── package.json
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Violet (브랜드 컬러)
- **Neutral**: Gray (배경, 텍스트)
- **System**: Green (성공), Red (오류), Yellow (경고), Blue (정보)

### 컴포넌트 라이브러리
`shadcn/ui` 기반 컴포넌트
- Button, Input, Select, Checkbox
- Dialog, Popover, Tooltip
- Table, DataTable, Card
- Form, Sheet, Sidebar

### 레이아웃
- **Header**: 상단 네비게이션
- **Sidebar**: 좌측 메뉴
- **Content**: 메인 콘텐츠 영역
- **Footer**: 하단 정보

## 📚 주요 가이드 문서

### Manager Web
- 레이아웃 및 네비게이션
- 상태 관리 패턴
- API 통신 설정
- 인증 플로우

### Tenant Web
- Feature 기반 모듈 구조
- 스키마별 폴더 구조
- 리스트 페이지 개발 가이드
- 폼 및 CRUD 구현

## 🚀 개발 명령어

```bash
# 의존성 설치
cd apps/manager-web
pnpm install

# 개발 서버 실행
pnpm dev
# Manager: http://localhost:8200

cd apps/tenants-web
pnpm install
pnpm dev
# Tenant: http://localhost:8300

# 빌드
pnpm build

# 린팅 및 포맷팅
pnpm lint
pnpm format
```

## 📖 관련 문서

### 구현 세부사항
- [Manager Web 구현](../implementation/02_frontend/manager_web/)
- [Tenant Web 구현](../implementation/02_frontend/tenants_web/)

### 가이드
- [프로젝트 구조](../guides/04-PROJECT-STRUCTURE.md)
- [프론트엔드 가이드](../guides/07-FRONTEND-GUIDE.md)
- [네이밍 컨벤션](../guides/05-NAMING-CONVENTIONS.md)

## 🔗 아키텍처 패턴

### 상태 관리 (Zustand)
```typescript
// store/auth.ts
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    // 로그인 로직
  },
}))
```

### API 통신 (TanStack Query)
```typescript
// hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  })
}
```

### 폼 처리 (React Hook Form)
```typescript
// components/UserForm.tsx
export function UserForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: { ... }
  })
  return <form onSubmit={handleSubmit(onSubmit)}>
    {/* 폼 필드 */}
  </form>
}
```

## 🎯 주요 기능

### Manager Web
- [x] 테넌트 관리
- [x] 사용자 관리
- [x] 역할 및 권한 관리
- [x] 청구 관리
- [x] 모니터링 대시보드

### Tenant Web
- [x] 제품 기본정보 관리
- [x] 매출 관리
- [x] 구매 관리
- [x] 재고 관리
- [x] 그 외 여러 비즈니스 모듈

## 📱 반응형 디자인

모든 페이지는 다음 해상도를 지원합니다:
- **Mobile**: 375px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## 🔐 보안

### 인증
- JWT 토큰 기반 인증
- httpOnly 쿠키 사용
- 토큰 새로고침 메커니즘

### 권한 관리
- 역할 기반 접근 제어 (RBAC)
- 페이지 레벨 권한 검사
- 컴포넌트 레벨 권한 검사

## 📊 성능 최적화

- Next.js Image Optimization
- Code Splitting with Route-based Bundles
- Server-side Rendering (SSR) 활용
- Client-side Caching with TanStack Query

## 🧪 테스트

```bash
# 단위 테스트 (Jest)
pnpm test

# E2E 테스트 (Playwright/Cypress)
pnpm test:e2e

# 커버리지 리포트
pnpm test:coverage
```

## 🔗 유용한 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React 문서](https://react.dev)
