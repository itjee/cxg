# CSS 스타일링 가이드

**작성일**: 2025-10-19
**적용 대상**: manager-web, tenants-web

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [Tailwind CSS v4 구조](#tailwind-css-v4-구조)
3. [색상 시스템](#색상-시스템)
4. [타이포그래피](#타이포그래피)
5. [스크롤바 스타일링](#스크롤바-스타일링)
6. [다크 모드](#다크-모드)
7. [반응형 디자인](#반응형-디자인)
8. [애니메이션](#애니메이션)
9. [베스트 프랙티스](#베스트-프랙티스)

## 아키텍처 개요

### 전체 구조

```
apps/
├── manager-web/
│   └── src/
│       └── app/
│           └── globals.css         # Manager 전역 스타일
└── tenants-web/
    └── src/
        └── app/
            └── globals.css         # Tenant 전역 스타일
```

### 기술 스택

- **Tailwind CSS v4**: 유틸리티 우선 CSS 프레임워크
- **OKLCH 색상 공간**: 정확한 색상 표현과 일관성
- **CSS Variables**: 동적 테마 시스템
- **tw-animate-css**: 애니메이션 유틸리티

## Tailwind CSS v4 구조

### globals.css 기본 구조

```css
@import "tailwindcss";              /* Tailwind v4 기본 스타일 */
@import "tw-animate-css";           /* 애니메이션 라이브러리 */

@custom-variant dark (&:is(.dark *)); /* 다크 모드 variant 정의 */

@theme {
  /* Tailwind에서 사용할 CSS 변수 매핑 */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-primary: var(--primary);
  --color-background: var(--background);
  /* ... 기타 색상 매핑 */
}

:root {
  /* 라이트 모드 변수 */
}

.dark {
  /* 다크 모드 변수 */
}

@layer base {
  /* 기본 스타일 */
}
```

### @theme 블록의 역할

`@theme` 블록은 CSS 변수를 Tailwind 유틸리티 클래스에 매핑합니다:

```css
@theme {
  --color-primary: var(--primary);
}

/* 이제 Tailwind에서 사용 가능 */
<div className="bg-primary text-primary-foreground">
```

## 색상 시스템

### OKLCH 색상 공간

OKLCH는 인간의 시각과 일치하는 최신 색상 공간입니다:

```css
/* 형식: oklch(명도% 채도 색상) */
--violet-600: oklch(54% 0.25 293);
--neutral-500: oklch(55.55% 0 0);
```

**장점:**
- 더 정확한 색상 표현
- 일관된 명도
- 부드러운 그라데이션
- 접근성 향상

### 색상 팔레트 구조

#### Manager Web (Violet 기반)

```css
:root {
  /* Neutral 팔레트 */
  --neutral-50: oklch(98.51% 0 0);
  --neutral-100: oklch(97.02% 0 0);
  --neutral-500: oklch(55.55% 0 0);
  --neutral-900: oklch(20.46% 0 0);

  /* Violet 팔레트 (Primary) */
  --violet-50: oklch(97% 0.02 294);
  --violet-600: oklch(54% 0.25 293);
  --violet-900: oklch(38% 0.18 294);

  /* 시맨틱 색상 */
  --primary: var(--violet-600);
  --background: var(--neutral-100);
  --foreground: var(--neutral-800);
  --border: var(--neutral-200);
}
```

#### Tenant Web (Indigo 기반)

```css
:root {
  /* Indigo 팔레트 (Primary) */
  --indigo-50: oklch(97% 0.01 270);
  --indigo-600: oklch(51% 0.20 270);
  --indigo-900: oklch(35% 0.12 270);

  /* 시맨틱 색상 */
  --primary: var(--indigo-600);
}
```

### 시맨틱 색상 변수

```css
/* 라이트 모드 */
:root {
  --background: var(--neutral-100);      /* 배경 */
  --foreground: var(--neutral-800);      /* 텍스트 */
  --card: var(--neutral-50);             /* 카드 배경 */
  --card-foreground: var(--neutral-800); /* 카드 텍스트 */
  --primary: var(--violet-600);          /* 주요 색상 */
  --primary-foreground: oklch(100% 0 0); /* 흰색 */
  --secondary: var(--neutral-200);       /* 보조 색상 */
  --muted: var(--neutral-200);           /* 약한 색상 */
  --muted-foreground: var(--neutral-500);/* 약한 텍스트 */
  --accent: var(--neutral-200);          /* 강조 색상 */
  --destructive: oklch(62.8% 0.257 29.234); /* 위험/삭제 */
  --border: var(--neutral-200);          /* 테두리 */
  --input: var(--neutral-200);           /* 입력 필드 */
  --ring: var(--violet-600);             /* 포커스 링 */
}

/* 다크 모드 */
.dark {
  --background: var(--neutral-900);
  --foreground: var(--neutral-200);
  --card: var(--neutral-800);
  --primary: var(--violet-500);          /* 밝기 조정 */
  --border: var(--neutral-700);
  /* ... */
}
```

### Sidebar 전용 색상

```css
:root {
  --sidebar: var(--neutral-50);
  --sidebar-foreground: var(--neutral-800);
  --sidebar-primary: var(--violet-600);
  --sidebar-primary-foreground: oklch(100% 0 0);
  --sidebar-accent: var(--neutral-200);
  --sidebar-border: var(--neutral-200);
  --sidebar-ring: var(--violet-600);
}
```

## 타이포그래피

### 폰트 시스템

#### Manager Web

```css
@theme {
  --font-sans: var(--font-pretendard), var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

```typescript
// layout.tsx
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
});
```

#### Tenant Web

```css
@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### 폰트 적용

```typescript
<body className="font-sans">  {/* --font-sans 자동 적용 */}
  {children}
</body>
```

### 폰트 웨이트

```css
/* DataTable에서 사용 */
.font-light { font-weight: 300; }  /* 테이블 데이터 */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }  /* 헤더, 버튼 */
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## 스크롤바 스타일링

### 기본 스크롤바

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--card);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}

::-webkit-scrollbar-thumb:active {
  background: var(--primary);
}
```

### Firefox 지원

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border) var(--card);
}
```

### Sidebar 스크롤바

```css
aside::-webkit-scrollbar {
  width: 5px;
}

aside::-webkit-scrollbar-track {
  background: var(--sidebar);
}

aside::-webkit-scrollbar-thumb {
  background: var(--sidebar-border);
  border-radius: 2.5px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: var(--sidebar-accent);
}

aside::-webkit-scrollbar-thumb:active {
  background: var(--sidebar-primary);
}
```

### Main 콘텐츠 스크롤바

```css
main::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

main::-webkit-scrollbar-track {
  background: var(--background);
}

main::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
  border: 2px solid var(--background);
  background-clip: padding-box;
}

main::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
  background-clip: padding-box;
}

main::-webkit-scrollbar-thumb:active {
  background: var(--primary);
  background-clip: padding-box;
}
```

## 다크 모드

### 구현 방법

```css
@custom-variant dark (&:is(.dark *));

.dark {
  /* 다크 모드 색상 재정의 */
  --background: var(--neutral-900);
  --foreground: var(--neutral-200);
  --primary: var(--violet-500);  /* 밝기 조정 */
  --border: var(--neutral-700);
}
```

### 사용 예시

```typescript
<div className="bg-white dark:bg-gray-800">
  라이트 모드: 흰 배경
  다크 모드: 회색 배경
</div>

<p className="text-gray-900 dark:text-white">
  자동으로 색상 전환
</p>
```

### 다크 모드 토글

```typescript
"use client";

export function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleTheme}>
      테마 전환
    </button>
  );
}
```

## 반응형 디자인

### Breakpoints

```css
/* Tailwind 기본 breakpoints */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

