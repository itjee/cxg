# Backend API Documentation Index

## Complete Architecture Documentation for CXG Backend API

This folder contains comprehensive documentation for the CXG backend-api architecture, patterns, and implementation guidelines.

---

## Document Guide

### 1. ARCHITECTURE_SUMMARY.md (19 KB)
**The main overview document** - Start here for a complete understanding.

Contains:
- Architecture layers diagram (FastAPI -> Routers -> Modules -> Core -> Database)
- Core patterns (Exception handling, Response wrapping, Module structure, CRUD)
- Database architecture (Manager DB vs Tenant DB with all 13+ schemas)
- Authentication & Security details
- Technology stack
- Module naming conventions
- Endpoint structure with examples
- Complete development workflow for adding new modules
- Testing examples

**Best for**: Getting a comprehensive understanding of the entire system

---

### 2. backend_architecture_analysis.md (15 KB)
**Detailed layer-by-layer analysis** - Deep dive into each component.

Contains:
- Core layers: Exception handling, Router layer, Database layer, Security
- Base models and mixins explained
- Router integration patterns
- Complete IDAM Users module walkthrough (Model, Router, Schemas, Service)
- Billing module reference
- Shared patterns
- Directory structure
- Best practices
- Module conventions

**Best for**: Understanding how specific layers work and detailed implementation patterns

---

### 3. module_file_references.md (20 KB)
**Complete code examples and file locations** - Copy-paste ready reference.

Contains:
- All core file paths with absolute locations
- Exception hierarchy examples
- Custom router implementation
- Base models mixin code
- Database configuration code
- Security functions
- Response wrapping examples
- Complete IDAM Users module:
  - Model definition (src/models/manager/idam/user.py)
  - Router with all endpoints (src/modules/manager/idam/users/router.py)
  - Complete schemas (src/modules/manager/idam/users/schemas.py)
  - Full service implementation (src/modules/manager/idam/users/service.py)
  - Integration in aggregator (src/routers/manager/v1.py)
- Billing module examples
- Key file locations summary table

**Best for**: Finding specific code examples and understanding exact implementations

---

### 4. QUICK_REFERENCE.md (12 KB)
**Developer cheat sheet** - Quick lookup for common tasks.

Contains:
- Exception quick reference table
- Database dependencies snippet
- Security & authentication imports
- Response wrapping patterns
- Model base classes quick guide
- Router creation
- Pagination pattern
- Full CRUD service template
- Schema template
- Router registration pattern
- Domain codes (all 26 domains listed)
- HTTP status codes
- Common imports
- Curl command examples for testing
- Key file locations summary

**Best for**: Quick lookups while coding, reference during implementation

---

## Directory Structure

```
CXG Backend API
/apps/backend-api/src/
├── core/                          # Core framework
│   ├── exceptions.py              # Exception hierarchy
│   ├── router.py                  # AuditedAPIRouter
│   ├── database.py                # Dual DB setup
│   ├── security.py                # Auth, hashing, JWT
│   └── config.py                  # Settings
│
├── models/                        # Data models
│   ├── base.py                    # BaseModel, Mixins
│   ├── manager/                   # Admin DB schemas
│   │   ├── idam/                  # Identity & Access (User, Role, etc.)
│   │   ├── bill/                  # Billing (Invoice, Plan, Transaction)
│   │   ├── audt/                  # Audit
│   │   └── ... (10+ more)
│   └── tenants/                   # Customer DB schemas
│       ├── crm/                   # CRM
│       ├── pim/                   # Product
│       ├── srm/                   # Sales
│       └── ... (13+ more)
│
├── modules/                       # Business logic
│   ├── manager/                   # Admin modules (40+ total)
│   │   ├── idam/users/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── bill/invoices/
│   │   └── ... (38+ more)
│   ├── tenants/                   # Customer modules (50+ total)
│   └── shareds/                   # Shared utilities
│       └── schemas/
│           └── response.py        # EnvelopeResponse
│
├── routers/                       # Endpoint aggregation
│   ├── manager/
│   │   └── v1.py                  # Combines 40+ manager modules
│   └── tenants/
│       └── v1.py                  # Combines 50+ tenant modules
│
└── main.py                        # FastAPI app entry point
```

---

## Quick Navigation

### I want to...

**Understand the overall architecture**
→ Read: `ARCHITECTURE_SUMMARY.md` (Sections 1-3)

**Learn how a specific layer works**
→ Read: `backend_architecture_analysis.md` (Section 1-7)

**See complete code examples**
→ Read: `module_file_references.md` (Sections 1-6)

**Add a new module quickly**
→ Read: `ARCHITECTURE_SUMMARY.md` (Section "Development Workflow")
→ Use: `QUICK_REFERENCE.md` for templates

**Find a specific file or function**
→ Read: `module_file_references.md` (Key File Locations Summary)
→ Use: `QUICK_REFERENCE.md` (Key File Locations)

**Understand error handling**
→ Read: `backend_architecture_analysis.md` (Section 1.1)
→ Check: `QUICK_REFERENCE.md` (Core Exceptions table)

**Learn authentication**
→ Read: `ARCHITECTURE_SUMMARY.md` (Section "Authentication & Security")
→ Check: `module_file_references.md` (Section 5)

**Understand database setup**
→ Read: `backend_architecture_analysis.md` (Section 1.3)
→ Check: `module_file_references.md` (Section 4)

