# CXG Backend API - Quick Reference Card

## Core Exceptions

| Exception | Code | Usage |
|-----------|------|-------|
| `ValidationError` | VALIDATION_ERROR | Invalid input data |
| `NotFoundError` | RESOURCE_NOT_FOUND | Resource doesn't exist |
| `AlreadyExistsError` | RESOURCE_ALREADY_EXISTS | Duplicate resource |
| `UnauthorizedError` | AUTHENTICATION_REQUIRED | Not authenticated |
| `ForbiddenError` | PERMISSION_DENIED | No permission |
| `DatabaseError` | DATABASE_ERROR | DB operation failed |

**File**: `/src/core/exceptions.py`

---

## Database Dependencies

```python
from src.core.database import get_manager_db, get_tenant_db
from sqlalchemy.ext.asyncio import AsyncSession

# Use in endpoints:
@router.get("")
async def get_list(db: AsyncSession = Depends(get_manager_db)):
    # For manager DB
    # For tenant DB: Depends(get_tenant_db)
```

---

## Security & Authentication

```python
from src.core.security import (
    get_current_user,              # Extract current user from token
    get_password_hash,             # Hash password
    verify_password,               # Verify password
    create_access_token,           # Generate access token
    create_refresh_token,          # Generate refresh token
    require_permission,            # Check permission (TODO)
)

# Extract user ID in endpoint:
current_user: dict = Depends(get_current_user)
user_id = UUID(current_user["user_id"])
```

---

## Response Wrapping

```python
from src.modules.shareds.schemas import EnvelopeResponse

# Success response
@router.post("", response_model=EnvelopeResponse[EntityResponse])
async def create(...) -> EnvelopeResponse[EntityResponse]:
    entity = await EntityService.create(db, data)
    return EnvelopeResponse.success_response(entity)

# Returns: { "success": true, "data": {...}, "error": null }

# Error response (in handler)
EnvelopeResponse.error_response(
    code="VALIDATION_ERROR",
    message="Validation failed",
    detail={"field": "error"}
)
```

---

## Model Base Classes

```python
from src.models.base import BaseModel, TenantBaseModel

# For manager DB (admin data)
class User(BaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "idam"}
    # Includes: id, created_at, updated_at, created_by, updated_by

# For tenant DB (customer data)
class Product(TenantBaseModel):
    __tablename__ = "products"
    __table_args__ = {"schema": "pim"}
    # Includes: id, created_at, updated_at, created_by, updated_by, tenant_id
```

**Mixins Available**:
- `TimestampMixin`: `created_at`, `updated_at`
- `UserTrackingMixin`: `created_by`, `updated_by`
- `SoftDeleteMixin`: `is_deleted`, `deleted_at`, `deleted_by`
- `TenantMixin`: `tenant_id`

---

## Router Creation

```python
from src.core.router import AuditedAPIRouter

# Auto-logs POST, PUT, PATCH, DELETE mutations
router = AuditedAPIRouter()
# OR with prefix:
router = AuditedAPIRouter(prefix="/users")

# All write operations automatically add audit dependency
```

---

## Common Pagination Pattern

```python
@router.get("", response_model=EnvelopeResponse[EntityListResponse])
async def get_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_manager_db),
) -> EnvelopeResponse[EntityListResponse]:
    result = await EntityService.get_list(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )
    return EnvelopeResponse.success_response(result)
```

---

## Service CRUD Template

```python
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

class EntityService:
    @staticmethod
    async def create(db: AsyncSession, data: EntityCreate, created_by: UUID | None = None):
        # Validate uniqueness, create, commit, refresh
        entity = Entity(**data.model_dump(), created_by=created_by)
        db.add(entity)
        await db.commit()
        await db.refresh(entity)
        return EntityResponse.model_validate(entity)

    @staticmethod
    async def get_by_id(db: AsyncSession, entity_id: UUID) -> EntityResponse:
        stmt = select(Entity).where(Entity.id == entity_id, Entity.is_active == True)
        result = await db.execute(stmt)
        entity = result.scalar_one_or_none()
        if not entity:
            raise HTTPException(status_code=404, detail="Not found")
        return EntityResponse.model_validate(entity)

    @staticmethod
    async def get_list(db: AsyncSession, page: int = 1, page_size: int = 20, search: str | None = None):
        stmt = select(Entity).where(Entity.is_active == True)
        
        # Apply search filter
        if search:
            stmt = stmt.where(Entity.name.ilike(f"%{search}%"))
        
        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await db.execute(count_stmt)).scalar_one()
        
        # Paginate
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(stmt)
        entities = result.scalars().all()
        
        return EntityListResponse(
            items=[EntityResponse.model_validate(e) for e in entities],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size,
        )

    @staticmethod
    async def update(db: AsyncSession, entity_id: UUID, data: EntityUpdate, updated_by: UUID | None = None):
        stmt = select(Entity).where(Entity.id == entity_id, Entity.is_active == True)
        entity = (await db.execute(stmt)).scalar_one_or_none()
        if not entity:
            raise HTTPException(status_code=404)
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(entity, field, value)
        
        entity.updated_by = updated_by
        entity.updated_at = datetime.now(timezone.utc)
        
        await db.commit()
        await db.refresh(entity)
        return EntityResponse.model_validate(entity)

    @staticmethod
    async def delete(db: AsyncSession, entity_id: UUID, deleted_by: UUID | None = None):
        stmt = select(Entity).where(Entity.id == entity_id, Entity.is_active == True)
        entity = (await db.execute(stmt)).scalar_one_or_none()
        if not entity:
            raise HTTPException(status_code=404)
        
        entity.is_active = False
        entity.updated_by = deleted_by
        entity.updated_at = datetime.now(timezone.utc)
        await db.commit()
```

