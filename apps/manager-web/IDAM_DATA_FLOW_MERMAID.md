# IDAM 모듈 데이터 흐름 - Mermaid 다이어그램

## 1. 전체 아키텍처 계층 다이어그램

```mermaid
graph TD
    A["🖥️ PAGE/COMPONENT LAYER<br/>UsersPage<br/>UsersEdit"] -->|호출| B["🎣 HOOK LAYER<br/>useUsers<br/>useCreateUser<br/>useUpdateUser"]
    B -->|실행| C["📊 GRAPHQL LAYER<br/>GET_USERS<br/>CREATE_USER<br/>UPDATE_USER"]
    C -->|전송| D["🌐 APOLLO CLIENT<br/>Network Layer<br/>HTTP POST"]
    D -->|요청| E["⚙️ BACKEND API<br/>Python Strawberry<br/>GraphQL Server"]
    E -->|쿼리| F["🗄️ DATABASE<br/>PostgreSQL<br/>manager_users table"]

    F -->|응답| E
    E -->|변환| D
    D -->|반환| C
    C -->|업데이트| B
    B -->|상태| A

    style A fill:#FFE5B4
    style B fill:#B4E5FF
    style C fill:#B4FFB4
    style D fill:#FFB4FF
    style E fill:#FFD4B4
    style F fill:#D4FFD4
```

---

## 2. 사용자 목록 조회 (GET) - 완전 흐름

```mermaid
sequenceDiagram
    participant Page as UsersPage<br/>컴포넌트
    participant Hook as useUsers<br/>Hook
    participant GraphQL as GET_USERS<br/>쿼리
    participant Apollo as Apollo Client<br/>네트워크
    participant Backend as Backend<br/>쿼리 실행
    participant DB as PostgreSQL<br/>database_users

    Page->>Hook: useUsers({limit, offset})
    activate Hook
    Hook->>GraphQL: useQuery(GET_USERS)
    activate GraphQL
    GraphQL->>Apollo: 쿼리 객체 전달
    deactivate GraphQL

    activate Apollo
    Apollo->>Apollo: HTTP POST 생성
    Apollo->>Backend: GraphQL 요청 전송<br/>(limit, offset)
    deactivate Apollo

    activate Backend
    Backend->>DB: SELECT * FROM manager_users<br/>LIMIT 20 OFFSET 0
    deactivate Backend

    activate DB
    DB->>DB: 데이터 조회
    DB-->>Backend: 행 데이터 반환
    deactivate DB

    activate Backend
    Backend->>Backend: ManagerUser 모델<br/>→ ManagerUser Type 변환<br/>(snake_case → camelCase)
    Backend-->>Apollo: JSON 응답<br/>{users: [...]}
    deactivate Backend

    activate Apollo
    Apollo->>Apollo: 캐시 저장
    Apollo-->>Hook: 데이터 반환
    deactivate Apollo

    activate Hook
    Hook-->>Page: {data, loading, error}
    deactivate Hook

    Page->>Page: 상태 업데이트
    Page->>Page: UsersTable 렌더링
```

### 요청 데이터

```json
{
  "operationName": "GetUsers",
  "variables": {
    "limit": 20,
    "offset": 0,
    "userType": null,
    "status": null
  },
  "query": "query GetUsers(...) { users(...) { id userType fullName ... } }"
}
```

### 응답 데이터

