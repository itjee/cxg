# ConexGrow Tenants DB: User vs Employee Identity Architecture Analysis

**Analysis Date**: October 26, 2025
**Database**: Tenant Database (tnnt_db)
**Scope**: sys.users, hrm.employees, and related tables
**Status**: Comprehensive Review Complete

---

## Executive Summary

The ConexGrow Tenants DB maintains a **deliberately separated dual-identity pattern** with:
- **sys.users** (sys schema): Authentication/access control entities
- **hrm.employees** (hrm schema): HR/payroll/organizational HR data

**Current State**: No direct relationship exists between these tables (no foreign key linking them).

**Assessment**: This separation is **INTENTIONAL and CORRECT** for a multi-tenant SaaS ERP, BUT requires clarification and potentially an explicit linking mechanism for enterprise scenarios.

---

## Part 1: Current State Analysis

### 1.1 Table Structure Comparison

#### sys.users (Authentication/Authorization)
```
Purpose: System user accounts for login and access control
Location: 22_sys/01_users.sql
Scope: One per tenant
```

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID PK | User identifier |
| user_code | VARCHAR(50) | System user code (unique per tenant) |
| username | VARCHAR(100) | Login username (unique per tenant) |
| email | VARCHAR(255) | Email for login & notifications |
| password_hash | VARCHAR(255) | Encrypted password (bcrypt) |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| phone | VARCHAR(50) | Contact phone |
| department_id | UUID | Department assignment (nullable) |
| position | VARCHAR(100) | Job position/title |
| role_id | UUID FK | Role reference (→ sys.roles) |
| last_login_at | TIMESTAMP TZ | Last login tracking |
| is_active | BOOLEAN | Account enabled/disabled |
| is_deleted | BOOLEAN | Soft delete flag |
| created_at, created_by, updated_at, updated_by | AUDIT | Standard audit fields |

**Data Integrity**: User uniqueness constraints on (username, email) per tenant

---

#### hrm.employees (HR Master Data)
```
Purpose: HR/payroll/organizational master data
Location: 02_hrm/02_employees.sql
Scope: One per tenant
```

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID PK | Employee identifier |
| code | VARCHAR(20) | Employee ID (unique per tenant) |
| name | VARCHAR(100) | Employee full name (Korean) |
| name_en | VARCHAR(100) | Employee name (English) |
| name_cn | VARCHAR(100) | Employee name (Chinese) |
| birth_date | DATE | Date of birth |
| gender | VARCHAR(10) | MALE/FEMALE/OTHER |
| nationality | VARCHAR(3) | ISO country code |
| id_number | VARCHAR(50) | ID/passport number |
| phone | VARCHAR(50) | Office phone |
| mobile | VARCHAR(50) | Mobile number |
| email | VARCHAR(255) | Email address |
| emergency_contact | VARCHAR(50) | Emergency contact |
| emergency_contact_name | VARCHAR(100) | Emergency contact name |
| postcode | VARCHAR(10) | Address postcode |
| address1 | VARCHAR(200) | Primary address |
| address2 | VARCHAR(200) | Secondary address |
| department_id | UUID FK | Department (→ hrm.departments) |
| job_title | VARCHAR(100) | Job title/position |
| job_level | VARCHAR(20) | Job level (STAFF, MANAGER, etc.) |
| job_description | TEXT | Job description |
| work_location | VARCHAR(100) | Work location |
| work_type | VARCHAR(20) | OFFICE/REMOTE/HYBRID/FIELD |
| employment_type | VARCHAR(20) | REGULAR/CONTRACT/PART_TIME/INTERN |
| hire_date | DATE | Hiring date |
| probation_end_date | DATE | Probation end date |
| leave_date | DATE | Termination date |
| leave_reason | TEXT | Reason for leaving |
| salary_type | VARCHAR(20) | MONTHLY/HOURLY/ANNUAL/DAILY |
| base_salary | NUMERIC(18,2) | Base salary amount |
| currency_code | VARCHAR(3) | Currency code |
| status | VARCHAR(20) | ACTIVE/PROBATION/LEAVE/TERMINATED |
| is_deleted | BOOLEAN | Soft delete flag |
| created_at, created_by, updated_at, updated_by | AUDIT | Standard audit fields |

**Data Integrity**: Employee uniqueness on (code, email, mobile) per tenant

---

### 1.2 Critical Overlapping Fields

