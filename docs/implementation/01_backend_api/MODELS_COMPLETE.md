# ORM 모델 생성 완료

## ✅ 생성 완료

packages/database/schemas의 SQL 스키마를 기반으로 SQLAlchemy ORM 모델을 **모두** 생성했습니다.

## 📊 생성 통계

### Manager 시스템 (13개 스키마, 42개 모델)

| 스키마 | 모델 개수 | 설명 |
|--------|-----------|------|
| **idam** | 8개 | Identity & Access Management (사용자, 역할, 권한) |
| **tnnt** | 2개 | Tenant Management (테넌트, 구독) |
| **audt** | 3개 | Audit (감사 로그, 컴플라이언스, 정책) |
| **auto** | 3개 | Automation (워크플로우, 실행, 태스크) |
| **bill** | 3개 | Billing (요금제, 인보이스, 트랜잭션) |
| **bkup** | 3개 | Backup (백업 실행, 스케줄, 복구 계획) |
| **cnfg** | 4개 | Configuration (설정, 피처플래그, 할당량) |
| **ifra** | 2개 | Infrastructure (리소스, 사용량) |
| **intg** | 3개 | Integration (API, 웹훅, Rate Limit) |
| **mntr** | 3개 | Monitoring (헬스체크, 인시던트, 메트릭) |
| **noti** | 3개 | Notification (알림, 템플릿, 캠페인) |
| **stat** | 2개 | Statistics (테넌트 통계, 사용량 통계) |
| **supt** | 3개 | Support (티켓, 댓글, 피드백) |
| **합계** | **42개** | |

### Tenants 시스템

현재 SQL 스키마 파일이 비어있어 모델 미생성. 향후 SQL 스키마 작성 후 추가 예정:
- adm (기준정보)
- psm (구매관리)
- srm (영업관리)
- ivm (재고관리)
- lwm (물류관리)
- csm (고객지원)
- asm (A/S관리)
- fim (재무관리)
- bim (경영분석)
- com (공통/지원)
- sys (시스템관리)

## 📁 디렉토리 구조

```
src/models/
├── __init__.py
├── base.py
├── manager/                    # Manager 시스템 (42개 모델)
│   ├── __init__.py
│   ├── idam/                   # 8개 모델
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── permission.py
│   │   ├── role_permission.py
│   │   ├── user_role.py
│   │   ├── api_key.py
│   │   ├── session.py
│   │   └── login_log.py
│   ├── tnnt/                   # 2개 모델
│   │   ├── tenant.py
│   │   └── subscription.py
│   ├── audt/                   # 3개 모델
│   │   ├── audit_logs.py
│   │   ├── compliances.py
│   │   └── policies.py
│   ├── auto/                   # 3개 모델
│   │   ├── workflows.py
│   │   ├── executions.py
│   │   └── tasks.py
│   ├── bill/                   # 3개 모델
│   │   ├── plans.py
│   │   ├── invoices.py
│   │   └── transactions.py
│   ├── bkup/                   # 3개 모델
│   │   ├── executions.py
│   │   ├── schedules.py
│   │   └── recovery_plans.py
│   ├── cnfg/                   # 4개 모델
│   │   ├── configurations.py
│   │   ├── feature_flags.py
│   │   ├── tenant_features.py
│   │   └── service_quotas.py
│   ├── ifra/                   # 2개 모델
│   │   ├── resources.py
│   │   └── resource_usages.py
│   ├── intg/                   # 3개 모델
│   │   ├── apis.py
│   │   ├── webhooks.py
│   │   └── rate_limits.py
│   ├── mntr/                   # 3개 모델
│   │   ├── health_checks.py
│   │   ├── incidents.py
│   │   └── system_metrics.py
│   ├── noti/                   # 3개 모델
│   │   ├── notifications.py
│   │   ├── templates.py
│   │   └── campaigns.py
│   ├── stat/                   # 2개 모델
│   │   ├── tenant_stats.py
│   │   └── usage_stats.py
│   └── supt/                   # 3개 모델
│       ├── tickets.py
│       ├── ticket_comments.py
│       └── feedbacks.py
└── tenants/                    # Tenants 시스템 (예정)
    └── (SQL 스키마 작성 후 추가)
```

## 🔍 모델 특징

### 1. BaseModel 상속

모든 모델은 `models.base.BaseModel`을 상속하여 기본 필드 자동 포함:

```python
class BaseModel(Base):
    id: Mapped[UUID]                    # 기본키
    created_at: Mapped[datetime]         # 생성일시
    created_by: Mapped[Optional[UUID]]   # 생성자
    updated_at: Mapped[Optional[datetime]] # 수정일시
    updated_by: Mapped[Optional[UUID]]   # 수정자
```

