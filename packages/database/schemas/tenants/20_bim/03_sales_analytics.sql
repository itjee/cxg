-- =====================================================================================
-- 테이블: bim.sales_analytics
-- 설명: 매출 데이터 분석 및 집계 정보를 관리하는 테이블 (월별 집계)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.sales_analytics 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매출 분석 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 분석 기간
    period                  VARCHAR(7)               NOT NULL,                                           -- 분석 기간 (YYYY-MM)
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)
    
    -- 분석 차원
    customer_id             UUID,                                                                        -- 고객 식별자
    customer_segment        VARCHAR(50),                                                                 -- 고객 세그먼트 (추가)
    category_id             UUID,                                                                        -- 품목 카테고리 식별자
    product_id              UUID,                                                                        -- 품목 식별자 (추가)
    sales_person_id         UUID,                                                                        -- 영업 담당자 식별자
    department_id           UUID,                                                                        -- 부서 식별자 (추가)
    region_code             VARCHAR(50),                                                                 -- 지역 코드 (추가)
    
    -- 매출 정보
    sales_amount            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출액
    sales_qty               INTEGER                  DEFAULT 0,                                          -- 매출 수량
    order_count             INTEGER                  DEFAULT 0,                                          -- 주문 건수 (추가)
    
    -- 원가 및 이익
    cost_amount             NUMERIC(18,4)            DEFAULT 0,                                          -- 원가
    gross_profit            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출 총이익
    gross_profit_rate       NUMERIC(5,2),                                                                -- 매출 총이익률 (%) (추가)
    
    -- 반품 및 할인
    return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 (추가)
    return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 (추가)
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 (추가)
    
    -- 통화 및 환율
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 (추가)
    
    -- 평균 지표
    avg_order_value         NUMERIC(18,4),                                                               -- 평균 주문 금액 (추가)
    avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 (추가)
    
    -- 전년 대비
    yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) (추가)
    mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_sales_analytics__period       CHECK (period ~ '^\d{4}-\d{2}$'),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_sales_analytics__currency     CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 금액 양수 체크
    CONSTRAINT ck_sales_analytics__amounts      CHECK (sales_amount >= 0 AND cost_amount >= 0 AND gross_profit >= sales_amount - cost_amount - 0.01),
    
    -- 수량 양수 체크
    CONSTRAINT ck_sales_analytics__quantities   CHECK (sales_qty >= 0 AND order_count >= 0 AND return_qty >= 0),
    
    -- 분기 형식 체크
    CONSTRAINT ck_sales_analytics__quarter      CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  bim.sales_analytics                        IS '매출 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)';
COMMENT ON COLUMN bim.sales_analytics.id                     IS '매출 분석 고유 식별자 (UUID)';
COMMENT ON COLUMN bim.sales_analytics.created_at             IS '등록 일시';
COMMENT ON COLUMN bim.sales_analytics.created_by             IS '등록자 UUID';
COMMENT ON COLUMN bim.sales_analytics.updated_at             IS '수정 일시';
COMMENT ON COLUMN bim.sales_analytics.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN bim.sales_analytics.period                 IS '분석 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.sales_analytics.fiscal_year            IS '회계 연도';
COMMENT ON COLUMN bim.sales_analytics.quarter                IS '분기 (Q1/Q2/Q3/Q4)';
COMMENT ON COLUMN bim.sales_analytics.customer_id            IS '고객 식별자';
COMMENT ON COLUMN bim.sales_analytics.customer_segment       IS '고객 세그먼트';
COMMENT ON COLUMN bim.sales_analytics.category_id       IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.sales_analytics.product_id                IS '품목 식별자';
COMMENT ON COLUMN bim.sales_analytics.sales_person_id        IS '영업 담당자 식별자';
COMMENT ON COLUMN bim.sales_analytics.department_id          IS '부서 식별자';
COMMENT ON COLUMN bim.sales_analytics.region_code            IS '지역 코드';
COMMENT ON COLUMN bim.sales_analytics.sales_amount           IS '매출액';
COMMENT ON COLUMN bim.sales_analytics.sales_qty              IS '매출 수량';
COMMENT ON COLUMN bim.sales_analytics.order_count            IS '주문 건수';
COMMENT ON COLUMN bim.sales_analytics.cost_amount            IS '원가';
COMMENT ON COLUMN bim.sales_analytics.gross_profit           IS '매출 총이익';
COMMENT ON COLUMN bim.sales_analytics.gross_profit_rate      IS '매출 총이익률 (%)';
COMMENT ON COLUMN bim.sales_analytics.return_amount          IS '반품액';
COMMENT ON COLUMN bim.sales_analytics.return_qty             IS '반품 수량';
COMMENT ON COLUMN bim.sales_analytics.discount_amount        IS '할인액';
COMMENT ON COLUMN bim.sales_analytics.currency               IS '통화 (ISO 4217)';
COMMENT ON COLUMN bim.sales_analytics.exchange_rate          IS '환율';
COMMENT ON COLUMN bim.sales_analytics.avg_order_value        IS '평균 주문 금액 (AOV)';
COMMENT ON COLUMN bim.sales_analytics.avg_unit_price         IS '평균 단가';
COMMENT ON COLUMN bim.sales_analytics.yoy_growth_rate        IS '전년 대비 성장률 (%)';
COMMENT ON COLUMN bim.sales_analytics.mom_growth_rate        IS '전월 대비 성장률 (%)';
COMMENT ON COLUMN bim.sales_analytics.is_deleted             IS '논리 삭제 플래그';

-- 유니크 인덱스
-- 매출 분석 유니크 (기간 + 고객 + 카테고리 + 영업담당 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_analytics__unique
    ON bim.sales_analytics (period, COALESCE(customer_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                            COALESCE(category_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                            COALESCE(sales_person_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ux_sales_analytics__unique IS '매출 분석 유니크 제약 (기간 + 고객 + 카테고리 + 영업담당)';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_sales_analytics__period
    ON bim.sales_analytics (period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__period IS '분석 기간별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_analytics__customer_id
    ON bim.sales_analytics (customer_id, period DESC)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__customer_id IS '고객별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_analytics__category_id
    ON bim.sales_analytics (category_id, period DESC)
 WHERE category_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__category_id IS '품목 카테고리별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_analytics__sales_person_id
    ON bim.sales_analytics (sales_person_id, period DESC)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__sales_person_id IS '영업 담당자별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_analytics__fiscal_year
    ON bim.sales_analytics (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__fiscal_year IS '회계연도 및 분기별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_sales_analytics__region_code
    ON bim.sales_analytics (region_code, period DESC)
 WHERE region_code IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_sales_analytics__region_code IS '지역별 매출 분석 조회 인덱스';