```json
{
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "userType": "MASTER",
        "fullName": "Admin User",
        "email": "admin@example.com",
        "status": "ACTIVE",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 3. 사용자 생성 (CREATE) - 완전 흐름

```mermaid
sequenceDiagram
    participant Form as UsersEdit<br/>폼 컴포넌트
    participant Hook as useCreateUser<br/>Hook
    participant GraphQL as CREATE_USER<br/>뮤테이션
    participant Apollo as Apollo Client<br/>네트워크
    participant Backend as Backend<br/>뮤테이션 실행
    participant DB as PostgreSQL<br/>manager_users

    Form->>Form: handleSubmit(formData)
    Form->>Hook: createUser({variables})
    activate Hook
    Hook->>GraphQL: useMutation(CREATE_USER)
    activate GraphQL
    GraphQL->>Apollo: 뮤테이션 객체 전달
    deactivate GraphQL

    activate Apollo
    Apollo->>Apollo: HTTP POST 생성
    Apollo->>Backend: GraphQL 뮤테이션 요청<br/>(input: CreateUserInput)
    deactivate Apollo

    activate Backend
    Backend->>Backend: 비밀번호 해싱<br/>bcrypt.hash(password)
    Backend->>DB: INSERT INTO manager_users<br/>(user_type, full_name, ...)
    deactivate Backend

    activate DB
    DB->>DB: 데이터 삽입
    DB-->>Backend: 생성된 행 반환
    deactivate DB

    activate Backend
    Backend->>Backend: ManagerUserModel<br/>→ ManagerUser Type 변환
    Backend-->>Apollo: 생성된 사용자<br/>(JSON 응답)
    deactivate Backend

    activate Apollo
    Apollo->>Apollo: 캐시 업데이트
    Apollo->>Apollo: refetchQueries 실행<br/>(GET_USERS)
    Apollo-->>Hook: 데이터 반환
    deactivate Apollo

    activate Hook
    Hook->>Hook: 목록 자동 새로고침
    Hook-->>Form: {data, loading}
    deactivate Hook

    Form->>Form: toast.success() 표시
    Form->>Form: 폼 닫기
