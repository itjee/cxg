-- =====================================================================================
-- 테이블: pim.product_units
-- 설명: 제품 단위 마스터 테이블 (개, 박스, 팩 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_units 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 단위 기본 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 단위 코드
    name                    VARCHAR(50)              NOT NULL,                               -- 단위명
    name_en                 VARCHAR(50),                                                     -- 영문 단위명
    symbol                  VARCHAR(10),                                                     -- 단위 기호
    
    -- 단위 분류
    unit_type               VARCHAR(20)              DEFAULT 'COUNT',                        -- 단위 유형
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 단위 코드 형식 체크 (영문 대문자, 숫자, 1-20자)
    CONSTRAINT ck_units__code                       CHECK (code ~ '^[A-Z0-9]{1,20}$'),
    
    -- 단위 유형 체크 (COUNT: 개수, WEIGHT: 무게, VOLUME: 부피, LENGTH: 길이, AREA: 면적, PACKAGE: 포장)
    CONSTRAINT ck_units__type                       CHECK (unit_type IN ('COUNT', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'PACKAGE')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성)
    CONSTRAINT ck_units__status                     CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_units                       IS '제품 단위 마스터 테이블 (개, 박스, 팩 등)';
COMMENT ON COLUMN pim.product_units.id                    IS '단위 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_units.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_units.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_units.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_units.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_units.code                  IS '단위 코드';
COMMENT ON COLUMN pim.product_units.name                  IS '단위명 (예: 개, 박스, 팩)';
COMMENT ON COLUMN pim.product_units.name_en               IS '영문 단위명';
COMMENT ON COLUMN pim.product_units.symbol                IS '단위 기호 (예: EA, BOX, PK)';
COMMENT ON COLUMN pim.product_units.unit_type             IS '단위 유형 (COUNT/WEIGHT/VOLUME/LENGTH/AREA/PACKAGE)';
COMMENT ON COLUMN pim.product_units.description           IS '설명';
COMMENT ON COLUMN pim.product_units.notes                 IS '비고';
COMMENT ON COLUMN pim.product_units.status                IS '상태 (ACTIVE/INACTIVE)';
COMMENT ON COLUMN pim.product_units.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_units__code
    ON pim.product_units (code)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_units__code IS '단위 코드 유니크 제약';

CREATE UNIQUE INDEX ux_units__name
    ON pim.product_units (name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_units__name IS '단위명 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_units__type
    ON pim.product_units (unit_type)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_units__type IS '단위 유형별 조회 인덱스';
