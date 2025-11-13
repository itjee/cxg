# ConexGrow User vs Employee Identity Architecture - Executive Summary

**Document**: `IDENTITY_ARCHITECTURE_ANALYSIS.md`
**Scope**: Tenants DB (tnnt_db) - sys.users vs hrm.employees
**Date**: October 26, 2025
**Status**: Ready for Implementation

---

## Quick Overview

ConexGrow maintains a **deliberately separated dual-identity pattern**:

```
sys.users          ↔ hrm.employees
(Authentication)    (HR/Payroll)
├─ username         ├─ employee_code
├─ email            ├─ name
├─ password_hash    ├─ email
├─ position         ├─ department_id (FK)
├─ department_id    ├─ job_title
├─ role_id          ├─ job_level
└─ is_active        ├─ employment_type
                    ├─ hire_date
                    ├─ salary_info
                    └─ status (detailed)
```

**Current State**: NO DIRECT RELATIONSHIP (no FK between them)
**Assessment**: INTENTIONAL but INCOMPLETE

---

## The 6 Critical Issues

### 1. No Relationship Between Tables (Critical)
```
Problem: sys.users and hrm.employees are completely disconnected
Impact: Cannot query "employees who can login" or enforce "user = employee" policy
Fix: Add user_id FK to hrm.employees (nullable, for contractors)
Priority: P0 (this week)
```

### 2. Department Reference Orphaning (Critical)
```
Problem: sys.users.department_id has NO FK constraint
Impact: Users can reference non-existent departments
Fix: Add FK: sys.users.department_id → hrm.departments
Priority: P0 (this week)
```

### 3. Email Divergence Risk (High)
```
Problem: sys.users.email (required) vs hrm.employees.email (optional)
Impact: Same person may have different emails in each table
Fix: Add validation/trigger to keep emails in sync
Priority: P1 (next week)
```

### 4. Name Structure Mismatch (High)
```
Problem: sys.users splits name (first_name + last_name)
        hrm.employees combines name (+ name_en, name_cn)
Impact: Display names can diverge for same person
Fix: Document sync strategy + add trigger
Priority: P1 (next week)
```

### 5. Position/Job Title Inconsistency (Medium)
```
Problem: sys.users.position (unstructured string)
        hrm.employees.job_title + job_level (structured)
Impact: Cannot easily filter users by structured job_level
Fix: Sync position from employee; use enum for consistency
Priority: P1 (next week)
```

### 6. Status Fields Divergence (Medium)
```
Problem: sys.users.is_active (BOOLEAN)
        hrm.employees.status (ENUM: ACTIVE/LEAVE/TERMINATED/etc)
Impact: Employee on leave shows is_active=true (misleading)
Fix: Create unified view; add job_level to users
Priority: P2 (week 3)
```

---

## The Fix: 4-Week Implementation Plan

### Week 1: Critical Data Integrity (Do First!)
**What**: Fix foundational data integrity issues
**Changes**:
- Add FK constraint: sys.users.department_id → hrm.departments
- Identify and fix any orphaned department references
- Create validation audit view

**SQL** (1 file):
```sql
ALTER TABLE sys.users 
ADD CONSTRAINT fk_users__department_id
  FOREIGN KEY (department_id)
  REFERENCES hrm.departments(id)
  ON DELETE SET NULL;
```

**Files Changed**: Migration file only
**Risk**: Low (only adds constraint, fixes invalid state)

---

### Week 2: Relationship Linking (Core Feature)
**What**: Link users to employees explicitly
**Changes**:
- Add user_id column to hrm.employees
- Migrate matching records (email-based)
- Add audit view for orphaned records
- Update Python models

**SQL** (1 file):
```sql
ALTER TABLE hrm.employees 
ADD COLUMN user_id UUID,
ADD CONSTRAINT fk_employees__user_id 
  FOREIGN KEY (user_id) 
  REFERENCES sys.users(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT uk_employees__user_id 
  UNIQUE (user_id) WHERE user_id IS NOT NULL;

CREATE INDEX ix_employees__user_id 
  ON hrm.employees(user_id) 
  WHERE user_id IS NOT NULL;
```

