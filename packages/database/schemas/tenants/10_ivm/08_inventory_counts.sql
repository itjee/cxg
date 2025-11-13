-- =====================================================================================
-- 테이블: ivm.inventory_counts
-- 설명: 재고 실사 관리 테이블 (정기/비정기 실사)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_counts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 실사 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 실사 기본 정보
    count_code              VARCHAR(50)              NOT NULL,                               -- 실사 코드
    count_name              VARCHAR(200)             NOT NULL,                               -- 실사명
    count_type              VARCHAR(20)              NOT NULL,                               -- 실사 유형
    
    -- 실사 일정
    scheduled_date          DATE                     NOT NULL,                               -- 예정 일자
    started_at              TIMESTAMP WITH TIME ZONE,                                        -- 시작 일시
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시
    
    -- 실사 범위
    warehouse_id            UUID,                                                            -- 대상 창고 (NULL: 전체)
    location_id             UUID,                                                            -- 대상 로케이션 (NULL: 전체)
    product_category_id     UUID,                                                            -- 대상 제품 카테고리 (NULL: 전체)
    
    -- 실사 담당자
    supervisor_id           UUID,                                                            -- 감독자 UUID
    counter_ids             UUID[],                                                          -- 실사자 UUID 배열
    
    -- 실사 결과 요약
    total_items             INTEGER                  DEFAULT 0,                              -- 전체 항목 수
    counted_items           INTEGER                  DEFAULT 0,                              -- 실사 완료 항목 수
    variance_items          INTEGER                  DEFAULT 0,                              -- 차이 발생 항목 수
    
    -- 조정 정보
    is_adjustment_created   BOOLEAN                  DEFAULT false,                          -- 조정 생성 여부
    is_adjustment_approved  BOOLEAN                  DEFAULT false,                          -- 조정 승인 여부
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'PLANNED',                      -- 상태
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 창고 참조 외래키 (창고 삭제 시 NULL)
    CONSTRAINT fk_inventory_counts__warehouse_id        FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE SET NULL,
    
    -- 로케이션 참조 외래키 (로케이션 삭제 시 NULL)
    CONSTRAINT fk_inventory_counts__location_id         FOREIGN KEY (location_id) 
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- 실사 유형 체크 (FULL: 전체실사, CYCLE: 순환실사, SPOT: 수시실사)
    CONSTRAINT ck_inventory_counts__count_type          CHECK (count_type IN ('FULL', 'CYCLE', 'SPOT')),
    
    -- 항목 수 음수 불가
    CONSTRAINT ck_inventory_counts__item_counts         CHECK (total_items >= 0 AND 
                                                               counted_items >= 0 AND 
                                                               variance_items >= 0),
    
    -- 실사 완료 항목이 전체 항목을 초과할 수 없음
    CONSTRAINT ck_inventory_counts__counted_items       CHECK (counted_items <= total_items),
    
    -- 상태 체크 (PLANNED: 계획, IN_PROGRESS: 진행중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_inventory_counts__status              CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_counts                       IS '재고 실사 관리 테이블';
COMMENT ON COLUMN ivm.inventory_counts.id                    IS '실사 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_counts.created_at            IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_counts.created_by            IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_counts.updated_at            IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_counts.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_counts.count_code            IS '실사 코드';
COMMENT ON COLUMN ivm.inventory_counts.count_name            IS '실사명';
COMMENT ON COLUMN ivm.inventory_counts.count_type            IS '실사 유형 (FULL/CYCLE/SPOT)';
COMMENT ON COLUMN ivm.inventory_counts.scheduled_date        IS '예정 일자';
COMMENT ON COLUMN ivm.inventory_counts.started_at            IS '시작 일시';
COMMENT ON COLUMN ivm.inventory_counts.completed_at          IS '완료 일시';
COMMENT ON COLUMN ivm.inventory_counts.warehouse_id          IS '대상 창고 (NULL: 전체)';
COMMENT ON COLUMN ivm.inventory_counts.location_id           IS '대상 로케이션 (NULL: 전체)';
COMMENT ON COLUMN ivm.inventory_counts.product_category_id   IS '대상 제품 카테고리 (NULL: 전체)';
COMMENT ON COLUMN ivm.inventory_counts.supervisor_id         IS '감독자 UUID';
COMMENT ON COLUMN ivm.inventory_counts.counter_ids           IS '실사자 UUID 배열';
COMMENT ON COLUMN ivm.inventory_counts.total_items           IS '전체 항목 수';
COMMENT ON COLUMN ivm.inventory_counts.counted_items         IS '실사 완료 항목 수';
COMMENT ON COLUMN ivm.inventory_counts.variance_items        IS '차이 발생 항목 수';
COMMENT ON COLUMN ivm.inventory_counts.is_adjustment_created IS '조정 생성 여부';
COMMENT ON COLUMN ivm.inventory_counts.is_adjustment_approved IS '조정 승인 여부';
COMMENT ON COLUMN ivm.inventory_counts.status                IS '상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)';
COMMENT ON COLUMN ivm.inventory_counts.notes                 IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_counts__count_code
    ON ivm.inventory_counts (count_code);
COMMENT ON INDEX ivm.ix_inventory_counts__count_code IS '실사 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_counts__scheduled_date
    ON ivm.inventory_counts (scheduled_date DESC);
COMMENT ON INDEX ivm.ix_inventory_counts__scheduled_date IS '예정 일자별 실사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_counts__warehouse_id
    ON ivm.inventory_counts (warehouse_id)
 WHERE warehouse_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_counts__warehouse_id IS '창고별 실사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_counts__status
    ON ivm.inventory_counts (status, scheduled_date DESC);
COMMENT ON INDEX ivm.ix_inventory_counts__status IS '상태 및 일자별 실사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_counts__count_type
    ON ivm.inventory_counts (count_type, scheduled_date DESC);
COMMENT ON INDEX ivm.ix_inventory_counts__count_type IS '실사 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_counts__supervisor_id
    ON ivm.inventory_counts (supervisor_id)
 WHERE supervisor_id IS NOT NULL;
COMMENT ON INDEX ivm.ix_inventory_counts__supervisor_id IS '감독자별 실사 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_counts__code 
    ON ivm.inventory_counts (count_code);
COMMENT ON INDEX ivm.ux_inventory_counts__code IS '실사 코드 유니크 제약';
