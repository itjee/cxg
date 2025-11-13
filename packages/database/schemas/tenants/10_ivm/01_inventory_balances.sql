-- =====================================================================================
-- 테이블: ivm.inventory_balances
-- 설명: 재고 현황 관리 테이블
-- 작성일: 2024-10-20
-- 수정일: 2025-10-27
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
    variant_id              UUID,                                                            -- 제품 변형 식별자 (옵션 조합) ⭐ CRITICAL

    -- 로트/시리얼 정보
    lot_no                  VARCHAR(100),                                                    -- 로트 번호
    serial_no               VARCHAR(100),                                                    -- 시리얼 번호

    -- 재고 수량
    on_hand_qty             INTEGER                  DEFAULT 0,                              -- 현재고 수량
    available_qty           INTEGER                  DEFAULT 0,                              -- 가용 수량
    reserved_qty            INTEGER                  DEFAULT 0,                              -- 예약 수량

    -- 원가 정보
    avg_cost                NUMERIC(18,4)            DEFAULT 0,                              -- 평균 단가
    last_move_at            TIMESTAMP WITH TIME ZONE,                                        -- 최종 이동 일시

    -- 외래키 제약조건
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_balances__warehouse_id  FOREIGN KEY (warehouse_id)
                                                    REFERENCES wms.warehouses(id)
                                                    ON DELETE RESTRICT,

    -- 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_balances__location_id   FOREIGN KEY (location_id)
                                                    REFERENCES wms.warehouse_locations(id)
                                                    ON DELETE SET NULL,

    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_balances__product_id    FOREIGN KEY (product_id)
                                                    REFERENCES pim.products(id)
                                                    ON DELETE RESTRICT,

    -- 제품 변형 참조 외래키 (변형 삭제 불가) ⭐ NEW
    CONSTRAINT fk_inventory_balances__variant_id    FOREIGN KEY (variant_id)
                                                    REFERENCES pim.product_variants(id)
                                                    ON DELETE RESTRICT,

    -- CHECK 제약조건
    -- 재고 수량 음수 불가 체크 (현재고, 가용, 예약 수량 모두 0 이상)
    CONSTRAINT ck_inventory_balances__quantities    CHECK (on_hand_qty >= 0 AND available_qty >= 0 AND reserved_qty >= 0),

    -- 평균 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_inventory_balances__avg_cost      CHECK (avg_cost >= 0),

    -- 가용 수량 일관성 체크 (가용 수량 = 현재고 - 예약)
    CONSTRAINT ck_inventory_balances__available     CHECK (available_qty <= on_hand_qty)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_balances                     IS '재고 현황 관리 테이블';
COMMENT ON COLUMN ivm.inventory_balances.id                  IS '재고 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_balances.created_at          IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_balances.created_by          IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_balances.updated_at          IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_balances.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_balances.warehouse_id        IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_balances.location_id         IS '로케이션 식별자';
COMMENT ON COLUMN ivm.inventory_balances.product_id          IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_balances.variant_id          IS '제품 변형 식별자 (옵션 조합, 예: 색상-빨강/사이즈-L)';
COMMENT ON COLUMN ivm.inventory_balances.lot_no              IS '로트 번호';
COMMENT ON COLUMN ivm.inventory_balances.serial_no           IS '시리얼 번호';
COMMENT ON COLUMN ivm.inventory_balances.on_hand_qty         IS '현재고 수량';
COMMENT ON COLUMN ivm.inventory_balances.available_qty       IS '가용 수량 (현재고 - 예약)';
COMMENT ON COLUMN ivm.inventory_balances.reserved_qty        IS '예약 수량';
COMMENT ON COLUMN ivm.inventory_balances.avg_cost            IS '평균 단가';
COMMENT ON COLUMN ivm.inventory_balances.last_move_at        IS '최종 이동 일시';

COMMENT ON CONSTRAINT fk_inventory_balances__warehouse_id   ON ivm.inventory_balances IS '창고 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_inventory_balances__location_id    ON ivm.inventory_balances IS '로케이션 참조 외래키 (SET NULL 삭제)';
COMMENT ON CONSTRAINT fk_inventory_balances__product_id     ON ivm.inventory_balances IS '제품 참조 외래키 (RESTRICT 삭제)';
COMMENT ON CONSTRAINT fk_inventory_balances__variant_id     ON ivm.inventory_balances IS '제품 변형 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

-- 창고별 재고 조회
CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_id
    ON ivm.inventory_balances (warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_balances__warehouse_id IS '창고별 재고 조회 인덱스';

-- 제품별 재고 조회
CREATE INDEX IF NOT EXISTS ix_inventory_balances__product_id
    ON ivm.inventory_balances (product_id);
COMMENT ON INDEX ivm.ix_inventory_balances__product_id IS '제품별 재고 조회 인덱스';

-- 제품 변형별 재고 조회 ⭐ NEW
CREATE INDEX IF NOT EXISTS ix_inventory_balances__variant_id
    ON ivm.inventory_balances (variant_id)
 WHERE variant_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_balances__variant_id IS '제품 변형별 재고 조회 인덱스';

-- 로케이션별 재고 조회
CREATE INDEX IF NOT EXISTS ix_inventory_balances__location_id
    ON ivm.inventory_balances (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_balances__location_id IS '로케이션별 재고 조회 인덱스';

-- 로트 번호별 재고 조회
CREATE INDEX IF NOT EXISTS ix_inventory_balances__lot_no
    ON ivm.inventory_balances (lot_no)
 WHERE lot_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_balances__lot_no IS '로트 번호별 재고 조회 인덱스';

-- 시리얼 번호별 재고 조회
CREATE INDEX IF NOT EXISTS ix_inventory_balances__serial_no
    ON ivm.inventory_balances (serial_no)
 WHERE serial_no IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_balances__serial_no IS '시리얼 번호별 재고 조회 인덱스';

-- 가용 재고 조회 (재고가 있는 경우만)
CREATE INDEX IF NOT EXISTS ix_inventory_balances__available_qty
    ON ivm.inventory_balances (warehouse_id, product_id, variant_id)
 WHERE available_qty > 0;
COMMENT ON INDEX ivm.ix_inventory_balances__available_qty IS '가용 재고 조회 인덱스 (재고 있음)';

-- 복합 인덱스 (창고 + 제품 + 변형) - 핵심 조회 패턴
CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_product_variant
    ON ivm.inventory_balances (warehouse_id, product_id, variant_id);
COMMENT ON INDEX ivm.ix_inventory_balances__warehouse_product_variant IS '창고-제품-변형 복합 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

-- 창고별 제품/변형/로트/시리얼 조합 유니크 제약 ⭐ UPDATED
CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid),
        COALESCE(lot_no, ''),
        COALESCE(serial_no, '')
    );
COMMENT ON INDEX ivm.ux_inventory_balances__item_location IS '창고별 제품/변형/로트/시리얼 조합 유니크 제약 (동일 항목 중복 방지)';