---

## Schema Template

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, field_validator

class EntityBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    status: str | None = Field(None, pattern="^(ACTIVE|INACTIVE)$")

class EntityCreate(EntityBase):
    # Additional required fields for creation
    pass

class EntityUpdate(BaseModel):
    # All fields optional for updates
    name: str | None = Field(None, min_length=1, max_length=100)
    status: str | None = Field(None, pattern="^(ACTIVE|INACTIVE)$")

class EntityResponse(EntityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: UUID | None
    updated_by: UUID | None
    
    class Config:
        from_attributes = True

class EntityListResponse(BaseModel):
    items: list[EntityResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
```

---

## Router Registration Pattern

```python
# In src/routers/manager/v1.py

from src.modules.manager.{domain}.{entity}.router import router as {name}_router

main_router = APIRouter()

# Include sub-router
main_router.include_router(
    {name}_router,
    prefix="/{domain}/{entity}",
    tags=["관리자 > {Module} > {Entity}"]
)

# Endpoint: /api/v1/manager/{domain}/{entity}
```

---

## Domain Code Reference

Manager Domains (13 total):
- `idam`: Identity & Access Management
- `bill`: Billing
- `audt`: Audit
- `auto`: Automation
- `tnnt`: Tenant Management
- `mntr`: Monitoring
- `noti`: Notifications
- `bkup`: Backup
- `ifra`: Infrastructure
- `intg`: Integration
- `cnfg`: Configuration
- `supt`: Support
- `stat`: Statistics

Tenant Domains (13+ total):
- `sys`: System
- `crm`: Customer Relationship
- `pim`: Product Information
- `srm`: Sales
- `psm`: Procurement
- `ivm`: Inventory
- `wms`: Warehouse Management
- `hrm`: HR
- `fim`: Finance
- `apm`: Approval
- `bim`: Business Intelligence
- `fam`: Fixed Assets
- `asm`: Asset Service Management

---

## Common HTTP Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | GET, PUT successful |
| `201 Created` | POST successful |
| `204 No Content` | DELETE successful (implicit) |
| `400 Bad Request` | Validation error, already exists |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | No permission |
| `404 Not Found` | Resource not found |
| `422 Unprocessable Entity` | Validation error (Pydantic) |
| `500 Internal Server Error` | Server error |

---

## Commonly Used Imports

```python
# FastAPI & Dependency Injection
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

# Models & Schemas
from pydantic import BaseModel, Field, EmailStr, field_validator
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, DateTime

# Database & ORM
from sqlalchemy import select, func
from uuid import UUID
from datetime import datetime, timezone

# Core utilities
from src.core.database import get_manager_db, get_tenant_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user, get_password_hash
from src.core.exceptions import NotFoundError, ValidationError
from src.modules.shareds.schemas import EnvelopeResponse
from src.models.base import BaseModel as BaseModelORM
```

---

## Testing Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Create (needs auth token)
curl -X POST http://localhost:8000/api/v1/manager/{domain}/{entity} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'

# List with pagination
curl "http://localhost:8000/api/v1/manager/{domain}/{entity}?page=1&page_size=20" \
  -H "Authorization: Bearer {token}"

# Get by ID
curl http://localhost:8000/api/v1/manager/{domain}/{entity}/{id} \
  -H "Authorization: Bearer {token}"

# Update
curl -X PUT http://localhost:8000/api/v1/manager/{domain}/{entity}/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"field": "new_value"}'

# Delete
curl -X DELETE http://localhost:8000/api/v1/manager/{domain}/{entity}/{id} \
  -H "Authorization: Bearer {token}"
```

---

## Key File Locations

```
src/
├── core/
│   ├── exceptions.py        # Exception hierarchy
│   ├── router.py            # AuditedAPIRouter
│   ├── database.py          # DB config
│   ├── security.py          # Auth utilities
│   ├── config.py            # Settings
│   └── middleware.py        # Middleware
│
├── models/
│   ├── base.py              # BaseModel, Mixins
│   ├── manager/
│   │   ├── idam/            # User, Role, etc.
│   │   └── bill/            # Invoice, Plan, etc.
│   └── tenants/
│       ├── crm/             # Partner, Lead, etc.
│       └── pim/             # Product, Category, etc.
│
├── modules/
│   ├── manager/
│   │   ├── idam/users/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   └── ... (40+ modules)
│   ├── tenants/
│   │   └── ... (50+ modules)
│   └── shareds/
│       └── schemas/
│           └── response.py
│
├── routers/
│   ├── manager/
│   │   └── v1.py            # Aggregates all manager modules
│   └── tenants/
│       └── v1.py            # Aggregates all tenant modules
│
└── main.py                  # FastAPI app entry
```

