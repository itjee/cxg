-- =====================================================================================
-- 마이그레이션: Tenant DB DDL 개선사항 적용
-- 작성일: 2025-10-27
-- 설명: P0 우선순위 Tenant DB 스키마 개선사항
-- =====================================================================================

-- =====================================================================================
-- 1. ivm.inventory_balances 개선사항 (CRITICAL ⭐)
-- =====================================================================================

BEGIN;

-- 1.1. variant_id 컬럼 추가 (핵심 개선사항)
ALTER TABLE ivm.inventory_balances ADD COLUMN IF NOT EXISTS variant_id UUID;

-- 1.2. 외래키 제약조건 추가
ALTER TABLE ivm.inventory_balances
  ADD CONSTRAINT fk_inventory_balances__variant_id
    FOREIGN KEY (variant_id)
    REFERENCES pim.product_variants(id)
    ON DELETE RESTRICT;

-- 1.3. 가용 수량 일관성 체크 제약조건 추가
ALTER TABLE ivm.inventory_balances DROP CONSTRAINT IF EXISTS ck_inventory_balances__available;
ALTER TABLE ivm.inventory_balances ADD CONSTRAINT ck_inventory_balances__available CHECK (available_qty <= on_hand_qty);

-- 1.4. 기존 유니크 인덱스 삭제
DROP INDEX IF EXISTS ivm.ux_inventory_balances__item_location;

-- 1.5. 새 유니크 인덱스 생성 (variant_id 포함)
CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid),
        COALESCE(lot_number, ''),
        COALESCE(serial_number, '')
    );

-- 1.6. 새 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_inventory_balances__variant_id
    ON ivm.inventory_balances (variant_id)
 WHERE variant_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_product_variant
    ON ivm.inventory_balances (warehouse_id, product_id, variant_id);

-- 1.7. 기존 인덱스 업데이트
DROP INDEX IF EXISTS ivm.ix_inventory_balances__available_qty;
CREATE INDEX IF NOT EXISTS ix_inventory_balances__available_qty
    ON ivm.inventory_balances (warehouse_id, product_id, variant_id)
 WHERE available_qty > 0;

-- 1.8. 컬럼 코멘트 추가
COMMENT ON COLUMN ivm.inventory_balances.variant_id IS '제품 변형 식별자 (옵션 조합, 예: 색상-빨강/사이즈-L)';
COMMENT ON CONSTRAINT fk_inventory_balances__variant_id ON ivm.inventory_balances IS '제품 변형 참조 외래키 (RESTRICT 삭제)';

COMMIT;

-- =====================================================================================
-- 2. sys.users 개선사항
-- =====================================================================================

BEGIN;

-- 2.1. 시스템 사용자 플래그 추가
ALTER TABLE sys.users ADD COLUMN IF NOT EXISTS is_system_user BOOLEAN NOT NULL DEFAULT FALSE;

-- 2.2. 로그인 추적 컬럼 추가
ALTER TABLE sys.users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45);
ALTER TABLE sys.users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE sys.users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

-- 2.3. 제약조건 추가
ALTER TABLE sys.users DROP CONSTRAINT IF EXISTS ck_users__failed_attempts;
ALTER TABLE sys.users ADD CONSTRAINT ck_users__failed_attempts CHECK (failed_login_attempts >= 0);

-- 2.4. 새 인덱스 생성
CREATE INDEX IF NOT EXISTS ix_users__is_system_user
    ON sys.users (is_system_user)
 WHERE is_system_user = TRUE AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_users__locked_until
    ON sys.users (locked_until)
 WHERE locked_until IS NOT NULL
   AND locked_until > CURRENT_TIMESTAMP
   AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_users__failed_attempts
    ON sys.users (failed_login_attempts DESC)
 WHERE failed_login_attempts > 0 AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS ix_users__active_role
    ON sys.users (is_active, role_id)
 WHERE is_deleted = FALSE;

-- 2.5. 외래키 제약조건 추가 (자기 참조)
ALTER TABLE sys.users DROP CONSTRAINT IF EXISTS fk_users__created_by;
ALTER TABLE sys.users DROP CONSTRAINT IF EXISTS fk_users__updated_by;

ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__created_by
    FOREIGN KEY (created_by)
    REFERENCES sys.users(id)
    ON DELETE SET NULL;

ALTER TABLE sys.users
  ADD CONSTRAINT fk_users__updated_by
    FOREIGN KEY (updated_by)
    REFERENCES sys.users(id)
    ON DELETE SET NULL;

-- 2.6. 컬럼 코멘트 추가
COMMENT ON COLUMN sys.users.created_by IS '등록자 UUID (NULL 가능 - 시스템 초기 사용자)';
COMMENT ON COLUMN sys.users.is_system_user IS '시스템 사용자 여부 (TRUE: 자동화/배치용, FALSE: 일반 사용자)';
COMMENT ON COLUMN sys.users.last_login_ip IS '마지막 로그인 IP 주소 (보안 추적용, IPv6 지원)';
COMMENT ON COLUMN sys.users.failed_login_attempts IS '연속 로그인 실패 횟수 (보안 - 계정 잠금 판단용)';
COMMENT ON COLUMN sys.users.locked_until IS '계정 잠금 해제 시각 (NULL: 잠금 없음)';

COMMENT ON CONSTRAINT fk_users__created_by ON sys.users IS '생성자 참조 외래키 (자기 참조, SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_users__updated_by ON sys.users IS '수정자 참조 외래키 (자기 참조, SET NULL 삭제)';

COMMIT;

-- =====================================================================================
-- 검증 쿼리
-- =====================================================================================

-- 컬럼 존재 확인
SELECT
    'ivm.inventory_balances' AS table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'ivm'
  AND table_name = 'inventory_balances'
  AND column_name IN ('variant_id')
ORDER BY column_name;

SELECT
    'sys.users' AS table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'sys'
  AND table_name = 'users'
  AND column_name IN ('is_system_user', 'last_login_ip', 'failed_login_attempts', 'locked_until')
ORDER BY column_name;

-- 외래키 확인
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('ivm', 'sys')
  AND tc.table_name IN ('inventory_balances', 'users')
  AND tc.constraint_name IN (
    'fk_inventory_balances__variant_id',
    'fk_users__created_by',
    'fk_users__updated_by'
  )
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;

-- 인덱스 확인
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('ivm', 'sys')
  AND tablename IN ('inventory_balances', 'users')
ORDER BY schemaname, tablename, indexname;

-- 데이터 무결성 검증
-- inventory_balances: 가용 수량이 현재고를 초과하는 레코드 확인
SELECT
    id,
    warehouse_id,
    product_id,
    variant_id,
    on_hand_qty,
    available_qty,
    reserved_qty
FROM ivm.inventory_balances
WHERE available_qty > on_hand_qty;

-- sys.users: 로그인 실패 횟수가 음수인 레코드 확인
SELECT
    id,
    username,
    email,
    failed_login_attempts
FROM sys.users
WHERE failed_login_attempts < 0;
