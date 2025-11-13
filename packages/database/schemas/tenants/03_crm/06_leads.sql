-- =====================================================================================
-- 테이블: crm.leads
-- 설명: 리드/잠재고객 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.leads 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 리드 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 리드 기본 정보
    lead_code               VARCHAR(50)              NOT NULL,                               -- 리드 코드
    company_name            VARCHAR(200)             NOT NULL,                               -- 회사명
    website                 VARCHAR(200),                                                    -- 웹사이트
    industry                VARCHAR(100),                                                    -- 업종
    employee_count          INTEGER,                                                         -- 직원 수
    annual_revenue          NUMERIC(18,2),                                                   -- 연매출액
    
    -- 담당자 정보
    contact_name            VARCHAR(100)             NOT NULL,                               -- 담당자명
    contact_title           VARCHAR(100),                                                    -- 직책
    contact_phone           VARCHAR(20),                                                     -- 전화번호
    contact_mobile          VARCHAR(20),                                                     -- 휴대폰
    contact_email           VARCHAR(100),                                                    -- 이메일
    
    -- 주소 정보
    country_code            VARCHAR(3),                                                      -- 국가 코드
    postcode                VARCHAR(20),                                                     -- 우편번호
    address1                VARCHAR(200),                                                    -- 주소1
    address2                VARCHAR(200),                                                    -- 주소2
    city                    VARCHAR(100),                                                    -- 도시
    state_province          VARCHAR(100),                                                    -- 주/도
    
    -- 리드 출처 및 점수
    source                  VARCHAR(50),                                                     -- 리드 출처
    source_detail           VARCHAR(200),                                                    -- 출처 상세
    lead_score              INTEGER                  DEFAULT 0,                              -- 리드 점수
    rating                  VARCHAR(20),                                                     -- 등급
    
    -- 관심 정보
    interest_product        VARCHAR(200),                                                    -- 관심 제품
    interest_service        VARCHAR(200),                                                    -- 관심 서비스
    budget_range            VARCHAR(50),                                                     -- 예산 범위
    purchase_timeframe      VARCHAR(50),                                                     -- 구매 시기
    
    -- 담당자 정보
    owner_id                UUID,                                                            -- 담당 영업자
    
    -- 전환 정보
    converted_partner_id    UUID,                                                            -- 전환된 거래처 ID
    converted_at            TIMESTAMP WITH TIME ZONE,                                        -- 전환 일시
    converted_by            UUID,                                                            -- 전환 처리자
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'NEW',                          -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    description             TEXT,                                                            -- 설명
    notes                   TEXT,                                                            -- 비고
    
    -- 리드 코드 유니크 제약
    CONSTRAINT ck_leads__lead_code                  CHECK (lead_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 상태 체크 (NEW: 신규, CONTACTED: 접촉, QUALIFIED: 적격, CONVERTED: 전환, LOST: 실패)
    CONSTRAINT ck_leads__status                     CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')),
    
    -- 리드 점수 범위 체크 (0-100)
    CONSTRAINT ck_leads__lead_score                 CHECK (lead_score >= 0 AND lead_score <= 100),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_leads__contact_email              CHECK (contact_email IS NULL OR contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_leads__contact_phone              CHECK (contact_phone IS NULL OR contact_phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 연매출액 음수 불가 체크
    CONSTRAINT ck_leads__annual_revenue             CHECK (annual_revenue IS NULL OR annual_revenue >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.leads                              IS '리드/잠재고객 관리 테이블';
COMMENT ON COLUMN crm.leads.id                           IS '리드 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.leads.created_at                   IS '등록 일시';
COMMENT ON COLUMN crm.leads.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN crm.leads.updated_at                   IS '수정 일시';
COMMENT ON COLUMN crm.leads.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN crm.leads.lead_code                    IS '리드 코드 (고유번호)';
COMMENT ON COLUMN crm.leads.company_name                 IS '회사명';
COMMENT ON COLUMN crm.leads.website                      IS '웹사이트';
COMMENT ON COLUMN crm.leads.industry                     IS '업종';
COMMENT ON COLUMN crm.leads.employee_count               IS '직원 수';
COMMENT ON COLUMN crm.leads.annual_revenue               IS '연매출액';
COMMENT ON COLUMN crm.leads.contact_name                 IS '담당자명';
COMMENT ON COLUMN crm.leads.contact_title                IS '직책';
COMMENT ON COLUMN crm.leads.contact_phone                IS '전화번호';
COMMENT ON COLUMN crm.leads.contact_mobile               IS '휴대폰';
COMMENT ON COLUMN crm.leads.contact_email                IS '이메일';
COMMENT ON COLUMN crm.leads.country_code                 IS '국가 코드';
COMMENT ON COLUMN crm.leads.postcode                     IS '우편번호';
COMMENT ON COLUMN crm.leads.address1                     IS '주소1';
COMMENT ON COLUMN crm.leads.address2                     IS '주소2';
COMMENT ON COLUMN crm.leads.city                         IS '도시';
COMMENT ON COLUMN crm.leads.state_province               IS '주/도';
COMMENT ON COLUMN crm.leads.source                       IS '리드 출처 (WEBSITE/REFERRAL/EXHIBITION/COLD_CALL/PARTNER 등)';
COMMENT ON COLUMN crm.leads.source_detail                IS '출처 상세 설명';
COMMENT ON COLUMN crm.leads.lead_score                   IS '리드 점수 (0-100, Lead Scoring)';
COMMENT ON COLUMN crm.leads.rating                       IS '등급 (HOT/WARM/COLD)';
COMMENT ON COLUMN crm.leads.interest_product             IS '관심 제품';
COMMENT ON COLUMN crm.leads.interest_service             IS '관심 서비스';
COMMENT ON COLUMN crm.leads.budget_range                 IS '예산 범위';
COMMENT ON COLUMN crm.leads.purchase_timeframe           IS '구매 시기 (IMMEDIATE/1_MONTH/3_MONTHS/6_MONTHS/1_YEAR)';
COMMENT ON COLUMN crm.leads.owner_id                     IS '담당 영업자 UUID';
COMMENT ON COLUMN crm.leads.converted_partner_id         IS '전환된 거래처 ID';
COMMENT ON COLUMN crm.leads.converted_at                 IS '전환 일시';
COMMENT ON COLUMN crm.leads.converted_by                 IS '전환 처리자 UUID';
COMMENT ON COLUMN crm.leads.status                       IS '상태 (NEW/CONTACTED/QUALIFIED/CONVERTED/LOST)';
COMMENT ON COLUMN crm.leads.is_deleted                   IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.leads.description                  IS '설명';
COMMENT ON COLUMN crm.leads.notes                        IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_leads__lead_code 
    ON crm.leads (lead_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_leads__lead_code IS '리드 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_leads__company_name 
    ON crm.leads (company_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_leads__company_name IS '회사명별 조회 인덱스';

CREATE INDEX ix_leads__contact_email 
    ON crm.leads (contact_email)
 WHERE contact_email IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_leads__contact_email IS '이메일별 조회 인덱스';

CREATE INDEX ix_leads__owner_id 
    ON crm.leads (owner_id)
 WHERE owner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_leads__owner_id IS '담당 영업자별 조회 인덱스';

CREATE INDEX ix_leads__status 
    ON crm.leads (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_leads__status IS '상태별 조회 인덱스';

CREATE INDEX ix_leads__source 
    ON crm.leads (source)
 WHERE source IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_leads__source IS '출처별 조회 인덱스';

CREATE INDEX ix_leads__lead_score 
    ON crm.leads (lead_score DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_leads__lead_score IS '리드 점수별 조회 인덱스';

CREATE INDEX ix_leads__rating 
    ON crm.leads (rating)
 WHERE rating IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_leads__rating IS '등급별 조회 인덱스';

CREATE INDEX ix_leads__industry 
    ON crm.leads (industry)
 WHERE industry IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_leads__industry IS '업종별 조회 인덱스';

CREATE INDEX ix_leads__converted_partner_id 
    ON crm.leads (converted_partner_id)
 WHERE converted_partner_id IS NOT NULL;
COMMENT ON INDEX crm.ix_leads__converted_partner_id IS '전환된 거래처별 조회 인덱스';

CREATE INDEX ix_leads__created_at 
    ON crm.leads (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_leads__created_at IS '등록일시별 조회 인덱스';

-- 외래키 제약조건
-- 국가 참조 (RESTRICT 삭제)
-- ALTER TABLE crm.leads 
--   ADD CONSTRAINT fk_leads__country_code
--     FOREIGN KEY (country_code) 
--     REFERENCES adm.countries(code) 
--     ON DELETE RESTRICT;
-- COMMENT ON CONSTRAINT fk_leads__country_code ON crm.leads IS '국가 참조 외래키 (RESTRICT 삭제)';

-- 담당 영업자 참조 (SET NULL 삭제)
ALTER TABLE crm.leads 
  ADD CONSTRAINT fk_leads__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_leads__owner_id ON crm.leads IS '담당 영업자 참조 외래키 (SET NULL 삭제)';

-- 전환된 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.leads 
  ADD CONSTRAINT fk_leads__converted_partner_id
    FOREIGN KEY (converted_partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_leads__converted_partner_id ON crm.leads IS '전환된 거래처 참조 외래키 (SET NULL 삭제)';

-- 전환 처리자 참조 (SET NULL 삭제)
ALTER TABLE crm.leads 
  ADD CONSTRAINT fk_leads__converted_by
    FOREIGN KEY (converted_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_leads__converted_by ON crm.leads IS '전환 처리자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.leads 테이블 정의
-- =====================================================================================