**Python Changes**:
- Add `user_id` field to Employees model
- Add `employee` relationship to Users model
- Create UserEmployeeService

**Files Changed**: 
- 1 migration file
- 2 model files (Users, Employees)
- 1 service file (new)

**Risk**: Medium (adds new column but backwards compatible)

---

### Week 3: Data Sync & Consistency
**What**: Ensure overlapping fields stay in sync
**Changes**:
- Add position/job_title sync trigger
- Add job_level to sys.users
- Create unified status view
- Document email sync policy

**SQL** (2 files):
```sql
-- Add job_level to users
ALTER TABLE sys.users 
ADD COLUMN job_level VARCHAR(20),
ADD CONSTRAINT ck_users__job_level 
  CHECK (job_level IS NULL OR job_level IN (
    'STAFF', 'SENIOR', 'ASSISTANT_MANAGER', 'MANAGER', 
    'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO'
  ));

-- Trigger for position sync
CREATE TRIGGER trg_employee_position_sync
AFTER UPDATE OF job_title ON hrm.employees
FOR EACH ROW
WHEN (NEW.job_title IS DISTINCT FROM OLD.job_title)
EXECUTE FUNCTION sync_user_position_from_employee();
```

**Python Changes**:
- Update Users model: add `job_level` field
- Update service: add sync logic

**Files Changed**:
- 2 migration files
- 1 model file (Users)
- 1 service file

**Risk**: Low (additions only, no breaking changes)

---

### Week 4: Application Layer & Testing
**What**: Implement business logic and validation
**Changes**:
- Add API endpoints for linking/unlinking users to employees
- Add validation in services
- Add comprehensive tests
- Update API documentation

**Files Changed**:
- 1 router file (new or updated)
- 1 service file
- Test files
- Documentation

**Risk**: Low (business logic, no DB changes)

---

## Implementation Checklist

### Pre-Implementation
- [ ] Run audit: identify current orphaned records
- [ ] Document existing user-employee relationships (if any)
- [ ] Review application code for hardcoded assumptions
- [ ] Brief team on new relationship pattern

### Week 1
- [ ] Create migration: add FK to sys.users.department_id
- [ ] Run migration
- [ ] Fix any orphaned records
- [ ] Verify data integrity
- [ ] Create department orphan detection script

### Week 2
- [ ] Create migration: add user_id to hrm.employees
- [ ] Run migration
- [ ] Migrate matching records (email-based automation)
- [ ] Update Python models (Users + Employees)
- [ ] Create UserEmployeeService
- [ ] Create orphan audit view
- [ ] Test relationship navigation

### Week 3
- [ ] Create migration: add job_level to sys.users
- [ ] Create migration: add position sync trigger
- [ ] Create unified status view
- [ ] Update Users model
- [ ] Add position sync logic to Employees service
- [ ] Test sync functionality

### Week 4
- [ ] Implement user-employee link/unlink endpoints
- [ ] Add validation in services
- [ ] Write integration tests
- [ ] Write unit tests for services
- [ ] Update API documentation
- [ ] Create migration guide for other environments

---

## Data Quality Audit Views (Provided)

Three audit views are provided to monitor data quality:

### 1. Identity Orphans View
```sql
-- Shows unlinked users and employees
SELECT * FROM data_quality.identity_orphans;

-- Returns:
-- User without Employee: john (john@example.com)
-- Employee without User: EMP001 (emp001@example.com)
```

### 2. User-Employee Inconsistencies View
```sql
-- Shows conflicts when user is linked to employee
SELECT * FROM data_quality.user_employee_inconsistencies;

-- Returns:
-- Email mismatch: user has john@a.com, employee has john@b.com
-- Department mismatch: user in dept1, employee in dept2
```

### 3. Status Issues View
```sql
-- Shows status conflicts between user and employee
SELECT * FROM data_quality.user_status_issues;

-- Returns:
-- User active but employee terminated/retired
-- User active but employee on leave
```

---

## Key Design Decisions

### Decision 1: Why Keep Separation?
**Answer**: Because not all system users are employees
- Contractors can use the system but aren't employees
- Consultants may have limited access
- Partners may need specific system access
- This is a SaaS best practice for flexibility

