# Auth GraphQL Migration 완료

## 개요
backend-api의 GraphQL 기반 API 변화에 따라 manager-web의 인증 로직을 REST API에서 GraphQL로 마이그레이션했습니다.

## 변경 사항 요약

### 1. GraphQL 쿼리/뮤테이션 정의 ✅
**경로**: `src/features/auth/graphql/`

#### mutations.ts
- `SIGNIN` - 로그인 뮤테이션
- `SIGNUP` - 회원가입 뮤테이션
- `REFRESH_TOKEN` - 토큰 갱신 뮤테이션
- `LOGOUT` - 로그아웃 뮤테이션
- `CHANGE_PASSWORD` - 비밀번호 변경 뮤테이션
- `FORGOT_PASSWORD` - 비밀번호 찾기 뮤테이션
- `RESET_PASSWORD` - 비밀번호 재설정 뮤테이션

#### queries.ts
- `GET_CURRENT_USER` - 현재 사용자 정보 조회 쿼리
- `ManagerAuthUser` - 사용자 타입 정의
- `GetCurrentUserResponse` - 응답 타입 정의

### 2. GraphQL Hooks 작성 ✅
**경로**: `src/features/auth/graphql/use-auth.hooks.ts`

Apollo Client의 `useQuery`와 `useMutation`을 래핑한 커스텀 훅들:
- `useSignin()` - 로그인
- `useSignup()` - 회원가입
- `useRefreshToken()` - 토큰 갱신
- `useLogout()` - 로그아웃
- `useChangePassword()` - 비밀번호 변경
- `useForgotPassword()` - 비밀번호 찾기
- `useResetPassword()` - 비밀번호 재설정
- `useCurrentUser()` - 현재 사용자 정보 조회

### 3. Auth Service GraphQL 기반 변경 ✅
**경로**: `src/features/auth/services/auth.service.ts`

REST API 기반의 `apiClient`에서 **Apollo Client**로 변경:
- `signin()` - GraphQL SIGNIN 뮤테이션 사용
- `signup()` - GraphQL SIGNUP 뮤테이션 사용
- `refreshToken()` - GraphQL REFRESH_TOKEN 뮤테이션 사용
- `getCurrentUser()` - GraphQL GET_CURRENT_USER 쿼리 사용
- `logout()` - GraphQL LOGOUT 뮤테이션 사용
- `changePassword()` - GraphQL CHANGE_PASSWORD 뮤테이션 사용
- `forgotPassword()` - GraphQL FORGOT_PASSWORD 뮤테이션 사용
- `resetPassword()` - GraphQL RESET_PASSWORD 뮤테이션 사용

**주요 변환 함수**:
- `mapTokenResponse()` - GraphQL의 camelCase를 REST API 호환 형식으로 변환
- `mapUser()` - GraphQL의 camelCase를 REST API 호환 형식으로 변환

### 4. Auth Store & Provider
**상태**: 변경 필요 없음 ✅

Auth Store (Zustand)와 Auth Provider는 이미 authService의 인터페이스에만 의존하므로, authService만 변경해도 자동으로 GraphQL 기반으로 동작합니다.

**변경되지 않은 파일**:
- `src/features/auth/stores/auth.store.ts`
- `src/features/auth/providers/auth-provider.tsx`
- `src/features/auth/hooks/use-auth.ts` (UI 계층 훅)
- `src/features/auth/components/login-form.tsx` (로그인 폼 컴포넌트)

## 아키텍처 흐름

```
LoginForm (UI Component)
    ↓
useAuth() (UI Logic Hook)
    ↓
useAuthStore.login() (State Management)
    ↓
authService.signin() (API Service Layer - NOW GraphQL)
    ↓
apolloClient.mutate(SIGNIN) (GraphQL Mutation)
    ↓
Backend GraphQL API
```

## 타입 호환성

GraphQL API의 응답은 camelCase이지만, 기존 REST API 호환 타입 정의는 snake_case입니다.
Service 계층에서 자동으로 변환하므로 상위 레이어에서는 변경이 필요 없습니다.

```typescript
// GraphQL 응답 (camelCase)
{ accessToken, refreshToken, tokenType, expiresIn }

// 변환 후 (snake_case - REST API 호환)
{ access_token, refresh_token, token_type, expires_in }
```

## 테스트 체크리스트

- [ ] 로그인 기능 테스트 (admin / Admin1234!)
- [ ] 회원가입 기능 테스트
- [ ] 로그아웃 기능 테스트
- [ ] 토큰 갱신 기능 테스트
- [ ] 현재 사용자 정보 조회 테스트
- [ ] 비밀번호 변경 기능 테스트
- [ ] 비밀번호 찾기/재설정 기능 테스트
- [ ] Apollo DevTools에서 GraphQL 쿼리 확인
- [ ] 에러 처리 확인 (네트워크 에러, GraphQL 에러)
- [ ] localStorage 및 쿠키 토큰 저장 확인

## 문제 해결

### GraphQL 엔드포인트 설정 확인
`src/lib/apollo-client.ts`에서 GraphQL 엔드포인트가 올바르게 설정되어 있는지 확인:
```typescript
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8100/graphql';
```

### 백엔드 GraphQL 스키마 확인
백엔드 인증 뮤테이션이 GraphQL 스키마에 등록되어 있는지 확인:
- `src/graphql/manager/schema.py`에서 `ManagerAuthMutations` import
- `ManagerMutation` 클래스에 `auth_mutations` 필드 추가

### 개발 환경 변수 설정
`.env.local` 또는 `.env`에서 다음 환경 변수 확인:
```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8100/graphql
```

## 이후 마이그레이션 대상

현재는 인증(Auth) 기능만 GraphQL로 마이그레이션했습니다.
향후 다른 기능도 마이그레이션 예정:
- [ ] IDAM (Identity & Access Management) - Users, Roles, Permissions
- [ ] Tenant 관리
- [ ] Other features...

GraphQL 마이그레이션 패턴:
1. Feature의 `graphql/` 폴더에 `queries.ts`, `mutations.ts` 생성
2. Apollo Hooks 작성 (`use-[entity].hooks.ts`)
3. Service 계층을 GraphQL 기반으로 변경
4. 컴포넌트는 변경 없음 (서비스 계층 추상화 덕분)