| Field | sys.users | hrm.employees | Concept | Notes |
|-------|-----------|----------------|---------|-------|
| Name | first_name + last_name | name (+ name_en, name_cn) | Personal identity | Different structures (split vs unified) |
| Email | email (UNIQUE, required) | email (UNIQUE, optional) | Contact/Login | Both required in sys.users, optional in employees |
| Phone | phone | phone + mobile | Contact | sys.users has one, employees has two |
| Department | department_id (no FK) | department_id (FK→hrm.departments) | Organization | Only hrm enforces FK constraint |
| Position/Job Title | position | job_title + job_level | Role in organization | Different granularity (position vs title+level) |
| Address | ❌ None | postcode, address1, address2 | Residence | Only in employees (HR context) |
| Personal Data | ❌ None | birth_date, gender, nationality, id_number | Demographics | Only in employees (HR context) |

---

### 1.3 Relationship Status

**Current State**: NO DIRECT RELATIONSHIP

```sql
-- No foreign key exists between:
-- sys.users → hrm.employees
-- hrm.employees → sys.users
```

**Why No Relationship?**
1. **Intentional Separation of Concerns**:
   - sys.users = authentication/authorization boundary
   - hrm.employees = HR/organizational context

2. **Some systems in enterprise ERP design intentionally keep these separate**:
   - A user might not be an employee (contractors, consultants with system access)
   - An employee might not have system access (workers in field/production only)
   - A user could represent multiple organizational contexts

3. **No FK Enforcement in sys.users**:
   - department_id references nothing (orphaned reference)
   - Allows users without HR records

---

### 1.4 Related Tables and Their Relationships

#### Authorization/Security Tables (sys schema)

```sql
sys.roles
├── role_id: UUID PK
├── role_code: VARCHAR (UNIQUE)
├── role_name: VARCHAR
├── is_system: BOOLEAN
└── is_deleted: BOOLEAN

sys.user_roles (Junction table)
├── id: UUID PK
├── user_id: FK → sys.users ✓
├── role_id: FK → sys.roles ✓
├── tenant_id: FK → tenants ✓
├── expires_at: TIMESTAMP (for temporary roles)
├── revoked_at: TIMESTAMP
└── is_active: BOOLEAN

sys.permissions
├── id: UUID PK
├── permission_code: VARCHAR (UNIQUE)
├── description: TEXT
└── module_id: FK (optional)

sys.role_permissions
├── id: UUID PK
├── role_id: FK → sys.roles ✓
├── permission_id: FK → sys.permissions ✓
└── is_active: BOOLEAN

sys.sessions
├── id: UUID PK
├── user_id: FK → sys.users ✓
├── session_id: VARCHAR (UNIQUE)
├── expires_at: TIMESTAMP
├── ip_address: INET
└── status: VARCHAR (ACTIVE/EXPIRED/REVOKED)
```

#### HR/Organization Tables (hrm schema)

```sql
hrm.departments
├── id: UUID PK
├── code: VARCHAR (UNIQUE)
├── name: VARCHAR (UNIQUE)
├── parent_id: FK → hrm.departments (hierarchical)
├── manager_id: FK → hrm.employees ✓
└── level: INTEGER (hierarchy level)

hrm.employees
├── id: UUID PK
├── code: VARCHAR (UNIQUE)
├── department_id: FK → hrm.departments ✓
├── name: VARCHAR
└── email: VARCHAR (UNIQUE, optional)

hrm.employee_histories
├── id: UUID PK
├── employee_id: FK → hrm.employees ✓
└── (tracks historical changes)

hrm.payroll_records
├── id: UUID PK
├── employee_id: FK → hrm.employees ✓
└── (salary/payroll tracking)

hrm.attendances
├── id: UUID PK
├── employee_id: FK → hrm.employees ✓
└── (attendance tracking)

hrm.absences
├── id: UUID PK
├── employee_id: FK → hrm.employees ✓
└── (leave/absence tracking)
```

---

## Part 2: Identified Issues & Overlaps

### 2.1 Data Duplication & Inconsistency Issues

#### Issue #1: Name Structure Mismatch
```
sys.users:        first_name (50) + last_name (50)  → normalized, 100 chars each
hrm.employees:    name (100) + name_en (100) + name_cn (100) → denormalized, 100 chars each
```
**Problem**: Same person might have different name formats in each table

#### Issue #2: Email Uniqueness Conflict
```
sys.users:     email (UNIQUE, required)      ← Must have email for login
hrm.employees: email (UNIQUE, optional)      ← May or may not have email
```
**Problem**: A user might have sys.users.email but different hrm.employees.email