### Decision 2: Why Add Explicit Link?
**Answer**: To support enforcement when needed
- Some companies want to enforce "user = employee"
- Need ability to query linked relationships
- Audit trail for who is linked when
- FK constraint ensures data integrity

### Decision 3: Why Nullable user_id?
**Answer**: To support non-employee users
- Contractors, consultants may not be in employee table
- Allows gradual migration for existing data
- Maintains flexibility

### Decision 4: Why Sync Fields?
**Answer**: Because users need to trust data
- Single source of truth per field (documented)
- Prevents divergence that causes confusion
- Automated sync reduces manual errors

---

## What NOT to Do

❌ **Don't**: Merge sys.users and hrm.employees
- They serve different purposes (auth vs HR)
- Would break contractor/consultant support
- Would require massive migration

❌ **Don't**: Make user_id mandatory immediately
- Need to handle existing contractors first
- Gives time for migration
- Can enforce at application level if needed

❌ **Don't**: Replicate all employee fields to users
- Would cause sync nightmares
- Violates DRY principle
- Use relationships and views instead

❌ **Don't**: Sync all fields bidirectionally
- Creates complexity and inconsistency
- Define clear master for each field
- One-way sync or application-level logic

---

## Success Criteria

After implementation, you should be able to:

1. ✅ Query "active employees who can login"
```sql
SELECT e.* FROM hrm.employees e
JOIN sys.users u ON e.user_id = u.id
WHERE e.status = 'ACTIVE' AND u.is_active = true;
```

2. ✅ Enforce "no orphaned departments"
```sql
-- This will error due to FK constraint:
INSERT INTO sys.users (username, email, department_id)
VALUES ('john', 'john@example.com', 'invalid-uuid');
-- Constraint violation: department_id not found
```

3. ✅ Track user-employee relationships
```sql
-- See who is linked:
SELECT u.username, e.code FROM sys.users u
LEFT JOIN hrm.employees e ON u.id = e.user_id
WHERE e.id IS NOT NULL;
```

4. ✅ Identify orphaned records
```sql
-- Unlinked users (might be contractors):
SELECT * FROM data_quality.identity_orphans;
```

5. ✅ Prevent status conflicts
```sql
-- Employees on leave won't accidentally show as active:
CREATE OR REPLACE VIEW sys.user_employee_status AS ...
```

---

## Reference Documents

Full analysis available in: `IDENTITY_ARCHITECTURE_ANALYSIS.md`

Contains:
- 1102 lines of detailed analysis
- SQL migration scripts
- Python model updates
- Industry best practices
- Troubleshooting guide
- Migration path with specific dates

---

## Questions & Clarifications

### Q: Will this break existing code?
**A**: No. The changes are backward compatible:
- New columns are nullable
- New FK constraints on non-existent columns
- New views don't affect existing queries
- Relationships are optional in ORM

### Q: Do I have to link all users to employees?
**A**: No. user_id in employees is nullable for flexibility:
- Contractors/consultants can stay unlinked
- Full flexibility for different organizational models
- Can enforce at application level if desired

### Q: What about existing code that doesn't use relationships?
**A**: It will continue to work:
- Relationships are optional in SQLAlchemy
- Existing queries don't change
- New queries can use relationships
- Gradual migration approach

### Q: How do I handle migration?
**A**: Follow the 4-week plan:
- Week 1: Fix data integrity (no breaking changes)
- Week 2: Add relationships (backward compatible)
- Week 3: Add consistency mechanisms (backward compatible)
- Week 4: Add application logic (use new features)

---

## Contact & Support

For detailed analysis and implementation guidance, refer to:
- `IDENTITY_ARCHITECTURE_ANALYSIS.md` (main document)
- `packages/database/schemas/tenants/22_sys/` (SQL schemas)
- `apps/backend-api/src/models/tenants/` (Python models)

---

**Status**: Ready to implement
**Complexity**: Medium (phased approach)
**Risk**: Low (backward compatible)
**Effort**: 4 weeks (distributed)
**Impact**: High (core identity management)
