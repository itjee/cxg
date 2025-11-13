-- =====================================================================================
-- 테이블: fim.accounts
-- 설명: 회계 계정과목 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.accounts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계정과목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 계정과목 기본 정보
    account_code            VARCHAR(50)              NOT NULL,                               -- 계정과목 코드
    account_name            VARCHAR(200)             NOT NULL,                               -- 계정과목 명칭
    account_name_en         VARCHAR(200),                                                    -- 계정과목 영문명 (추가)
    
    -- 계정 분류
    account_type            VARCHAR(20)              NOT NULL,                               -- 계정 유형
    account_group           VARCHAR(50),                                                     -- 계정 그룹
    account_class           VARCHAR(50),                                                     -- 계정 분류 (추가)
    
    -- 계층 구조
    parent_id               UUID,                                                            -- 상위 계정과목 식별자
    level_depth             INTEGER                  DEFAULT 1,                              -- 계층 깊이 (추가)
    full_path               VARCHAR(500),                                                    -- 전체 경로 (추가)
    
    -- 계정 속성
    is_control_account      BOOLEAN                  DEFAULT false,                          -- 통제계정 여부
    is_posting_allowed      BOOLEAN                  DEFAULT true,                           -- 전기 허용 여부
    is_bank_account         BOOLEAN                  DEFAULT false,                          -- 은행계정 여부 (추가)
    is_cash_account         BOOLEAN                  DEFAULT false,                          -- 현금계정 여부 (추가)
    
    -- 통화 및 재무제표
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 기본 통화 (ISO 4217)
    fs_position             VARCHAR(50),                                                     -- 재무제표 표시 위치 (추가)
    statement_order         INTEGER                  DEFAULT 0,                              -- 재무제표 표시 순서 (추가)
    
    -- 세무 정보
    tax_category            VARCHAR(20),                                                     -- 세금 분류 (추가)
    tax_code                VARCHAR(20),                                                     -- 세금 코드 (추가)
    
    -- 추가 정보
    description             TEXT,                                                            -- 계정 설명
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 사용 여부
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 계정 유형 체크
    CONSTRAINT ck_accounts__account_type        CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_accounts__currency            CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_accounts__level_depth         CHECK (level_depth BETWEEN 1 AND 10),
    
    -- 표시 순서 양수 체크
    CONSTRAINT ck_accounts__statement_order     CHECK (statement_order >= 0),
    
    -- 자기 참조 방지 체크
    CONSTRAINT ck_accounts__parent_not_self     CHECK (parent_id != id),
    
    -- 상위 계정과목 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_accounts__parent_id   FOREIGN KEY (parent_id) REFERENCES fim.accounts(id) ON DELETE CASCADE,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_accounts__currency            FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.accounts                   IS '회계 계정과목 정보 관리 테이블 (자산, 부채, 자본, 수익, 비용)';
COMMENT ON COLUMN fim.accounts.id                IS '계정과목 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.accounts.created_at        IS '등록 일시';
COMMENT ON COLUMN fim.accounts.created_by        IS '등록자 UUID';
COMMENT ON COLUMN fim.accounts.updated_at        IS '수정 일시';
COMMENT ON COLUMN fim.accounts.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN fim.accounts.account_code      IS '계정과목 코드';
COMMENT ON COLUMN fim.accounts.account_name      IS '계정과목 명칭';
COMMENT ON COLUMN fim.accounts.account_name_en   IS '계정과목 영문명';
COMMENT ON COLUMN fim.accounts.account_type      IS '계정 유형 (ASSET: 자산/LIABILITY: 부채/EQUITY: 자본/REVENUE: 수익/EXPENSE: 비용)';
COMMENT ON COLUMN fim.accounts.account_group     IS '계정 그룹 (유동자산/비유동자산/영업수익/영업외수익 등)';
COMMENT ON COLUMN fim.accounts.account_class     IS '계정 분류 (현금성자산/매출채권/재고자산 등)';
COMMENT ON COLUMN fim.accounts.parent_id IS '상위 계정과목 식별자 (계층구조)';
COMMENT ON COLUMN fim.accounts.level_depth       IS '계층 깊이 (1=대분류, 2=중분류, 3=소분류)';
COMMENT ON COLUMN fim.accounts.full_path         IS '전체 경로';
COMMENT ON COLUMN fim.accounts.is_control_account IS '통제계정 여부 (하위계정 관리)';
COMMENT ON COLUMN fim.accounts.is_posting_allowed IS '전기 허용 여부';
COMMENT ON COLUMN fim.accounts.is_bank_account   IS '은행계정 여부';
COMMENT ON COLUMN fim.accounts.is_cash_account   IS '현금계정 여부';
COMMENT ON COLUMN fim.accounts.currency          IS '기본 통화 (ISO 4217)';
COMMENT ON COLUMN fim.accounts.fs_position       IS '재무제표 표시 위치';
COMMENT ON COLUMN fim.accounts.statement_order   IS '재무제표 표시 순서';
COMMENT ON COLUMN fim.accounts.tax_category      IS '세금 분류';
COMMENT ON COLUMN fim.accounts.tax_code          IS '세금 코드';
COMMENT ON COLUMN fim.accounts.description       IS '계정 설명';
COMMENT ON COLUMN fim.accounts.notes             IS '비고';
COMMENT ON COLUMN fim.accounts.is_active         IS '사용 여부';
COMMENT ON COLUMN fim.accounts.is_deleted        IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_accounts__parent_id ON fim.accounts IS '상위 계정과목 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_accounts__currency ON fim.accounts IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_accounts__code
    ON fim.accounts (account_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_accounts__code IS '계정과목 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_accounts__account_name
    ON fim.accounts (account_name)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts__account_name IS '계정과목명 조회 인덱스';

CREATE INDEX ix_accounts__account_type
    ON fim.accounts (account_type, account_group)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts__account_type IS '계정 유형 및 그룹별 조회 인덱스';

CREATE INDEX ix_accounts__parent_id
    ON fim.accounts (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts__parent_id IS '상위 계정과목별 조회 인덱스';

CREATE INDEX ix_accounts__is_active
    ON fim.accounts (is_active, account_type)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_accounts__is_active IS '사용 여부 및 계정 유형별 조회 인덱스';
