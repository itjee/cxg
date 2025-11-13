# API 규격

## API 설계 원칙

### 1. RESTful 원칙

- 리소스 중심 설계
- HTTP 메서드 의미론적 사용
- 명확한 URL 구조
- 무상태(Stateless) 통신

### 2. 일관성

- 동일한 패턴 적용
- 예측 가능한 응답 구조
- 표준화된 에러 코드

### 3. 확장성

- 버저닝 지원
- 하위 호환성 유지
- 점진적 개선 가능

## API 버저닝

### URL 기반 버저닝

```
/api/v1/mgmt/...    # 관리자 API v1
/api/v1/tnnt/...    # 테넌트 API v1
/api/v2/mgmt/...    # 관리자 API v2 (미래)
```

### 버전 관리 전략

- Major 버전: Breaking Changes
- Minor 버전: 새 기능 추가 (하위 호환)
- Patch 버전: 버그 수정

## URL 구조

### 기본 구조

```
/api/{version}/{system}/{module}/{resource}/{id?}/{action?}
```

### 예시

```
GET     /api/v1/mgmt/idam/users
GET     /api/v1/mgmt/idam/users/{id}
POST    /api/v1/mgmt/idam/users
PUT     /api/v1/mgmt/idam/users/{id}
DELETE  /api/v1/mgmt/idam/users/{id}

POST    /api/v1/mgmt/idam/users/{id}/activate
POST    /api/v1/mgmt/idam/users/{id}/deactivate
```

## HTTP 메서드

### GET - 조회

```
GET /api/v1/mgmt/idam/users           # 목록 조회
GET /api/v1/mgmt/idam/users/{id}      # 단일 조회
```

### POST - 생성

```
POST /api/v1/mgmt/idam/users          # 새 리소스 생성
POST /api/v1/mgmt/idam/users/{id}/activate  # 특수 액션
```

### PUT - 전체 수정

```
PUT /api/v1/mgmt/idam/users/{id}      # 전체 필드 수정
```

### PATCH - 부분 수정

```
PATCH /api/v1/mgmt/idam/users/{id}    # 일부 필드만 수정
```

### DELETE - 삭제

```
DELETE /api/v1/mgmt/idam/users/{id}   # 리소스 삭제
```

## 요청 형식

### 헤더

```http
Content-Type: application/json
Authorization: Bearer {access_token}
Accept: application/json
X-Tenant-ID: {tenant_id}  (테넌트 API만)
```

### Query Parameters

```
# 페이징
?page=1&size=20

# 정렬
?sort=-created_at,+username

# 검색
?search=john

# 필터
?status=ACTIVE&is_deleted=false

# 날짜 범위
?start_date=2025-01-01&end_date=2025-01-31
```

### Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

## 응답 형식

### Envelope 구조

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### 성공 응답

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "error": null
}
```

### 에러 응답

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이미 존재하는 사용자명입니다",
    "detail": {
      "field": "username",
      "value": "john_doe"
    }
  }
}
```

### 목록 응답 (페이징)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "username": "user1",
        "email": "user1@example.com"
      },
      {
        "id": "...",
        "username": "user2",
        "email": "user2@example.com"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 20,
    "pages": 5
  },
  "error": null
}
```

## HTTP 상태 코드

### 2xx 성공

- **200 OK**: GET, PUT 성공
- **201 Created**: POST 생성 성공
- **204 No Content**: DELETE 성공

### 4xx 클라이언트 에러

- **400 Bad Request**: 잘못된 요청 (검증 실패)
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음
- **409 Conflict**: 충돌 (중복 등)
- **422 Unprocessable Entity**: 처리 불가능한 엔티티

### 5xx 서버 에러

- **500 Internal Server Error**: 서버 내부 오류
- **503 Service Unavailable**: 서비스 이용 불가

## 에러 코드

### 시스템 에러

```
INTERNAL_ERROR          # 서버 내부 오류
DATABASE_ERROR          # 데이터베이스 오류
NETWORK_ERROR           # 네트워크 오류
TIMEOUT_ERROR           # 타임아웃
```

### 인증/권한 에러

```
AUTHENTICATION_REQUIRED # 인증 필요
INVALID_TOKEN           # 유효하지 않은 토큰
TOKEN_EXPIRED           # 토큰 만료
PERMISSION_DENIED       # 권한 없음
INVALID_CREDENTIALS     # 잘못된 인증 정보
```

### 검증 에러

```
VALIDATION_ERROR        # 검증 실패
INVALID_INPUT           # 잘못된 입력
MISSING_REQUIRED_FIELD  # 필수 필드 누락
INVALID_FORMAT          # 형식 오류
```

### 비즈니스 에러

```
RESOURCE_NOT_FOUND      # 리소스 없음
RESOURCE_ALREADY_EXISTS # 리소스 이미 존재
RESOURCE_CONFLICT       # 리소스 충돌
OPERATION_NOT_ALLOWED   # 허용되지 않은 작업
INSUFFICIENT_BALANCE    # 잔액 부족
QUOTA_EXCEEDED          # 할당량 초과
```

## 인증

### JWT 토큰 기반 인증

```http
POST /api/v1/mgmt/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  },
  "error": null
}
```

### 토큰 사용

```http
GET /api/v1/mgmt/idam/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 토큰 갱신

