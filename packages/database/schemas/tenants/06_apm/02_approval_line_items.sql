-- =====================================================================================
-- 테이블: apm.approval_line_items
-- 설명: 결재선 상세 (결재 단계별 결재자) 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS apm.approval_line_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재선 항목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 결재선 정보
    line_id                 UUID                     NOT NULL,                               -- 결재선 식별자
    step_no                 INTEGER                  NOT NULL,                               -- 결재 단계 번호
    
    -- 결재자 정보
    approver_id             UUID                     NOT NULL,                               -- 결재자 식별자
    approver_type           VARCHAR(20)              DEFAULT 'EMPLOYEE',                     -- 결재자 유형
    
    -- 결재 옵션
    is_required             BOOLEAN                  DEFAULT true,                           -- 필수 결재 여부
    
    -- 외래키 제약조건
    -- 결재선 참조 외래키 (결재선 삭제 시 항목도 함께 삭제)
    CONSTRAINT fk_approval_line_items__line_id      FOREIGN KEY (line_id) 
                                                    REFERENCES apm.approval_lines(id) 
                                                    ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 단계 번호 양수 체크 (1 이상)
    CONSTRAINT ck_approval_line_items__step_no      CHECK (step_no > 0),
    
    -- 결재자 유형 체크 (EMPLOYEE: 사원, POSITION: 직급, DEPARTMENT: 부서)
    CONSTRAINT ck_approval_line_items__approver_type CHECK (approver_type IN ('EMPLOYEE', 'POSITION', 'DEPARTMENT'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  apm.approval_line_items                IS '결재선 상세 테이블';
COMMENT ON COLUMN apm.approval_line_items.id             IS '결재선 항목 고유 식별자';
COMMENT ON COLUMN apm.approval_line_items.created_at     IS '등록 일시';
COMMENT ON COLUMN apm.approval_line_items.created_by     IS '등록자 UUID';
COMMENT ON COLUMN apm.approval_line_items.updated_at     IS '수정 일시';
COMMENT ON COLUMN apm.approval_line_items.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN apm.approval_line_items.line_id        IS '결재선 식별자';
COMMENT ON COLUMN apm.approval_line_items.step_no        IS '결재 단계 번호';
COMMENT ON COLUMN apm.approval_line_items.approver_id    IS '결재자 식별자';
COMMENT ON COLUMN apm.approval_line_items.approver_type  IS '결재자 유형 (EMPLOYEE/POSITION/DEPARTMENT)';
COMMENT ON COLUMN apm.approval_line_items.is_required    IS '필수 결재 여부';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_approval_line_items__line_id
    ON apm.approval_line_items (line_id, step_no);
COMMENT ON INDEX apm.ix_approval_line_items__line_id IS '결재선별 단계 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_line_items__approver_id
    ON apm.approval_line_items (approver_id);
COMMENT ON INDEX apm.ix_approval_line_items__approver_id IS '결재자별 조회 인덱스';
