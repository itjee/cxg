-- =====================================================================================
-- 테이블: psm.purchase_quotations
-- 설명: 구매 견적 헤더 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS psm.purchase_quotations 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 견적 기본 정보
    quotation_no            VARCHAR(50)              NOT NULL,                               -- 견적 번호
    quotation_date          DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 견적 일자
    pr_id                   UUID,                                                            -- 구매요청 식별자 (선택)
    supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자
    
    -- 견적 상태
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 견적 상태
    valid_from              DATE                     NOT NULL,                               -- 유효 시작일
    valid_to                DATE                     NOT NULL,                               -- 유효 종료일
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 견적 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 배송 및 결제 조건
    delivery_terms          TEXT,                                                            -- 배송 조건
    payment_terms           TEXT,                                                            -- 결제 조건
    notes                   TEXT,                                                            -- 비고
    
    -- 선택 여부
    is_selected             BOOLEAN                  DEFAULT false,                          -- 선택 여부
    selected_at             TIMESTAMP WITH TIME ZONE,                                        -- 선택 일시
    selected_by             UUID,                                                            -- 선택자 UUID
    
    -- 외래키 제약조건
    -- 구매요청 참조 외래키 (선택, 삭제 시 NULL)
    CONSTRAINT fk_purchase_quotations__pr_id        FOREIGN KEY (pr_id) 
                                                    REFERENCES psm.purchase_requisitions(id) 
                                                    ON DELETE SET NULL,
    
    -- 공급업체 참조 외래키 (삭제 불가)
    CONSTRAINT fk_purchase_quotations__supplier_id  FOREIGN KEY (supplier_id) 
                                                    REFERENCES crm.partners(id) 
                                                    ON DELETE RESTRICT,
    
    -- CHECK 제약조건
    -- 견적 상태 체크
    CONSTRAINT ck_purchase_quotations__status       CHECK (status IN ('DRAFT', 'SUBMITTED', 'REVIEWED', 'SELECTED', 'REJECTED', 'EXPIRED')),
    
    -- 유효 기간 체크
    CONSTRAINT ck_purchase_quotations__valid_dates  CHECK (valid_to >= valid_from),
    
    -- 총 금액 음수 불가
    CONSTRAINT ck_purchase_quotations__total_amount CHECK (total_amount >= 0),
    
    -- 통화 코드 체크
    CONSTRAINT ck_purchase_quotations__currency     CHECK (currency ~ '^[A-Z]{3}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  psm.purchase_quotations                   IS '구매 견적 헤더 관리 테이블';
COMMENT ON COLUMN psm.purchase_quotations.id                IS '견적 고유 식별자 (UUID)';
COMMENT ON COLUMN psm.purchase_quotations.created_at        IS '등록 일시';
COMMENT ON COLUMN psm.purchase_quotations.created_by        IS '등록자 UUID';
COMMENT ON COLUMN psm.purchase_quotations.updated_at        IS '수정 일시';
COMMENT ON COLUMN psm.purchase_quotations.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN psm.purchase_quotations.quotation_no      IS '견적 번호 (업체 제공)';
COMMENT ON COLUMN psm.purchase_quotations.quotation_date    IS '견적 일자';
COMMENT ON COLUMN psm.purchase_quotations.pr_id             IS '구매요청 식별자 (견적 요청의 근거)';
COMMENT ON COLUMN psm.purchase_quotations.supplier_id       IS '공급업체 식별자';
COMMENT ON COLUMN psm.purchase_quotations.status            IS '견적 상태 (DRAFT/SUBMITTED/REVIEWED/SELECTED/REJECTED/EXPIRED)';
COMMENT ON COLUMN psm.purchase_quotations.valid_from        IS '견적 유효 시작일';
COMMENT ON COLUMN psm.purchase_quotations.valid_to          IS '견적 유효 종료일';
COMMENT ON COLUMN psm.purchase_quotations.total_amount      IS '총 견적 금액';
COMMENT ON COLUMN psm.purchase_quotations.currency          IS '통화 코드 (KRW, USD 등)';
COMMENT ON COLUMN psm.purchase_quotations.delivery_terms    IS '배송 조건';
COMMENT ON COLUMN psm.purchase_quotations.payment_terms     IS '결제 조건';
COMMENT ON COLUMN psm.purchase_quotations.notes             IS '비고';
COMMENT ON COLUMN psm.purchase_quotations.is_selected       IS '선택 여부 (채택된 견적)';
COMMENT ON COLUMN psm.purchase_quotations.selected_at       IS '선택 일시';
COMMENT ON COLUMN psm.purchase_quotations.selected_by       IS '선택자 UUID';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_quotations__quotation_no
    ON psm.purchase_quotations (quotation_no);
COMMENT ON INDEX psm.ux_purchase_quotations__quotation_no IS '견적 번호 유니크 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_quotations__pr_id
    ON psm.purchase_quotations (pr_id)
 WHERE pr_id IS NOT NULL;
COMMENT ON INDEX psm.ix_purchase_quotations__pr_id IS '구매요청별 견적 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_quotations__supplier_id
    ON psm.purchase_quotations (supplier_id, quotation_date DESC);
COMMENT ON INDEX psm.ix_purchase_quotations__supplier_id IS '공급업체별 견적 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_quotations__status
    ON psm.purchase_quotations (status, quotation_date DESC);
COMMENT ON INDEX psm.ix_purchase_quotations__status IS '상태별 견적 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_quotations__valid_dates
    ON psm.purchase_quotations (valid_from, valid_to)
 WHERE status IN ('SUBMITTED', 'REVIEWED');
COMMENT ON INDEX psm.ix_purchase_quotations__valid_dates IS '유효한 견적 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_quotations__is_selected
    ON psm.purchase_quotations (is_selected, selected_at DESC)
 WHERE is_selected = true;
COMMENT ON INDEX psm.ix_purchase_quotations__is_selected IS '선택된 견적 조회 인덱스';
