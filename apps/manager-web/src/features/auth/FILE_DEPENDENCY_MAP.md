# Auth Feature 파일 의존성 맵

## 🔗 파일 의존성 그래프

### 수평 의존성 (같은 계층)

```
Components Layer:
┌─────────────────────────────────────────────────────────────┐
│ login-form.tsx    signup-form.tsx    forgot-password-form    │
│ reset-password-form.tsx           (components/index.ts 전체) │
└──────────────┬──────────────────────────────────────────────┘
               │ 모두 동일한 훅 사용
               ▼
```

### 수직 의존성 (계층 간)

```
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT LAYER                                             │
│ login-form.tsx, signup-form.tsx, forgot-password-form.tsx   │
│ reset-password-form.tsx                                     │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ import { useAuth, useResetPassword } from "../hooks"
               ▼
┌──────────────────────────────────────────────────────────────┐
│ UI LOGIC HOOK LAYER                                         │
│ use-auth.ts (로그인, 로그아웃, 회원가입)                    │
│ use-reset-password.ts (비밀번호 찾기/재설정)               │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ import { useAuthStore } from "../stores"
               │ import { useRouter } from "next/navigation"
               ▼
┌──────────────────────────────────────────────────────────────┐
│ STATE MANAGEMENT LAYER (Zustand)                            │
│ auth.store.ts                                               │
│ - state: user, accessToken, refreshToken, isAuthenticated   │
│ - actions: login, register, logout, refreshAuth, setTokens │
│ - middleware: persist (localStorage)                        │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ import { authService } from "../services"
               │ import { setCookie, deleteCookie } from "@/lib/utils/cookies"
               ▼
┌──────────────────────────────────────────────────────────────┐
│ API SERVICE LAYER                                           │
│ auth.service.ts                                             │
│ - signin(data): 로그인                                      │
│ - signup(data): 회원가입                                    │
│ - getCurrentUser(): 사용자 정보 조회                        │
│ - refreshToken(token): 토큰 갱신                            │
│ - logout(): 로그아웃                                        │
│ - changePassword(): 비밀번호 변경                           │
│ - forgotPassword(): 비밀번호 찾기                           │
│ - resetPassword(): 비밀번호 재설정                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ import { apolloClient } from "@/lib/apollo-client"
               │ import { SIGNIN, SIGNUP, ... } from "../graphql"
               │ - mapTokenResponse(): GraphQL → REST 변환
               │ - mapUser(): GraphQL → REST 변환
               ▼
┌──────────────────────────────────────────────────────────────┐
│ GRAPHQL OPERATIONS LAYER                                    │
│ mutations.ts (7개 뮤테이션)                                  │
│ - SIGNIN: 로그인                                            │
│ - SIGNUP: 회원가입                                          │
│ - REFRESH_TOKEN: 토큰 갱신                                  │
│ - LOGOUT: 로그아웃                                          │
│ - CHANGE_PASSWORD: 비밀번호 변경                            │
│ - FORGOT_PASSWORD: 비밀번호 찾기                            │
│ - RESET_PASSWORD: 비밀번호 재설정                           │
│                                                             │
│ queries.ts (1개 쿼리)                                       │
│ - GET_CURRENT_USER: 현재 사용자 정보                        │
│                                                             │
│ use-auth.hooks.ts (Apollo Hooks 래퍼 - 현재 미사용)        │
│ - useSignin, useSignup, useRefreshToken, ...               │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ apolloClient.mutate()
               │ apolloClient.query()
               ▼
┌──────────────────────────────────────────────────────────────┐
│ APOLLO CLIENT (@/lib/apollo-client.ts)                      │
│ - HTTP Link: http://localhost:8100/graphql                  │
│ - Auth Link: 토큰 자동 주입                                 │
│ - Error Link: 401 처리                                      │
│ - Cache: Apollo InMemoryCache                               │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ HTTP Request
               ▼
┌──────────────────────────────────────────────────────────────┐
│ BACKEND GraphQL API                                         │
│ (Python/Strawberry - /manager/auth/)                        │
└──────────────────────────────────────────────────────────────┘
```

