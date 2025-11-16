# 인증 시스템 프로세스 흐름 및 전달 데이터

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Manager-Web (Frontend)                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Auth Components (SignIn, SignUp, PasswordReset 등)         │   │
│  │              ↓                                               │   │
│  │  useAuth() Hook → authService → apolloClient                │   │
│  │              ↓                                               │   │
│  │  useAuthStore (Zustand) → localStorage + Cookie            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                          GraphQL Mutations
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  Backend-API (Backend - FastAPI)                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  GraphQL Schema (manager/schema.py)                          │   │
│  │              ↓                                               │   │
│  │  ManagerMutation → ManagerAuthMutations                      │   │
│  │              ↓                                               │   │
│  │  Auth Functions:                                            │   │
│  │  - signup_user()      → User 생성                           │   │
│  │  - signin_user()      → Token 발급                          │   │
│  │  - refresh_user_token()   → Token 갱신                      │   │
│  │  - change_user_password() → 비밀번호 변경                    │   │
│  │  - reset_user_password()  → 비밀번호 재설정                  │   │
│  │              ↓                                               │   │
│  │  Database (Manager IDAM)                                    │   │
│  │  - User (username, email, password_hash)                    │   │
│  │  - LoginLog (로그인 시도 기록)                               │   │
│  │  - Session (세션 추적)                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ 로그인 (Sign In) 프로세스

### 1.1 프로세스 흐름

```
┌──────────────┐
│ 사용자 입력   │  username, password
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuth() Hook (Manager-Web)             │
│ - signin(username, password)             │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.signin()                     │
│ - apolloClient.mutate({SIGNIN})          │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request                 │
│ mutation { auth { signin(input) } }      │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: signin_user()                   │
│ 1. 사용자 조회 (username)                │
│ 2. 비밀번호 검증 (bcrypt)                │
│ 3. 계정 상태 확인 (ACTIVE)               │
│ 4. LoginLog 기록                         │
│ 5. Session 생성                          │
│ 6. JWT Token 생성                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     signin: {                            │
│       accessToken,                       │
│       refreshToken,                      │
│       tokenType,                         │
│       expiresIn                          │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.signin() 응답 처리           │
│ - result.data.auth.signin 추출           │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuthStore.signin()                    │
│ - localStorage에 token 저장              │
│ - Cookie에 token 저장                    │
│ - Store state 업데이트                   │
│ - getCurrentUser() 호출                  │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 라우팅 및 UI 업데이트                    │
│ - /core/dashboard로 이동                 │
│ - 사용자 정보 표시                       │
└──────────────────────────────────────────┘
```

### 1.2 전달 데이터

#### 요청 (Frontend → Backend)
```graphql
mutation Signin($input: SigninInput!) {
  auth {
    signin(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
}

# Variables
{
  "input": {
    "username": "user123",
    "password": "securePassword123"
  }
}
```

#### 응답 (Backend → Frontend)
```json
{
  "data": {
    "auth": {
      "signin": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "tokenType": "bearer",
        "expiresIn": 900
      }
    }
  }
}
```

