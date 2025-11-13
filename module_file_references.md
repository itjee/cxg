# Backend API Module File References

## COMPLETE FILE PATHS AND EXAMPLES

### 1. CORE EXCEPTION HANDLING

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/core/exceptions.py`

Exception hierarchy with semantic codes:
```
CXGError(Exception)
  ├── ValidationError → "VALIDATION_ERROR"
  ├── NotFoundError → "RESOURCE_NOT_FOUND"
  ├── AlreadyExistsError → "RESOURCE_ALREADY_EXISTS"
  ├── UnauthorizedError → "AUTHENTICATION_REQUIRED"
  ├── ForbiddenError → "PERMISSION_DENIED"
  └── DatabaseError → "DATABASE_ERROR"
```

Used in exception handlers at:
- `/home/itjee/workspace/cxg/apps/backend-api/src/main.py` (lines 66-102)

---

### 2. CUSTOM ROUTER WITH AUDIT LOGGING

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/core/router.py`

```python
class AuditedAPIRouter(APIRouter):
    """Auto-logs all mutations (POST, PUT, PATCH, DELETE)"""
    
    def add_api_route(self, path: str, endpoint: Callable, **kwargs) -> None:
        if any method in kwargs["methods"] is POST|PUT|PATCH|DELETE:
            add Depends(log_audit) to dependencies
```

Usage in modules:
```python
from src.core.router import AuditedAPIRouter
router = AuditedAPIRouter()  # or with prefix: AuditedAPIRouter(prefix="/invoices")
```

---

### 3. BASE MODELS AND MIXINS

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/models/base.py`

```python
class TimestampMixin:
    created_at: Mapped[datetime]  # Auto-set by DB
    updated_at: Mapped[datetime]  # Auto-updated by DB

class UserTrackingMixin:
    created_by: Mapped[UUID | None]
    updated_by: Mapped[UUID | None]

class SoftDeleteMixin:
    is_deleted: Mapped[bool]
    deleted_at: Mapped[datetime | None]
    deleted_by: Mapped[UUID | None]

class TenantMixin:
    tenant_id: Mapped[UUID]  # Indexed

class BaseModel(Base, TimestampMixin, UserTrackingMixin):
    """For manager DB (admin data)"""
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

class TenantBaseModel(Base, TimestampMixin, UserTrackingMixin, TenantMixin):
    """For tenant DB (customer data)"""
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
```

---

### 4. DATABASE CONFIGURATION

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/core/database.py`

```python
# Dual database setup
manager_engine = create_async_engine(settings.manager_database_url)
tenant_engine = create_async_engine(settings.tenants_database_url)

ManagerSessionLocal = async_sessionmaker(manager_engine, class_=AsyncSession)
TenantSessionLocal = async_sessionmaker(tenant_engine, class_=AsyncSession)

# Dependency functions
async def get_manager_db() -> AsyncGenerator[AsyncSession, None]
async def get_tenant_db() -> AsyncGenerator[AsyncSession, None]
```

Used in routers:
```python
@router.get("")
async def get_list(
    db: AsyncSession = Depends(get_manager_db),  # Or get_tenant_db
    current_user = Depends(get_current_user),
)
```

---

### 5. SECURITY & AUTHENTICATION

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/core/security.py`

```python
# Password hashing (bcrypt)
get_password_hash(plain_password: str) -> str
verify_password(plain_password: str, hashed_password: str) -> bool

# Token management
create_access_token(data: dict[str, Any]) -> str
create_refresh_token(data: dict[str, Any]) -> str

# Current user extraction
async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict[str, Any]
    # Returns {"user_id": str, "payload": dict}

# Permission checker (TODO)
def require_permission(permission: str) -> async def permission_checker(...)
```

Example usage in routers:
```python
creator_id = UUID(current_user["user_id"])
```

---

### 6. RESPONSE WRAPPING

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/modules/shareds/schemas/response.py`

```python
class EnvelopeResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: dict[str, Any] | None = None
    
    # Methods:
    @classmethod
    def success_response(cls, data: T) -> EnvelopeResponse[T]
    
    @classmethod
    def error_response(cls, code: str, message: str, detail=None) -> EnvelopeResponse

# Usage
@router.post("", response_model=EnvelopeResponse[UserResponse])
async def create_user(...) -> EnvelopeResponse[UserResponse]:
    user = await UserService.create(db, data)
    return EnvelopeResponse.success_response(user)
```

---

## IDAM USERS MODULE (Complete Reference)

### File Structure
```
src/modules/manager/idam/users/
├── __init__.py
├── router.py         (Endpoints)
├── schemas.py        (Request/Response models)
└── service.py        (Business logic)

src/models/manager/idam/
└── user.py           (SQLAlchemy model)
```

