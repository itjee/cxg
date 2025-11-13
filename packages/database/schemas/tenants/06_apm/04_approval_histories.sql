-- =====================================================================================
-- 테이블: apm.approval_histories
-- 설명: 결재 이력 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS apm.approval_histories 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재 이력 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    
    -- 결재 요청 정보
    request_id              UUID                     NOT NULL,                               -- 결재 요청 식별자
    step_no                 INTEGER                  NOT NULL,                               -- 결재 단계
    
    -- 결재자 정보
    approver_id             UUID                     NOT NULL,                               -- 결재자 식별자
    
    -- 결재 결과
    action                  VARCHAR(20)              NOT NULL,                               -- 결재 행동
    comment                 TEXT,                                                            -- 의견
    
    -- 결재 일시
    approved_at             TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,              -- 결재 일시
    
    -- 외래키 제약조건
    -- 결재 요청 참조 외래키 (결재 요청 삭제 시 이력도 함께 삭제)
    CONSTRAINT fk_approval_histories__request_id    FOREIGN KEY (request_id) 
                                                    REFERENCES apm.approval_requests(id) 
                                                    ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 행동 체크 (APPROVED: 승인, REJECTED: 반려, RETURNED: 반송, DELEGATED: 위임)
    CONSTRAINT ck_approval_histories__action        CHECK (action IN ('APPROVED', 'REJECTED', 'RETURNED', 'DELEGATED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  apm.approval_histories                 IS '결재 이력 테이블';
COMMENT ON COLUMN apm.approval_histories.id              IS '결재 이력 고유 식별자';
COMMENT ON COLUMN apm.approval_histories.created_at      IS '등록 일시';
COMMENT ON COLUMN apm.approval_histories.created_by      IS '등록자 UUID';
COMMENT ON COLUMN apm.approval_histories.request_id      IS '결재 요청 식별자';
COMMENT ON COLUMN apm.approval_histories.step_no         IS '결재 단계';
COMMENT ON COLUMN apm.approval_histories.approver_id     IS '결재자 식별자';
COMMENT ON COLUMN apm.approval_histories.action          IS '결재 행동 (APPROVED/REJECTED/RETURNED/DELEGATED)';
COMMENT ON COLUMN apm.approval_histories.comment         IS '의견';
COMMENT ON COLUMN apm.approval_histories.approved_at     IS '결재 일시';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_approval_histories__request_id
    ON apm.approval_histories (request_id, step_no);
COMMENT ON INDEX apm.ix_approval_histories__request_id IS '결재 요청별 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_histories__approver_id
    ON apm.approval_histories (approver_id);
COMMENT ON INDEX apm.ix_approval_histories__approver_id IS '결재자별 이력 조회 인덱스';