**See IDAM Users module (reference implementation)**
→ Read: `backend_architecture_analysis.md` (Section 4)
→ See code: `module_file_references.md` (Section "IDAM USERS MODULE")

---

## Key Concepts at a Glance

### Exception Hierarchy
6 custom exceptions with semantic codes, wrapped in EnvelopeResponse

### Database Architecture
2 separate PostgreSQL databases:
- **Manager DB**: Admin data (13+ schemas, 40+ modules)
- **Tenant DB**: Customer-isolated data (13+ schemas, 50+ modules)

### Module Structure
Every module has:
1. Model (SQLAlchemy ORM)
2. Schemas (Pydantic validation)
3. Service (Business logic)
4. Router (FastAPI endpoints)

### Audit Trail
Automatic tracking:
- `created_at`, `updated_at` (timestamps)
- `created_by`, `updated_by` (user attribution)
- `is_active` (soft delete flag)

### Response Format
All responses wrapped in `EnvelopeResponse`:
```json
{
  "success": true/false,
  "data": {...},
  "error": {...}
}
```

### Authentication
- JWT tokens with OAuth2
- Password hashing (bcrypt, 12 rounds)
- User tracking via `current_user` dependency

---

## File Statistics

| Document | Size | Focus | Best For |
|----------|------|-------|----------|
| ARCHITECTURE_SUMMARY.md | 19 KB | Complete overview | Understanding full system |
| backend_architecture_analysis.md | 15 KB | Detailed analysis | Deep understanding |
| module_file_references.md | 20 KB | Code examples | Implementation |
| QUICK_REFERENCE.md | 12 KB | Quick lookup | During coding |

**Total**: 66 KB of comprehensive documentation

---

## Standards & Conventions

### Naming
- **Models**: `src/models/{manager|tenants}/{domain}/{entity}.py`
- **Routers**: `src/modules/{manager|tenants}/{domain}/{entity}/router.py`
- **Services**: `src/modules/{manager|tenants}/{domain}/{entity}/service.py`
- **Schemas**: `src/modules/{manager|tenants}/{domain}/{entity}/schemas.py`

### Domain Codes (4 letters)
Manager: idam, bill, audt, auto, tnnt, mntr, noti, bkup, ifra, intg, cnfg, supt, stat
Tenant: sys, crm, pim, srm, psm, ivm, wms, hrm, fim, apm, bim, fam, asm, and more

### Patterns
- CRUD: Create, Get By ID, Get List (paginated), Update, Delete, Status change
- Pagination: page, page_size (max 100), total, total_pages
- Responses: All wrapped in EnvelopeResponse[T]
- Exceptions: Custom hierarchy with semantic codes

---

## Getting Started

### For New Developers
1. Read: `ARCHITECTURE_SUMMARY.md` (30 min)
2. Skim: `backend_architecture_analysis.md` Section 4 (IDAM Users example)
3. Bookmark: `QUICK_REFERENCE.md` for daily use

### For Adding a New Module
1. Check: `QUICK_REFERENCE.md` templates
2. Copy: Service CRUD template
3. Copy: Schema template
4. Follow: Development Workflow in `ARCHITECTURE_SUMMARY.md`
5. Reference: IDAM Users in `module_file_references.md`

### For Understanding a Specific Layer
1. Find the layer in `ARCHITECTURE_SUMMARY.md` diagram
2. Read detailed explanation in `backend_architecture_analysis.md`
3. Look up code in `module_file_references.md`

---

## Implementation Checklist

When creating a new module:
- [ ] Create Model in `src/models/{scope}/{domain}/{entity}.py`
- [ ] Create Schemas in `src/modules/{scope}/{domain}/{entity}/schemas.py`
- [ ] Create Service in `src/modules/{scope}/{domain}/{entity}/service.py`
- [ ] Create Router in `src/modules/{scope}/{domain}/{entity}/router.py`
- [ ] Register in `src/routers/{scope}/v1.py`
- [ ] Add to appropriate `__init__.py` files
- [ ] Test endpoints with curl or Postman
- [ ] Verify soft delete works (is_active = False)
- [ ] Verify audit tracking (created_by, updated_by)

---

## Technology Stack

- **Framework**: FastAPI 0.100+
- **ORM**: SQLAlchemy 2.x (async)
- **Database**: PostgreSQL (2 separate instances)
- **Driver**: asyncpg
- **Validation**: Pydantic v2
- **Auth**: JWT + OAuth2
- **Hashing**: bcrypt
- **API Docs**: Swagger UI + Scalar

---

## Module Count

- **Manager modules**: 40+ (across 13 domains)
- **Tenant modules**: 50+ (across 13+ domains)
- **Total endpoints**: 300+ (5 CRUD per entity)
- **Models**: 100+ (manager + tenant)
- **Services**: 100+ (one per entity)

---

## Support & Questions

For questions about specific sections:
1. Check the relevant document
2. Use Ctrl+F to search for keywords
3. Cross-reference between documents
4. Check IDAM Users (Section 4 of backend_architecture_analysis.md) as reference

---

## Document Version

- **Created**: November 8, 2025
- **For**: CXG Backend API
- **Architecture**: Multi-tenant FastAPI + Dual PostgreSQL
- **Completeness**: Comprehensive (100+ modules documented)

---

## Next Steps

1. Choose which document to read based on your goal
2. Follow the navigation guide above
3. Use QUICK_REFERENCE.md while coding
4. Reference IDAM Users module when implementing new entities
5. Follow the implementation checklist when adding modules

Happy coding!
