# 백엔드 개발 가이드

## 개발 원칙

### 1. Co-location 패턴

- 관련 코드를 같은 디렉토리에 배치
- router, schemas, service, model을 함께 관리
- 모듈의 독립성과 응집도 향상

### 2. 계층 구조

```
Router (API 엔드포인트)
    ↓
Service (비즈니스 로직)
    ↓
Repository (데이터 액세스)
    ↓
Model (ORM)
    ↓
Database
```

### 3. 관심사의 분리

- **Router**: HTTP 요청/응답 처리만
- **Service**: 비즈니스 로직과 규칙
- **Repository**: 데이터 CRUD 작업
- **Model**: 데이터 구조 정의

### 4. 의존성 주입

- Dependency Injection 패턴 사용
- FastAPI의 Depends 활용
- 테스트 용이성 향상

## 리소스 구조

### 표준 디렉토리 구조

```
modules/mgmt/idam/user/
├── router.py       # API 엔드포인트
├── schemas.py      # Pydantic 스키마
├── service.py      # 비즈니스 로직
├── model.py        # ORM 모델 import
└── __init__.py     # Exports
```

### 파일별 역할

#### router.py

- API 엔드포인트 정의
- HTTP 메서드 (GET, POST, PUT, DELETE)
- 요청/응답 처리
- 인증/권한 체크

#### schemas.py

- Pydantic 모델 정의
- 요청 스키마 (Request)
- 응답 스키마 (Response)
- 내부 스키마 (서비스 레이어용)

#### service.py

- 비즈니스 로직 구현
- 데이터 검증
- 트랜잭션 관리
- 예외 처리

#### model.py

- ORM 모델 import
- 중앙 models/ 디렉토리에서 가져옴

#### **init**.py

- 모듈의 public interface
- 주요 클래스와 함수 export

## 스키마 설계

### 스키마 분리 전략

#### 1. 서비스 레이어 스키마 (PascalCase)

```python
class UserCreate(BaseModel):
    """서비스 레이어에서 사용"""
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    """서비스 레이어에서 사용"""
    id: UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
```

#### 2. API 레이어 스키마 (Request/Response)

```python
class UserCreateRequest(BaseModel):
    """API 요청용"""
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """API 응답용"""
    id: UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
```

### 스키마 네이밍 규칙

- **생성**: `{Resource}Create` / `{Resource}CreateRequest`
- **조회**: `{Resource}Read` / `{Resource}Response`
- **수정**: `{Resource}Update` / `{Resource}UpdateRequest`
- **목록**: `{Resource}List` / `{Resource}ListResponse`

## API 엔드포인트 설계

### RESTful 원칙

```
GET     /users              # 목록 조회
GET     /users/{id}         # 단일 조회
POST    /users              # 생성
PUT     /users/{id}         # 전체 수정
PATCH   /users/{id}         # 부분 수정
DELETE  /users/{id}         # 삭제
```

### 특수 액션

```
POST    /users/{id}/activate    # 활성화
POST    /users/{id}/deactivate  # 비활성화
POST    /users/{id}/reset-password  # 비밀번호 재설정
```

### 쿼리 파라미터

```
GET /users?page=1&size=20&search=john&sort=-created_at
```

## Envelope 응답 구조

### 표준 응답 포맷

```python
{
    "success": true,
    "data": { ... },
    "error": null
}
```

### 성공 응답

```python
return EnvelopeResponse(
    success=True,
    data=UserResponse.model_validate(user)
)
```

### 에러 응답

```python
return EnvelopeResponse(
    success=False,
    error={
        "code": "VALIDATION_ERROR",
        "message": "이미 존재하는 사용자명입니다",
        "detail": {"field": "username"}
    }
)
```

## 비즈니스 로직

### Service 클래스 패턴

