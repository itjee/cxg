# DDL Column Rename - Application Code References

## Summary

This document catalogs all occurrences of renamed columns across the ConexGrow application.

### Renamed Columns Reference

**Manager Database (idam schema):**
- `roles`: `role_code` → `code`, `role_name` → `name`, `role_type` → `type`
- `permissions`: `permission_code` → `code`, `permission_name` → `name`, `resource_type` → `resource`

**Manager Database (tnnt schema):**
- `tenants`: `tenant_code` → `code`, `tenant_name` → `name`, `tenant_type` → `type`

**Tenant Database (wms schema):**
- `warehouse_employees`: Column `type` is used (not `role_type` or `employee_code`/`employee_name`)

---

## 1. SQLAlchemy ORM Models (Python)

### Manager Database Models

#### A. Role Model
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/role.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 16 | Constraint | `"role_type IN (...)` | CHECK constraint in SQLAlchemy table_args |
| 17 | Constraint | `name="ck_roles__role_type"` | Constraint name still references old column name |
| 24 | Column | `role_code: Mapped[str]` | **NEEDS UPDATE** to `code` |
| 25 | Column | `role_name: Mapped[str]` | **NEEDS UPDATE** to `name` |
| 29 | Column | `role_type: Mapped[str]` | **KEEP AS IS** - type is correct |
| 38 | String | `f"<Role(id={self.id}, code={self.role_code}` | **NEEDS UPDATE** - f-string uses old attribute name |

#### B. Permission Model
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/permission.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 27-28 | Column | `permission_code: Mapped[str]` | **NEEDS UPDATE** to `code` |
| 30 | Column | `permission_name: Mapped[str]` | **NEEDS UPDATE** to `name` |
| 35 | Column | `resource_type: Mapped[str]` | **NEEDS UPDATE** to `resource` |
| 47 | String | `f"<Permission(id={self.id}, code={self.permission_code})"` | **NEEDS UPDATE** - f-string uses old attribute name |

#### C. Tenant Model
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/tnnt/tenant.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 21 | Constraint | `"tenant_type IN (...)"` | **NEEDS UPDATE** to `type IN (...)` |
| 22 | Constraint | `name="ck_tenants__tenant_type"` | Constraint name references old column |
| 31 | Constraint | `"tenant_code ~ ..."` | **NEEDS UPDATE** to `code ~ ...` |
| 37 | Column | `tenant_code: Mapped[str]` | **NEEDS UPDATE** to `code` |
| 38 | Column | `tenant_name: Mapped[str]` | **NEEDS UPDATE** to `name` |
| 39-41 | Column | `tenant_type: Mapped[str]` | **NEEDS UPDATE** to `type` |
| 75 | String | `f"<Tenant(id={self.id}, code={self.tenant_code}, name={self.tenant_name})>"` | **NEEDS UPDATE** - f-string uses old attribute names |

### Tenant Database Models

#### D. Roles Model (Tenant Schema)
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/sys/roles.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 15 | Column | `role_code: Mapped[str]` | **NEEDS UPDATE** to `code` |
| 16 | Column | `role_name: Mapped[str]` | **NEEDS UPDATE** to `name` |

#### E. Permissions Model (Tenant Schema)
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/sys/permissions.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 15 | Column | `permission_code: Mapped[str]` | **NEEDS UPDATE** to `code` |
| 16 | Column | `permission_name: Mapped[str]` | **NEEDS UPDATE** to `name` |
| 18 | Column | `resource: Mapped[str]` | **CORRECT** - already uses `resource` |

#### F. WarehouseEmployees Model
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/wms/warehouse_employees.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 19 | Column | `role_type: Mapped[str]` | **KEEP AS IS** - no rename for warehouse_employees.role_type |

---

## 2. Pydantic Schemas (API Validation)

### Manager API Schemas

#### A. Role Schemas (Manager)
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/roles/schemas.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 19 | Field | `role_code: str = Field(...)` | **NEEDS UPDATE** to `code` |
| 20 | Field | `role_name: str = Field(...)` | **NEEDS UPDATE** to `name` |
| 38 | Field | `role_code: str \| None = Field(...)` | **NEEDS UPDATE** to `code` |
| 39 | Field | `role_name: str \| None = Field(...)` | **NEEDS UPDATE** to `name` |

#### B. Permission Schemas (Tenant)
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/permissions/schemas.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 19 | Field | `permission_code: str = Field(...)` | **NEEDS UPDATE** to `code` |
| 20 | Field | `permission_name: str = Field(...)` | **NEEDS UPDATE** to `name` |
| 39 | Field | `permission_code: str \| None = Field(...)` | **NEEDS UPDATE** to `code` |
| 40 | Field | `permission_name: str \| None = Field(...)` | **NEEDS UPDATE** to `name` |

#### C. WarehouseEmployees Schemas
**File:** `/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/wms/warehouse_employees/schemas.py`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 21 | Field | `role_type: str \| None = Field(...)` | **KEEP AS IS** - no rename for warehouse_employees.role_type |
| 54 | Field | `role_type: str \| None = Field(...)` | **KEEP AS IS** |

---

## 3. SQL Schema Definitions

### Database Schema Files

