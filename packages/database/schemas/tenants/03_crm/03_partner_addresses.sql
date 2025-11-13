-- =====================================================================================
-- 테이블: crm.partner_addresses
-- 설명: 거래처 주소 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-23 - partners 통합 관리로 전환
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.partner_addresses 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 주소정보 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by          UUID,                                                            -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by          UUID,                                                            -- 수정자 UUID
    
    -- 주소 기본 정보
    partner_id          UUID                     NOT NULL,                               -- 거래처 식별자
    address_type        VARCHAR(20)              NOT NULL,                               -- 주소 유형
    address_name        VARCHAR(100),                                                    -- 주소 별칭
    
    -- 주소 정보
    postcode            VARCHAR(20),                                                     -- 우편번호
    address1            VARCHAR(200),                                                    -- 기본 주소
    address2            VARCHAR(200),                                                    -- 상세 주소
    building            VARCHAR(200),                                                    -- 건물명
    city                VARCHAR(100),                                                    -- 도시
    state_province      VARCHAR(100),                                                    -- 주/도
    country_code        VARCHAR(3)               DEFAULT 'KOR',                          -- 국가 코드
    region_code         VARCHAR(20),                                                     -- 지역 코드
    
    -- 연락처 정보
    contact_name        VARCHAR(100),                                                    -- 연락처 담당자명
    phone               VARCHAR(50),                                                     -- 전화번호
    mobile              VARCHAR(50),                                                     -- 휴대폰 번호
    fax                 VARCHAR(50),                                                     -- 팩스번호
    email               VARCHAR(255),                                                    -- 이메일
    
    -- 설정 정보
    is_default          BOOLEAN                  DEFAULT false,                          -- 기본 주소 여부
    is_billing          BOOLEAN                  DEFAULT false,                          -- 청구지 여부
    is_shipping         BOOLEAN                  DEFAULT false,                          -- 배송지 여부
    
    -- 배송 관련 정보
    instruction         TEXT,                                                            -- 배송 지시사항
    access_code         VARCHAR(20),                                                     -- 출입코드
    
    -- 추가 정보
    notes               TEXT,                                                            -- 비고
    
    -- 상태 관리
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted          BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_partner_addresses__address_type   CHECK (address_type IN ('HEADQUARTER', 'BRANCH', 'WAREHOUSE', 'FACTORY', 'BILLING', 'SHIPPING', 'OTHER')),  -- 주소 유형 체크
    CONSTRAINT ck_partner_addresses__country_code   CHECK (country_code ~ '^[A-Z]{3}$'),  -- 국가 코드 형식 체크
    CONSTRAINT ck_partner_addresses__phone          CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),  -- 전화번호 형식 체크
    CONSTRAINT ck_partner_addresses__mobile         CHECK (mobile IS NULL OR mobile ~ '^[0-9\-\+\(\)\s]{8,20}$'),  -- 휴대폰 형식 체크
    CONSTRAINT ck_partner_addresses__fax            CHECK (fax IS NULL OR fax ~ '^[0-9\-\+\(\)\s]{8,20}$'),  -- 팩스 형식 체크
    CONSTRAINT ck_partner_addresses__email          CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),  -- 이메일 형식 체크
    CONSTRAINT ck_partner_addresses__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))  -- 상태 체크
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  crm.partner_addresses              IS '거래처 주소 정보 관리 테이블';
COMMENT ON COLUMN crm.partner_addresses.id           IS '주소정보 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.partner_addresses.created_at   IS '등록 일시';
COMMENT ON COLUMN crm.partner_addresses.created_by   IS '등록자 UUID';
COMMENT ON COLUMN crm.partner_addresses.updated_at   IS '수정 일시';
COMMENT ON COLUMN crm.partner_addresses.updated_by   IS '수정자 UUID';
COMMENT ON COLUMN crm.partner_addresses.partner_id   IS '거래처 식별자';
COMMENT ON COLUMN crm.partner_addresses.address_type IS '주소 유형 (HEADQUARTER: 본사, BRANCH: 지사, WAREHOUSE: 창고, FACTORY: 공장, BILLING: 청구지, SHIPPING: 배송지, OTHER: 기타)';
COMMENT ON COLUMN crm.partner_addresses.address_name IS '주소 별칭';
COMMENT ON COLUMN crm.partner_addresses.postcode     IS '우편번호';
COMMENT ON COLUMN crm.partner_addresses.address1     IS '기본 주소';
COMMENT ON COLUMN crm.partner_addresses.address2     IS '상세 주소';
COMMENT ON COLUMN crm.partner_addresses.building     IS '건물명';
COMMENT ON COLUMN crm.partner_addresses.city         IS '도시';
COMMENT ON COLUMN crm.partner_addresses.state_province IS '주/도';
COMMENT ON COLUMN crm.partner_addresses.country_code IS '국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN crm.partner_addresses.region_code  IS '지역 코드';
COMMENT ON COLUMN crm.partner_addresses.contact_name IS '연락처 담당자명';
COMMENT ON COLUMN crm.partner_addresses.phone        IS '전화번호';
COMMENT ON COLUMN crm.partner_addresses.mobile       IS '휴대폰 번호';
COMMENT ON COLUMN crm.partner_addresses.fax          IS '팩스번호';
COMMENT ON COLUMN crm.partner_addresses.email        IS '이메일';
COMMENT ON COLUMN crm.partner_addresses.is_default   IS '기본 주소 여부';
COMMENT ON COLUMN crm.partner_addresses.is_billing   IS '청구지 여부';
COMMENT ON COLUMN crm.partner_addresses.is_shipping  IS '배송지 여부';
COMMENT ON COLUMN crm.partner_addresses.instruction  IS '배송 지시사항';
COMMENT ON COLUMN crm.partner_addresses.access_code  IS '출입코드';
COMMENT ON COLUMN crm.partner_addresses.notes        IS '비고';
COMMENT ON COLUMN crm.partner_addresses.status       IS '상태 (ACTIVE/INACTIVE/SUSPENDED)';
COMMENT ON COLUMN crm.partner_addresses.is_deleted   IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 일반 인덱스
CREATE INDEX ix_partner_addresses__partner_id
    ON crm.partner_addresses (partner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__partner_id IS '거래처별 주소 조회 인덱스';

CREATE INDEX ix_partner_addresses__address_type
    ON crm.partner_addresses (address_type, partner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__address_type IS '주소 유형별 조회 인덱스';

CREATE INDEX ix_partner_addresses__postcode
    ON crm.partner_addresses (postcode)
 WHERE postcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__postcode IS '우편번호별 조회 인덱스';

CREATE INDEX ix_partner_addresses__city
    ON crm.partner_addresses (city)
 WHERE city IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__city IS '도시별 조회 인덱스';

CREATE INDEX ix_partner_addresses__country_code
    ON crm.partner_addresses (country_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__country_code IS '국가별 조회 인덱스';

CREATE INDEX ix_partner_addresses__is_default
    ON crm.partner_addresses (partner_id, is_default)
 WHERE is_default = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__is_default IS '기본 주소 조회 인덱스';

CREATE INDEX ix_partner_addresses__is_billing
    ON crm.partner_addresses (partner_id, is_billing)
 WHERE is_billing = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__is_billing IS '청구지 조회 인덱스';

CREATE INDEX ix_partner_addresses__is_shipping
    ON crm.partner_addresses (partner_id, is_shipping)
 WHERE is_shipping = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__is_shipping IS '배송지 조회 인덱스';

CREATE INDEX ix_partner_addresses__contact_name
    ON crm.partner_addresses (contact_name)
 WHERE contact_name IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__contact_name IS '연락처 담당자명별 조회 인덱스';

CREATE INDEX ix_partner_addresses__phone
    ON crm.partner_addresses (phone)
 WHERE phone IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_addresses__phone IS '전화번호별 조회 인덱스';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_partner_addresses__partner_name
    ON crm.partner_addresses (partner_id, address_name)
 WHERE address_name IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_partner_addresses__partner_name IS '거래처별 주소 별칭 유니크 제약';

CREATE UNIQUE INDEX ux_partner_addresses__partner_default
    ON crm.partner_addresses (partner_id)
 WHERE is_default = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_partner_addresses__partner_default IS '거래처별 기본 주소 유니크 제약';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 거래처 참조
ALTER TABLE crm.partner_addresses 
  ADD CONSTRAINT fk_partner_addresses__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_partner_addresses__partner_id ON crm.partner_addresses IS '거래처 참조 외래키 (CASCADE 삭제)';

-- 국가 코드 참조
-- ALTER TABLE crm.partner_addresses 
--   ADD CONSTRAINT fk_partner_addresses__country_code
--     FOREIGN KEY (country_code) 
--     REFERENCES adm.countries(code) 
--     ON DELETE RESTRICT;
-- COMMENT ON CONSTRAINT fk_partner_addresses__country_code ON crm.partner_addresses IS '국가 코드 참조 외래키 (RESTRICT 삭제)';

-- 지역 코드 참조
-- ALTER TABLE crm.partner_addresses 
--   ADD CONSTRAINT fk_partner_addresses__region_code
--     FOREIGN KEY (region_code) 
--     REFERENCES adm.regions(code) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_partner_addresses__region_code ON crm.partner_addresses IS '지역 코드 참조 외래키 (SET NULL 삭제)';
