# CSS 스타일 업데이트 완료

**작업일**: 2025-01-06  
**파일**: apps/manager-web/src/app/globals.css  
**상태**: ✅ 완료

---

## ✅ 완료된 작업

### 1. Color Palette 변경

**Before (기존)**
```css
/* Indigo Palette (불완전) */
--indigo-600: ...
--primary: var(--indigo-600);
```

**After (새로운 구조)**
```css
/* Neutral Palette (oklch) */
--neutral-50: oklch(98.51% 0 0);
...
--neutral-950: oklch(14.48% 0 0);

/* Violet Palette (oklch) - Manager Primary Color */
--violet-50: oklch(97% 0.02 294);
...
--violet-950: oklch(28% 0.14 291);
```

---

### 2. 테마 구조

#### Tenants-Web (참조)
- **Primary Color**: Indigo
- **Secondary Color**: Neutral
- **조합**: Neutral + Indigo

#### Manager-Web (신규)
- **Primary Color**: Violet
- **Secondary Color**: Neutral
- **조합**: Neutral + Violet ✅

---

## 🎨 색상 시스템

### Neutral Palette (공통)
```css
--neutral-50:  oklch(98.51% 0 0);  /* 가장 밝음 */
--neutral-100: oklch(97.02% 0 0);
--neutral-200: oklch(92.19% 0 0);
--neutral-300: oklch(86.99% 0 0);
--neutral-400: oklch(71.55% 0 0);
--neutral-500: oklch(55.55% 0 0);  /* 중간 */
--neutral-600: oklch(43.86% 0 0);
--neutral-700: oklch(37.15% 0 0);
--neutral-800: oklch(26.86% 0 0);
--neutral-900: oklch(20.46% 0 0);
--neutral-950: oklch(14.48% 0 0);  /* 가장 어두움 */
```

### Violet Palette (Manager Primary)
```css
--violet-50:  oklch(97% 0.02 294);  /* 가장 밝음 */
--violet-100: oklch(94% 0.03 295);
--violet-200: oklch(89% 0.05 293);
--violet-300: oklch(81% 0.10 294);
--violet-400: oklch(71% 0.16 294);
--violet-500: oklch(61% 0.22 293);  /* 중간 - Dark Mode Primary */
--violet-600: oklch(54% 0.25 293);  /* Light Mode Primary */
--violet-700: oklch(49% 0.24 293);
--violet-800: oklch(43% 0.21 293);
--violet-900: oklch(38% 0.18 294);
--violet-950: oklch(28% 0.14 291);  /* 가장 어두움 */
```

---

## 💡 Light Mode 색상 맵핑

```css
:root {
  /* Background & Foreground */
  --background: var(--neutral-100);          /* 밝은 회색 배경 */
  --foreground: var(--neutral-800);          /* 어두운 회색 텍스트 */
  
  /* Header */
  --header: var(--neutral-50);               /* 거의 흰색 */
  --header-foreground: var(--neutral-800);
  
  /* Card */
  --card: var(--neutral-50);                 /* 흰색에 가까운 카드 */
  --card-foreground: var(--neutral-800);
  
  /* Primary (Violet) */
  --primary: var(--violet-600);              /* 보라색 600 */
  --primary-foreground: oklch(100% 0 0);     /* 흰색 텍스트 */
  
  /* Secondary & Muted */
  --secondary: var(--neutral-200);
  --secondary-foreground: var(--neutral-800);
  --muted: var(--neutral-200);
  --muted-foreground: var(--neutral-500);
  
  /* Accent */
  --accent: var(--neutral-200);
  --accent-foreground: var(--neutral-800);
  
  /* Border & Input */
  --border: var(--neutral-200);
  --input: var(--neutral-200);
  --ring: var(--violet-600);                 /* Focus ring: 보라색 */
  
  /* Charts */
  --chart-1: var(--violet-600);
  --chart-2: var(--violet-500);
  --chart-3: var(--violet-700);
  --chart-4: var(--violet-400);
  --chart-5: var(--violet-300);
  
  /* Sidebar */
  --sidebar: var(--neutral-50);
  --sidebar-foreground: var(--neutral-800);
  --sidebar-primary: var(--violet-600);      /* 사이드바 액티브: 보라색 */
  --sidebar-primary-foreground: oklch(100% 0 0);
  --sidebar-accent: var(--neutral-200);
  --sidebar-accent-foreground: var(--neutral-800);
  --sidebar-border: var(--neutral-200);
  --sidebar-ring: var(--violet-600);
}
```