#### Issue #3: Phone Number Inconsistency
```
sys.users:     phone (single number, optional)
hrm.employees: phone (office) + mobile (mobile), optional
```
**Problem**: No clear mapping between which phone goes where

#### Issue #4: Department Assignment (Critical)
```
sys.users:        department_id (NO FK constraint)   → Orphaned reference
hrm.employees:    department_id (FK constraint)      → Enforced relationship
```
**Problem**: sys.users can point to non-existent departments

#### Issue #5: Position/Job Title Mismatch
```
sys.users:        position (VARCHAR 100) → Simple string, unstructured
hrm.employees:    job_title (VARCHAR 100) + job_level (VARCHAR 20, ENUM) → Structured
```
**Problem**: Cannot easily query employees by job_level or cross-filter with user positions

#### Issue #6: Status Fields Divergence
```
sys.users:        is_active (BOOLEAN) → Only tracks if user can login
hrm.employees:    status (ENUM: ACTIVE/PROBATION/LEAVE/TERMINATED/RETIRED) → Rich HR status
```
**Problem**: Employee on leave has is_active=true in sys.users but different status in employees

---

### 2.2 Orphaned Data Scenarios

**Scenario 1**: User with non-existent department
```sql
-- This is currently possible but problematic:
INSERT INTO sys.users (username, email, department_id) 
VALUES ('john', 'john@example.com', 'non-existent-uuid');
```

**Scenario 2**: Employee with no user account
```sql
-- Employee record exists but user cannot login:
INSERT INTO hrm.employees (code, name, email, department_id)
VALUES ('EMP001', 'Jane Doe', 'jane@example.com', 'dept-uuid');
-- No corresponding sys.users record
```

**Scenario 3**: User record orphaned from employee
```sql
-- User exists, but no employee record:
INSERT INTO sys.users (username, email)
VALUES ('contractor', 'contractor@example.com');
-- No corresponding hrm.employees record
```

---

### 2.3 Business Logic Gaps

**Gap #1**: No way to filter "Active Employees Who Can Login"
```sql
-- Should be simple but requires joining across schemas:
SELECT e.* FROM hrm.employees e
WHERE e.status = 'ACTIVE' 
  AND e.id IN (
    SELECT u.id FROM sys.users u WHERE u.is_active = true
  );
-- Problem: No direct ID link exists!
```

**Gap #2**: Cannot enforce "User = Active Employee" policy
```sql
-- Currently impossible to ensure users are real employees:
-- INSERT sys.users without corresponding hrm.employees
```

**Gap #3**: Audit trail broken when employee changes department
```sql
-- hrm.employees.department_id changes → logged
-- But sys.users.department_id might not sync
```

---

## Part 3: Industry Best Practices & Patterns

### 3.1 Modern SaaS/ERP Identity Patterns

#### Pattern A: Unified Identity (Enterprise ERPs - SAP, Oracle)
```
users (authentication)
  ├── id (UUID)
  ├── username, email, password_hash
  ├── employee_id (FK → employees, REQUIRED)
  └── contractor_id (FK → contractors, optional)

employees (HR master)
  ├── id (UUID)
  ├── employee_code
  ├── name, email, phone
  └── department_id (FK)

contractors (Non-employee users)
  ├── id (UUID)
  ├── contractor_code
  └── ...
```
**When to use**: Strict policy that all users = employees or contractors

#### Pattern B: Separated Identity (Multi-tenant SaaS)
```
users (authentication boundary)
  ├── id (UUID)
  ├── username, email, password_hash
  ├── employee_id (FK → employees, nullable)
  └── profile_id (FK → profiles, polymorphic)

employees (HR master)
  ├── id (UUID)
  ├── employee_code
  └── name, email, department_id

contractors, partners, vendors
  └── Similar independent entities
```
**When to use**: Mixed identities (employees + contractors + partners)

#### Pattern C: Dual-Identity with Explicit Link (Best for modern ERP)
```
users (authentication)
  ├── id (UUID)
  ├── username, email, password_hash
  ├── is_active (BOOLEAN)
  └── audit fields

user_profiles (Identity bridge)
  ├── id (UUID)
  ├── user_id (FK → users)
  ├── profile_type (ENUM: EMPLOYEE, CONTRACTOR, PARTNER)
  ├── profile_id (UUID, points to employees/contractors/etc)
  └── is_primary (BOOLEAN)

employees (HR master)
  ├── id (UUID)
  ├── employee_code
  ├── name, email, phone, department_id
  └── audit fields
```
**When to use**: Need polymorphic relationships + strict type checking

