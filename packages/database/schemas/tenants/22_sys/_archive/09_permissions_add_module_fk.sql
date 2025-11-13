-- =====================================================================================
-- 마이그레이션: sys.permissions 테이블에 module_id 추가 및 외래키 설정
-- 설명: module_code를 module_id (FK)로 전환하는 마이그레이션
-- 작성일: 2025-01-26
-- 참고: 기존 module_code 컬럼은 하위 호환성을 위해 유지
-- =====================================================================================

-- Step 1: module_id 컬럼 추가
ALTER TABLE sys.permissions 
ADD COLUMN IF NOT EXISTS module_id UUID;

COMMENT ON COLUMN sys.permissions.module_id IS '모듈 ID (sys.modules 참조)';

-- Step 2: 기존 module_code 데이터를 module_id로 마이그레이션
UPDATE sys.permissions p
SET module_id = m.id
FROM sys.modules m
WHERE p.module_code = m.module_code
  AND p.module_id IS NULL;

-- Step 3: module_id를 NOT NULL로 변경 (데이터 마이그레이션 후)
-- ALTER TABLE sys.permissions 
-- ALTER COLUMN module_id SET NOT NULL;

-- Step 4: 외래키 제약조건 추가
ALTER TABLE sys.permissions
DROP CONSTRAINT IF EXISTS fk_permissions__module;

ALTER TABLE sys.permissions
ADD CONSTRAINT fk_permissions__module 
FOREIGN KEY (module_id) 
REFERENCES sys.modules(id) 
ON DELETE RESTRICT;

-- Step 5: module_id 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_permissions__module_id
    ON sys.permissions (module_id, is_active)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_permissions__module_id IS '모듈별 권한 조회 인덱스 (FK)';

-- Step 6: 기존 CHECK 제약조건 제거 (선택사항, 점진적 마이그레이션)
-- ALTER TABLE sys.permissions 
-- DROP CONSTRAINT IF EXISTS ck_permissions__module_code;

-- 참고: module_code 컬럼은 하위 호환성을 위해 유지하되, 
--       향후 애플리케이션 레벨에서 module_id를 우선 사용