### 2. 스키마 지정

모든 테이블은 PostgreSQL 스키마를 명시:

```python
class User(BaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "idam"}
```

### 3. 타입 힌트

SQLAlchemy 2.0 스타일의 타입 힌트 사용:

```python
username: Mapped[str] = mapped_column(String(100), nullable=False)
email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
is_active: Mapped[bool] = mapped_column(Boolean, default=True)
```

### 4. PostgreSQL 특화 타입

```python
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET, ARRAY

extra_data: Mapped[dict] = mapped_column(JSONB, default=dict)
ip_address: Mapped[str] = mapped_column(INET)
tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text))
```

## 💡 사용 예시

### Import 방법

```python
# 개별 모델
from models.manager.idam.user import User
from models.manager.tnnt.tenant import Tenant

# 스키마 전체
from models.manager.idam import User, Role, Permission

# Manager 전체
from models.manager import (
    User, Role, Permission,
    Tenant, Subscription,
    AuditLogs, Workflows,
)
```

### 쿼리 예시

```python
from sqlalchemy import select
from models.manager.idam import User

# 사용자 조회
async def get_user(db: AsyncSession, user_id: UUID) -> User:
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# 활성 사용자 목록
async def list_active_users(db: AsyncSession) -> List[User]:
    result = await db.execute(
        select(User).where(User.status == "ACTIVE")
    )
    return result.scalars().all()
```

## 🔧 자동 생성 스크립트

모델은 `generate_models_v2.py` 스크립트로 자동 생성되었습니다:

**특징:**
- SQL CREATE TABLE 문 파싱
- 컬럼 타입 자동 변환 (SQL → SQLAlchemy)
- Python 타입 힌트 자동 생성
- __init__.py 자동 생성
- CHECK 제약조건 포함

**실행 방법:**
```bash
python3 generate_models_v2.py
```

## 📈 다음 단계

### 1. Tenants 스키마 SQL 작성
```bash
packages/database/schemas/tenants/
├── adm.sql        # 기준정보 스키마
├── psm.sql        # 구매관리 스키마
├── srm.sql        # 영업관리 스키마
└── ...
```

### 2. Tenants 모델 생성
SQL 작성 후 스크립트 실행:
```bash
python3 generate_tenants_models.py
```

### 3. 관계(Relationship) 추가
ForeignKey 기반 관계 설정:
```python
from sqlalchemy.orm import relationship

class User(BaseModel):
    roles = relationship("UserRole", back_populates="user")
```

### 4. 마이그레이션 생성
```bash
alembic revision --autogenerate -m "Add all manager models"
alembic upgrade head
```

### 5. 테스트 작성
```python
# tests/models/test_user.py
async def test_create_user(db: AsyncSession):
    user = User(
        username="test",
        email="test@example.com",
        full_name="Test User",
    )
    db.add(user)
    await db.flush()
    assert user.id is not None
```

## 📚 관련 문서

- `FINAL_STRUCTURE.md` - 프로젝트 최종 구조
- `AUTH_MODULE.md` - 인증 모듈 문서
- `docs/08-DATABASE-GUIDE.md` - 데이터베이스 가이드
- `packages/database/schemas/` - SQL 스키마 정의

## ✅ 완료 체크리스트

- [x] Manager IDAM 모델 (8개)
- [x] Manager TNNT 모델 (2개)
- [x] Manager AUDT 모델 (3개)
- [x] Manager AUTO 모델 (3개)
- [x] Manager BILL 모델 (3개)
- [x] Manager BKUP 모델 (3개)
- [x] Manager CNFG 모델 (4개)
- [x] Manager IFRA 모델 (2개)
- [x] Manager INTG 모델 (3개)
- [x] Manager MNTR 모델 (3개)
- [x] Manager NOTI 모델 (3개)
- [x] Manager STAT 모델 (2개)
- [x] Manager SUPT 모델 (3개)
- [ ] Tenants 스키마 SQL 작성 (예정)
- [ ] Tenants 모델 생성 (예정)
- [ ] Relationship 설정 (예정)
- [ ] 마이그레이션 생성 (예정)

## 🎉 결과

**Manager 시스템의 모든 모델(42개)이 성공적으로 생성되었습니다!**

각 모델은 테이블 단위로 분리되어 있어 유지보수가 용이하고, SQLAlchemy 2.0 스타일을 따르며, PostgreSQL 특화 기능을 활용합니다.
