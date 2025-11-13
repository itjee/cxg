-- =====================================================================================
-- DDL 개선 마이그레이션 롤백 스크립트
-- 작성일: 2025-10-27
-- 목표: Phase 1, Phase 2 마이그레이션 완전 롤백
-- 주의: 이 스크립트는 긴급 상황에서만 사용
-- =====================================================================================

-- 트랜잭션 시작
BEGIN TRANSACTION;

-- =====================================================================================
-- Phase 1 롤백: Manager DB
-- =====================================================================================

-- =====================================================================================
-- 1. IDAM.ROLES 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ux_roles__code;
DROP INDEX IF EXISTS ix_roles__code;
DROP INDEX IF EXISTS ix_roles__type;
DROP INDEX IF EXISTS ix_roles__status;
DROP INDEX IF EXISTS ix_roles__priority;

-- Step 2: CHECK 제약 제거
ALTER TABLE idam.roles
    DROP CONSTRAINT IF EXISTS ck_roles__code_not_empty,
    DROP CONSTRAINT IF EXISTS ck_roles__name_not_empty;

-- Step 3: 컬럼 제거/이름 변경 역순
ALTER TABLE idam.roles
    DROP COLUMN IF EXISTS deleted;

ALTER TABLE idam.roles
    RENAME COLUMN type TO role_type;

ALTER TABLE idam.roles
    RENAME COLUMN name TO role_name;

ALTER TABLE idam.roles
    RENAME COLUMN code TO role_code;

-- Step 4: 기존 인덱스 복원
CREATE UNIQUE INDEX uk_roles__role_code
    ON idam.roles (role_code);

CREATE INDEX ix_roles__role_code
    ON idam.roles (role_code);

CREATE INDEX ix_roles__role_type
    ON idam.roles (role_type);

CREATE INDEX ix_roles__role_name
    ON idam.roles (role_name);

-- =====================================================================================
-- 2. IDAM.PERMISSIONS 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ux_permissions__code;
DROP INDEX IF EXISTS ix_permissions__code;
DROP INDEX IF EXISTS ix_permissions__category;
DROP INDEX IF EXISTS ix_permissions__resource;
DROP INDEX IF EXISTS ix_permissions__action;
DROP INDEX IF EXISTS ix_permissions__scope;
DROP INDEX IF EXISTS ix_permissions__category_action_code;

-- Step 2: CHECK 제약 제거
ALTER TABLE idam.permissions
    DROP CONSTRAINT IF EXISTS ck_permissions__code_not_empty,
    DROP CONSTRAINT IF EXISTS ck_permissions__name_not_empty;

-- Step 3: 컬럼 제거/이름 변경 역순
ALTER TABLE idam.permissions
    DROP COLUMN IF EXISTS deleted,
    DROP COLUMN IF EXISTS is_hidden;

ALTER TABLE idam.permissions
    RENAME COLUMN resource TO resource_type;

ALTER TABLE idam.permissions
    RENAME COLUMN name TO permission_name;

ALTER TABLE idam.permissions
    RENAME COLUMN code TO permission_code;

-- Step 4: 기존 인덱스 복원
CREATE UNIQUE INDEX uk_permissions__permission_code
    ON idam.permissions (permission_code);

CREATE INDEX ix_permissions__permission_code
    ON idam.permissions (permission_code);

CREATE INDEX ix_permissions__category
    ON idam.permissions (category);

CREATE INDEX ix_permissions__resource_type
    ON idam.permissions (resource_type);

CREATE INDEX ix_permissions__action
    ON idam.permissions (action);

CREATE INDEX ix_permissions__scope
    ON idam.permissions (scope);

CREATE INDEX ix_permissions__applies_to
    ON idam.permissions (applies_to);

CREATE INDEX ix_permissions__is_system
    ON idam.permissions (is_system);

CREATE INDEX ix_permissions__status
    ON idam.permissions (status);

CREATE INDEX ix_permissions__category_action
    ON idam.permissions (category, action);

-- =====================================================================================
-- 3. TNNT.TENANTS 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ix_tenants__status_created;
DROP INDEX IF EXISTS ix_tenants__is_suspended;

-- Step 2: CHECK 제약 제거
ALTER TABLE tnnt.tenants
    DROP CONSTRAINT IF EXISTS ck_tenants__max_users,
    DROP CONSTRAINT IF EXISTS ck_tenants__suspension_logic;

-- Step 3: 컬럼 제거
ALTER TABLE tnnt.tenants
    DROP COLUMN IF EXISTS is_suspended,
    DROP COLUMN IF EXISTS suspended_reason,
    DROP COLUMN IF EXISTS suspension_date;

-- =====================================================================================
-- 4. IDAM.ROLE_PERMISSIONS 인덱스 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_role_permissions__role_permission;

-- =====================================================================================
-- 5. IDAM.LOGIN_LOGS 인덱스 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_login_logs__user_id_created;

-- =====================================================================================
-- Phase 2 롤백: Tenant DB
-- =====================================================================================

-- =====================================================================================
-- 1. IVM.INVENTORY_BALANCES 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ux_inventory_balances__item_location;
DROP INDEX IF EXISTS ix_inventory_balances__variant_id;
DROP INDEX IF EXISTS ix_inventory_balances__warehouse_variant;

