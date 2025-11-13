-- =====================================================================================
-- 테이블: pim.product_variants
-- 설명: 제품 변형(SKU) 관리 테이블 (빨강-L, 파랑-M 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_variants 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 변형 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 변형 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    sku                     VARCHAR(50)              NOT NULL,                               -- SKU (Stock Keeping Unit)
    name                    VARCHAR(200),                                                    -- 변형명
    
    -- 옵션 조합 (JSON 배열로 저장)
    option_values           JSONB                    NOT NULL,                               -- 옵션 값 조합
    
    -- 가격 정보
    price                   NUMERIC(18,4),                                                   -- 판매 가격
    cost_price              NUMERIC(18,4),                                                   -- 원가
    
    -- 재고 정보
    stock_quantity          NUMERIC(18,2)            DEFAULT 0,                              -- 재고 수량
    reserved_quantity       NUMERIC(18,2)            DEFAULT 0,                              -- 예약 수량
    available_quantity      NUMERIC(18,2)            GENERATED ALWAYS AS (stock_quantity - reserved_quantity) STORED, -- 가용 수량
    
    -- 물리적 속성
    weight                  NUMERIC(10,2),                                                   -- 무게 (g)
    length                  NUMERIC(10,2),                                                   -- 길이 (cm)
    width                   NUMERIC(10,2),                                                   -- 너비 (cm)
    height                  NUMERIC(10,2),                                                   -- 높이 (cm)
    
    -- 이미지 및 바코드
    image_url               VARCHAR(500),                                                    -- 대표 이미지 URL
    barcode                 VARCHAR(50),                                                     -- 바코드
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- SKU 형식 체크 (영문 대문자, 숫자, 하이픈, 언더스코어, 1-50자)
    CONSTRAINT ck_variants__sku                     CHECK (sku ~ '^[A-Z0-9\-_]{1,50}$'),
    
    -- 가격 양수 체크 (0 이상)
    CONSTRAINT ck_variants__price                   CHECK (price IS NULL OR price >= 0),
    
    -- 원가 양수 체크 (0 이상)
    CONSTRAINT ck_variants__cost                    CHECK (cost_price IS NULL OR cost_price >= 0),
    
    -- 재고 수량 양수 체크 (0 이상)
    CONSTRAINT ck_variants__stock                   CHECK (stock_quantity >= 0),
    
    -- 예약 수량 양수 체크 (0 이상)
    CONSTRAINT ck_variants__reserved                CHECK (reserved_quantity >= 0),
    
    -- 무게 양수 체크 (0 초과)
    CONSTRAINT ck_variants__weight                  CHECK (weight IS NULL OR weight > 0),
    
    -- 치수 양수 체크 (0 초과)
    CONSTRAINT ck_variants__dimensions              CHECK ((length IS NULL AND width IS NULL AND height IS NULL) OR (length > 0 AND width > 0 AND height > 0)),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, OUT_OF_STOCK: 품절, DISCONTINUED: 단종)
    CONSTRAINT ck_variants__status                  CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_variants                       IS '제품 변형(SKU) 관리 테이블 (빨강-L, 파랑-M 등)';
COMMENT ON COLUMN pim.product_variants.id                    IS '변형 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_variants.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_variants.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_variants.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_variants.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_variants.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_variants.sku                   IS 'SKU (Stock Keeping Unit)';
COMMENT ON COLUMN pim.product_variants.name                  IS '변형명 (예: 빨강-L)';
COMMENT ON COLUMN pim.product_variants.option_values         IS '옵션 값 조합 (JSON 배열: [{"option_id": "...", "value_id": "..."}])';
COMMENT ON COLUMN pim.product_variants.price                 IS '판매 가격';
COMMENT ON COLUMN pim.product_variants.cost_price            IS '원가';
COMMENT ON COLUMN pim.product_variants.stock_quantity        IS '재고 수량';
COMMENT ON COLUMN pim.product_variants.reserved_quantity     IS '예약 수량 (주문 대기 등)';
COMMENT ON COLUMN pim.product_variants.available_quantity    IS '가용 수량 (재고 - 예약)';
COMMENT ON COLUMN pim.product_variants.weight                IS '무게 (g)';
COMMENT ON COLUMN pim.product_variants.length                IS '길이 (cm)';
COMMENT ON COLUMN pim.product_variants.width                 IS '너비 (cm)';
COMMENT ON COLUMN pim.product_variants.height                IS '높이 (cm)';
COMMENT ON COLUMN pim.product_variants.image_url             IS '대표 이미지 URL';
COMMENT ON COLUMN pim.product_variants.barcode               IS '바코드';
COMMENT ON COLUMN pim.product_variants.description           IS '설명';
COMMENT ON COLUMN pim.product_variants.notes                 IS '비고';
COMMENT ON COLUMN pim.product_variants.status                IS '상태 (ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED)';
COMMENT ON COLUMN pim.product_variants.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_variants__sku
    ON pim.product_variants (sku)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_variants__sku IS 'SKU 유니크 제약';

CREATE UNIQUE INDEX ux_variants__product_options
    ON pim.product_variants (product_id, option_values)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_variants__product_options IS '제품별 옵션 조합 유니크 제약';

CREATE UNIQUE INDEX ux_variants__barcode
    ON pim.product_variants (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ux_variants__barcode IS '바코드 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_variants__product_id
    ON pim.product_variants (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_variants__product_id IS '제품별 변형 조회 인덱스';

CREATE INDEX ix_variants__option_values
    ON pim.product_variants USING GIN (option_values)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_variants__option_values IS '옵션 값 JSON 검색 인덱스';

CREATE INDEX ix_variants__stock
    ON pim.product_variants (stock_quantity, reserved_quantity)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_variants__stock IS '재고 수량별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 변형도 함께 삭제)
ALTER TABLE pim.product_variants
  ADD CONSTRAINT fk_variants__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_variants__product_id ON pim.product_variants IS '제품 참조 외래키 (CASCADE 삭제)';
