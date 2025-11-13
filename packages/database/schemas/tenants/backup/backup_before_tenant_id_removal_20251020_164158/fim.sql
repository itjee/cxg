-- ============================================================================
-- Financial Management Schema (fim)
-- ============================================================================
-- Description: 재무 관리 (회계, 원가, 예산, 결산)
-- Database: tnnt_db (Tenant Database)
-- Schema: fim
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS fim;

COMMENT ON SCHEMA fim IS 'FIM: 재무 관리 스키마 (회계, 원가, 예산)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- FIM: 재무/관리회계 (Finance & Controlling)
-- ============================================================================

-- =====================================================================================
-- 테이블: fim.accounts
-- 설명: 계정과목 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 계정과목 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    account_code            VARCHAR(50)              NOT NULL,                                  -- 계정과목 코드
    account_name            VARCHAR(200)             NOT NULL,                                  -- 계정과목명
    account_type            VARCHAR(20)              NOT NULL,                                  -- 계정 유형
    account_group           VARCHAR(50),                                                        -- 계정 그룹
    parent_account_id       UUID,                                                               -- 상위 계정과목 식별자
    
    -- 설정 정보
    is_control_account      BOOLEAN                  DEFAULT false,                             -- 통제계정 여부
    is_posting_allowed      BOOLEAN                  DEFAULT true,                              -- 전기 허용 여부
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                              -- 활성화 상태
    is_deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_accounts__account_type            CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'))
);

-- =====================================================================================
-- 테이블: fim.journal_entries
-- 설명: 분개장 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entries 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 분개장 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    je_code                 VARCHAR(50)              NOT NULL,                                  -- 분개장 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    posting_date            DATE                     NOT NULL,                                  -- 전기 일자
    period                  VARCHAR(7)               NOT NULL,                                  -- 회계 기간 (YYYY-MM)
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                        -- 참조 문서 유형
    reference_doc_id        UUID,                                                               -- 참조 문서 식별자
    description             TEXT,                                                               -- 적요
    
    -- 금액 정보
    total_debit             NUMERIC(18,4)            DEFAULT 0,                                 -- 차변 합계
    total_credit            NUMERIC(18,4)            DEFAULT 0,                                 -- 대변 합계
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    posted_at               TIMESTAMP WITH TIME ZONE,                                           -- 전기 일시
    posted_by               UUID,                                                               -- 전기자 식별자
    is_deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_journal_entries__status           CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED', 'CANCELLED')),
    CONSTRAINT ck_journal_entries__amounts          CHECK (total_debit >= 0 AND total_credit >= 0)
);

-- =====================================================================================
-- 테이블: fim.journal_entry_lines
-- 설명: 분개장 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entry_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 분개 라인 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    je_id                   UUID                     NOT NULL,                                  -- 분개장 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    account_id              UUID                     NOT NULL,                                  -- 계정과목 식별자
    
    -- 금액 정보
    debit_amount            NUMERIC(18,4)            DEFAULT 0,                                 -- 차변 금액
    credit_amount           NUMERIC(18,4)            DEFAULT 0,                                 -- 대변 금액
    description             TEXT,                                                               -- 적요
    
    -- 분석 정보
    cost_center             VARCHAR(50),                                                        -- 원가센터
    project_code            VARCHAR(50),                                                        -- 프로젝트 코드
    partner_id              UUID,                                                               -- 거래처 식별자
    
    -- 제약조건
    CONSTRAINT ck_journal_entry_lines__amounts      CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CONSTRAINT ck_journal_entry_lines__line_no      CHECK (line_no > 0)
);

