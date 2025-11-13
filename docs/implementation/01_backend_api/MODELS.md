# ORM 모델 문서

packages/database/schemas의 SQL 스키마를 기반으로 SQLAlchemy ORM 모델을 생성했습니다.

## 생성된 모델

### Manager 시스템 모델 (models/manager/)

#### 1. IDAM (Identity & Access Management) - `models/manager/idam.py`

**총 8개 모델:**

| 모델 | 테이블명 | 설명 |
|------|----------|------|
| `User` | `idam.users` | 사용자 계정 (인증 정보, SSO, MFA 포함) |
| `Permission` | `idam.permissions` | 권한 카탈로그 (GLOBAL/TENANT 스코프) |
| `Role` | `idam.roles` | 역할 정의 (RBAC) |
| `RolePermission` | `idam.role_permissions` | 역할-권한 매핑 |
| `UserRole` | `idam.user_roles` | 사용자-역할 매핑 (테넌트 컨텍스트 포함) |
| `ApiKey` | `idam.api_keys` | API 키 관리 (Rate Limiting 포함) |
| `Session` | `idam.sessions` | 세션 관리 (MFA 검증 포함) |
| `LoginLog` | `idam.login_logs` | 로그인 이력 (보안 감사용) |

**주요 필드:**
- User: `user_type`, `status`, `mfa_enabled`, `sso_provider`, `password`
- Permission: `permission_code`, `scope`, `applies_to`, `action`
- Role: `role_code`, `role_type`, `scope`, `priority`
- UserRole: `tenant_context`, `scope`, `expires_at`
- ApiKey: `key_id`, `scopes`, `rate_limit_*`
- Session: `session_type`, `tenant_context`, `mfa_verified`
- LoginLog: `attempt_type`, `success`, `failure_reason`

#### 2. TNNT (Tenant Management) - `models/manager/tnnt.py`

**총 5개 모델:**

| 모델 | 테이블명 | 설명 |
|------|----------|------|
| `Tenant` | `tnnt.tenants` | 테넌트 마스터 정보 (계약, 사업자 정보) |
| `Subscription` | `tnnt.subscriptions` | 구독 및 요금제 관리 |
| `Onboarding` | `tnnt.onboardings` | 온보딩 프로세스 추적 (단계별) |
| `TenantUser` | `tnnt.tenant_users` | 테넌트-사용자 연결 |
| `TenantRole` | `tnnt.tenant_roles` | 테넌트-역할 연결 (커스터마이징) |

**주요 필드:**
- Tenant: `tenant_code`, `tenant_type`, `business_no`, `start_date`, `timezone`
- Subscription: `plan_id`, `billing_cycle`, `max_users`, `max_storage`, `auto_renewal`
- Onboarding: `step_name`, `step_status`, `step_order`, `started_at`, `completed_at`
- TenantUser: `role`, `department`, `is_primary`, `is_admin`
- TenantRole: `role_name`, `priority`, `enabled`, `max_users`, `current_users`

### Tenants 시스템 모델 (models/tenants/)

현재 스키마 파일이 비어있어 모델이 생성되지 않았습니다.

향후 다음 스키마들의 모델 생성 예정:
- `adm` - 기준정보 관리
- `psm` - 구매/조달 관리
- `srm` - 영업/매출 관리
- `ivm` - 재고/자재 관리
- `lwm` - 물류/창고 관리
- `csm` - 고객지원 관리
- `asm` - A/S 관리
- `fim` - 재무/회계 관리
- `bim` - 경영분석 관리
- `com` - 공통/지원
- `sys` - 시스템 관리

## 모델 특징

### 1. BaseModel 상속

모든 모델은 `models.base.BaseModel` 또는 `TenantBaseModel`을 상속:

```python
class BaseModel(Base, TimestampMixin):
    """기본 모델 (Manager DB용)"""
    id: Mapped[UUID]
    created_at: Mapped[datetime]
    updated_at: Mapped[Optional[datetime]]

class TenantBaseModel(Base, TimestampMixin, TenantMixin):
    """테넌트 모델 (Tenant DB용)"""
    id: Mapped[UUID]
    created_at: Mapped[datetime]
    updated_at: Mapped[Optional[datetime]]
    tenant_id: Mapped[UUID]
```

### 2. SQLAlchemy 2.0 스타일

- `Mapped[]` 타입 힌트 사용
- `mapped_column()` 사용
- `async/await` 지원

### 3. CheckConstraint 적용

SQL 스키마의 CHECK 제약조건을 모델에 반영:

```python
__table_args__ = (
    CheckConstraint("status IN ('ACTIVE', 'INACTIVE')", name="ck_users__status"),
    CheckConstraint("user_type IN ('MASTER', 'TENANT', 'SYSTEM')", name="ck_users__user_type"),
    {"schema": "idam"},
)
```

### 4. 인덱스 자동 생성

`index=True` 옵션으로 필요한 컬럼에 인덱스 자동 생성:

```python
username: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
```

### 5. PostgreSQL 특화 타입

- `UUID` - PostgreSQL UUID 타입
- `INET` - IP 주소 타입
- `ARRAY` - 배열 타입
- `JSONB` - JSON 타입

## 사용 예시

### 1. 모델 Import

```python
from models.manager.idam import User, Role, Permission
from models.manager.tnnt import Tenant, Subscription
```

### 2. 데이터 조회

```python
from sqlalchemy import select
from core.database import get_manager_db

async def get_user(db: AsyncSession, user_id: UUID) -> User:
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()
```

### 3. 데이터 생성

```python
user = User(
    username="john_doe",
    email="john@example.com",
    password="hashed_password",
    full_name="John Doe",
    user_type="MASTER",
    status="ACTIVE",
)
db.add(user)
await db.flush()
```

### 4. 복잡한 쿼리

```python
# 사용자의 역할과 권한 조회
from sqlalchemy.orm import selectinload

result = await db.execute(
    select(User)
    .options(
        selectinload(User.roles),
        selectinload(User.permissions)
    )
    .where(User.id == user_id)
)
user = result.scalar_one()
```

## 마이그레이션

### 생성된 마이그레이션

- `001_init_auth.py` - User 테이블 생성 (idam.users)

### 마이그레이션 실행

```bash
# 업그레이드
alembic upgrade head

# 롤백
alembic downgrade -1

# 현재 버전 확인
alembic current
```

## 다음 단계

1. ✅ Manager 시스템 모델 완료 (IDAM, TNNT)
2. ⏭️ Tenants 시스템 모델 생성 (ADM, PSM, SRM 등)
3. ⏭️ 관계(Relationship) 설정 추가
4. ⏭️ 추가 마이그레이션 파일 생성
5. ⏭️ 모델 유닛 테스트 작성

## 참고

- 스키마 정의: `packages/database/schemas/`
- 모델 정의: `apps/backend-api/src/models/`
- 마이그레이션: `apps/backend-api/alembic/versions/`
- 데이터베이스 가이드: `docs/08-DATABASE-GUIDE.md`
