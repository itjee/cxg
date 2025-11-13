-- =====================================================================================
-- 테이블: bim.purchase_analytics
-- 설명: 구매 데이터 분석 및 집계 정보를 관리하는 테이블 (월별 집계)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.purchase_analytics 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 구매 분석 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 분석 기간
    period                  VARCHAR(7)               NOT NULL,                                           -- 분석 기간 (YYYY-MM)
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)
    
    -- 분석 차원
    supplier_id             UUID,                                                                        -- 공급업체 식별자
    supplier_category       VARCHAR(50),                                                                 -- 공급업체 분류 (추가)
    category_id             UUID,                                                                        -- 품목 카테고리 식별자
    product_id              UUID,                                                                        -- 품목 식별자 (추가)
    buyer_id                UUID,                                                                        -- 구매 담당자 식별자 (추가)
    department_id           UUID,                                                                        -- 부서 식별자 (추가)
    
    -- 구매 정보
    purchase_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 구매액
    purchase_qty            INTEGER                  DEFAULT 0,                                          -- 구매 수량
    order_count             INTEGER                  DEFAULT 0,                                          -- 발주 건수 (추가)
    
    -- 반품 및 할인
    return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 (추가)
    return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 (추가)
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 (추가)
    
    -- 통화 및 환율
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 (추가)
    
    -- 평균 지표
    avg_order_value         NUMERIC(18,4),                                                               -- 평균 발주 금액 (추가)
    avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 (추가)
    avg_lead_time_days      NUMERIC(5,1),                                                                -- 평균 리드타임 (일) (추가)
    
    -- 품질 지표
    defect_qty              INTEGER                  DEFAULT 0,                                          -- 불량 수량 (추가)
    defect_rate             NUMERIC(5,2),                                                                -- 불량률 (%) (추가)
    on_time_delivery_rate   NUMERIC(5,2),                                                                -- 정시 납품률 (%) (추가)
    
    -- 전년 대비
    yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) (추가)
    mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_purchase_analytics__period    CHECK (period ~ '^\d{4}-\d{2}$'),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_purchase_analytics__currency  CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 금액 양수 체크
    CONSTRAINT ck_purchase_analytics__amounts   CHECK (purchase_amount >= 0 AND return_amount >= 0 AND discount_amount >= 0),
    
    -- 수량 양수 체크
    CONSTRAINT ck_purchase_analytics__quantities CHECK (purchase_qty >= 0 AND order_count >= 0 AND return_qty >= 0 AND defect_qty >= 0),
    
    -- 분기 형식 체크
    CONSTRAINT ck_purchase_analytics__quarter   CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    
    -- 비율 범위 체크 (0~100%)
    CONSTRAINT ck_purchase_analytics__rates     CHECK ((defect_rate IS NULL OR defect_rate BETWEEN 0 AND 100) 
                                                            AND (on_time_delivery_rate IS NULL OR on_time_delivery_rate BETWEEN 0 AND 100))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  bim.purchase_analytics                     IS '구매 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)';
COMMENT ON COLUMN bim.purchase_analytics.id                  IS '구매 분석 고유 식별자 (UUID)';
COMMENT ON COLUMN bim.purchase_analytics.created_at          IS '등록 일시';
COMMENT ON COLUMN bim.purchase_analytics.created_by          IS '등록자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.updated_at          IS '수정 일시';
COMMENT ON COLUMN bim.purchase_analytics.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.period              IS '분석 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.purchase_analytics.fiscal_year         IS '회계 연도';
COMMENT ON COLUMN bim.purchase_analytics.quarter             IS '분기 (Q1/Q2/Q3/Q4)';
COMMENT ON COLUMN bim.purchase_analytics.supplier_id           IS '공급업체 식별자';
COMMENT ON COLUMN bim.purchase_analytics.supplier_category     IS '공급업체 분류';
COMMENT ON COLUMN bim.purchase_analytics.category_id    IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.purchase_analytics.product_id             IS '품목 식별자';
COMMENT ON COLUMN bim.purchase_analytics.buyer_id            IS '구매 담당자 식별자';
COMMENT ON COLUMN bim.purchase_analytics.department_id       IS '부서 식별자';
COMMENT ON COLUMN bim.purchase_analytics.purchase_amount     IS '구매액';
COMMENT ON COLUMN bim.purchase_analytics.purchase_qty        IS '구매 수량';
COMMENT ON COLUMN bim.purchase_analytics.order_count         IS '발주 건수';
COMMENT ON COLUMN bim.purchase_analytics.return_amount       IS '반품액';
COMMENT ON COLUMN bim.purchase_analytics.return_qty          IS '반품 수량';
COMMENT ON COLUMN bim.purchase_analytics.discount_amount     IS '할인액';
COMMENT ON COLUMN bim.purchase_analytics.currency            IS '통화 (ISO 4217)';
COMMENT ON COLUMN bim.purchase_analytics.exchange_rate       IS '환율';
COMMENT ON COLUMN bim.purchase_analytics.avg_order_value     IS '평균 발주 금액';
COMMENT ON COLUMN bim.purchase_analytics.avg_unit_price      IS '평균 단가';
COMMENT ON COLUMN bim.purchase_analytics.avg_lead_time_days  IS '평균 리드타임 (일)';
COMMENT ON COLUMN bim.purchase_analytics.defect_qty          IS '불량 수량';
COMMENT ON COLUMN bim.purchase_analytics.defect_rate         IS '불량률 (%)';
COMMENT ON COLUMN bim.purchase_analytics.on_time_delivery_rate IS '정시 납품률 (%)';
COMMENT ON COLUMN bim.purchase_analytics.yoy_growth_rate     IS '전년 대비 성장률 (%)';
COMMENT ON COLUMN bim.purchase_analytics.mom_growth_rate     IS '전월 대비 성장률 (%)';
COMMENT ON COLUMN bim.purchase_analytics.is_deleted          IS '논리 삭제 플래그';

-- 유니크 인덱스
-- 구매 분석 유니크 (기간 + 공급업체 + 카테고리 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_analytics__unique
    ON bim.purchase_analytics (period, COALESCE(supplier_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                                COALESCE(category_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ux_purchase_analytics__unique IS '구매 분석 유니크 제약 (기간 + 공급업체 + 카테고리)';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_purchase_analytics__period
    ON bim.purchase_analytics (period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_purchase_analytics__period IS '분석 기간별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__supplier_id
    ON bim.purchase_analytics (supplier_id, period DESC)
 WHERE supplier_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_purchase_analytics__supplier_id IS '공급업체별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__category_id
    ON bim.purchase_analytics (category_id, period DESC)
 WHERE category_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_purchase_analytics__category_id IS '품목 카테고리별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__buyer_id
    ON bim.purchase_analytics (buyer_id, period DESC)
 WHERE buyer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_purchase_analytics__buyer_id IS '구매 담당자별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__fiscal_year
    ON bim.purchase_analytics (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_purchase_analytics__fiscal_year IS '회계연도 및 분기별 조회 인덱스';