#### A. Manager idam.roles Table
**File:** `/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/03_roles.sql`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 18 | Column | `code VARCHAR(100)` | **ALREADY CORRECT** |
| 19 | Column | `name VARCHAR(100)` | **ALREADY CORRECT** |
| 23 | Column | `type VARCHAR(50)` | **ALREADY CORRECT** |
| 36 | Constraint | `type IN (...)` | **ALREADY CORRECT** |

#### B. Manager idam.permissions Table
**File:** `/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/02_permissions.sql`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 18 | Column | `code VARCHAR(100)` | **ALREADY CORRECT** |
| 19 | Column | `name VARCHAR(100)` | **ALREADY CORRECT** |
| 24 | Column | `resource VARCHAR(50)` | **ALREADY CORRECT** |

#### C. Manager tnnt.tenants Table
**File:** `/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/01_tenants.sql`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 18 | Column | `code VARCHAR(20)` | **ALREADY CORRECT** |
| 19 | Column | `name VARCHAR(100)` | **ALREADY CORRECT** |
| 20 | Column | `type VARCHAR(20)` | **ALREADY CORRECT** |

#### D. Tenant wms.warehouse_employees Table
**File:** `/home/itjee/workspace/cxg/packages/database/schemas/tenants/05_wms/02_warehouse_employees.sql`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 22 | Column | `type VARCHAR(20)` | **ALREADY CORRECT** |

---

## 4. TypeScript Type Definitions (Frontend)

### Manager Web App

#### A. Tenant Types
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/tnnt/tenant/types/tenant.types.ts`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 3-4 | Interface | `code: string; name: string;` | **ALREADY CORRECT** - uses simplified names |
| 20 | Interface | `code: string; name: string;` | **ALREADY CORRECT** |

#### B. Role Types
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/role/types/role.types.ts`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 6-7 | Interface | `code: string; name: string;` | **ALREADY CORRECT** - uses simplified names |
| 20 | Interface | `code: string; name: string;` | **ALREADY CORRECT** |

#### C. Permission Types
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/permission/types/permission.types.ts`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 13-14 | Interface | `code: string; name: string;` | **ALREADY CORRECT** - uses simplified names |
| 18 | Interface | `resource: string;` | **ALREADY CORRECT** |

### Frontend Components

#### D. Tenant Columns Component
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/tnnt/tenant/components/tenant-columns.tsx`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 78 | Column | `accessorKey: "name"` | **ALREADY CORRECT** |

#### E. Role Columns Component
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/role/components/role-columns.tsx`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 58 | Column | `accessorKey: "name"` | **ALREADY CORRECT** |

#### F. Permission Columns Component
**File:** `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/permission/components/permission-columns.tsx`

| Line | Type | Reference | Details |
|------|------|-----------|---------|
| 102-103 | Column | `accessorKey: "code"` | **ALREADY CORRECT** |
| 125 | Column | `accessorKey: "resource"` | **ALREADY CORRECT** |

---

## 5. Migration Scripts

### Alembic/Manual Migration Scripts

#### A. Phase 1 Manager DDL Improvements
**File:** `/home/itjee/workspace/cxg/apps/backend-api/scripts/migrations/001_ddl_improvements_phase1_manager_20251027.sql`

Status: Already includes the column rename statements

#### B. Rollback Script
**File:** `/home/itjee/workspace/cxg/apps/backend-api/scripts/migrations/999_rollback_ddl_improvements_20251027.sql`

Status: Already includes rollback logic

---

## Summary of Required Updates

### Critical Updates Needed (Python ORM Models)

1. **`/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/tnnt/tenant.py`**
   - Line 37: `tenant_code` → `code`
   - Line 38: `tenant_name` → `name`
   - Line 39: `tenant_type` → `type`
   - Line 21-22: Update CHECK constraint references
   - Line 31: Update CHECK constraint references
   - Line 75: Update `__repr__` f-string

2. **`/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/role.py`**
   - Line 24: `role_code` → `code`
   - Line 25: `role_name` → `name`
   - Line 16-17: Update CHECK constraint references
   - Line 38: Update `__repr__` f-string

3. **`/home/itjee/workspace/cxg/apps/backend-api/src/models/manager/idam/permission.py`**
   - Line 27-28: `permission_code` → `code`
   - Line 30: `permission_name` → `name`
   - Line 35: `resource_type` → `resource`
   - Line 47: Update `__repr__` f-string

4. **`/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/sys/roles.py`**
   - Line 15: `role_code` → `code`
   - Line 16: `role_name` → `name`

5. **`/home/itjee/workspace/cxg/apps/backend-api/src/models/tenants/sys/permissions.py`**
   - Line 15: `permission_code` → `code`
   - Line 16: `permission_name` → `name`

### Schema Updates Needed (Pydantic)

1. **`/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/roles/schemas.py`**
   - Line 19: `role_code` → `code`
   - Line 20: `role_name` → `name`
   - Line 38-39: Same updates for UpdateSchema

2. **`/home/itjee/workspace/cxg/apps/backend-api/src/modules/tenants/sys/permissions/schemas.py`**
   - Line 19: `permission_code` → `code`
   - Line 20: `permission_name` → `name`
   - Line 39-40: Same updates for UpdateSchema

### No Updates Needed

- **Frontend TypeScript types**: Already using simplified names (`code`, `name`, `resource`)
- **Frontend components**: Already using correct accessor keys
- **SQL Schema files**: Already contain correct column names
- **Migration scripts**: Already contain correct rename statements
- **WarehouseEmployees**: Uses `type` not `role_type`, no update needed