#### Pattern D: Complete Unification (HR-centric)
```
identities (Single source of truth)
  ├── id (UUID)
  ├── identity_type (ENUM: EMPLOYEE, CONTRACTOR, VENDOR)
  ├── code (VARCHAR UNIQUE)
  ├── name, email, phone
  ├── department_id (FK, nullable)
  ├── is_active (BOOLEAN)
  └── (union of all identity-related fields)

authentication (Auth-specific data)
  ├── id (UUID)
  ├── identity_id (FK → identities, UNIQUE)
  ├── username (UNIQUE)
  ├── password_hash
  └── is_login_enabled (BOOLEAN)
```
**When to use**: Single master data source for all organization participants

---

### 3.2 Best Practice Analysis for ConexGrow

**Recommended Pattern**: Hybrid of **Pattern B + C**
- Keep sys.users and hrm.employees separate (good separation of concerns)
- Add explicit linking mechanism for clarity
- Support non-employee system users

**Key Principles for ConexGrow**:
1. **Authentication vs Authorization**: sys.users = authentication, sys.roles = authorization
2. **HR vs Access Control**: hrm.employees = HR truth, sys.users = access control gate
3. **Multi-tenant Flexibility**: Allow users without employee records (contractors, consultants)
4. **Clear Audit Trail**: Track when user created, if linked to employee, if linked changed

---

## Part 4: Specific Findings & Recommendations

### 4.1 Field-by-Field Recommendations

#### Name Fields
```
CURRENT:
  sys.users.first_name + last_name (100 chars each)
  hrm.employees.name + name_en + name_cn (100 chars each)

ISSUE: No sync mechanism; can diverge

RECOMMENDATION:
  Option 1 (Simplest - Breaking Change):
    - Keep only sys.users as source of truth for display names
    - Add to hrm.employees: full_name (VARCHAR 255) computed from user
    - Deprecate first_name, last_name sync
  
  Option 2 (Less Invasive):
    - Keep both as-is
    - Add trigger to sync sys.users.{first_name,last_name} → hrm.employees.name_en
    - Document that sys.users is auth display, employees is HR master
  
  CHOSEN: Option 2 (minimal disruption to existing code)
```

#### Email Fields
```
CURRENT:
  sys.users.email (UNIQUE, required, for login)
  hrm.employees.email (UNIQUE nullable, for HR records)

ISSUE: Two emails for potentially same person; inconsistent uniqueness

RECOMMENDATION:
  Option 1: Make hrm.employees.email mandatory if user_id is set
  Option 2: Add constraint that email must be same if user_id is set
  
  CHOSEN: Implement as application-level validation:
    - When creating user from employee: copy email
    - When changing employee email: require sys.users.email change
    - Add trigger to prevent divergence
```

#### Phone Fields
```
CURRENT:
  sys.users.phone (single, optional)
  hrm.employees.phone + mobile (two fields, optional)

RECOMMENDATION:
  - sys.users.phone = primary contact phone for system use
  - hrm.employees.phone = office phone, mobile = personal
  - Add comment clarifying each purpose
  - No sync needed (different purposes)
```

#### Department Fields
```
CURRENT:
  sys.users.department_id (no FK, orphaned possible)
  hrm.employees.department_id (FK → hrm.departments)

ISSUE: Orphaned references; inconsistency

RECOMMENDATION (CRITICAL):
  SQL to add FK constraint to sys.users:
  
  ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__department_id
    FOREIGN KEY (department_id)
    REFERENCES hrm.departments(id)
    ON DELETE SET NULL;
  
  This ensures data integrity.
```

#### Position Fields
```
CURRENT:
  sys.users.position (unstructured string)
  hrm.employees.job_title + job_level (structured enum + string)

RECOMMENDATION:
  - sys.users.position = read-only, synced from employees.job_title
  - For queries, always use hrm.employees.job_level for filtering
  - Add application logic to sync position when employee data changes
```

