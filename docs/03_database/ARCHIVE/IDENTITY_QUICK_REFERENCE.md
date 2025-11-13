# ConexGrow Identity Architecture - Quick Reference Guide

**Quick Links**: 
- Full Analysis: `IDENTITY_ARCHITECTURE_ANALYSIS.md`
- Executive Summary: `IDENTITY_ARCHITECTURE_SUMMARY.md`
- This Guide: `IDENTITY_QUICK_REFERENCE.md`

---

## Current State Diagram

```
CURRENT (DISCONNECTED)
════════════════════════════════════════════════════════════════

    sys.users (Authentication)          hrm.employees (HR Master)
    ─────────────────────────           ────────────────────────
    ├─ id (UUID) [PK]                   ├─ id (UUID) [PK]
    ├─ user_code (unique)               ├─ code (unique)
    ├─ username (unique)                ├─ name, name_en, name_cn
    ├─ email (unique, required)         ├─ email (unique, optional)
    ├─ password_hash                    ├─ phone, mobile
    ├─ first_name, last_name            ├─ birth_date, gender
    ├─ phone                            ├─ id_number (encrypted)
    ├─ position (unstructured)          ├─ address1, address2
    ├─ department_id (no FK!)           ├─ postcode
    ├─ role_id (FK→sys.roles) ✓         ├─ department_id (FK) ✓
    ├─ is_active (BOOLEAN)              ├─ job_title
    ├─ last_login_at                    ├─ job_level (ENUM)
    └─ is_deleted                       ├─ job_description
                                        ├─ work_location
    sys.roles (Authorization)           ├─ work_type (ENUM)
    ─────────────────────────           ├─ employment_type (ENUM)
    ├─ id (UUID) [PK]                   ├─ hire_date
    ├─ code (unique)                    ├─ probation_end_date
    ├─ name                             ├─ leave_date, leave_reason
    └─ is_system                        ├─ salary_type, base_salary
                                        ├─ currency_code (FK) ✓
    sys.user_roles                      ├─ status (ENUM - detailed)
    ─────────────────────────           └─ is_deleted
    ├─ user_id (FK) ✓
    ├─ role_id (FK) ✓                   hrm.departments
    └─ expires_at (temp roles)          ─────────────────────────
                                        ├─ id (UUID) [PK]
    sys.sessions (Login tracking)       ├─ code (unique)
    ─────────────────────────           ├─ name (unique)
    ├─ user_id (FK) ✓                   ├─ parent_id (FK, hierarchical)
    ├─ session_id (unique)              ├─ manager_id (FK→employees) ✓
    ├─ device_type, browser             └─ level
    ├─ ip_address, country
    └─ status (ACTIVE/EXPIRED/REVOKED)

    NO RELATIONSHIP BETWEEN:
    ❌ sys.users ↔ hrm.employees
    ❌ sys.users.department_id has NO FK to hrm.departments
```

---

## Problem Summary Table

| # | Problem | Impact | Solution | Timeline |
|---|---------|--------|----------|----------|
| 1 | No users→employees link | Can't query "employees who can login" | Add user_id FK to employees | Week 2 |
| 2 | sys.users.dept_id orphaned | Invalid department references possible | Add FK constraint | Week 1 |
| 3 | Email divergence (email, email?) | Same person has different emails | Sync trigger + validation | Week 3 |
| 4 | Name structure mismatch | Display names can diverge | Sync strategy + trigger | Week 3 |
| 5 | Position unstructured vs structured | Can't filter by job_level | Add job_level to users | Week 3 |
| 6 | Status: is_active vs detailed status | Leave employees show as active | Create unified status view | Week 3 |

---

## The 6 Overlapping Fields

```
FIELD COMPARISON TABLE
═════════════════════════════════════════════════════════════════

Name                    sys.users                hrm.employees
─────────────────────   ────────────────────     ─────────────────
Email                   email (UNIQUE, req)      email (UNIQUE, opt)
Phone                   phone (single)           phone + mobile
Name                    first_name + last_name  name + name_en + name_cn
Position/Job Title      position (string)       job_title + job_level (enum)
Department              dept_id (orphaned)      dept_id (FK constraint)
Status/Active           is_active (boolean)     status (detailed ENUM)
─────────────────────   ────────────────────     ─────────────────

KEY ISSUES:
❌ Same person has:
   - Two different emails
   - Incompatible name structures
   - Different department references
   - Conflicting status signals
   - Unstructured vs structured job level
```

---

## Recommended Future State Diagram

