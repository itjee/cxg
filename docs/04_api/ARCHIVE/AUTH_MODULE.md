# 인증 모듈 (Authentication Module)

## 개요

관리자 시스템의 인증 기능을 담당하는 모듈입니다. JWT 기반의 토큰 인증을 제공합니다.

## 구조

```
modules/manager/auth/
├── __init__.py      # 모듈 exports
├── router.py        # API 엔드포인트
├── schemas.py       # Pydantic 스키마
├── service.py       # 비즈니스 로직
└── model.py         # ORM 모델
```

## API 엔드포인트

### 1. 회원가입

**POST** `/api/v1/manager/auth/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**응답 (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2025-10-15T16:35:00Z"
  },
  "error": null
}
```

### 2. 로그인

**POST** `/api/v1/manager/auth/login`

```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900
  },
  "error": null
}
```

### 3. 현재 사용자 정보

**GET** `/api/v1/manager/auth/me`

**헤더**
```
Authorization: Bearer <access_token>
```

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2025-10-15T16:35:00Z"
  },
  "error": null
}
```

### 4. 토큰 갱신

**POST** `/api/v1/manager/auth/refresh`

**헤더**
```
Authorization: Bearer <access_token>
```

**요청**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900
  },
  "error": null
}
```

### 5. 비밀번호 변경

**POST** `/api/v1/manager/auth/change-password`

**헤더**
```
Authorization: Bearer <access_token>
```

**요청**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newPassword123"
}
```

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "message": "비밀번호가 변경되었습니다"
  },
  "error": null
}
```

### 6. 로그아웃

**POST** `/api/v1/manager/auth/logout`

**헤더**
```
Authorization: Bearer <access_token>
```

**응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "message": "로그아웃되었습니다"
  },
  "error": null
}
```

## 데이터베이스 스키마

### User 테이블 (idam.user)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 사용자 ID |
| created_at | TIMESTAMP | NOT NULL | 생성 일시 |
| updated_at | TIMESTAMP | NULL | 수정 일시 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 사용자명 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호 해시 |
| full_name | VARCHAR(100) | NOT NULL | 전체 이름 |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | 활성 여부 |

**인덱스**
- `ix_user_username` - username
- `ix_user_email` - email
- `ix_user_is_active` - is_active

## 보안

### 비밀번호 해싱
- **알고리즘**: bcrypt
- **라이브러리**: passlib

### JWT 토큰
- **알고리즘**: HS256
- **Access Token 만료**: 15분
- **Refresh Token 만료**: 7일
- **라이브러리**: python-jose

### 비밀번호 정책
- 최소 8자 이상
- 영문, 숫자 조합 권장 (현재 미강제)

## 사용 예시

### Python (httpx)

```python
import httpx

async with httpx.AsyncClient() as client:
    # 회원가입
    response = await client.post(
        "http://localhost:8000/api/v1/manager/auth/register",
        json={
            "username": "john_doe",
            "email": "john@example.com",
            "password": "password123",
            "full_name": "John Doe"
        }
    )
    
    # 로그인
    response = await client.post(
        "http://localhost:8000/api/v1/manager/auth/login",
        json={
            "username": "john_doe",
            "password": "password123"
        }
    )
    token = response.json()["data"]["access_token"]
    
    # 인증이 필요한 API 호출
    response = await client.get(
        "http://localhost:8000/api/v1/manager/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
```

### JavaScript (fetch)

```javascript
// 로그인
const loginResponse = await fetch('http://localhost:8000/api/v1/manager/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'password123',
  }),
});

const { data } = await loginResponse.json();
const token = data.access_token;

// 인증이 필요한 API 호출
const userResponse = await fetch('http://localhost:8000/api/v1/manager/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## 테스트

### 단위 테스트 실행

```bash
pytest tests/unit/modules/manager/auth/
```

### 통합 테스트 실행

```bash
pytest tests/integration/test_auth.py
```

### 전체 테스트 실행

```bash
pytest
```

## 마이그레이션

### 마이그레이션 실행

```bash
# 데이터베이스에 테이블 생성
alembic upgrade head
```

### 마이그레이션 롤백

```bash
# 한 단계 이전으로 롤백
alembic downgrade -1
```

## 향후 개선 사항

- [ ] 2FA (Two-Factor Authentication) 지원
- [ ] 소셜 로그인 (OAuth2) 지원
- [ ] 비밀번호 재설정 기능 완성
- [ ] 로그인 시도 제한 (Rate Limiting)
- [ ] 토큰 블랙리스트 (Redis)
- [ ] 세션 관리 (다중 디바이스)
- [ ] 비밀번호 정책 강화
- [ ] 감사 로그 (로그인 이력)
