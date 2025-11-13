# ConexGrow Module Architecture - File Reference Index

**Generated**: 2025-10-26
**Status**: Complete Analysis with File Locations

---

## Key Analysis Documents

### Main Analysis
- **Full Analysis**: `/home/itjee/workspace/cxg/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md`
  - 17 comprehensive sections
  - Design decisions explained
  - Query patterns and examples
  - 18 KB detailed documentation

### Quick Reference
- **Visual Summary**: `/home/itjee/workspace/cxg/packages/database/schemas/MODULE_ARCHITECTURE_SUMMARY.txt`
  - Formatted text with boxes and tables
  - Quick lookup reference
  - Key insights highlighted

---

## Core Schema Files - Manager DB

### Manager DB - IDAM Schema
**Path**: `/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/`

1. **Permissions Definition** (CORE)
   - File: `02_permissions.sql`
   - Purpose: Manager DB permission catalog
   - Contains: 4 categories (tenant, system, billing, monitoring)
   - Format: `category:resource:action`
   - Size: 5.5 KB

2. **Roles Definition** (CORE)
   - File: `03_roles.sql`
   - Purpose: Manager DB role definitions
   - Features: GLOBAL/TENANT scope, priority levels
   - Size: 4.1 KB

3. **Role-Permission Mapping** (CORE)
   - File: `04_role_permissions.sql`
   - Purpose: Assign permissions to roles
   - Features: Tracking who granted permissions
   - Size: 2.8 KB

4. **User-Role Mapping** (CORE)
   - File: `05_user_roles.sql`
   - Purpose: Assign roles to users
   - Features: GLOBAL/TENANT scope, temporary assignments
   - Size: 4.7 KB

---

## Core Schema Files - Tenants DB

### Tenants DB - SYS Schema
**Path**: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/`

1. **Permissions Definition** (CORE - MODULE CODES HERE)
   - File: `03_permissions.sql`
   - Purpose: Tenant permission catalog
   - Key Feature: **11 MODULE CODES AS STRING ENUM**
   - Format: `module_code:resource:action`
   - Modules: ADM, PSM, SRM, IVM, FIM, LWM, CSM, ASM, BIM, COM, SYS
   - Size: 5.0 KB

2. **Roles Definition** (CORE)
   - File: `02_roles.sql`
   - Purpose: Tenant role definitions
   - Features: System vs custom roles, soft delete
   - Size: 4.0 KB

3. **Role-Permission Mapping** (CORE)
   - File: `04_role_permissions.sql`
   - Purpose: Assign permissions to roles
   - Features: CASCADE delete, multiple indices
   - Size: 3.7 KB

4. **Sessions Tracking** (NEW - Oct 2025)
   - File: `13_sessions.sql`
   - Purpose: Track tenant employee login sessions
   - Features: Device tracking, geolocation, security monitoring
   - Size: 6.3 KB

5. **User-Role Mapping** (NEW - Oct 2025)
   - File: `14_user_roles.sql`
   - Purpose: Track role assignments with full audit history
   - Features: Temporary roles (expires_at), grant/revoke tracking
   - Size: 5.0 KB

6. **Role Permission History** (NEW - Oct 2025)
   - File: `15_role_permissions_history.sql`
   - Purpose: Audit trail for permission changes
   - Features: Automatic trigger-based logging, compliance reporting
   - Size: 5.1 KB

---

## Supporting Documentation Files

### In Main SYS Folder
**Path**: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/`

1. **README.md** - SYS Schema Overview
   - 530 lines
   - Quick start guide
   - All 8 table descriptions
   - Usage examples and queries

2. **SCHEMA_IMPROVEMENTS.md** - Design Details
   - 400+ lines
   - P0/P1/P2 improvement priorities
   - Detailed SQL for new features
   - Implementation roadmap

3. **IMPLEMENTATION_GUIDE.md** - Python/ORM Integration
   - 400+ lines
   - SQLAlchemy model examples
   - FastAPI endpoint examples
   - Database query patterns

### In Main Schemas Folder
**Path**: `/home/itjee/workspace/cxg/packages/database/schemas/`

1. **USER_ROLE_PERMISSION_ARCHITECTURE.md** - Complete Architecture
   - 900 lines
   - Compares Manager DB vs Tenants DB
   - Problem analysis (5 issues identified)
   - Improvement recommendations with priority

2. **MODULE_ARCHITECTURE_ANALYSIS.md** (THIS ANALYSIS)
   - 500+ lines
   - Detailed comparison of both DBs
   - Module list with descriptions
   - Design patterns and decisions