```http
POST /api/v1/mgmt/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 권한

### 권한 기반 접근 제어

```
user:read       # 사용자 조회
user:create     # 사용자 생성
user:update     # 사용자 수정
user:delete     # 사용자 삭제
user:*          # 모든 사용자 권한
```

### 권한 체크

```http
DELETE /api/v1/mgmt/idam/users/{id}
Authorization: Bearer {token}

# 토큰에 user:delete 권한이 없으면 403 Forbidden
```

## Rate Limiting

### 제한 헤더

```http
X-RateLimit-Limit: 1000        # 시간당 최대 요청 수
X-RateLimit-Remaining: 999     # 남은 요청 수
X-RateLimit-Reset: 1642262400  # 리셋 시간 (Unix timestamp)
```

### 제한 초과 시

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "시간당 요청 제한을 초과했습니다",
    "detail": {
      "limit": 1000,
      "retryAfter": 3600
    }
  }
}
```

## 필터링과 정렬

### 필터링

```
# 단일 필드
?status=ACTIVE

# 여러 필드
?status=ACTIVE&is_deleted=false

# 날짜 범위
?created_at_gte=2025-01-01&created_at_lte=2025-01-31

# 검색 (부분 일치)
?search=john
```

### 정렬

```
# 단일 필드 (오름차순)
?sort=username

# 단일 필드 (내림차순)
?sort=-created_at

# 여러 필드
?sort=-created_at,+username
```

## 페이징

### Offset-based Pagination

```
GET /api/v1/mgmt/idam/users?page=1&size=20

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "size": 20,
    "pages": 5
  },
  "error": null
}
```

### Cursor-based Pagination (대용량 데이터)

```
GET /api/v1/mgmt/idam/users?cursor=abc123&size=20

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "nextCursor": "def456",
    "hasMore": true
  },
  "error": null
}
```

## 검색

### 전문 검색

```
GET /api/v1/tnnt/adm/products?q=노트북&fields=name,description

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "total": 15,
    "took": 23,  # 검색 소요 시간 (ms)
    "maxScore": 5.2
  },
  "error": null
}
```

## 배치 작업

### 배치 생성

```http
POST /api/v1/mgmt/idam/users/batch
Content-Type: application/json

{
  "items": [
    {
      "username": "user1",
      "email": "user1@example.com",
      "password": "password123"
    },
    {
      "username": "user2",
      "email": "user2@example.com",
      "password": "password123"
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "created": 2,
    "failed": 0,
    "errors": []
  },
  "error": null
}
```

## 파일 업로드

### Multipart Form Data

```http
POST /api/v1/tnnt/com/attachments
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

[binary data]
--boundary--

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "filename": "document.pdf",
    "size": 1024000,
    "contentType": "application/pdf",
    "url": "https://storage.example.com/..."
  },
  "error": null
}
```

## 비동기 작업

### 작업 시작

```http
POST /api/v1/tnnt/bim/reports/generate
Content-Type: application/json

{
  "reportType": "SALES_ANALYSIS",
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  }
}

Response:
{
  "success": true,
  "data": {
    "jobId": "job-123",
    "status": "PENDING",
    "statusUrl": "/api/v1/tnnt/jobs/job-123"
  },
  "error": null
}
```