#### Status Fields
```
CURRENT:
  sys.users.is_active (BOOLEAN)
  hrm.employees.status (ENUM: ACTIVE/PROBATION/LEAVE/TERMINATED/RETIRED)

ISSUE: Different granularity; employee on LEAVE has is_active=true

RECOMMENDATION:
  Add computed column or view:
  
  CREATE OR REPLACE VIEW sys.user_employee_status AS
  SELECT 
    u.id as user_id,
    u.is_active as user_enabled,
    e.status as employee_status,
    CASE 
      WHEN e.status IN ('TERMINATED', 'RETIRED') THEN 'DISABLED'
      WHEN e.status = 'LEAVE' THEN 'LEAVE'
      WHEN u.is_active = false THEN 'DISABLED'
      WHEN e.status = 'PROBATION' THEN 'PROBATION'
      ELSE 'ACTIVE'
    END as effective_status
  FROM sys.users u
  LEFT JOIN hrm.employees e ON u.id = e.user_id;
```

---

### 4.2 Missing Relationship: Critical Recommendations

#### Current Gap
```sql
-- NO relationship exists:
sys.users (id, username, email, ...)
hrm.employees (id, code, name, ...)
-- These tables are completely disconnected at DB level
```

#### Recommended Solution

**ADD EXPLICIT LINKING** via migration:

```sql
-- Step 1: Add user_id to hrm.employees (nullable)
ALTER TABLE hrm.employees 
ADD COLUMN user_id UUID,
ADD CONSTRAINT fk_employees__user_id 
  FOREIGN KEY (user_id) 
  REFERENCES sys.users(id) 
  ON DELETE SET NULL;

-- Step 2: Create index for lookup
CREATE INDEX ix_employees__user_id 
  ON hrm.employees(user_id) 
  WHERE user_id IS NOT NULL;

-- Step 3: Add unique constraint to prevent multiple users per employee
ALTER TABLE hrm.employees 
ADD CONSTRAINT uk_employees__user_id 
  UNIQUE (user_id) 
  WHERE user_id IS NOT NULL;

-- Step 4: Migrate existing relationships (if possible)
-- This is tricky - needs business logic to match users to employees
-- Based on email, name, or manual mapping
UPDATE hrm.employees e
SET user_id = u.id
FROM sys.users u
WHERE e.email = u.email 
  AND e.email IS NOT NULL
  AND u.email IS NOT NULL
  AND e.user_id IS NULL;

-- Step 5: Create audit view for orphaned records
CREATE OR REPLACE VIEW data_quality.unlinked_users AS
SELECT 'User without Employee' as type, u.id, u.username, u.email
FROM sys.users u
WHERE NOT EXISTS (SELECT 1 FROM hrm.employees e WHERE e.user_id = u.id)
UNION ALL
SELECT 'Employee without User' as type, e.id, e.code, e.email
FROM hrm.employees e
WHERE e.user_id IS NULL AND e.email IS NOT NULL;
```

---

### 4.3 Data Integrity Improvements

#### Issue: Department orphans in sys.users

**Current SQL (PROBLEMATIC)**:
```sql
-- This allows invalid state:
INSERT INTO sys.users (username, email, department_id)
VALUES ('john', 'john@example.com', 'invalid-uuid');
```

**Fix**:
```sql
-- Add FK constraint
ALTER TABLE sys.users 
ADD CONSTRAINT fk_users__department_id
  FOREIGN KEY (department_id)
  REFERENCES hrm.departments(id)
  ON DELETE SET NULL;
```

#### Issue: Position/Job Title sync

**Current State**: sys.users.position is manually entered, could diverge

**Fix - Option A** (Trigger-based):
```sql
-- Create trigger to sync when employee changes job_title
CREATE OR REPLACE FUNCTION sync_user_position()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_title != OLD.job_title AND NEW.user_id IS NOT NULL THEN
    UPDATE sys.users 
    SET position = NEW.job_title
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employee_position_sync
AFTER UPDATE ON hrm.employees
FOR EACH ROW
EXECUTE FUNCTION sync_user_position();
```

**Fix - Option B** (Application Logic):
- Handle sync in backend ORM/service layer
- More flexible, easier to audit/debug

**Recommended**: Option B (application-level)

---

### 4.4 Suggested Enum/Constraints

#### Add to sys.users for consistency:

```sql
-- Job level enumeration (sync from hrm.employees)
ALTER TABLE sys.users
ADD COLUMN job_level VARCHAR(20),
ADD CONSTRAINT ck_users__job_level 
  CHECK (job_level IS NULL OR job_level IN (
    'STAFF', 'SENIOR', 'ASSISTANT_MANAGER', 'MANAGER', 
    'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO'
  ));
  
-- Employment status sync
ALTER TABLE sys.users
ADD COLUMN employment_status VARCHAR(20),
ADD CONSTRAINT ck_users__employment_status 
  CHECK (employment_status IS NULL OR employment_status IN (
    'ACTIVE', 'PROBATION', 'LEAVE', 'TERMINATED', 'RETIRED'
  ));
```

