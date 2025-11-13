-- =====================================================================================
-- 테이블: wms.receiving_items
-- 설명: 입고 라인 (상세) 정보 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE wms.receiving_items 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 입고 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                 -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gr_id                   UUID                     NOT NULL,                                  -- 입고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    po_line_id              UUID,                                                               -- 구매발주 라인 식별자
    item_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    ordered_qty             INTEGER                  DEFAULT 0,                                 -- 발주 수량
    received_qty            INTEGER                  NOT NULL,                                  -- 입고 수량
    rejected_qty            INTEGER                  DEFAULT 0,                                 -- 불량 수량
    
    -- 원가 정보
    unit_cost               NUMERIC(18,4)            DEFAULT 0,                                 -- 단가
    
    -- 외래키 제약조건
    -- 입고 헤더 참조 외래키
    CONSTRAINT fk_receiving_items__gr_id                FOREIGN KEY (gr_id) 
                                                        REFERENCES wms.receiving(id) 
                                                        ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 라인 번호 양수 체크 (1 이상)
    CONSTRAINT ck_receiving_items__line_no              CHECK (line_no > 0),
    
    -- 발주 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_receiving_items__ordered_qty          CHECK (ordered_qty >= 0),
    
    -- 입고 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_receiving_items__received_qty         CHECK (received_qty >= 0),
    
    -- 불량 수량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_receiving_items__rejected_qty         CHECK (rejected_qty >= 0),
    
    -- 단가 음수 불가 체크 (0 이상)
    CONSTRAINT ck_receiving_items__unit_cost            CHECK (unit_cost >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.receiving_items                IS '입고 라인(상세) 관리 테이블';
COMMENT ON COLUMN wms.receiving_items.id             IS '입고 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.receiving_items.created_at     IS '등록 일시';
COMMENT ON COLUMN wms.receiving_items.created_by     IS '등록자 UUID';
COMMENT ON COLUMN wms.receiving_items.updated_at     IS '수정 일시';
COMMENT ON COLUMN wms.receiving_items.updated_by     IS '수정자 UUID';
COMMENT ON COLUMN wms.receiving_items.gr_id          IS '입고 헤더 식별자';
COMMENT ON COLUMN wms.receiving_items.line_no        IS '라인 번호';
COMMENT ON COLUMN wms.receiving_items.po_line_id     IS '구매발주 라인 식별자';
COMMENT ON COLUMN wms.receiving_items.item_id        IS '제품 식별자';
COMMENT ON COLUMN wms.receiving_items.location_id    IS '로케이션 식별자';
COMMENT ON COLUMN wms.receiving_items.lot_number     IS '로트 번호';
COMMENT ON COLUMN wms.receiving_items.serial_number  IS '시리얼 번호';
COMMENT ON COLUMN wms.receiving_items.ordered_qty    IS '발주 수량';
COMMENT ON COLUMN wms.receiving_items.received_qty   IS '입고 수량';
COMMENT ON COLUMN wms.receiving_items.rejected_qty   IS '불량 수량';
COMMENT ON COLUMN wms.receiving_items.unit_cost      IS '단가';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_receiving_items__gr_id
    ON wms.receiving_items (gr_id, line_no);
COMMENT ON INDEX wms.ix_receiving_items__gr_id IS '입고 헤더별 라인 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_receiving_items__item_id
    ON wms.receiving_items (item_id);
COMMENT ON INDEX wms.ix_receiving_items__item_id IS '제품별 입고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_receiving_items__location_id
    ON wms.receiving_items (location_id)
 WHERE location_id IS NOT NULL;
COMMENT ON INDEX wms.ix_receiving_items__location_id IS '로케이션별 입고 내역 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_receiving_items__lot_number
    ON wms.receiving_items (lot_number)
 WHERE lot_number IS NOT NULL;
COMMENT ON INDEX wms.ix_receiving_items__lot_number IS '로트 번호별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_receiving_items__gr_line
    ON wms.receiving_items (gr_id, line_no);
COMMENT ON INDEX wms.ux_receiving_items__gr_line IS '입고 헤더별 라인번호 유니크 제약';
