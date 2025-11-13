-- =====================================================================================
-- 테이블: fim.accounts_receivable
-- 설명: 매출채권 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_receivable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 매출채권 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 채권 기본 정보
    ar_code                 VARCHAR(50)              NOT NULL,                               -- 매출채권 코드
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자
    
    -- 일자 정보
    receivable_date         DATE                     NOT NULL,                               -- 채권 발생 일자
    payment_due_date        DATE                     NOT NULL,                               -- 결제 예정일
    payment_terms           VARCHAR(50),                                                     -- 결제 조건 (추가)
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                               -- 채권 발생 금액 (세금 포함)
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                              -- 입금된 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                               -- 미수금 잔액
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                              -- 할인 금액 (추가)
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)
    
    -- 참조 정보
    ref_doc_type            VARCHAR(50),                                                     -- 참조 문서 유형
    ref_doc_id              UUID,                                                            -- 참조 문서 식별자
    invoice_no              VARCHAR(100),                                                    -- 송장 번호 (추가)
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태
    last_payment_date       DATE,                                                            -- 최근 입금 일자 (추가)
    overdue_days            INTEGER                  DEFAULT 0,                              -- 연체 일수 (추가)
    
    -- 추심 정보
    collection_status       VARCHAR(20),                                                     -- 추심 상태 (추가)
    collection_notes        TEXT,                                                            -- 추심 메모 (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 상태 체크
    CONSTRAINT ck_accounts_receivable__status   CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED')),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_accounts_receivable__currency CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 금액 유효성 체크
    CONSTRAINT ck_accounts_receivable__amounts  CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0),
    
    -- 미수금 잔액 계산 체크
    CONSTRAINT ck_accounts_receivable__balance  CHECK (outstanding_amount = invoice_amount - paid_amount - discount_amount),
    
    -- 추심 상태 체크
    CONSTRAINT ck_accounts_receivable__collection CHECK (collection_status IS NULL OR collection_status IN ('NORMAL', 'WARNING', 'LEGAL')),
    
    -- 고객 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_accounts_receivable__customer_id FOREIGN KEY (customer_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_accounts_receivable__currency FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.accounts_receivable                         IS '매출채권 정보 관리 테이블';
COMMENT ON COLUMN fim.accounts_receivable.id                      IS '매출채권 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts_receivable.created_at              IS '등록 일시';
COMMENT ON COLUMN fim.accounts_receivable.created_by              IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts_receivable.updated_at              IS '수정 일시';
COMMENT ON COLUMN fim.accounts_receivable.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts_receivable.ar_code                 IS '매출채권 코드';
COMMENT ON COLUMN fim.accounts_receivable.customer_id             IS '고객 식별자';
COMMENT ON COLUMN fim.accounts_receivable.receivable_date         IS '채권 발생 일자';
COMMENT ON COLUMN fim.accounts_receivable.payment_due_date        IS '결제 예정일';
COMMENT ON COLUMN fim.accounts_receivable.payment_terms           IS '결제 조건 (NET30/NET60/COD 등)';
COMMENT ON COLUMN fim.accounts_receivable.invoice_amount          IS '채권 발생 금액 (세금 포함)';
COMMENT ON COLUMN fim.accounts_receivable.tax_amount              IS '세액';
COMMENT ON COLUMN fim.accounts_receivable.paid_amount             IS '입금된 금액';
COMMENT ON COLUMN fim.accounts_receivable.outstanding_amount      IS '미수금 잔액';
COMMENT ON COLUMN fim.accounts_receivable.discount_amount         IS '할인 금액';
COMMENT ON COLUMN fim.accounts_receivable.currency                IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts_receivable.ref_doc_type            IS '참조 문서 유형 (판매전표/세금계산서 등)';
COMMENT ON COLUMN fim.accounts_receivable.ref_doc_id              IS '참조 문서 식별자';
COMMENT ON COLUMN fim.accounts_receivable.invoice_no              IS '송장 번호';
COMMENT ON COLUMN fim.accounts_receivable.status                  IS '상태 (OPEN: 미수/PARTIAL: 부분입금/PAID: 완료/OVERDUE: 연체/CANCELLED: 취소)';
COMMENT ON COLUMN fim.accounts_receivable.last_payment_date       IS '최근 입금 일자';
COMMENT ON COLUMN fim.accounts_receivable.overdue_days            IS '연체 일수';
COMMENT ON COLUMN fim.accounts_receivable.collection_status       IS '추심 상태 (NORMAL: 정상/WARNING: 경고/LEGAL: 법적조치)';
COMMENT ON COLUMN fim.accounts_receivable.collection_notes        IS '추심 메모';
COMMENT ON COLUMN fim.accounts_receivable.is_deleted              IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_accounts_receivable__customer_id ON fim.accounts_receivable IS '고객 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_accounts_receivable__currency ON fim.accounts_receivable IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_accounts_receivable__code
    ON fim.accounts_receivable (ar_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_accounts_receivable__code IS '매출채권 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_accounts_receivable__customer_id
    ON fim.accounts_receivable (customer_id, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_receivable__customer_id IS '고객별 채권 조회 인덱스';

CREATE INDEX ix_accounts_receivable__payment_due_date
    ON fim.accounts_receivable (payment_due_date, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_receivable__payment_due_date IS '만기일 및 상태별 조회 인덱스';

CREATE INDEX ix_accounts_receivable__status
    ON fim.accounts_receivable (status, receivable_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_receivable__status IS '상태별 채권 조회 인덱스';