### 작업 상태 조회

```http
GET /api/v1/tnnt/jobs/job-123

Response:
{
  "success": true,
  "data": {
    "jobId": "job-123",
    "status": "COMPLETED",  # PENDING, RUNNING, COMPLETED, FAILED
    "progress": 100,
    "result": {
      "fileUrl": "https://storage.example.com/report.pdf"
    },
    "startedAt": "2025-01-15T10:00:00Z",
    "completedAt": "2025-01-15T10:05:00Z"
  },
  "error": null
}
```

## 웹훅

### 웹훅 등록

```http
POST /api/v1/mgmt/intg/webhooks
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["user.created", "user.updated", "user.deleted"],
  "secret": "webhook-secret-key"
}

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "url": "https://example.com/webhook",
    "events": ["user.created", "user.updated", "user.deleted"],
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "error": null
}
```

### 웹훅 페이로드

```http
POST https://example.com/webhook
Content-Type: application/json
X-Webhook-Signature: sha256=...
X-Webhook-Event: user.created
X-Webhook-ID: webhook-msg-123

{
  "id": "evt-123",
  "event": "user.created",
  "timestamp": "2025-01-15T10:00:00Z",
  "data": {
    "id": "...",
    "username": "new_user",
    "email": "new@example.com"
  }
}
```

### 서명 검증

```python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected_signature = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected_signature}", signature)
```

## CORS

### CORS 헤더

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Tenant-ID
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true
```

### Preflight 요청

```http
OPTIONS /api/v1/mgmt/idam/users
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

Response:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 캐싱

### Cache-Control 헤더

```http
# 캐시 가능 (공개)
Cache-Control: public, max-age=3600

# 캐시 가능 (비공개)
Cache-Control: private, max-age=300

# 캐시 불가
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### ETag

```http
GET /api/v1/mgmt/idam/users/123

Response:
HTTP/1.1 200 OK
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

{
  "success": true,
  "data": {...},
  "error": null
}

# 조건부 요청
GET /api/v1/mgmt/idam/users/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

Response:
HTTP/1.1 304 Not Modified
```

## API 문서화

### OpenAPI (Swagger) 스펙

```yaml
openapi: 3.0.0
info:
  title: CXG Platform API
  version: 1.0.0
  description: AI 기반 업무지원 플랫폼 API

servers:
  - url: https://api.cxg-platform.com/api/v1
    description: Production
  - url: https://staging-api.cxg-platform.com/api/v1
    description: Staging

paths:
  /mgmt/idam/users:
    get:
      summary: 사용자 목록 조회
      tags:
        - IDAM - 사용자 관리
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: size
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```

### FastAPI 자동 문서

```python
from fastapi import FastAPI

app = FastAPI(
    title="CXG Platform API",
    description="AI 기반 업무지원 플랫폼 API",
    version="1.0.0",
    docs_url="/docs",      # Swagger UI
    redoc_url="/redoc",    # ReDoc
)

@app.get(
    "/api/v1/mgmt/idam/users",
    summary="사용자 목록 조회",
    description="페이징을 지원하는 사용자 목록 조회 API",
    tags=["IDAM - 사용자 관리"],
    response_model=EnvelopeResponse[List[UserResponse]]
)
async def list_users(
    page: int = Query(1, ge=1, description="페이지 번호"),
    size: int = Query(20, ge=1, le=100, description="페이지 크기")
):
    pass
```

## API 테스트

### cURL

```bash
# GET 요청
curl -X GET "https://api.example.com/api/v1/mgmt/idam/users?page=1&size=20" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# POST 요청
curl -X POST "https://api.example.com/api/v1/mgmt/idam/users" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# 파일 업로드
curl -X POST "https://api.example.com/api/v1/tnnt/com/attachments" \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/file.pdf"
```

### HTTPie

```bash
# GET 요청
http GET https://api.example.com/api/v1/mgmt/idam/users \
  Authorization:"Bearer {token}" \
  page==1 size==20

# POST 요청
http POST https://api.example.com/api/v1/mgmt/idam/users \
  Authorization:"Bearer {token}" \
  username=john_doe \
  email=john@example.com \
  password=password123
