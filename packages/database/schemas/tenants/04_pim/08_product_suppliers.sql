-- =====================================================================================
-- 테이블: pim.product_suppliers
-- 설명: 제품 공급업체 관리 테이블
-- 작성일: 2025-01-24
-- 수정일: 2025-01-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS pim.product_suppliers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 공급업체 관계 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 공급업체 기본 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자
    supplier_code           VARCHAR(50),                                                     -- 공급업체의 제품 코드
    supplier_name           VARCHAR(200),                                                    -- 공급업체의 제품명
    
    -- 가격 정보
    supply_price            NUMERIC(18,4),                                                   -- 공급 가격
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 납기 및 주문 정보
    lead_time_days          INTEGER,                                                         -- 리드타임 (일)
    moq                     NUMERIC(18,2),                                                   -- 최소 주문 수량 (MOQ)
    moq_unit                VARCHAR(20),                                                     -- MOQ 단위
    
    -- 우선순위
    is_preferred            BOOLEAN                  DEFAULT false,                          -- 주 공급업체 여부
    priority                INTEGER                  DEFAULT 0,                              -- 우선순위
    
    -- 계약 정보
    contract_start_date     DATE,                                                            -- 계약 시작일
    contract_end_date       DATE,                                                            -- 계약 종료일
    contract_no             VARCHAR(50),                                                     -- 계약 번호
    
    -- 품질 및 평가
    quality_rating          INTEGER,                                                         -- 품질 평가 (1-5)
    delivery_rating         INTEGER,                                                         -- 납기 평가 (1-5)
    
    -- 추가 정보
    description             TEXT,                                                            -- 설명
    
    -- 상태 관리
    notes                   TEXT,                                                            -- 비고
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_product_suppliers__currency       CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 공급 가격 양수 체크 (0 이상)
    CONSTRAINT ck_product_suppliers__price          CHECK (supply_price IS NULL OR supply_price >= 0),
    
    -- 리드타임 양수 체크 (0 이상)
    CONSTRAINT ck_product_suppliers__lead_time      CHECK (lead_time_days IS NULL OR lead_time_days >= 0),
    
    -- MOQ 양수 체크 (0 초과)
    CONSTRAINT ck_product_suppliers__moq            CHECK (moq IS NULL OR moq > 0),
    
    -- 우선순위 양수 체크 (0 이상)
    CONSTRAINT ck_product_suppliers__priority       CHECK (priority >= 0),
    
    -- 품질 평가 범위 체크 (1-5)
    CONSTRAINT ck_product_suppliers__quality        CHECK (quality_rating IS NULL OR quality_rating BETWEEN 1 AND 5),
    
    -- 납기 평가 범위 체크 (1-5)
    CONSTRAINT ck_product_suppliers__delivery       CHECK (delivery_rating IS NULL OR delivery_rating BETWEEN 1 AND 5),
    
    -- 계약 기간 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_product_suppliers__contract       CHECK (contract_end_date IS NULL OR contract_start_date IS NULL OR contract_end_date >= contract_start_date),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 중단, TERMINATED: 종료)
    CONSTRAINT ck_product_suppliers__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  pim.product_suppliers                       IS '제품 공급업체 관리 테이블';
COMMENT ON COLUMN pim.product_suppliers.id                    IS '공급업체 관계 고유 식별자 (UUID)';
COMMENT ON COLUMN pim.product_suppliers.created_at            IS '등록 일시';
COMMENT ON COLUMN pim.product_suppliers.created_by            IS '등록자 UUID';
COMMENT ON COLUMN pim.product_suppliers.updated_at            IS '수정 일시';
COMMENT ON COLUMN pim.product_suppliers.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN pim.product_suppliers.product_id            IS '제품 식별자';
COMMENT ON COLUMN pim.product_suppliers.supplier_id           IS '공급업체 식별자';
COMMENT ON COLUMN pim.product_suppliers.supplier_code         IS '공급업체의 제품 코드';
COMMENT ON COLUMN pim.product_suppliers.supplier_name         IS '공급업체의 제품명';
COMMENT ON COLUMN pim.product_suppliers.supply_price          IS '공급 가격';
COMMENT ON COLUMN pim.product_suppliers.currency              IS '통화 (ISO 4217)';
COMMENT ON COLUMN pim.product_suppliers.lead_time_days        IS '리드타임 (일수)';
COMMENT ON COLUMN pim.product_suppliers.moq                   IS '최소 주문 수량 (Minimum Order Quantity)';
COMMENT ON COLUMN pim.product_suppliers.moq_unit              IS 'MOQ 단위';
COMMENT ON COLUMN pim.product_suppliers.is_preferred          IS '주 공급업체 여부';
COMMENT ON COLUMN pim.product_suppliers.priority              IS '우선순위 (낮을수록 우선)';
COMMENT ON COLUMN pim.product_suppliers.contract_start_date   IS '계약 시작일';
COMMENT ON COLUMN pim.product_suppliers.contract_end_date     IS '계약 종료일';
COMMENT ON COLUMN pim.product_suppliers.contract_no           IS '계약 번호';
COMMENT ON COLUMN pim.product_suppliers.quality_rating        IS '품질 평가 (1-5점)';
COMMENT ON COLUMN pim.product_suppliers.delivery_rating       IS '납기 평가 (1-5점)';
COMMENT ON COLUMN pim.product_suppliers.description           IS '설명';
COMMENT ON COLUMN pim.product_suppliers.notes                 IS '비고';
COMMENT ON COLUMN pim.product_suppliers.status                IS '상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)';
COMMENT ON COLUMN pim.product_suppliers.is_deleted            IS '논리 삭제 플래그';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX ux_product_suppliers__product_supplier
    ON pim.product_suppliers (product_id, supplier_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ux_product_suppliers__product_supplier IS '제품-공급업체 유니크 제약';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX ix_product_suppliers__product_id
    ON pim.product_suppliers (product_id, priority)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_suppliers__product_id IS '제품별 공급업체 조회 인덱스';

CREATE INDEX ix_product_suppliers__supplier_id
    ON pim.product_suppliers (supplier_id)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_suppliers__supplier_id IS '공급업체별 제품 조회 인덱스';

CREATE INDEX ix_product_suppliers__preferred
    ON pim.product_suppliers (product_id)
 WHERE is_preferred = true 
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_product_suppliers__preferred IS '주 공급업체 조회 인덱스';

CREATE INDEX ix_product_suppliers__contract
    ON pim.product_suppliers (contract_end_date)
 WHERE contract_end_date IS NOT NULL 
   AND status = 'ACTIVE'
   AND is_deleted = false;
COMMENT ON INDEX pim.ix_product_suppliers__contract IS '계약 만료 예정 조회 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 제품 참조 외래키 (제품 삭제 시 공급업체 관계도 함께 삭제)
ALTER TABLE pim.product_suppliers
  ADD CONSTRAINT fk_product_suppliers__product_id
    FOREIGN KEY (product_id)     
    REFERENCES pim.products(id)
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_product_suppliers__product_id ON pim.product_suppliers IS '제품 참조 외래키 (CASCADE 삭제)';
