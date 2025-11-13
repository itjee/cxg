-- =====================================================================================
-- 테이블: pim.products
-- 설명: 제품/품목 마스터 정보 관리 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.products 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 제품 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 제품 기본 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 제품 코드
    name                    VARCHAR(200)             NOT NULL,                               -- 제품명
    type                    VARCHAR(10),                                                     -- 제품 유형
    product_no              VARCHAR(10),                                                     -- 제품 번호
    
    -- 분류 정보    
    item_type               VARCHAR(10),                                                     -- 품목 유형
    category_id             UUID,                                                            -- 카테고리 식별자
    manufacturer_id         UUID,                                                            -- 제조사 식별자
    brand_id                UUID,                                                            -- 브랜드 식별자
    model_name              VARCHAR(100),                                                    -- 모델명
    barcode                 VARCHAR(50),                                                     -- 바코드
    
    -- 세무 및 거래 정보
    is_taxfree              BOOLEAN                  DEFAULT false,                          -- 면세 여부
    is_bigdeal              BOOLEAN                  DEFAULT false,                          -- 거액 거래 여부
    
    -- 제품 속성
    is_barcode              BOOLEAN                  DEFAULT false,                          -- 바코드 보유 여부
    is_checkno              BOOLEAN                  DEFAULT false,                          -- 체크번호 필요 여부
    is_serial               BOOLEAN                  DEFAULT false,                          -- 시리얼 관리 여부
    is_inventory            BOOLEAN                  DEFAULT true,                           -- 재고 관리 여부
    
    -- 외부 시스템 연동
    cto_id                  VARCHAR(50),                                                     -- CTO ID
    eclipse_id              VARCHAR(20),                                                     -- Eclipse ID
    procure_id              VARCHAR(20),                                                     -- 조달 ID
    
    -- 가격 정보
    std_cost_price          NUMERIC(18,4),                                                   -- 표준 원가
    std_sell_price          NUMERIC(18,4),                                                   -- 표준 판매가
    min_sell_price          NUMERIC(18,4),                                                   -- 최소 판매가
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 구매 정보
    manager_id              UUID,                                                            -- 제품 담당자 식별자
    
    -- 이미지 및 미디어
    image_url               VARCHAR(200),                                                    -- 이미지 URL
    
    -- 추가 정보
    description             TEXT,                                                            -- 제품 설명
    specifications          JSONB,                                                           -- 제품 사양
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 제품 코드 형식 체크 (영문 대문자, 숫자, 하이픈, 언더스코어, 1-20자)
    CONSTRAINT ck_products__code                    CHECK (code ~ '^[A-Z0-9\-_]{1,20}$'),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_products__currency                CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 표준 판매가 유효성 체크 (0 이상)
    CONSTRAINT ck_products__price_valid             CHECK (std_sell_price IS NULL OR std_sell_price >= 0),
    
    -- 최소 판매가 유효성 체크 (0 이상)
    CONSTRAINT ck_products__min_price               CHECK (min_sell_price IS NULL OR min_sell_price >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, DISCONTINUED: 단종, PENDING: 대기, EOL: 단종예정)
    CONSTRAINT ck_products__status                  CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'PENDING', 'EOL'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.products                  IS '제품/품목 마스터 정보 관리 테이블';
COMMENT ON COLUMN pim.products.id               IS '제품 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.products.created_at       IS '등록 일시';
COMMENT ON COLUMN pim.products.created_by       IS '등록자 UUID';
COMMENT ON COLUMN pim.products.updated_at       IS '수정 일시';
COMMENT ON COLUMN pim.products.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN pim.products.code             IS '제품 코드 (사내 규칙)';
COMMENT ON COLUMN pim.products.name             IS '제품명';
COMMENT ON COLUMN pim.products.type             IS '제품 유형';
COMMENT ON COLUMN pim.products.product_no       IS '제품 번호';
COMMENT ON COLUMN pim.products.item_type        IS '품목 유형';
COMMENT ON COLUMN pim.products.category_id      IS '카테고리 식별자';
COMMENT ON COLUMN pim.products.manufacturer_id  IS '제조사 식별자';
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
COMMENT ON COLUMN pim.products.is_deleted         IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_products__code
    ON pim.products (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_products__code IS '제품 코드 유니크 제약';

CREATE UNIQUE INDEX ux_products__barcode
    ON pim.products (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ux_products__barcode IS '바코드 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_products__code
    ON pim.products (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_products__code IS '제품 코드별 조회 인덱스';

CREATE INDEX ix_products__name
    ON pim.products (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_products__name IS '제품명별 조회 인덱스';

CREATE INDEX ix_products__category_id
    ON pim.products (category_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_products__category_id IS '카테고리별 제품 조회 인덱스';

CREATE INDEX ix_products__manufacturer_id
    ON pim.products (manufacturer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_products__manufacturer_id IS '제조사별 제품 조회 인덱스';

CREATE INDEX ix_products__brand_id
    ON pim.products (brand_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_products__brand_id IS '브랜드별 제품 조회 인덱스';

CREATE INDEX ix_products__type
    ON pim.products (type)
 WHERE type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__type IS '제품 유형별 조회 인덱스';

CREATE INDEX ix_products__item_type
    ON pim.products (item_type)
 WHERE item_type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__item_type IS '품목 유형별 조회 인덱스';

CREATE INDEX ix_products__barcode
    ON pim.products (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__barcode IS '바코드별 조회 인덱스';

CREATE INDEX ix_products__model_name
    ON pim.products (model_name)
 WHERE model_name IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__model_name IS '모델명별 조회 인덱스';

CREATE INDEX ix_products__manager_id
    ON pim.products (manager_id)
 WHERE manager_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__manager_id IS '담당자별 제품 조회 인덱스';

CREATE INDEX ix_products__procure_id
    ON pim.products (procure_id)
 WHERE procure_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__procure_id IS '조달 ID별 조회 인덱스';

CREATE INDEX ix_products__specifications
    ON pim.products USING GIN (specifications)
 WHERE specifications IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_products__specifications IS '제품 사양 JSON 검색 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 카테고리 참조 외래키 (카테고리 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products
  ADD CONSTRAINT fk_products__category_id
    FOREIGN KEY (category_id)     
    REFERENCES pim.categories(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_products__category_id ON pim.products IS '카테고리 참조 외래키 (RESTRICT 삭제)';

-- 제조사 참조 외래키 (제조사 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products
  ADD CONSTRAINT fk_products__manufacturer_id
    FOREIGN KEY (manufacturer_id)         
    REFERENCES pim.makers(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_products__manufacturer_id ON pim.products IS '제조사 참조 외래키 (RESTRICT 삭제)';

-- 브랜드 참조 외래키 (브랜드 삭제 시 제품 삭제 불가)
ALTER TABLE pim.products
  ADD CONSTRAINT fk_products__brand_id
    FOREIGN KEY (brand_id)         
    REFERENCES pim.brands(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_products__brand_id ON pim.products IS '브랜드 참조 외래키 (RESTRICT 삭제)';
