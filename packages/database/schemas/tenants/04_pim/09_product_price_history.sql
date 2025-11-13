-- =====================================================================================
-- 테이블: pim.product_price_history
-- 설명: 제품 가격 변경 이력 관리 테이블
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_price_history 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 가격 이력 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 가격 이력 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    price_type              VARCHAR(20)              NOT NULL,                               -- 가격 유형
    
    -- 가격 정보
    old_price               NUMERIC(18,4),                                                   -- 변경 전 가격
    new_price               NUMERIC(18,4)            NOT NULL,                               -- 변경 후 가격
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 적용 기간
    effective_date          DATE                     NOT NULL,                               -- 적용 시작일
    end_date                DATE,                                                            -- 적용 종료일
    
    -- 변경 사유
    reason                  VARCHAR(200),                                                    -- 변경 사유
    reason_type             VARCHAR(20),                                                     -- 사유 유형
    
    -- 승인 정보
    approved_by             UUID,                                                            -- 승인자 UUID
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시
    
    -- 추가 정보
    description             TEXT,                                                            -- 상세 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 가격 유형 체크 (COST: 원가, SELL: 판매가, MIN_SELL: 최소판매가, SUPPLY: 공급가, RETAIL: 소비자가)
    CONSTRAINT ck_price_history__type               CHECK (price_type IN ('COST', 'SELL', 'MIN_SELL', 'SUPPLY', 'RETAIL')),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_price_history__currency           CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 변경 전 가격 양수 체크 (0 이상)
    CONSTRAINT ck_price_history__old_price          CHECK (old_price IS NULL OR old_price >= 0),
    
    -- 변경 후 가격 양수 체크 (0 이상)
    CONSTRAINT ck_price_history__new_price          CHECK (new_price >= 0),
    
    -- 적용 기간 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_price_history__date_range         CHECK (end_date IS NULL OR end_date >= effective_date),
    
    -- 사유 유형 체크 (PROMOTION: 프로모션, COST_CHANGE: 원가변동, MARKET: 시장상황, SEASONAL: 시즌, POLICY: 정책, OTHER: 기타)
    CONSTRAINT ck_price_history__reason_type        CHECK (reason_type IS NULL OR reason_type IN ('PROMOTION', 'COST_CHANGE', 'MARKET', 'SEASONAL', 'POLICY', 'OTHER')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, CANCELLED: 취소)
    CONSTRAINT ck_price_history__status             CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'CANCELLED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_price_history                       IS '제품 가격 변경 이력 관리 테이블';
COMMENT ON COLUMN pim.product_price_history.id                    IS '가격 이력 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_price_history.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_price_history.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_price_history.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_price_history.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_price_history.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_price_history.price_type            IS '가격 유형 (COST/SELL/MIN_SELL/SUPPLY/RETAIL)';
COMMENT ON COLUMN pim.product_price_history.old_price             IS '변경 전 가격';
COMMENT ON COLUMN pim.product_price_history.new_price             IS '변경 후 가격';
COMMENT ON COLUMN pim.product_price_history.currency              IS '통화 (ISO 4217)';
COMMENT ON COLUMN pim.product_price_history.effective_date        IS '적용 시작일';
COMMENT ON COLUMN pim.product_price_history.end_date              IS '적용 종료일';
COMMENT ON COLUMN pim.product_price_history.reason                IS '변경 사유';
COMMENT ON COLUMN pim.product_price_history.reason_type           IS '사유 유형 (PROMOTION/COST_CHANGE/MARKET/SEASONAL/POLICY/OTHER)';
COMMENT ON COLUMN pim.product_price_history.approved_by           IS '승인자 UUID';
COMMENT ON COLUMN pim.product_price_history.approved_at           IS '승인 일시';
COMMENT ON COLUMN pim.product_price_history.description           IS '상세 설명';
COMMENT ON COLUMN pim.product_price_history.notes                 IS '비고';
COMMENT ON COLUMN pim.product_price_history.status                IS '상태 (ACTIVE/INACTIVE/EXPIRED/CANCELLED)';
COMMENT ON COLUMN pim.product_price_history.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_price_history__product_type_date
    ON pim.product_price_history (product_id, price_type, effective_date)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_price_history__product_type_date IS '제품별 가격유형 및 적용일 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_price_history__product_id
    ON pim.product_price_history (product_id, price_type, effective_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_price_history__product_id IS '제품별 가격 이력 조회 인덱스';

CREATE INDEX ix_price_history__effective_date
    ON pim.product_price_history (effective_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_price_history__effective_date IS '적용 기간별 조회 인덱스';

-- CREATE INDEX ix_price_history__active
--     ON pim.product_price_history (product_id, price_type)
--  WHERE status = 'ACTIVE' 
--    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
--    AND effective_date <= CURRENT_DATE
--    AND is_deleted = false;
-- COMMENT ON INDEX pim.ix_price_history__active IS '현재 활성 가격 조회 인덱스';

CREATE INDEX ix_price_history__reason_type
    ON pim.product_price_history (reason_type, effective_date DESC)
 WHERE reason_type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_price_history__reason_type IS '사유 유형별 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 가격 이력도 함께 삭제)
ALTER TABLE pim.product_price_history
  ADD CONSTRAINT fk_price_history__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_price_history__product_id ON pim.product_price_history IS '제품 참조 외래키 (CASCADE 삭제)';