3. **MODULE_ARCHITECTURE_SUMMARY.txt** (THIS ANALYSIS)
   - Quick reference with formatting
   - All modules in table format
   - Design decisions explained

4. **MODULE_REFERENCE_INDEX.md** (THIS FILE)
   - File location index
   - Quick navigation guide

---

## Archived/Optional Files

### Module Metadata (Optional)
**Path**: `/home/itjee/workspace/cxg/packages/database/schemas/tenants/22_sys/_archive/`

1. **06_modules.sql** - Module Master Table
   - Purpose: Full module metadata (icon, color, route, etc.)
   - Status: Archived (not currently used)
   - Reason: Kept simple with string codes
   - When to use: If dynamic module management needed

2. **07_tenant_modules.sql** - Per-tenant Module Activation
   - Status: Archived
   - Purpose: Selectively enable modules per tenant

3. **08_modules_init_data.sql** - Standard Module Data
   - Status: Archived
   - Contains: Sample module initialization

4. **MODULE_MANAGEMENT_GUIDE.md** - Module Documentation
   - Location: `_archive/MODULE_MANAGEMENT_GUIDE.md`
   - Explains module metadata structure

5. **MODULE_QUERIES_REFERENCE.sql** - Common Queries
   - Location: `_archive/MODULE_QUERIES_REFERENCE.sql`
   - Frequently used SQL patterns

---

## Quick Navigation by Task

### I want to understand...

**How permissions are defined in Manager DB:**
- Read: `/packages/database/schemas/manager/02_idam/02_permissions.sql`
- Then: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 1

**How permissions are defined in Tenants DB:**
- Read: `/packages/database/schemas/tenants/22_sys/03_permissions.sql`
- Then: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 2

**All available modules:**
- Read: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 3
- Or: `/packages/database/schemas/MODULE_ARCHITECTURE_SUMMARY.txt` Section 3

**Why modules are string codes:**
- Read: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 7
- Then: `/packages/database/schemas/tenants/22_sys/03_permissions.sql` (constraint)

**How to query user permissions:**
- Read: `/packages/database/schemas/tenants/22_sys/README.md` (Usage Examples section)
- Then: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 14

**New session tracking features:**
- Read: `/packages/database/schemas/tenants/22_sys/13_sessions.sql`
- Context: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 11

**Permission resolution flow:**
- Read: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 9
- Code: `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md`

**Design decisions explained:**
- Read: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` Section 16
- Full context: `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md`

---

## Module Code Reference

### Active Modules (11)

| Code | Name | Schema Folder | Status |
|------|------|---------------|--------|
| ADM | Administration | 01_adm | Active |
| PSM | Procurement/Sourcing | 11_psm | Active |
| SRM | Sales/Revenue | 12_srm | Active |
| IVM | Inventory Management | 10_ivm | Active |
| FIM | Finance/Accounting | 14_fim | Active |
| LWM | Workflow/Approval | 16_lwm | Active |
| CSM | Customer/CRM | 03_crm | Active |
| ASM | Asset Management | 13_asm | Active |
| BIM | Business Intelligence | 20_bim | Active |
| COM | Communication | 21_com | Active |
| SYS | System Configuration | 22_sys | Active |

### Module Codes - Where Defined

**Current Implementation:**
- Location: `/packages/database/schemas/tenants/22_sys/03_permissions.sql`
- Format: CHECK constraint (string enum)
- Constraint Name: `ck_permissions__module_code`
- Type: NOT a foreign key (intentional design choice)

**Optional Metadata:**
- Location: `/packages/database/schemas/tenants/22_sys/_archive/06_modules.sql`
- Contains: icon, color, route_path, license_type, display_order, etc.
- Status: Available but not used (simplicity by design)

---

## Manager DB Structure

**Location**: `/packages/database/schemas/manager/`

### IDAM Schema (02_idam/ folder)
- User authentication and authorization
- Platform operator permissions
- 4 permission categories (not modules)
- Session tracking for operators
- API key management

### TNNT Schema (01_tnnt/ folder)
- Tenant metadata management
- Tenant-user associations
- Cross-tenant visibility (for operators)

---

## Tenants DB Structure

**Location**: `/packages/database/schemas/tenants/`

### SYS Schema (22_sys/ folder)
- Tenant employee access control
- Business module permissions
- Complete tenant isolation
- 11 module-based permissions
- Session and audit trail tracking

### Other Schemas (01_adm through 21_com)
- Module-specific schemas
- Data tables for each business module
- Organized by module code

---

## Permission Format Comparison

### Manager DB Format
```
category:resource:action
Examples:
  tenant:read
  system:config:write
  billing:invoice:list
