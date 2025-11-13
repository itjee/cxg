-- =====================================================================================
-- 테이블: crm.partners
-- 설명: 거래처 마스터 정보 - 고객, 공급업체, 기타 거래처 통합 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - partners 통합 관리로 전환
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.partners 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 거래처 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 거래처 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 거래처 코드 (사내 규칙)
    name                    VARCHAR(200)             NOT NULL,                               -- 거래처명
    name_en                 VARCHAR(200),                                                    -- 거래처명 (영문)
    type                    VARCHAR(20)              NOT NULL,                               -- 거래처 유형
    
    -- 사업자 등록 정보
    tax_no                  VARCHAR(50),                                                     -- 법인등록번호/세무번호
    biz_no                  VARCHAR(20),                                                     -- 사업자등록번호
    biz_name                VARCHAR(200),                                                    -- 상호(법인명)
    biz_type                CHAR(1)                  DEFAULT 'C',                            -- 사업자구분 (C:법인, S:개인)
    biz_kind                VARCHAR(100),                                                    -- 업태
    biz_item                VARCHAR(100),                                                    -- 종목
    ceo_name                VARCHAR(50),                                                     -- 대표자명
    
    -- 주소 정보
    postcode                VARCHAR(10),                                                     -- 우편번호
    address1                VARCHAR(200),                                                    -- 주소1 (기본주소)
    address2                VARCHAR(200),                                                    -- 주소2 (상세주소)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                     -- 거래처 전화번호
    fax                     VARCHAR(50),                                                     -- 팩스번호 (추가)
    email                   VARCHAR(255),                                                    -- 거래처 이메일
    website                 VARCHAR(255),                                                    -- 웹사이트 URL
    
    -- 거래 조건
    payment_terms           VARCHAR(20),                                                     -- 결제 조건
    credit_limit            NUMERIC(18,2)            DEFAULT 0,                              -- 신용 한도
    currency_code           VARCHAR(3)               DEFAULT 'KRW',                          -- 거래 통화
    
    -- 추가 정보
    industry                VARCHAR(100),                                                    -- 산업/업종
    employee_count          INTEGER,                                                         -- 직원 수
    annual_revenue          NUMERIC(18,2),                                                   -- 연매출액
    established_date        DATE,                                                            -- 설립일
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 거래처 코드 형식 체크 (영대문자, 숫자, 언더스코어 2-50자)
    CONSTRAINT ck_partners__code                    CHECK (code ~ '^[A-Z0-9_]{2,50}$'),
    
    -- 거래처 유형 체크
    CONSTRAINT ck_partners__type            CHECK (type IN ('CUSTOMER', 'SUPPLIER', 'BOTH', 'OTHER')),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_partners__email                   CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_partners__phone                   CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_partners__currency_code           CHECK (currency_code ~ '^[A-Z]{3}$'),
    
    -- 신용 한도 양수 체크
    CONSTRAINT ck_partners__credit_limit            CHECK (credit_limit >= 0),
    
    -- 결제 조건 체크
    CONSTRAINT ck_partners__payment_terms           CHECK (payment_terms IS NULL OR payment_terms IN ('COD', 'NET7', 'NET15', 'NET30', 'NET45', 'NET60', 'NET90', 'PREPAID')),
    
    -- 상태 체크
    CONSTRAINT ck_partners__status                  CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  crm.partners                        IS '거래처 마스터 정보 - 고객, 공급업체, 기타 거래처 통합 관리';
