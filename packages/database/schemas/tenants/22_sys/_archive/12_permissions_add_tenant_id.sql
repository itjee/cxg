-- =====================================================================================
-- 마이그레이션: Tenant DB sys.permissions - tenant_id 추가
-- 설명: 테넌트별 권한 격리를 위한 tenant_id 컬럼 추가
-- 작성일: 2025-01-26
-- 참고: sys.permissions는 시스템 전체 권한 정의이므로 tenant_id는 선택사항
--       테넌트별 커스텀 권한이 필요한 경우에만 사용
-- =====================================================================================

-- Step 1: tenant_id 컬럼 추가 (NULL 허용 - 시스템 기본 권한은 NULL)
ALTER TABLE sys.permissions
ADD COLUMN IF NOT EXISTS tenant_id UUID;

COMMENT ON COLUMN sys.permissions.tenant_id IS '테넌트 ID (NULL: 시스템 기본 권한, NOT NULL: 테넌트 커스텀 권한)';

-- Step 2: 기존 유니크 인덱스 제거
DROP INDEX IF EXISTS sys.ux_permissions__permission_code;

-- Step 3: 복합 유니크 인덱스 생성 (권한 코드는 테넌트별 유니크)
-- COALESCE를 사용하여 NULL도 유니크 제약에 포함
CREATE UNIQUE INDEX IF NOT EXISTS ux_permissions__tenant_permission_code
    ON sys.permissions (COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'::UUID), permission_code)
 WHERE is_active = true;
COMMENT ON INDEX sys.ux_permissions__tenant_permission_code IS '테넌트별 권한 코드 유니크 제약 (NULL은 시스템 기본 권한)';

-- Step 4: tenant_id 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_permissions__tenant_id
    ON sys.permissions (tenant_id, module_code, is_active)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__tenant_id IS '테넌트별 모듈 권한 조회 인덱스';

-- Step 5: 시스템 기본 권한 인덱스 (tenant_id IS NULL)
CREATE INDEX IF NOT EXISTS ix_permissions__system_default
    ON sys.permissions (module_code, resource, action)
 WHERE tenant_id IS NULL AND is_active = true;
COMMENT ON INDEX sys.ix_permissions__system_default IS '시스템 기본 권한 조회 인덱스';

-- Step 6: 테이블 주석 업데이트
COMMENT ON TABLE sys.permissions IS '시스템 권한 정의 (tenant_id NULL: 기본 권한, NOT NULL: 테넌트 커스텀 권한)';

-- 참고: 권한 관리 패턴
-- 1. 시스템 기본 권한: tenant_id = NULL (모든 테넌트가 공유)
-- 2. 테넌트 커스텀 권한: tenant_id = 특정 테넌트 UUID
-- 3. 권한 조회 시: 시스템 기본 권한 + 테넌트 커스텀 권한 UNION
