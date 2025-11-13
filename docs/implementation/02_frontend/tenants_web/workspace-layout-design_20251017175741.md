# 업무시스템(Workspace) 레이아웃 설계 및 구현

**작성일:** 2025-01-17
**문서 버전:** 1.0
**대상 시스템:** tenants-web

## 개요

ConnexGrow 플랫폼의 업무시스템(workspace) UI/UX를 현대적인 SaaS 트렌드에 맞춰 재설계하고 구현하였습니다.

## 설계 원칙

### 참고한 현대적 SaaS 플랫폼
- **Notion**: 계층적 네비게이션, 워크스페이스 선택기
- **Linear**: 미니멀한 디자인, 키보드 단축키 강조
- **Monday.com**: 모듈화된 구조, 직관적인 그룹핑
- **Slack**: 사이드바 네비게이션, 상태 표시

### 핵심 디자인 원칙
1. **미니멀리즘**: 불필요한 요소 제거, 콘텐츠에 집중
2. **일관성**: 통일된 디자인 언어와 컴포넌트 사용
3. **반응형**: 모바일부터 데스크톱까지 최적화
4. **접근성**: 키보드 네비게이션, 명확한 상태 표시

## 구현 내용

### 1. 사이드바 네비게이션 개선

#### 변경 전
- 단순 리스트 형태의 메뉴
- 그룹화 없이 모든 모듈 나열
- 고정된 높이의 사이드바

#### 변경 후
- **모듈 그룹화**: 업무 영역별로 6개 그룹으로 분류
  - 핵심 (홈)
  - 관리 (사용자, 자산, 시스템)
  - 영업 & 구매 (고객, 영업, 구매)
  - 운영 (재고, 워크플로우)
  - 분석 & 재무 (재무, BI)
  - 협업 (커뮤니케이션)

- **접을 수 있는 그룹**: ChevronDown 아이콘으로 그룹 확장/축소
- **워크스페이스 선택기**: 멀티테넌트 환경 대비
- **축소된 여백**: 더 많은 콘텐츠 공간 확보

```tsx
// 주요 구조
<aside className="w-64 bg-white border-r">
  {/* 로고 */}
  {/* 워크스페이스 선택기 */}
  {/* 그룹화된 네비게이션 */}
  {/* 사용자 정보 및 로그아웃 */}
</aside>
```

### 2. 헤더 개선

#### 주요 기능
- **검색 바**: 전역 검색 기능, 키보드 단축키 표시 (⌘K)
- **최소화된 높이**: 56px → 더 많은 콘텐츠 공간
- **알림 아이콘**: 실시간 알림 상태 표시
- **Backdrop blur**: 스크롤 시 반투명 효과

```tsx
<header className="h-14 bg-white/80 backdrop-blur-sm">
  <input placeholder="검색... (⌘K)" />
  <Bell /> {/* 알림 */}
</header>
```

### 3. 메인 콘텐츠 영역

#### 레이아웃 특징
- **최대 너비 제한**: 1600px (가독성 최적화)
- **반응형 패딩**: 모바일 16px, 데스크톱 24px
- **스크롤 최적화**: 부드러운 스크롤링

### 4. 대시보드(홈) 페이지 리디자인

#### 구성 요소
1. **통계 카드**: 4개 열 그리드, 트렌드 표시
2. **최근 활동**: 2/3 너비, 타임라인 형식
3. **빠른 작업**: 1/3 너비, 주요 작업 버튼
4. **환영 메시지**: 그라데이션 배너, 시작 가이드

#### 디자인 개선
- 둥근 모서리 감소: 16px → 8px (modern look)
- 그림자 최소화: 호버 시에만 표시
- 컴팩트한 간격: 더 많은 정보 표시
- 아이콘 크기 통일: 16px~20px

### 5. 사용자 관리 페이지 구현

#### 기능
- **통계 위젯**: 전체/활성/관리자 사용자 수
- **검색 및 필터**: 실시간 사용자 검색
- **테이블 뷰**: 사용자 정보 일괄 표시
- **상태 뱃지**: 활성/비활성 상태 시각화

#### UI 컴포넌트
```tsx
// 상태 뱃지 예시
<span className="bg-green-100 text-green-700 rounded-full">
  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
  활성
</span>
```

## 색상 시스템

