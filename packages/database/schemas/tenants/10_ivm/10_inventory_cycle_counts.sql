-- =====================================================================================
-- 테이블: ivm.inventory_cycle_counts
-- 설명: 순환 재고 조사 관리 테이블 (ABC 분석 기반)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_cycle_counts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 순환 조사 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 제품 정보
    product_id              UUID                     NOT NULL,                               -- 제품 식별자
    warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자
    
    -- ABC 분석
    abc_class               VARCHAR(1),                                                      -- ABC 등급 (A/B/C)
    
    -- 조사 빈도 설정
    frequency_type          VARCHAR(20)              NOT NULL,                               -- 빈도 유형
    frequency_value         INTEGER                  NOT NULL,                               -- 빈도 값
    
    -- 마지막 조사 정보
    last_count_date         DATE,                                                            -- 마지막 조사 일자
    last_count_id           UUID,                                                            -- 마지막 조사 식별자
    last_variance_qty       INTEGER,                                                         -- 마지막 차이 수량
    
    -- 다음 조사 예정
    next_count_date         DATE,                                                            -- 다음 조사 예정일
    
    -- 조사 이력 통계
    total_count_times       INTEGER                  DEFAULT 0,                              -- 총 조사 횟수
    variance_count_times    INTEGER                  DEFAULT 0,                              -- 차이 발생 횟수
    accuracy_rate           NUMERIC(5,2),                                                    -- 정확도 (%)
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 외래키 제약조건
    -- 제품 참조 외래키 (제품 삭제 불가)
    CONSTRAINT fk_inventory_cycle_counts__product_id    FOREIGN KEY (product_id) 
                                                        REFERENCES pim.products(id) 
                                                        ON DELETE RESTRICT,
    
    -- 창고 참조 외래키 (창고 삭제 불가)
    CONSTRAINT fk_inventory_cycle_counts__warehouse_id  FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id) 
                                                        ON DELETE RESTRICT,
    
    -- 마지막 조사 참조 외래키 (조사 삭제 시 NULL)
    CONSTRAINT fk_inventory_cycle_counts__last_count    FOREIGN KEY (last_count_id) 
                                                        REFERENCES ivm.inventory_counts(id) 
                                                        ON DELETE SET NULL,
    
    -- CHECK 제약조건
    -- ABC 등급 체크 (A: 고중요도, B: 중중요도, C: 저중요도)
    CONSTRAINT ck_inventory_cycle_counts__abc_class         CHECK (abc_class IS NULL OR 
                                                                   abc_class IN ('A', 'B', 'C')),
    
    -- 빈도 유형 체크 (DAILY: 일별, WEEKLY: 주별, MONTHLY: 월별, QUARTERLY: 분기별, YEARLY: 년별)
    CONSTRAINT ck_inventory_cycle_counts__frequency_type    CHECK (frequency_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    
    -- 빈도 값 양수 체크
    CONSTRAINT ck_inventory_cycle_counts__frequency_value   CHECK (frequency_value > 0),
    
    -- 조사 횟수 음수 불가
    CONSTRAINT ck_inventory_cycle_counts__count_times       CHECK (total_count_times >= 0 AND 
                                                                   variance_count_times >= 0),
    
    -- 차이 발생 횟수가 총 조사 횟수를 초과할 수 없음
    CONSTRAINT ck_inventory_cycle_counts__variance_times    CHECK (variance_count_times <= total_count_times),
    
    -- 정확도 범위 체크 (0-100%)
    CONSTRAINT ck_inventory_cycle_counts__accuracy_rate     CHECK (accuracy_rate IS NULL OR 
                                                                   (accuracy_rate >= 0 AND accuracy_rate <= 100))
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  ivm.inventory_cycle_counts                     IS '순환 재고 조사 관리 테이블';
COMMENT ON COLUMN ivm.inventory_cycle_counts.id                  IS '순환 조사 고유 식별자 (UUID)';
COMMENT ON COLUMN ivm.inventory_cycle_counts.created_at          IS '등록 일시';
COMMENT ON COLUMN ivm.inventory_cycle_counts.created_by          IS '등록자 UUID';
COMMENT ON COLUMN ivm.inventory_cycle_counts.updated_at          IS '수정 일시';
COMMENT ON COLUMN ivm.inventory_cycle_counts.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN ivm.inventory_cycle_counts.product_id          IS '제품 식별자';
COMMENT ON COLUMN ivm.inventory_cycle_counts.warehouse_id        IS '창고 식별자';
COMMENT ON COLUMN ivm.inventory_cycle_counts.abc_class           IS 'ABC 등급 (A: 고중요도, B: 중중요도, C: 저중요도)';
COMMENT ON COLUMN ivm.inventory_cycle_counts.frequency_type      IS '빈도 유형 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY)';
COMMENT ON COLUMN ivm.inventory_cycle_counts.frequency_value     IS '빈도 값 (예: 1=매일, 2=격일, 7=매주)';
COMMENT ON COLUMN ivm.inventory_cycle_counts.last_count_date     IS '마지막 조사 일자';
COMMENT ON COLUMN ivm.inventory_cycle_counts.last_count_id       IS '마지막 조사 식별자';
COMMENT ON COLUMN ivm.inventory_cycle_counts.last_variance_qty   IS '마지막 차이 수량';
COMMENT ON COLUMN ivm.inventory_cycle_counts.next_count_date     IS '다음 조사 예정일';
COMMENT ON COLUMN ivm.inventory_cycle_counts.total_count_times   IS '총 조사 횟수';
COMMENT ON COLUMN ivm.inventory_cycle_counts.variance_count_times IS '차이 발생 횟수';
COMMENT ON COLUMN ivm.inventory_cycle_counts.accuracy_rate       IS '정확도 (%)';
COMMENT ON COLUMN ivm.inventory_cycle_counts.is_active           IS '활성 여부';
COMMENT ON COLUMN ivm.inventory_cycle_counts.notes               IS '비고';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__product_id
    ON ivm.inventory_cycle_counts (product_id, warehouse_id);
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__product_id IS '제품 및 창고별 순환 조사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__warehouse_id
    ON ivm.inventory_cycle_counts (warehouse_id)
 WHERE is_active = true;
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__warehouse_id IS '창고별 활성 순환 조사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__abc_class
    ON ivm.inventory_cycle_counts (abc_class, next_count_date)
 WHERE abc_class IS NOT NULL 
   AND is_active = true;
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__abc_class IS 'ABC 등급별 순환 조사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__next_count_date
    ON ivm.inventory_cycle_counts (next_count_date)
 WHERE next_count_date IS NOT NULL 
   AND is_active = true;
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__next_count_date IS '다음 조사 예정일별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__frequency
    ON ivm.inventory_cycle_counts (frequency_type, frequency_value)
 WHERE is_active = true;
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__frequency IS '빈도별 순환 조사 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_cycle_counts__accuracy_rate
    ON ivm.inventory_cycle_counts (accuracy_rate)
 WHERE accuracy_rate IS NOT NULL 
   AND is_active = true;
COMMENT ON INDEX ivm.ix_inventory_cycle_counts__accuracy_rate IS '정확도별 순환 조사 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_cycle_counts__product_warehouse 
    ON ivm.inventory_cycle_counts (product_id, warehouse_id)
 WHERE is_active = true;
COMMENT ON INDEX ivm.ux_inventory_cycle_counts__product_warehouse IS '제품 및 창고별 활성 순환 조사 유니크 제약';
