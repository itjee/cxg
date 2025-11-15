# Auth Feature - 인증 시스템

인증(로그인, 회원가입, 비밀번호 관리)을 담당하는 Feature입니다.

**GraphQL 기반 API 통신**을 사용합니다.

---

## 📚 문서 가이드

이 폴더의 구조와 동작 방식을 이해하기 위해 다음 문서들을 읽어보세요:

### 1️⃣ [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 분석 📖
- **대상**: 아키텍처를 이해하고 싶은 개발자
- **내용**: 
  - 7가지 계층 (Component → Hook → Store → Service → GraphQL → Apollo → Backend)
  - 각 계층의 역할과 책임
  - 데이터 흐름 (로그인 예시)
  - 파일별 역할

**읽어야 할 이유**: 새로운 기능을 추가하거나 버그를 수정할 때 어느 계층에서 코드를 작성해야 하는지 알 수 있습니다.

---

### 2️⃣ [FILE_DEPENDENCY_MAP.md](./FILE_DEPENDENCY_MAP.md) - 파일 의존성 맵 🔗
- **대상**: 파일 간 관계를 시각적으로 이해하고 싶은 개발자
- **내용**:
  - 파일 의존성 그래프 (문자 기반 다이어그램)
  - 파일별 역할 상세 표
  - 데이터 흐름 예시 (로그인 step-by-step)
  - 의존성 강도 분석

**읽어야 할 이유**: 특정 파일이 어떤 파일에 의존하는지, 변경 시 어떤 파일이 영향을 받는지 알 수 있습니다.

---

### 3️⃣ [UNNECESSARY_FILES.md](./UNNECESSARY_FILES.md) - 불필요한 파일 분석 ❌
- **대상**: 코드 정리를 고려하는 개발자
- **내용**:
  - 각 파일의 필요성 분석
  - 미사용 파일 (`graphql/use-auth.hooks.ts`) 상세 분석
  - 제거할지 유지할지 판단 기준
  - Apollo Hooks 두 가지 사용 방식 비교

**읽어야 할 이유**: 불필요한 코드를 정리할 때 참고합니다.

---

### 4️⃣ [GRAPHQL_MIGRATION.md](./GRAPHQL_MIGRATION.md) - GraphQL 마이그레이션 가이드 🚀
- **대상**: GraphQL 마이그레이션 과정을 알고 싶은 개발자
- **내용**:
  - REST API → GraphQL 변경 사항
  - 생성된 파일 목록
  - 타입 호환성 (GraphQL camelCase ↔ REST snake_case)
  - 테스트 체크리스트

**읽어야 할 이유**: GraphQL 마이그레이션이 어떻게 구현되었는지, 앞으로 어떤 부분을 추가해야 하는지 알 수 있습니다.

---

## 🗂️ 폴더 구조

```
auth/
├── components/              # UI 컴포넌트
│   ├── login-form.tsx      # 로그인 폼
│   ├── signup-form.tsx     # 회원가입 폼
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   └── index.ts
│
├── graphql/                 # GraphQL 쿼리/뮤테이션
│   ├── mutations.ts        # signin, signup, logout 등
│   ├── queries.ts          # 현재 사용자 조회
│   ├── use-auth.hooks.ts   # Apollo Hooks (선택사항)
│   └── index.ts
│
├── hooks/                   # UI Logic
│   ├── use-auth.ts         # 로그인/로그아웃 로직
│   ├── use-reset-password.ts # 비밀번호 로직
│   └── index.ts
│
├── services/                # API 서비스
│   ├── auth.service.ts     # GraphQL 통신
│   └── index.ts
│
├── stores/                  # 상태 관리 (Zustand)
│   ├── auth.store.ts       # 글로벌 인증 상태
│   └── index.ts
│
├── providers/               # 초기화 제공자
│   └── auth-provider.tsx   # 앱 시작 시 인증 복원
│
├── types/                   # 타입 정의
│   ├── auth.types.ts
│   ├── reset-password.types.ts
│   └── index.ts
│
├── index.ts                 # Feature export 허브
├── README.md               # 이 파일
├── ARCHITECTURE.md         # 아키텍처 분석
├── FILE_DEPENDENCY_MAP.md  # 파일 의존성 맵
├── UNNECESSARY_FILES.md    # 불필요 파일 분석
└── GRAPHQL_MIGRATION.md    # GraphQL 마이그레이션
```

---

## 🚀 빠른 시작

### 로그인 기능 추가하기

```typescript
import { LoginForm } from "@/features/auth";

export default function SignInPage() {
  return <LoginForm />;
}
```

