-- =====================================================================================
-- 테이블: pim.product_option_values
-- 설명: 제품 옵션 값 관리 테이블 (빨강, 파랑, S, M, L 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_option_values 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 옵션 값 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 옵션 값 기본 정보
    option_id               UUID                     NOT NULL,                               -- 옵션 그룹 식별자
    code                    VARCHAR(50)              NOT NULL,                               -- 옵션 값 코드
    name                    VARCHAR(100)             NOT NULL,                               -- 옵션 값명
    name_en                 VARCHAR(100),                                                    -- 영문 옵션 값명
    
    -- 옵션 값 속성
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    color_code              VARCHAR(20),                                                     -- 색상 코드 (hex)
    image_url               VARCHAR(500),                                                    -- 이미지 URL
    
    -- 가격 조정
    price_adjustment        NUMERIC(18,4)            DEFAULT 0,                              -- 가격 조정 금액
    adjustment_type         VARCHAR(20)              DEFAULT 'FIXED',                        -- 조정 유형
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 옵션 값 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-50자)
    CONSTRAINT ck_option_values__code               CHECK (code ~ '^[A-Z0-9_\-]{1,50}$'),
    
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_option_values__display_order      CHECK (display_order >= 0),
    
    -- 색상 코드 형식 체크 (HEX 색상코드 #000000 ~ #FFFFFF)
    CONSTRAINT ck_option_values__color              CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$'),
    
    -- 조정 유형 체크 (FIXED: 고정금액, PERCENT: 백분율)
    CONSTRAINT ck_option_values__adjustment_type    CHECK (adjustment_type IN ('FIXED', 'PERCENT')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, OUT_OF_STOCK: 품절)
    CONSTRAINT ck_option_values__status             CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_option_values                       IS '제품 옵션 값 관리 테이블 (빨강, 파랑, S, M, L 등)';
COMMENT ON COLUMN pim.product_option_values.id                    IS '옵션 값 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_option_values.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_option_values.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_option_values.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_option_values.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_option_values.option_id             IS '옵션 그룹 식별자';
COMMENT ON COLUMN pim.product_option_values.code                IS '옵션 값 코드';
COMMENT ON COLUMN pim.product_option_values.name                IS '옵션 값명 (예: 빨강, S)';
COMMENT ON COLUMN pim.product_option_values.name_en             IS '영문 옵션 값명';
COMMENT ON COLUMN pim.product_option_values.display_order         IS '표시 순서';
COMMENT ON COLUMN pim.product_option_values.color_code            IS '색상 코드 (hex)';
COMMENT ON COLUMN pim.product_option_values.image_url             IS '이미지 URL';
COMMENT ON COLUMN pim.product_option_values.price_adjustment      IS '가격 조정 금액';
COMMENT ON COLUMN pim.product_option_values.adjustment_type       IS '조정 유형 (FIXED/PERCENT)';
COMMENT ON COLUMN pim.product_option_values.description           IS '설명';
COMMENT ON COLUMN pim.product_option_values.notes                 IS '비고';
COMMENT ON COLUMN pim.product_option_values.status                IS '상태 (ACTIVE/INACTIVE/OUT_OF_STOCK)';
COMMENT ON COLUMN pim.product_option_values.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_option_values__option_code
    ON pim.product_option_values (option_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_option_values__option_code IS '옵션별 값 코드 유니크 제약';

CREATE UNIQUE INDEX ux_option_values__option_order
    ON pim.product_option_values (option_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_option_values__option_order IS '옵션별 표시 순서 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_option_values__option_id
    ON pim.product_option_values (option_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_option_values__option_id IS '옵션별 값 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 옵션 그룹 참조 외래키 (옵션 그룹 삭제 시 옵션 값도 함께 삭제)
ALTER TABLE pim.product_option_values
  ADD CONSTRAINT fk_option_values__option_id
    FOREIGN KEY (option_id)     
    REFERENCES pim.product_options(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_option_values__option_id ON pim.product_option_values IS '옵션 그룹 참조 외래키 (CASCADE 삭제)';