```
RECOMMENDED (LINKED WITH EXPLICIT RELATIONSHIP)
════════════════════════════════════════════════════════════════

    sys.users                           hrm.employees
    ─────────────────────────           ────────────────────────
    ├─ id (UUID) [PK]                   ├─ id (UUID) [PK]
    ├─ user_code (unique)               ├─ code (unique)
    ├─ username (unique)                ├─ name, name_en, name_cn
    ├─ email (unique, required)         ├─ email (unique, optional)
    ├─ password_hash                    ├─ phone, mobile
    ├─ first_name, last_name            ├─ birth_date, gender
    ├─ phone                            ├─ id_number (encrypted)
    ├─ position                         ├─ address1, address2
    ├─ department_id (NEW FK!) ✓         ├─ postcode
    ├─ role_id (FK→sys.roles) ✓         ├─ department_id (FK) ✓
    ├─ job_level (NEW!) ✓               ├─ job_title
    ├─ is_active (BOOLEAN)              ├─ job_level (ENUM) ✓
    ├─ last_login_at                    ├─ job_description
    └─ is_deleted                       ├─ work_location
        ⬆ Added in Week 1,3            ├─ work_type (ENUM)
                                        ├─ employment_type (ENUM)
    Relationships (NEW):                ├─ hire_date
    ─────────────────────               ├─ probation_end_date
    user.employee                       ├─ leave_date, leave_reason
    (one-to-one, optional)              ├─ user_id (NEW FK!) ✓
                                        ├─ salary_type, base_salary
                                        ├─ currency_code (FK) ✓
                                        ├─ status (ENUM - detailed)
                                        └─ is_deleted

KEY IMPROVEMENTS:
✓ Explicit relationship: users.id ←→ employees.user_id
✓ FK constraint: users.dept_id → departments (no orphans)
✓ Structure: users.job_level + employees.job_level (consistent)
✓ Sync: Position auto-syncs from employee.job_title
✓ Optional: user_id is nullable (supports contractors)
```

---

## The 4-Week Implementation Plan

### Week 1: Data Integrity (CRITICAL - DO FIRST)
```
└─ Add FK: sys.users.department_id → hrm.departments
   └─ Risk: LOW (fixes invalid state)
   └─ Impact: Prevents orphaned department references
   └─ Files: 1 migration
   └─ Effort: 1-2 hours
```

### Week 2: Relationship Linking (CORE FEATURE)
```
└─ Add column: hrm.employees.user_id (FK nullable)
├─ Add constraint: UNIQUE(user_id) WHERE user_id IS NOT NULL
├─ Add index: employees(user_id)
├─ Migrate: Match users to employees by email
├─ Python: Update Users + Employees models
└─ Python: Create UserEmployeeService
   └─ Risk: MEDIUM (new column, backward compatible)
   └─ Files: 1 migration, 2 models, 1 service
   └─ Effort: 3-4 hours
```

### Week 3: Consistency & Sync (DATA QUALITY)
```
├─ Add column: sys.users.job_level (VARCHAR 20)
├─ Add trigger: sync job_title → position on employee update
├─ Create view: unified user/employee status
├─ Trigger: sync position from employee
└─ Python: Add sync logic to Employees service
   └─ Risk: LOW (additions only)
   └─ Files: 2 migrations, 1 view, 1 model update, service update
   └─ Effort: 2-3 hours
```

### Week 4: Application Layer (FEATURES)
```
├─ Add endpoints: POST /link-user-to-employee
├─ Add endpoints: DELETE /unlink-user-from-employee
├─ Add validation: Check email compatibility
├─ Add tests: Integration + unit tests
└─ Update docs: API documentation
   └─ Risk: LOW (business logic only)
   └─ Files: 1 router, 1 service, test files, docs
   └─ Effort: 2-3 hours
```

---

## SQL Commands Quick Reference

### Week 1 - Add Department FK
```sql
ALTER TABLE sys.users 
ADD CONSTRAINT fk_users__department_id
  FOREIGN KEY (department_id)
  REFERENCES hrm.departments(id)
  ON DELETE SET NULL;
```

### Week 2 - Add User Link
```sql
ALTER TABLE hrm.employees 
ADD COLUMN user_id UUID,
ADD CONSTRAINT fk_employees__user_id 
  FOREIGN KEY (user_id) REFERENCES sys.users(id) ON DELETE SET NULL,
ADD CONSTRAINT uk_employees__user_id 
  UNIQUE (user_id) WHERE user_id IS NOT NULL;

CREATE INDEX ix_employees__user_id 
  ON hrm.employees(user_id) WHERE user_id IS NOT NULL;

-- Migrate: Match by email
UPDATE hrm.employees e
SET user_id = u.id
FROM sys.users u
WHERE e.email = u.email AND e.email IS NOT NULL;
```

