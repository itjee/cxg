-- ============================================================================
-- Product Information Management Schema (pim)
-- ============================================================================
-- Description: 제품정보관리 스키마 (제조사, 브랜드, 카테고리, 제품)
-- Database: tnnt_db (Tenant Database)
-- Schema: pim
-- Created: 2025-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS pim;

COMMENT ON SCHEMA pim IS 'PIM: 제품정보관리 스키마 (제조사, 브랜드, 카테고리, 제품)';

-- ============================================================================
-- PRODUCT INFORMATION MANAGEMENT
-- ============================================================================

-- =====================================================================================
-- 테이블: pim.makers
-- 설명: 제조사 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.makers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                     -- 제조사 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP         -- 등록 일시
    created_by              UUID                                                                               -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                            -- 수정 일시
    updated_by              UUID                                                                               -- 수정자 UUID
    
    -- 제조사 기본 정보
    maker_code              VARCHAR(20)              NOT NULL                                                  -- 제조사 코드
    maker_name              VARCHAR(200)             NOT NULL                                                  -- 제조사명
    
    -- 제조사 상세 정보
    english_name            VARCHAR(200)                                                                       -- 영문 제조사명
    country_code            VARCHAR(3)                                                                         -- 본사 국가코드
    
    -- 주소 정보
    postcode                VARCHAR(10)                                                                        -- 우편번호
    address1                VARCHAR(100)                                                                       -- 주소1 (기본주소)
    address2                VARCHAR(100)                                                                       -- 주소2 (상세주소)
    
    -- 연락처 정보
    phone                   VARCHAR(50)                                                                        -- 전화번호
    email                   VARCHAR(255)                                                                       -- 이메일
    website                 VARCHAR(255)                                                                       -- 웹사이트 URL
    
    -- 정렬 및 표시 정보
    display_order           INTEGER                  DEFAULT 0                                                 -- 정렬 순서
    logo_url                VARCHAR(500)                                                                       -- 로고 이미지 URL
    
    -- 추가 정보
    description             TEXT                                                                               -- 제조사 설명
    notes                   TEXT                                                                               -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                          -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                             -- 논리 삭제 플래그
    
    -- 제약조건
    -- 제조사 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-20자)
    CONSTRAINT ck_pim_makers__maker_code        CHECK (maker_code ~ '^[A-Z0-9_\-]{1,20}$'),
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_pim_makers__country_code      CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{3}$'),
    -- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_pim_makers__phone             CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    -- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_pim_makers__email             CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    -- 정렬 순서 양수 체크 (0 이상)
    CONSTRAINT ck_pim_makers__display_order     CHECK (display_order >= 0),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_pim_makers__status            CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING'))
);

