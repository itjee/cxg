-- =====================================================================================
-- 테이블: adm.units
-- 설명: 단위 테이블 - 재고, 수량, 길이, 무게 등의 측정 단위 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.units 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 단위 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 단위 코드 (영대문자, 숫자)
    name                    VARCHAR(100)             NOT NULL,                               -- 단위명 (한글명)
    name_en                 VARCHAR(100),                                                    -- 단위명 (영문명) (추가 - 다국어 지원)
    unit_type               VARCHAR(20),                                                     -- 단위 유형 (QUANTITY/WEIGHT/LENGTH/VOLUME/AREA 등)
    symbol                  VARCHAR(10),                                                     -- 단위 심볼 (추가 - kg, m, L 등)
    
    -- 환산 정보 (추가)
    base_unit_id            UUID,                                                            -- 기준 단위 식별자 (추가 - 단위 환산용)
    conversion_rate         NUMERIC(18,6),                                                   -- 기준 단위 환산율 (추가 - 예: 1kg = 1000g)
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_base_unit            BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 단위 여부 (추가 - 유형별 기준)
    
    -- 단위 코드 형식 체크 (영대문자, 숫자 1-20자)
    CONSTRAINT ck_units__code                       CHECK (code ~ '^[A-Z0-9]{1,20}$'),
    
    -- 환산율 양수 체크
    CONSTRAINT ck_units__conversion_rate            CHECK (conversion_rate IS NULL OR conversion_rate > 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.units                              IS '단위 테이블 - 재고, 수량, 길이, 무게 등의 측정 단위 관리';
COMMENT ON COLUMN adm.units.id                           IS '단위 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.units.created_at                   IS '등록 일시';
COMMENT ON COLUMN adm.units.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN adm.units.updated_at                   IS '수정 일시';
COMMENT ON COLUMN adm.units.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN adm.units.code                         IS '단위 코드 (영대문자, 숫자 1-20자, 예: EA, KG, M, L)';
COMMENT ON COLUMN adm.units.name                         IS '단위명 (한글명, 예: 개, 킬로그램, 미터, 리터)';
COMMENT ON COLUMN adm.units.name_en                      IS '단위명 (영문명, 예: Each, Kilogram, Meter, Liter)';
COMMENT ON COLUMN adm.units.unit_type                    IS '단위 유형 (QUANTITY: 개수, WEIGHT: 무게, LENGTH: 길이, VOLUME: 부피, AREA: 면적 등)';
COMMENT ON COLUMN adm.units.symbol                       IS '단위 심볼 (예: kg, m, L, ㎡)';
COMMENT ON COLUMN adm.units.base_unit_id                 IS '기준 단위 식별자 (단위 환산용, 예: g의 기준은 kg)';
COMMENT ON COLUMN adm.units.conversion_rate              IS '기준 단위 환산율 (예: 1kg = 1000g 이면 g의 환산율은 0.001)';
COMMENT ON COLUMN adm.units.is_active                    IS '활성 여부';
COMMENT ON COLUMN adm.units.is_base_unit                 IS '기준 단위 여부 (유형별 기준 단위 표시)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_units__code 
    ON adm.units (code);
COMMENT ON INDEX adm.ux_units__code IS '단위 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_units__unit_type 
    ON adm.units (unit_type)
 WHERE is_active = true;
COMMENT ON INDEX adm.ix_units__unit_type IS '단위 유형별 조회 인덱스';

CREATE INDEX ix_units__is_active 
    ON adm.units (is_active);
COMMENT ON INDEX adm.ix_units__is_active IS '활성 단위 조회 인덱스';

CREATE INDEX ix_units__base_unit_id 
    ON adm.units (base_unit_id)
 WHERE base_unit_id IS NOT NULL;
COMMENT ON INDEX adm.ix_units__base_unit_id IS '기준 단위별 파생 단위 조회 인덱스';

-- 외래키 제약조건
-- 기준 단위 참조 (자기 참조)
ALTER TABLE adm.units 
  ADD CONSTRAINT fk_units__base_unit_id
    FOREIGN KEY (base_unit_id) 
    REFERENCES adm.units(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_units__base_unit_id ON adm.units IS '기준 단위 참조 외래키 (자기 참조, SET NULL 삭제)';