---

## Part 5: Current State vs. Recommended State (Detailed)

### 5.1 Comparison Matrix

| Aspect | CURRENT STATE | RECOMMENDED STATE | Priority |
|--------|---------------|-------------------|----------|
| **Relationship** | No FK between users↔employees | Add user_id FK to employees | P0 |
| **Department FK** | sys.users.dept_id (orphaned) | Add FK constraint to sys.users | P0 |
| **Email Sync** | Separate, can diverge | Enforce same email or add trigger | P1 |
| **Name Sync** | first_name+last_name vs name | Document sync strategy | P1 |
| **Position Sync** | Unstructured in users | Add trigger to sync from employee | P1 |
| **Status Fields** | is_active vs detailed status | Create view for unified status | P2 |
| **Data Quality View** | None | Add audit view for orphaned records | P2 |
| **Audit Trail** | Limited | Enhance with change tracking | P2 |

### 5.2 Migration Path

**Phase 1 (Week 1) - Critical Data Integrity**:
1. Add FK constraint on sys.users.department_id → hrm.departments
2. Identify and fix orphaned department_id records
3. Create validation report

**Phase 2 (Week 2) - Relationship Linking**:
1. Add user_id column to hrm.employees
2. Migrate matching records (email-based)
3. Create audit view for unlinked records
4. Add unique constraint on user_id

**Phase 3 (Week 3) - Data Sync & Consistency**:
1. Implement position/job_title sync trigger
2. Add computed view for unified status
3. Add job_level to sys.users
4. Document email sync policy

**Phase 4 (Week 4) - Application Layer**:
1. Update Python models to include user_id
2. Add validation in services for user-employee relationship
3. Add API endpoints to link/unlink users from employees
4. Add tests for consistency

---

## Part 6: SQL Recommendations

### 6.1 Critical Fixes (Apply Immediately)

```sql
-- FIX 1: Add missing FK constraint on sys.users.department_id
ALTER TABLE sys.users 
ADD CONSTRAINT fk_users__department_id
  FOREIGN KEY (department_id)
  REFERENCES hrm.departments(id)
  ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_users__department_id ON sys.users 
  IS 'Department reference FK (SET NULL on delete)';

-- FIX 2: Link employees to users
ALTER TABLE hrm.employees 
ADD COLUMN user_id UUID,
ADD CONSTRAINT fk_employees__user_id 
  FOREIGN KEY (user_id) 
  REFERENCES sys.users(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT uk_employees__user_id 
  UNIQUE (user_id) 
  WHERE user_id IS NOT NULL;

CREATE INDEX ix_employees__user_id 
  ON hrm.employees(user_id) 
  WHERE user_id IS NOT NULL;

-- FIX 3: Add job_level to sys.users for consistency
ALTER TABLE sys.users 
ADD COLUMN job_level VARCHAR(20),
ADD CONSTRAINT ck_users__job_level 
  CHECK (job_level IS NULL OR job_level IN (
    'STAFF', 'SENIOR', 'ASSISTANT_MANAGER', 'MANAGER', 
    'SENIOR_MANAGER', 'DIRECTOR', 'VP', 'CEO'
  ));
```

### 6.2 Data Quality Audit Views