COMMENT ON TABLE  pim.makers                  IS '제조사 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.makers.id               IS '제조사 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.makers.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.makers.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.makers.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.makers.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.makers.maker_code       IS '제조사 코드 (사내 규칙)';
COMMENT ON COLUMN pim.makers.maker_name       IS '제조사명';
COMMENT ON COLUMN pim.makers.english_name     IS '영문 제조사명';
COMMENT ON COLUMN pim.makers.country_code     IS '본사 국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN pim.makers.postcode         IS '우편번호';
COMMENT ON COLUMN pim.makers.address1         IS '주소1 (기본주소)';
COMMENT ON COLUMN pim.makers.address2         IS '주소2 (상세주소)';
COMMENT ON COLUMN pim.makers.phone            IS '전화번호';
COMMENT ON COLUMN pim.makers.email            IS '이메일';
COMMENT ON COLUMN pim.makers.website          IS '웹사이트 URL';
COMMENT ON COLUMN pim.makers.display_order    IS '정렬 순서';
COMMENT ON COLUMN pim.makers.logo_url         IS '로고 이미지 URL';
COMMENT ON COLUMN pim.makers.description      IS '제조사 설명';
COMMENT ON COLUMN pim.makers.notes            IS '비고';
COMMENT ON COLUMN pim.makers.status           IS '상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)';
COMMENT ON COLUMN pim.makers.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_pim_makers__maker_code
    ON pim.makers (maker_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_makers__maker_code IS '제조사 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_makers__maker_name
    ON pim.makers (maker_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_makers__maker_name IS '제조사명별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_makers__display_order
    ON pim.makers (display_order, maker_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_makers__display_order IS '정렬 순서 및 제조사명별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_makers__country_code
    ON pim.makers (country_code)
 WHERE country_code IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_makers__country_code IS '국가별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_makers__english_name
    ON pim.makers (english_name)
 WHERE english_name IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_makers__english_name IS '영문명별 조회 인덱스';

CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_makers__code
    ON pim.makers (maker_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_makers__code IS '제조사 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_makers__name
    ON pim.makers (maker_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_makers__name IS '제조사명 유니크 제약';


-- =====================================================================================
-- 테이블: pim.brands
-- 설명: 브랜드 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.brands 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                  -- 브랜드 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP      -- 등록 일시
    created_by              UUID                                                                            -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                         -- 수정 일시
    updated_by              UUID                                                                                                                                                                                                                          -- 수정자 UUID
    
    -- 브랜드 기본 정보
    maker_id                UUID                     NOT NULL                                               -- 제조사 식별자
    brand_code              VARCHAR(20)              NOT NULL                                               -- 브랜드 코드
    brand_name              VARCHAR(200)             NOT NULL                                               -- 브랜드명
    
    -- 브랜드 상세 정보
    english_name            VARCHAR(200)                                                                    -- 영문 브랜드명
    brand_type              VARCHAR(20)              DEFAULT 'PRODUCT'                                      -- 브랜드 유형
    brand_category          VARCHAR(50)                                                                     -- 브랜드 카테고리
    
    -- 브랜딩 정보
    logo_url                VARCHAR(500)                                                                    -- 로고 이미지 URL
    brand_color             VARCHAR(20)                                                                     -- 브랜드 컬러 (hex)
    tagline                 VARCHAR(200)                                                                    -- 브랜드 슬로건
    
    -- 시장 정보
    market_segment          VARCHAR(50)                                                                     -- 시장 세그먼트
    price_range             VARCHAR(20)                                                                     -- 가격대
    target_market           VARCHAR(100)                                                                    -- 타겟 시장
    
    -- 연결 정보
    website                 VARCHAR(255)                                                                    -- 브랜드 웹사이트
    country_code            VARCHAR(3)                                                                      -- 브랜드 원산지
    
    -- 정렬 및 표시 정보
    display_order           INTEGER                  DEFAULT 0                                              -- 정렬 순서
    is_premium              BOOLEAN                  DEFAULT false                                          -- 프리미엄 브랜드 여부
    is_private              BOOLEAN                  DEFAULT false                                          -- 자체 브랜드 여부
    
    -- 추가 정보
    description             TEXT                                                                            -- 브랜드 설명    
    
    -- 상태 관리
    notes                   TEXT                                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                          -- 논리 삭제 플래그
    
    -- 제약조건
    -- 브랜드 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-20자)
    CONSTRAINT ck_pim_brands__brand_code        CHECK (brand_code ~ '^[A-Z0-9_\-]{1,20}$'),
    -- 브랜드 유형 체크 (PRODUCT: 제품, SERVICE: 서비스, CORPORATE: 기업, SUB_BRAND: 하위브랜드, PRIVATE_LABEL: 자체브랜드)
    CONSTRAINT ck_pim_brands__brand_type        CHECK (brand_type IN ('PRODUCT', 'SERVICE', 'CORPORATE', 'SUB_BRAND', 'PRIVATE_LABEL')),
    -- 가격대 체크 (BUDGET: 저가, MID_RANGE: 중가, PREMIUM: 프리미엄, LUXURY: 럭셔리, ULTRA_LUXURY: 초고가)
    CONSTRAINT ck_pim_brands__price_range       CHECK (price_range IS NULL OR price_range IN ('BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY', 'ULTRA_LUXURY')),
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_pim_brands__country_code      CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{3}$'),
    -- 정렬 순서 양수 체크 (0 이상)
    CONSTRAINT ck_pim_brands__display_order     CHECK (display_order >= 0),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_pim_brands__status            CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING')),
    -- 브랜드 컬러 형식 체크 (HEX 색상코드 #000000 ~ #FFFFFF)
    CONSTRAINT ck_pim_brands__brand_color       CHECK (brand_color IS NULL OR brand_color ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE  pim.brands                  IS '브랜드 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.brands.id               IS '브랜드 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.brands.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.brands.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.brands.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.brands.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.brands.maker_id         IS '제조사 식별자';
COMMENT ON COLUMN pim.brands.brand_code       IS '브랜드 코드 (사내 규칙)';
COMMENT ON COLUMN pim.brands.brand_name       IS '브랜드명';
COMMENT ON COLUMN pim.brands.english_name     IS '영문 브랜드명';
COMMENT ON COLUMN pim.brands.brand_type       IS '브랜드 유형 (PRODUCT/SERVICE/CORPORATE/SUB_BRAND/PRIVATE_LABEL)';
COMMENT ON COLUMN pim.brands.brand_category   IS '브랜드 카테고리';
COMMENT ON COLUMN pim.brands.logo_url         IS '로고 이미지 URL';
COMMENT ON COLUMN pim.brands.brand_color      IS '브랜드 컬러 (hex 코드)';
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
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_pim_brands__maker_id
    ON pim.brands (maker_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_brands__maker_id IS '제조사별 브랜드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__brand_code
    ON pim.brands (brand_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_brands__brand_code IS '브랜드 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__brand_name
    ON pim.brands (brand_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_brands__brand_name IS '브랜드명별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__display_order
    ON pim.brands (maker_id, display_order, brand_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_brands__display_order IS '제조사별 정렬 순서 및 브랜드명 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__brand_type
    ON pim.brands (brand_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_brands__brand_type IS '브랜드 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__price_range
    ON pim.brands (price_range)
 WHERE price_range IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_brands__price_range IS '가격대별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__market_segment
    ON pim.brands (market_segment)
 WHERE market_segment IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_brands__market_segment IS '시장 세그먼트별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_brands__country_code
    ON pim.brands (country_code)
 WHERE country_code IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_brands__country_code IS '원산지별 조회 인덱스';

CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_brands__code
    ON pim.brands (brand_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_brands__code IS '브랜드 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_brands__maker_name
    ON pim.brands (maker_id, brand_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_brands__maker_name IS '제조사별 브랜드명 유니크 제약';


-- =====================================================================================
-- 테이블: pim.categories
-- 설명: 제품/품목 카테고리 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pim.categories  
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                  -- 카테고리 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP      -- 등록 일시
    created_by              UUID                                                                            -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                         -- 수정 일시
    updated_by              UUID                                                                            -- 수정자 UUID
    
    -- 카테고리 기본 정보
    parent_id               UUID                                                                            -- 상위 카테고리 식별자
    category_code           VARCHAR(50)              NOT NULL                                               -- 카테고리 코드
    category_name           VARCHAR(100)             NOT NULL                                               -- 카테고리명
    
    -- 계층 정보
    level_depth             INTEGER                  DEFAULT 1                                              -- 계층 깊이 (1=대분류, 2=중분류, 3=소분류)
    full_path               VARCHAR(500)                                                                    -- 전체 경로 (대분류>중분류>소분류)
    
    -- 카테고리 속성
    category_type           VARCHAR(20)              DEFAULT 'PRODUCT'                                      -- 카테고리 유형
    display_order           INTEGER                  DEFAULT 0                                              -- 표시 순서
    
    -- 세무 및 회계 정보
    tax_category            VARCHAR(20)                                                                     -- 세금 분류
    account_code            VARCHAR(30)                                                                     -- 회계 코드
    
    -- 관리 정보
    manager_id              UUID                                                                            -- 카테고리 담당자
    buyer_id                UUID                                                                            -- 구매 담당자
    
    -- 이미지 및 아이콘
    icon_url                VARCHAR(500)                                                                    -- 아이콘 URL
    image_url               VARCHAR(500)                                                                    -- 이미지 URL
    
    -- 외부 연동
    external_code           VARCHAR(50)                                                                     -- 외부 시스템 코드
    marketplace             VARCHAR(100)                                                                    -- 마켓플레이스 카테고리
    
    -- 추가 정보
    description             TEXT                                                                            -- 카테고리 설명    
    
    -- 상태 관리
    notes                   TEXT                                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                          -- 논리 삭제 플래그
    
    -- 제약조건
    -- 카테고리 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-50자)
    CONSTRAINT ck_pim_categories__category_code     CHECK (category_code ~ '^[A-Z0-9_\-]{1,50}$'),
    -- 카테고리 유형 체크 (PRODUCT: 제품, SERVICE: 서비스, BUNDLE: 묶음상품, VIRTUAL: 가상, SUBSCRIPTION: 구독, DIGITAL: 디지털, PHYSICAL: 실물)
    CONSTRAINT ck_pim_categories__category_type     CHECK (category_type IN ('PRODUCT', 'SERVICE', 'BUNDLE', 'VIRTUAL', 'SUBSCRIPTION', 'DIGITAL', 'PHYSICAL')),
    -- 세금 분류 체크 (TAXABLE: 과세, EXEMPT: 면세, ZERO_RATED: 영세율, REVERSE_CHARGE: 역과세, SPECIAL: 특수)
    CONSTRAINT ck_pim_categories__tax_category      CHECK (tax_category IS NULL OR tax_category IN ('TAXABLE', 'EXEMPT', 'ZERO_RATED', 'REVERSE_CHARGE', 'SPECIAL')),
    -- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_pim_categories__level_depth       CHECK (level_depth BETWEEN 1 AND 10),
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_pim_categories__display_order     CHECK (display_order >= 0),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_pim_categories__status            CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING')),
    -- 자기 참조 방지 체크 (부모 카테고리가 자기 자신이 될 수 없음)
    CONSTRAINT ck_pim_categories__parent_not_self   CHECK (parent_id != id)
);

COMMENT ON TABLE  pim.categories                   IS '제품/품목 카테고리 정보 관리 테이블';
COMMENT ON COLUMN pim.categories.id                IS '카테고리 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.categories.created_at        IS '등록 일시';
COMMENT ON COLUMN pim.categories.created_by        IS '등록자 UUID';
COMMENT ON COLUMN pim.categories.updated_at        IS '수정 일시';
COMMENT ON COLUMN pim.categories.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN pim.categories.parent_id         IS '상위 카테고리 식별자 (계층구조)';
COMMENT ON COLUMN pim.categories.category_code     IS '카테고리 코드 (사내 규칙)';
COMMENT ON COLUMN pim.categories.category_name     IS '카테고리명';
COMMENT ON COLUMN pim.categories.level_depth       IS '계층 깊이 (1=대분류, 2=중분류, 3=소분류)';
COMMENT ON COLUMN pim.categories.full_path         IS '전체 경로 (대분류>중분류>소분류)';
COMMENT ON COLUMN pim.categories.category_type     IS '카테고리 유형 (PRODUCT/SERVICE/BUNDLE/VIRTUAL/SUBSCRIPTION/DIGITAL/PHYSICAL)';
COMMENT ON COLUMN pim.categories.display_order     IS '표시 순서';
COMMENT ON COLUMN pim.categories.tax_category      IS '세금 분류 (TAXABLE/EXEMPT/ZERO_RATED/REVERSE_CHARGE/SPECIAL)';
COMMENT ON COLUMN pim.categories.account_code      IS '회계 코드';
COMMENT ON COLUMN pim.categories.manager_id        IS '카테고리 담당자';
COMMENT ON COLUMN pim.categories.buyer_id          IS '구매 담당자';
COMMENT ON COLUMN pim.categories.icon_url          IS '아이콘 URL';
COMMENT ON COLUMN pim.categories.image_url         IS '이미지 URL';
COMMENT ON COLUMN pim.categories.external_code     IS '외부 시스템 코드';
COMMENT ON COLUMN pim.categories.marketplace       IS '마켓플레이스 카테고리';
COMMENT ON COLUMN pim.categories.description       IS '카테고리 설명';
COMMENT ON COLUMN pim.categories.notes             IS '비고';
COMMENT ON COLUMN pim.categories.status            IS '상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)';
COMMENT ON COLUMN pim.categories.is_deleted        IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_pim_categories__category_code
    ON pim.categories  (category_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__category_code IS '카테고리 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_categories__category_name
    ON pim.categories  (category_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__category_name IS '카테고리명별 조회 인덱스';

-- 계층구조 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__parent_id
    ON pim.categories  (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__parent_id IS '상위 카테고리별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_categories__level_depth
    ON pim.categories  (level_depth, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__level_depth IS '계층 깊이별 조회 인덱스';

-- 표시 순서 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__display_order
    ON pim.categories  (parent_id, display_order, category_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__display_order IS '표시 순서별 조회 인덱스';

-- 카테고리 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__category_type
    ON pim.categories  (category_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_categories__category_type IS '카테고리 유형별 조회 인덱스';

-- 세금 분류별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__tax_category
    ON pim.categories  (tax_category)
 WHERE tax_category IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__tax_category IS '세금 분류별 조회 인덱스';

-- 담당자별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__manager_id
    ON pim.categories  (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__manager_id IS '담당자별 카테고리 조회 인덱스';
   AND is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_pim_categories__buyer_id
    ON pim.categories  (buyer_id)
 WHERE buyer_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__buyer_id IS '구매 담당자별 카테고리 조회 인덱스';
   AND is_deleted = false;

-- 외부 시스템 연동 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__external_code
    ON pim.categories  (external_code)
 WHERE external_code IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__external_code IS '외부 시스템 코드별 조회 인덱스';

-- 회계 코드 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__account_code
    ON pim.categories  (account_code)
 WHERE account_code IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__account_code IS '회계 코드별 조회 인덱스';

-- 전체 경로 검색 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_categories__full_path
    ON pim.categories  (full_path)
 WHERE full_path IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_categories__full_path IS '전체 경로별 조회 인덱스';

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_categories__status

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 전체 카테고리 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_categories__code
    ON pim.categories  (category_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_categories__code IS '카테고리 코드 유니크 제약';

-- 전체 동일 레벨의 카테고리명 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_categories__parent_name
    ON pim.categories  (COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::UUID), category_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_categories__parent_name IS '상위 카테고리별 카테고리명 유니크 제약';

-- 외부 코드 유니크 (전역)
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_categories__external_code
    ON pim.categories  (external_code)
 WHERE external_code IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ux_pim_categories__external_code IS '외부 시스템 코드 유니크 제약';
   

-- =====================================================================================
-- 테이블: pim.category_managers
-- 설명: 카테고리 담당자 이력을 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pim.category_managers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                  -- 담당자 이력 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP      -- 등록 일시
    created_by              UUID                                                                            -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                         -- 수정 일시
    updated_by              UUID                                                                            -- 수정자 UUID
    
    -- 담당자 이력 기본 정보
    category_id             UUID                     NOT NULL                                               -- 카테고리 식별자
    employee_id             UUID                     NOT NULL                                               -- 담당자 식별자

    -- 담당 기간
    start_date              DATE                     NOT NULL                                               -- 담당 시작일
    end_date                DATE                     NOT NULL                                               -- 담당 종료일
    
    -- 담당자 역할 및 유형
    manager_type            VARCHAR(20)              DEFAULT 'PRIMARY'                                      -- 담당자 유형
    description             TEXT                                                                            -- 담당 업무/역할
    
    -- 상태 관리
    notes                   TEXT                                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 카테고리 참조 외래키
    CONSTRAINT fk_pim_category_managers__category_id    FOREIGN KEY (category_id)     REFERENCES pim.categories(id),
    -- 담당자(사원) 참조 외래키
    CONSTRAINT fk_pim_category_managers__employee_id    FOREIGN KEY (employee_id)     REFERENCES pim.employees(id),
    
    -- 제약조건
    -- 담당자 유형 체크 (PRIMARY: 주담당, SECONDARY: 부담당, SALES: 영업, TECHNICAL: 기술, PURCHASE: 구매, MARKETING: 마케팅, ANALYST: 분석)
    CONSTRAINT ck_pim_category_managers__manager_type   CHECK (manager_type IN ('PRIMARY', 'SECONDARY', 'SALES', 'TECHNICAL', 'PURCHASE', 'MARKETING', 'ANALYST')),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 해지)
    CONSTRAINT ck_pim_category_managers__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'TERMINATED')),
    -- 날짜 범위 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_pim_category_managers__date_range     CHECK (end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE  pim.category_managers                 IS '카테고리 담당자 이력 관리 테이블';
COMMENT ON COLUMN pim.category_managers.id              IS '담당자 이력 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.category_managers.created_at      IS '등록 일시';
COMMENT ON COLUMN pim.category_managers.created_by      IS '등록자 UUID';
COMMENT ON COLUMN pim.category_managers.updated_at      IS '수정 일시';
COMMENT ON COLUMN pim.category_managers.updated_by      IS '수정자 UUID';
COMMENT ON COLUMN pim.category_managers.category_id     IS '카테고리 식별자';
COMMENT ON COLUMN pim.category_managers.employee_id     IS '담당자 식별자';
COMMENT ON COLUMN pim.category_managers.start_date      IS '담당 시작일';
COMMENT ON COLUMN pim.category_managers.end_date        IS '담당 종료일';
COMMENT ON COLUMN pim.category_managers.manager_type    IS '담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING/ANALYST)';
COMMENT ON COLUMN pim.category_managers.description     IS '담당 업무/역할';
COMMENT ON COLUMN pim.category_managers.notes           IS '비고';
COMMENT ON COLUMN pim.category_managers.status          IS '상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)';
COMMENT ON COLUMN pim.category_managers.is_deleted      IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- ===================================================================================== 
CREATE INDEX IF NOT EXISTS ix_pim_category_managers__category_id
    ON pim.category_managers (category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__category_id IS '카테고리별 담당자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_category_managers__employee_id
    ON pim.category_managers (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__employee_id IS '사원별 담당 카테고리 조회 인덱스';

-- 현재 담당자 조회 인덱스 (가장 중요)
-- CREATE INDEX IF NOT EXISTS ix_pim_category_managers__current_active
    -- ON pim.category_managers (category_id, status, start_date, end_date)
 -- WHERE status = 'ACTIVE' 
   -- AND CURRENT_DATE BETWEEN start_date AND end_date
   -- AND is_deleted = false;

-- 담당 기간별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_category_managers__date_range
    ON pim.category_managers (start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__date_range IS '담당 기간별 조회 인덱스';

-- 담당자 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_category_managers__manager_type
    ON pim.category_managers (manager_type, category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__manager_type IS '담당자 유형별 조회 인덱스';

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_category_managers__status

-- 사원별 담당 카테고리 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_category_managers__employee_categories
    ON pim.category_managers (employee_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__employee_categories IS '사원별 담당 카테고리 목록 조회 인덱스';

-- 이력 조회 인덱스 (카테고리별 담당자 변경 이력)
CREATE INDEX IF NOT EXISTS ix_pim_category_managers__category_history
    ON pim.category_managers (category_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_category_managers__category_history IS '카테고리별 담당자 변경 이력 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 동일 기간 내 카테고리의 동일 유형 담당자는 하나만 허용
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_category_managers__category_type_period
    ON pim.category_managers (category_id, manager_type, start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_category_managers__category_type_period IS '카테고리별 담당자 유형 및 기간 유니크 제약';
 

-- =====================================================================================
-- 테이블: pim.products
-- 설명: 제품/품목 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pim.products 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                  -- 제품 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP      -- 등록 일시
    created_by              UUID                                                                            -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                         -- 수정 일시
    updated_by              UUID                                                                            -- 수정자 UUID
    
    -- 제품 기본 정보
    product_code            VARCHAR(20)              NOT NULL                                               -- 제품 코드
    product_name            VARCHAR(200)             NOT NULL                                               -- 제품명
    product_type            VARCHAR(10)                                                                     -- 제품 유형
    product_no              VARCHAR(10)                                                                     -- 제품 번호
    
    -- 분류 정보    
    item_type               VARCHAR(10)                                                                     -- 품목 유형
    category_id             UUID                                                                            -- 카테고리 식별자
    maker_id                UUID                                                                            -- 제조사 식별자
    brand_id                UUID                                                                            -- 브랜드 식별자
    model_name              VARCHAR(100)                                                                    -- 모델명
    barcode                 VARCHAR(50)                                                                     -- 바코드
    
    -- 세무 및 거래 정보
    is_taxfree              BOOLEAN                  DEFAULT false                                          -- 면세 여부
    is_bigdeal              BOOLEAN                  DEFAULT false                                          -- 거액 거래 여부
    
    -- 제품 속성
    is_barcode              BOOLEAN                  DEFAULT false                                          -- 바코드 보유 여부
    is_checkno              BOOLEAN                  DEFAULT false                                          -- 체크번호 필요 여부
    is_serial               BOOLEAN                  DEFAULT false                                          -- 시리얼 관리 여부
    is_inventory            BOOLEAN                  DEFAULT true                                           -- 재고 관리 여부
    
    -- 외부 시스템 연동
    cto_id                  VARCHAR(50)                                                                     -- CTO ID
    eclipse_id              VARCHAR(20)                                                                     -- Eclipse ID
    procure_id              VARCHAR(20)                                                                     -- 조달 ID
    
    -- 가격 정보
    std_cost_price          NUMERIC(18,4)                                                                   -- 표준 판매가
    std_sell_price          NUMERIC(18,4)                                                                   -- 표준 판매가
    min_sell_price          NUMERIC(18,4)                                                                   -- 최소 판매가
    currency                VARCHAR(3)               DEFAULT 'KRW'                                          -- 통화
    
    -- 구매 정보
    manager_id              UUID                                                                            -- 제품 담당자 식별자
    
    -- 이미지 및 미디어
    image_url               VARCHAR(200)                                                                    -- 이미지 URL
    
    -- 추가 정보
    description             TEXT                                                                            -- 제품 설명
    specifications          JSONB                                                                           -- 제품 사양
    
    -- 상태 관리
    notes                   TEXT                                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 카테고리 참조 외래키
    CONSTRAINT fk_pim_products__category_id     FOREIGN KEY (category_id)     REFERENCES pim.categories(id),
    -- 제조사 참조 외래키 (주석 처리: makers 테이블 외래키는 하단에서 ALTER TABLE로 추가)
    --CONSTRAINT fk_pim_products__maker_id        FOREIGN KEY (maker_id)         REFERENCES pim.makers(id),
    -- 브랜드 참조 외래키 (주석 처리: brands 테이블 외래키는 하단에서 ALTER TABLE로 추가)
    --CONSTRAINT fk_pim_products__brand_id        FOREIGN KEY (brand_id)         REFERENCES pim.brands(id),
    -- 담당자(사원) 참조 외래키
    CONSTRAINT fk_pim_products__manager_id      FOREIGN KEY (manager_id)     REFERENCES pim.employees(id),
    
    -- 제약조건
    -- 제품 코드 형식 체크 (영문 대문자, 숫자, 하이픈, 언더스코어, 1-20자)
    CONSTRAINT ck_pim_products__product_code    CHECK (product_code ~ '^[A-Z0-9\-_]{1,20}$'),
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_pim_products__currency        CHECK (currency ~ '^[A-Z]{3}$'),
    -- 표준 판매가 유효성 체크 (0 이상)
    CONSTRAINT ck_pim_products__price_valid     CHECK (std_sell_price IS NULL OR std_sell_price >= 0),
    -- 최소 판매가 유효성 체크 (0 이상)
    CONSTRAINT ck_pim_products__min_price       CHECK (min_sell_price IS NULL OR min_sell_price >= 0),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기, EOL: 단종예정)
    CONSTRAINT ck_pim_products__status          CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING', 'EOL'))
);

COMMENT ON TABLE  pim.products                  IS '제품/품목 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.products.id               IS '제품 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.products.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.products.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.products.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.products.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.products.product_code     IS '제품 코드 (사내 규칙)';
COMMENT ON COLUMN pim.products.product_name     IS '제품명';
COMMENT ON COLUMN pim.products.product_no       IS '제품 번호';
COMMENT ON COLUMN pim.products.product_type     IS '제품 유형';
COMMENT ON COLUMN pim.products.item_type        IS '품목 유형';
COMMENT ON COLUMN pim.products.category_id      IS '카테고리 식별자';
COMMENT ON COLUMN pim.products.maker_id         IS '제조사 식별자';
COMMENT ON COLUMN pim.products.brand_id         IS '브랜드 식별자';
COMMENT ON COLUMN pim.products.manager_id       IS '제품 담당자 식별자';
COMMENT ON COLUMN pim.products.model_name       IS '모델명';
COMMENT ON COLUMN pim.products.barcode          IS '바코드';
COMMENT ON COLUMN pim.products.is_taxfree       IS '면세 여부';
COMMENT ON COLUMN pim.products.is_bigdeal       IS '거액 거래 여부';
COMMENT ON COLUMN pim.products.is_barcode       IS '바코드 보유 여부';
COMMENT ON COLUMN pim.products.is_checkno       IS '체크번호 필요 여부';
COMMENT ON COLUMN pim.products.is_serial        IS '시리얼 관리 여부';
COMMENT ON COLUMN pim.products.is_inventory     IS '재고 관리 여부';
COMMENT ON COLUMN pim.products.cto_id           IS 'CTO ID';
COMMENT ON COLUMN pim.products.eclipse_id       IS 'Eclipse ID';
COMMENT ON COLUMN pim.products.procure_id       IS '조달 ID';
COMMENT ON COLUMN pim.products.std_cost_price   IS '표준 원가';
COMMENT ON COLUMN pim.products.std_sell_price   IS '표준 판매가';
COMMENT ON COLUMN pim.products.min_sell_price   IS '최소 판매가';
COMMENT ON COLUMN pim.products.currency         IS '통화 (ISO 4217)';
COMMENT ON COLUMN pim.products.image_url        IS '이미지 URL';
COMMENT ON COLUMN pim.products.description      IS '제품 설명';
COMMENT ON COLUMN pim.products.specifications   IS '제품 사양 (JSON 형태: {"cpu": "Intel i7", "memory": "16GB", "storage": "512GB SSD"})';
COMMENT ON COLUMN pim.products.notes            IS '비고';
COMMENT ON COLUMN pim.products.status           IS '상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING/EOL)';
COMMENT ON COLUMN pim.products.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_pim_products__product_code
    ON pim.products (product_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_products__product_code IS '제품 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_products__product_name
    ON pim.products (product_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_products__product_name IS '제품명별 조회 인덱스';

-- 분류별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_products__category_id
    ON pim.products (category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_products__category_id IS '카테고리별 제품 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_products__maker_id
    ON pim.products (maker_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_products__maker_id IS '제조사별 제품 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_products__brand_id
    ON pim.products (brand_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_products__brand_id IS '브랜드별 제품 조회 인덱스';

-- 제품 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_products__product_type
    ON pim.products (product_type)
 WHERE product_type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__product_type IS '제품 유형별 조회 인덱스';
   AND is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_pim_products__item_type
    ON pim.products (item_type)
 WHERE item_type IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__item_type IS '품목 유형별 조회 인덱스';

-- 바코드 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_products__barcode
    ON pim.products (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__barcode IS '바코드별 조회 인덱스';
   AND is_deleted = false;

-- 모델명 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_products__model_name
    ON pim.products (model_name)
 WHERE model_name IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__model_name IS '모델명별 조회 인덱스';

-- 담당자별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_products__manager_id
    ON pim.products (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__manager_id IS '담당자별 제품 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_products__procure_id
    ON pim.products (procure_id)
 WHERE procure_id IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__procure_id IS '조달 ID별 조회 인덱스';

-- 특성별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_products__is_serial
 WHERE is_serial = true 
   AND is_deleted = false;

-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_products__is_taxfree
 WHERE is_taxfree = true 
   AND is_deleted = false;
   
CREATE INDEX IF NOT EXISTS ix_pim_products__specifications
    ON pim.products USING GIN (specifications)
 WHERE specifications IS NOT NULL 
   AND is_deleted = false;
   AND is_deleted = false;
COMMENT ON INDEX ix_pim_products__specifications IS '제품 사양 JSON 검색 인덱스';

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_products__status

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 전체 제품 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_products__code
    ON pim.products (product_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_products__code IS '제품 코드 유니크 제약';

-- 바코드 유니크 (전역)
CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_products__barcode
    ON pim.products (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX ux_pim_products__barcode IS '바코드 유니크 제약';
   AND is_deleted = false;
   

-- =====================================================================================
-- 테이블: pim.product_managers
-- 설명: 상품 담당자 이력을 관리하는 테이블
-- 작성일: 2024-12-19
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pim.product_managers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid()                  -- 담당자 이력 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP      -- 등록 일시
    created_by              UUID                                                                            -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE                                         -- 수정 일시
    updated_by              UUID                                                                            -- 수정자 UUID
    
    -- 담당자 이력 기본 정보
    product_id              UUID                     NOT NULL                                               -- 제품 식별자
    employee_id             UUID                     NOT NULL                                               -- 담당자 식별자
    
    -- 담당 기간
    start_date              DATE                     NOT NULL                                               -- 담당 시작일
    end_date                DATE                     NOT NULL                                               -- 담당 종료일
    
    -- 담당자 역할 및 유형
    manager_type            VARCHAR(20)              DEFAULT 'PRIMARY'                                      -- 담당자 유형
    description             TEXT                                                                            -- 담당 업무/역할
    
    -- 상태 관리
    notes                   TEXT                                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE'                                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false                                          -- 논리 삭제 플래그
    
    -- 외래키 제약 조건
    -- 제품 참조 외래키
    CONSTRAINT fk_pim_product_managers__product_id      FOREIGN KEY (product_id)     REFERENCES pim.products(id),
    -- 담당자(사원) 참조 외래키
    CONSTRAINT fk_pim_product_managers__employee_id     FOREIGN KEY (employee_id)     REFERENCES pim.employees(id),
    
    -- 제약조건
    -- 담당자 유형 체크 (PRIMARY: 주담당, SECONDARY: 부담당, SALES: 영업, TECHNICAL: 기술, PURCHASE: 구매, MARKETING: 마케팅)
    CONSTRAINT ck_pim_product_managers__manager_type    CHECK (manager_type IN ('PRIMARY', 'SECONDARY', 'SALES', 'TECHNICAL', 'PURCHASE', 'MARKETING')),
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 해지)
    CONSTRAINT ck_pim_product_managers__status          CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'TERMINATED')),
    -- 날짜 범위 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_pim_product_managers__date_range      CHECK (end_date >= start_date)
);

COMMENT ON TABLE  pim.product_managers                  IS '상품 담당자 이력 관리 테이블';
COMMENT ON COLUMN pim.product_managers.id               IS '담당자 이력 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_managers.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.product_managers.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.product_managers.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.product_managers.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.product_managers.product_id       IS '제품 식별자';
COMMENT ON COLUMN pim.product_managers.employee_id      IS '담당자 식별자';
COMMENT ON COLUMN pim.product_managers.start_date       IS '담당 시작일';
COMMENT ON COLUMN pim.product_managers.end_date         IS '담당 종료일';
COMMENT ON COLUMN pim.product_managers.manager_type     IS '담당자 유형 (PRIMARY/SECONDARY/SALES/TECHNICAL/PURCHASE/MARKETING)';
COMMENT ON COLUMN pim.product_managers.description      IS '담당 업무/역할';
COMMENT ON COLUMN pim.product_managers.notes            IS '비고';
COMMENT ON COLUMN pim.product_managers.status           IS '상태 (ACTIVE/INACTIVE/EXPIRED/TERMINATED)';
COMMENT ON COLUMN pim.product_managers.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_pim_product_managers__product_id
    ON pim.product_managers (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__product_id IS '제품별 담당자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_pim_product_managers__employee_id
    ON pim.product_managers (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__employee_id IS '사원별 담당 제품 조회 인덱스';

-- 현재 담당자 조회 인덱스 (가장 중요)
-- CREATE INDEX IF NOT EXISTS ix_pim_product_managers__current_active
    -- ON pim.product_managers (product_id, status, start_date, end_date)
 -- WHERE status = 'ACTIVE' 
   -- AND CURRENT_DATE BETWEEN start_date AND end_date
   -- AND is_deleted = false;

-- 담당 기간별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_product_managers__date_range
    ON pim.product_managers (start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__date_range IS '담당 기간별 조회 인덱스';

-- 담당자 유형별 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_product_managers__manager_type
    ON pim.product_managers (manager_type, product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__manager_type IS '담당자 유형별 조회 인덱스';

-- 상태별 조회 인덱스
-- [INCOMPLETE INDEX] CREATE INDEX IF NOT EXISTS ix_pim_product_managers__status

-- 사원별 담당 제품 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_pim_product_managers__employee_products
    ON pim.product_managers (employee_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__employee_products IS '사원별 담당 제품 목록 조회 인덱스';

-- 이력 조회 인덱스 (제품별 담당자 변경 이력)
CREATE INDEX IF NOT EXISTS ix_pim_product_managers__product_history
    ON pim.product_managers (product_id, start_date DESC, end_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_pim_product_managers__product_history IS '제품별 담당자 변경 이력 조회 인덱스';

CREATE UNIQUE INDEX IF NOT EXISTS ux_pim_product_managers__product_type_period
    ON pim.product_managers (product_id, manager_type, start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_pim_product_managers__product_type_period IS '제품별 담당자 유형 및 기간 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- brands 외래키 추가
-- 제조사 참조 외래키 (부모 삭제 시 자식도 함께 삭제)
ALTER TABLE pim.brands ADD CONSTRAINT fk_pim_brands__maker_id
    FOREIGN KEY (maker_id) REFERENCES pim.makers(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_pim_brands__maker_id ON pim.brands IS '제조사 참조 외래키 (CASCADE 삭제)';

-- categories 외래키 추가
-- 상위 카테고리 참조 외래키 (부모 삭제 시 자식도 함께 삭제)
ALTER TABLE pim.categories ADD CONSTRAINT fk_pim_categories__parent_id
    FOREIGN KEY (parent_id) REFERENCES pim.categories(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_pim_categories__parent_id ON pim.categories IS '상위 카테고리 참조 외래키 (CASCADE 삭제)';

-- Note: manager_id, buyer_id 외래키는 hrm 스키마 생성 후 추가 필요
-- 카테고리 담당자 참조 외래키 (담당자 삭제 시 NULL로 설정)
-- ALTER TABLE pim.categories ADD CONSTRAINT fk_pim_categories__manager_id
--     FOREIGN KEY (manager_id) REFERENCES hrm.employees(id) ON DELETE SET NULL;
-- 구매 담당자 참조 외래키 (담당자 삭제 시 NULL로 설정)
-- ALTER TABLE pim.categories ADD CONSTRAINT fk_pim_categories__buyer_id
--     FOREIGN KEY (buyer_id) REFERENCES hrm.employees(id) ON DELETE SET NULL;

-- category_managers 외래키 추가
-- 카테고리 참조 외래키 (카테고리 삭제 시 담당자 이력도 함께 삭제)
ALTER TABLE pim.category_managers ADD CONSTRAINT fk_pim_category_managers__category_id
    FOREIGN KEY (category_id) REFERENCES pim.categories(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_pim_category_managers__category_id ON pim.category_managers IS '카테고리 참조 외래키 (CASCADE 삭제)';

-- Note: employee_id 외래키는 hrm 스키마 생성 후 추가 필요
-- 담당자(사원) 참조 외래키 (사원 삭제 시 담당자 이력도 함께 삭제)
-- ALTER TABLE pim.category_managers ADD CONSTRAINT fk_pim_category_managers__employee_id
--     FOREIGN KEY (employee_id) REFERENCES hrm.employees(id) ON DELETE CASCADE;

-- products 외래키 추가
-- 제조사 참조 외래키 (제조사 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products ADD CONSTRAINT fk_pim_products__maker_id
    FOREIGN KEY (maker_id) REFERENCES pim.makers(id) ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_pim_products__maker_id ON pim.products IS '제조사 참조 외래키 (RESTRICT 삭제)';

-- 브랜드 참조 외래키 (브랜드 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products ADD CONSTRAINT fk_pim_products__brand_id
    FOREIGN KEY (brand_id) REFERENCES pim.brands(id) ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_pim_products__brand_id ON pim.products IS '브랜드 참조 외래키 (RESTRICT 삭제)';

-- 카테고리 참조 외래키 (카테고리 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products ADD CONSTRAINT fk_pim_products__category_id
    FOREIGN KEY (category_id) REFERENCES pim.categories(id) ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_pim_products__category_id ON pim.products IS '카테고리 참조 외래키 (RESTRICT 삭제)';

-- product_managers 외래키 추가
-- 제품 참조 외래키 (제품 삭제 시 담당자 이력도 함께 삭제)
ALTER TABLE pim.product_managers ADD CONSTRAINT fk_pim_product_managers__product_id
    FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_pim_product_managers__product_id ON pim.product_managers IS '제품 참조 외래키 (CASCADE 삭제)';

-- Note: employee_id 외래키는 hrm 스키마 생성 후 추가 필요
-- 담당자(사원) 참조 외래키 (사원 삭제 시 담당자 이력도 함께 삭제)
-- ALTER TABLE pim.product_managers ADD CONSTRAINT fk_pim_product_managers__employee_id
--     FOREIGN KEY (employee_id) REFERENCES hrm.employees(id) ON DELETE CASCADE;
