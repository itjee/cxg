-- =====================================================================================
-- 테이블: pim.manufacturers
-- 설명: 제조사 마스터 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.manufacturers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 제조사 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 제조사 기본 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 제조사 코드
    name                    VARCHAR(200)             NOT NULL,                               -- 제조사명
    
    -- 제조사 상세 정보
    name_en                 VARCHAR(200),                                                    -- 영문 제조사명
    country_code            VARCHAR(3),                                                      -- 본사 국가코드
    
    -- 주소 정보
    postcode                VARCHAR(10),                                                     -- 우편번호
    address1                VARCHAR(100),                                                    -- 주소1 (기본주소)
    address2                VARCHAR(100),                                                    -- 주소2 (상세주소)
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                     -- 전화번호
    email                   VARCHAR(255),                                                    -- 이메일
    website                 VARCHAR(255),                                                    -- 웹사이트 URL
    
    -- 정렬 및 표시 정보
    display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서
    logo_url                VARCHAR(500),                                                    -- 로고 이미지 URL
    
    -- 추가 정보
    description             TEXT,                                                            -- 제조사 설명
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 제조사 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-20자)
    CONSTRAINT ck_manufacturers__code                      CHECK (code ~ '^[A-Z0-9_\-]{1,20}$'),
    
    -- 국가 코드 형식 체크 (ISO 3166-1 alpha-3, 3자리 영문 대문자)
    CONSTRAINT ck_manufacturers__country_code              CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{3}$'),
    
    -- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_manufacturers__phone                     CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_manufacturers__email                     CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 정렬 순서 양수 체크 (0 이상)
    CONSTRAINT ck_manufacturers__display_order             CHECK (display_order >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_manufacturers__status                    CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.manufacturers                           IS '제조사 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.manufacturers.id               IS '제조사 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.manufacturers.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.manufacturers.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.manufacturers.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.manufacturers.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.manufacturers.code             IS '제조사 코드 (사내 규칙)';
COMMENT ON COLUMN pim.manufacturers.name             IS '제조사명';
COMMENT ON COLUMN pim.manufacturers.name_en          IS '영문 제조사명';
COMMENT ON COLUMN pim.manufacturers.country_code     IS '본사 국가 코드 (ISO 3166-1 alpha-3)';
COMMENT ON COLUMN pim.manufacturers.postcode         IS '우편번호';
COMMENT ON COLUMN pim.manufacturers.address1         IS '주소1 (기본주소)';
COMMENT ON COLUMN pim.manufacturers.address2         IS '주소2 (상세주소)';
COMMENT ON COLUMN pim.manufacturers.phone            IS '전화번호';
COMMENT ON COLUMN pim.manufacturers.email            IS '이메일';
COMMENT ON COLUMN pim.manufacturers.website          IS '웹사이트 URL';
COMMENT ON COLUMN pim.manufacturers.display_order    IS '정렬 순서';
COMMENT ON COLUMN pim.manufacturers.logo_url         IS '로고 이미지 URL';
COMMENT ON COLUMN pim.manufacturers.description      IS '제조사 설명';
COMMENT ON COLUMN pim.manufacturers.notes            IS '비고';
COMMENT ON COLUMN pim.manufacturers.status           IS '상태 (ACTIVE/INACTIVE/DISCONTINUED/PENDING)';
COMMENT ON COLUMN pim.manufacturers.is_deleted       IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_manufacturers__code
    ON pim.manufacturers (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_manufacturers__code IS '제조사 코드 유니크 제약';

CREATE UNIQUE INDEX ux_manufacturers__name
    ON pim.manufacturers (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_manufacturers__name IS '제조사명 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_manufacturers__code
    ON pim.manufacturers (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_manufacturers__code IS '제조사 코드별 조회 인덱스';

CREATE INDEX ix_manufacturers__name
    ON pim.manufacturers (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_manufacturers__name IS '제조사명별 조회 인덱스';

CREATE INDEX ix_manufacturers__display_order
    ON pim.manufacturers (display_order, name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_manufacturers__display_order IS '정렬 순서 및 제조사명별 조회 인덱스';

CREATE INDEX ix_manufacturers__country_code
    ON pim.manufacturers (country_code)
 WHERE country_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_manufacturers__country_code IS '국가별 조회 인덱스';

CREATE INDEX ix_manufacturers__name_en
    ON pim.manufacturers (name_en)
 WHERE name_en IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_manufacturers__name_en IS '영문명별 조회 인덱스';


