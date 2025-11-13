-- =====================================================================================
-- 마이그레이션: Tenant DB sys.users - tenant_id 추가 및 제약조건 강화
-- 설명: 테넌트별 사용자 격리를 위한 tenant_id 컬럼 추가 및 유니크 제약 수정
-- 작성일: 2025-01-26
-- =====================================================================================

-- Step 1: tenant_id 컬럼 추가
ALTER TABLE sys.users
ADD COLUMN IF NOT EXISTS tenant_id UUID;

COMMENT ON COLUMN sys.users.tenant_id IS '테넌트 ID (Manager DB의 tnnt.tenants 참조, 논리적 FK)';

-- Step 2: 기존 데이터에 tenant_id 설정 (필요시 - 실제 테넌트 ID로 업데이트 필요)
-- UPDATE sys.users SET tenant_id = :actual_tenant_id WHERE tenant_id IS NULL;

-- Step 3: tenant_id를 NOT NULL로 변경 (기존 데이터 마이그레이션 후)
-- 주의: 모든 레코드에 tenant_id가 설정된 후 실행
-- ALTER TABLE sys.users ALTER COLUMN tenant_id SET NOT NULL;

-- Step 4: 기존 유니크 인덱스 제거
DROP INDEX IF EXISTS sys.ux_users__user_code;
DROP INDEX IF EXISTS sys.ux_users__username;
DROP INDEX IF EXISTS sys.ux_users__email;

-- Step 5: 테넌트별 유니크 인덱스 재생성
-- 사용자 코드는 테넌트 내에서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_users__tenant_user_code
    ON sys.users (tenant_id, user_code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_users__tenant_user_code IS '테넌트별 사용자 코드 유니크 제약';

-- 사용자명은 테넌트 내에서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_users__tenant_username
    ON sys.users (tenant_id, username)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_users__tenant_username IS '테넌트별 사용자명 유니크 제약';

-- 이메일은 테넌트 내에서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_users__tenant_email
    ON sys.users (tenant_id, email)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_users__tenant_email IS '테넌트별 이메일 유니크 제약';

-- Step 6: tenant_id 인덱스 추가 (조회 성능)
CREATE INDEX IF NOT EXISTS ix_users__tenant_id
    ON sys.users (tenant_id, is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_users__tenant_id IS '테넌트별 활성 사용자 조회 인덱스';

-- Step 7: 테이블 주석 업데이트
COMMENT ON TABLE sys.users IS '테넌트 비즈니스 사용자 계정 (각 기업의 직원, 테넌트별 완전 격리)';

-- 참고: tenant_id는 Manager DB의 tnnt.tenants.id를 논리적으로 참조
-- 참고: 물리적 외래키는 설정하지 않음 (크로스 DB 참조 불가)
-- 참고: 애플리케이션 레벨에서 tenant_id 무결성 보장
