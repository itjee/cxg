# Backend API Architecture Analysis

## 1. CORE LAYERS ORGANIZATION

### 1.1 Error Handling (src/core/exceptions.py)

**Pattern Used**: Custom Exception Hierarchy
- Base class: `CXGError` - inherits from Exception
  - Parameters: message, code, detail dict
  - Used for structured error responses with error codes and details
  
**Exception Classes**:
```
CXGError (base)
├── ValidationError (code: VALIDATION_ERROR)
├── NotFoundError (code: RESOURCE_NOT_FOUND)
├── AlreadyExistsError (code: RESOURCE_ALREADY_EXISTS)
├── UnauthorizedError (code: AUTHENTICATION_REQUIRED)
├── ForbiddenError (code: PERMISSION_DENIED)
└── DatabaseError (code: DATABASE_ERROR)
```

**Key Features**:
- Each exception has a semantic code for frontend handling
- Optional detail dict for additional context
- English codes, Korean messages (localization friendly)
- Integrated into global exception handler in main.py

### 1.2 Router Layer (src/core/router.py)

**Custom Router**: `AuditedAPIRouter` extends FastAPI's APIRouter
- Automatically adds audit logging dependencies to write operations
- Detects POST, PUT, PATCH, DELETE methods
- Lazy imports to prevent circular dependencies
- Wraps endpoints with audit log dependency: `log_audit`

**Usage Pattern**:
```python
router = AuditedAPIRouter()
# Audit logging automatically added to mutations
```

### 1.3 Database Layer (src/core/database.py)

**Dual Database Architecture**:
- Manager Database: For admin/platform data (idam, bill, etc.)
- Tenant Database: For tenant-specific data (crm, inventory, etc.)

**Async Configuration**:
- SQLAlchemy 2.x with asyncpg driver
- Separate engines and session makers
- Connection pooling: pool_size=20, max_overflow=10
- Pre-ping enabled for health checks

**Dependency Injection Functions**:
```python
async def get_manager_db() -> AsyncSession
async def get_tenant_db() -> AsyncSession
```

### 1.4 Security Layer (src/core/security.py)

**Password Hashing**:
- bcrypt with 12 default rounds
- Handles 72-byte limit for bcrypt
- Truncation function: `_truncate_password()`

**JWT Token Management**:
- Access tokens: configurable expiry (default from settings)
- Refresh tokens: 7-day expiry
- Token types: "access" and "refresh"
- Subject (sub) contains user_id

**Authentication**:
- OAuth2PasswordBearer scheme
- Endpoint: `/api/v1/mgmt/auth/login`
- Dependency: `get_current_user` validates token

**Authorization Skeleton**:
- `require_permission(permission: str)` decorator
- Currently TODO for full RBAC implementation

---

## 2. BASE MODELS AND MIXINS (src/models/base.py)

### Mixin Architecture

**TimestampMixin**:
- `created_at`: Auto-set on creation, server-side default
- `updated_at`: Auto-updated on modification

**UserTrackingMixin**:
- `created_by`: UUID of creator
- `updated_by`: UUID of updater

**SoftDeleteMixin**:
- `is_deleted`: Boolean flag
- `deleted_at`: Timestamp of deletion
- `deleted_by`: UUID of who deleted

**TenantMixin**:
- `tenant_id`: UUID, indexed for multi-tenancy

### Base Model Classes

**BaseModel** (Manager DB)
- Inherits: TimestampMixin + UserTrackingMixin
- Primary key: UUID (auto-generated)
- Used for: Admin/platform entities (users, billing, etc.)

**TenantBaseModel** (Tenant DB)
- Inherits: TimestampMixin + UserTrackingMixin + TenantMixin
- Primary key: UUID
- Used for: Tenant-specific entities (CRM, inventory, etc.)

### Schema Pattern
```python
from src.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(...),
        {"schema": "idam"},  # Database schema
    )
    
    # Fields with Mapped type hints
    username: Mapped[str] = mapped_column(String(100), unique=True)
```

---

## 3. ROUTER INTEGRATION (src/routers/manager/v1.py)

### Module Hierarchy

**Structure**:
```
api/v1/manager/
├── auth/           (Authentication - special handling)
├── idam/           (Identity & Access Management)
│   ├── users
│   ├── roles
│   ├── permissions
│   └── ... (7+ sub-modules)
├── bill/           (Billing)
│   ├── invoices
│   ├── plans
│   └── transactions
├── audt/           (Audit)
├── auto/           (Automation)
├── mntr/           (Monitoring)
├── noti/           (Notifications)
└── ... (12+ total modules)
```

### Router Registration Pattern

