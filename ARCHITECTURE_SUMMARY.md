# CXG Backend API - Complete Architecture Summary

## Overview

The CXG backend-api is a **FastAPI-based, multi-tenant SaaS platform** with:
- **2 separate databases**: Manager DB (admin/platform) and Tenant DB (isolated customer data)
- **100+ micromodules**: Organized by business domain (billing, identity, audit, etc.)
- **Audit-first design**: Automatic tracking of all mutations with user attribution
- **Security-hardened**: JWT authentication, password hashing, permission framework skeleton
- **Type-safe**: Python 3.10+ with full type hints and Pydantic v2

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│          FastAPI Application (main.py)                 │
│  - Exception handlers (CXGError, ValidationError)      │
│  - CORS & custom middleware                            │
│  - Router registration                                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ┌────▼─────────┐      ┌──────▼────────┐
    │  Manager API │      │  Tenants API  │
    │ /api/v1/mgmt │      │ /api/v1/tnnt  │
    └────┬─────────┘      └──────┬────────┘
         │                        │
    ┌────▼──────────────────────────────────────────┐
    │   Router Aggregators (src/routers/)           │
    │  - manager/v1.py (includes all mgmt modules)  │
    │  - tenants/v1.py (includes all tenant modules)│
    └────┬──────────────────────────────────────────┘
         │
    ┌────▼────────────────────────────────────────────────────────┐
    │  Module Layer (src/modules/)                               │
    │  ├── manager/idam/users       ├── tenants/crm/partners    │
    │  ├── manager/bill/invoices    ├── tenants/pim/products   │
    │  ├── manager/audt/audit_logs  ├── tenants/srm/orders     │
    │  ├── manager/auto/workflows   └── ... (50+ modules)       │
    │  └── ... (40+ modules)                                     │
    │                                                             │
    │  Each module contains:                                     │
    │  ├── router.py      (FastAPI endpoints)                    │
    │  ├── schemas.py     (Pydantic models)                      │
    │  └── service.py     (Business logic)                       │
    └────┬────────────────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────────┐
    │  Core Services (src/core/)                       │
    │  ├── exceptions.py     (Custom error hierarchy)  │
    │  ├── router.py         (AuditedAPIRouter)        │
    │  ├── database.py       (SQLAlchemy setup)        │
    │  ├── security.py       (Auth, hashing, tokens)   │
    │  ├── middleware.py     (Request/response handlers)│
    │  └── config.py         (Environment settings)    │
    └────┬──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────────┐
    │  Data Layer (src/models/)                        │
    │  ├── base.py          (Mixins, BaseModel)        │
    │  ├── manager/         (Manager DB schemas)       │
    │  │   ├── idam/        (User, Role, Permission)  │
    │  │   ├── bill/        (Invoice, Plan, Txn)      │
    │  │   └── ... (10+ domains)                       │
    │  └── tenants/         (Tenant DB schemas)        │
    │      ├── crm/         (Partner, Lead, Deal)      │
    │      ├── pim/         (Product, Category)        │
    │      └── ... (13+ domains)                       │
    └────┬──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────────┐
    │  Database Layer                                  │
    │  ├── Manager DB        (PostgreSQL + AsyncPg)   │
    │  │   ├── Schema: idam   (Identity & Access)      │
    │  │   ├── Schema: bill   (Billing)                │
    │  │   ├── Schema: audt   (Audit)                  │
    │  │   └── ... (10+ schemas)                       │
    │  │                                               │
    │  └── Tenant DB         (PostgreSQL + AsyncPg)   │
    │      ├── Schema: sys    (System)                 │
    │      ├── Schema: crm    (CRM)                    │
    │      ├── Schema: pim    (Product)                │
    │      └── ... (13+ schemas)                       │
    └────────────────────────────────────────────────────┘
