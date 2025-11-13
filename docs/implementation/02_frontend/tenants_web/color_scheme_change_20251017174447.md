# tenants-web 색상 체계 변경

**작성일시**: 2025-10-17 17:44:47

## 변경 개요

tenants-web의 모든 페이지에서 주요 색상을 blue 계열에서 indigo 계열로 변경하여 일관된 브랜드 색상을 적용했습니다.

## 변경 내용

### 1. 색상 변경 내역

- **기존**: `blue-50` ~ `blue-900`
- **변경**: `indigo-50` ~ `indigo-900`
- **보조색**: `cyan-*` → `purple-*` (그라데이션 효과용)

### 2. 적용 범위

#### 마케팅 페이지
- `src/app/(marketing)/page.tsx` - 메인 홈페이지
- `src/app/(marketing)/features/page.tsx` - 기능 소개 페이지
- `src/app/(marketing)/pricing/page.tsx` - 가격 안내 페이지
- `src/app/(marketing)/contact/page.tsx` - 문의 페이지
- `src/app/(marketing)/layout.tsx` - 마케팅 레이아웃

#### 인증 페이지
- `src/app/(auth)/signin/page.tsx` - 로그인 페이지
- `src/app/(auth)/signup/page.tsx` - 회원가입 페이지
- `src/app/(auth)/layout.tsx` - 인증 레이아웃

#### 메인 애플리케이션
- `src/app/(main)/layout.tsx` - 메인 레이아웃
- `src/app/(main)/overview/page.tsx` - 개요 페이지

### 3. 변경된 색상 팔레트

globals.css에 이미 정의되어 있던 indigo 팔레트 활용:

```css
--indigo-50: oklch(0.96 0.02 272);
--indigo-100: oklch(0.93 0.03 273);
--indigo-200: oklch(0.87 0.06 274);
--indigo-300: oklch(0.79 0.10 275);
--indigo-400: oklch(0.68 0.16 277);
--indigo-500: oklch(0.59 0.20 277);
--indigo-600: oklch(0.51 0.23 277);
--indigo-700: oklch(0.46 0.21 277);
--indigo-800: oklch(0.40 0.18 277);
--indigo-900: oklch(0.36 0.14 279);
--indigo-950: oklch(0.26 0.09 281);
```

### 4. 주요 변경 사항

#### 그라데이션 효과
- **이전**: `from-blue-600 to-cyan-600`
- **변경**: `from-indigo-600 to-purple-600`

#### 버튼 색상
- **이전**: `bg-blue-600 hover:bg-blue-700`
- **변경**: `bg-indigo-600 hover:bg-indigo-700`

#### 텍스트 색상
- **이전**: `text-blue-600`
- **변경**: `text-indigo-600`

#### 보더 색상
- **이전**: `border-blue-600`
- **변경**: `border-indigo-600`

## 브랜드 일관성

이 변경으로 다음 브랜딩 요소와 일관성을 유지합니다:

1. **ConnexGrow** 브랜드 색상 (indigo 기반)
2. **CXG** 철학 (Connect, Experience, Grow) 시각화
3. globals.css의 primary 색상 설정과 동일

## 기술적 영향

- ✅ 모든 페이지 정상 작동
- ✅ Tailwind CSS 색상 팔레트 사용
- ✅ 다크모드 호환
- ✅ 접근성 유지 (충분한 대비 비율)

## 테스트 확인 사항

- [x] 메인 페이지 렌더링
- [x] 기능/가격/문의 페이지 색상 적용
- [x] 버튼 호버 효과
- [x] 그라데이션 배경
- [x] 개발 서버 정상 작동

## 관련 파일

```
apps/tenants-web/
├── src/app/
│   ├── (marketing)/
│   │   ├── page.tsx           ✓ 변경
│   │   ├── features/page.tsx  ✓ 변경
│   │   ├── pricing/page.tsx   ✓ 변경
│   │   ├── contact/page.tsx   ✓ 변경
│   │   └── layout.tsx         ✓ 변경
│   ├── (auth)/
│   │   ├── signin/page.tsx    ✓ 변경
│   │   ├── signup/page.tsx    ✓ 변경
│   │   └── layout.tsx         ✓ 변경
│   ├── (main)/
│   │   ├── overview/page.tsx  ✓ 변경
│   │   └── layout.tsx         ✓ 변경
│   └── globals.css            (기존 indigo 팔레트 활용)
```

## 향후 작업

- [ ] 추가 페이지 생성 시 indigo 색상 사용
- [ ] 컴포넌트 라이브러리 생성 시 indigo 기본 색상 적용
- [ ] 다크모드에서 색상 최적화 검토