```sql
-- Audit View 1: Unlinked records
CREATE OR REPLACE VIEW data_quality.identity_orphans AS
SELECT 
  'User without Employee' as issue_type,
  u.id::text as entity_id,
  u.username::text as identifier,
  u.email::text as contact,
  NULL::text as employee_code,
  'sys.users' as table_name
FROM sys.users u
WHERE NOT EXISTS (
  SELECT 1 FROM hrm.employees e WHERE e.user_id = u.id
)
AND u.is_deleted = false

UNION ALL

SELECT 
  'Employee without User' as issue_type,
  e.id::text as entity_id,
  e.code::text as identifier,
  e.email::text as contact,
  e.code::text as employee_code,
  'hrm.employees' as table_name
FROM hrm.employees e
WHERE e.user_id IS NULL 
  AND e.email IS NOT NULL 
  AND e.is_deleted = false;

-- Audit View 2: Data inconsistencies
CREATE OR REPLACE VIEW data_quality.user_employee_inconsistencies AS
SELECT 
  u.id as user_id,
  e.id as employee_id,
  'Email mismatch' as issue,
  u.email as user_email,
  e.email as employee_email
FROM sys.users u
JOIN hrm.employees e ON u.id = e.user_id
WHERE u.email != e.email 
  AND u.is_deleted = false 
  AND e.is_deleted = false

UNION ALL

SELECT 
  u.id,
  e.id,
  'Department mismatch',
  u.department_id::text,
  e.department_id::text
FROM sys.users u
JOIN hrm.employees e ON u.id = e.user_id
WHERE u.department_id IS DISTINCT FROM e.department_id
  AND u.is_deleted = false 
  AND e.is_deleted = false;

-- Audit View 3: Status inconsistencies
CREATE OR REPLACE VIEW data_quality.user_status_issues AS
SELECT 
  u.id as user_id,
  u.username,
  u.is_active,
  COALESCE(e.status, 'NO_EMPLOYEE') as employee_status,
  CASE 
    WHEN e.status IN ('TERMINATED', 'RETIRED') AND u.is_active = true 
      THEN 'User active but employee terminated'
    WHEN e.status = 'LEAVE' AND u.is_active = true 
      THEN 'User active but employee on leave'
    WHEN u.is_active = false AND e.status = 'ACTIVE' 
      THEN 'User inactive but employee active'
    ELSE NULL
  END as potential_issue
FROM sys.users u
LEFT JOIN hrm.employees e ON u.id = e.user_id
WHERE 
  u.is_deleted = false 
  AND (e.is_deleted = false OR e.is_deleted IS NULL)
  AND (
    (e.status IN ('TERMINATED', 'RETIRED') AND u.is_active = true) OR
    (e.status = 'LEAVE' AND u.is_active = true) OR
    (u.is_active = false AND e.status = 'ACTIVE')
  );
```

### 6.3 Sync Trigger (Optional - Application-Level Recommended)

```sql
-- Trigger to sync position when employee job_title changes
CREATE OR REPLACE FUNCTION sync_user_position_from_employee()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_title IS DISTINCT FROM OLD.job_title 
     AND NEW.user_id IS NOT NULL THEN
    UPDATE sys.users 
    SET position = NEW.job_title
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employee_position_sync
AFTER UPDATE OF job_title ON hrm.employees
FOR EACH ROW
WHEN (NEW.job_title IS DISTINCT FROM OLD.job_title)
EXECUTE FUNCTION sync_user_position_from_employee();

COMMENT ON TRIGGER trg_employee_position_sync ON hrm.employees 
  IS 'Syncs hrm.employees.job_title to sys.users.position when employee is linked to user';
```

---

## Part 7: Python Model Updates

### 7.1 Current Model Issues

**Current `Users` model** (`src/models/tenants/sys/users.py`):
```python
class Users(TenantBaseModel):
    user_code: Mapped[String]
    username: Mapped[String]
    email: Mapped[String]
    password_hash: Mapped[String]
    first_name: Mapped[String | None]
    last_name: Mapped[String | None]
    phone: Mapped[String | None]
    department_id: Mapped[UUID | None]  # <-- No FK relationship
    position: Mapped[String | None]
    role_id: Mapped[UUID | None]
    # ... no relationship to employees
```

**Current `Employees` model** (`src/models/tenants/hrm/employees.py`):
```python
class Employees(TenantBaseModel):
    code: Mapped[String]
    name: Mapped[String]
    email: Mapped[String | None]
    phone: Mapped[String | None]
    mobile: Mapped[String | None]
    department_id: Mapped[UUID | None]
    job_title: Mapped[String | None]
    job_level: Mapped[String | None]
    # ... no relationship to users
```

### 7.2 Recommended Model Updates

**Updated `Users` model**:
```python
from sqlalchemy.orm import relationship

class Users(TenantBaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "sys"}

    # ... existing fields ...
    
    # New relationship
    employee: Mapped["Employees"] = relationship(
        "Employees",
        back_populates="user",
        uselist=False,
        foreign_keys="Employees.user_id",
        cascade="none",
        lazy="selectin"
    )
    
    # New fields for consistency
    job_level: Mapped[str | None] = mapped_column(
        String(20),
        comment="Job level (synced from employee if linked)"
    )
    employment_status: Mapped[str | None] = mapped_column(
        String(20),
        comment="Employment status (synced from employee if linked)"
    )
```

