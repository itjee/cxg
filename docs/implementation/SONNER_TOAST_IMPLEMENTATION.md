# Sonner Toast 구현 완료

**작업일**: 2025-01-06  
**패키지**: sonner v2.0.7  
**상태**: ✅ 완료

---

## ✅ 완료된 작업

### 1. 패키지 설치

```bash
cd /home/itjee/workspace/cxg
pnpm add sonner -w
```

**설치된 버전**
```json
{
  "dependencies": {
    "sonner": "2.0.7"
  }
}
```

---

### 2. Layout 설정

**파일**: `apps/manager-web/src/app/layout.tsx`

```typescript
import { Toaster as Sonner } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider defaultTheme="dark">
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />                                    {/* shadcn/ui toaster */}
        <Sonner position="top-right" richColors />    {/* sonner toaster ✅ */}
      </body>
    </html>
  );
}
```

**설정 옵션**
- `position="top-right"`: 우측 상단에 표시
- `richColors`: 색상이 풍부한 토스트 (success, error 등)

---

## 📝 사용 방법

### 1. 기본 Toast

```typescript
import { toast } from 'sonner';

// 성공
toast.success('사용자가 생성되었습니다');

// 에러
toast.error('사용자 생성에 실패했습니다');

// 정보
toast.info('처리 중입니다');

// 경고
toast.warning('주의가 필요합니다');

// 기본 메시지
toast('일반 메시지입니다');
```

---

### 2. Page에서 사용

```typescript
// app/(main)/idam/users/page.tsx
'use client';

import { toast } from 'sonner';
import { useDeleteUsers } from '@/features/idam/users';

export default function UsersPage() {
  const deleteUserMutation = useDeleteUsers({
    onSuccess: () => {
      toast.success('사용자가 삭제되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '사용자 삭제에 실패했습니다');
    },
  });

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

---

### 3. Component에서 사용

```typescript
// components/users-edit.tsx
'use client';

import { toast } from 'sonner';

