-- =====================================================================================
-- 테이블: pim.brands
-- 설명: 브랜드 마스터 정보 관리 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.brands 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 브랜드 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 브랜드 기본 정보
    manufacturer_id         UUID                     NOT NULL,                               -- 제조사 식별자
    code                    VARCHAR(20)              NOT NULL,                               -- 브랜드 코드
    name                    VARCHAR(200)             NOT NULL,                               -- 브랜드명
    
    -- 브랜드 상세 정보
    name_en                 VARCHAR(200),                                                    -- 영문 브랜드명
    type                    VARCHAR(20)              DEFAULT 'PRODUCT',                      -- 브랜드 유형
    category                VARCHAR(50),                                                     -- 브랜드 카테고리
    
    -- 브랜딩 정보
    logo_url                VARCHAR(500),                                                    -- 로고 이미지 URL
    color                   VARCHAR(20),                                                     -- 브랜드 컬러 (hex)
    tagline                 VARCHAR(200),                                                    -- 브랜드 슬로건
    
    -- 시장 정보
    market_segment          VARCHAR(50),                                                     -- 시장 세그먼트
    price_range             VARCHAR(20),                                                     -- 가격대
    target_market           VARCHAR(100),                                                    -- 타겟 시장
    
    -- 연결 정보
    website                 VARCHAR(255),                                                    -- 브랜드 웹사이트
    country_code            VARCHAR(3),                                                      -- 브랜드 원산지
    
    -- 정렬 및 표시 정보
    display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서
    is_premium              BOOLEAN                  DEFAULT false,                          -- 프리미엄 브랜드 여부
    is_private              BOOLEAN                  DEFAULT false,                          -- 자체 브랜드 여부
    
    -- 추가 정보
    description             TEXT,                                                            -- 브랜드 설명    
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 브랜드 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-20자)
    CONSTRAINT ck_brands__code                      CHECK (code ~ '^[A-Z0-9_\-]{1,20}$'),
    
    -- 브랜드 유형 체크 (PRODUCT: 제품, SERVICE: 서비스, CORPORATE: 기업, SUB_BRAND: 하위브랜드, PRIVATE_LABEL: 자체브랜드)
    CONSTRAINT ck_brands__type                      CHECK (type IN ('PRODUCT', 'SERVICE', 'CORPORATE', 'SUB_BRAND', 'PRIVATE_LABEL')),
    
    -- 가격대 체크 (BUDGET: 저가, MID_RANGE: 중가, PREMIUM: 프리미엄, LUXURY: 럭셔리, ULTRA_LUXURY: 초고가)
    CONSTRAINT ck_brands__price_range               CHECK (price_range IS NULL OR price_range IN ('BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY', 'ULTRA_LUXURY')),
    
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_brands__country_code              CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{3}$'),
    
    -- 정렬 순서 양수 체크 (0 이상)
    CONSTRAINT ck_brands__display_order             CHECK (display_order >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_brands__status                    CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING')),
    
    -- 브랜드 컬러 형식 체크 (HEX 색상코드 #000000 ~ #FFFFFF)
    CONSTRAINT ck_brands__color                     CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.brands                  IS '브랜드 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.brands.id               IS '브랜드 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.brands.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.brands.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.brands.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.brands.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.brands.manufacturer_id  IS '제조사 식별자';
COMMENT ON COLUMN pim.brands.code             IS '브랜드 코드 (사내 규칙)';
COMMENT ON COLUMN pim.brands.name             IS '브랜드명';
COMMENT ON COLUMN pim.brands.name_en          IS '영문 브랜드명';
COMMENT ON COLUMN pim.brands.type             IS '브랜드 유형 (PRODUCT/SERVICE/CORPORATE/SUB_BRAND/PRIVATE_LABEL)';
COMMENT ON COLUMN pim.brands.category         IS '브랜드 카테고리';
COMMENT ON COLUMN pim.brands.logo_url         IS '로고 이미지 URL';
COMMENT ON COLUMN pim.brands.color            IS '브랜드 컬러 (hex 코드)';
COMMENT ON COLUMN pim.brands.tagline          IS '브랜드 슬로건';
COMMENT ON COLUMN pim.brands.market_segment   IS '시장 세그먼트';
COMMENT ON COLUMN pim.brands.price_range      IS '가격대 (BUDGET/MID_RANGE/PREMIUM/LUXURY/ULTRA_LUXURY)';
COMMENT ON COLUMN pim.brands.target_market    IS '타겟 시장';
COMMENT ON COLUMN pim.brands.website          IS '브랜드 웹사이트';
COMMENT ON COLUMN pim.brands.country_code     IS '브랜드 원산지 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN pim.brands.display_order    IS '정렬 순서';
COMMENT ON COLUMN pim.brands.is_premium       IS '프리미엄 브랜드 여부';
COMMENT ON COLUMN pim.brands.is_private       IS '자체 브랜드 여부';
COMMENT ON COLUMN pim.brands.description      IS '브랜드 설명';
COMMENT ON COLUMN pim.brands.notes            IS '비고';
COMMENT ON COLUMN pim.brands.status           IS '상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)';
COMMENT ON COLUMN pim.brands.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_brands__code
    ON pim.brands (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_brands__code IS '브랜드 코드 유니크 제약';

CREATE UNIQUE INDEX ux_brands__maker_name
    ON pim.brands (manufacturer_id, name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_brands__maker_name IS '제조사별 브랜드명 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_brands__manufacturer_id
    ON pim.brands (manufacturer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_brands__manufacturer_id IS '제조사별 브랜드 조회 인덱스';

CREATE INDEX ix_brands__code
    ON pim.brands (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_brands__code IS '브랜드 코드별 조회 인덱스';

CREATE INDEX ix_brands__name
    ON pim.brands (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_brands__name IS '브랜드명별 조회 인덱스';

CREATE INDEX ix_brands__display_order
    ON pim.brands (manufacturer_id, display_order, name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_brands__display_order IS '제조사별 정렬 순서 및 브랜드명 조회 인덱스';

CREATE INDEX ix_brands__type
    ON pim.brands (type)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_brands__type IS '브랜드 유형별 조회 인덱스';

CREATE INDEX ix_brands__price_range
    ON pim.brands (price_range)
 WHERE price_range IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_brands__price_range IS '가격대별 조회 인덱스';

CREATE INDEX ix_brands__market_segment
    ON pim.brands (market_segment)
 WHERE market_segment IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_brands__market_segment IS '시장 세그먼트별 조회 인덱스';

CREATE INDEX ix_brands__country_code
    ON pim.brands (country_code)
 WHERE country_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_brands__country_code IS '원산지별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제조사 참조 외래키 (부모 삭제 시 자식도 함께 삭제)
ALTER TABLE pim.brands
  ADD CONSTRAINT fk_brands__manufacturer_id
    FOREIGN KEY (manufacturer_id) 
    REFERENCES pim.manufacturers(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_brands__manufacturer_id ON pim.brands IS '제조사 참조 외래키 (CASCADE 삭제)';


