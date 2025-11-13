-- =====================================================================================
-- 테이블: psm.purchase_requisitions
-- 설명: 구매요청 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_requisitions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 구매요청 기본 정보
    pr_code                 VARCHAR(50)              NOT NULL,                               -- 구매요청 코드
    request_date            DATE                     NOT NULL,                               -- 전표 일자
    requester_id            UUID                     NOT NULL,                               -- 요청자 식별자
    department_id           UUID,                                                            -- 부서 식별자
    required_date           DATE,                                                            -- 필요 일자
    purpose                 TEXT,                                                            -- 구매 목적
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    approved_by             UUID,                                                            -- 승인자 UUID
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약조건
    -- 요청자 참조 외래키 (삭제 불가)
    CONSTRAINT fk_purchase_requisitions__requester_id   FOREIGN KEY (requester_id) 
                                                        REFERENCES hrm.employees(id) 
                                                        ON DELETE RESTRICT,
    
    -- 부서 참조 외래키 (부서 삭제 시 NULL)
    CONSTRAINT fk_purchase_requisitions__department_id  FOREIGN KEY (department_id) 
                                                        REFERENCES hrm.departments(id) 
                                                        ON DELETE SET NULL,
    
    -- 승인자 참조 외래키 (승인자 삭제 시 NULL)
    CONSTRAINT fk_purchase_requisitions__approved_by    FOREIGN KEY (approved_by) 
                                                        REFERENCES hrm.employees(id) 
                                                        ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 상태 체크 (DRAFT: 임시저장, SUBMITTED: 제출, APPROVED: 승인, REJECTED: 반려, ORDERED: 발주완료)
    CONSTRAINT ck_purchase_requisitions__status         CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ORDERED')),
    
    -- 총 금액 음수 불가
    CONSTRAINT ck_purchase_requisitions__total_amount   CHECK (total_amount >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_purchase_requisitions__currency       CHECK (currency ~ '^[A-Z]{3}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================


COMMENT ON TABLE  psm.purchase_requisitions                  IS '구매요청 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_requisitions.id               IS '구매요청 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_requisitions.created_at       IS '등록 일시';
COMMENT ON COLUMN psm.purchase_requisitions.created_by       IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.updated_at       IS '수정 일시';
COMMENT ON COLUMN psm.purchase_requisitions.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.pr_code          IS '구매요청 코드 (PR-YYYYMMDD-001)';
COMMENT ON COLUMN psm.purchase_requisitions.request_date         IS '전표 일자';
COMMENT ON COLUMN psm.purchase_requisitions.requester_id     IS '요청자 식별자';
COMMENT ON COLUMN psm.purchase_requisitions.department_id    IS '부서 식별자';
COMMENT ON COLUMN psm.purchase_requisitions.required_date    IS '필요 일자 (납품 요청일)';
COMMENT ON COLUMN psm.purchase_requisitions.purpose          IS '구매 목적';
COMMENT ON COLUMN psm.purchase_requisitions.total_amount     IS '총 금액 (모든 라인의 합계)';
COMMENT ON COLUMN psm.purchase_requisitions.currency         IS '통화 (ISO 4217 - KRW/USD/JPY 등)';
COMMENT ON COLUMN psm.purchase_requisitions.status           IS '상태 (DRAFT/SUBMITTED/APPROVED/REJECTED/ORDERED)';
COMMENT ON COLUMN psm.purchase_requisitions.approved_at      IS '승인 일시';
COMMENT ON COLUMN psm.purchase_requisitions.approved_by      IS '승인자 UUID';
COMMENT ON COLUMN psm.purchase_requisitions.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__pr_code
    ON psm.purchase_requisitions (pr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__pr_code IS '구매요청 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__requester_id
    ON psm.purchase_requisitions (requester_id)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__requester_id IS '요청자별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__department_id
    ON psm.purchase_requisitions (department_id)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__department_id IS '부서별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__status
    ON psm.purchase_requisitions (status)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__status IS '상태별 구매요청 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__request_date
    ON psm.purchase_requisitions (request_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__request_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__required_date
    ON psm.purchase_requisitions (required_date)
 WHERE required_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX psm.ix_purchase_requisitions__required_date IS '필요 일자별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisitions__pr_code
    ON psm.purchase_requisitions (pr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX psm.ux_purchase_requisitions__pr_code IS '구매요청 코드 유니크 제약 (논리 삭제 제외)';