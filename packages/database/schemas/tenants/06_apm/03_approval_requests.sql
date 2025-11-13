-- =====================================================================================
-- 테이블: apm.approval_requests
-- 설명: 결재 요청 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS apm.approval_requests 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재 요청 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 결재 요청 기본 정보
    request_code            VARCHAR(50)              NOT NULL,                               -- 결재 요청 코드
    document_type           VARCHAR(50)              NOT NULL,                               -- 문서 유형
    document_id             UUID                     NOT NULL,                               -- 문서 식별자
    
    -- 요청자 정보
    requester_id            UUID                     NOT NULL,                               -- 요청자 식별자
    department_id           UUID,                                                            -- 요청 부서
    
    -- 결재선 정보
    line_id                 UUID,                                                            -- 사용된 결재선
    current_step            INTEGER                  DEFAULT 1,                              -- 현재 결재 단계
    
    -- 제목 및 내용
    subject                 VARCHAR(500)             NOT NULL,                               -- 제목
    content                 TEXT,                                                            -- 내용
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 결재 상태
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시
    
    -- 외래키 제약조건
    -- 결재선 참조 외래키 (결재선 삭제 시 NULL로 설정)
    CONSTRAINT fk_approval_requests__line_id        FOREIGN KEY (line_id) 
                                                    REFERENCES apm.approval_lines(id) 
                                                    ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 단계 번호 양수 체크 (1 이상)
    CONSTRAINT ck_approval_requests__current_step   CHECK (current_step > 0),
    
    -- 상태 체크 (PENDING: 대기, IN_PROGRESS: 진행중, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)
    CONSTRAINT ck_approval_requests__status         CHECK (status IN ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  apm.approval_requests                  IS '결재 요청 테이블';
COMMENT ON COLUMN apm.approval_requests.id               IS '결재 요청 고유 식별자';
COMMENT ON COLUMN apm.approval_requests.created_at       IS '등록 일시';
COMMENT ON COLUMN apm.approval_requests.created_by       IS '등록자 UUID';
COMMENT ON COLUMN apm.approval_requests.updated_at       IS '수정 일시';
COMMENT ON COLUMN apm.approval_requests.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN apm.approval_requests.request_code     IS '결재 요청 코드';
COMMENT ON COLUMN apm.approval_requests.document_type    IS '문서 유형 (PO/SO/LEAVE/EXPENSE 등)';
COMMENT ON COLUMN apm.approval_requests.document_id      IS '문서 식별자';
COMMENT ON COLUMN apm.approval_requests.requester_id     IS '요청자 식별자';
COMMENT ON COLUMN apm.approval_requests.department_id    IS '요청 부서';
COMMENT ON COLUMN apm.approval_requests.line_id          IS '사용된 결재선';
COMMENT ON COLUMN apm.approval_requests.current_step     IS '현재 결재 단계';
COMMENT ON COLUMN apm.approval_requests.subject          IS '제목';
COMMENT ON COLUMN apm.approval_requests.content          IS '내용';
COMMENT ON COLUMN apm.approval_requests.status           IS '결재 상태 (PENDING/IN_PROGRESS/APPROVED/REJECTED/CANCELLED)';
COMMENT ON COLUMN apm.approval_requests.completed_at     IS '완료 일시';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_approval_requests__request_code
    ON apm.approval_requests (request_code);
COMMENT ON INDEX apm.ix_approval_requests__request_code IS '결재 요청 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__document
    ON apm.approval_requests (document_type, document_id);
COMMENT ON INDEX apm.ix_approval_requests__document IS '문서별 결재 요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__requester_id
    ON apm.approval_requests (requester_id);
COMMENT ON INDEX apm.ix_approval_requests__requester_id IS '요청자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__status
    ON apm.approval_requests (status);
COMMENT ON INDEX apm.ix_approval_requests__status IS '상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__created_at
    ON apm.approval_requests (created_at DESC);
COMMENT ON INDEX apm.ix_approval_requests__created_at IS '등록일시 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_requests__code
    ON apm.approval_requests (request_code);
COMMENT ON INDEX apm.ux_approval_requests__code IS '결재 요청 코드 유니크 제약';