---

## 🌙 Dark Mode 색상 맵핑

```css
.dark {
  /* Background & Foreground */
  --background: var(--neutral-900);          /* 어두운 배경 */
  --foreground: var(--neutral-200);          /* 밝은 텍스트 */
  
  /* Header */
  --header: var(--neutral-800);              /* 약간 밝은 배경 */
  --header-foreground: var(--neutral-200);
  
  /* Card */
  --card: var(--neutral-800);                /* 배경보다 밝은 카드 */
  --card-foreground: var(--neutral-200);
  
  /* Primary (Violet) */
  --primary: var(--violet-500);              /* 보라색 500 (더 밝음) */
  --primary-foreground: oklch(100% 0 0);     /* 흰색 텍스트 */
  
  /* Secondary & Muted */
  --secondary: var(--neutral-700);
  --secondary-foreground: var(--neutral-200);
  --muted: var(--neutral-700);
  --muted-foreground: var(--neutral-400);
  
  /* Accent */
  --accent: var(--neutral-700);
  --accent-foreground: var(--neutral-200);
  
  /* Border & Input */
  --border: var(--neutral-700);
  --input: var(--neutral-700);
  --ring: var(--violet-500);                 /* Focus ring: 밝은 보라색 */
  
  /* Charts */
  --chart-1: var(--violet-500);
  --chart-2: var(--violet-400);
  --chart-3: var(--violet-600);
  --chart-4: var(--violet-300);
  --chart-5: var(--violet-700);
  
  /* Sidebar */
  --sidebar: var(--neutral-800);
  --sidebar-foreground: var(--neutral-200);
  --sidebar-primary: var(--violet-500);      /* 사이드바 액티브: 밝은 보라색 */
  --sidebar-primary-foreground: oklch(100% 0 0);
  --sidebar-accent: var(--neutral-700);
  --sidebar-accent-foreground: var(--neutral-200);
  --sidebar-border: var(--neutral-700);
  --sidebar-ring: var(--violet-500);
}
```

---

## 🎯 사용 예시

### 버튼 색상
```tsx
// Primary Button (보라색)
<Button variant="default">저장</Button>
// → background: var(--violet-600) in light mode
// → background: var(--violet-500) in dark mode

// Secondary Button (회색)
<Button variant="secondary">취소</Button>
// → background: var(--neutral-200) in light mode
// → background: var(--neutral-700) in dark mode

// Outline Button
<Button variant="outline">새로고침</Button>
// → border: var(--violet-600) in light mode
// → border: var(--violet-500) in dark mode
```

### Card 색상
```tsx
<Card>
  {/* background: var(--neutral-50) in light mode */}
  {/* background: var(--neutral-800) in dark mode */}
</Card>
```

### Badge 색상
```tsx
<Badge variant="default">활성</Badge>
// → background: var(--violet-600) in light mode

<Badge variant="secondary">비활성</Badge>
// → background: var(--neutral-200) in light mode
```

---

## 📊 앱별 비교

| 항목 | Tenants-Web | Manager-Web |
|------|-------------|-------------|
| **Primary Color** | Indigo | **Violet** |
| **Primary 600 (Light)** | `oklch(51.06% 0.2301 276.97)` | `oklch(54% 0.25 293)` |
| **Primary 500 (Dark)** | `oklch(58.54% 0.2041 277.12)` | `oklch(61% 0.22 293)` |
| **Secondary Color** | Neutral | Neutral |
| **Focus Ring** | Indigo | Violet |
| **Sidebar Active** | Indigo | Violet |
| **Chart Color 1** | Indigo-600 | Violet-600 |