### 사용 예시

```typescript
<div className="
  grid grid-cols-1        /* 모바일: 1열 */
  md:grid-cols-2          /* 태블릿: 2열 */
  lg:grid-cols-4          /* 데스크톱: 4열 */
  gap-4
">
  <StatsCard />
  <StatsCard />
  <StatsCard />
  <StatsCard />
</div>
```

## 애니메이션

### 기본 애니메이션

```css
/* tw-animate-css 라이브러리 사용 */
@import "tw-animate-css";
```

### 커스텀 애니메이션

```css
@keyframes gradient {
  0%, 100% {
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
  50% {
    background-size: 200% 200%;
    background-position: 100% 50%;
  }
}

.animate-gradient {
  animation: gradient 8s ease infinite;
}
```

### 사용 예시

```typescript
<div className="animate-gradient bg-gradient-to-r from-violet-500 to-indigo-500">
  그라데이션 애니메이션
</div>
```

### Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

## 베스트 프랙티스

### ✅ DO (권장사항)

1. **CSS 변수 사용**
   ```typescript
   // ✅ 좋음: 테마 변수 사용
   <div className="bg-primary text-primary-foreground">

   // ❌ 나쁨: 하드코딩
   <div className="bg-violet-600 text-white">
   ```

2. **시맨틱 클래스 사용**
   ```typescript
   // ✅ 좋음
   <div className="bg-card text-card-foreground">

   // ❌ 나쁨
   <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
   ```