**Updated `Employees` model**:
```python
from sqlalchemy.orm import relationship

class Employees(TenantBaseModel):
    __tablename__ = "employees"
    __table_args__ = {"schema": "hrm"}

    # ... existing fields ...
    
    # New relationship to users
    user_id: Mapped[UUID | None] = mapped_column(
        UUID,
        ForeignKey("sys.users.id", ondelete="SET NULL"),
        comment="Link to sys.users record (optional)"
    )
    
    user: Mapped["Users"] = relationship(
        "Users",
        back_populates="employee",
        uselist=False,
        foreign_keys=[user_id],
        lazy="selectin"
    )
```

### 7.3 Service Layer Enhancements

```python
# New service: UserEmployeeService
class UserEmployeeService:
    """Manages synchronization between users and employees"""
    
    async def link_user_to_employee(
        self,
        user_id: UUID,
        employee_id: UUID,
        session: AsyncSession
    ) -> tuple[Users, Employees]:
        """Link an existing user to an employee"""
        user = await self.get_user(user_id, session)
        employee = await self.get_employee(employee_id, session)
        
        # Sync email
        if user.email != employee.email:
            logger.warning(
                f"Email mismatch: user={user.email}, employee={employee.email}"
            )
        
        # Link
        employee.user_id = user_id
        session.add(employee)
        await session.flush()
        
        return user, employee
    
    async def get_unlinked_users(
        self,
        session: AsyncSession
    ) -> list[Users]:
        """Get users without corresponding employees"""
        stmt = select(Users).where(
            ~exists(
                select(1).from_(Employees).where(
                    Employees.user_id == Users.id
                )
            )
        )
        result = await session.execute(stmt)
        return result.scalars().all()
    
    async def sync_position_from_employee(
        self,
        employee_id: UUID,
        session: AsyncSession
    ) -> Users | None:
        """Sync position from employee to linked user"""
        employee = await session.get(Employees, employee_id)
        if not employee or not employee.user_id:
            return None
        
        user = await session.get(Users, employee.user_id)
        if user:
            user.position = employee.job_title
            user.job_level = employee.job_level
            session.add(user)
            await session.flush()
        
        return user
```

---

## Summary Table: Current vs Recommended

| Area | CURRENT STATE | RECOMMENDED STATE | Benefit |
|------|---------------|-------------------|---------|
| **User-Employee Link** | No FK relationship | Add user_id FK to employees | Enforced consistency, enables queries |
| **Department FK** | Orphaned (no constraint) | Add FK constraint to sys.users | Prevent invalid state |
| **Email** | Separate, unsynced | Document sync policy + trigger | Single source of truth |
| **Name** | Separate structures | Document first_name sync | Consistency |
| **Position** | Manual entry in sys.users | Auto-sync from employees | No divergence |
| **Status** | Boolean in users, enum in employees | Create unified status view | Clear employee state |
| **Job Level** | Only in employees | Add to users (synced) | Enable user-level filtering |
| **Audit Views** | None | 3 quality audit views | Data quality visibility |
| **Validation** | Minimal | Add business rule validators | Prevent invalid states |

---

## Recommended Priority Timeline

### Week 1 (Critical)
- Add FK constraint: sys.users.department_id → hrm.departments
- Fix orphaned records
- Create orphan audit view

### Week 2 (High)
- Add user_id column to hrm.employees
- Migrate matching records
- Add unique constraint on user_id
- Update Python models

### Week 3 (Medium)
- Implement position sync trigger
- Add job_level to sys.users
- Create inconsistency audit view
- Update service layer

### Week 4 (Low)
- Create unified status view
- Add comprehensive validation
- Update API documentation
- Add tests/fixtures

---

## Conclusion

**The current separation of sys.users and hrm.employees is INTENTIONAL and GOOD**, but it lacks:

1. **Explicit linking mechanism** (no FK reference)
2. **Data integrity constraints** (orphaned references possible)
3. **Sync mechanisms** for overlapping fields
4. **Audit views** for data quality

**The recommended solution** maintains separation of concerns while adding:
- Clear, enforced relationships (FK constraints)
- Optional user-employee linking (nullable, 1:1)
- Data consistency mechanisms (triggers/validators)
- Quality monitoring views (audits)

This provides the flexibility of a true multi-tenant SaaS (contractors, consultants can be users without being employees) while ensuring consistency when users ARE employees.
