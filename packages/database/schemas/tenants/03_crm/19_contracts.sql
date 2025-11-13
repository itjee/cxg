-- =====================================================================================
-- 테이블: crm.contracts
-- 설명: 거래처 계약/약정 관리 테이블 - 거래처와의 계약 조건 관리
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.contracts
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계약 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    -- 거래처 및 계약 기본 정보
    partner_id              UUID                     NOT NULL,                               -- 거래처 식별자
    contract_code           VARCHAR(50)              NOT NULL UNIQUE,                        -- 계약 코드
    contract_type           VARCHAR(30)              NOT NULL,                               -- 계약 유형
    contract_title          VARCHAR(200),                                                    -- 계약 제목

    -- 계약 기간
    contract_date           DATE                     NOT NULL,                               -- 계약 체결일
    start_date              DATE                     NOT NULL,                               -- 계약 시작일
    end_date                DATE,                                                            -- 계약 종료일 (NULL이면 무기한)
    renewal_date            DATE,                                                            -- 갱신 예정일
    is_auto_renewal         BOOLEAN                  DEFAULT false,                          -- 자동 갱신 여부

    -- 계약 금액
    contract_amount         NUMERIC(18,2),                                                   -- 계약 금액
    contract_currency       VARCHAR(3)               DEFAULT 'KRW',                          -- 계약 통화
    payment_terms           VARCHAR(100),                                                    -- 결제 조건

    -- 서명 정보
    signatory_company       VARCHAR(200),                                                    -- 우리 회사 서명자
    signatory_partner       VARCHAR(200),                                                    -- 거래처 서명자

    -- 계약서 문서
    contract_file_path      VARCHAR(500),                                                    -- 계약서 파일 경로
    contract_file_name      VARCHAR(255),                                                    -- 계약서 파일명
    contract_notes          TEXT,                                                            -- 계약 조건/비고

    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 계약 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그

    -- 제약조건
    -- 계약 유형 체크
    CONSTRAINT ck_contracts__contract_type             CHECK (contract_type IN ('PURCHASE', 'SUPPLY', 'AGENCY', 'EXCLUSIVE', 'SERVICE', 'OTHER')),

    -- 계약 코드 형식 체크
    CONSTRAINT ck_contracts__contract_code             CHECK (contract_code ~ '^[A-Z0-9_-]{2,50}$'),

    -- 통화 코드 형식 체크 (ISO 4217)
    CONSTRAINT ck_contracts__currency                  CHECK (contract_currency ~ '^[A-Z]{3}$'),

    -- 계약 금액 양수 체크 (NULL이거나 양수)
    CONSTRAINT ck_contracts__contract_amount           CHECK (contract_amount IS NULL OR contract_amount > 0),

    -- 날짜 순서 체크 (종료일 >= 시작일)
    CONSTRAINT ck_contracts__date_order                CHECK (end_date IS NULL OR end_date >= start_date),

    -- 상태 체크
    CONSTRAINT ck_contracts__status                    CHECK (status IN ('ACTIVE', 'EXPIRED', 'TERMINATED', 'SUSPENDED', 'DRAFT')),

    -- 거래처 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_contracts__partner_id
        FOREIGN KEY (partner_id) REFERENCES crm.partners(id) ON DELETE RESTRICT,

    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_contracts__contract_currency
        FOREIGN KEY (contract_currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT,

    -- 등록자 참조 외래키
    CONSTRAINT fk_contracts__created_by
        FOREIGN KEY (created_by) REFERENCES sys.users(id) ON DELETE SET NULL,

    -- 수정자 참조 외래키
    CONSTRAINT fk_contracts__updated_by
        FOREIGN KEY (updated_by) REFERENCES sys.users(id) ON DELETE SET NULL
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  crm.contracts                          IS '거래처 계약/약정 관리 테이블 - 거래처와의 계약 조건 관리';
COMMENT ON COLUMN crm.contracts.id                       IS '계약 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.contracts.created_at               IS '등록 일시';
COMMENT ON COLUMN crm.contracts.created_by               IS '등록자 UUID';
COMMENT ON COLUMN crm.contracts.updated_at               IS '수정 일시';
COMMENT ON COLUMN crm.contracts.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN crm.contracts.partner_id               IS '거래처 식별자';
COMMENT ON COLUMN crm.contracts.contract_code             IS '계약 코드 (고유)';
COMMENT ON COLUMN crm.contracts.contract_type            IS '계약 유형 (PURCHASE: 구매, SUPPLY: 공급, AGENCY: 대리점, EXCLUSIVE: 배타적, SERVICE: 서비스, OTHER: 기타)';
COMMENT ON COLUMN crm.contracts.contract_title           IS '계약 제목/명칭';
COMMENT ON COLUMN crm.contracts.contract_date            IS '계약 체결일';
COMMENT ON COLUMN crm.contracts.start_date               IS '계약 시작일 (효력 발생일)';
COMMENT ON COLUMN crm.contracts.end_date                 IS '계약 종료일 (NULL이면 무기한)';
COMMENT ON COLUMN crm.contracts.renewal_date             IS '갱신 예정일';
COMMENT ON COLUMN crm.contracts.is_auto_renewal         IS '자동 갱신 여부 (true: 자동갱신, false: 별도 합의 필요)';
COMMENT ON COLUMN crm.contracts.contract_amount          IS '계약 금액';
COMMENT ON COLUMN crm.contracts.contract_currency        IS '계약 통화 (ISO 4217)';
COMMENT ON COLUMN crm.contracts.payment_terms            IS '결제 조건 (예: NET30, COD 등)';
COMMENT ON COLUMN crm.contracts.signatory_company        IS '우리 회사 서명자/담당자';
COMMENT ON COLUMN crm.contracts.signatory_partner        IS '거래처 서명자/담당자';
COMMENT ON COLUMN crm.contracts.contract_file_path       IS '계약서 파일 저장 경로';
COMMENT ON COLUMN crm.contracts.contract_file_name       IS '계약서 파일명';
COMMENT ON COLUMN crm.contracts.contract_notes           IS '계약 조건, 특수 약정, 비고';
COMMENT ON COLUMN crm.contracts.status                   IS '계약 상태 (ACTIVE: 활성, EXPIRED: 만료, TERMINATED: 해지, SUSPENDED: 중단, DRAFT: 작성중)';
COMMENT ON COLUMN crm.contracts.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_contracts__contract_code
    ON crm.contracts (contract_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_contracts__contract_code IS '계약 코드 유니크 인덱스';

-- 일반 인덱스
CREATE INDEX ix_contracts__partner_id
    ON crm.contracts (partner_id, status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__partner_id IS '거래처별 계약 조회 인덱스';

CREATE INDEX ix_contracts__contract_type
    ON crm.contracts (contract_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__contract_type IS '계약 유형별 조회 인덱스';

CREATE INDEX ix_contracts__status
    ON crm.contracts (status, renewal_date)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__status IS '계약 상태별 조회 인덱스';

CREATE INDEX ix_contracts__renewal_date
    ON crm.contracts (renewal_date)
 WHERE renewal_date IS NOT NULL
   AND status = 'ACTIVE'
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__renewal_date IS '갱신 예정일 조회 인덱스';

CREATE INDEX ix_contracts__end_date
    ON crm.contracts (end_date DESC)
 WHERE end_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__end_date IS '종료일 조회 인덱스';

CREATE INDEX ix_contracts__created_at
    ON crm.contracts (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_contracts__created_at IS '등록일시 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건 설명
-- =====================================================================================

COMMENT ON CONSTRAINT fk_contracts__partner_id ON crm.contracts IS '거래처 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_contracts__contract_currency ON crm.contracts IS '통화 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_contracts__created_by ON crm.contracts IS '등록자 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_contracts__updated_by ON crm.contracts IS '수정자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.contracts 테이블 생성
-- =====================================================================================
