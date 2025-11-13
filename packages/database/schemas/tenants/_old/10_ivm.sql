-- ============================================================================
-- Inventory Management Schema (ivm)
-- ============================================================================
-- Description: 재고 관리 스키마 (재고현황, 재고이동)
-- Database: tnnt_db (Tenant Database)
-- Schema: ivm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS ivm;

COMMENT ON SCHEMA ivm IS 'IVM: 재고 관리 스키마 (재고현황, 재고이동)';

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

-- =====================================================================================
-- 테이블: ivm.inventory_balances
-- 설명: 재고 현황 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_balances 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 재고 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                    -- 로트 번호
    serial_number           VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 재고 수량
    on_hand_qty             INTEGER                  DEFAULT 0,                              -- 현재고 수량
    available_qty           INTEGER                  DEFAULT 0,                              -- 가용 수량
    reserved_qty            INTEGER                  DEFAULT 0,                              -- 예약 수량
    
    -- 원가 정보
    avg_cost                NUMERIC(18,4)            DEFAULT 0,                              -- 평균 단가
    last_movement_date      TIMESTAMP WITH TIME ZONE,                                        -- 최종 이동 일시
    
    -- 외래키 제약 조건
    -- 창고 참조 외래키
    CONSTRAINT fk_inventory_balances__warehouse_id  FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id) ON DELETE RESTRICT,
    -- 로케이션 참조 외래키
    CONSTRAINT fk_inventory_balances__location_id   FOREIGN KEY (location_id) REFERENCES wms.warehouse_locations(id) ON DELETE SET NULL,
    -- 제품 참조 외래키
    CONSTRAINT fk_inventory_balances__product_id    FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 재고 수량 음수 불가 체크 (현재고, 가용, 예약 수량 모두 0 이상)
    CONSTRAINT ck_inventory_balances__quantities    CHECK (on_hand_qty >= 0 AND available_qty >= 0 AND reserved_qty >= 0),
    -- 평균 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_inventory_balances__avg_cost      CHECK (avg_cost >= 0)
);

COMMENT ON TABLE  ivm.inventory_balances                     IS '재고 현황 관리 테이블';
COMMENT ON COLUMN ivm.inventory_balances.id                  IS '재고 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_balances.created_at          IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_balances.created_by          IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_balances.updated_at          IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_balances.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_balances.warehouse_id        IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_balances.location_id         IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_balances.product_id          IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_balances.lot_number          IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_balances.serial_number       IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_balances.on_hand_qty         IS '현재고 수량';
COMMENT ON COLUMN ivm.inventory_balances.available_qty       IS '가용 수량 (현재고 - 예약)';
COMMENT ON COLUMN ivm.inventory_balances.reserved_qty        IS '예약 수량';
COMMENT ON COLUMN ivm.inventory_balances.avg_cost            IS '평균 단가';
COMMENT ON COLUMN ivm.inventory_balances.last_movement_date  IS '최종 이동 일시';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_id
    ON ivm.inventory_balances (warehouse_id);
COMMENT ON INDEX ix_inventory_balances__warehouse_id IS '창고별 재고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__product_id
    ON ivm.inventory_balances (product_id);
