-- =====================================================================================
-- 테이블: apm.approval_lines
-- 설명: 결재선 정의 테이블 (워크플로우 정의 통합)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-27 - 워크플로우 설정은 approval_workflow_configs로 분리
-- =====================================================================================

CREATE TABLE IF NOT EXISTS apm.approval_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재선 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 결재선 기본 정보
    line_code               VARCHAR(50)              NOT NULL,                               -- 결재선 코드
    line_name               VARCHAR(200)             NOT NULL,                               -- 결재선명
    document_type           VARCHAR(50)              NOT NULL,                               -- 문서 유형
    
    -- 조직 정보
    department_id           UUID,                                                            -- 적용 부서
    
    -- 설명
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- CHECK 제약조건
    -- 결재선 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 2-50자)
    CONSTRAINT ck_approval_lines__line_code         CHECK (line_code ~ '^[A-Z0-9_]{2,50}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  apm.approval_lines                     IS '결재선 정의 테이블';
COMMENT ON COLUMN apm.approval_lines.id                  IS '결재선 고유 식별자';
COMMENT ON COLUMN apm.approval_lines.created_at          IS '등록 일시';
COMMENT ON COLUMN apm.approval_lines.created_by          IS '등록자 UUID';
COMMENT ON COLUMN apm.approval_lines.updated_at          IS '수정 일시';
COMMENT ON COLUMN apm.approval_lines.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN apm.approval_lines.line_code           IS '결재선 코드';
COMMENT ON COLUMN apm.approval_lines.line_name           IS '결재선명';
COMMENT ON COLUMN apm.approval_lines.document_type       IS '문서 유형 (PO/SO/LEAVE/EXPENSE 등)';
COMMENT ON COLUMN apm.approval_lines.department_id       IS '적용 부서 (NULL이면 전체)';
COMMENT ON COLUMN apm.approval_lines.description         IS '설명';
COMMENT ON COLUMN apm.approval_lines.is_active           IS '활성 여부';
COMMENT ON COLUMN apm.approval_lines.is_deleted          IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_approval_lines__line_code
    ON apm.approval_lines (line_code)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ix_approval_lines__line_code IS '결재선 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_lines__document_type
    ON apm.approval_lines (document_type)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ix_approval_lines__document_type IS '문서 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_lines__department_id
    ON apm.approval_lines (department_id)
 WHERE department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX apm.ix_approval_lines__department_id IS '부서별 결재선 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_lines__code
    ON apm.approval_lines (line_code)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ux_approval_lines__code IS '결재선 코드 유니크 제약';