```

### 요청 데이터

```json
{
  "operationName": "CreateUser",
  "variables": {
    "input": {
      "userType": "MASTER",
      "fullName": "New User",
      "email": "user@example.com",
      "username": "newuser",
      "password": "SecurePassword123!",
      "phone": "010-1234-5678",
      "department": "Engineering"
    }
  },
  "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { ... } }"
}
```

### 응답 데이터

```json
{
  "data": {
    "createUser": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userType": "MASTER",
      "fullName": "New User",
      "email": "user@example.com",
      "username": "newuser",
      "status": "ACTIVE",
      "createdAt": "2024-01-20T15:30:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  }
}
```

---

## 4. 타입 변환 흐름

```mermaid
graph LR
    A["Frontend<br/>camelCase<br/>CreateUserInput"] -->|GraphQL로 변환| B["GraphQL<br/>camelCase<br/>CreateUserInput"]
    B -->|Strawberry 자동변환| C["Backend<br/>snake_case<br/>ManagerUserCreateInput"]
    C -->|SQLAlchemy 매핑| D["Database<br/>snake_case<br/>manager_users<br/>TABLE"]

    D -->|모델 조회| C
    C -->|Strawberry 역변환<br/>snake_case → camelCase| B
    B -->|응답 전송| A

    style A fill:#FFE5B4
    style B fill:#B4FFB4
    style C fill:#FFD4B4
    style D fill:#D4FFD4
```

### 필드명 매핑 예시

```mermaid
graph LR
    A["fullName"] -->|GraphQL 그대로| B["fullName"]
    B -->|Strawberry<br/>변환| C["full_name"]
    C -->|DB 필드| D["full_name"]

    E["userType"] -->|GraphQL 그대로| F["userType"]
    F -->|Strawberry<br/>변환| G["user_type"]
    G -->|DB 필드| H["user_type"]

    I["createdAt"] -->|GraphQL 그대로| J["createdAt"]
    J -->|Strawberry<br/>변환| K["created_at"]
    K -->|DB 필드| L["created_at"]

    style A fill:#FFE5B4
    style C fill:#FFD4B4
    style D fill:#D4FFD4
```

---

## 5. Hook과 Service의 관계

```mermaid
graph TD
    subgraph Frontend["Frontend (React)"]
        Component["React Component<br/>UsersPage<br/>UsersEdit"]
        Hook["Hook Layer<br/>useUsers<br/>useCreateUser"]
        Component -->|호출| Hook
    end

    subgraph NonReact["Non-React Context<br/>(API Routes, Utils)"]
        Service["Service Layer<br/>usersService"]
    end

    subgraph GraphQL["GraphQL Layer"]
        Queries["Queries<br/>GET_USERS<br/>GET_USER"]
        Mutations["Mutations<br/>CREATE_USER<br/>UPDATE_USER"]
    end

    subgraph Network["Network"]
        Apollo["Apollo Client<br/>HTTP/GraphQL"]
    end

    Hook -->|실행| Queries
    Hook -->|실행| Mutations
    Service -->|실행| Queries
    Service -->|실행| Mutations

    Queries -->|전송| Apollo
    Mutations -->|전송| Apollo

    style Frontend fill:#FFE5B4
    style NonReact fill:#B4FFB4
    style GraphQL fill:#B4E5FF
    style Network fill:#FFB4FF
```

---

## 6. 상태 관리 흐름 (Apollo Cache)

```mermaid
graph LR
    A["Component"] -->|useQuery| B["Apollo Cache"]
    B -->|캐시 있음?| C{캐시 확인}
    C -->|Yes| D["캐시된 데이터 반환<br/>(즉시)"]
    C -->|No| E["네트워크 요청<br/>fetchPolicy"]

    E -->|network-only| F["항상 새로 조회"]
    E -->|cache-first| G["캐시 먼저, 없으면 요청"]
    E -->|cache-and-network| H["캐시 반환 + 백그라운드 갱신"]

    F -->|응답| I["캐시 업데이트"]
    G -->|응답| I
    H -->|응답| I

    I -->|업데이트| B
    B -->|구독| J["Component 리렌더링"]

    style A fill:#FFE5B4
    style B fill:#B4E5FF
    style C fill:#FFD4B4
    style J fill:#B4FFB4
```

---

## 7. 에러 처리 흐름

```mermaid
graph TD
    A["GraphQL 요청"] -->|실행| B{성공?}

    B -->|Yes| C["데이터 반환"]
    C -->|캐시 저장| D["Hook/Service 반환"]
    D -->|Component 업데이트| E["UI 렌더링"]

    B -->|No| F{에러 타입?}

    F -->|네트워크 에러| G["NetworkError"]
    F -->|GraphQL 에러| H["GraphQLError"]
    F -->|타임아웃| I["TimeoutError"]

    G -->|재시도| J["retry 로직"]
    H -->|사용자 알림| K["toast.error()"]
    I -->|타임아웃 알림| L["타임아웃 메시지"]

    J -->|재시도 실패| K
    K -->|사용자 표시| E
    L -->|사용자 표시| E

    style A fill:#FFE5B4
    style C fill:#B4FFB4
    style E fill:#B4FFB4
    style G fill:#FFB4B4
    style H fill:#FFB4B4
    style I fill:#FFB4B4
```

---

## 8. 6개 IDAM 모듈 구조 (동일 패턴)

```mermaid
graph TB
    Users["👤 Users Module<br/>사용자 관리"]
    Roles["🔐 Roles Module<br/>역할 관리"]
    ApiKeys["🔑 API Keys Module<br/>API 키 관리"]
    Sessions["📱 Sessions Module<br/>세션 관리"]
    Permissions["✅ Permissions Module<br/>권한 관리"]
    LoginLogs["📋 Login Logs Module<br/>로그인 기록"]

    subgraph SharedPattern["공유 아키텍처 패턴"]
        direction LR
        Component["Component<br/>📄"]
        Hook["Hook<br/>🎣"]
        GraphQL["GraphQL<br/>📊"]
        Types["Types<br/>📋"]
        Service["Service<br/>⚙️"]

        Component -->|호출| Hook
        Hook -->|실행| GraphQL
        Hook -->|사용| Types
        Service -->|호출| GraphQL
        Service -->|사용| Types
    end

    Users --> SharedPattern
    Roles --> SharedPattern
    ApiKeys --> SharedPattern
    Sessions --> SharedPattern
    Permissions --> SharedPattern
    LoginLogs --> SharedPattern

    SharedPattern -->|모두 동일| Backend["Backend<br/>Python Strawberry<br/>GraphQL Server"]

    Backend -->|쿼리| DB["PostgreSQL<br/>Database"]

    style SharedPattern fill:#FFE5B4
    style Backend fill:#B4E5FF
    style DB fill:#B4FFB4
```

---

## 9. 단일 모듈 상세 구조 (Users 예시)

```mermaid
graph TD
    subgraph Frontend["Frontend - Manager Web"]
        Page["📄 page.tsx<br/>UsersPage"]
        EditComp["📄 users-edit.tsx<br/>폼 컴포넌트"]
        TableComp["📄 users-table.tsx<br/>테이블"]
        FiltersComp["📄 users-filters.tsx<br/>필터"]
    end

    subgraph HookLayer["Hook Layer"]
        UseUsers["🎣 useUsers()<br/>목록 조회"]
        UseCreate["🎣 useCreateUser()<br/>생성"]
        UseUpdate["🎣 useUpdateUser()<br/>수정"]
    end

    subgraph GraphQLLayer["GraphQL Layer"]
        GetUsersQ["📊 GET_USERS<br/>쿼리"]
        GetUserQ["📊 GET_USER<br/>쿼리"]
        CreateM["📊 CREATE_USER<br/>뮤테이션"]
        UpdateM["📊 UPDATE_USER<br/>뮤테이션"]
    end

    subgraph TypesLayer["Types Layer"]
        User["📋 User"]
        CreateInput["📋 CreateUserInput"]
        UpdateInput["📋 UpdateUserInput"]
        QueryVars["📋 UsersQueryVariables"]
        Responses["📋 Response Types"]
    end

    subgraph ServiceLayer["Service Layer"]
        UserService["⚙️ usersService<br/>Non-React 호출"]
    end

    Page -->|호출| UseUsers
    EditComp -->|호출| UseCreate
    EditComp -->|호출| UseUpdate
    TableComp -->|사용| UseUsers
    FiltersComp -->|수정| UseUsers

    UseUsers -->|실행| GetUsersQ
    UseUsers -->|실행| GetUserQ
    UseCreate -->|실행| CreateM
    UseUpdate -->|실행| UpdateM

    GetUsersQ -->|사용| QueryVars
    GetUserQ -->|사용| QueryVars
    CreateM -->|사용| CreateInput
    UpdateM -->|사용| UpdateInput

    GetUsersQ -->|반환| Responses
    CreateM -->|반환| Responses
    UpdateM -->|반환| Responses

    UserService -->|호출| GetUsersQ
    UserService -->|호출| GetUserQ
    UserService -->|호출| CreateM
    UserService -->|호출| UpdateM

    style Frontend fill:#FFE5B4
    style HookLayer fill:#B4E5FF
    style GraphQLLayer fill:#B4FFB4
    style TypesLayer fill:#FFB4FF
    style ServiceLayer fill:#FFD4B4
```

---

## 10. 데이터 흐름 타임라인 (시간 순서)

```mermaid
timeline
    title 사용자 목록 조회 실행 타임라인

    section 1단계: 초기화
        T0: UsersPage 컴포넌트 렌더링
        T1: useUsers({limit:20}) 호출 시작
        T2: loading = true 설정

    section 2단계: 요청 생성
        T3: GET_USERS 쿼리 구성
        T4: Apollo Client 준비
        T5: HTTP POST 생성

    section 3단계: 전송
        T6: 네트워크 요청 전송
        T7: Backend 도착
        T8: GraphQL 파서 처리

    section 4단계: 실행
        T9: users() 쿼리 실행
        T10: Database SELECT 실행
        T11: 데이터 조회 완료

    section 5단계: 응답
        T12: Type 변환 (snake_case → camelCase)
        T13: JSON 응답 생성
        T14: 클라이언트로 전송

    section 6단계: 처리
        T15: Apollo Cache 업데이트
        T16: Hook state 업데이트
        T17: loading = false 설정
        T18: Component 리렌더링

    section 7단계: 렌더링
        T19: UsersTable 렌더링
        T20: 사용자 목록 표시 완료
```

---

## 11. 동시 요청 처리 (병렬 쿼리)

```mermaid
graph LR
    Component["Component"]

    Query1["useUsers()"]
    Query2["usePermissions()"]
    Query3["useRoles()"]

    Apollo["Apollo Client<br/>배치 처리"]

    Request1["GET_USERS"]
    Request2["GET_PERMISSIONS"]
    Request3["GET_ROLES"]

    Backend["Backend"]

    Response["통합 응답"]

    Component -->|병렬 호출| Query1
    Component -->|병렬 호출| Query2
    Component -->|병렬 호출| Query3

    Query1 -->|등록| Apollo
    Query2 -->|등록| Apollo
    Query3 -->|등록| Apollo

    Apollo -->|최적화 후| Request1
    Apollo -->|단일 HTTP| Request2
    Apollo -->|요청 전송| Request3

    Request1 -->|한 번에| Backend
    Request2 -->|처리| Backend
    Request3 -->|응답| Response

    Response -->|배치 응답| Apollo
    Apollo -->|각 Query 업데이트| Query1
    Apollo -->|각 Query 업데이트| Query2
    Apollo -->|각 Query 업데이트| Query3

    style Component fill:#FFE5B4
    style Apollo fill:#B4E5FF
    style Backend fill:#B4FFB4
    style Response fill:#FFD4B4
```

---

## 12. 캐시 무효화 및 재조회 (refetchQueries)

```mermaid
graph TD
    A["Create/Update<br/>뮤테이션 실행"] -->|성공| B["Mutation 응답<br/>새 데이터"]

    B -->|Apollo Cache| C["기존 캐시<br/>업데이트"]

    B -->|refetchQueries| D["GET_USERS<br/>재실행"]

    D -->|자동| E["Database<br/>최신 데이터 조회"]

    E -->|응답| F["Apollo Cache<br/>다시 업데이트"]

    C -->|hook 업데이트| G["Component 1<br/>리렌더링"]
    F -->|hook 업데이트| H["Component 2<br/>리렌더링"]

    G -->|UI| I["생성 폼 닫기"]
    H -->|UI| J["목록 새로고침"]

    style A fill:#FFE5B4
    style B fill:#B4FFB4
    style C fill:#B4E5FF
    style D fill:#B4E5FF
    style F fill:#B4E5FF
    style I fill:#FFD4B4
    style J fill:#FFD4B4
```

---

## 13. 에러 재시도 메커니즘

```mermaid
graph TD
    A["GraphQL 요청"] -->|실행| B{성공?}

    B -->|Yes| C["데이터 반환"]
    B -->|No| D{재시도?}

    D -->|1차 실패| E["Attempt 1<br/>즉시 재시도"]
    E -->|Success| C
    E -->|Fail| F["Attempt 2<br/>1초 대기"]

    F -->|Success| C
    F -->|Fail| G["Attempt 3<br/>2초 대기"]

    G -->|Success| C
    G -->|Fail| H["최대 재시도 초과"]

    H -->|에러 로깅| I["토스트 알림"]
    I -->|사용자에게| J["에러 메시지 표시"]

    C -->|성공| K["UI 업데이트"]
    J -->|실패| K

    style A fill:#FFE5B4
    style C fill:#B4FFB4
    style H fill:#FFB4B4
    style I fill:#FFB4B4
    style J fill:#FFB4B4
    style K fill:#B4E5FF
```

---

## 요약

### 주요 특징
- **계층 분리:** Page → Hook → GraphQL → Apollo → Backend → Database
- **타입 안전성:** TypeScript 전체 타입 지정
- **자동 변환:** Strawberry의 snake_case ↔ camelCase 자동 변환
- **캐시 관리:** Apollo Client 자동 캐시
- **재조회 자동화:** refetchQueries로 데이터 동기화
- **6개 모듈:** 동일한 패턴으로 구성

### 모듈 목록
1. **Users** - 사용자 관리
2. **Roles** - 역할 관리
3. **API Keys** - API 키 관리
4. **Sessions** - 세션 관리
5. **Permissions** - 권한 관리
6. **Login Logs** - 로그인 기록