```python
from fastapi import APIRouter
from src.modules.manager.{module}.{submodule}.router import router as {name}_router

main_router = APIRouter()

# Include with prefix and tags
main_router.include_router(
    router, 
    prefix="/module/submodule", 
    tags=["Category > Module > SubModule"]
)
```

**Tag Hierarchy**: 3-level categories (Category > Module > SubModule)
Example: "관리자 > 청구 > 청구서" (Admin > Billing > Invoices)

---

## 4. EXISTING MODULES - IDAM USERS (Reference Implementation)

### File Structure
```
src/modules/manager/idam/users/
├── __init__.py
├── router.py       (Endpoints)
├── schemas.py      (Request/Response models)
├── service.py      (Business logic)
```

### 4.1 Data Model (src/models/manager/idam/user.py)

```python
class User(BaseModel):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')"),
        CheckConstraint("user_type IN ('MASTER', 'TENANT', 'SYSTEM')"),
        CheckConstraint("(sso_provider IS NULL) OR (sso_provider IS NOT NULL)"),
        {"schema": "idam"},
    )
```

**Fields**:
- Basic: user_type, full_name, email, phone
- Auth: username, password, salt_key
- SSO: sso_provider, sso_subject
- MFA: mfa_enabled, mfa_secret, backup_codes
- Status: status (enum), last_login_at, failed_login_attempts, locked_until
- Metadata: timezone, locale, department, position

### 4.2 Router Pattern (src/modules/manager/idam/users/router.py)

**Key Points**:
- Uses `AuditedAPIRouter()` for auto-audit on mutations
- All endpoints return `EnvelopeResponse[T]` wrapper
- Dependencies: `get_manager_db`, `get_current_user`
- User ID extracted: `UUID(current_user["user_id"])`
- Status codes: 201 for POST, 200 for GET/PUT, 204 implicit for DELETE

**Endpoint Pattern**:
```python
@router.post("", response_model=EnvelopeResponse[UserResponse], status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[UserResponse]:
    creator_id = UUID(current_user["user_id"])
    user = await UserService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(user)
```

### 4.3 Schemas Pattern (src/modules/manager/idam/users/schemas.py)

**Base Schema**:
```python
class UserBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = Field(None, max_length=20)
    user_type: str = Field(default="TENANT", pattern="^(MASTER|TENANT|SYSTEM)$")
```

**Create Schema** (Inherits Base):
- Additional: username, password
- Field validators: Password strength (uppercase, lowercase, digit, min 8 chars)

**Update Schema** (Independent):
- All fields optional
- Only updatable fields

**Response Schema** (Inherits Base):
- All model fields: id, username, status, mfa_enabled, etc.
- Audit fields: created_at, updated_at, created_by, updated_by
- Config: `from_attributes = True` (Pydantic v2)

**List Response Schema**:
```python
class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
```

### 4.4 Service Pattern (src/modules/manager/idam/users/service.py)

**Class Structure**:
```python
class UserService:
    @staticmethod
    async def create(db, data, created_by=None) -> UserResponse
    @staticmethod
    async def get_by_id(db, user_id) -> UserResponse
    @staticmethod
    async def get_list(db, page, page_size, filters) -> UserListResponse
    @staticmethod
    async def update(db, user_id, data, updated_by=None) -> UserResponse
    @staticmethod
    async def delete(db, user_id, deleted_by=None) -> None
    @staticmethod
    async def change_status(db, user_id, new_status, updated_by=None) -> UserResponse
```

**Database Patterns**:
- SELECT with WHERE conditions
- Existence checks before modifications
- HTTPException for 404/400 errors
- Soft delete: set `is_active = False`
- Update tracking: set `updated_by` and `updated_at`

**Business Logic Examples**:
- Unique validation (username, email) before create
- Password hashing: `get_password_hash(data.password)`
- Search support: case-insensitive ILIKE on multiple fields
- Pagination: offset/limit calculation
- Status constraints: validation via query filters

---

## 5. BILLING MODULE (Reference - Similar Structure)

### 5.1 Model (src/models/manager/bill/invoices.py)

Simpler than IDAM User:
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

### 5.2 Router (src/modules/manager/bill/invoices/router.py)

Note: Uses prefix directly in AuditedAPIRouter declaration:
```python
router = AuditedAPIRouter(prefix="/invoices")  # Instead of empty prefix
```

Otherwise identical structure to users.

### 5.3 Schemas (src/modules/manager/bill/invoices/schemas.py)

**Currently Minimal**:
- InvoicesBase, InvoicesCreate, InvoicesUpdate are empty/pass
- Full schemas expected for actual implementation

