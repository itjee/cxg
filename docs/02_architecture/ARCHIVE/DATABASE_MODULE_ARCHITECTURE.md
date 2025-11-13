# ConexGrow Module and Permission Architecture Analysis

**Analysis Date**: 2025-10-26
**Scope**: Manager DB (IDAM) + Tenants DB (SYS)
**Status**: Complete Analysis

---

## Executive Summary

ConexGrow uses a **dual-database permission architecture** with two distinct permission systems:

1. **Manager DB (IDAM)**: Operations management and platform administration
2. **Tenants DB (SYS)**: Business module permissions for tenant employees

**Key Finding**: Modules are defined as **string codes** (enum-style) in the Tenants DB, NOT as table references. This is a simpler, more flexible approach suitable for business permissions.

---

## 1. MANAGER DB PERMISSION STRUCTURE (IDAM)

### Location
`/packages/database/schemas/manager/02_idam/02_permissions.sql`

### Permissions Table Definition

```sql
CREATE TABLE idam.permissions (
    id UUID PRIMARY KEY,
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    permission_name VARCHAR(100),
    description TEXT,
    category VARCHAR(50),           -- Categories: tenant, system, billing, monitoring
    resource_type VARCHAR(50),      -- Resource type
    action VARCHAR(50),              -- CRUD actions: CREATE, READ, UPDATE, DELETE, LIST, MANAGE
    scope VARCHAR(20),              -- GLOBAL or TENANT
    applies_to VARCHAR(20),         -- ALL, MASTER, TENANT, SYSTEM
    is_system BOOLEAN,
    status VARCHAR(20)              -- ACTIVE, INACTIVE
);
```

### Key Characteristics
- **Modules**: NOT defined as enum or table
- **Permission Format**: `category:resource:action` (e.g., `tenant:read`, `system:config:write`)
- **Categories**: tenant, system, billing, monitoring
- **Actions**: CREATE, READ, UPDATE, DELETE, LIST, MANAGE
- **Scope**: GLOBAL (all tenants) or TENANT (specific tenant)
- **Applies To**: ALL users, MASTER (admin only), TENANT (tenant users), SYSTEM (system only)
- **No module_code field**: Manager DB handles platform-level permissions, not business modules

### Role-Permission Mapping

```
idam.users
    ↓ (user_type: MASTER, SYSTEM)
idam.user_roles (scope: GLOBAL/TENANT, tenant_context: NULL/UUID)
    ↓ (multiple roles per user)
idam.roles
    ↓
idam.role_permissions
    ↓
idam.permissions (category: tenant/system/billing/monitoring)
```

### Permission Categories
- **tenant**: Tenant management operations
- **system**: System configuration
- **billing**: Billing and subscription management
- **monitoring**: Infrastructure monitoring

---

## 2. TENANTS DB PERMISSION STRUCTURE (SYS)

### Location
`/packages/database/schemas/tenants/22_sys/03_permissions.sql`

### Permissions Table Definition

```sql
CREATE TABLE sys.permissions (
    id UUID PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200),
    module_code VARCHAR(50) NOT NULL,    -- MODULE ENUM!
    resource VARCHAR(100),                -- Resource name
    action VARCHAR(50),                   -- Action type
    description TEXT,
    is_active BOOLEAN DEFAULT true
);
```

### Key Characteristic: Module Codes as Strings
**Modules are defined as VARCHAR enum constraints, NOT as foreign keys to a modules table:**

```sql
CONSTRAINT ck_permissions__module_code CHECK (
    module_code IN (
        'ADM', 'ASM', 'BIM', 'COM', 'CSM', 'FIM', 'IVM', 'LWM', 'PSM', 'SRM', 'SYS'
    )
)
```

This design pattern:
- Avoids foreign key overhead
- Allows static definition of available modules
- Simplifies permission queries
- Enables soft deletion without cascading deletes

### Role-Permission Mapping

```
sys.users (tenant_id for isolation)
    ↓
sys.user_roles (NEW - tracks role assignments with history)
    ↓ (multiple roles per user)
sys.roles (tenant_id for isolation)
    ↓
sys.role_permissions
    ↓
sys.permissions (module_code: ADM, PSM, SRM, etc.)
```

---

## 3. APPLICATION MODULES - COMPLETE LIST

### All Available Modules (11 Total)

The system defines these 11 business modules as string codes. They are shared across all tenants but can be activated/deactivated per tenant.

#### Core Infrastructure Modules (4)
| Code | Full Name | Schema | Description | Category |
|------|-----------|--------|-------------|----------|
| **ADM** | Administration | 01_adm | User/role management, system settings | Core |
| **SYS** | System Configuration | 22_sys | System settings, modules, permissions | Core |
| **COM** | Communication | 21_com | Internal messaging, notifications | Core |
| **BIM** | Business Intelligence | 20_bim | Analytics, reporting, dashboards | Core |

