-- =====================================================================================
-- 마이그레이션: Manager DB DDL 개선사항 적용
-- 작성일: 2025-10-27
-- 설명: P0 우선순위 Manager DB 스키마 개선사항
-- =====================================================================================

-- =====================================================================================
-- 1. idam.roles 개선사항
-- =====================================================================================

BEGIN;

-- 1.1. 컬럼 이름 변경 (role_code → code, role_name → name, role_type → type)
ALTER TABLE idam.roles RENAME COLUMN role_code TO code;
ALTER TABLE idam.roles RENAME COLUMN role_name TO name;
ALTER TABLE idam.roles RENAME COLUMN role_type TO type;

-- 1.2. is_deleted 컬럼 추가
ALTER TABLE idam.roles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 1.3. 제약조건 이름 변경
ALTER TABLE idam.roles DROP CONSTRAINT IF EXISTS uk_roles__role_code;
ALTER TABLE idam.roles DROP CONSTRAINT IF EXISTS ck_roles__role_type;
ALTER TABLE idam.roles ADD CONSTRAINT uk_roles__code UNIQUE (code);
ALTER TABLE idam.roles ADD CONSTRAINT ck_roles__type CHECK (type IN ('SYSTEM', 'PLATFORM', 'ADMIN', 'MANAGER', 'USER', 'GUEST'));

-- 1.4. 기존 인덱스 삭제
DROP INDEX IF EXISTS idam.ix_roles__role_code;
DROP INDEX IF EXISTS idam.ix_roles__role_type;
DROP INDEX IF EXISTS idam.ix_roles__status;

-- 1.5. 새 인덱스 생성 (부분 인덱스로 최적화)
CREATE INDEX IF NOT EXISTS ix_roles__code
    ON idam.roles (code)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_roles__type
    ON idam.roles (type)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_roles__scope
    ON idam.roles (scope)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_roles__is_default
    ON idam.roles (is_default)
 WHERE is_default = TRUE AND is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_roles__priority
    ON idam.roles (priority ASC)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_roles__type_priority
    ON idam.roles (type, priority ASC)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

-- 1.6. 컬럼 코멘트 업데이트
COMMENT ON COLUMN idam.roles.code IS '역할 코드 (super_admin, tenant_admin, support)';
COMMENT ON COLUMN idam.roles.name IS '역할 명칭';
COMMENT ON COLUMN idam.roles.type IS '역할 타입 (SYSTEM > PLATFORM > ADMIN > MANAGER > USER > GUEST)';
COMMENT ON COLUMN idam.roles.is_deleted IS '논리적 삭제 플래그';

COMMIT;

-- =====================================================================================
-- 2. idam.permissions 개선사항
-- =====================================================================================

BEGIN;

-- 2.1. 컬럼 이름 변경 (permission_code → code, permission_name → name, resource_type → resource)
ALTER TABLE idam.permissions RENAME COLUMN permission_code TO code;
ALTER TABLE idam.permissions RENAME COLUMN permission_name TO name;
ALTER TABLE idam.permissions RENAME COLUMN resource_type TO resource;

-- 2.2. is_hidden, is_deleted 컬럼 추가
ALTER TABLE idam.permissions ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE idam.permissions ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 2.3. 제약조건 이름 변경
ALTER TABLE idam.permissions DROP CONSTRAINT IF EXISTS uk_permissions__permission_code;
ALTER TABLE idam.permissions ADD CONSTRAINT uk_permissions__code UNIQUE (code);

-- 2.4. 기존 인덱스 삭제
DROP INDEX IF EXISTS idam.ix_permissions__permission_code;
DROP INDEX IF EXISTS idam.ix_permissions__resource_type;

-- 2.5. 새 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_permissions__code
    ON idam.permissions (code)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__category
    ON idam.permissions (category)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__resource
    ON idam.permissions (resource)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__action
    ON idam.permissions (action)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__scope
    ON idam.permissions (scope)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__applies_to
    ON idam.permissions (applies_to)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__is_system
    ON idam.permissions (is_system)
 WHERE is_system = TRUE AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_permissions__is_hidden
    ON idam.permissions (is_hidden)
 WHERE is_hidden = FALSE AND is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__category_action
    ON idam.permissions (category, action)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS ix_permissions__resource_action
    ON idam.permissions (resource, action)
 WHERE is_deleted = FALSE AND status = 'ACTIVE';