-- Step 2: 외래키 제거
ALTER TABLE ivm.inventory_balances
    DROP CONSTRAINT IF EXISTS fk_inventory_balances__variant_id;

-- Step 3: 컬럼 제거
ALTER TABLE ivm.inventory_balances
    DROP COLUMN IF EXISTS variant_id;

-- Step 4: 기존 유니크 인덱스 복원
CREATE UNIQUE INDEX ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(lot_number, ''),
        COALESCE(serial_number, '')
    );

-- =====================================================================================
-- 2. SYS.USERS 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ux_users__email;
DROP INDEX IF EXISTS ix_users__created_by;
DROP INDEX IF EXISTS ix_users__last_login;
DROP INDEX IF EXISTS ix_users__is_system_user;

-- Step 2: CHECK 제약 제거
ALTER TABLE sys.users
    DROP CONSTRAINT IF EXISTS ck_users__failed_attempts;

-- Step 3: 컬럼 제거
ALTER TABLE sys.users
    DROP COLUMN IF EXISTS created_by,
    DROP COLUMN IF EXISTS is_system_user,
    DROP COLUMN IF EXISTS last_login_at,
    DROP COLUMN IF EXISTS last_login_ip,
    DROP COLUMN IF EXISTS failed_login_attempts;

-- =====================================================================================
-- 3. SYS.USER_ROLES 제약 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ix_user_roles__user_id;
DROP INDEX IF EXISTS ix_user_roles__role_id;
DROP INDEX IF EXISTS ix_user_roles__expires;

-- Step 2: 유니크 제약 제거
ALTER TABLE sys.user_roles
    DROP CONSTRAINT IF EXISTS uc_user_roles__user_role;

-- =====================================================================================
-- 4. HRM.EMPLOYEES 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ix_employees__department_status;
DROP INDEX IF EXISTS ix_employees__email_hash;
DROP INDEX IF EXISTS ix_employees__status;

-- Step 2: CHECK 제약 제거
ALTER TABLE hrm.employees
    DROP CONSTRAINT IF EXISTS ck_employees__status;

-- Step 3: 컬럼 제거
ALTER TABLE hrm.employees
    DROP COLUMN IF EXISTS id_number_encrypted,
    DROP COLUMN IF EXISTS phone_encrypted,
    DROP COLUMN IF EXISTS email_hash,
    DROP COLUMN IF EXISTS employee_status,
    DROP COLUMN IF EXISTS retirement_date;

-- =====================================================================================
-- 5. PIM.PRODUCT_VARIANTS 인덱스 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_product_variants__product_id_active;
DROP INDEX IF EXISTS ix_product_variants__sku;

-- =====================================================================================
-- 6. FIM.JOURNAL_ENTRIES 롤백
-- =====================================================================================

-- Step 1: 인덱스 제거
DROP INDEX IF EXISTS ix_journal_entries__posted_date;
DROP INDEX IF EXISTS ix_journal_entries__reference;
DROP INDEX IF EXISTS ix_journal_entries__period_status;

-- Step 2: CHECK 제약 제거
ALTER TABLE fim.journal_entries
    DROP CONSTRAINT IF EXISTS ck_je__debit_credit_balance,
    DROP CONSTRAINT IF EXISTS ck_je__posting_logic;

-- Step 3: 컬럼 제거
ALTER TABLE fim.journal_entries
    DROP COLUMN IF EXISTS is_locked,
    DROP COLUMN IF EXISTS posted_at,
    DROP COLUMN IF EXISTS reference_doc_type,
    DROP COLUMN IF EXISTS reference_doc_id,
    DROP COLUMN IF EXISTS memo;

-- =====================================================================================
-- 7. CRM.PARTNERS 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_partners__credit_rating;

ALTER TABLE crm.partners
    DROP COLUMN IF EXISTS credit_usage,
    DROP COLUMN IF EXISTS credit_rating;

-- =====================================================================================
-- 8. IVM.INVENTORY_MOVEMENTS 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_inventory_movements__product_created;
DROP INDEX IF EXISTS ix_inventory_movements__warehouse_date;

-- =====================================================================================
-- 9. ADM.GLOSSARY 롤백
-- =====================================================================================

DROP INDEX IF EXISTS ix_glossary__category;

ALTER TABLE adm.glossary
    DROP COLUMN IF EXISTS category,
    DROP COLUMN IF EXISTS usage_count;

-- =====================================================================================
-- 트랜잭션 커밋
-- =====================================================================================

COMMIT;

-- =====================================================================================
-- 롤백 완료 메시지
-- =====================================================================================
--
-- 롤백이 완료되었습니다.
--
-- 롤백된 변경사항:
-- Manager DB:
--   - idam.roles: role_code, role_name, role_type 복원
--   - idam.permissions: permission_code, permission_name, resource_type 복원
--   - tnnt.tenants: is_suspended 필드 제거
--
-- Tenant DB:
--   - ivm.inventory_balances: variant_id 제거
--   - sys.users: 감시 필드 제거
--   - hrm.employees: 암호화 필드 제거
--   - fim.journal_entries: 회계 필드 제거
--
-- 주의: 기존 데이터는 보존되며, 스키마만 원래 상태로 복원됩니다.
--
-- =====================================================================================
