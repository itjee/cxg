-- =====================================================================================
-- 테이블: ivm.inventory_count_items
-- 설명: 재고 실사 상세 항목 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_count_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 실사 항목 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 실사 참조
    count_id                UUID                     NOT NULL,                               -- 실사 식별자
    
    -- 제품 및 위치 정보
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    location_id             UUID,                                                            -- 로케이션 식별자
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호
    
    -- 수량 정보
    system_qty              INTEGER                  NOT NULL,                               -- 시스템 수량
    counted_qty             INTEGER,                                                         -- 실사 수량
    variance_qty            INTEGER,                                                         -- 차이 수량 (counted - system)
    
    -- 실사 정보
    counted_by              UUID,                                                            -- 실사자 UUID
    counted_at              TIMESTAMP WITH TIME ZONE,                                        -- 실사 일시
    is_recount_required     BOOLEAN                  DEFAULT false,                          -- 재실사 필요 여부
    recount_count           INTEGER                  DEFAULT 0,                              -- 재실사 횟수
    
    -- 차이 분석
    variance_reason_code    VARCHAR(50),                                                     -- 차이 사유 코드
    variance_reason         TEXT,                                                            -- 차이 사유
    
    -- 조정 연동
    adjustment_id           UUID,                                                            -- 조정 식별자
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 실사 참조 외래키 (실사 삭제 시 항목도 함께 삭제)
    CONSTRAINT fk_inventory_count_items__count_id       FOREIGN KEY (count_id) 
                                                        REFERENCES ivm.inventory_counts(id) 
                                                        ON DELETE CASCADE,
    
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_count_items__warehouse_id   FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_count_items__location_id    FOREIGN KEY (location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_count_items__product_id     FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- 조정 참조 외래키 (조정 삭제 시 NULL)
    CONSTRAINT fk_inventory_count_items__adjustment_id  FOREIGN KEY (adjustment_id) 
                                                        REFERENCES ivm.inventory_adjustments(id) 
                                                        ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 시스템 수량 음수 불가
    CONSTRAINT ck_inventory_count_items__system_qty     CHECK (system_qty >= 0),
    
    -- 실사 수량 음수 불가 (NULL 허용: 아직 실사 안 함)
    CONSTRAINT ck_inventory_count_items__counted_qty    CHECK (counted_qty IS NULL OR counted_qty >= 0),
    
    -- 차이 수량 계산 일치 (counted_qty - system_qty)
    CONSTRAINT ck_inventory_count_items__variance_qty   CHECK (variance_qty IS NULL OR 
                                                               (counted_qty IS NOT NULL AND variance_qty = counted_qty - system_qty)),
    
    -- 재실사 횟수 음수 불가
    CONSTRAINT ck_inventory_count_items__recount_count  CHECK (recount_count >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_count_items                      IS '재고 실사 상세 항목 테이블';
COMMENT ON COLUMN ivm.inventory_count_items.id                   IS '실사 항목 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_count_items.created_at           IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_count_items.created_by           IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_count_items.updated_at           IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_count_items.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_count_items.count_id             IS '실사 식별자';
COMMENT ON COLUMN ivm.inventory_count_items.warehouse_id         IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_count_items.location_id          IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_count_items.product_id           IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_count_items.lot_no           IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_count_items.serial_no        IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_count_items.system_qty           IS '시스템 수량 (장부 재고)';
COMMENT ON COLUMN ivm.inventory_count_items.counted_qty          IS '실사 수량 (실제 재고)';
COMMENT ON COLUMN ivm.inventory_count_items.variance_qty         IS '차이 수량 (counted_qty - system_qty)';
COMMENT ON COLUMN ivm.inventory_count_items.counted_by           IS '실사자 UUID';
COMMENT ON COLUMN ivm.inventory_count_items.counted_at           IS '실사 일시';
COMMENT ON COLUMN ivm.inventory_count_items.is_recount_required IS '재실사 필요 여부';
COMMENT ON COLUMN ivm.inventory_count_items.recount_count        IS '재실사 횟수';
COMMENT ON COLUMN ivm.inventory_count_items.variance_reason_code IS '차이 사유 코드';
COMMENT ON COLUMN ivm.inventory_count_items.variance_reason      IS '차이 사유';
COMMENT ON COLUMN ivm.inventory_count_items.adjustment_id        IS '조정 식별자 (연동된 조정)';
COMMENT ON COLUMN ivm.inventory_count_items.notes                IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__count_id
    ON ivm.inventory_count_items (count_id);
COMMENT ON INDEX ivm.ix_inventory_count_items__count_id IS '실사별 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__warehouse_id
    ON ivm.inventory_count_items (warehouse_id, product_id);
COMMENT ON INDEX ivm.ix_inventory_count_items__warehouse_id IS '창고 및 제품별 실사 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__product_id
    ON ivm.inventory_count_items (product_id);
COMMENT ON INDEX ivm.ix_inventory_count_items__product_id IS '제품별 실사 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__variance
    ON ivm.inventory_count_items (count_id, variance_qty)
 WHERE variance_qty IS NOT NULL 
   AND variance_qty != 0;
COMMENT ON INDEX ivm.ix_inventory_count_items__variance IS '차이 발생 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__counted_by
    ON ivm.inventory_count_items (counted_by)
 WHERE counted_by IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_count_items__counted_by IS '실사자별 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__lot_no
    ON ivm.inventory_count_items (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_count_items__lot_no IS '로트 번호별 실사 항목 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_count_items__serial_no
    ON ivm.inventory_count_items (serial_no)
 WHERE serial_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_count_items__serial_no IS '시리얼 번호별 실사 항목 조회 인덱스';