## 📦 타입 정의 흐름

```
┌─────────────────────────────────────────────────────────┐
│ types/auth.types.ts                                     │
│ - SigninRequest (username, password)                    │
│ - SignupRequest (username, email, password, full_name)  │
│ - TokenResponse (access_token, refresh_token, ...)      │
│ - User (id, username, email, full_name, ...)           │
│ - ApiError, EnvelopeResponse                           │
└────────────┬────────────────────────────────────────────┘
             │
             │ imported by
             ├─→ types/index.ts
             ├─→ services/auth.service.ts
             ├─→ stores/auth.store.ts
             └─→ hooks/use-auth.ts

┌─────────────────────────────────────────────────────────┐
│ types/reset-password.types.ts                           │
│ - ForgotPasswordRequest (email)                          │
│ - ForgotPasswordResponse (message, reset_token?)         │
│ - ResetPasswordRequest (token, new_password, username?)  │
│ - ResetPasswordResponse (message)                        │
└────────────┬────────────────────────────────────────────┘
             │
             │ imported by
             ├─→ types/index.ts
             ├─→ services/auth.service.ts
             ├─→ hooks/use-reset-password.ts
             └─→ components/forgot-password-form.tsx
```

## 🔄 데이터 흐름 예시: 로그인

```
1. USER INPUT
   ┌────────────────────────────────┐
   │ LoginForm.tsx                  │
   │ username: "admin"              │
   │ password: "Admin1234!"         │
   └────────┬───────────────────────┘

2. COMPONENT CALLS HOOK
   ├─ onClick → handleSubmit()
   └─ signin(username, password) // from useAuth()

3. HOOK MANAGES UI STATE & CALLS STORE
   ├─ setIsLoading(true)
   ├─ try {
   │   └─ await useAuthStore.login(username, password)
   ├─ } catch (err) {
   │   └─ setError(errorMessage)
   └─ } finally { setIsLoading(false) }

4. STORE CALLS SERVICE
   ├─ authService.signin({ username, password })
   └─ (updates state on success)

5. SERVICE CALLS GraphQL
   ├─ apolloClient.mutate({
   │   mutation: SIGNIN,
   │   variables: { input: { username, password } }
   │ })
   ├─ GraphQL Response (camelCase):
   │   {
   │     accessToken: "jwt...",
   │     refreshToken: "jwt...",
   │     tokenType: "bearer",
   │     expiresIn: 3600
   │   }
   └─ mapTokenResponse() → REST format (snake_case)

6. SERVICE CALLS ANOTHER GraphQL QUERY
   ├─ apolloClient.query({
   │   query: GET_CURRENT_USER
   │ })
   └─ Returns User object

7. STORE UPDATES STATE
   ├─ localStorage.setItem("access_token", token)
   ├─ setCookie("access_token", token, 7)
   ├─ set({
   │   accessToken,
   │   refreshToken,
   │   user,
   │   isAuthenticated: true
   │ })
   └─ (persisted via persist middleware)

8. HOOK GETS STATE UPDATE
   ├─ useAuthStore 재렌더링
   └─ if (success) { router.push("/core/dashboard") }

9. COMPONENT RE-RENDERS
   └─ (isLoading false, error null) → 로그인 완료
```

## 📊 의존성 강도

### 강한 의존성 (변경 시 영향 큼)
```
services/auth.service.ts
  ← stores/auth.store.ts (직접 호출)
  ← hooks/use-auth.ts (간접)

graphql/mutations.ts, queries.ts
  ← services/auth.service.ts (직접 호출)

types/auth.types.ts
  ← services/auth.service.ts (타입)
  ← stores/auth.store.ts (타입)
```