### 로그인 상태 확인하기

```typescript
import { useAuthStore } from "@/features/auth";

export function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.username}!</div>;
}
```

### 비밀번호 재설정 기능 추가하기

```typescript
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
```

---

## 🔄 데이터 흐름 (로그인 예시)

```
1. 사용자가 LoginForm에 username, password 입력
2. useAuth() 훅의 signin() 호출
3. useAuthStore.login() → 상태 관리 계층
4. authService.signin() → API 서비스 계층
5. apolloClient.mutate(SIGNIN) → GraphQL 계층
6. Backend GraphQL API (Python/Strawberry)
7. 토큰 응답 → localStorage + Cookie 저장
8. useAuthStore 상태 업데이트
9. useRouter.push("/core/dashboard")
```

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md)의 "데이터 흐름" 섹션을 참고하세요.

---

## ❓ FAQ

### Q: 새로운 인증 기능을 추가하려면?

**A**: 다음 계층들을 수정하면 됩니다:

1. **GraphQL 정의** (`graphql/mutations.ts` 또는 `graphql/queries.ts`)
   - 백엔드 GraphQL 스키마와 맞춰서 쿼리/뮤테이션 추가

2. **API 서비스** (`services/auth.service.ts`)
   - 새로운 메서드 추가 (GraphQL 호출)

3. **상태 관리** (`stores/auth.store.ts`)
   - 필요시 새로운 상태/액션 추가

4. **UI Logic 훅** (`hooks/use-auth.ts` 또는 `hooks/use-reset-password.ts`)
   - 필요시 새로운 훅 또는 기존 훅에 메서드 추가

5. **UI 컴포넌트** (`components/*.tsx`)
   - 새로운 폼 또는 기존 폼 수정

> 컴포넌트 계층은 변경할 필요가 거의 없습니다! 서비스 계층이 잘 추상화되어 있기 때문입니다.

---

### Q: GraphQL과 REST API 어느 것을 사용해야 하나?

**A**: 
- **새로운 인증 기능**: GraphQL 사용 (SIGNIN, SIGNUP 등)
- **레거시 기능**: REST API 사용 (필요시)
- **규칙**: 새 기능은 GraphQL, 기존 레거시는 REST API

자세한 내용은 [GRAPHQL_MIGRATION.md](./GRAPHQL_MIGRATION.md)의 "GraphQL vs REST API 사용 구분" 섹션을 참고하세요.

---

### Q: graphql/use-auth.hooks.ts는 왜 있나요?

**A**: Apollo Client를 **직접** 사용하는 고급 케이스를 위한 예시입니다.

현재는 사용하지 않지만:
- 문서화 및 참고용
- 향후 필요시 (Real-time 구독 등) 사용 가능

자세한 내용은 [UNNECESSARY_FILES.md](./UNNECESSARY_FILES.md)를 참고하세요.

---

### Q: 파일을 변경하면 어떤 파일들이 영향을 받나요?

**A**: [FILE_DEPENDENCY_MAP.md](./FILE_DEPENDENCY_MAP.md)의 "의존성 강도" 섹션을 참고하세요.

예:
- `auth.service.ts` 변경 → `auth.store.ts`, `hooks/*.ts` 영향
- `graphql/mutations.ts` 변경 → `services/auth.service.ts` 영향
- `components/*.tsx` 변경 → 다른 파일에 영향 없음

---

## ✅ 테스트 체크리스트

마이그레이션 후 다음을 테스트하세요:

- [ ] 로그인 (admin / Admin1234!)
- [ ] 회원가입
- [ ] 로그아웃
- [ ] 토큰 갱신
- [ ] 현재 사용자 정보 조회
- [ ] 비밀번호 변경
- [ ] 비밀번호 찾기
- [ ] 비밀번호 재설정
- [ ] Apollo DevTools에서 GraphQL 쿼리 확인
- [ ] 에러 처리 (네트워크 에러, GraphQL 에러)
- [ ] localStorage 및 쿠키 토큰 저장 확인

---

## 📞 연락처

문제가 있거나 개선 사항이 있으면 팀에 알려주세요.

---

## 📖 관련 링크

- [개발 가이드](../../../docs/05_frontend/00_프론트엔드_개발가이드_20241108.md) - 전체 프론트엔드 아키텍처
- [Apollo Client 문서](https://www.apollographql.com/docs/react/) - GraphQL 클라이언트
- [Zustand 문서](https://github.com/pmndrs/zustand) - 상태 관리

---

**마지막 업데이트**: 2024년 11월 14일
**상태**: GraphQL 마이그레이션 완료 ✅