### Week 3 - Add Job Level & Sync
```sql
ALTER TABLE sys.users 
ADD COLUMN job_level VARCHAR(20),
ADD CONSTRAINT ck_users__job_level 
  CHECK (job_level IS NULL OR job_level IN (
    'STAFF', 'SENIOR', 'ASSISTANT_MANAGER', 'MANAGER', 
    'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO'
  ));

-- Trigger for sync
CREATE OR REPLACE FUNCTION sync_user_position_from_employee()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_title IS DISTINCT FROM OLD.job_title 
     AND NEW.user_id IS NOT NULL THEN
    UPDATE sys.users SET position = NEW.job_title
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employee_position_sync
AFTER UPDATE OF job_title ON hrm.employees
FOR EACH ROW
EXECUTE FUNCTION sync_user_position_from_employee();
```

### Create Audit Views
```sql
-- View 1: Find orphaned records
CREATE OR REPLACE VIEW data_quality.identity_orphans AS
SELECT 'User without Employee' as issue_type, u.id, u.username, u.email
FROM sys.users u
WHERE NOT EXISTS (SELECT 1 FROM hrm.employees e WHERE e.user_id = u.id)
UNION ALL
SELECT 'Employee without User', e.id, e.code, e.email
FROM hrm.employees e
WHERE e.user_id IS NULL AND e.email IS NOT NULL;

-- View 2: Find inconsistencies
CREATE OR REPLACE VIEW data_quality.user_employee_inconsistencies AS
SELECT u.id, e.id, 'Email mismatch' as issue, u.email, e.email
FROM sys.users u JOIN hrm.employees e ON u.id = e.user_id
WHERE u.email != e.email;

-- View 3: Find status issues
CREATE OR REPLACE VIEW data_quality.user_status_issues AS
SELECT u.id, u.username, u.is_active, e.status,
  CASE WHEN e.status IN ('TERMINATED','RETIRED') AND u.is_active
    THEN 'User active but employee terminated' END as issue
FROM sys.users u
LEFT JOIN hrm.employees e ON u.id = e.user_id;
```

---

## Python Model Updates Quick Reference

### Users Model - Add Relationship
```python
from sqlalchemy.orm import relationship

class Users(TenantBaseModel):
    # ... existing fields ...
    
    # Add in Week 3
    job_level: Mapped[str | None] = mapped_column(String(20))
    
    # Add in Week 2
    employee: Mapped["Employees"] = relationship(
        "Employees",
        back_populates="user",
        uselist=False,
        foreign_keys="Employees.user_id",
        lazy="selectin"
    )
```

### Employees Model - Add Relationship
```python
from sqlalchemy.orm import relationship

class Employees(TenantBaseModel):
    # ... existing fields ...
    
    # Add in Week 2
    user_id: Mapped[UUID | None] = mapped_column(
        UUID,
        ForeignKey("sys.users.id", ondelete="SET NULL")
    )
    
    user: Mapped["Users"] = relationship(
        "Users",
        back_populates="employee",
        uselist=False,
        foreign_keys=[user_id],
        lazy="selectin"
    )
```

---

## Verification Queries

### After Week 1: Verify Department FK
```sql
-- This should fail with FK violation:
INSERT INTO sys.users (username, email, department_id) 
VALUES ('test', 'test@example.com', 'invalid-uuid');
-- Expected: Constraint violation ✓
```

### After Week 2: Verify User-Employee Link
```sql
-- Query linked users and employees:
SELECT u.username, e.code 
FROM sys.users u
JOIN hrm.employees e ON u.id = e.user_id
LIMIT 10;

-- Find unlinked users:
SELECT * FROM data_quality.identity_orphans;
```

### After Week 3: Verify Job Level & Sync
```sql
-- Check job_level populated:
SELECT username, job_level FROM sys.users 
WHERE job_level IS NOT NULL;

-- Verify position syncs:
UPDATE hrm.employees SET job_title = 'New Title'
WHERE code = 'EMP001';

-- Should see position updated in users:
SELECT position FROM sys.users u
JOIN hrm.employees e ON u.id = e.user_id
WHERE e.code = 'EMP001';
```

### After Week 4: Verify Endpoints
```bash
# Create link (fictional endpoint):
curl -X POST /api/users/{user_id}/link-employee \
  -d '{"employee_id": "..."}' \
  -H "Content-Type: application/json"

# Get status:
curl GET /api/users/{user_id}/employee
```

