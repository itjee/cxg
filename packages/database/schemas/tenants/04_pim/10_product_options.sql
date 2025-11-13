-- =====================================================================================
-- 테이블: pim.product_options
-- 설명: 제품 옵션 그룹 관리 테이블 (색상, 사이즈 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_options 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 옵션 그룹 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 옵션 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    code             VARCHAR(50)              NOT NULL,                               -- 옵션 코드
    name             VARCHAR(100)             NOT NULL,                               -- 옵션명
    name_en          VARCHAR(100),                                                    -- 영문 옵션명
    
    -- 옵션 속성
    option_type             VARCHAR(20)              DEFAULT 'SELECT',                       -- 옵션 유형
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    is_required             BOOLEAN                  DEFAULT true,                           -- 필수 선택 여부
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 옵션 코드 형식 체크 (영문 대문자, 숫자, 언더스코어, 하이픈, 1-50자)
    CONSTRAINT ck_product_options__code             CHECK (code ~ '^[A-Z0-9_\-]{1,50}$'),
    
    -- 옵션 유형 체크 (SELECT: 선택, RADIO: 라디오, TEXT: 텍스트입력, COLOR: 색상, IMAGE: 이미지)
    CONSTRAINT ck_product_options__type             CHECK (option_type IN ('SELECT', 'RADIO', 'TEXT', 'COLOR', 'IMAGE')),
    
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_product_options__display_order    CHECK (display_order >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성)
    CONSTRAINT ck_product_options__status           CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_options                       IS '제품 옵션 그룹 관리 테이블 (색상, 사이즈 등)';
COMMENT ON COLUMN pim.product_options.id                    IS '옵션 그룹 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_options.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_options.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_options.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_options.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_options.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_options.code           IS '옵션 코드';
COMMENT ON COLUMN pim.product_options.name           IS '옵션명 (예: 색상, 사이즈)';
COMMENT ON COLUMN pim.product_options.name_en        IS '영문 옵션명';
COMMENT ON COLUMN pim.product_options.option_type           IS '옵션 유형 (SELECT/RADIO/TEXT/COLOR/IMAGE)';
COMMENT ON COLUMN pim.product_options.display_order         IS '표시 순서';
COMMENT ON COLUMN pim.product_options.is_required           IS '필수 선택 여부';
COMMENT ON COLUMN pim.product_options.description           IS '설명';
COMMENT ON COLUMN pim.product_options.notes                 IS '비고';
COMMENT ON COLUMN pim.product_options.status                IS '상태 (ACTIVE/INACTIVE)';
COMMENT ON COLUMN pim.product_options.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_product_options__product_code
    ON pim.product_options (product_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_product_options__product_code IS '제품별 옵션 코드 유니크 제약';

CREATE UNIQUE INDEX ux_product_options__product_order
    ON pim.product_options (product_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_product_options__product_order IS '제품별 표시 순서 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_product_options__product_id
    ON pim.product_options (product_id, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_options__product_id IS '제품별 옵션 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 옵션도 함께 삭제)
ALTER TABLE pim.product_options
  ADD CONSTRAINT fk_product_options__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_product_options__product_id ON pim.product_options IS '제품 참조 외래키 (CASCADE 삭제)';
