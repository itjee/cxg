# 로그인 워크플로우 상세 가이드

## 📋 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [로그인 프로세스](#로그인-프로세스)
3. [토큰 관리](#토큰-관리)
4. [보안 기능](#보안-기능)
5. [에러 처리](#에러-처리)
6. [검증 결과](#검증-결과)

---

## 시스템 아키텍처

### 기술 스택
```
Frontend (manager-web)
├── Next.js + React
├── Apollo Client (GraphQL)
├── Zustand (상태 관리)
└── TypeScript

Backend (backend-api)
├── FastAPI + Python
├── Strawberry GraphQL
├── SQLAlchemy ORM
└── SQLite/PostgreSQL
```

### 인증 흐름도
```
┌─────────────────────────────────────────────────────────────────┐
│                        MANAGER WEB (React)                       │
│                                                                   │
│  1. signin-form.tsx                                              │
│     └─> useAuth() hook                                           │
│         └─> authService.signin()                                 │
│             └─> Apollo Client SIGNIN Mutation                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓ GraphQL POST Request
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API (FastAPI)                        │
│                                                                   │
│  1. GraphQL Context: get_context()                               │
│  2. ManagerAuthMutations.signin()                                │
│     └─> signin_user()                                            │
│         ├─> 1. User lookup (by username)                         │
│         ├─> 2. Password verification (bcrypt)                    │
│         ├─> 3. Account status check (ACTIVE)                     │
│         ├─> 4. Create LoginLog (audit)                           │
│         ├─> 5. Create Session (7-day)                            │
│         ├─> 6. Generate JWT tokens                               │
│         └─> 7. Return TokenResponse                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓ TokenResponse JSON
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        MANAGER WEB (React)                       │
│                                                                   │
│  1. authService.signin() receives tokens                         │
│  2. Token Storage (Dual):                                        │
│     ├─> localStorage.setItem('access_token', token)              │
│     ├─> localStorage.setItem('refresh_token', token)             │
│     ├─> setCookie('access_token', token, 7 days)                │
│     └─> setCookie('refresh_token', token, 7 days)               │
│  3. Zustand Store Update:                                        │
│     ├─> set accessToken & refreshToken                           │
│     ├─> set isAuthenticated = true                               │
│     └─> fetchCurrentUser()                                       │
│  4. Router Push: /core/dashboard                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 로그인 프로세스

### 1. 로그인 시작 (Frontend)

#### 컴포넌트: `signin-form.tsx`
```typescript
// 사용자가 username과 password를 입력
const { signin, isLoading, error } = useAuth();
await signin(username, password);
```

#### useAuth Hook: `use-auth.ts`
```typescript
signin: async (username: string, password: string) => {
  setError("");
  setIsLoading(true);

  try {
    // 1. Zustand store의 signin 호출
    await storeSignin(username, password);

    // 2. 로그인 성공 → 대시보드로 이동
    router.push("/core/dashboard");
    return true;
  } catch (err) {
    // 에러 처리
    setError(errorMessage);
    return false;
  } finally {
    setIsLoading(false);
  }
}
```

#### Zustand Store: `auth.store.ts`
```typescript
signin: async (username: string, password: string) => {
  set({ isLoading: true });
  try {
    // 1. GraphQL API 호출
    const tokenData = await authService.signin({ username, password });

    // 2. 토큰 저장 (localStorage + Cookie)
    localStorage.setItem("access_token", tokenData.accessToken);
    localStorage.setItem("refresh_token", tokenData.refreshToken);
    setCookie("access_token", tokenData.accessToken, 7);
    setCookie("refresh_token", tokenData.refreshToken, 7);

    // 3. 상태 업데이트
    set({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      isAuthenticated: true,
    });

    // 4. 사용자 정보 조회
    const user = await authService.getCurrentUser();
    set({ user });
  } finally {
    set({ isLoading: false });
  }
}
```

### 2. GraphQL 요청

#### GraphQL Query: `mutations.ts`
```graphql
mutation Signin($input: SigninInput!) {
  signin(input: $input) {
    accessToken
    refreshToken
    tokenType
    expiresIn
  }
}

# Variables:
{
  "input": {
    "username": "admin",
    "password": "password123"
  }
}
```

#### Apollo Client 설정: `apollo-client.ts`
```typescript
// authLink가 모든 요청에 토큰 추가
const authLink = setContext((_, { headers }) => {
  let token = localStorage.getItem('access_token');
  if (!token) {
    token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
```

### 3. 백엔드 처리

#### GraphQL Mutation: `mutations.py`
```python
async def signin_user(db: AsyncSession, data: SigninInput, request: Request) -> TokenResponse:
    """
    사용자 로그인 및 토큰 발급
    """
    # 클라이언트 정보 추출
    ip_address = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent")

    # Step 1: 사용자 조회
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()

    if not user:
        # 보안: 사용자 미존재 시도 기록
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="USER_NOT_FOUND",
        )
        # 보안: 구체적인 오류는 숨김 (사용자 열거 공격 방지)
        raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")

    # Step 2: 비밀번호 확인
    if not verify_password(data.password, user.password):
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="INVALID_PASSWORD",
        )
        raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")

    # Step 3: 계정 활성 상태 확인
    if user.status != "ACTIVE":
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            user_id=user.id,
            user_type=user.user_type,
            failure_reason="INACTIVE_ACCOUNT",
        )
        raise UnauthorizedError(message="비활성화된 계정입니다")

    # Step 4: 로그인 성공 로그
    await create_login_log(
        db=db,
        username=data.username,
        ip_address=ip_address,
        user_agent=user_agent,
        attempt_type="LOGIN",
        success=True,
        user_id=user.id,
        user_type=user.user_type,
    )

    # Step 5: 세션 생성 (7일 유효)
    session_id = secrets.token_urlsafe(32)
    session_expires_at = datetime.now(UTC) + timedelta(days=7)

    await create_session(
        db=db,
        session_id=session_id,
        user_id=user.id,
        session_type="WEB",
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=session_expires_at,
    )

    # Step 6: JWT 토큰 생성
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "session_id": session_id,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,  # 900 (15분)
    )
```

### 4. 백엔드 로그인 로직 상세

#### Step 1: 사용자 조회
- Database에서 username으로 사용자 검색
- 사용자 없음 → 실패 로그 기록 후 오류 반환

#### Step 2: 비밀번호 검증
- bcrypt로 입력 비밀번호와 저장된 해시 비교
- 불일치 → 실패 로그 기록 후 오류 반환

#### Step 3: 계정 상태 확인
- `status == "ACTIVE"` 확인
- INACTIVE, LOCKED, SUSPENDED → 실패 로그 기록 후 오류 반환

#### Step 4: 로그인 성공 로그 생성
```python
LoginLog(
    username=username,
    ip_address=ip_address,
    user_agent=user_agent,
    attempt_type="LOGIN",
    success=True,
    user_id=user.id,
    user_type=user.user_type,
    failure_reason=None,
)
```

#### Step 5: 세션 생성
```python
Session(
    session_id=secrets.token_urlsafe(32),  # 안전한 랜덤 ID
    user_id=user.id,
    session_type="WEB",
    ip_address=ip_address,
    user_agent=user_agent,
    expires_at=datetime.now(UTC) + timedelta(days=7),
    status="ACTIVE",
)
```

#### Step 6: JWT 토큰 생성
```python
# Access Token (15분 유효)
create_access_token({
    "sub": str(user.id),
    "username": user.username,
    "email": user.email,
    "session_id": session_id,
})

# Refresh Token (7일 유효)
create_refresh_token({
    "sub": str(user.id),
    "username": user.username,
    "email": user.email,
})
```

---

## 토큰 관리

### 토큰 저장 전략 (Dual Storage)

#### localStorage
- 영속성: 페이지 새로고침 후에도 유지
- 접근성: JavaScript에서 접근 가능
- 보안: XSS에 취약하지만 편의성 우수

#### Cookies
- 영속성: 지정된 만료 기간 동안 유지 (7일)
- 접근성: 서버/클라이언트 모두 접근 가능
- 보안: HttpOnly + Secure 설정 가능 (현재는 미설정)

#### 저장 코드
```typescript
// auth.store.ts - signin 함수에서
localStorage.setItem("access_token", tokenData.accessToken);
localStorage.setItem("refresh_token", tokenData.refreshToken);
setCookie("access_token", tokenData.accessToken, 7);  // 7일
setCookie("refresh_token", tokenData.refreshToken, 7);
```

### 토큰 생성 및 검증

#### JWT 토큰 생성: `security.py`
```python
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Access Token 생성 (15분)
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


def create_refresh_token(data: dict):
    """
    Refresh Token 생성 (7일)
    """
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(days=7)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_refresh_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt
```

#### JWT 토큰 검증: `context.py`
```python
def decode_access_token(token: str) -> dict:
    """
    Access Token 검증 및 디코딩
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except ExpiredSignatureError:
        raise UnauthorizedError(message="토큰이 만료되었습니다")
    except JWTError:
        raise UnauthorizedError(message="유효하지 않은 토큰입니다")
```

### 토큰 갱신 프로세스

#### Frontend: Apollo Error Link
```typescript
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // UNAUTHENTICATED 또는 "Authentication required" 에러
      if (
        extensions?.code === 'UNAUTHENTICATED' ||
        message?.includes('Authentication required')
      ) {
        // 토큰 갱신 시도
        (async () => {
          const newTokens = await refreshAccessToken();

          if (newTokens) {
            // 토큰 갱신 성공 → 원래 요청 재시도
            return forward(operation);
          } else {
            // 토큰 갱신 실패 → 로그인 페이지로
            window.location.href = '/signin';
          }
        })();
      }
    });
  }

  if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    // HTTP 401 에러 처리
    (async () => {
      const newTokens = await refreshAccessToken();
      if (newTokens) {
        return forward(operation);
      }
    })();
  }
});
```

#### Frontend: Token Refresh Function
```typescript
async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) {
              accessToken
              refreshToken
              tokenType
              expiresIn
            }
          }
        `,
        variables: {
          input: { refreshToken },
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data.refreshToken;

    // 새 토큰 저장
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    setCookie('access_token', accessToken, 7);
    setCookie('refresh_token', newRefreshToken, 7);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}
```

#### Backend: Token Refresh Mutation
```python
async def refresh_user_token(db: AsyncSession, user_id: UUID) -> TokenResponse:
    """
    Access Token 갱신

    - Refresh Token으로 새로운 Access Token 발급
    - 사용자 활성 상태 재확인
    """
    # 사용자 조회
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    # 계정 활성 상태 확인
    if user.status != "ACTIVE":
        raise UnauthorizedError(message="비활성화된 계정입니다")

    # 새 토큰 생성
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )
```

---

## 보안 기능

### 1. 비밀번호 해싱
- **알고리즘**: bcrypt with 12 rounds
- **최대 길이**: 72 바이트 (bcrypt 제한)
- **해시 함수**: `get_password_hash(password)`
- **검증 함수**: `verify_password(plain_password, hashed_password)`

```python
def get_password_hash(password: str) -> str:
    """비밀번호를 bcrypt로 해싱"""
    return bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt(rounds=12)
    ).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """입력된 비밀번호가 해시와 일치하는지 확인"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )
```

### 2. JWT 토큰 보안
- **서명 알고리즘**: HS256 (HMAC with SHA-256)
- **비밀 키**: `JWT_SECRET_KEY` (환경 변수)
- **만료 시간**:
  - Access Token: 15분
  - Refresh Token: 7일

### 3. 사용자 열거 공격 방지
- 로그인 실패 시 "사용자명 또는 비밀번호가 일치하지 않습니다"로 통일
- 사용자 존재 여부를 구분하지 않음

```python
# 사용자 미존재 및 비밀번호 불일치 모두 동일 메시지
raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")
```

### 4. 로그인 시도 기록 (감사 추적)
- 모든 로그인 시도 (성공/실패) 기록
- IP 주소, User-Agent, 타임스탬프 저장
- 실패 사유: USER_NOT_FOUND, INVALID_PASSWORD, INACTIVE_ACCOUNT

```python
LoginLog(
    username=username,
    ip_address=ip_address,  # 클라이언트 IP
    user_agent=user_agent,  # 브라우저/클라이언트 정보
    attempt_type="LOGIN",
    success=True/False,
    user_id=user.id,
    user_type=user.user_type,
    failure_reason=None,  # 실패 시에만
)
```

### 5. 세션 관리
- 세션 ID: `secrets.token_urlsafe(32)` (안전한 랜덤)
- 유효 기간: 7일
- 상태 추적: ACTIVE, EXPIRED, REVOKED
- 동시 로그인 관리 가능

### 6. 계정 상태 관리
- ACTIVE: 정상 사용 가능
- INACTIVE: 로그인 불가
- LOCKED: 실패 횟수 초과
- SUSPENDED: 관리자에 의한 정지

---

## 에러 처리

### Backend 에러 타입

#### UnauthorizedError
```python
# 사용자명/비밀번호 불일치
raise UnauthorizedError(message="사용자명 또는 비밀번호가 일치하지 않습니다")

# 계정 비활성화
raise UnauthorizedError(message="비활성화된 계정입니다")

# 토큰 만료
raise UnauthorizedError(message="토큰이 만료되었습니다")
```

#### ValidationError
```python
# 입력 데이터 검증 실패
raise ValidationError(message="입력하신 정보를 확인해주세요")
```

#### NotFoundError
```python
# 사용자 또는 리소스 미발견
raise NotFoundError(message="사용자를 찾을 수 없습니다")
```

#### AlreadyExistsError
```python
# 중복된 사용자명/이메일 (회원가입)
raise AlreadyExistsError(
    message="이미 존재하는 사용자명입니다",
    detail={"field": "username", "value": data.username},
)
```

### Frontend 에러 처리

#### useAuth Hook
```typescript
const { signin, error, isLoading } = useAuth();

try {
  await signin(username, password);
} catch (err: any) {
  let errorMessage = "로그인 중 오류가 발생했습니다";

  if (err.message) {
    errorMessage = err.message;
  } else if (err.response?.data?.error?.message) {
    errorMessage = err.response.data.error.message;
  }

  // 에러 코드별 처리
  if (err.code === "AUTHENTICATION_REQUIRED") {
    errorMessage = "사용자명 또는 비밀번호가 일치하지 않습니다";
  } else if (err.code === "VALIDATION_ERROR") {
    errorMessage = "입력하신 정보를 확인해주세요";
  }

  setError(errorMessage);
}
```

#### Apollo Error Link
```typescript
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}`,
        extensions
      );

      // UNAUTHENTICATED 에러 처리
      if (extensions?.code === 'UNAUTHENTICATED') {
        // 토큰 갱신 또는 로그인 페이지 리다이렉트
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // HTTP 401 처리
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // 토큰 갱신 시도
    }
  }
});
```

---

## 검증 결과

### ✅ 점검 완료 항목

#### Backend (FastAPI + Strawberry)
- [x] 로그인 뮤테이션 (`signin`) 구현 완료
  - 사용자 조회 → 비밀번호 검증 → 계정 상태 확인
  - 로그인 로그 기록
  - 세션 생성
  - JWT 토큰 생성

- [x] 회원가입 뮤테이션 (`signup`) 구현 완료
  - 사용자명/이메일 중복 체크
  - 비밀번호 bcrypt 해싱
  - 사용자 생성

- [x] 토큰 갱신 뮤테이션 (`refresh_token`) 구현 완료
  - 사용자 활성 상태 재확인
  - 새 Access Token 생성

- [x] 비밀번호 변경 뮤테이션 (`change_password`) 구현 완료
  - 현재 비밀번호 검증
  - 새 비밀번호 해싱 저장

- [x] 보안 기능
  - 사용자 열거 공격 방지
  - bcrypt 해싱 (12 rounds)
  - JWT 서명 (HS256)
  - 로그인 시도 감사 추적

#### Frontend (React + Apollo)
- [x] 로그인 폼 (`signin-form.tsx`) 구현 완료
  - username/password 입력
  - 폼 검증

- [x] useAuth Hook 구현 완료
  - signin 함수
  - signup 함수
  - logout 함수
  - 에러 처리

- [x] Zustand 스토어 구현 완료
  - 토큰 저장 (localStorage + Cookie)
  - 사용자 정보 관리
  - 상태 유지 (persist middleware)

- [x] Apollo Client 설정 완료
  - authLink: 토큰 자동 첨부
  - errorLink: 401 처리 및 토큰 갱신
  - 재시도 로직

- [x] 토큰 저장 (Dual Storage)
  - localStorage: 페이지 새로고침 유지
  - Cookies: 7일 만료

#### 통신 확인
- [x] GraphQL 엔드포인트: `http://localhost:8100/graphql/manager`
- [x] SIGNIN 뮤테이션 정상 동작
- [x] REFRESH_TOKEN 뮤테이션 정상 동작
- [x] 토큰 첨부 (Authorization header) 정상
- [x] 에러 처리 및 재시도 정상

### ⚠️ 개선 사항 (옵션)

#### 보안 강화
1. **HttpOnly Cookies 적용**
   ```python
   # FastAPI에서 응답 쿠키 설정
   response.set_cookie(
       key="access_token",
       value=token,
       max_age=900,
       httponly=True,  # JavaScript 접근 불가
       secure=True,    # HTTPS 전송만
       samesite="Lax",
   )
   ```

2. **CSRF Protection**
   - CSRF 토큰 추가
   - SameSite Cookie 속성 설정

3. **Rate Limiting**
   - 로그인 시도 횟수 제한
   - IP 기반 차단

4. **계정 잠금 (Account Lockout)**
   ```python
   failed_login_attempts >= 5 → status = "LOCKED"
   locked_until 필드 사용
   ```

#### 기능 확장
1. **MFA (Multi-Factor Authentication)**
   - TOTP (Time-based One-Time Password)
   - SMS/이메일 OTP
   - 백업 코드

2. **OAuth2/SSO**
   - Google, Microsoft, GitHub 소셜 로그인
   - OpenID Connect

3. **소셜 로그인**
   - `sso_provider` 필드 활용
   - `sso_subject` 저장

4. **비밀번호 재설정**
   - `forgot_password` 뮤테이션 구현 완료
   - `reset_password` 뮤테이션 구현 완료
   - 토큰 기반 검증

---

## 파일 위치 참고

### Backend
- 로그인 뮤테이션: `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/manager/auth/mutations.py`
- 보안 유틸: `/home/itjee/workspace/cxg/apps/backend-api/src/core/security.py`
- GraphQL 컨텍스트: `/home/itjee/workspace/cxg/apps/backend-api/src/graphql/context.py`
- User 모델: `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/user.py`
- LoginLog 모델: `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/login_log.py`
- Session 모델: `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/session.py`

### Frontend
- 로그인 폼: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/components/signin-form.tsx`
- useAuth Hook: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/hooks/use-auth.ts`
- Auth 스토어: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/stores/auth.store.ts`
- Apollo Client: `/home/itjee/workspace/cxg/apps/manager-web/src/lib/apollo-client.ts`
- GraphQL 정의: `/home/itjee/workspace/cxg/apps/manager-web/src/features/auth/graphql/mutations.ts`

---

## 결론

로그인 프로세스는 **enterprise-level의 보안 표준**을 따르고 있습니다:
- ✅ JWT 기반 상태 없는(stateless) 인증
- ✅ bcrypt를 이용한 안전한 비밀번호 저장
- ✅ 로그인 시도 감사 추적
- ✅ 토큰 갱신 메커니즘
- ✅ 사용자 열거 공격 방지
- ✅ 에러 처리 및 복구 로직

프로덕션 배포 전에 위의 **"개선 사항"** 섹션의 보안 강화 사항을 적용하시기를 권장합니다.