---

## Common Scenarios

### Scenario 1: New Employee with System Access
```sql
-- Create user in sys.users
INSERT INTO sys.users (username, email, ...) 
VALUES ('john.doe', 'john@company.com', ...);

-- Create employee in hrm.employees
INSERT INTO hrm.employees (code, name, email, ...)
VALUES ('EMP001', 'John Doe', 'john@company.com', ...);

-- Link them (Week 2+)
UPDATE hrm.employees 
SET user_id = (SELECT id FROM sys.users WHERE email = 'john@company.com')
WHERE code = 'EMP001';
```

### Scenario 2: Contractor (No Employee Record)
```sql
-- Create user only, no employee record needed
INSERT INTO sys.users (username, email, ...)
VALUES ('contractor.bob', 'bob@contractor.com', ...);

-- hrm.employees.user_id stays NULL
-- They can still login and have roles
-- Is completely valid in the new design
```

### Scenario 3: Query Active Employees Who Can Login
```sql
-- BEFORE (impossible):
-- No direct link between users and employees

-- AFTER Week 2 (simple):
SELECT e.code, e.name, u.username
FROM hrm.employees e
JOIN sys.users u ON e.user_id = u.id
WHERE e.status = 'ACTIVE' 
  AND u.is_active = true;
```

### Scenario 4: Employee Changes Job Title
```sql
-- UPDATE employee
UPDATE hrm.employees 
SET job_title = 'Senior Manager'
WHERE code = 'EMP001';

-- AUTOMATICALLY (Week 3 trigger):
-- sys.users.position gets updated
-- sys.users.job_level gets synced

-- Verify:
SELECT position, job_level FROM sys.users
WHERE id = (SELECT user_id FROM hrm.employees WHERE code = 'EMP001');
```

---

## Files to Review/Modify

### Database Schema Files
```
/packages/database/schemas/tenants/
├─ 22_sys/
│  ├─ 01_users.sql              (modify Week 1, 3)
│  ├─ 14_user_roles.sql         (reference)
│  └─ 13_sessions.sql           (reference)
├─ 02_hrm/
│  ├─ 01_departments.sql        (reference)
│  └─ 02_employees.sql          (modify Week 2)
└─ migrations/
   ├─ weekly_update_1.sql       (Week 1: FK)
   ├─ weekly_update_2.sql       (Week 2: user_id)
   ├─ weekly_update_3a.sql      (Week 3: job_level)
   └─ weekly_update_3b.sql      (Week 3: trigger)

Migration naming: YYYYMMDD_hhmm_description.sql
```

### Python Model Files
```
/apps/backend-api/src/models/tenants/
├─ sys/
│  └─ users.py                  (modify Week 2, 3)
├─ hrm/
│  └─ employees.py              (modify Week 2)
└─ services/
   └─ new: user_employee_service.py  (create Week 2)

New models:
- UserEmployeeService (Week 2)
- Sync logic in EmployeeService (Week 3)
- API endpoints (Week 4)
```

---

## Success Checklist

After implementation, verify:

- [ ] Users cannot have invalid department_id (FK constraint)
- [ ] Employees can be linked to users via user_id
- [ ] user_id is nullable (supports contractors)
- [ ] Position syncs from employee.job_title
- [ ] job_level exists in both tables
- [ ] Audit views show no orphaned records
- [ ] Can query "active employees who can login"
- [ ] Existing code still works (backward compatible)
- [ ] Tests pass (new + existing)
- [ ] Documentation updated

---

## Rollback Plan

If any week's changes fail:

**Week 1 Rollback**:
```sql
-- Drop FK constraint
ALTER TABLE sys.users 
DROP CONSTRAINT fk_users__department_id;
```

**Week 2 Rollback**:
```sql
-- Drop user_id column
ALTER TABLE hrm.employees 
DROP COLUMN user_id CASCADE;
```

**Week 3 Rollback**:
```sql
-- Drop job_level
ALTER TABLE sys.users DROP COLUMN job_level;

-- Drop trigger
DROP TRIGGER IF EXISTS trg_employee_position_sync ON hrm.employees;
DROP FUNCTION IF EXISTS sync_user_position_from_employee();
```

---

## More Information

- **Full Analysis**: `IDENTITY_ARCHITECTURE_ANALYSIS.md` (1102 lines)
- **Executive Summary**: `IDENTITY_ARCHITECTURE_SUMMARY.md` (400 lines)
- **This Guide**: `IDENTITY_QUICK_REFERENCE.md` (this file)

Document your changes in: `/docs/implementation/backend-api/`