```

### Postman Collection

```json
{
  "info": {
    "name": "CXG Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "IDAM",
      "item": [
        {
          "name": "사용자 목록 조회",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/v1/mgmt/idam/users?page=1&size=20",
              "host": ["{{base_url}}"],
              "path": ["api", "v1", "mgmt", "idam", "users"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "size", "value": "20"}
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.example.com"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

## API 버전 관리 전략

### 하위 호환성 유지 규칙

```
✅ 안전한 변경 (하위 호환)
- 새 엔드포인트 추가
- 새 필드 추가 (선택)
- 새 쿼리 파라미터 추가 (선택)
- 응답에 새 필드 추가

❌ Breaking Changes (버전 업그레이드 필요)
- 엔드포인트 URL 변경
- 필수 필드 추가
- 필드 타입 변경
- 필드 이름 변경
- 필드 제거
- 에러 코드 의미 변경
```

### 단계적 폐기 (Deprecation)

```http
GET /api/v1/mgmt/idam/users/old-endpoint

Response Headers:
Deprecation: true
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Link: </api/v1/mgmt/idam/users/new-endpoint>; rel="successor-version"

Response Body:
{
  "success": true,
  "data": {...},
  "error": null,
  "meta": {
    "deprecated": true,
    "deprecationDate": "2025-12-31",
    "message": "이 엔드포인트는 곧 제거됩니다. /new-endpoint를 사용하세요.",
    "migrationGuide": "https://docs.example.com/migration"
  }
}
```

## API 성능 최적화

### 필드 선택 (Sparse Fieldsets)

```
# 특정 필드만 조회
GET /api/v1/mgmt/idam/users?fields=id,username,email

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "username": "john_doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

### 관계 확장 (Expanding)

```
# 관련 리소스 포함
GET /api/v1/tnnt/srm/sales-orders/{id}?expand=customer,lines

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "orderNo": "SO-2025-001",
    "customer": {
      "id": "...",
      "name": "ABC Corp"
    },
    "lines": [
      {
        "id": "...",
        "productName": "Product A",
        "qty": 10
      }
    ]
  }
}
```

### 압축

```http
# 클라이언트 요청
GET /api/v1/mgmt/idam/users
Accept-Encoding: gzip, deflate

# 서버 응답
HTTP/1.1 200 OK
Content-Encoding: gzip
Content-Length: 1234
```

## 보안 헤더

### 필수 보안 헤더

```http
# XSS 방지
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block

# HTTPS 강제
Strict-Transport-Security: max-age=31536000; includeSubDomains

# CSP
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'

# Referrer 정책
Referrer-Policy: strict-origin-when-cross-origin
```

## 체크리스트

새로운 API 엔드포인트 추가 시:

- [ ] RESTful 원칙 준수
- [ ] Envelope 응답 구조 사용
- [ ] HTTP 메서드 적절히 선택
- [ ] 상태 코드 올바르게 반환
- [ ] 인증/권한 체크 구현
- [ ] 입력 검증 구현
- [ ] 에러 처리 구현
- [ ] 페이징 지원 (목록 API)
- [ ] 필터링/정렬 지원
- [ ] Rate Limiting 적용
- [ ] API 문서화 (docstring)
- [ ] OpenAPI 스펙 업데이트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] Postman 컬렉션 업데이트

## 참고 사항

### API 설계 원칙

1. **간결성**: URL은 짧고 명확하게
2. **일관성**: 모든 API에 동일한 패턴 적용
3. **예측 가능성**: 개발자가 직관적으로 이해 가능
4. **문서화**: 충분한 예시와 설명 제공
5. **버전 관리**: 하위 호환성 유지

### 일반적인 실수

❌ **하지 말아야 할 것**:
- 동사형 URL 사용 (`/getUser`, `/createUser`)
- 복수형 불일치 (`/user` 대신 `/users`)
- 깊은 중첩 (`/api/v1/a/b/c/d/e`)
- 일관성 없는 응답 구조
- 에러 메시지 노출 (스택 트레이스 등)
- 버전 없이 API 배포
- 문서화 없이 API 공개

✅ **해야 할 것**:
- 명사형 리소스 URL
- 복수형 통일
- 적절한 중첩 깊이 (2-3단계)
- Envelope 응답 구조
- 친절한 에러 메시지
- 버전 관리
- 자동 문서화 (Swagger/ReDoc)
