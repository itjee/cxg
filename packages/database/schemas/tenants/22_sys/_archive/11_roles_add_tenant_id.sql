-- =====================================================================================
-- 마이그레이션: Tenant DB sys.roles - tenant_id 추가
-- 설명: 테넌트별 역할 격리를 위한 tenant_id 컬럼 추가
-- 작성일: 2025-01-26
-- =====================================================================================

-- Step 1: tenant_id 컬럼 추가
ALTER TABLE sys.roles
ADD COLUMN IF NOT EXISTS tenant_id UUID;

COMMENT ON COLUMN sys.roles.tenant_id IS '테넌트 ID (Manager DB의 tnnt.tenants 참조, 논리적 FK)';

-- Step 2: 기존 유니크 인덱스 확인 및 제거
DROP INDEX IF EXISTS sys.ux_roles__role_code;
DROP INDEX IF EXISTS sys.ux_roles__role_name;

-- Step 3: 테넌트별 유니크 인덱스 생성
-- 역할 코드는 테넌트 내에서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_roles__tenant_role_code
    ON sys.roles (tenant_id, role_code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_roles__tenant_role_code IS '테넌트별 역할 코드 유니크 제약';

-- 역할명은 테넌트 내에서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_roles__tenant_role_name
    ON sys.roles (tenant_id, role_name)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_roles__tenant_role_name IS '테넌트별 역할명 유니크 제약';

-- Step 4: tenant_id 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_roles__tenant_id
    ON sys.roles (tenant_id, is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_roles__tenant_id IS '테넌트별 활성 역할 조회 인덱스';

-- Step 5: 테이블 주석 업데이트
COMMENT ON TABLE sys.roles IS '테넌트 비즈니스 역할 (각 기업의 조직 역할, 테넌트별 커스터마이징 가능)';