### 약한 의존성 (변경 시 영향 적음)
```
components/*.tsx
  ← hooks/*.ts (의존하지만 내부 구현 몰라도 됨)

hooks/*.ts
  ← stores/*.ts (인터페이스만 알면 됨)

graphql/use-auth.hooks.ts
  ← (현재 미사용)
```

## 🔍 파일별 역할 상세

### components/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| login-form.tsx | 로그인 UI | ✅ 사용중 | useAuth |
| signup-form.tsx | 회원가입 UI | ✅ 사용중 | useAuth |
| forgot-password-form.tsx | 비밀번호 찾기 UI | ✅ 사용중 | useResetPassword |
| reset-password-form.tsx | 비밀번호 재설정 UI | ✅ 사용중 | useResetPassword |
| index.ts | export 허브 | ✅ 필수 | (모든 컴포넌트) |

### hooks/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| use-auth.ts | 로그인/로그아웃 로직 | ✅ 사용중 | useAuthStore, useRouter |
| use-reset-password.ts | 비밀번호 로직 | ✅ 사용중 | authService, useRouter |
| index.ts | export 허브 | ✅ 필수 | (모든 훅) |

### stores/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| auth.store.ts | 글로벌 상태 | ✅ 필수 | authService, zustand, cookies |
| index.ts | export 허브 | ✅ 필수 | auth.store.ts |

### services/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| auth.service.ts | GraphQL API | ✅ 필수 | apolloClient, graphql/*, types/* |
| index.ts | export 허브 | ✅ 필수 | auth.service.ts |

### graphql/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| mutations.ts | GraphQL 뮤테이션 | ✅ 필수 | @apollo/client, gql |
| queries.ts | GraphQL 쿼리 | ✅ 필수 | @apollo/client, gql |
| use-auth.hooks.ts | Apollo Hooks | ⚠️ 미사용 | @apollo/client, mutations, queries |
| index.ts | export 허브 | ✅ 필수 | mutations, queries, use-auth.hooks |

### providers/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| auth-provider.tsx | 초기화 | ✅ 필수 | useAuthStore, cookies |

### types/
| 파일 | 용도 | 상태 | 의존성 |
|-----|------|------|-------|
| auth.types.ts | 타입 정의 | ✅ 필수 | (없음) |
| reset-password.types.ts | 타입 정의 | ✅ 필수 | (없음) |
| index.ts | export 허브 | ✅ 필수 | auth.types, reset-password.types |

## 🎯 순환 의존성 확인

✅ **순환 의존성 없음**
- 모든 의존성이 한 방향 (위에서 아래로)
- 계층 구조가 명확

## 📋 설정 파일

```
index.ts (Feature export 허브)
├─ export { LoginForm, ... } from "./components"
├─ export { AuthProvider } from "./providers"
├─ export { useAuthStore } from "./stores"
├─ export { useAuth, useResetPassword } from "./hooks"
├─ export { authService } from "./services"
└─ export type { SigninRequest, ... } from "./types"
```

이 파일을 통해 다른 Feature에서 쉽게 import 가능:
```typescript
import { LoginForm, useAuth, useAuthStore } from "@/features/auth"
```

## 💡 주요 특징

### 1. 계층화 아키텍처
- 각 계층이 명확한 책임
- 한 계층 변경이 다른 계층에 영향 최소화

### 2. 추상화
- 서비스 계층이 GraphQL 세부사항 숨김
- 상위 계층은 REST API와 동일한 인터페이스 사용

### 3. 타입 안전성
- TypeScript로 모든 인터페이스 정의
- 컴파일 타임에 오류 감지

### 4. 확장성
- 새로운 기능 추가 시 적절한 계층에만 코드 추가
- 기존 코드 수정 최소화

### 5. 테스트 용이성
- 각 계층을 독립적으로 테스트 가능
- Mock 객체를 사용한 단위 테스트 가능