#### JWT Payload 예시
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "username": "user123",
  "email": "user@example.com",
  "session_id": "qwertyuiopasdfghjklzxcvbnm1234567890",
  "iat": 1700000000,
  "exp": 1700000900
}
```

### 1.3 Backend 상세 처리

#### signin_user() - 상세 단계

```python
async def signin_user(db: AsyncSession, data: SigninInput, request: Request) -> TokenResponse:
    """
    Step 1: 클라이언트 정보 추출
    - IP Address: request.client.host
    - User-Agent: request.headers.get("user-agent")
    """
    ip_address = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent")

    """
    Step 2: 사용자 조회
    SELECT * FROM user WHERE username = ?
    """
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()

    if not user:
        # 로그인 시도 기록 (실패)
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="USER_NOT_FOUND"
        )
        raise UnauthorizedError("사용자명 또는 비밀번호가 일치하지 않습니다")

    """
    Step 3: 비밀번호 검증 (bcrypt)
    verify_password(plaintext, hash)
    """
    if not user.password or not verify_password(data.password, user.password):
        await create_login_log(
            db=db,
            username=data.username,
            ip_address=ip_address,
            user_agent=user_agent,
            attempt_type="LOGIN",
            success=False,
            failure_reason="INVALID_PASSWORD"
        )
        raise UnauthorizedError("사용자명 또는 비밀번호가 일치하지 않습니다")

    """
    Step 4: 계정 활성 상태 확인
    """
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
            failure_reason="INACTIVE_ACCOUNT"
        )
        raise UnauthorizedError("비활성화된 계정입니다")

    """
    Step 5: 로그인 성공 로그 기록
    INSERT INTO login_log (...)
    """
    await create_login_log(
        db=db,
        username=data.username,
        ip_address=ip_address,
        user_agent=user_agent,
        attempt_type="LOGIN",
        success=True,
        user_id=user.id,
        user_type=user.user_type
    )

    """
    Step 6: 세션 생성 (7일 유효)
    INSERT INTO session (...)
    """
    session_id = secrets.token_urlsafe(32)
    session_expires_at = datetime.now(UTC) + timedelta(days=7)

    await create_session(
        db=db,
        session_id=session_id,
        user_id=user.id,
        session_type="WEB",
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=session_expires_at
    )

    """
    Step 7: JWT 토큰 생성
    - algorithm: HS256
    - access_token expiry: 15 minutes
    - refresh_token expiry: 7 days
    """
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "session_id": session_id
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60  # 900초
    )