-- 2.6. 컬럼 코멘트 업데이트
COMMENT ON COLUMN idam.permissions.code IS '권한 코드 (tenant:read, system:config:write 등)';
COMMENT ON COLUMN idam.permissions.name IS '권한 명칭';
COMMENT ON COLUMN idam.permissions.resource IS '리소스 타입 (tenant, system, billing)';
COMMENT ON COLUMN idam.permissions.is_hidden IS 'UI 표시 숨김 여부 (내부 권한용)';
COMMENT ON COLUMN idam.permissions.is_deleted IS '논리적 삭제 플래그';

COMMIT;

-- =====================================================================================
-- 3. tnnt.tenants 개선사항
-- =====================================================================================

BEGIN;

-- 3.1. 중단 관리 컬럼 추가
ALTER TABLE tnnt.tenants ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE tnnt.tenants ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
ALTER TABLE tnnt.tenants ADD COLUMN IF NOT EXISTS suspended_date TIMESTAMP WITH TIME ZONE;

-- 3.2. 제약조건 추가
ALTER TABLE tnnt.tenants DROP CONSTRAINT IF EXISTS ck_tenants__suspended_consistency;
ALTER TABLE tnnt.tenants ADD CONSTRAINT ck_tenants__suspended_consistency CHECK (
    (is_suspended = TRUE AND suspended_date IS NOT NULL) OR
    (is_suspended = FALSE)
);

-- 3.3. 기존 인덱스 업데이트 (부분 인덱스로 변경)
DROP INDEX IF EXISTS tnnt.ux_tenants__tenant_code;
DROP INDEX IF EXISTS tnnt.ux_tenants__business_no;
DROP INDEX IF EXISTS tnnt.ix_tenants__status_active;

CREATE UNIQUE INDEX IF NOT EXISTS ux_tenants__tenant_code
    ON tnnt.tenants (tenant_code)
 WHERE is_deleted = FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS ux_tenants__business_no
    ON tnnt.tenants (business_no)
 WHERE business_no IS NOT NULL AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_tenants__status
    ON tnnt.tenants (status)
 WHERE is_deleted = FALSE;

-- 3.4. 새 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_tenants__is_suspended
    ON tnnt.tenants (is_suspended, suspended_date DESC)
 WHERE is_suspended = TRUE AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_tenants__status_type
    ON tnnt.tenants (status, tenant_type)
 WHERE is_deleted = FALSE;

-- 3.5. 컬럼 코멘트 추가
COMMENT ON COLUMN tnnt.tenants.is_suspended IS '일시 중단 여부 - TRUE(일시중단), FALSE(정상)';
COMMENT ON COLUMN tnnt.tenants.suspended_reason IS '중단 사유 - 일시중단된 경우 그 사유';
COMMENT ON COLUMN tnnt.tenants.suspended_date IS '중단 일시 - 일시중단된 시점';

COMMIT;

-- =====================================================================================
-- 검증 쿼리
-- =====================================================================================

-- 컬럼 존재 확인
SELECT
    'idam.roles' AS table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'idam'
  AND table_name = 'roles'
  AND column_name IN ('code', 'name', 'type', 'is_deleted')
ORDER BY column_name;

SELECT
    'idam.permissions' AS table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'idam'
  AND table_name = 'permissions'
  AND column_name IN ('code', 'name', 'resource', 'is_hidden', 'is_deleted')
ORDER BY column_name;

SELECT
    'tnnt.tenants' AS table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'tnnt'
  AND table_name = 'tenants'
  AND column_name IN ('is_suspended', 'suspended_reason', 'suspended_date')
ORDER BY column_name;

-- 인덱스 확인
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('idam', 'tnnt')
  AND tablename IN ('roles', 'permissions', 'tenants')
ORDER BY schemaname, tablename, indexname;
