# Manager-Web 인증 구조 리팩토링 완료

**작성일**: 2025-01-06  
**작업 범위**: Manager-Web auth 로직 features/auth로 이동  
**목적**: Tenants-Web과 동일한 구조로 통일

---

## ✅ 변경 사항

### 1. 파일 이동

#### Before (기존 구조)
```
apps/manager-web/src/
├── stores/
│   └── auth.store.ts                    ❌ 이전 위치
├── components/
│   └── providers/
│       └── auth-provider.tsx            ❌ 이전 위치
└── features/
    └── auth/
        ├── components/
        ├── hooks/
        ├── services/
        └── types/
```

#### After (새 구조)
```
apps/manager-web/src/
├── stores/
│   ├── auth.store.ts.old                 # 백업
│   └── auth.store.ts.deprecated          # Re-export (하위 호환성)
├── components/
│   └── providers/
│       └── auth-provider.tsx.old         # 백업
└── features/
    └── auth/
        ├── components/
        │   ├── login-form.tsx
        │   ├── signup-form.tsx
        │   ├── forgot-password-form.tsx
        │   └── reset-password-form.tsx
        ├── hooks/
        │   ├── use-auth.ts
        │   └── use-reset-password.ts
        ├── services/
        │   └── auth.service.ts
        ├── types/
        │   ├── auth.types.ts
        │   └── reset-password.types.ts
        ├── stores/                        ✅ 새로 이동
        │   └── auth.store.ts
        ├── providers/                     ✅ 새로 이동
        │   └── auth-provider.tsx
        └── index.ts                       ✅ 업데이트
```

---

## 📝 수정된 파일

### 1. features/auth/stores/auth.store.ts
```typescript
// Before
import type { UserResponse } from "@/lib/api/auth";
import * as authApi from "@/lib/api/auth";

// After
import type { User } from "../types/auth.types";
import { authService } from "../services/auth.service";
```

**변경 내용:**
- ✅ `UserResponse` → `User` (타입 통일)
- ✅ `authApi.*` → `authService.*` (서비스 레이어로 통일)
- ✅ 상대 경로 import로 변경

---

### 2. features/auth/providers/auth-provider.tsx
```typescript
// Before
import { useAuthStore } from "@/stores/auth.store";

// After
import { useAuthStore } from "../stores/auth.store";
```

**변경 내용:**
- ✅ 상대 경로 import로 변경

---

### 3. features/auth/index.ts
```typescript
/**
 * Auth feature exports
 */

// Components
export { LoginForm } from "./components/login-form";
export { SignupForm } from "./components/signup-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";

// Providers ✅ 추가
export { AuthProvider } from "./providers/auth-provider";

// Stores ✅ 추가
export { useAuthStore } from "./stores/auth.store";

// Hooks
export { useAuth } from "./hooks/use-auth";
export { useResetPassword } from "./hooks/use-reset-password";

// Services
export { authService } from "./services/auth.service";

// Types
export type {
  SigninRequest,
  SignupRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  ApiError,
  EnvelopeResponse,
} from "./types/auth.types";

export type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./types/reset-password.types";
```

---

### 4. 전역 Import 경로 수정

#### features/auth/hooks/use-auth.ts
```typescript
// Before
import { useAuthStore } from "@/stores/auth.store";

// After
import { useAuthStore } from "@/features/auth";
```

#### app/(auth)/logout/page.tsx
```typescript
// Before
import { useAuthStore } from "@/stores/auth.store";

// After
import { useAuthStore } from "@/features/auth";
```

#### components/layout/header.tsx
```typescript
// Before
import { useAuthStore } from "@/stores/auth.store";

// After
import { useAuthStore } from "@/features/auth";
```

#### app/layout.tsx
```typescript
// Before
import { AuthProvider } from "@/components/providers/auth-provider";

// After
import { AuthProvider } from "@/features/auth";
```

---

## 🎯 사용 방법

### 인증 스토어 사용
```typescript
// Before (deprecated)
import { useAuthStore } from "@/stores/auth.store";

// After (권장)
import { useAuthStore } from "@/features/auth";
```

### AuthProvider 사용
```typescript
// Before (deprecated)
import { AuthProvider } from "@/components/providers/auth-provider";

// After (권장)
import { AuthProvider } from "@/features/auth";
```

### 통합 import
```typescript
// 한 곳에서 모든 auth 관련 항목 import 가능
import { 
  useAuthStore, 
  AuthProvider, 
  useAuth, 
  authService,
  type User,
  type TokenResponse 
} from "@/features/auth";
```

---

## 📊 Tenants-Web과의 구조 비교

| 항목 | Tenants-Web | Manager-Web | 상태 |
|------|-------------|-------------|------|
| **features/auth/components/** | ✅ | ✅ | 동일 |
| **features/auth/hooks/** | ✅ | ✅ | 동일 |
| **features/auth/services/** | ✅ | ✅ | 동일 |
| **features/auth/types/** | ✅ | ✅ | 동일 |
| **features/auth/stores/** | ✅ | ✅ | ✅ 추가됨 |
| **features/auth/providers/** | ✅ | ✅ | ✅ 추가됨 |
| **features/auth/index.ts** | ✅ | ✅ | 동일 |

**결과**: ✅ 완전히 동일한 구조로 통일

---

## 🔄 하위 호환성

기존 import 경로도 계속 작동합니다 (deprecated):

```typescript
// 여전히 작동함 (하지만 경고 표시)
import { useAuthStore } from "@/stores/auth.store";
import { AuthProvider } from "@/components/providers/auth-provider";
```

`stores/auth.store.ts.deprecated` 파일에서 re-export하여 하위 호환성 유지:
```typescript
/**
 * @deprecated
 * 이 파일은 더 이상 사용되지 않습니다.
 * 대신 @/features/auth를 사용하세요.
 */
export { useAuthStore } from "@/features/auth";
```

---

## 🧹 정리 작업

### 백업된 파일 (나중에 삭제 가능)
- ✅ `stores/auth.store.ts.old`
- ✅ `components/providers/auth-provider.tsx.old`
- ✅ `stores/auth.store.ts.deprecated` (하위 호환성용, 추후 제거)

### 삭제 대상 (버전 업그레이드 시)
```bash
# 기존 파일 완전 삭제 (주의: 하위 호환성 없어짐)
rm apps/manager-web/src/stores/auth.store.ts.old
rm apps/manager-web/src/stores/auth.store.ts.deprecated
rm apps/manager-web/src/components/providers/auth-provider.tsx.old
```

---

## ✨ 장점

### 1. 일관성
- ✅ Tenants-Web과 Manager-Web 구조 동일
- ✅ 개발자 혼란 감소
- ✅ 코드 리뷰 효율성 증가

### 2. 모듈화
- ✅ Auth 관련 모든 코드가 features/auth 안에
- ✅ 캡슐화 (내부 의존성 명확)
- ✅ 재사용성 향상

### 3. 확장성
- ✅ 새로운 auth 기능 추가 용이
- ✅ 테스트 구성 간소화
- ✅ 독립적인 배포 가능

---

## 📚 관련 문서

- `/docs/04_api/MULTI_TENANT_AUTH_STRATEGY.md` - 멀티테넌트 인증 전략
- `/docs/implementation/USER_INVITATION_IMPLEMENTATION.md` - 사용자 초대 구현

---

**작업 완료**: 2025-01-06  
**다음 단계**: 
1. ✅ 기존 import 경로 사용 코드 점진적으로 업데이트
2. ⚠️ 충분한 테스트 후 백업 파일 삭제
3. 📝 팀 공지 및 마이그레이션 가이드 배포
