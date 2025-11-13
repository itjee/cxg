-- =====================================================================================
-- 테이블: pim.product_relations
-- 설명: 제품 연관 관계 관리 테이블 (관련상품, 대체상품, 구성상품 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_relations 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 관계 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 관계 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    related_product_id      UUID                     NOT NULL,                               -- 연관 제품 식별자
    relation_type           VARCHAR(20)              NOT NULL,                               -- 관계 유형
    
    -- 수량 정보 (세트 구성 시)
    quantity                NUMERIC(18,2)            DEFAULT 1,                              -- 수량
    
    -- 우선순위
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 관계 유형 체크 (RELATED: 관련상품, ALTERNATIVE: 대체상품, ACCESSORY: 액세서리, BUNDLE: 구성상품, UPGRADE: 업그레이드, CROSS_SELL: 교차판매, UP_SELL: 상향판매)
    CONSTRAINT ck_relations__type                   CHECK (relation_type IN ('RELATED', 'ALTERNATIVE', 'ACCESSORY', 'BUNDLE', 'UPGRADE', 'CROSS_SELL', 'UP_SELL')),
    
    -- 수량 양수 체크 (0 초과)
    CONSTRAINT ck_relations__quantity               CHECK (quantity > 0),
    
    -- 표시 순서 양수 체크 (0 이상)
    CONSTRAINT ck_relations__display_order          CHECK (display_order >= 0),
    
    -- 자기 참조 방지 체크
    CONSTRAINT ck_relations__not_self               CHECK (product_id != related_product_id),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성)
    CONSTRAINT ck_relations__status                 CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_relations                       IS '제품 연관 관계 관리 테이블 (관련상품, 대체상품, 구성상품 등)';
COMMENT ON COLUMN pim.product_relations.id                    IS '관계 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_relations.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_relations.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_relations.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_relations.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_relations.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_relations.related_product_id    IS '연관 제품 식별자';
COMMENT ON COLUMN pim.product_relations.relation_type         IS '관계 유형 (RELATED/ALTERNATIVE/ACCESSORY/BUNDLE/UPGRADE/CROSS_SELL/UP_SELL)';
COMMENT ON COLUMN pim.product_relations.quantity              IS '수량 (세트 구성 시)';
COMMENT ON COLUMN pim.product_relations.display_order         IS '표시 순서';
COMMENT ON COLUMN pim.product_relations.description           IS '설명';
COMMENT ON COLUMN pim.product_relations.notes                 IS '비고';
COMMENT ON COLUMN pim.product_relations.status                IS '상태 (ACTIVE/INACTIVE)';
COMMENT ON COLUMN pim.product_relations.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_relations__product_related_type
    ON pim.product_relations (product_id, related_product_id, relation_type)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_relations__product_related_type IS '제품별 연관 제품 및 관계 유형 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_relations__product_id
    ON pim.product_relations (product_id, relation_type, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_relations__product_id IS '제품별 연관 관계 조회 인덱스';

CREATE INDEX ix_relations__related_product_id
    ON pim.product_relations (related_product_id, relation_type)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_relations__related_product_id IS '연관 제품별 역방향 조회 인덱스';

CREATE INDEX ix_relations__type
    ON pim.product_relations (relation_type, product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_relations__type IS '관계 유형별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 연관 관계도 함께 삭제)
ALTER TABLE pim.product_relations
  ADD CONSTRAINT fk_relations__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_relations__product_id ON pim.product_relations IS '제품 참조 외래키 (CASCADE 삭제)';

-- 연관 제품 참조 외래키 (연관 제품 삭제 시 관계도 함께 삭제)
ALTER TABLE pim.product_relations
  ADD CONSTRAINT fk_relations__related_product_id
    FOREIGN KEY (related_product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_relations__related_product_id ON pim.product_relations IS '연관 제품 참조 외래키 (CASCADE 삭제)';