```python
class UserService:
    """사용자 관련 비즈니스 로직"""

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """사용자 생성"""
        pass

    @staticmethod
    def get_user(db: Session, user_id: UUID) -> User:
        """사용자 조회"""
        pass
```

### 트랜잭션 관리

- 하나의 서비스 메서드 = 하나의 트랜잭션
- 성공 시 commit, 실패 시 rollback
- 중첩 트랜잭션 지양

### 에러 처리

```python
try:
    # 비즈니스 로직
    pass
except IntegrityError:
    # DB 무결성 에러
    raise HTTPException(status_code=400, detail="...")
except Exception as e:
    # 예상치 못한 에러
    logger.error(f"Error: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail="...")
```

## 데이터 검증

### Pydantic 검증

```python
class UserCreateRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator('password')
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('대문자 포함 필요')
        return v
```

### 비즈니스 규칙 검증

```python
def create_user(db: Session, user_data: UserCreate):
    # 중복 확인
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(400, "이미 존재하는 사용자명")

    # 비즈니스 규칙 검증
    if not is_valid_email_domain(user_data.email):
        raise HTTPException(400, "허용되지 않은 이메일 도메인")
```

## 인증과 권한

### 인증 (Authentication)

```python
from src.core.security import get_current_user

@router.get("/users/me")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    pass
```

### 권한 (Authorization)

```python
from src.core.security import require_permission

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    current_user: dict = Depends(require_permission("user:delete"))
):
    pass
```

## 페이징

### 페이징 파라미터

```python
@router.get("/users")
async def list_users(
    page: int = 1,
    size: int = 20,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size
    users = db.query(User).offset(skip).limit(size).all()
    total = db.query(User).count()

    return EnvelopeResponse(
        success=True,
        data={
            "items": [UserResponse.model_validate(u) for u in users],
            "total": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size
        }
    )
```

## 필터링과 정렬

### 동적 필터링

```python
query = db.query(User)

if search:
    query = query.filter(User.username.contains(search))

if status:
    query = query.filter(User.status == status)

if is_active is not None:
    query = query.filter(User.is_active == is_active)
```

### 정렬

```python
# sort=-created_at,+username
if sort:
    for field in sort.split(','):
        direction = desc if field.startswith('-') else asc
        field_name = field.lstrip('+-')
        query = query.order_by(direction(getattr(User, field_name)))
```

## 로깅

### 로깅 레벨

```python
import logging

logger = logging.getLogger(__name__)

logger.debug("디버그 정보")
logger.info("정보성 메시지")
logger.warning("경고")
logger.error("에러", exc_info=True)
logger.critical("심각한 에러")
```

### 구조화된 로깅

```python
logger.info(
    "사용자 생성 성공",
    extra={
        "user_id": str(user.id),
        "username": user.username,
        "action": "user_create"
    }
)
```

## 비동기 처리

### 비동기 엔드포인트

```python
@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users
```

### 비동기 서비스

```python
class UserService:
    @staticmethod
    async def list_users_async(db: AsyncSession) -> List[User]:
        result = await db.execute(select(User))
        return result.scalars().all()
```

## 캐싱

### Redis 캐싱

```python
from src.core.cache import cache_service

@router.get("/users/{user_id}")
async def get_user(user_id: UUID):
    # 캐시 확인
    cache_key = f"user:{user_id}"
    cached = await cache_service.get(cache_key)
    if cached:
        return cached

    # DB 조회
    user = UserService.get_user(db, user_id)

    # 캐시 저장 (1시간)
    await cache_service.set(cache_key, user, expire=3600)

    return user
```

## 성능 최적화

### N+1 쿼리 방지

```python
from sqlalchemy.orm import selectinload

# Eager Loading
users = db.query(User).options(
    selectinload(User.roles)
).all()
```

### 대량 데이터 처리

```python
# Batch Insert
db.bulk_insert_mappings(User, user_dicts)
db.commit()

# Batch Update
db.bulk_update_mappings(User, user_updates)
db.commit()
```

