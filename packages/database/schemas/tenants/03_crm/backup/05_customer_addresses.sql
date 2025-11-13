-- =====================================================================================
-- 테이블: crm.customer_addresses
-- 설명: 거래처 주소 정보 관리 테이블 - 배송지/청구지 등 주소 정보
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_addresses 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 주소정보 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 주소 기본 정보
    customer_id             UUID                     NOT NULL,                               -- 거래처 식별자
    address_type            VARCHAR(20)              NOT NULL,                               -- 주소 유형
    name                    VARCHAR(100),                                                    -- 주소 별칭 (추가 - 짧은 네이밍)
    
    -- 주소 정보
    postcode                VARCHAR(20),                                                     -- 우편번호
    address1                VARCHAR(200),                                                    -- 기본 주소
    address2                VARCHAR(200),                                                    -- 상세 주소
    building                VARCHAR(200),                                                    -- 건물명
    city                    VARCHAR(100),                                                    -- 도시
    state_province          VARCHAR(100),                                                    -- 주/도
    country_code            VARCHAR(3)               DEFAULT 'KOR',                          -- 국가 코드
    
    -- 연락처 정보
    contact_name            VARCHAR(100),                                                    -- 연락처 담당자명
    phone                   VARCHAR(50),                                                     -- 전화번호
    mobile                  VARCHAR(50),                                                     -- 휴대폰 번호
    fax                     VARCHAR(50),                                                     -- 팩스번호
    email                   VARCHAR(255),                                                    -- 이메일
    
    -- 설정 정보
    is_primary              BOOLEAN                  NOT NULL DEFAULT false,                 -- 주소지 여부
    is_billing              BOOLEAN                  NOT NULL DEFAULT false,                 -- 청구지 여부
    is_shipping             BOOLEAN                  NOT NULL DEFAULT false,                 -- 배송지 여부
    
    -- 배송 관련 정보
    instruction             TEXT,                                                            -- 배송 지시사항
    access_code             VARCHAR(20),                                                     -- 출입코드
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 주소 유형 체크
    CONSTRAINT ck_customer_addresses__address_type  CHECK (address_type IN ('MAIN', 'BILLING', 'SHIPPING', 'BRANCH', 'WAREHOUSE', 'FACTORY', 'OTHER')),
    
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3)
    CONSTRAINT ck_customer_addresses__country_code  CHECK (country_code ~ '^[A-Z]{3}$'),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_customer_addresses__phone         CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 휴대폰 형식 체크
    CONSTRAINT ck_customer_addresses__mobile        CHECK (mobile IS NULL OR mobile ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 팩스 형식 체크
    CONSTRAINT ck_customer_addresses__fax           CHECK (fax IS NULL OR fax ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_customer_addresses__email         CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 상태 체크
    CONSTRAINT ck_customer_addresses__status        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_addresses                 IS '거래처 주소 정보 관리 테이블 - 배송지/청구지 등 주소 정보';
COMMENT ON COLUMN crm.customer_addresses.id              IS '주소정보 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_addresses.created_at      IS '등록 일시';
COMMENT ON COLUMN crm.customer_addresses.created_by      IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_addresses.updated_at      IS '수정 일시';
COMMENT ON COLUMN crm.customer_addresses.updated_by      IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_addresses.customer_id     IS '거래처 식별자';
COMMENT ON COLUMN crm.customer_addresses.address_type    IS '주소 유형 (MAIN: 본사, BILLING: 청구지, SHIPPING: 배송지, BRANCH: 지점, WAREHOUSE: 창고, FACTORY: 공장, OTHER: 기타)';
COMMENT ON COLUMN crm.customer_addresses.name            IS '주소 별칭';
COMMENT ON COLUMN crm.customer_addresses.postcode        IS '우편번호';
COMMENT ON COLUMN crm.customer_addresses.address1        IS '기본 주소';
COMMENT ON COLUMN crm.customer_addresses.address2        IS '상세 주소';
COMMENT ON COLUMN crm.customer_addresses.building        IS '건물명';
COMMENT ON COLUMN crm.customer_addresses.city            IS '도시';
COMMENT ON COLUMN crm.customer_addresses.state_province  IS '주/도';
COMMENT ON COLUMN crm.customer_addresses.country_code    IS '국가 코드 (ISO 3166-1 alpha-3, 예: KOR, USA, CHN)';
COMMENT ON COLUMN crm.customer_addresses.contact_name    IS '연락처 담당자명';
COMMENT ON COLUMN crm.customer_addresses.phone           IS '전화번호';
COMMENT ON COLUMN crm.customer_addresses.mobile          IS '휴대폰 번호';
COMMENT ON COLUMN crm.customer_addresses.fax             IS '팩스번호';
COMMENT ON COLUMN crm.customer_addresses.email           IS '이메일';
COMMENT ON COLUMN crm.customer_addresses.is_primary      IS '주소지 여부';
COMMENT ON COLUMN crm.customer_addresses.is_billing      IS '청구지 여부';
COMMENT ON COLUMN crm.customer_addresses.is_shipping     IS '배송지 여부';
COMMENT ON COLUMN crm.customer_addresses.instruction     IS '배송 지시사항';
COMMENT ON COLUMN crm.customer_addresses.access_code     IS '출입코드';
COMMENT ON COLUMN crm.customer_addresses.notes           IS '비고';
COMMENT ON COLUMN crm.customer_addresses.status          IS '상태 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 정지)';
COMMENT ON COLUMN crm.customer_addresses.is_deleted      IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_customer_addresses__customer_name 
    ON crm.customer_addresses (customer_id, name)
 WHERE name IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_addresses__customer_name IS '거래처별 주소 별칭 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_addresses__customer_primary 
    ON crm.customer_addresses (customer_id)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_addresses__customer_primary IS '거래처별 주소지 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_customer_addresses__customer_id 
    ON crm.customer_addresses (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__customer_id IS '거래처별 주소 조회 인덱스';

CREATE INDEX ix_customer_addresses__address_type 
    ON crm.customer_addresses (address_type, customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__address_type IS '주소 유형별 조회 인덱스';

CREATE INDEX ix_customer_addresses__city 
    ON crm.customer_addresses (city)
 WHERE city IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__city IS '도시별 조회 인덱스';

CREATE INDEX ix_customer_addresses__country_code 
    ON crm.customer_addresses (country_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__country_code IS '국가별 조회 인덱스';

CREATE INDEX ix_customer_addresses__is_billing 
    ON crm.customer_addresses (customer_id, is_billing)
 WHERE is_billing = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__is_billing IS '청구지 조회 인덱스';

CREATE INDEX ix_customer_addresses__is_shipping 
    ON crm.customer_addresses (customer_id, is_shipping)
 WHERE is_shipping = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__is_shipping IS '배송지 조회 인덱스';

CREATE INDEX ix_customer_addresses__status 
    ON crm.customer_addresses (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_addresses__status IS '상태별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조
ALTER TABLE crm.customer_addresses 
  ADD CONSTRAINT fk_customer_addresses__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.customers(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_customer_addresses__customer_id ON crm.customer_addresses IS '거래처 참조 외래키 (CASCADE 삭제)';