#### Business/Operations Modules (7)
| Code | Full Name | Schema | Description | Category |
|------|-----------|--------|-------------|----------|
| **PSM** | Procurement/Sourcing | 11_psm | Purchase orders, supplier management | Operations |
| **SRM** | Sales/Revenue | 12_srm | Sales orders, quotes, invoicing | Operations |
| **IVM** | Inventory Management | 10_ivm | Stock management, warehouse operations | Operations |
| **FIM** | Finance/Accounting | 14_fim | General ledger, accounts, financial reports | Operations |
| **LWM** | Workflow/Approval | 16_lwm | Process workflows, approvals, routing | Operations |
| **CSM** | Customer/CRM | 03_crm | Customer data, interactions, relationships | Operations |
| **ASM** | Asset Management | 13_asm | Asset tracking, maintenance, lifecycle | Operations |

#### Future/Deprecated Modules (Not Currently in Use)
- HRM (Human Resource Management) - 02_hrm
- PIM (Product Information) - 04_pim
- WMS (Warehouse Management) - 05_wms
- APM (Asset Portfolio Management) - 06_apm
- FAM (Facility Asset Management) - 15_fam

---

## 4. MODULE ARCHITECTURE COMPARISON

### Manager DB vs Tenants DB

```
┌─────────────────────┬──────────────────────┬──────────────────────┐
│ Aspect              │ Manager DB (IDAM)    │ Tenants DB (SYS)     │
├─────────────────────┼──────────────────────┼──────────────────────┤
│ Purpose             │ Platform operations  │ Business operations  │
│ Users               │ Operators (MASTER)   │ Tenant employees     │
│ Module Definition   │ No modules           │ 11 string codes      │
│ Permission Format   │ category:resource    │ module:resource:actn │
│                     │ :action              │                      │
│ Categories/Modules  │ ~4 categories        │ ~11 modules          │
│ Isolation           │ Logical (user_type)  │ Physical (tenant_id) │
│ Scope               │ GLOBAL/TENANT        │ Per-tenant only      │
│ Applies To          │ ALL/MASTER/TENANT    │ Role-based only      │
│                     │ /SYSTEM              │                      │
└─────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 5. PERMISSION DEFINITIONS STRUCTURE

### Manager DB: Permission Code Format
```
category:resource:action

Examples:
  tenant:read           (Read tenant info)
  system:config:write   (Write system config)
  billing:invoice:list  (List invoices)
  monitoring:logs:read  (Read monitoring logs)
```

### Tenants DB: Permission Code Format
```
[module]_[resource]_[action]

Examples:
  PSM_PURCHASE_ORDER_CREATE     (Create purchase order)
  SRM_SALES_ORDER_APPROVE       (Approve sales order)
  IVM_INVENTORY_UPDATE          (Update inventory)
  FIM_ACCOUNT_READ              (Read account)
  ADM_USERS_DELETE              (Delete user)
```

---

## 6. CURRENT SCHEMA IMPLEMENTATION

### Manager DB (IDAM) - Permission Definition
**File**: `/packages/database/schemas/manager/02_idam/02_permissions.sql`

Structure:
- No module concept
- Category-based organization
- Designed for platform administration
- Scope flexibility (GLOBAL or TENANT)
- Applies_to filtering

Indices (9):
- permission_code, category, resource_type, action
- scope, applies_to, is_system, status
- category_action (composite)

### Tenants DB (SYS) - Permission Definition
**File**: `/packages/database/schemas/tenants/22_sys/03_permissions.sql`

Structure:
- **Module-based organization**: 11 business modules
- **Module_code constraint**: Enum-style CHECK constraint
- **No foreign key to modules table**: Intentional design
- Action types: CREATE, READ, UPDATE, DELETE, APPROVE, REJECT, EXPORT, IMPORT, EXECUTE

Indices (5):
- code (UNIQUE), module_code
- resource, action
- module_resource (composite)

---

## 7. MODULE ENUM CONSTRAINT (Key Design Pattern)

### Why String Codes Instead of Foreign Keys?

**Tenants DB Design Decision**:
```sql
-- Instead of this (with FK):
ALTER TABLE sys.permissions 
ADD CONSTRAINT fk_module FOREIGN KEY (module_code)
REFERENCES sys.modules(code);