```

### 1.4 Database 변경사항

#### User 테이블
- **기존**: `password_hash` → 파일에서 재설정하지 않음 (READ ONLY)
- **로그인**: 상태 변경 없음

#### LoginLog 테이블 (신규 생성)
```sql
INSERT INTO login_log (username, ip_address, user_agent, attempt_type, success, user_id, user_type, failure_reason, created_at)
VALUES (
  'user123',
  '192.168.1.100',
  'Mozilla/5.0 ...',
  'LOGIN',
  TRUE,
  '550e8400-e29b-41d4-a716-446655440000',
  'MASTER',
  NULL,
  NOW()
)
```

#### Session 테이블 (신규 생성)
```sql
INSERT INTO session (session_id, user_id, session_type, ip_address, user_agent, status, expires_at, created_at)
VALUES (
  'qwertyuiopasdfghjklzxcvbnm1234567890',
  '550e8400-e29b-41d4-a716-446655440000',
  'WEB',
  '192.168.1.100',
  'Mozilla/5.0 ...',
  'ACTIVE',
  '2024-11-23 08:00:00',  -- 7일 후
  NOW()
)
```

---

## 2️⃣ 토큰 갱신 (Token Refresh) 프로세스

### 2.1 프로세스 흐름

```
┌──────────────┐
│ Refresh Token │ (localStorage/Cookie에서 읽음)
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ Apollo ErrorLink 감지                    │
│ (access_token 만료 시)                   │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.refreshToken()               │
│ - apolloClient.mutate({REFRESH_TOKEN})   │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request                 │
│ mutation { auth { refreshToken(input) } }│
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: refresh_user_token()            │
│ 1. 사용자 조회 (user_id)                 │
│ 2. 계정 상태 확인 (ACTIVE)               │
│ 3. 새 JWT Token 생성                     │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     refreshToken: {                      │
│       accessToken (NEW),                 │
│       refreshToken (NEW),                │
│       tokenType,                         │
│       expiresIn                          │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuthStore.refreshAuth()               │
│ - 새 토큰으로 localStorage 업데이트      │
│ - 새 토큰으로 Cookie 업데이트            │
│ - 실패: clearAuth() (로그아웃)           │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 실패한 요청 재시도                       │
│ (새 accessToken 사용)                    │
└──────────────────────────────────────────┘
```

### 2.2 전달 데이터

#### 요청
```graphql
mutation RefreshToken($input: RefreshTokenInput!) {
  auth {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
}

# Variables
{
  "input": {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 응답
```json
{
  "data": {
    "auth": {
      "refreshToken": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // 새로운 토큰
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // 새로운 토큰
        "tokenType": "bearer",
        "expiresIn": 900
      }
    }
  }
}
```

### 2.3 Backend 상세 처리

```python
async def refresh_user_token(db: AsyncSession, user_id: UUID) -> TokenResponse:
    """
    Step 1: 사용자 조회
    SELECT * FROM user WHERE id = ?
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    """
    Step 2: 계정 활성 상태 확인
    """
    if user.status != "ACTIVE":
        raise UnauthorizedError(message="비활성화된 계정입니다")

    """
    Step 3: 새 JWT 토큰 생성
    """
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60
    )
```

### 2.4 Refresh Token 검증 (@require_auth 데코레이터)

```python
@require_auth
async def refresh_token(self, info, input: RefreshTokenInput) -> TokenResponse:
    """
    require_auth 데코레이터가 다음을 검증합니다:
    1. Authorization 헤더에서 토큰 추출
    2. JWT 토큰 검증 (서명, 만료 시간)
    3. info.context.user_id 설정

    Refresh Token은 수동으로 검증:
    - apolloClient의 errorLink가 401 감지
    - 자동으로 refreshToken mutation 호출
    """
```

---

## 3️⃣ 회원가입 (Sign Up) 프로세스

### 3.1 프로세스 흐름

```
┌──────────────┐
│ 사용자 입력   │  username, email, password, fullName
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuth() Hook (Manager-Web)             │
│ - signup(username, email, password, ...)│
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.signup()                     │
│ - apolloClient.mutate({SIGNUP})          │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request                 │
│ mutation { auth { signup(input) } }      │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: signup_user()                   │
│ 1. username 중복 체크                    │
│ 2. email 중복 체크                       │
│ 3. 비밀번호 해시화 (bcrypt, 12 rounds)   │
│ 4. 사용자 생성                           │
│ 5. DB 저장                               │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     signup: {                            │
│       id,                                │
│       username,                          │
│       email,                             │
│       fullName,                          │
│       userType,                          │
│       status,                            │
│       createdAt                          │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuthStore.signup()                    │
│ - 회원가입 후 자동 로그인                │
│ - signin(username, password) 호출        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 로그인 프로세스 진행                     │
│ (토큰 저장, 대시보드로 이동)             │
└──────────────────────────────────────────┘
```

### 3.2 전달 데이터

#### 요청
```graphql
mutation Signup($input: SignupInput!) {
  auth {
    signup(input: $input) {
      id
      username
      email
      fullName
      userType
      status
      createdAt
    }
  }
}

# Variables
{
  "input": {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "securePassword123",
    "fullName": "New User Name"
  }
}
```

#### 응답
```json
{
  "data": {
    "auth": {
      "signup": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "newuser",
        "email": "newuser@example.com",
        "fullName": "New User Name",
        "userType": "MASTER",
        "status": "ACTIVE",
        "createdAt": "2024-11-16T08:00:00+00:00"
      }
    }
  }
}
```

### 3.3 Backend 상세 처리

```python
async def signup_user(db: AsyncSession, data: SignupInput) -> ManagerAuthUser:
    """
    Step 1: username 중복 체크
    SELECT * FROM user WHERE username = ?
    """
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise AlreadyExistsError(
            message="이미 존재하는 사용자명입니다",
            detail={"field": "username", "value": data.username}
        )

    """
    Step 2: email 중복 체크
    SELECT * FROM user WHERE email = ?
    """
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise AlreadyExistsError(
            message="이미 존재하는 이메일입니다",
            detail={"field": "email", "value": data.email}
        )

    """
    Step 3: 비밀번호 해시화 (bcrypt, 12 rounds)
    """
    user = User(
        username=data.username,
        email=data.email,
        password=get_password_hash(data.password),  # bcrypt hash
        full_name=data.full_name or data.username,
        user_type="MASTER",  # 기본 타입
        status="ACTIVE"
    )

    """
    Step 4: DB에 저장
    INSERT INTO user (...)
    """
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user_to_graphql(user)
```

### 3.4 Database 변경사항

#### User 테이블
```sql
INSERT INTO user (username, email, password_hash, full_name, user_type, status, created_at)
VALUES (
  'newuser',
  'newuser@example.com',
  '$2b$12$...bcrypt_hash...',
  'New User Name',
  'MASTER',
  'ACTIVE',
  NOW()
)
```

---

## 4️⃣ 비밀번호 변경 (Change Password) 프로세스

### 4.1 프로세스 흐름

```
┌──────────────┐
│ 인증된 사용자 │  accessToken (로그인 필수)
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ 현재 비밀번호 + 새 비밀번호 입력         │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.changePassword()             │
│ - apolloClient.mutate({CHANGE_PASSWORD}) │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request (auth 필수)     │
│ mutation { auth { changePassword(input) }}
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: change_user_password()          │
│ 1. 현재 비밀번호 검증                    │
│ 2. 새 비밀번호 해시화                    │
│ 3. DB 업데이트                           │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     changePassword: {                    │
│       message: "비밀번호가 변경되었습니다"│
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 완료 메시지 표시                         │
└──────────────────────────────────────────┘
```

### 4.2 전달 데이터

#### 요청
```graphql
mutation ChangePassword($input: ChangePasswordInput!) {
  auth {
    changePassword(input: $input) {
      message
    }
  }
}

# Variables
{
  "input": {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }
}

# Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 응답
```json
{
  "data": {
    "auth": {
      "changePassword": {
        "message": "비밀번호가 변경되었습니다"
      }
    }
  }
}
```

### 4.3 Backend 상세 처리

```python
async def change_user_password(
    db: AsyncSession,
    user_id: UUID,
    data: ChangePasswordInput
) -> bool:
    """
    Step 1: 사용자 조회 (require_auth에서 추출한 user_id 사용)
    SELECT * FROM user WHERE id = ?
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise NotFoundError(message="사용자를 찾을 수 없습니다")

    """
    Step 2: 현재 비밀번호 검증
    verify_password(plaintext, hash)
    """
    if not user.password or not verify_password(data.current_password, user.password):
        raise UnauthorizedError(message="현재 비밀번호가 일치하지 않습니다")

    """
    Step 3: 새 비밀번호 해시화 (bcrypt, 12 rounds)
    """
    user.password = get_password_hash(data.new_password)

    """
    Step 4: DB에 저장
    UPDATE user SET password_hash = ? WHERE id = ?
    """
    await db.commit()

    return True
```

### 4.4 Database 변경사항

```sql
UPDATE user
SET password_hash = '$2b$12$...new_bcrypt_hash...'
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
```

---

## 5️⃣ 비밀번호 찾기 & 재설정 (Password Reset) 프로세스

### 5.1 비밀번호 찾기 (Forgot Password)

#### 프로세스 흐름

```
┌──────────────┐
│ 이메일 입력   │
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.forgotPassword()             │
│ - apolloClient.mutate({FORGOT_PASSWORD}) │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request                 │
│ mutation { auth { forgotPassword(input) }}
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: request_password_reset()        │
│ 1. 이메일로 사용자 조회                  │
│ 2. 재설정 토큰 생성 (32 bytes)           │
│ 3. 토큰 만료 시간 저장 (1시간)           │
│ 4. DB 업데이트                           │
│ 5. (실제: 이메일로 토큰 전송)            │
│    (개발: 토큰 응답에 포함)              │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     forgotPassword: {                    │
│       message: "이메일이 발송되었습니다", │
│       resetToken: "abc123..." (개발용)   │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 이메일 확인 안내 표시                    │
│ (실제 환경: 이메일에서 링크 클릭)        │
│ (개발 환경: 응답의 resetToken 사용)      │
└──────────────────────────────────────────┘
```

#### 전달 데이터

##### 요청
```graphql
mutation ForgotPassword($input: ResetPasswordInput!) {
  auth {
    forgotPassword(input: $input) {
      message
      resetToken
    }
  }
}

# Variables
{
  "input": {
    "email": "user@example.com"
  }
}
```

##### 응답
```json
{
  "data": {
    "auth": {
      "forgotPassword": {
        "message": "비밀번호 재설정 이메일이 발송되었습니다",
        "resetToken": "abcdefghijklmnopqrstuvwxyz1234567890"
      }
    }
  }
}
```

#### Backend 상세 처리

```python
async def request_password_reset(db: AsyncSession, email: str) -> str:
    """
    Step 1: 이메일로 사용자 조회
    SELECT * FROM user WHERE email = ?
    """
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # 보안: 이메일 열거 공격 방지
        # 존재하지 않아도 성공 응답
        return "success"

    """
    Step 2: 계정 활성 상태 확인
    """
    if user.status != "ACTIVE":
        raise ValidationError(message="비활성화된 계정입니다")

    """
    Step 3: 재설정 토큰 생성 (32 bytes, URL-safe)
    """
    reset_token = secrets.token_urlsafe(32)

    """
    Step 4: 토큰 만료 시간 저장 (1시간)
    """
    expires_at = datetime.now(UTC) + timedelta(hours=1)

    """
    Step 5: DB에 저장
    UPDATE user SET password_reset_token = ?, password_reset_token_expires_at = ?
    """
    user.password_reset_token = reset_token
    user.password_reset_token_expires_at = expires_at
    await db.commit()

    # 실제 환경: 이메일로 토큰 전송
    # TODO: send_email(email, reset_token)

    return reset_token  # 개발 환경: 응답에 포함
```

#### Database 변경사항

```sql
UPDATE user
SET password_reset_token = 'abcdefghijklmnopqrstuvwxyz1234567890',
    password_reset_token_expires_at = '2024-11-16 09:00:00'
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
```

### 5.2 비밀번호 재설정 (Reset Password)

#### 프로세스 흐름

```
┌──────────────┐
│ 재설정 토큰  │  (이메일 또는 응답에서 받음)
│ 새 비밀번호  │
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.resetPassword()              │
│ - apolloClient.mutate({RESET_PASSWORD})  │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request                 │
│ mutation { auth { resetPassword(input) }}│
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: reset_user_password()           │
│ 1. 토큰으로 사용자 조회                  │
│ 2. 토큰 만료 확인                        │
│ 3. 새 비밀번호 해시화                    │
│ 4. DB 업데이트 (토큰 삭제)               │
│ 5. 비밀번호 변경 시간 기록               │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     resetPassword: {                     │
│       message: "비밀번호가 재설정..."     │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 로그인 페이지로 리다이렉트               │
│ (새 비밀번호로 로그인)                   │
└──────────────────────────────────────────┘
```

#### 전달 데이터

##### 요청
```graphql
mutation ResetPassword($input: ResetPasswordConfirmInput!) {
  auth {
    resetPassword(input: $input) {
      message
    }
  }
}

# Variables
{
  "input": {
    "token": "abcdefghijklmnopqrstuvwxyz1234567890",
    "newPassword": "brandNewPassword789",
    "username": "user123"
  }
}
```

##### 응답
```json
{
  "data": {
    "auth": {
      "resetPassword": {
        "message": "비밀번호가 재설정되었습니다"
      }
    }
  }
}
```

#### Backend 상세 처리

```python
async def reset_user_password(
    db: AsyncSession,
    token: str | None,
    new_password: str,
    username: str | None = None
) -> bool:
    """
    Step 1: 테스트 환경 처리 (admin 계정 예외)
    """
    if username and username == "admin":
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()

        if not user:
            raise NotFoundError(message="사용자를 찾을 수 없습니다")

        user.password = get_password_hash(new_password)
        user.password_changed_at = datetime.now(UTC)
        user.password_reset_token = None
        user.password_reset_token_expires_at = None

        await db.commit()
        return True

    """
    Step 2: 일반 사용자 - 토큰 필수
    """
    if not token:
        raise ValidationError(message="토큰이 필요합니다")

    """
    Step 3: 토큰으로 사용자 조회
    SELECT * FROM user WHERE password_reset_token = ?
    """
    result = await db.execute(select(User).where(User.password_reset_token == token))
    user = result.scalar_one_or_none()

    if not user:
        raise ValidationError(message="유효하지 않거나 만료된 토큰입니다")

    """
    Step 4: 토큰 만료 시간 확인
    """
    if (not user.password_reset_token_expires_at or
        user.password_reset_token_expires_at < datetime.now(UTC)):

        # 만료된 토큰 삭제
        user.password_reset_token = None
        user.password_reset_token_expires_at = None
        await db.commit()

        raise ValidationError(message="유효하지 않거나 만료된 토큰입니다")

    """
    Step 5: 새 비밀번호 해시화 (bcrypt, 12 rounds)
    """
    user.password = get_password_hash(new_password)
    user.password_changed_at = datetime.now(UTC)

    """
    Step 6: 토큰 삭제 (재사용 방지)
    """
    user.password_reset_token = None
    user.password_reset_token_expires_at = None

    """
    Step 7: DB에 저장
    UPDATE user SET password_hash = ?, password_reset_token = NULL, ...
    """
    await db.commit()

    return True
```

#### Database 변경사항

```sql
UPDATE user
SET password_hash = '$2b$12$...new_bcrypt_hash...',
    password_changed_at = NOW(),
    password_reset_token = NULL,
    password_reset_token_expires_at = NULL
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
```

---

## 6️⃣ 로그아웃 (Logout) 프로세스

### 6.1 프로세스 흐름

```
┌──────────────┐
│ 인증된 사용자 │  accessToken
└──────┬───────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuth().logout()                       │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ authService.logout()                     │
│ - apolloClient.mutate({LOGOUT})          │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Mutation Request (auth 필수)     │
│ mutation { auth { logout } }             │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ Backend: logout mutation                 │
│ (클라이언트 기반 로그아웃)               │
│ 실제로는 단순 메시지만 반환              │
│ (선택: Redis 블랙리스트 추가)            │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ GraphQL Response                         │
│ {                                        │
│   auth: {                                │
│     logout: {                            │
│       message: "로그아웃되었습니다"       │
│     }                                    │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ useAuthStore.clearAuth()                 │
│ 1. localStorage에서 token 제거           │
│ 2. Cookie에서 token 제거                 │
│ 3. Store state 초기화                    │
│ 4. apolloClient 캐시 초기화              │
└──────┬───────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ 라우팅                                   │
│ - /signin 페이지로 이동                  │
└──────────────────────────────────────────┘
```

### 6.2 전달 데이터

#### 요청
```graphql
mutation Logout {
  auth {
    logout {
      message
    }
  }
}

# Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 응답
```json
{
  "data": {
    "auth": {
      "logout": {
        "message": "로그아웃되었습니다"
      }
    }
  }
}
```

### 6.3 Backend 상세 처리

```python
@strawberry.mutation(description="로그아웃")
@require_auth
async def logout(self, info) -> MessageResponse:
    """
    로그아웃 처리 (클라이언트 기반)

    Note:
    - 실제로는 클라이언트에서 토큰을 삭제
    - 필요시 Redis에 블랙리스트 추가 가능:

      # 추후 구현
      user_id = info.context.user_id
      blacklist_token(access_token, refresh_token, user_id)
    """
    return MessageResponse(message="로그아웃되었습니다")
```

---

## 7️⃣ 보안 기능 (Security Features)

### 7.1 비밀번호 해싱

- **알고리즘**: bcrypt
- **라운드**: 12 (기본값)
- **용도**: 회원가입, 비밀번호 변경, 비밀번호 재설정

```python
# 비밀번호 해싱
from src.core.security import get_password_hash
hashed_password = get_password_hash("plaintext_password")
# 결과: $2b$12$...bcrypt_hash...

# 비밀번호 검증
from src.core.security import verify_password
is_valid = verify_password("plaintext_password", hashed_password)
# 결과: True/False
```

### 7.2 JWT 토큰

- **Access Token**
  - 유효시간: 15분 (900초)
  - 알고리즘: HS256
  - 용도: API 요청 인증

- **Refresh Token**
  - 유효시간: 7일
  - 알고리즘: HS256
  - 용도: Access Token 갱신

- **Payload**
  ```json
  {
    "sub": "user_id",           // 주제 (사용자 ID)
    "username": "username",     // 사용자명
    "email": "email@example.com", // 이메일
    "session_id": "session_id",  // 세션 ID (signin만)
    "iat": 1700000000,          // 발급 시간
    "exp": 1700000900           // 만료 시간
  }
  ```

### 7.3 사용자 열거 공격 방지

```python
# ❌ 위험: 구체적인 오류 메시지
if not user:
    raise UnauthorizedError("사용자명이 존재하지 않습니다")  # 사용자 열거 가능
if not verify_password(password, user.password):
    raise UnauthorizedError("비밀번호가 일치하지 않습니다")  # 사용자 열거 가능

# ✅ 안전: 일반적인 오류 메시지
if not user or not verify_password(password, user.password):
    raise UnauthorizedError("사용자명 또는 비밀번호가 일치하지 않습니다")
```

### 7.4 이메일 열거 공격 방지

```python
# 비밀번호 찾기에서
result = await db.execute(select(User).where(User.email == email))
user = result.scalar_one_or_none()

if not user:
    # ✅ 존재하지 않아도 성공 응답
    return "success"  # 공격자가 이메일 존재 여부 알 수 없음
```

### 7.5 로그인 시도 기록 (LoginLog)

- 모든 로그인 시도 기록 (성공/실패)
- 저장 정보:
  - username, email
  - IP 주소, User-Agent
  - 시도 유형 (LOGIN/LOGOUT)
  - 성공 여부
  - 실패 사유 (USER_NOT_FOUND, INVALID_PASSWORD, INACTIVE_ACCOUNT)
  - 사용자 ID, 사용자 타입 (성공 시)
  - 타임스탬프

```python
await create_login_log(
    db=db,
    username="user123",
    ip_address="192.168.1.100",
    user_agent="Mozilla/5.0 ...",
    attempt_type="LOGIN",
    success=True,
    user_id=user.id,
    user_type=user.user_type,
    failure_reason=None
)
```

### 7.6 세션 추적 (Session)

- 세션 ID: URL-safe 랜덤 문자열 (32 bytes)
- 유효시간: 7일
- 저장 정보:
  - session_id, user_id
  - session_type (WEB, MOBILE, API)
  - IP 주소, User-Agent
  - 상태 (ACTIVE, EXPIRED, REVOKED)
  - 생성/만료 시간

```python
session_id = secrets.token_urlsafe(32)
# 결과: "qwertyuiopasdfghjklzxcvbnm1234567890"

await create_session(
    db=db,
    session_id=session_id,
    user_id=user.id,
    session_type="WEB",
    ip_address="192.168.1.100",
    user_agent="Mozilla/5.0 ...",
    expires_at=datetime.now(UTC) + timedelta(days=7)
)
```

### 7.7 토큰 저장 전략 (Frontend)

- **localStorage**: 주 저장소 (JS로 접근 가능)
- **Cookie**: 백업 저장소 (HTTP 헤더로 자동 전송)
- **만료**: 7일

```typescript
// localStorage에 저장
localStorage.setItem("access_token", token);
localStorage.setItem("refresh_token", token);

// Cookie에 저장 (HttpOnly 옵션 미적용 - 보안 개선 필요)
setCookie("access_token", token, 7);
setCookie("refresh_token", token, 7);
```

---

## 8️⃣ 에러 처리

### 8.1 인증 관련 에러

| 에러 코드 | HTTP | 메시지 | 상황 |
|---------|------|-------|------|
| AUTHENTICATION_REQUIRED | 401 | 사용자명 또는 비밀번호가 일치하지 않습니다 | 로그인 실패 |
| USER_NOT_FOUND | 404 | 사용자를 찾을 수 없습니다 | 토큰 갱신 시 사용자 없음 |
| VALIDATION_ERROR | 400 | 입력 정보가 유효하지 않습니다 | 필드 검증 실패 |
| ALREADY_EXISTS | 409 | 이미 존재하는 사용자명입니다 | 회원가입 중복 |
| UNAUTHORIZED | 401 | 비활성화된 계정입니다 | 계정 상태 확인 실패 |

### 8.2 Apollo ErrorLink 처리 (Frontend)

```typescript
// apolloClient.ts
const errorLink = onError(async ({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      if (error.extensions?.code === "UNAUTHENTICATED") {
        // ✅ Refresh Token으로 새 Access Token 발급
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          const newToken = await authService.refreshToken(refreshToken);

          // 새 토큰으로 요청 재시도
          operation.setContext({
            headers: {
              authorization: `Bearer ${newToken.accessToken}`
            }
          });

          return forward(operation);
        } catch (refreshError) {
          // Refresh 실패 → 로그아웃
          authStore.clearAuth();
          return;
        }
      }
    }
  }

  if (networkError) {
    console.error("Network error:", networkError);
  }
});
```

---

## 9️⃣ 데이터 흐름 다이어그램

### 전체 인증 흐름

```
Frontend                          Backend
├─ SignIn Page                    │
│  └─ username/password 입력      │
│     └─ signIn() 호출            │
│        ├─ useAuth Hook          │
│        ├─ authService           │
│        └─ apolloClient          │
│           ↓                     │
│           GraphQL Mutation (SIGNIN)
│           ────────────────────→ @ManagerAuthMutations.signin()
│                                 ├─ User 조회
│                                 ├─ 비밀번호 검증
│                                 ├─ LoginLog 기록
│                                 ├─ Session 생성
│                                 └─ JWT Token 생성
│           ←────────────────────
│           Response (Token)
│           ↓
│        useAuthStore
│        ├─ localStorage 저장
│        ├─ Cookie 저장
│        └─ getCurrentUser() 호출
│           ↓
│           GraphQL Query (GET_CURRENT_USER)
│           ────────────────────→ @Query.user()
│                                 └─ User 정보 반환
│           ←────────────────────
│           User Info
│
├─ Dashboard 로드                 │
│  ├─ 모든 요청에 Token 첨부     │
│  └─ Authorization 헤더         │
│     ────────────────────→ @require_auth
│                                 └─ Token 검증
│     ←────────────────────
│     데이터 반환
│
├─ Token 만료                      │
│  └─ Apollo ErrorLink 감지       │
│     └─ refreshToken() 호출      │
│        ↓                     │
│        GraphQL Mutation (REFRESH_TOKEN)
│        ────────────────────→ @ManagerAuthMutations.refresh_token()
│                                 └─ 새 JWT Token 생성
│        ←────────────────────
│        New Token
│        ↓
│     localStorage 업데이트
│     요청 재시도 (새 Token)
│
└─ Logout                         │
   └─ logout() 호출              │
      ├─ authService            │
      └─ apolloClient           │
         ↓                     │
         GraphQL Mutation (LOGOUT)
         ────────────────────→ @ManagerAuthMutations.logout()
                                 └─ 메시지 반환
         ←────────────────────
         Response
         ↓
      clearAuth()
      ├─ localStorage 삭제
      ├─ Cookie 삭제
      └─ /signin 리다이렉트
```

---

## 🔟 요약 (Summary)

### 인증 프로세스 체크리스트

- ✅ **회원가입**: username/email 중복 체크 → 비밀번호 해싱 → User 생성
- ✅ **로그인**: User 조회 → 비밀번호 검증 → LoginLog 기록 → Session 생성 → JWT 발급
- ✅ **토큰 갱신**: User 상태 확인 → 새 JWT 생성 (Refresh Token 사용)
- ✅ **비밀번호 변경**: 현재 비밀번호 검증 → 새 비밀번호 해싱 → DB 업데이트
- ✅ **비밀번호 찾기**: 이메일로 User 조회 → 재설정 토큰 생성 (1시간 유효) → (이메일 전송)
- ✅ **비밀번호 재설정**: 토큰 검증 → 만료 확인 → 새 비밀번호 해싱 → 토큰 삭제
- ✅ **로그아웃**: 클라이언트에서 토큰 삭제 (선택: Redis 블랙리스트)

### 보안 기능

- ✅ bcrypt 비밀번호 해싱 (12 rounds)
- ✅ JWT 토큰 (HS256, 15분/7일)
- ✅ 사용자 열거 공격 방지
- ✅ 이메일 열거 공격 방지
- ✅ LoginLog 기록 (모든 시도)
- ✅ Session 추적 (7일 유효)
- ✅ 토큰 저장소 (localStorage + Cookie)
- ✅ Apollo ErrorLink 자동 갱신

### 개선 제안

- 🔲 HttpOnly Cookie (CSRF 방지)
- 🔲 CORS 정책 강화
- 🔲 Rate Limiting (로그인 시도 제한)
- 🔲 MFA (Multi-Factor Authentication)
- 🔲 Redis 토큰 블랙리스트
- 🔲 비밀번호 정책 강화 (복잡도 검증)
- 🔲 감사 로그 (Audit Trail)