### 주요 색상 (Indigo 계열)
- **Primary**: indigo-600 (#4f46e5)
- **Primary Hover**: indigo-700 (#4338ca)
- **Primary Light**: indigo-50 (#eef2ff)
- **Primary Text**: indigo-700 (#4338ca)

### 보조 색상
- **Success**: green-600 (#16a34a)
- **Warning**: orange-600 (#ea580c)
- **Error**: red-600 (#dc2626)
- **Info**: purple-600 (#9333ea)

### 중립 색상
- **Background**: slate-50 (#f8fafc)
- **Card**: white (#ffffff)
- **Border**: gray-200 (#e5e7eb)
- **Text Primary**: gray-900 (#111827)
- **Text Secondary**: gray-600 (#4b5563)

## 타이포그래피

### 폰트 스택
- **Primary**: Pretendard (한글)
- **Secondary**: Geist (영문, 숫자)
- **Monospace**: Geist Mono (코드)

### 폰트 크기
- **Heading 1**: 24px (text-2xl)
- **Heading 2**: 20px (text-xl)
- **Heading 3**: 18px (text-lg)
- **Body**: 14px (text-sm)
- **Caption**: 12px (text-xs)

## 반응형 브레이크포인트

```css
sm: 640px   /* 모바일 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 데스크톱 */
2xl: 1536px /* 초대형 */
```

## 컴포넌트 패턴

### 카드 스타일
```tsx
className="bg-white rounded-lg p-5 border border-gray-200 
           hover:shadow-md transition-shadow"
```

### 버튼 스타일
```tsx
// Primary
className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
           hover:bg-indigo-700 transition-colors"

// Secondary
className="px-4 py-2 border border-gray-300 text-gray-700 
           rounded-lg hover:bg-gray-50 transition-colors"
```

### 입력 필드
```tsx
className="px-4 py-2 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
```

## 성능 최적화

### 구현된 최적화
1. **이미지 최적화**: Next.js Image 컴포넌트 사용
2. **코드 스플리팅**: 동적 import로 모듈 분리
3. **CSS-in-JS 최소화**: Tailwind CSS 사용
4. **클라이언트 컴포넌트 최소화**: 서버 컴포넌트 우선

### 향후 최적화 계획
- [ ] 가상 스크롤링 (대용량 테이블)
- [ ] 이미지 Lazy loading
- [ ] 프리페칭 (주요 페이지)
- [ ] Service Worker (오프라인 지원)

## 접근성

### 구현된 기능
- **키보드 네비게이션**: Tab, Enter로 모든 기능 접근 가능
- **ARIA 레이블**: 스크린 리더 지원
- **포커스 표시**: 명확한 focus-visible 스타일
- **색상 대비**: WCAG AA 기준 충족

### 키보드 단축키 (계획)
- `⌘K` / `Ctrl+K`: 전역 검색
- `⌘/` / `Ctrl+/`: 단축키 도움말
- `⌘N` / `Ctrl+N`: 새 항목 추가

## 파일 구조

```
apps/tenants-web/src/app/
├── (marketing)/          # 마케팅 페이지
│   ├── page.tsx
│   ├── features/
│   ├── pricing/
│   └── contact/
├── (main)/               # 업무 시스템
│   ├── layout.tsx        # 워크스페이스 레이아웃
│   ├── overview/         # 대시보드
│   ├── adm/              # 사용자 관리
│   ├── asm/              # 자산 관리
│   ├── bim/              # BI 분석
│   ├── com/              # 커뮤니케이션
│   ├── csm/              # 고객 관리
│   ├── fim/              # 재무 관리
│   ├── ivm/              # 재고 관리
│   ├── lwm/              # 워크플로우
│   ├── psm/              # 구매 관리
│   ├── srm/              # 영업 관리
│   └── sys/              # 시스템 설정
└── (auth)/               # 인증 페이지
    ├── signin/
    ├── signup/
    └── logout/
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 테스트 체크리스트

- [ ] 모든 브레이크포인트에서 레이아웃 확인
- [ ] 다크 모드 지원 (향후 계획)
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트
- [ ] 성능 측정 (Lighthouse)

## 다음 단계

1. **모듈별 상세 페이지 구현**
   - 각 모듈의 CRUD 기능
   - 상세 뷰, 폼 디자인

2. **공통 컴포넌트 라이브러리**
   - Table, Form, Modal
   - Toast, Dropdown

3. **데이터 연동**
   - API 통합
   - 상태 관리 (Zustand)
   - React Query 설정

4. **사용자 경험 개선**
   - 로딩 스켈레톤
   - 에러 핸들링
   - 빈 상태 디자인

## 참고 자료

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