-- They use this (string enum):
CONSTRAINT ck_permissions__module_code CHECK (
    module_code IN (
        'ADM', 'ASM', 'BIM', 'COM', 'CSM', 'FIM', 
        'IVM', 'LWM', 'PSM', 'SRM', 'SYS'
    )
)
```

**Advantages**:
1. No circular dependencies or additional table lookups
2. Modules are immutable/rarely change
3. Simpler queries (no extra JOIN)
4. Business logic stays in application layer
5. Faster permission checks
6. Avoids cascading deletes

**Trade-offs**:
- Module metadata (icon, display_order, etc.) stored elsewhere
- Constraint changes require migrations
- Cannot dynamically add modules without schema change

---

## 8. SHARED VS TENANT-SPECIFIC MODULES

### Shared Across All Tenants
The 11 modules are **universal definitions** shared across the ConexGrow platform:
- All tenants have access to the same module codes
- Module definitions are centralized
- Permission templates can be standardized

### Tenant-Specific Activation
However, implementation allows **per-tenant customization**:
- Not all tenants need all modules
- License-based module availability (requires_license field in archived modules table)
- Roles can vary per tenant
- Permission assignments vary per tenant

---

## 9. PERMISSION RESOLUTION FLOW

### Manager DB (Operator)
```
1. User authentication (user_type: MASTER/SYSTEM)
   ↓
2. Load user roles (idam.user_roles with scope + tenant_context)
   ↓
3. For each role → load permissions (idam.role_permissions)
   ↓
4. Filter by applies_to (ALL, MASTER, TENANT, SYSTEM)
   ↓
5. Check scope (GLOBAL or TENANT for context)
   ↓
6. Cache permission set
```

### Tenants DB (Employee)
```
1. User authentication (tenant_id isolation)
   ↓
2. Load active user roles (sys.user_roles where is_active=true)
   ↓
3. For each role → load permissions (sys.role_permissions)
   ↓
4. Filter by module_code and is_active
   ↓
5. Create permission set grouped by module
   ↓
6. Cache permission set
```

---

## 10. PERMISSION CODE CONVENTIONS

### Manager DB
```
Pattern: category:resource:action

Categories (4):
  - tenant       (tenant management)
  - system       (system config)
  - billing      (billing operations)
  - monitoring   (infrastructure monitoring)

Examples:
  tenant:read
  tenant:users:create
  tenant:roles:update
  system:config:write
  system:email:manage
  billing:invoice:list
  billing:subscription:update
  monitoring:logs:read
```

### Tenants DB
```
Pattern: MODULE_RESOURCE_ACTION

Modules (11):
  ADM (Administration)
  PSM (Procurement)
  SRM (Sales/Revenue)
  IVM (Inventory)
  FIM (Finance)
  LWM (Workflow)
  CSM (CRM)
  ASM (Asset Management)
  BIM (BI/Analytics)
  COM (Communication)
  SYS (System)

Examples:
  ADM_USERS_CREATE
  ADM_ROLES_UPDATE
  PSM_PURCHASE_ORDER_CREATE
  PSM_PURCHASE_ORDER_APPROVE
  SRM_SALES_ORDER_READ
  IVM_INVENTORY_UPDATE
  FIM_ACCOUNT_EXPORT
  LWM_WORKFLOW_EXECUTE
```

---

## 11. RECENT SCHEMA IMPROVEMENTS (Oct 2025)

### New Tables Added to Tenants DB

#### sys.sessions (13_sessions.sql)
- **Purpose**: Track tenant employee login sessions
- **Features**: 
  - Device tracking (WEB, MOBILE, API, DESKTOP)
  - Geolocation (IP, country, city)
  - Session lifecycle (created, expires, revoked)
  - 8 optimized indices

#### sys.user_roles (14_user_roles.sql) 
- **Purpose**: Track user-to-role assignments with history
- **Features**:
  - Multiple roles per user
  - Temporary roles (expires_at)
  - Role grant/revoke tracking
  - Complete audit trail

#### sys.role_permissions_history (15_role_permissions_history.sql)
- **Purpose**: Audit trail for permission changes
- **Features**:
  - Automatic logging via triggers
  - Action tracking (GRANTED/REVOKED)
  - Change reason documentation
  - Compliance reporting support

---

## 12. IMPLEMENTATION NOTES

### Module Storage Location
- **Master definition**: Enum constraint in sys.permissions.module_code
- **Metadata** (archived): _archive/06_modules.sql contains full module metadata table
- **Current approach**: String codes for simplicity and performance

### Permission Code Format
```
-- RECOMMENDED (currently used):
module:resource:action  OR  MODULE_RESOURCE_ACTION

