# GraphQL API 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1단계: 환경 설정

```bash
cd apps/backend-api

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2단계: 환경 변수 설정

`.env` 파일 생성:
```bash
cp .env.example .env
```

필수 설정 수정:
```bash
# Central Admin DB (테넌트 메타데이터)
CENTRAL_ADMIN_DATABASE_URL=postgresql://admin:password@localhost:5432/central_admin

# Manager DB (기존 관리자 DB)
MANAGER_DATABASE_URL=postgresql://admin:password@localhost:5432/mgmt

# 보안 키 (반드시 변경!)
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
```

### 3단계: 데이터베이스 초기화

```bash
# Central Admin DB 생성
createdb central_admin

# 마이그레이션 적용
alembic -c alembic_central_admin.ini upgrade head
```

### 4단계: 서버 시작

```bash
uvicorn src.main:app --reload --port 8100
```

### 5단계: GraphQL Playground 접속

브라우저에서 http://localhost:8100/graphql 접속

---

## 📝 첫 번째 쿼리 실행

### 1. 로그인 (JWT 토큰 발급)

```graphql
mutation Login {
  login(username: "admin", password: "admin123") {
    accessToken
    refreshToken
    user {
      id
      username
      role
    }
  }
}
```

### 2. 헤더에 토큰 추가

GraphQL Playground 하단 "HTTP HEADERS":
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```

### 3. 사용자 목록 조회

```graphql
query GetUsers {
  users(first: 10) {
    edges {
      node {
        id
        username
        fullName
        email
        department {
          name
        }
      }
    }
    pageInfo {
      totalCount
      hasNextPage
    }
  }
}
```

### 4. 사용자 생성

```graphql
mutation CreateUser {
  createUser(input: {
    username: "newuser"
    email: "new@example.com"
    password: "SecurePass123!"
    fullName: "New User"
  }) {
    id
    username
    email
    createdAt
  }
}
```

---

## 🎯 주요 쿼리 템플릿

### 내 정보 조회
```graphql
query Me {
  me {
    id
    username
    fullName
    email
    role {
      name
      permissions
    }
  }
}
```

### 페이지네이션
```graphql
query UsersWithPagination($first: Int!, $after: String) {
  users(first: $first, after: $after) {
    edges {
      cursor
      node {
        id
        username
      }
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}

# Variables
{
  "first": 20,
  "after": null
}
```

### 검색 및 필터
```graphql
query SearchUsers($search: String, $isActive: Boolean) {
  users(first: 20, search: $search, isActive: $isActive) {
    edges {
      node {
        id
        username
        fullName
        isActive
      }
    }
  }
}

# Variables
{
  "search": "john",
  "isActive": true
}
```

---

## 🔧 트러블슈팅

### 문제: "인증이 필요합니다"

**원인**: JWT 토큰이 없거나 만료됨

**해결**:
1. Login mutation으로 새 토큰 발급
2. HTTP Headers에 토큰 추가
3. 토큰 만료 시간 확인 (기본 15분)

### 문제: "테넌트를 찾을 수 없습니다"

**원인**: JWT에 tenant_key가 없거나 잘못됨

**해결**:
1. 토큰 페이로드 확인 (jwt.io)
2. Central Admin DB에 테넌트 등록 확인
3. 테넌트 프로비저닝 스크립트 실행

### 문제: "권한이 부족합니다"

**원인**: 현재 사용자가 해당 작업 권한 없음

**해결**:
1. 사용자 역할 확인 (me 쿼리)
2. 필요 권한 확인 (예: users:write)
3. 관리자에게 권한 요청

---

## 📚 다음 단계

1. [GraphQL 개발 가이드 전체 문서](./GraphQL_개발가이드.md) 읽기
2. [테넌트 프로비저닝](./GraphQL_개발가이드.md#9-마이그레이션-및-프로비저닝) 실습
3. [DataLoader로 N+1 문제 해결](./GraphQL_개발가이드.md#8-데이터로더와-성능-최적화) 학습
4. 실제 비즈니스 로직 구현

---

## 💡 유용한 팁

### GraphQL Introspection 쿼리
```graphql
# 사용 가능한 모든 타입 조회
{
  __schema {
    types {
      name
      description
    }
  }
}

# 특정 타입의 필드 조회
{
  __type(name: "User") {
    fields {
      name
      type {
        name
      }
    }
  }
}
```

### 앨리어스 사용
```graphql
query {
  activeUsers: users(isActive: true, first: 10) {
    edges {
      node {
        id
        username
      }
    }
  }
  
  inactiveUsers: users(isActive: false, first: 10) {
    edges {
      node {
        id
        username
      }
    }
  }
}
```

### 프래그먼트 사용
```graphql
fragment UserFields on User {
  id
  username
  fullName
  email
}

query {
  me {
    ...UserFields
    role {
      name
    }
  }
  
  users(first: 5) {
    edges {
      node {
        ...UserFields
      }
    }
  }
}
```

---

**도움이 필요하신가요?**
- 📖 [전체 개발 가이드](./GraphQL_개발가이드.md)
- 🐛 이슈 발생 시: GitHub Issues
- 💬 질문: 개발팀 Slack 채널