### Model Definition

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/user.py`

```python
from sqlalchemy import CheckConstraint, String, Boolean, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from src.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')"),
        CheckConstraint("user_type IN ('MASTER', 'TENANT', 'SYSTEM')"),
        {"schema": "idam"},
    )
    
    # Basic info
    user_type: Mapped[str] = mapped_column(String(20), default="USER")
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20))
    
    # Auth fields
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password: Mapped[str | None] = mapped_column(String(255))
    
    # SSO
    sso_provider: Mapped[str | None] = mapped_column(String(50))
    sso_subject: Mapped[str | None] = mapped_column(String(255))
    
    # MFA
    mfa_enabled: Mapped[bool] = mapped_column(default=False)
    mfa_secret: Mapped[str | None] = mapped_column(String(255))
    
    # Status
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", index=True)
    
    # Security tracking
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    failed_login_attempts: Mapped[int] = mapped_column(default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
```

---

### Router Definition

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/router.py`

```python
from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import UserCreate, UserListResponse, UserResponse, UserUpdate
from .service import UserService

router = AuditedAPIRouter()

@router.post(
    "",
    response_model=EnvelopeResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
    summary="사용자 생성",
    description="새로운 사용자를 생성합니다.",
)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    creator_id = UUID(current_user["user_id"])
    user = await UserService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(user)

@router.get(
    "",
    response_model=EnvelopeResponse[UserListResponse],
    summary="사용자 목록 조회",
)
async def get_user_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = Query(None),
    user_type: str | None = Query(None),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserListResponse]:
    users = await UserService.get_list(
        db,
        page=page,
        page_size=page_size,
        status_filter=status,
        user_type_filter=user_type,
        search=search,
    )
    return EnvelopeResponse.success_response(users)

@router.get(
    "/{user_id}",
    response_model=EnvelopeResponse[UserResponse],
)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    user = await UserService.get_by_id(db, user_id)
    return EnvelopeResponse.success_response(user)

@router.put(
    "/{user_id}",
    response_model=EnvelopeResponse[UserResponse],
)
async def update_user(
    user_id: UUID,
    data: UserUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    updater_id = UUID(current_user["user_id"])
    user = await UserService.update(db, user_id, data, updated_by=updater_id)
    return EnvelopeResponse.success_response(user)

@router.delete(
    "/{user_id}",
    response_model=EnvelopeResponse[dict[str, str]],
)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    deleter_id = UUID(current_user["user_id"])
    await UserService.delete(db, user_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response({"message": "사용자가 삭제되었습니다"})

@router.patch(
    "/{user_id}/status",
    response_model=EnvelopeResponse[UserResponse],
)
async def change_user_status(
    user_id: UUID,
    new_status: str = Query(..., pattern="^(ACTIVE|INACTIVE|LOCKED|SUSPENDED)$"),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    updater_id = UUID(current_user["user_id"])
    user = await UserService.change_status(db, user_id, new_status, updated_by=updater_id)
    return EnvelopeResponse.success_response(user)
```

---

### Schemas Definition

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/schemas.py`

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = Field(None, max_length=20)
    user_type: str = Field(default="TENANT", pattern="^(MASTER|TENANT|SYSTEM)$")

class UserCreate(UserBase):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    mfa_enabled: bool = Field(default=False)
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Must contain uppercase")
        if not any(c.islower() for c in v):
            raise ValueError("Must contain lowercase")
        if not any(c.isdigit() for c in v):
            raise ValueError("Must contain digit")
        return v

class UserUpdate(BaseModel):
    full_name: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=20)
    status: str | None = Field(None, pattern="^(ACTIVE|INACTIVE|LOCKED|SUSPENDED)$")
    mfa_enabled: bool | None = None

class UserResponse(UserBase):
    id: UUID
    username: str
    status: str
    mfa_enabled: bool
    email_verified: bool
    phone_verified: bool
    last_login_at: datetime | None
    failed_login_attempts: int
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
```

---

### Service Definition

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/service.py`

```python
from datetime import datetime, timezone
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import get_password_hash
from src.models.manager.idam import User
from .schemas import UserCreate, UserListResponse, UserResponse, UserUpdate

class UserService:
    @staticmethod
    async def create(db: AsyncSession, data: UserCreate, created_by: UUID | None = None) -> UserResponse:
        # Check uniqueness
        stmt = select(User).where(User.username == data.username)
        if await db.execute(stmt) then raise 400
        
        stmt = select(User).where(User.email == data.email)
        if await db.execute(stmt) then raise 400
        
        # Create
        hashed_password = get_password_hash(data.password)
        user = User(
            full_name=data.full_name,
            email=data.email,
            phone=data.phone,
            username=data.username,
            password=hashed_password,
            user_type=data.user_type,
            mfa_enabled=data.mfa_enabled,
            status="ACTIVE",
            created_by=created_by,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return UserResponse.model_validate(user)

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: UUID) -> UserResponse:
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse.model_validate(user)

    @staticmethod
    async def get_list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        status_filter: str | None = None,
        user_type_filter: str | None = None,
        search: str | None = None,
    ) -> UserListResponse:
        stmt = select(User).where(User.is_active == True)
        
        if status_filter:
            stmt = stmt.where(User.status == status_filter)
        if user_type_filter:
            stmt = stmt.where(User.user_type == user_type_filter)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                (User.username.ilike(search_pattern)) |
                (User.full_name.ilike(search_pattern)) |
                (User.email.ilike(search_pattern))
            )
        
        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await db.execute(count_stmt)).scalar_one()
        
        # Paginate
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)
        
        result = await db.execute(stmt)
        users = result.scalars().all()
        total_pages = (total + page_size - 1) // page_size
        
        return UserListResponse(
            items=[UserResponse.model_validate(user) for user in users],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def update(
        db: AsyncSession, user_id: UUID, data: UserUpdate, updated_by: UUID | None = None
    ) -> UserResponse:
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        user = (await db.execute(stmt)).scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404)
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_by = updated_by
        user.updated_at = datetime.now(timezone.utc)
        
        await db.commit()
        await db.refresh(user)
        return UserResponse.model_validate(user)

    @staticmethod
    async def delete(db: AsyncSession, user_id: UUID, deleted_by: UUID | None = None) -> None:
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        user = (await db.execute(stmt)).scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404)
        
        user.is_active = False
        user.updated_by = deleted_by
        user.updated_at = datetime.now(timezone.utc)
        await db.commit()

    @staticmethod
    async def change_status(
        db: AsyncSession, user_id: UUID, new_status: str, updated_by: UUID | None = None
    ) -> UserResponse:
        stmt = select(User).where(User.id == user_id, User.is_active == True)
        user = (await db.execute(stmt)).scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404)
        
        user.status = new_status
        user.updated_by = updated_by
        user.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(user)
        return UserResponse.model_validate(user)
