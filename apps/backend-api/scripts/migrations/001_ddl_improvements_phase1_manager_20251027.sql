-- =====================================================================================
-- DDL 개선 마이그레이션 Phase 1: Manager DB
-- 작성일: 2025-10-27
-- 목표: 컬럼명 정규화, 감시 필드 표준화, 인덱스 최적화
-- 실행 순서: 1순위 (즉시 적용 가능)
-- =====================================================================================

-- 트랜잭션 시작
BEGIN TRANSACTION;

-- =====================================================================================
-- 1. IDAM.ROLES 개선
-- =====================================================================================
-- 목표: role_code → code, role_name → name, role_type → type 통일
-- 영향: 시스템 권한 관리 테이블

-- Step 1: 컬럼명 변경
ALTER TABLE idam.roles
    RENAME COLUMN role_code TO code;

ALTER TABLE idam.roles
    RENAME COLUMN role_name TO name;

ALTER TABLE idam.roles
    RENAME COLUMN role_type TO type;

-- Step 2: 감시 필드 추가
ALTER TABLE idam.roles
    ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 3: CHECK 제약 추가
ALTER TABLE idam.roles
    ADD CONSTRAINT ck_roles__code_not_empty CHECK (char_length(code) > 0);

ALTER TABLE idam.roles
    ADD CONSTRAINT ck_roles__name_not_empty CHECK (char_length(name) > 0);

-- Step 4: 기존 인덱스 제거
DROP INDEX IF EXISTS uk_roles__role_code;
DROP INDEX IF EXISTS ix_roles__role_code;
DROP INDEX IF EXISTS ix_roles__role_type;
DROP INDEX IF EXISTS ix_roles__role_name;

-- Step 5: 새 인덱스 생성
CREATE UNIQUE INDEX ux_roles__code
    ON idam.roles (code)
 WHERE deleted = false;
COMMENT ON INDEX idam.ux_roles__code IS '역할 코드 유니크 제약 (삭제되지 않은 항목)';

CREATE INDEX ix_roles__code
    ON idam.roles (code)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_roles__code IS '역할 코드 검색 인덱스';

CREATE INDEX ix_roles__type
    ON idam.roles (type)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_roles__type IS '역할 타입별 조회 인덱스';

CREATE INDEX ix_roles__status
    ON idam.roles (status)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_roles__status IS '역할 상태별 조회 인덱스';

CREATE INDEX ix_roles__priority
    ON idam.roles (priority)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_roles__priority IS '역할 우선순위 인덱스';

-- Step 6: 주석 업데이트
COMMENT ON COLUMN idam.roles.code IS '역할 코드 (super_admin, tenant_admin, support 등)';
COMMENT ON COLUMN idam.roles.name IS '역할 명칭';
COMMENT ON COLUMN idam.roles.type IS '역할 타입 (SYSTEM > PLATFORM > ADMIN > MANAGER > USER > GUEST)';
COMMENT ON COLUMN idam.roles.deleted IS '논리 삭제 플래그';

-- =====================================================================================
-- 2. IDAM.PERMISSIONS 개선
-- =====================================================================================
-- 목표: permission_code → code, permission_name → name, resource_type → resource
-- 영향: 플랫폼 권한 정의 테이블

-- Step 1: 컬럼명 변경
ALTER TABLE idam.permissions
    RENAME COLUMN permission_code TO code;

ALTER TABLE idam.permissions
    RENAME COLUMN permission_name TO name;

ALTER TABLE idam.permissions
    RENAME COLUMN resource_type TO resource;

-- Step 2: 추가 컬럼
ALTER TABLE idam.permissions
    ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 3: CHECK 제약 추가
ALTER TABLE idam.permissions
    ADD CONSTRAINT ck_permissions__code_not_empty CHECK (char_length(code) > 0);

ALTER TABLE idam.permissions
    ADD CONSTRAINT ck_permissions__name_not_empty CHECK (char_length(name) > 0);

-- Step 4: 기존 인덱스 제거
DROP INDEX IF EXISTS uk_permissions__permission_code;
DROP INDEX IF EXISTS ix_permissions__permission_code;
DROP INDEX IF EXISTS ix_permissions__category;
DROP INDEX IF EXISTS ix_permissions__resource_type;
DROP INDEX IF EXISTS ix_permissions__action;
DROP INDEX IF EXISTS ix_permissions__scope;
DROP INDEX IF EXISTS ix_permissions__applies_to;
DROP INDEX IF EXISTS ix_permissions__is_system;
DROP INDEX IF EXISTS ix_permissions__status;
DROP INDEX IF EXISTS ix_permissions__category_action;

-- Step 5: 새 인덱스 생성
CREATE UNIQUE INDEX ux_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;
COMMENT ON INDEX idam.ux_permissions__code IS '권한 코드 유니크 제약';

CREATE INDEX ix_permissions__code
    ON idam.permissions (code)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__code IS '권한 코드 검색 인덱스';

