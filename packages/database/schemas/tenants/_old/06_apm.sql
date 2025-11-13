-- ============================================================================
-- Approval & Workflow Management Schema (apm)
-- ============================================================================
-- Description: 결재 및 워크플로우 관리 (결재선, 결재진행, 문서)
-- Database: tnnt_db (Tenant Database)
-- Schema: apm
-- Created: 2025-01-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS apm;

COMMENT ON SCHEMA apm IS 'APM: 결재/워크플로우 관리 스키마 (결재선, 결재진행, 문서)';

-- ============================================================================
-- APM: 결재/워크플로우 관리 (Approval & Workflow Management)
-- ============================================================================

-- =====================================================================================
-- 테이블: apm.approval_lines
-- 설명: 결재선 정의 테이블
-- 작성일: 2025-01-20
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
    
    -- 제약조건
    -- 결재선 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 2-50자)
    CONSTRAINT ck_approval_lines__line_code         CHECK (line_code ~ '^[A-Z0-9_]{2,50}$')
);

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
-- 테이블: apm.approval_line_items
-- 설명: 결재선 상세 (결재 단계별 결재자)
-- 작성일: 2025-01-20
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
    
    -- 제약조건
    -- 단계 번호 양수 체크 (1 이상)
    CONSTRAINT ck_approval_line_items__step_no      CHECK (step_no > 0),
    -- 결재자 유형 체크 (EMPLOYEE: 사원, POSITION: 직급, DEPARTMENT: 부서)
    CONSTRAINT ck_approval_line_items__approver_type CHECK (approver_type IN ('EMPLOYEE', 'POSITION', 'DEPARTMENT'))
);

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
-- 테이블: apm.approval_requests
-- 설명: 결재 요청 테이블
-- 작성일: 2025-01-20
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
    
    -- 제약조건
    -- 단계 번호 양수 체크 (1 이상)
    CONSTRAINT ck_approval_requests__current_step   CHECK (current_step > 0),
    -- 상태 체크 (PENDING: 대기, IN_PROGRESS: 진행중, APPROVED: 승인, REJECTED: 반려, CANCELLED: 취소)
    CONSTRAINT ck_approval_requests__status         CHECK (status IN ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'))
);

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
-- 테이블: apm.approval_histories
-- 설명: 결재 이력 테이블
-- 작성일: 2025-01-20
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
    
    -- 제약조건
    -- 행동 체크 (APPROVED: 승인, REJECTED: 반려, RETURNED: 반송, DELEGATED: 위임)
    CONSTRAINT ck_approval_histories__action        CHECK (action IN ('APPROVED', 'REJECTED', 'RETURNED', 'DELEGATED'))
);

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
-- 인덱스
-- =====================================================================================

-- approval_lines 인덱스
CREATE INDEX IF NOT EXISTS ix_approval_lines__line_code
    ON apm.approval_lines (line_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_approval_lines__line_code IS '결재선 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_lines__document_type
    ON apm.approval_lines (document_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_approval_lines__document_type IS '문서 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_lines__department_id
    ON apm.approval_lines (department_id)
 WHERE department_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_approval_lines__department_id IS '부서별 결재선 조회 인덱스';

-- approval_line_items 인덱스
CREATE INDEX IF NOT EXISTS ix_approval_line_items__line_id
    ON apm.approval_line_items (line_id, step_no);
COMMENT ON INDEX ix_approval_line_items__line_id IS '결재선별 단계 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_line_items__approver_id
    ON apm.approval_line_items (approver_id);
COMMENT ON INDEX ix_approval_line_items__approver_id IS '결재자별 조회 인덱스';

-- approval_requests 인덱스
CREATE INDEX IF NOT EXISTS ix_approval_requests__request_code
    ON apm.approval_requests (request_code);
COMMENT ON INDEX ix_approval_requests__request_code IS '결재 요청 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__document
    ON apm.approval_requests (document_type, document_id);
COMMENT ON INDEX ix_approval_requests__document IS '문서별 결재 요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__requester_id
    ON apm.approval_requests (requester_id);
COMMENT ON INDEX ix_approval_requests__requester_id IS '요청자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__status
    ON apm.approval_requests (status);
COMMENT ON INDEX ix_approval_requests__status IS '상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_requests__created_at
    ON apm.approval_requests (created_at DESC);
COMMENT ON INDEX ix_approval_requests__created_at IS '등록일시 조회 인덱스';

-- approval_histories 인덱스
CREATE INDEX IF NOT EXISTS ix_approval_histories__request_id
    ON apm.approval_histories (request_id, step_no);
COMMENT ON INDEX ix_approval_histories__request_id IS '결재 요청별 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_histories__approver_id
    ON apm.approval_histories (approver_id);
COMMENT ON INDEX ix_approval_histories__approver_id IS '결재자별 이력 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_lines__code
    ON apm.approval_lines (line_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_approval_lines__code IS '결재선 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_requests__code
    ON apm.approval_requests (request_code);
COMMENT ON INDEX ux_approval_requests__code IS '결재 요청 코드 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- approval_line_items 외래키 추가
-- 결재선 참조 외래키 (결재선 삭제 시 항목도 함께 삭제)
ALTER TABLE apm.approval_line_items ADD CONSTRAINT fk_approval_line_items__line_id
    FOREIGN KEY (line_id) REFERENCES apm.approval_lines(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_approval_line_items__line_id ON apm.approval_line_items IS '결재선 참조 외래키 (CASCADE 삭제)';

-- approval_requests 외래키 추가
-- 결재선 참조 외래키 (결재선 삭제 시 NULL로 설정)
ALTER TABLE apm.approval_requests ADD CONSTRAINT fk_approval_requests__line_id
    FOREIGN KEY (line_id) REFERENCES apm.approval_lines(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_approval_requests__line_id ON apm.approval_requests IS '결재선 참조 외래키 (SET NULL)';

-- approval_histories 외래키 추가
-- 결재 요청 참조 외래키 (결재 요청 삭제 시 이력도 함께 삭제)
ALTER TABLE apm.approval_histories ADD CONSTRAINT fk_approval_histories__request_id
    FOREIGN KEY (request_id) REFERENCES apm.approval_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_approval_histories__request_id ON apm.approval_histories IS '결재 요청 참조 외래키 (CASCADE 삭제)';
