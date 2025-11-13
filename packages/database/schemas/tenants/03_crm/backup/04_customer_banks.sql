-- =====================================================================================
-- 테이블: crm.customer_banks
-- 설명: 거래처 계좌 정보 관리 테이블 - 입출금 계좌 정보
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_banks 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계좌정보 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 계좌 기본 정보
    customer_id             UUID                     NOT NULL,                               -- 거래처 식별자
    account_type            VARCHAR(20)              NOT NULL,                               -- 계좌 유형
    bank_code               VARCHAR(10)              NOT NULL,                               -- 은행 코드
    bank_name               VARCHAR(100),                                                    -- 은행명
    
    -- 계좌 상세 정보
    account_no              VARCHAR(50)              NOT NULL,                               -- 계좌번호
    account_holder          VARCHAR(100)             NOT NULL,                               -- 예금주명
    account_name            VARCHAR(100),                                                    -- 계좌별칭
    
    -- 계좌 설정
    is_primary              BOOLEAN                  NOT NULL DEFAULT false,                 -- 주계좌 여부
    is_receive              BOOLEAN                  NOT NULL DEFAULT false,                 -- 기본 입금계좌 여부
    is_payment              BOOLEAN                  NOT NULL DEFAULT false,                 -- 기본 지급계좌 여부
    
    -- 추가 정보
    swift_code              VARCHAR(20),                                                     -- SWIFT 코드 (해외송금용)
    branch_code             VARCHAR(20),                                                     -- 지점 코드
    branch_name             VARCHAR(100),                                                    -- 지점명
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 계좌 유형 체크
    CONSTRAINT ck_customer_banks__account_type      CHECK (account_type IN ('CHECKING', 'SAVINGS', 'FOREIGN_CURRENCY', 'ESCROW', 'TRUST', 'OTHER')),
    
    -- 은행 코드 형식 체크 (영대문자, 숫자 3-10자)
    CONSTRAINT ck_customer_banks__bank_code         CHECK (bank_code ~ '^[A-Z0-9]{3,10}$'),
    
    -- 계좌번호 형식 체크 (숫자, 하이픈 5-50자)
    CONSTRAINT ck_customer_banks__account_no        CHECK (account_no ~ '^[0-9\-]{5,50}$'),
    
    -- SWIFT 코드 형식 체크 (8자리 또는 11자리)
    CONSTRAINT ck_customer_banks__swift_code        CHECK (swift_code IS NULL OR swift_code ~ '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$'),
    
    -- 상태 체크
    CONSTRAINT ck_customer_banks__status            CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_banks                     IS '거래처 계좌 정보 관리 테이블 - 입출금 계좌 정보';
COMMENT ON COLUMN crm.customer_banks.id                  IS '계좌정보 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_banks.created_at          IS '등록 일시';
COMMENT ON COLUMN crm.customer_banks.created_by          IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_banks.updated_at          IS '수정 일시';
COMMENT ON COLUMN crm.customer_banks.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_banks.customer_id         IS '거래처 식별자';
COMMENT ON COLUMN crm.customer_banks.account_type        IS '계좌 유형 (CHECKING: 당좌, SAVINGS: 보통, FOREIGN_CURRENCY: 외화, ESCROW: 에스크로, TRUST: 신탁, OTHER: 기타)';
COMMENT ON COLUMN crm.customer_banks.bank_code           IS '은행 코드';
COMMENT ON COLUMN crm.customer_banks.bank_name           IS '은행명';
COMMENT ON COLUMN crm.customer_banks.account_no          IS '계좌번호';
COMMENT ON COLUMN crm.customer_banks.account_holder      IS '예금주명';
COMMENT ON COLUMN crm.customer_banks.account_name        IS '계좌별칭';
COMMENT ON COLUMN crm.customer_banks.is_primary          IS '주계좌 여부';
COMMENT ON COLUMN crm.customer_banks.is_receive          IS '기본 입금계좌 여부';
COMMENT ON COLUMN crm.customer_banks.is_payment          IS '기본 지급계좌 여부';
COMMENT ON COLUMN crm.customer_banks.swift_code          IS 'SWIFT 코드 (해외송금용, 8자리 또는 11자리)';
COMMENT ON COLUMN crm.customer_banks.branch_code         IS '지점 코드';
COMMENT ON COLUMN crm.customer_banks.branch_name         IS '지점명';
COMMENT ON COLUMN crm.customer_banks.notes               IS '비고';
COMMENT ON COLUMN crm.customer_banks.status              IS '상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)';
COMMENT ON COLUMN crm.customer_banks.is_deleted          IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_customer_banks__customer_account 
    ON crm.customer_banks (customer_id, account_no)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_customer_banks__customer_account IS '거래처별 계좌번호 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_banks__customer_primary 
    ON crm.customer_banks (customer_id)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_banks__customer_primary IS '거래처별 주계좌 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_banks__customer_default_receive 
    ON crm.customer_banks (customer_id)
 WHERE is_receive = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_banks__customer_default_receive IS '거래처별 기본 입금계좌 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_banks__customer_default_payment 
    ON crm.customer_banks (customer_id)
 WHERE is_payment = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_banks__customer_default_payment IS '거래처별 기본 지급계좌 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_customer_banks__customer_id 
    ON crm.customer_banks (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_banks__customer_id IS '거래처별 계좌 조회 인덱스';

CREATE INDEX ix_customer_banks__bank_code 
    ON crm.customer_banks (bank_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_banks__bank_code IS '은행별 조회 인덱스';

CREATE INDEX ix_customer_banks__account_type 
    ON crm.customer_banks (account_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_banks__account_type IS '계좌 유형별 조회 인덱스';

CREATE INDEX ix_customer_banks__status 
    ON crm.customer_banks (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_banks__status IS '상태별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조
ALTER TABLE crm.customer_banks 
  ADD CONSTRAINT fk_customer_banks__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.customers(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_customer_banks__customer_id ON crm.customer_banks IS '거래처 참조 외래키 (CASCADE 삭제)';