COMMENT ON INDEX ix_inventory_balances__product_id IS '제품별 재고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__location_id
    ON ivm.inventory_balances (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ix_inventory_balances__location_id IS '로케이션별 재고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__lot_number
    ON ivm.inventory_balances (lot_number)
 WHERE lot_number IS NOT NULL;
COMMENT ON INDEX ix_inventory_balances__lot_number IS '로트 번호별 재고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__serial_number
    ON ivm.inventory_balances (serial_number)
 WHERE serial_number IS NOT NULL;
COMMENT ON INDEX ix_inventory_balances__serial_number IS '시리얼 번호별 재고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__available_qty
    ON ivm.inventory_balances (warehouse_id, product_id)
 WHERE available_qty > 0;
COMMENT ON INDEX ix_inventory_balances__available_qty IS '가용 재고 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 창고별 제품/로트/시리얼 조합 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_balances__item_location 
    ON ivm.inventory_balances (warehouse_id, product_id, COALESCE(lot_number, ''), COALESCE(serial_number, ''));
COMMENT ON INDEX ux_inventory_balances__item_location IS '창고별 제품/로트/시리얼 조합 유니크 제약';


-- =====================================================================================
-- 테이블: ivm.inventory_movements
-- 설명: 재고 이동 이력 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_movements 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이동 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    movement_code           VARCHAR(50)              NOT NULL,                               -- 이동 코드
    doc_date                DATE                     NOT NULL,                               -- 전표 일자
    movement_type           VARCHAR(20)              NOT NULL,                               -- 이동 유형
    
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형
    reference_doc_id        UUID,                                                            -- 참조 문서 식별자
    
    -- 위치 및 품목 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                    -- 로트 번호
    serial_number           VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 및 원가
    qty                     INTEGER                  NOT NULL,                               -- 이동 수량
    unit_cost               NUMERIC(18,4)            DEFAULT 0,                              -- 단가
    total_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 총 원가
    
    -- 사유
    reason_code             VARCHAR(50),                                                     -- 사유 코드
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약 조건
    -- 창고 참조 외래키
    CONSTRAINT fk_inventory_movements__warehouse_id FOREIGN KEY (warehouse_id) REFERENCES wms.warehouses(id) ON DELETE RESTRICT,
    -- 로케이션 참조 외래키
    CONSTRAINT fk_inventory_movements__location_id  FOREIGN KEY (location_id) REFERENCES wms.warehouse_locations(id) ON DELETE SET NULL,
    -- 제품 참조 외래키
    CONSTRAINT fk_inventory_movements__product_id   FOREIGN KEY (product_id) REFERENCES pim.products(id) ON DELETE RESTRICT,
    
    -- 제약조건
    -- 이동 유형 체크 (IN: 입고, OUT: 출고, TRANSFER: 이동, ADJUSTMENT: 조정)
    CONSTRAINT ck_inventory_movements__movement_type    CHECK (movement_type IN ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT')),
    -- 이동 수량 0 불가 체크 (0이 아닌 값만 허용)
    CONSTRAINT ck_inventory_movements__qty              CHECK (qty != 0),
    -- 원가 음수 불가 체크 (단가, 총원가 모두 0 이상)
    CONSTRAINT ck_inventory_movements__costs            CHECK (unit_cost >= 0 AND total_cost >= 0)
);

COMMENT ON TABLE  ivm.inventory_movements                    IS '재고 이동 이력 관리 테이블';
COMMENT ON COLUMN ivm.inventory_movements.id                 IS '이동 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_movements.created_at         IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_movements.created_by         IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_movements.updated_at         IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_movements.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_movements.movement_code      IS '이동 코드 (이동번호)';
COMMENT ON COLUMN ivm.inventory_movements.doc_date           IS '전표 일자';
COMMENT ON COLUMN ivm.inventory_movements.movement_type      IS '이동 유형 (IN/OUT/TRANSFER/ADJUSTMENT)';
COMMENT ON COLUMN ivm.inventory_movements.reference_doc_type IS '참조 문서 유형 (PO/SO/TRANSFER 등)';
COMMENT ON COLUMN ivm.inventory_movements.reference_doc_id   IS '참조 문서 식별자';
COMMENT ON COLUMN ivm.inventory_movements.warehouse_id       IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_movements.location_id        IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_movements.product_id         IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_movements.lot_number         IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_movements.serial_number      IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_movements.qty                IS '이동 수량 (입고: 양수, 출고: 음수)';
COMMENT ON COLUMN ivm.inventory_movements.unit_cost          IS '단가';
COMMENT ON COLUMN ivm.inventory_movements.total_cost         IS '총 원가 (수량 × 단가)';
COMMENT ON COLUMN ivm.inventory_movements.reason_code        IS '사유 코드';
COMMENT ON COLUMN ivm.inventory_movements.notes              IS '비고';

-- =====================================================================================
-- 인덱스
-- =====================================================================================
CREATE INDEX IF NOT EXISTS ix_inventory_movements__movement_code
    ON ivm.inventory_movements (movement_code);
COMMENT ON INDEX ix_inventory_movements__movement_code IS '이동 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__warehouse_id
    ON ivm.inventory_movements (warehouse_id);
COMMENT ON INDEX ix_inventory_movements__warehouse_id IS '창고별 이동 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__product_id
    ON ivm.inventory_movements (product_id);
COMMENT ON INDEX ix_inventory_movements__product_id IS '제품별 이동 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__location_id
    ON ivm.inventory_movements (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ix_inventory_movements__location_id IS '로케이션별 이동 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__movement_type
    ON ivm.inventory_movements (movement_type, warehouse_id);
COMMENT ON INDEX ix_inventory_movements__movement_type IS '이동 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__doc_date
    ON ivm.inventory_movements (doc_date DESC);
COMMENT ON INDEX ix_inventory_movements__doc_date IS '전표 일자별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__reference_doc
    ON ivm.inventory_movements (reference_doc_type, reference_doc_id)
 WHERE reference_doc_id IS NOT NULL;
COMMENT ON INDEX ix_inventory_movements__reference_doc IS '참조 문서별 이동 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__lot_number
    ON ivm.inventory_movements (lot_number)
 WHERE lot_number IS NOT NULL;
COMMENT ON INDEX ix_inventory_movements__lot_number IS '로트 번호별 이동 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__serial_number
    ON ivm.inventory_movements (serial_number)
 WHERE serial_number IS NOT NULL;
COMMENT ON INDEX ix_inventory_movements__serial_number IS '시리얼 번호별 이동 이력 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 이동 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_movements__code 
    ON ivm.inventory_movements (movement_code);
COMMENT ON INDEX ux_inventory_movements__code IS '이동 코드 유니크 제약';