-- =====================================================================================
-- 테이블: fim.accounts_receivable
-- 설명: 매출채권 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_receivable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 매출채권 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    ar_code                 VARCHAR(50)              NOT NULL,                                  -- 매출채권 코드
    customer_id             UUID                     NOT NULL,                                  -- 고객 식별자
    
    -- 일자 정보
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    due_date                DATE                     NOT NULL,                                  -- 만기일
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                                  -- 청구 금액
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                                 -- 입금 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                                  -- 미수금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'OPEN',                            -- 상태
    reference_doc_type      VARCHAR(50),                                                        -- 참조 문서 유형
    reference_doc_id        UUID,                                                               -- 참조 문서 식별자
    
    -- 제약조건
    CONSTRAINT ck_accounts_receivable__status       CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'OVERDUE', 'WRITTEN_OFF')),
    CONSTRAINT ck_accounts_receivable__amounts      CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0)
);

-- =====================================================================================
-- 테이블: fim.accounts_payable
-- 설명: 매입채무 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts_payable 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 매입채무 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    ap_code                 VARCHAR(50)              NOT NULL,                                  -- 매입채무 코드
    vendor_id               UUID                     NOT NULL,                                  -- 공급업체 식별자
    
    -- 일자 정보
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    due_date                DATE                     NOT NULL,                                  -- 지급기한
    
    -- 금액 정보
    invoice_amount          NUMERIC(18,4)            NOT NULL,                                  -- 청구 금액
    paid_amount             NUMERIC(18,4)            DEFAULT 0,                                 -- 지급 금액
    outstanding_amount      NUMERIC(18,4)            NOT NULL,                                  -- 미지급금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'OPEN',                            -- 상태
    reference_doc_type      VARCHAR(50),                                                        -- 참조 문서 유형
    reference_doc_id        UUID,                                                               -- 참조 문서 식별자
    
    -- 제약조건
    CONSTRAINT ck_accounts_payable__status          CHECK (status IN ('OPEN', 'PARTIAL', 'PAID', 'OVERDUE')),
    CONSTRAINT ck_accounts_payable__amounts         CHECK (invoice_amount >= 0 AND paid_amount >= 0 AND outstanding_amount >= 0)
);

