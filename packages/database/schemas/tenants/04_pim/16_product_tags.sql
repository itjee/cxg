-- =====================================================================================
-- 테이블: pim.product_tags
-- 설명: 제품 태그 관리 테이블 (신제품, 인기, 할인 등)
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_tags 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 태그 관계 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 태그 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    tag_name                VARCHAR(50)              NOT NULL,                               -- 태그명
    tag_type                VARCHAR(20)              DEFAULT 'GENERAL',                      -- 태그 유형
    
    -- 태그 속성
    color_code              VARCHAR(20),                                                     -- 색상 코드 (hex)
    
    -- 기간 정보 (시즌, 프로모션 태그)
    start_date              DATE,                                                            -- 시작일
    end_date                DATE,                                                            -- 종료일
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 태그 유형 체크 (GENERAL: 일반, PROMOTION: 프로모션, SEASONAL: 시즌, NEW: 신상품, BEST: 베스트, SALE: 할인, FEATURED: 추천)
    CONSTRAINT ck_tags__type                        CHECK (tag_type IN ('GENERAL', 'PROMOTION', 'SEASONAL', 'NEW', 'BEST', 'SALE', 'FEATURED')),
    
    -- 색상 코드 형식 체크 (HEX 색상코드 #000000 ~ #FFFFFF)
    CONSTRAINT ck_tags__color                       CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$'),
    
    -- 기간 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_tags__date_range                  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료)
    CONSTRAINT ck_tags__status                      CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_tags                       IS '제품 태그 관리 테이블 (신제품, 인기, 할인 등)';
COMMENT ON COLUMN pim.product_tags.id                    IS '태그 관계 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_tags.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_tags.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_tags.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_tags.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_tags.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_tags.tag_name              IS '태그명';
COMMENT ON COLUMN pim.product_tags.tag_type              IS '태그 유형 (GENERAL/PROMOTION/SEASONAL/NEW/BEST/SALE/FEATURED)';
COMMENT ON COLUMN pim.product_tags.color_code            IS '색상 코드 (hex)';
COMMENT ON COLUMN pim.product_tags.start_date            IS '시작일 (시즌, 프로모션 태그)';
COMMENT ON COLUMN pim.product_tags.end_date              IS '종료일 (시즌, 프로모션 태그)';
COMMENT ON COLUMN pim.product_tags.description           IS '설명';
COMMENT ON COLUMN pim.product_tags.notes                 IS '비고';
COMMENT ON COLUMN pim.product_tags.status                IS '상태 (ACTIVE/INACTIVE/EXPIRED)';
COMMENT ON COLUMN pim.product_tags.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_tags__product_tag
    ON pim.product_tags (product_id, tag_name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_tags__product_tag IS '제품별 태그명 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_tags__product_id
    ON pim.product_tags (product_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_tags__product_id IS '제품별 태그 조회 인덱스';

CREATE INDEX ix_tags__tag_name
    ON pim.product_tags (tag_name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_tags__tag_name IS '태그명별 제품 조회 인덱스';

CREATE INDEX ix_tags__type
    ON pim.product_tags (tag_type, tag_name)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_tags__type IS '태그 유형별 조회 인덱스';

CREATE INDEX ix_tags__date_range
    ON pim.product_tags (start_date, end_date)
 WHERE start_date IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_tags__date_range IS '기간별 태그 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 태그도 함께 삭제)
ALTER TABLE pim.product_tags
  ADD CONSTRAINT fk_tags__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_tags__product_id ON pim.product_tags IS '제품 참조 외래키 (CASCADE 삭제)';