```

---

### Router Integration

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/routers/manager/v1.py`

```python
from src.modules.manager.idam.users.router import router as manager_idam_users_router

main_router = APIRouter()

main_router.include_router(
    manager_idam_users_router,
    prefix="/idam/users",
    tags=["관리자 > 사용자권한 > 사용자"]
)

# Final registration in main.py:
# app.include_router(main_router, prefix="/api/v1/manager")

# Result endpoint path: /api/v1/manager/idam/users
```

---

## BILLING MODULE (Similar Reference)

### File Structure
```
src/modules/manager/bill/invoices/
├── __init__.py
├── router.py
├── schemas.py
└── service.py

src/models/manager/bill/
└── invoices.py
```

### Model

**File**: `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/bill/invoices.py`

```python
class Invoices(BaseModel):
    __tablename__ = "invoices"
    __table_args__ = {"schema": "bill"}
    
    usage_amount: Mapped[float | None] = mapped_column(Numeric, default=0)
    discount_amount: Mapped[float | None] = mapped_column(Numeric, default=0)
    tax_amount: Mapped[float | None] = mapped_column(Numeric, default=0)
    currency: Mapped[str] = mapped_column(CHAR(3), default="KRW")
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
```

---

## KEY FILE LOCATIONS SUMMARY

| Component | Path |
|-----------|------|
| Exceptions | `/home/itjee/workspace/cxg/apps/backend-api/src/core/exceptions.py` |
| Router | `/home/itjee/workspace/cxg/apps/backend-api/src/core/router.py` |
| Database | `/home/itjee/workspace/cxg/apps/backend-api/src/core/database.py` |
| Security | `/home/itjee/workspace/cxg/apps/backend-api/src/core/security.py` |
| Base Models | `/home/itjee/workspace/cxg/apps/backend-api/src/models/base.py` |
| Response Schema | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/shareds/schemas/response.py` |
| IDAM User Model | `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/user.py` |
| IDAM User Router | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/router.py` |
| IDAM User Schemas | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/schemas.py` |
| IDAM User Service | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/idam/users/service.py` |
| Bill Invoices Model | `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/bill/invoices.py` |
| Bill Invoices Router | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/bill/invoices/router.py` |
| Bill Invoices Schemas | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/bill/invoices/schemas.py` |
| Bill Invoices Service | `/home/itjee/workspace/cxg/apps/backend-api/src/modules/manager/bill/invoices/service.py` |
| Manager Router Aggregator | `/home/itjee/workspace/cxg/apps/backend-api/src/routers/manager/v1.py` |
| Main Application | `/home/itjee/workspace/cxg/apps/backend-api/src/main.py` |