```

---

## Core Patterns

### 1. Exception Handling

**Hierarchy**:
```
CXGError (base exception)
├── ValidationError       → Code: VALIDATION_ERROR
├── NotFoundError        → Code: RESOURCE_NOT_FOUND
├── AlreadyExistsError   → Code: RESOURCE_ALREADY_EXISTS
├── UnauthorizedError    → Code: AUTHENTICATION_REQUIRED
├── ForbiddenError       → Code: PERMISSION_DENIED
└── DatabaseError        → Code: DATABASE_ERROR
```

**Usage**: Thrown in services, caught by global handlers, converted to `EnvelopeResponse`

---

### 2. Response Wrapping

All responses wrapped in `EnvelopeResponse` structure:

```python
# Success Response
{
  "success": true,
  "data": { ... model data ... },
  "error": null
}

# Error Response
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터 검증 실패",
    "detail": { "field_errors": [...] }
  }
}
```

---

### 3. Module Structure

Every manager/tenant module follows this pattern:

```
src/modules/{scope}/{domain}/{entity}/
├── __init__.py
├── router.py       (API endpoints using AuditedAPIRouter)
├── schemas.py      (Pydantic models for validation)
└── service.py      (Business logic, database queries)

src/models/{scope}/{domain}/
└── {entity}.py     (SQLAlchemy ORM model)
```

**Example**: 
- Model: `src/models/manager/idam/user.py` 
- Router: `src/modules/manager/idam/users/router.py`
- Service: `src/modules/manager/idam/users/service.py`
- Schemas: `src/modules/manager/idam/users/schemas.py`

---

### 4. CRUD Pattern

Standard service methods:

```python
class EntityService:
    @staticmethod
    async def create(db, data, created_by=None) -> EntityResponse
    
    @staticmethod
    async def get_by_id(db, entity_id) -> EntityResponse
    
    @staticmethod
    async def get_list(db, page=1, page_size=20, filters=None) -> EntityListResponse
    
    @staticmethod
    async def update(db, entity_id, data, updated_by=None) -> EntityResponse
    
    @staticmethod
    async def delete(db, entity_id, deleted_by=None) -> None
    
    @staticmethod
    async def change_status(db, entity_id, new_status, updated_by=None) -> EntityResponse