-- NOT used:
module.resource.action
module-resource-action
module|resource|action
```

### Action Types

**Manager DB**:
- CREATE, READ, UPDATE, DELETE, LIST, MANAGE

**Tenants DB**:
- CREATE, READ, UPDATE, DELETE, APPROVE, REJECT, EXPORT, IMPORT, EXECUTE

---

## 13. MULTI-TENANCY ISOLATION

### Manager DB
- **Isolation**: Logical (via user_type field)
- **Cross-tenant visibility**: Some operators can manage multiple tenants
- **Scope flexibility**: GLOBAL (all tenants) or TENANT (specific tenant)

### Tenants DB
- **Isolation**: Physical (tenant_id in all tables)
- **Data completeness**: Each tenant has complete separate database
- **No cross-tenant visibility**: Queries always filtered by tenant_id

---

## 14. RECOMMENDED QUERY PATTERNS

### Get All Permissions for a Tenant Employee

```sql
-- Tenants DB: Get active permissions for a user
SELECT DISTINCT 
    p.code,
    p.name,
    p.module_code,
    p.resource,
    p.action
FROM sys.users u
JOIN sys.user_roles ur ON u.id = ur.user_id
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
JOIN sys.role_permissions rp ON ur.role_id = rp.role_id
    AND rp.is_active = true
JOIN sys.permissions p ON rp.permission_id = p.id
    AND p.is_active = true
WHERE u.id = $user_id
  AND u.tenant_id = $tenant_id
ORDER BY p.module_code, p.resource, p.action;
```

### Get All Permissions by Module

```sql
-- Group permissions by module for UI rendering
SELECT 
    p.module_code,
    COUNT(*) as total_permissions,
    COUNT(CASE WHEN rp.id IS NOT NULL THEN 1 END) as assigned_to_role
FROM sys.permissions p
LEFT JOIN sys.role_permissions rp ON p.id = rp.permission_id
WHERE p.is_active = true
GROUP BY p.module_code
ORDER BY p.module_code;
```

---

## 15. KEY DIFFERENCES FROM TYPICAL RBAC

### Standard RBAC Model
```
User → Role → Permission
```

### ConexGrow Implementation

**Manager DB**:
```
User → [Multiple Roles with Scope/Context] → Permissions
       (GLOBAL or TENANT context)
       (Optional expiration)
```

**Tenants DB**:
```
User → [Multiple Roles with Expiration] → Permissions
       (Module-based)
       (Complete audit trail)
```

### Special Features
1. **Scoped Roles** (Manager DB): Same role can apply globally or to specific tenant
2. **Temporary Assignments** (Both DBs): Roles and permissions can expire
3. **Audit Logging** (Tenants DB): Complete history of all permission changes
4. **Multi-Tenant Support** (Both DBs): Designed from ground up for multi-tenancy

---

## 16. SYSTEM DESIGN DECISIONS

### Why Two Databases?
1. **Operational Isolation**: Manager DB handles platform operations
2. **Data Security**: Tenant data physically separated
3. **Performance**: Each tenant can scale independently
4. **Compliance**: Easier to meet data residency requirements

### Why String Codes for Modules?
1. **Simplicity**: Modules are static/rarely change
2. **Performance**: No JOIN overhead
3. **Flexibility**: Can change permission structure without database migration
4. **Scalability**: Works across distributed systems

### Why Module Metadata in Archive?
1. **Separation of Concerns**: Module metadata separate from permissions
2. **Future Flexibility**: Can be enabled when dynamic modules needed
3. **Current Simplicity**: Avoid complexity not currently needed
4. **Path to Enhancement**: Clear upgrade path if needed

---

## 17. SUMMARY TABLE: MODULE CODES

| Module | Category | Purpose | Primary Tables | Status |
|--------|----------|---------|-----------------|--------|
| **ADM** | Core | User/Role management | 01_adm schema | Active |
| **PSM** | Operations | Purchasing/Procurement | 11_psm schema | Active |
| **SRM** | Operations | Sales/Revenue | 12_srm schema | Active |
| **IVM** | Operations | Inventory/Warehouse | 10_ivm schema | Active |
| **FIM** | Operations | Finance/Accounting | 14_fim schema | Active |
| **LWM** | Operations | Workflows/Approvals | 16_lwm schema | Active |
| **CSM** | Operations | Customer/CRM | 03_crm schema | Active |
| **ASM** | Operations | Asset Management | 13_asm schema | Active |
| **BIM** | Core | Analytics/Reports | 20_bim schema | Active |
| **COM** | Core | Communication | 21_com schema | Active |
| **SYS** | Core | System Config | 22_sys schema | Active |

---

## Conclusion

ConexGrow's module and permission architecture represents a **well-designed dual-database system** with:

✅ **Clear separation**: Platform admin (Manager DB) vs. business users (Tenants DB)
✅ **Module-based design**: 11 business modules shared across all tenants
✅ **String-code modules**: Intentional choice for simplicity and performance
✅ **Complete audit trails**: Recent additions for compliance and security
✅ **Multi-tenancy support**: Physical isolation with flexible permission scoping
✅ **Flexible permissions**: From simple roles to time-limited, temporary assignments

The architecture is **production-ready** with room for enhancement through optional module metadata tables when dynamic module management becomes necessary.