COMMENT ON COLUMN crm.partners.id                     IS '거래처 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.partners.created_at             IS '등록 일시';
COMMENT ON COLUMN crm.partners.created_by             IS '등록자 UUID';
COMMENT ON COLUMN crm.partners.updated_at             IS '수정 일시';
COMMENT ON COLUMN crm.partners.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN crm.partners.code                   IS '거래처 코드 (사내 규칙, 영대문자/숫자/언더스코어 2-50자)';
COMMENT ON COLUMN crm.partners.name                   IS '거래처명';
COMMENT ON COLUMN crm.partners.name_en                IS '거래처명 (영문)';
COMMENT ON COLUMN crm.partners.type                   IS '거래처 유형 (CUSTOMER: 매출거래처, SUPPLIER: 매입거래처, BOTH: 겸업, OTHER: 기타)';
COMMENT ON COLUMN crm.partners.tax_no                 IS '법인등록번호/세무번호';
COMMENT ON COLUMN crm.partners.biz_no                 IS '사업자등록번호';
COMMENT ON COLUMN crm.partners.biz_name               IS '상호(법인명)';
COMMENT ON COLUMN crm.partners.biz_type               IS '사업자구분 (C: 법인, S: 개인)';
COMMENT ON COLUMN crm.partners.biz_kind               IS '업태';
COMMENT ON COLUMN crm.partners.biz_item               IS '종목';
COMMENT ON COLUMN crm.partners.ceo_name               IS '대표자명';
COMMENT ON COLUMN crm.partners.postcode               IS '우편번호';
COMMENT ON COLUMN crm.partners.address1               IS '주소1 (기본주소)';
COMMENT ON COLUMN crm.partners.address2               IS '주소2 (상세주소)';
COMMENT ON COLUMN crm.partners.phone                  IS '거래처 전화번호';
COMMENT ON COLUMN crm.partners.fax                    IS '팩스번호';
COMMENT ON COLUMN crm.partners.email                  IS '거래처 이메일';
COMMENT ON COLUMN crm.partners.website                IS '웹사이트 URL';
COMMENT ON COLUMN crm.partners.payment_terms          IS '결제 조건 (COD: 착불, NET7~90: 후불일수, PREPAID: 선불)';
COMMENT ON COLUMN crm.partners.credit_limit           IS '신용 한도';
COMMENT ON COLUMN crm.partners.currency_code          IS '거래 통화 (ISO 4217, 예: KRW, USD)';
COMMENT ON COLUMN crm.partners.industry               IS '산업/업종';
COMMENT ON COLUMN crm.partners.employee_count         IS '직원 수';
COMMENT ON COLUMN crm.partners.annual_revenue         IS '연매출액';
COMMENT ON COLUMN crm.partners.established_date       IS '설립일';
COMMENT ON COLUMN crm.partners.status                 IS '상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지, CLOSED: 폐쇄)';
COMMENT ON COLUMN crm.partners.is_deleted             IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_partners__code 
    ON crm.partners (code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_partners__code IS '거래처 코드 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_partners__biz_no 
    ON crm.partners (biz_no)
 WHERE biz_no IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_partners__biz_no IS '사업자등록번호 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_partners__name 
    ON crm.partners (name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partners__name IS '거래처명 조회 인덱스';

CREATE INDEX ix_partners__type 
    ON crm.partners (type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partners__type IS '거래처 유형별 조회 인덱스';

CREATE INDEX ix_partners__biz_type 
    ON crm.partners (biz_type)
 WHERE biz_type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partners__biz_type IS '사업자유형별 조회 인덱스';

CREATE INDEX ix_partners__biz_kind 
    ON crm.partners (biz_kind)
 WHERE biz_kind IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partners__biz_kind IS '업태별 조회 인덱스';

CREATE INDEX ix_partners__payment_terms 
    ON crm.partners (payment_terms)
 WHERE payment_terms IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partners__payment_terms IS '결제 조건별 조회 인덱스';

CREATE INDEX ix_partners__industry 
    ON crm.partners (industry)
 WHERE industry IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partners__industry IS '산업/업종별 조회 인덱스';

CREATE INDEX ix_partners__status 
    ON crm.partners (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partners__status IS '상태별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 통화 코드 참조
ALTER TABLE crm.partners 
  ADD CONSTRAINT fk_partners__currency_code
    FOREIGN KEY (currency_code) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_partners__currency_code ON crm.partners IS '통화 코드 참조 외래키 (RESTRICT 삭제)';
