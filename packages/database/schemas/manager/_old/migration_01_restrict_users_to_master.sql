-- =====================================================================================
-- 마이그레이션: Manager DB idam.users - 운영자 전용으로 제한
-- 설명: user_type을 MASTER만 허용하도록 변경 (TENANT, SYSTEM 제거)
-- 작성일: 2025-01-26
-- =====================================================================================

-- Step 1: 기존 TENANT, SYSTEM 타입 사용자 확인 (있으면 경고)
DO $$
DECLARE
    tenant_count INTEGER;
    system_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tenant_count FROM idam.users WHERE user_type = 'TENANT';
    SELECT COUNT(*) INTO system_count FROM idam.users WHERE user_type = 'SYSTEM';
    
    IF tenant_count > 0 THEN
        RAISE WARNING 'Found % TENANT users in idam.users. These should be migrated to Tenant DB.', tenant_count;
    END IF;
    
    IF system_count > 0 THEN
        RAISE WARNING 'Found % SYSTEM users in idam.users. Review if these are needed.', system_count;
    END IF;
END $$;

-- Step 2: user_type 제약조건 변경 (MASTER만 허용)
ALTER TABLE idam.users
DROP CONSTRAINT IF EXISTS ck_users__user_type;

ALTER TABLE idam.users
ADD CONSTRAINT ck_users__user_type 
CHECK (user_type = 'MASTER');

-- Step 3: 기본값 변경
ALTER TABLE idam.users
ALTER COLUMN user_type SET DEFAULT 'MASTER';

-- Step 4: 주석 업데이트
COMMENT ON TABLE idam.users IS 'ConexGrow 플랫폼 운영자 계정 (관리자 전용)';
COMMENT ON COLUMN idam.users.user_type IS '사용자 타입 (MASTER만 허용: 플랫폼 운영자)';

-- Step 5: 운영자 역할 관련 주석 업데이트
COMMENT ON SCHEMA idam IS 'IDAM: ConexGrow 플랫폼 운영자 인증/인가 스키마 (테넌트 사용자는 Tenant DB sys 스키마에서 관리)';

-- 참고: TENANT 타입 사용자는 Tenant DB의 sys.users로 마이그레이션 필요
-- 참고: SYSTEM 타입은 필요시 별도 시스템 계정 테이블로 분리 고려
