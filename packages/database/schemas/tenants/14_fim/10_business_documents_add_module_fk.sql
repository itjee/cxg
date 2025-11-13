-- =====================================================================================
-- 마이그레이션: fim.business_documents 테이블에 source_module_id 추가 및 외래키 설정
-- 설명: source_module을 source_module_id (FK)로 전환하는 마이그레이션
-- 작성일: 2025-01-26
-- =====================================================================================

-- Step 1: source_module_id 컬럼 추가
ALTER TABLE fim.business_documents 
ADD COLUMN IF NOT EXISTS source_module_id UUID;

COMMENT ON COLUMN fim.business_documents.source_module_id IS '원천 모듈 ID (sys.modules 참조)';

-- Step 2: 기존 source_module 데이터를 source_module_id로 마이그레이션
UPDATE fim.business_documents bd
SET source_module_id = m.id
FROM sys.modules m
WHERE bd.source_module = m.module_code
  AND bd.source_module_id IS NULL
  AND bd.source_module != 'MANUAL';  -- MANUAL은 특수 케이스로 NULL 유지

-- Step 3: 외래키 제약조건 추가
ALTER TABLE fim.business_documents
DROP CONSTRAINT IF EXISTS fk_business_documents__source_module;

ALTER TABLE fim.business_documents
ADD CONSTRAINT fk_business_documents__source_module 
FOREIGN KEY (source_module_id) 
REFERENCES sys.modules(id) 
ON DELETE RESTRICT;

-- Step 4: source_module_id 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_business_documents__source_module_id
    ON fim.business_documents (source_module_id, document_date DESC)
 WHERE source_module_id IS NOT NULL;
COMMENT ON INDEX fim.ix_business_documents__source_module_id IS '원천 모듈별 전표 조회 인덱스 (FK)';