3. **일관된 spacing**
   ```typescript
   // ✅ 좋음: 4의 배수
   <div className="p-4 mt-2 mb-4">

   // ❌ 나쁨: 불규칙
   <div className="p-3 mt-1 mb-5">
   ```

4. **다크 모드 고려**
   ```typescript
   // ✅ 좋음: 다크 모드 스타일 포함
   <div className="bg-white dark:bg-gray-800">

   // ❌ 나쁨: 라이트 모드만
   <div className="bg-white">
   ```

### ❌ DON'T (피해야 할 사항)

1. **인라인 스타일 사용**
   ```typescript
   // ❌ 나쁨
   <div style={{ backgroundColor: '#8b5cf6' }}>

   // ✅ 좋음
   <div className="bg-violet-600">
   ```

2. **CSS 모듈 남용**
   ```typescript
   // ❌ 나쁨: Tailwind로 가능
   import styles from './button.module.css';
   <button className={styles.button}>

   // ✅ 좋음: Tailwind 사용
   <button className="px-4 py-2 bg-primary rounded-lg">
   ```

3. **!important 사용**
   ```css
   /* ❌ 나쁨 */
   .custom {
     color: red !important;
   }

   /* ✅ 좋음: 우선순위 활용 */
   .custom {
     @apply text-red-600;
   }
   ```

## 파일별 구조 체크리스트

### globals.css 필수 요소

- [ ] `@import "tailwindcss"`
- [ ] `@import "tw-animate-css"`
- [ ] `@custom-variant dark` 정의
- [ ] `@theme` 블록 (CSS 변수 매핑)
- [ ] `:root` 블록 (라이트 모드 변수)
- [ ] `.dark` 블록 (다크 모드 변수)
- [ ] `@layer base` (기본 스타일)
- [ ] 스크롤바 스타일링
- [ ] 폰트 설정 (`font-sans` 적용)

### 색상 변수 체크리스트

- [ ] Neutral 팔레트 (50-950)
- [ ] Primary 팔레트 (Violet/Indigo)
- [ ] 시맨틱 색상 (background, foreground, primary, etc.)
- [ ] Sidebar 색상
- [ ] Chart 색상
- [ ] 다크 모드 색상 재정의

## 마이그레이션 가이드

### Tailwind v3 → v4 마이그레이션

1. **Import 방식 변경**
   ```css
   /* v3 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* v4 */
   @import "tailwindcss";
   ```

2. **테마 정의 변경**
   ```css
   /* v3: tailwind.config.js */
   theme: {
     extend: {
       colors: { ... }
     }
   }

   /* v4: globals.css */
   @theme {
     --color-primary: var(--primary);
   }
   ```

3. **다크 모드 variant**
   ```css
   /* v4에서 필수 */
   @custom-variant dark (&:is(.dark *));
   ```

## 트러블슈팅

### 문제: 다크 모드가 작동하지 않음

**해결책:**
```css
/* @custom-variant 확인 */
@custom-variant dark (&:is(.dark *));

/* .dark 클래스가 html/body에 추가되었는지 확인 */
<html class="dark">
```

### 문제: CSS 변수가 적용되지 않음

**해결책:**
```css
/* @theme 블록에 매핑했는지 확인 */
@theme {
  --color-primary: var(--primary);
}

/* :root에 정의했는지 확인 */
:root {
  --primary: oklch(54% 0.25 293);
}
```

### 문제: 폰트가 적용되지 않음

**해결책:**
```css
/* @theme에 폰트 정의 */
@theme {
  --font-sans: var(--font-geist-sans);
}

/* body에 font-sans 적용 */
@layer base {
  body {
    @apply font-sans;
  }
}
```

## 참고 자료

- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [OKLCH 색상 공간](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/)
- [tw-animate-css](https://github.com/new-data-services/tailwindcss-animate)