-- =====================================================================================
-- 테이블: fim.payment_transactions
-- 설명: 결제 거래 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.payment_transactions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 거래 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    transaction_code        VARCHAR(50)              NOT NULL,                                  -- 거래 코드
    transaction_date        DATE                     NOT NULL,                                  -- 거래 일자
    transaction_type        VARCHAR(20)              NOT NULL,                                  -- 거래 유형
    payment_method          VARCHAR(20)              NOT NULL,                                  -- 결제 수단
    
    -- 거래 상대방 정보
    partner_id              UUID                     NOT NULL,                                  -- 거래처 식별자
    account_id              UUID                     NOT NULL,                                  -- 계정과목 식별자
    
    -- 금액 정보
    amount                  NUMERIC(18,4)            NOT NULL,                                  -- 거래 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                        -- 참조 문서 유형
    reference_doc_id        UUID,                                                               -- 참조 문서 식별자
    description             TEXT,                                                               -- 적요
    
    -- 결제 상세
    bank_account            VARCHAR(50),                                                        -- 은행 계좌
    check_number            VARCHAR(50),                                                        -- 수표 번호
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'COMPLETED',                       -- 상태
    
    -- 제약조건
    CONSTRAINT ck_payment_transactions__type        CHECK (transaction_type IN ('RECEIPT', 'PAYMENT')),
    CONSTRAINT ck_payment_transactions__method      CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'OTHER')),
    CONSTRAINT ck_payment_transactions__status      CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
    CONSTRAINT ck_payment_transactions__amount      CHECK (amount >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  fim.accounts                             IS '계정과목 관리 테이블';
COMMENT ON TABLE  fim.journal_entries                      IS '분개장 헤더 관리 테이블';
COMMENT ON TABLE  fim.journal_entry_lines                  IS '분개장 라인 관리 테이블';
COMMENT ON TABLE  fim.accounts_receivable                  IS '매출채권 관리 테이블';
COMMENT ON TABLE  fim.accounts_payable                     IS '매입채무 관리 테이블';
COMMENT ON TABLE  fim.payment_transactions                 IS '결제 거래 관리 테이블';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_accounts__tenant_id ON fim.accounts (tenant_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_accounts__company_id ON fim.accounts (company_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_accounts__account_code ON fim.accounts (account_code) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_accounts__account_type ON fim.accounts (account_type) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_accounts__is_active ON fim.accounts (is_active) WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_journal_entries__tenant_id ON fim.journal_entries (tenant_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_journal_entries__company_id ON fim.journal_entries (company_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_journal_entries__je_code ON fim.journal_entries (je_code) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_journal_entries__period ON fim.journal_entries (period) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS ix_journal_entries__status ON fim.journal_entries (status) WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_journal_entry_lines__je_id ON fim.journal_entry_lines (je_id);
CREATE INDEX IF NOT EXISTS ix_journal_entry_lines__account_id ON fim.journal_entry_lines (account_id);

CREATE INDEX IF NOT EXISTS ix_accounts_receivable__tenant_id ON fim.accounts_receivable (tenant_id);
CREATE INDEX IF NOT EXISTS ix_accounts_receivable__company_id ON fim.accounts_receivable (company_id);
CREATE INDEX IF NOT EXISTS ix_accounts_receivable__customer_id ON fim.accounts_receivable (customer_id);
CREATE INDEX IF NOT EXISTS ix_accounts_receivable__status ON fim.accounts_receivable (status);
CREATE INDEX IF NOT EXISTS ix_accounts_receivable__due_date ON fim.accounts_receivable (due_date);

CREATE INDEX IF NOT EXISTS ix_accounts_payable__tenant_id ON fim.accounts_payable (tenant_id);
CREATE INDEX IF NOT EXISTS ix_accounts_payable__company_id ON fim.accounts_payable (company_id);
CREATE INDEX IF NOT EXISTS ix_accounts_payable__vendor_id ON fim.accounts_payable (vendor_id);
CREATE INDEX IF NOT EXISTS ix_accounts_payable__status ON fim.accounts_payable (status);
CREATE INDEX IF NOT EXISTS ix_accounts_payable__due_date ON fim.accounts_payable (due_date);

CREATE INDEX IF NOT EXISTS ix_payment_transactions__tenant_id ON fim.payment_transactions (tenant_id);
CREATE INDEX IF NOT EXISTS ix_payment_transactions__company_id ON fim.payment_transactions (company_id);
CREATE INDEX IF NOT EXISTS ix_payment_transactions__transaction_date ON fim.payment_transactions (transaction_date);
CREATE INDEX IF NOT EXISTS ix_payment_transactions__transaction_type ON fim.payment_transactions (transaction_type);
CREATE INDEX IF NOT EXISTS ix_payment_transactions__status ON fim.payment_transactions (status);

-- =====================================================================================
-- 유니크 제약 조건
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts__company_code ON fim.accounts (company_id, account_code) WHERE is_deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_journal_entries__company_code ON fim.journal_entries (company_id, je_code) WHERE is_deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_journal_entry_lines__je_line ON fim.journal_entry_lines (je_id, line_no);
CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_receivable__company_code ON fim.accounts_receivable (company_id, ar_code);
CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_payable__company_code ON fim.accounts_payable (company_id, ap_code);
CREATE UNIQUE INDEX IF NOT EXISTS ux_payment_transactions__company_code ON fim.payment_transactions (company_id, transaction_code);

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

ALTER TABLE fim.journal_entry_lines ADD CONSTRAINT fk_journal_entry_lines__je_id
    FOREIGN KEY (je_id) REFERENCES fim.journal_entries(id) ON DELETE CASCADE;

ALTER TABLE fim.journal_entry_lines ADD CONSTRAINT fk_journal_entry_lines__account_id
    FOREIGN KEY (account_id) REFERENCES fim.accounts(id) ON DELETE RESTRICT;