```

---

### 5. Audit Trail

Every record automatically tracks:
- `created_at`: Timestamp (server-side default)
- `updated_at`: Timestamp (auto-updated)
- `created_by`: UUID of creator
- `updated_by`: UUID of updater
- `is_deleted`: Boolean soft-delete flag (default: False)

Implementation via mixins in `src/models/base.py`:
- `TimestampMixin`: Automatic timestamp tracking
- `UserTrackingMixin`: Creator/updater tracking
- `SoftDeleteMixin`: Soft delete support

---

## Database Architecture

### Manager Database
Purpose: Centralized admin and platform data

**Schemas**:
| Code | Module | Purpose |
|------|--------|---------|
| idam | Identity & Access Management | Users, roles, permissions, sessions |
| bill | Billing | Invoices, plans, transactions |
| audt | Audit | Audit logs, policies, compliance |
| auto | Automation | Workflows, tasks, executions |
| tnnt | Tenants | Tenant management, subscriptions |
| mntr | Monitoring | Health checks, incidents, metrics |
| noti | Notifications | Templates, notifications, campaigns |
| bkup | Backup | Schedules, executions, recovery |
| ifra | Infrastructure | Resources, usage |
| intg | Integration | APIs, webhooks, rate limits |
| cnfg | Configuration | Feature flags, quotas |
| supt | Support | Tickets, comments, feedback |
| stat | Statistics | Usage stats, tenant stats |

### Tenant Database
Purpose: Isolated data per tenant

**Schemas**:
| Code | Module | Purpose |
|------|--------|---------|
| sys  | System | Roles, permissions, users (tenant-level) |
| crm  | CRM | Partners, leads, opportunities, deals |
| pim  | Product Info | Products, categories, variants, suppliers |
| srm  | Sales | Sales orders, invoices, returns, promotions |
| psm  | Procurement | Purchase orders, quotations, requisitions |
| ivm  | Inventory | Balances, movements, adjustments, counts |
| wms  | Warehouse | Warehouses, locations, shipping, receiving |
| hrm  | HR | Employees, departments, payroll, leave |
| fim  | Finance | Accounts, journals, taxes, AP/AR |
| apm  | Approval | Approval requests, workflows |
| bim  | BI | Analytics, KPIs, targets |
| fam  | Fixed Assets | Assets, depreciation, disposal |
| asm  | Asset Service | Service requests, parts, tickets |
| crm | CRM (continued) | Activities, campaigns, contracts |

---

## Authentication & Security

### Password Security
- Algorithm: bcrypt with 12 rounds
- Handling: 72-byte limit truncation (bcrypt constraint)
- Validation: Min 8 chars, uppercase, lowercase, digit

### Token Management
- **Access Token**: 
  - Payload: `sub` (user_id), `exp`, `type: "access"`
  - Expiry: Configurable (default from settings)
  
- **Refresh Token**:
  - Payload: `sub`, `exp`, `type: "refresh"`
  - Expiry: 7 days fixed

- **Scheme**: OAuth2PasswordBearer
- **Endpoint**: `/api/v1/manager/auth/login`

### Authorization (Future)
- `require_permission(permission: str)` decorator exists but TODO
- Current: Only authentication required
- Planned: Full RBAC with role-based permission checks

---

## Key Technologies

| Layer | Technologies |
|-------|--------------|
| **Web Framework** | FastAPI 0.100+ |
| **ORM** | SQLAlchemy 2.x with async support |
| **Database** | PostgreSQL with asyncpg driver |
| **Validation** | Pydantic v2 |
| **Auth** | JWT, OAuth2, bcrypt, passlib |
| **Async** | asyncio, async/await |
| **Documentation** | Swagger UI, Scalar (modern docs) |

---

## Module Naming Conventions

### Domain Codes (4 letters)
```
idam = Identity & Access Management
bill = Billing
audt = Audit
auto = Automation
tnnt = Tenant management
mntr = Monitoring
noti = Notifications
bkup = Backup
ifra = Infrastructure
intg = Integration
cnfg = Configuration
supt = Support
stat = Statistics
crm  = Customer Relationship
pim  = Product Information
srm  = Sales
psm  = Procurement
ivm  = Inventory
wms  = Warehouse Management
```

### File Locations
- **Models**: `/src/models/{manager|tenants}/{domain_code}/{entity}.py`
- **Routers**: `/src/modules/{manager|tenants}/{domain_code}/{entity_name}/router.py`
- **Schemas**: `/src/modules/{manager|tenants}/{domain_code}/{entity_name}/schemas.py`
- **Services**: `/src/modules/{manager|tenants}/{domain_code}/{entity_name}/service.py`

### Import Examples
```python
# Model import
from src.models.manager.idam import User

# Service import  
from src.modules.manager.idam.users.service import UserService

# Dependencies
from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
```

---

## Endpoint Structure

### Route Format
```
/api/v1/{scope}/{domain}/{entity}/{action}
        └─ scope: manager or tenants
           └─ domain: idam, bill, crm, etc.
              └─ entity: users, invoices, products, etc.
                 └─ action: (id), status, custom operations
```

### Examples
```
POST   /api/v1/manager/idam/users                    → Create user
GET    /api/v1/manager/idam/users                    → List users (paginated)
GET    /api/v1/manager/idam/users/{user_id}         → Get user details
PUT    /api/v1/manager/idam/users/{user_id}         → Update user
DELETE /api/v1/manager/idam/users/{user_id}         → Soft delete user
PATCH  /api/v1/manager/idam/users/{user_id}/status  → Change user status