export function UsersEdit() {
  const createMutation = useCreateUsers({
    onSuccess: () => {
      toast.success('사용자가 추가되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '사용자 추가에 실패했습니다');
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      // toast.success는 onSuccess에서 이미 호출됨
    } catch (error) {
      // toast.error는 onError에서 이미 호출됨
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 4. 고급 사용법

```typescript
import { toast } from 'sonner';

// Promise Toast (로딩 → 성공/실패)
toast.promise(
  fetchData(),
  {
    loading: '로딩 중...',
    success: (data) => `${data.name}을(를) 불러왔습니다`,
    error: '데이터를 불러오는데 실패했습니다',
  }
);

// 커스텀 Duration
toast.success('메시지', {
  duration: 5000, // 5초
});

// Action 버튼 포함
toast('파일이 준비되었습니다', {
  action: {
    label: '다운로드',
    onClick: () => downloadFile(),
  },
});

// 취소 가능한 Toast
const toastId = toast.loading('처리 중...');
// 나중에 업데이트
toast.success('완료되었습니다', { id: toastId });
// 또는 취소
toast.dismiss(toastId);

// Description 포함
toast.success('업로드 완료', {
  description: '3개의 파일이 성공적으로 업로드되었습니다',
});
```

---

## 🎨 스타일 커스터마이징

### 1. 위치 변경

```typescript
<Sonner 
  position="top-center"     // 상단 중앙
  position="top-right"      // 우측 상단 (기본)
  position="bottom-center"  // 하단 중앙 (tenants-web)
  position="bottom-right"   // 우측 하단
/>
```

### 2. 테마 설정

```typescript
<Sonner 
  theme="dark"              // 다크 모드
  theme="light"             // 라이트 모드
  richColors                // 풍부한 색상 (권장)
/>
```

### 3. 표시 개수 제한

```typescript
<Sonner 
  visibleToasts={5}         // 최대 5개까지 표시
  expand={true}             // 마우스 오버 시 확장
/>
```

---

## 🔄 기존 코드 마이그레이션

### Shadcn Toast → Sonner

**Before (shadcn/ui)**
```typescript
import { useToast } from "@/components/ui/use-toast";

function Component() {
  const { toast } = useToast();
  
  toast({
    title: "성공",
    description: "작업이 완료되었습니다",
    variant: "default",
  });
}
```

**After (sonner)**
```typescript
import { toast } from 'sonner';

function Component() {
  toast.success('작업이 완료되었습니다', {
    description: '성공',
  });
}
```

---

## 📊 이미 적용된 페이지

### Manager-Web
```typescript
// ✅ app/(main)/auto/workflows/page.tsx
import { toast } from 'sonner';
toast.success('워크플로우가 삭제되었습니다');

// ✅ app/(main)/idam/users/page.tsx
import { toast } from 'sonner';
toast.success('사용자가 삭제되었습니다');

// ✅ app/(main)/idam/roles/page.tsx
import { toast } from 'sonner';
toast.success('역할이 삭제되었습니다');

// ✅ app/(main)/idam/permissions/page.tsx
import { toast } from 'sonner';
toast.success('권한이 삭제되었습니다');

// ✅ app/(main)/idam/access-logs/page.tsx
import { toast } from 'sonner';
toast.success('접근 로그가 삭제되었습니다');
```

---

## 🆚 Sonner vs Shadcn Toast

| 항목 | Sonner | Shadcn Toast |
|------|--------|--------------|
| **사용 편의성** | ⭐⭐⭐⭐⭐ 매우 쉬움 | ⭐⭐⭐ 보통 |
| **코드량** | 한 줄 | 여러 줄 필요 |
| **애니메이션** | 부드러움 | 기본적 |
| **Promise 지원** | ✅ | ❌ |
| **Action 버튼** | ✅ | ✅ |
| **스택 관리** | ✅ 자동 | ❌ |
| **TypeScript** | ✅ 완전 지원 | ✅ |

**권장**: Sonner 사용 (더 간단하고 강력함)

---

## 💡 Best Practices

### 1. Mutation Callbacks에서 사용

```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    toast.success('사용자가 생성되었습니다');
    queryClient.invalidateQueries(['users']);
  },
  onError: (error) => {
    toast.error(error.message || '생성에 실패했습니다');
  },
});
```

### 2. Try-Catch에서 사용

```typescript
try {
  await deleteUser(id);
  toast.success('삭제되었습니다');
} catch (error) {
  toast.error(error instanceof Error ? error.message : '삭제 실패');
}
```

### 3. Promise Toast 활용

```typescript
toast.promise(
  apiCall(),
  {
    loading: '처리 중...',
    success: '완료되었습니다',
    error: (err) => `에러: ${err.message}`,
  }
);
```

### 4. 조건부 Toast

```typescript
if (result.success) {
  toast.success('성공');
} else {
  toast.error('실패');
}
```

---

## 📚 참고

### 공식 문서
- [Sonner GitHub](https://github.com/emilkowalski/sonner)
- [Sonner Demo](https://sonner.emilkowal.ski/)

### 설정 파일
- `apps/manager-web/src/app/layout.tsx` - Manager-Web Toaster 설정
- `apps/tenants-web/src/app/layout.tsx` - Tenants-Web Toaster 설정 (참고)

### 예제 코드
- `apps/manager-web/src/app/(main)/idam/users/page.tsx`
- `apps/tenants-web/src/app/(main)/sys/users/page.tsx` (참고)

---

## ✅ 체크리스트

- [x] sonner 패키지 설치
- [x] Layout에 Toaster 추가
- [x] IDAM 페이지에 toast 적용
- [x] Auto 페이지에 toast 적용
- [x] TypeScript 에러 없음
- [x] 문서 작성

---

**완료**: 2025-01-06  
**패키지**: sonner@2.0.7  
**적용 범위**: manager-web 전체  
**상태**: ✅ 프로덕션 준비 완료