### 인덱스 활용

- 자주 조회되는 컬럼에 인덱스 생성
- 복합 인덱스는 선택도가 높은 컬럼을 앞에 배치
- WHERE, JOIN, ORDER BY에 사용되는 컬럼 우선

## 테스트

### 단위 테스트

```python
def test_create_user(db_session):
    user_data = UserCreate(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    user = UserService.create_user(db_session, user_data)

    assert user.id is not None
    assert user.username == "testuser"
```

### 통합 테스트

```python
def test_create_user_api(client, auth_headers):
    response = client.post(
        "/api/v1/mgmt/idam/users",
        json={"username": "test", "email": "test@example.com", "password": "pass123"},
        headers=auth_headers
    )

    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
```

## 데이터베이스 마이그레이션

### 마이그레이션 생성

```bash
# 자동 생성
alembic revision --autogenerate -m "Add user table"

# 수동 생성
alembic revision -m "Add custom index"
```

### 마이그레이션 실행

```bash
# 최신 버전으로 업그레이드
alembic upgrade head

# 특정 버전으로
alembic upgrade abc123

# 한 단계 다운그레이드
alembic downgrade -1
```

## 보안

### 비밀번호 해싱

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 해싱
hashed = pwd_context.hash(plain_password)

# 검증
is_valid = pwd_context.verify(plain_password, hashed)
```

### SQL Injection 방지

- ORM 사용 (Raw SQL 지양)
- Parameterized Query 사용
- 사용자 입력 검증

### XSS 방지

- 출력 시 HTML 이스케이프
- Content-Security-Policy 헤더 설정

## 에러 처리 전략

### HTTP 예외

```python
from fastapi import HTTPException, status

# 400 Bad Request
raise HTTPException(status_code=400, detail="잘못된 요청")

# 401 Unauthorized
raise HTTPException(status_code=401, detail="인증 필요")

# 403 Forbidden
raise HTTPException(status_code=403, detail="권한 없음")

# 404 Not Found
raise HTTPException(status_code=404, detail="리소스 없음")

# 409 Conflict
raise HTTPException(status_code=409, detail="충돌")

# 500 Internal Server Error
raise HTTPException(status_code=500, detail="서버 오류")
```

### 커스텀 예외

```python
class BusinessException(Exception):
    """비즈니스 로직 예외"""
    pass

class ValidationException(BusinessException):
    """검증 예외"""
    pass
```

## 모니터링과 추적

### OpenTelemetry

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@tracer.start_as_current_span("create_user")
def create_user(user_data):
    # 작업 수행
    pass
```

### 메트릭

```python
from prometheus_client import Counter, Histogram

user_created_counter = Counter('users_created_total', 'Total users created')
request_duration = Histogram('request_duration_seconds', 'Request duration')

# 메트릭 기록
user_created_counter.inc()
request_duration.observe(duration)
```

## 베스트 프랙티스

### DO

- Pydantic으로 데이터 검증
- 명시적 타입 힌트 사용
- 비즈니스 로직은 서비스에
- 트랜잭션 경계 명확히
- 에러는 적절히 처리
- 로깅 충분히
- 단위 테스트 작성

### DON'T

- Raw SQL 사용 (ORM 사용)
- 비밀번호 평문 저장
- any 타입 남용
- 전역 상태 사용
- 중첩 트랜잭션
- 예외 무시
- 하드코딩된 값

## 체크리스트

새로운 API 엔드포인트 추가 시:

- [ ] ORM 모델 정의
- [ ] Pydantic 스키마 작성
- [ ] 서비스 로직 구현
- [ ] API 라우터 작성
- [ ] Envelope 응답 적용
- [ ] 에러 핸들링 구현
- [ ] 로깅 추가
- [ ] 인증/권한 체크
- [ ] 입력 검증
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] API 문서화 (docstring)
- [ ] 데이터베이스 마이그레이션
