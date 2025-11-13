-- =====================================================================================
-- 테이블: pim.product_unit_conversions
-- 설명: 제품 단위 변환 테이블 (1박스 = 12개)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_unit_conversions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 변환 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 단위 변환 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    from_unit_id            UUID                     NOT NULL,                               -- 원단위 식별자
    to_unit_id              UUID                     NOT NULL,                               -- 변환단위 식별자
    
    -- 변환 비율
    conversion_rate         NUMERIC(18,6)            NOT NULL,                               -- 변환 비율
    
    -- 우선순위
    is_default              BOOLEAN                  DEFAULT false,                          -- 기본 변환 여부
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 변환 비율 양수 체크 (0 초과)
    CONSTRAINT ck_conversions__rate                 CHECK (conversion_rate > 0),
    
    -- 동일 단위 변환 방지 체크
    CONSTRAINT ck_conversions__different_units      CHECK (from_unit_id != to_unit_id),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성)
    CONSTRAINT ck_conversions__status               CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_unit_conversions                       IS '제품 단위 변환 테이블 (1박스 = 12개)';
COMMENT ON COLUMN pim.product_unit_conversions.id                    IS '단위 변환 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_unit_conversions.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_unit_conversions.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_unit_conversions.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_unit_conversions.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_unit_conversions.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_unit_conversions.from_unit_id          IS '원단위 식별자';
COMMENT ON COLUMN pim.product_unit_conversions.to_unit_id            IS '변환단위 식별자';
COMMENT ON COLUMN pim.product_unit_conversions.conversion_rate       IS '변환 비율 (예: 1박스 = 12개 -> 12)';
COMMENT ON COLUMN pim.product_unit_conversions.is_default            IS '기본 변환 여부';
COMMENT ON COLUMN pim.product_unit_conversions.description           IS '설명';
COMMENT ON COLUMN pim.product_unit_conversions.notes                 IS '비고';
COMMENT ON COLUMN pim.product_unit_conversions.status                IS '상태 (ACTIVE/INACTIVE)';
COMMENT ON COLUMN pim.product_unit_conversions.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_conversions__product_units
    ON pim.product_unit_conversions (product_id, from_unit_id, to_unit_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_conversions__product_units IS '제품별 단위 변환 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_conversions__product_id
    ON pim.product_unit_conversions (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_conversions__product_id IS '제품별 단위 변환 조회 인덱스';

CREATE INDEX ix_conversions__from_unit
    ON pim.product_unit_conversions (from_unit_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_conversions__from_unit IS '원단위별 조회 인덱스';

CREATE INDEX ix_conversions__to_unit
    ON pim.product_unit_conversions (to_unit_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_conversions__to_unit IS '변환단위별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 단위 변환도 함께 삭제)
ALTER TABLE pim.product_unit_conversions
  ADD CONSTRAINT fk_conversions__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_conversions__product_id ON pim.product_unit_conversions IS '제품 참조 외래키 (CASCADE 삭제)';

-- 원단위 참조 외래키 (단위 삭제 시 변환 관계 삭제 불가)
ALTER TABLE pim.product_unit_conversions
  ADD CONSTRAINT fk_conversions__from_unit_id
    FOREIGN KEY (from_unit_id)     
    REFERENCES pim.product_units(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_conversions__from_unit_id ON pim.product_unit_conversions IS '원단위 참조 외래키 (RESTRICT 삭제)';

-- 변환단위 참조 외래키 (단위 삭제 시 변환 관계 삭제 불가)
ALTER TABLE pim.product_unit_conversions
  ADD CONSTRAINT fk_conversions__to_unit_id
    FOREIGN KEY (to_unit_id)     
    REFERENCES pim.product_units(id)
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_conversions__to_unit_id ON pim.product_unit_conversions IS '변환단위 참조 외래키 (RESTRICT 삭제)';
