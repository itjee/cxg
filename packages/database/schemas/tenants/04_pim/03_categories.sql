-- =====================================================================================
-- 테이블: pim.categories
-- 설명: 제품/품목 카테고리 정보 관리 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.categories  
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 카테고리 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 카테고리 기본 정보
    parent_id               UUID,                                                            -- 상위 카테고리 식별자
    code                    VARCHAR(50)              NOT NULL,                               -- 카테고리 코드
    name                    VARCHAR(100)             NOT NULL,                               -- 카테고리명
    type                    VARCHAR(20)              DEFAULT 'PRODUCT',                      -- 카테고리 유형
    
    -- 계층 정보
    level_depth             INTEGER                  DEFAULT 1,                              -- 계층 깊이 (1=대분류, 2=중분류, 3=소분류)
    full_path               VARCHAR(500),                                                    -- 전체 경로 (대분류>중분류>소분류)
    
    -- 카테고리 속성    
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    
    -- 세무 및 회계 정보
    tax_category            VARCHAR(20),                                                     -- 세금 분류
    account_code            VARCHAR(30),                                                     -- 회계 코드
    
    -- 관리 정보
    manager_id              UUID,                                                            -- 카테고리 담당자
    buyer_id                UUID,                                                            -- 구매 담당자
    
    -- 이미지 및 아이콘
    icon_url                VARCHAR(500),                                                    -- 아이콘 URL
    image_url               VARCHAR(500),                                                    -- 이미지 URL
    
    -- 외부 연동
    external_code           VARCHAR(50),                                                     -- 외부 시스템 코드
    marketplace             VARCHAR(100),                                                    -- 마켓플레이스 카테고리
    
    -- 추가 정보
    description             TEXT,                                                            -- 카테고리 설명    
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 카테고리 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-50자)
    CONSTRAINT ck_categories__code                  CHECK (code ~ '^[A-Z0-9_\-]{1,50}$'),
    
    -- 카테고리 유형 체크 (PRODUCT: 제품, SERVICE: 서비스, BUNDLE: 묶음상품, VIRTUAL: 가상, SUBSCRIPTION: 구독, DIGITAL: 디지털, PHYSICAL: 실물)
    CONSTRAINT ck_categories__type                  CHECK (type IN ('PRODUCT', 'SERVICE', 'BUNDLE', 'VIRTUAL', 'SUBSCRIPTION', 'DIGITAL', 'PHYSICAL')),
    
    -- 세금 분류 체크 (TAXABLE: 과세, EXEMPT: 면세, ZERO_RATED: 영세율, REVERSE_CHARGE: 역과세, SPECIAL: 특수)
    CONSTRAINT ck_categories__tax_category          CHECK (tax_category IS NULL OR tax_category IN ('TAXABLE', 'EXEMPT', 'ZERO_RATED', 'REVERSE_CHARGE', 'SPECIAL')),
    
    -- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_categories__level_depth           CHECK (level_depth BETWEEN 1 AND 10),
    
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_categories__display_order         CHECK (display_order >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기)
    CONSTRAINT ck_categories__status                CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING')),
    
    -- 자기 참조 방지 체크 (부모 카테고리가 자기 자신이 될 수 없음)
    CONSTRAINT ck_categories__parent_not_self       CHECK (parent_id != id)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.categories                         IS '제품/품목 카테고리 정보 관리 테이블';
COMMENT ON COLUMN pim.categories.id                IS '카테고리 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.categories.created_at        IS '등록 일시';
COMMENT ON COLUMN pim.categories.created_by        IS '등록자 UUID';
COMMENT ON COLUMN pim.categories.updated_at        IS '수정 일시';
COMMENT ON COLUMN pim.categories.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN pim.categories.parent_id         IS '상위 카테고리 식별자 (계층구조)';
COMMENT ON COLUMN pim.categories.code              IS '카테고리 코드 (사내 규칙)';
COMMENT ON COLUMN pim.categories.name              IS '카테고리명';
COMMENT ON COLUMN pim.categories.level_depth       IS '계층 깊이 (1=대분류, 2=중분류, 3=소분류)';
COMMENT ON COLUMN pim.categories.full_path         IS '전체 경로 (대분류>중분류>소분류)';
COMMENT ON COLUMN pim.categories.type              IS '카테고리 유형 (PRODUCT/SERVICE/BUNDLE/VIRTUAL/SUBSCRIPTION/DIGITAL/PHYSICAL)';
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
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_categories__code
    ON pim.categories (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_categories__code IS '카테고리 코드 유니크 제약';

CREATE UNIQUE INDEX ux_categories__parent_name
    ON pim.categories (COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::UUID), name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_categories__parent_name IS '상위 카테고리별 카테고리명 유니크 제약';

CREATE UNIQUE INDEX ux_categories__external_code
    ON pim.categories (external_code)
 WHERE external_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ux_categories__external_code IS '외부 시스템 코드 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_categories__code
    ON pim.categories (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__code IS '카테고리 코드별 조회 인덱스';

CREATE INDEX ix_categories__name
    ON pim.categories (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__name IS '카테고리명별 조회 인덱스';

CREATE INDEX ix_categories__parent_id
    ON pim.categories (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__parent_id IS '상위 카테고리별 조회 인덱스';

CREATE INDEX ix_categories__level_depth
    ON pim.categories (level_depth, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__level_depth IS '계층 깊이별 조회 인덱스';

CREATE INDEX ix_categories__display_order
    ON pim.categories (parent_id, display_order, name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__display_order IS '표시 순서별 조회 인덱스';

CREATE INDEX ix_categories__type
    ON pim.categories (type)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_categories__type IS '카테고리 유형별 조회 인덱스';

CREATE INDEX ix_categories__tax_category
    ON pim.categories (tax_category)
 WHERE tax_category IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__tax_category IS '세금 분류별 조회 인덱스';

CREATE INDEX ix_categories__manager_id
    ON pim.categories (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__manager_id IS '담당자별 카테고리 조회 인덱스';

CREATE INDEX ix_categories__buyer_id
    ON pim.categories (buyer_id)
 WHERE buyer_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__buyer_id IS '구매 담당자별 카테고리 조회 인덱스';

CREATE INDEX ix_categories__external_code
    ON pim.categories (external_code)
 WHERE external_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__external_code IS '외부 시스템 코드별 조회 인덱스';

CREATE INDEX ix_categories__account_code
    ON pim.categories (account_code)
 WHERE account_code IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__account_code IS '회계 코드별 조회 인덱스';

CREATE INDEX ix_categories__full_path
    ON pim.categories (full_path)
 WHERE full_path IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_categories__full_path IS '전체 경로별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 상위 카테고리 참조 외래키 (부모 삭제 시 자식도 함께 삭제)
ALTER TABLE pim.categories
  ADD CONSTRAINT fk_categories__parent_id
    FOREIGN KEY (parent_id) 
    REFERENCES pim.categories(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_categories__parent_id ON pim.categories IS '상위 카테고리 참조 외래키 (CASCADE 삭제)';