POST   /api/v1/manager/bill/invoices                 → Create invoice
GET    /api/v1/manager/bill/invoices                 → List invoices
GET    /api/v1/manager/bill/invoices/{invoice_id}   → Get invoice
```

### Query Parameters (Standard)
```
page: int = 1          (pagination)
page_size: int = 20    (pagination, max 100)
status: str | None     (filter)
search: str | None     (full-text search)
```

---

## Development Workflow

### Adding a New Manager Module

1. **Create Model** (`src/models/manager/{domain}/{entity}.py`):
   ```python
   from src.models.base import BaseModel
   
   class Entity(BaseModel):
       __tablename__ = "{entity}s"
       __table_args__ = {"schema": "{domain}"}
       # Define fields with Mapped type hints
   ```

2. **Create Schemas** (`src/modules/manager/{domain}/{entity}/schemas.py`):
   ```python
   class EntityBase(BaseModel):
       # Common fields
   
   class EntityCreate(EntityBase):
       # Creation-only fields
   
   class EntityUpdate(BaseModel):
       # Update-only fields (all optional)
   
   class EntityResponse(EntityBase):
       id: UUID
       created_at: datetime
       # ... include all model fields
   
   class EntityListResponse(BaseModel):
       items: list[EntityResponse]
       total: int
       page: int
       page_size: int
       total_pages: int
   ```

3. **Create Service** (`src/modules/manager/{domain}/{entity}/service.py`):
   ```python
   class EntityService:
       @staticmethod
       async def create(db, data, created_by=None) -> EntityResponse:
           # 1. Check uniqueness/constraints
           # 2. Create record with created_by
           # 3. db.add, commit, refresh
           # 4. Return EntityResponse.model_validate(obj)
       
       @staticmethod
       async def get_by_id(db, entity_id) -> EntityResponse:
           # SELECT where id=entity_id and is_active=True
           # Raise 404 if not found
       
       # ... other CRUD methods
   ```

4. **Create Router** (`src/modules/manager/{domain}/{entity}/router.py`):
   ```python
   from src.core.router import AuditedAPIRouter
   
   router = AuditedAPIRouter()  # or with prefix
   
   @router.post("", response_model=EnvelopeResponse[EntityResponse], status_code=201)
   async def create(
       data: EntityCreate,
       db: AsyncSession = Depends(get_manager_db),
       current_user: dict = Depends(get_current_user),
   ) -> EnvelopeResponse[EntityResponse]:
       creator_id = UUID(current_user["user_id"])
       obj = await EntityService.create(db, data, created_by=creator_id)
       return EnvelopeResponse.success_response(obj)
   
   # ... other endpoints
   ```

5. **Register in Aggregator** (`src/routers/manager/v1.py`):
   ```python
   from src.modules.manager.{domain}.{entity}.router import router as {name}_router
   
   router.include_router(
       {name}_router,
       prefix="/{domain}/{entity}",
       tags=["관리자 > {Module} > {Entity}"]
   )
   ```

---

## Testing the Architecture

### Health Check
```bash
curl http://localhost:8000/health
# Response: { "success": true, "data": { "status": "healthy" } }
```

### Create User Example
```bash
curl -X POST http://localhost:8000/api/v1/manager/idam/users \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePass123",
    "user_type": "TENANT"
  }'
```

### List Users with Pagination
```bash
curl "http://localhost:8000/api/v1/manager/idam/users?page=1&page_size=20&status=ACTIVE" \
  -H "Authorization: Bearer {token}"
```

---

## Key Files for Reference

| File | Purpose |
|------|---------|
| `/src/core/exceptions.py` | Custom exception hierarchy |
| `/src/core/router.py` | AuditedAPIRouter for audit logging |
| `/src/core/database.py` | Dual DB configuration |
| `/src/core/security.py` | Auth, hashing, JWT |
| `/src/models/base.py` | Mixins and BaseModel classes |
| `/src/modules/shareds/schemas/response.py` | EnvelopeResponse wrapper |
| `/src/modules/manager/idam/users/router.py` | Complete user endpoint example |
| `/src/modules/manager/idam/users/service.py` | Complete service pattern |
| `/src/routers/manager/v1.py` | Router aggregation |
| `/src/main.py` | FastAPI app setup |

---

## Summary

The CXG backend is a **production-grade, scalable API architecture** featuring:

✅ **Clear separation of concerns**: Models → Schemas → Services → Routers  
✅ **Comprehensive audit trail**: Built-in user tracking and soft deletes  
✅ **Security-first**: JWT auth, password hashing, RBAC skeleton  
✅ **Multi-tenancy**: Isolated databases for manager and tenant data  
✅ **Type-safe**: Full Python type hints with Pydantic validation  
✅ **Async-first**: All I/O operations are async with connection pooling  
✅ **Structured responses**: All endpoints return wrapped `EnvelopeResponse`  
✅ **Error handling**: Semantic error codes for frontend handling  
✅ **Documentation**: Auto-generated Swagger UI and Scalar docs  
✅ **Modularity**: 100+ independent modules with consistent patterns  

This enables rapid development of new features while maintaining high quality and consistency across the platform.