```

### Tenants DB Format
```
MODULE_RESOURCE_ACTION
Examples:
  ADM_USERS_CREATE
  PSM_PURCHASE_ORDER_APPROVE
  SRM_SALES_ORDER_READ
  IVM_INVENTORY_UPDATE
```

---

## Database Query Examples

### Get User's Active Permissions (Tenants DB)
**Location**: `/packages/database/schemas/tenants/22_sys/README.md` (line 396)
**Also**: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` (Section 14)

### Get Permissions by Module (Tenants DB)
**Location**: `/packages/database/schemas/MODULE_ARCHITECTURE_ANALYSIS.md` (Section 14)

### Manager DB Permission Queries
**Location**: `/packages/database/schemas/USER_ROLE_PERMISSION_ARCHITECTURE.md` (Section 7)

---

## Implementation Guides

### Python/FastAPI Implementation
**Location**: `/packages/database/schemas/tenants/22_sys/IMPLEMENTATION_GUIDE.md`
- SQLAlchemy model definitions
- FastAPI endpoint examples
- Permission checking patterns
- Session management code

### Database Initialization
**Quick Start**: `/packages/database/schemas/tenants/22_sys/README.md` (line 64)
- Step-by-step SQL execution order
- How to initialize all tables
- Verification commands

---

## Important Design Patterns

### String Codes for Modules (Key Decision)

**Why NOT foreign keys:**
1. No JOIN overhead in queries
2. Modules are static/rarely change
3. Avoids cascading delete issues
4. Better performance on permission checks
5. Flexibility to add new permissions

**Trade-offs:**
1. Cannot dynamically add modules without migration
2. Metadata stored separately (archived)
3. Application handles module logic

**Current Constraint** (in sys.permissions):
```sql
CONSTRAINT ck_permissions__module_code CHECK (
    module_code IN ('ADM', 'ASM', 'BIM', 'COM', 'CSM', 'FIM',
                    'IVM', 'LWM', 'PSM', 'SRM', 'SYS')
)
```

**If Dynamic Modules Needed:**
- Use: `/packages/database/schemas/tenants/22_sys/_archive/06_modules.sql`
- This provides full metadata table approach
- Clear upgrade path available

---

## Key Files Summary

### Must Read (Core Understanding)
1. `03_permissions.sql` (Tenants DB) - WHERE MODULES ARE DEFINED
2. `MODULE_ARCHITECTURE_ANALYSIS.md` - Complete analysis
3. `USER_ROLE_PERMISSION_ARCHITECTURE.md` - Architecture overview

### Should Read (Implementation)
1. `13_sessions.sql` - New session tracking
2. `14_user_roles.sql` - User-role mapping
3. `README.md` - Quick start guide
4. `IMPLEMENTATION_GUIDE.md` - Code examples

### Reference (When Needed)
1. `02_permissions.sql` (Manager DB) - Platform permissions
2. `_archive/06_modules.sql` - Module metadata
3. `_archive/MODULE_QUERIES_REFERENCE.sql` - Common queries

---

## Getting Started Checklist

- [ ] Read `MODULE_ARCHITECTURE_SUMMARY.txt` (quick overview - 5 min)
- [ ] Read `MODULE_ARCHITECTURE_ANALYSIS.md` (detailed understanding - 20 min)
- [ ] Review `03_permissions.sql` (see module codes - 5 min)
- [ ] Check `README.md` in 22_sys folder (implementation details - 10 min)
- [ ] Look at `IMPLEMENTATION_GUIDE.md` (coding patterns - 15 min)

---

## Document Versions

| Document | Version | Date | Status |
|----------|---------|------|--------|
| MODULE_ARCHITECTURE_ANALYSIS.md | 1.0 | 2025-10-26 | Final |
| MODULE_ARCHITECTURE_SUMMARY.txt | 1.0 | 2025-10-26 | Final |
| MODULE_REFERENCE_INDEX.md | 1.0 | 2025-10-26 | Final |

---

## Contact & Support

For questions about:
- **Module definitions**: See `03_permissions.sql` constraint
- **Architecture**: See `USER_ROLE_PERMISSION_ARCHITECTURE.md`
- **Implementation**: See `IMPLEMENTATION_GUIDE.md`
- **Database setup**: See `README.md` in 22_sys folder

---

**Last Updated**: 2025-10-26
**Analysis Status**: Complete
**Scope**: Manager DB (IDAM) + Tenants DB (SYS)