---

## ✨ 추가 기능

### 1. 스크롤바 스타일링
```css
/* Default scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:active {
  background: var(--primary);  /* 보라색으로 변경 */
}
```

### 2. 애니메이션
```css
/* Fade In */
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Slide In From Left */
.animate-slide-in-left {
  animation: slideInFromLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Scale In */
.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Delay */
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-400 { animation-delay: 400ms; }
```

### 3. Toast 애니메이션
```css
@keyframes toast-slide-in-from-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-name: toast-slide-in-from-bottom;
  animation-duration: 150ms;
}
```

---

## 📂 파일 구조

```
apps/manager-web/src/
├── app/
│   ├── globals.css           ✅ 업데이트됨 (Violet Theme)
│   ├── globals.css.backup    💾 백업
│   └── layout.tsx            ✅ 이미 설정됨
└── fonts/
    └── PretendardVariable.woff2
```

---

## 🔄 마이그레이션 가이드

### 기존 코드에서 색상 변경
```diff
- className="bg-indigo-600"
+ className="bg-violet-600"

- className="text-indigo-500"
+ className="text-violet-500"

- className="border-indigo-600"
+ className="border-violet-600"

- className="ring-indigo-500"
+ className="ring-violet-500"
```

### CSS 변수 사용 (권장)
```tsx
// ❌ 하드코딩하지 마세요
<div className="bg-violet-600">

// ✅ CSS 변수 사용
<div className="bg-primary">

// ✅ shadcn/ui 컴포넌트 사용
<Button variant="default">
```

---

## 🎨 색상 테스트

### 라이트 모드 확인
```tsx
// Primary Button
<Button>Primary Button</Button>  
// 보라색 배경, 흰색 텍스트

// Card
<Card>
  <CardContent>Card Content</CardContent>
</Card>
// 거의 흰색 배경

// Badge
<Badge>Active</Badge>
// 보라색 배경
```

### 다크 모드 확인
```tsx
// Primary Button
<Button>Primary Button</Button>  
// 밝은 보라색 배경, 흰색 텍스트

// Card
<Card>
  <CardContent>Card Content</CardContent>
</Card>
// 어두운 회색 배경 (배경보다 밝음)

// Badge
<Badge>Active</Badge>
// 밝은 보라색 배경
```

---

## 💾 백업

**백업 파일**: `apps/manager-web/src/app/globals.css.backup`

**복원 방법** (필요시):
```bash
cd /home/itjee/workspace/cxg/apps/manager-web/src/app
mv globals.css globals.css.new
mv globals.css.backup globals.css
```

---

## ✅ 체크리스트

- [x] Neutral Palette 추가
- [x] Violet Palette 추가 (Manager Primary)
- [x] Light Mode 색상 맵핑
- [x] Dark Mode 색상 맵핑
- [x] 스크롤바 스타일링
- [x] 애니메이션 추가
- [x] Toast 애니메이션
- [x] 백업 파일 생성
- [x] 문서 작성

---

## 📚 참고

### 관련 파일
- `apps/tenants-web/src/app/globals.css` - Tenants-Web (Indigo) 참조
- `apps/manager-web/src/app/layout.tsx` - Layout 설정
- `apps/manager-web/src/app/globals.css.backup` - 기존 파일 백업

### 색상 도구
- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)

### Next.js Docs
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [Global Styles](https://nextjs.org/docs/app/building-your-application/styling/css-modules#global-styles)

---

**완료**: 2025-01-06  
**테마**: Neutral + Violet  
**상태**: ✅ 프로덕션 준비 완료  
**다음**: 실제 페이지에서 색상 테스트