### 5.4 Service (src/modules/manager/bill/invoices/service.py)

Standard CRUD pattern:
- Generic error handling
- Placeholder search logic
- Soft delete implementation
- Same pagination pattern as users

---

## 6. SHARED PATTERNS

### Response Wrapping (src/modules/shareds/schemas/response.py)

**EnvelopeResponse**:
```python
class EnvelopeResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    error: dict[str, Any] | None = None
    
    @classmethod
    def success_response(cls, data: T) -> "EnvelopeResponse[T]"
    @classmethod
    def error_response(cls, code: str, message: str, detail=None)
```

**Usage**:
- All endpoints return wrapped responses
- Error responses have: code, message, detail
- Success responses have: data

### Exception Handler Chain (src/main.py)

```python
@app.exception_handler(CXGError)
@app.exception_handler(RequestValidationError)
@app.exception_handler(Exception)
```

Each converts exceptions to EnvelopeResponse format.

---

## 7. KEY DIRECTORY STRUCTURE

```
src/
├── core/                  # Framework & infrastructure
│   ├── exceptions.py      # Custom exception hierarchy
│   ├── router.py          # AuditedAPIRouter
│   ├── database.py        # Dual DB connections
│   ├── security.py        # Auth, hashing, JWT
│   ├── config.py          # Settings from environment
│   ├── logging.py         # Logging setup
│   └── middleware.py      # Request/response middleware
│
├── models/                # SQLAlchemy ORM models
│   ├── base.py            # BaseModel, Mixins
│   ├── manager/           # Admin DB schemas
│   │   ├── idam/          # 8 user/role tables
│   │   ├── bill/          # Invoices, Plans, Transactions
│   │   ├── audt/          # Audit logs, policies
│   │   └── ... (10+ modules)
│   └── tenants/           # Tenant DB schemas
│       ├── sys/           # Roles, permissions, users
│       ├── crm/           # Sales, partners, etc.
│       └── ... (13+ modules)
│
├── modules/               # Business logic layer
│   ├── manager/           # Admin modules
│   │   ├── idam/users/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── bill/invoices/
│   │   └── ... (100+ submodules)
│   └── tenants/           # Tenant modules
│
├── routers/               # Endpoint aggregation
│   ├── manager/
│   │   └── v1.py          # Imports & registers all manager modules
│   └── tenants/
│       └── v1.py          # Imports & registers all tenant modules
│
└── main.py                # FastAPI app setup, exception handlers
```

---

## 8. BEST PRACTICES OBSERVED

1. **Separation of Concerns**: Models, Schemas, Services, Routers clearly separated
2. **Dependency Injection**: FastAPI Depends for DB, auth, audit
3. **Type Hints**: Full type annotations (Python 3.10+ style)
4. **Async/Await**: All DB operations async
5. **Validation**: Pydantic validators on schemas, DB constraints
6. **Error Handling**: Custom exceptions, structured error responses
7. **Audit Trail**: Automatic tracking of created_by, updated_by
8. **Soft Delete**: is_active pattern instead of hard delete
9. **Pagination**: Standard offset/limit with total_pages
10. **Security**: Password hashing, JWT tokens, permission framework
11. **Documentation**: Summary/description on all endpoints
12. **Code Generation**: Auto-generated routers with all modules

---

## 9. MODULE ORGANIZATION CONVENTIONS

### Naming Conventions
- Module codes: 4 letters (bill, idam, audt, auto, mntr, noti, etc.)
- Models in: `src/models/manager/{module_code}/` or `src/models/tenants/{module_code}/`
- Modules in: `src/modules/manager/{module_code}/{entity_name}/`
- Routers: `src/routers/manager/v1.py` aggregates all

### File Naming
- Models: `snake_case.py` (user.py, invoice.py)
- Schema classes: PascalCase inside files
- Service classes: PascalCase ending in "Service"
- Router instances: Named `router` for consistency

### Import Paths
```python
from src.models.manager.idam import User  # From __init__.py exports
from src.modules.manager.idam.users.service import UserService
from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
```

---

## Summary

The CXG backend follows a **modular, service-oriented architecture** with:
- **Clear layering**: Models → Schemas → Services → Routers
- **Dual database support**: Manager (admin) and Tenant (isolated) databases
- **Comprehensive audit trail**: Built-in tracking and soft deletes
- **Security-first design**: JWT, password hashing, future RBAC
- **Structured responses**: All endpoints wrapped in EnvelopeResponse
- **Async-first**: All DB operations are async with proper pooling
- **Framework conventions**: Consistent patterns across 100+ modules

This enables rapid development of new modules while maintaining quality and consistency.
