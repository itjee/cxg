-- =====================================================================================
-- 테이블: fim.accounts_payable
-- 설명: 매입채무 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_payable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 매입채무 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 채무 기본 정보
    ap_code                 VARCHAR(50)              NOT NULL,                               -- 매입채무 코드
    supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자
    
    -- 일자 정보
    payable_date            DATE                     NOT NULL,                               -- 채무 발생 일자
    payment_due_date        DATE                     NOT NULL,                               -- 지급 예정일
    payment_terms           VARCHAR(50),                                                     -- 지급 조건 (추가)
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                               -- 채무 발생 금액 (세금 포함)
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                              -- 지급된 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                               -- 미지급금 잔액
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                              -- 할인 금액 (추가)
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)
    
    -- 참조 정보
    ref_doc_type            VARCHAR(50),                                                     -- 참조 문서 유형
    ref_doc_id              UUID,                                                            -- 참조 문서 식별자
    invoice_no              VARCHAR(100),                                                    -- 송장 번호 (추가)
    
    -- 상태 정보
    status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태
    last_payment_date       DATE,                                                            -- 최근 지급 일자 (추가)
    overdue_days            INTEGER                  DEFAULT 0,                              -- 연체 일수 (추가)
    
    -- 승인 정보
    approval_status         VARCHAR(20)              DEFAULT 'PENDING',                      -- 승인 상태 (추가)
    approved_by             UUID,                                                            -- 승인자 UUID (추가)
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 상태 체크
    CONSTRAINT ck_accounts_payable__status      CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED')),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_accounts_payable__currency    CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 금액 유효성 체크
    CONSTRAINT ck_accounts_payable__amounts     CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0),
    
    -- 미지급금 잔액 계산 체크
    CONSTRAINT ck_accounts_payable__balance     CHECK (outstanding_amount = invoice_amount - paid_amount - discount_amount),
    
    -- 승인 상태 체크
    CONSTRAINT ck_accounts_payable__approval    CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    -- 공급업체 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_accounts_payable__supplier_id   FOREIGN KEY (supplier_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_accounts_payable__currency    FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.accounts_payable                            IS '매입채무 정보 관리 테이블';
COMMENT ON COLUMN fim.accounts_payable.id                         IS '매입채무 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts_payable.created_at                 IS '등록 일시';
COMMENT ON COLUMN fim.accounts_payable.created_by                 IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts_payable.updated_at                 IS '수정 일시';
COMMENT ON COLUMN fim.accounts_payable.updated_by                 IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts_payable.ap_code                    IS '매입채무 코드';
COMMENT ON COLUMN fim.accounts_payable.supplier_id                  IS '공급업체 식별자';
COMMENT ON COLUMN fim.accounts_payable.payable_date                   IS '채무 발생 일자';
COMMENT ON COLUMN fim.accounts_payable.payment_due_date                   IS '지급 예정일';
COMMENT ON COLUMN fim.accounts_payable.payment_terms              IS '지급 조건 (NET30/NET60/COD 등)';
COMMENT ON COLUMN fim.accounts_payable.invoice_amount             IS '채무 발생 금액 (세금 포함)';
COMMENT ON COLUMN fim.accounts_payable.tax_amount                 IS '세액';
COMMENT ON COLUMN fim.accounts_payable.paid_amount                IS '지급된 금액';
COMMENT ON COLUMN fim.accounts_payable.outstanding_amount         IS '미지급금 잔액';
COMMENT ON COLUMN fim.accounts_payable.discount_amount            IS '할인 금액';
COMMENT ON COLUMN fim.accounts_payable.currency                   IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts_payable.ref_doc_type         IS '참조 문서 유형 (구매전표/세금계산서 등)';
COMMENT ON COLUMN fim.accounts_payable.ref_doc_id           IS '참조 문서 식별자';
COMMENT ON COLUMN fim.accounts_payable.invoice_no             IS '송장 번호';
COMMENT ON COLUMN fim.accounts_payable.status                     IS '상태 (OPEN: 미지급/PARTIAL: 부분지급/PAID: 완료/OVERDUE: 연체/CANCELLED: 취소)';
COMMENT ON COLUMN fim.accounts_payable.last_payment_date          IS '최근 지급 일자';
COMMENT ON COLUMN fim.accounts_payable.overdue_days               IS '연체 일수';
COMMENT ON COLUMN fim.accounts_payable.approval_status            IS '승인 상태 (PENDING: 대기/APPROVED: 승인/REJECTED: 반려)';
COMMENT ON COLUMN fim.accounts_payable.approved_by                IS '승인자 UUID';
COMMENT ON COLUMN fim.accounts_payable.approved_at                IS '승인 일시';
COMMENT ON COLUMN fim.accounts_payable.is_deleted                 IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_accounts_payable__supplier_id ON fim.accounts_payable IS '공급업체 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_accounts_payable__currency ON fim.accounts_payable IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_accounts_payable__code
    ON fim.accounts_payable (ap_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_accounts_payable__code IS '매입채무 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_accounts_payable__supplier_id
    ON fim.accounts_payable (supplier_id, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_payable__supplier_id IS '공급업체별 채무 조회 인덱스';

CREATE INDEX ix_accounts_payable__payment_due_date
    ON fim.accounts_payable (payment_due_date, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_payable__payment_due_date IS '만기일 및 상태별 조회 인덱스';

CREATE INDEX ix_accounts_payable__status
    ON fim.accounts_payable (status, payable_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts_payable__status IS '상태별 채무 조회 인덱스';