CREATE INDEX ix_permissions__category
    ON idam.permissions (category)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__category IS '권한 카테고리별 조회 인덱스';

CREATE INDEX ix_permissions__resource
    ON idam.permissions (resource)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__resource IS '리소스별 권한 조회 인덱스';

CREATE INDEX ix_permissions__action
    ON idam.permissions (action)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__action IS '액션별 권한 조회 인덱스';

CREATE INDEX ix_permissions__scope
    ON idam.permissions (scope)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__scope IS '권한 범위별 조회 인덱스';

CREATE INDEX ix_permissions__category_action_code
    ON idam.permissions (category, action, code)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_permissions__category_action_code IS '카테고리-액션-코드 복합 조회 인덱스';

-- Step 6: 주석 업데이트
COMMENT ON COLUMN idam.permissions.code IS '권한 코드 (tenant:read, system:config:write 등)';
COMMENT ON COLUMN idam.permissions.name IS '권한 명칭';
COMMENT ON COLUMN idam.permissions.resource IS '리소스 타입 (tenant, system, billing)';
COMMENT ON COLUMN idam.permissions.is_hidden IS 'UI에서 숨김 여부';
COMMENT ON COLUMN idam.permissions.deleted IS '논리 삭제 플래그';

-- =====================================================================================
-- 3. TNNT.TENANTS 개선
-- =====================================================================================
-- 목표: 테넌트 일시 중단 기능 추가
-- 영향: 테넌트 관리 시스템

-- Step 1: 컬럼 추가
ALTER TABLE tnnt.tenants
    ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
    ADD COLUMN IF NOT EXISTS suspension_date TIMESTAMP WITH TIME ZONE;

-- Step 2: CHECK 제약 추가
ALTER TABLE tnnt.tenants
    ADD CONSTRAINT ck_tenants__max_users CHECK (max_users > 0);

ALTER TABLE tnnt.tenants
    ADD CONSTRAINT ck_tenants__suspension_logic CHECK (
        (is_suspended = false AND suspended_reason IS NULL AND suspension_date IS NULL)
        OR
        (is_suspended = true AND suspended_reason IS NOT NULL AND suspension_date IS NOT NULL)
    );

-- Step 3: 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_tenants__status_created
    ON tnnt.tenants (status, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX tnnt.ix_tenants__status_created IS '테넌트 상태-생성일 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_tenants__is_suspended
    ON tnnt.tenants (is_suspended)
 WHERE is_deleted = false;
COMMENT ON INDEX tnnt.ix_tenants__is_suspended IS '일시 중단 테넌트 조회 인덱스';

-- Step 4: 주석 추가
COMMENT ON COLUMN tnnt.tenants.is_suspended IS '테넌트 일시 중단 상태';
COMMENT ON COLUMN tnnt.tenants.suspended_reason IS '중단 사유';
COMMENT ON COLUMN tnnt.tenants.suspension_date IS '중단 일시';

-- =====================================================================================
-- 4. IDAM.ROLE_PERMISSIONS 인덱스 최적화
-- =====================================================================================

-- 복합 인덱스 추가 (자주 함께 조회됨)
CREATE INDEX IF NOT EXISTS ix_role_permissions__role_permission
    ON idam.role_permissions (role_id, permission_id)
 WHERE deleted = false;
COMMENT ON INDEX idam.ix_role_permissions__role_permission IS '역할-권한 복합 조회 인덱스';

-- =====================================================================================
-- 5. IDAM.LOGIN_LOGS 인덱스 최적화
-- =====================================================================================

DROP INDEX IF EXISTS ix_login_logs__user_id;

CREATE INDEX IF NOT EXISTS ix_login_logs__user_id_created
    ON idam.login_logs (user_id, created_at DESC);
COMMENT ON INDEX idam.ix_login_logs__user_id_created IS '사용자별 로그인 이력 조회 인덱스';

-- =====================================================================================
-- 검증 쿼리
-- =====================================================================================

-- 컬럼명 변경 검증
-- SELECT COUNT(*) as role_code_exists FROM idam.roles WHERE code IS NULL;
-- SELECT COUNT(*) as perm_code_exists FROM idam.permissions WHERE code IS NULL;

-- 트랜잭션 커밋
COMMIT;

-- =====================================================================================
-- 마이그레이션 완료 메시지
-- =====================================================================================
--
-- DDL 개선 Phase 1 (Manager DB) 마이그레이션이 성공적으로 완료되었습니다.
--
-- 변경 사항:
-- 1. idam.roles: role_code → code, role_name → name, role_type → type, +deleted
-- 2. idam.permissions: permission_code → code, permission_name → name, resource_type → resource, +is_hidden, +deleted
-- 3. tnnt.tenants: +is_suspended, +suspended_reason, +suspension_date
-- 4. 인덱스 최적화: 부분 인덱스, 복합 인덱스 추가
--
-- 주의: 애플리케이션 코드에서 컬럼명 참조 변경 필요
-- 예: roles.role_code → roles.code
--
-- =====================================================================================
