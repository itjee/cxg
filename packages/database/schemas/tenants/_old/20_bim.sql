-- ============================================================================
-- Business Intelligence & Analytics Schema (bim)
-- ============================================================================
-- Description: BI/분석 스키마 (KPI, 매출/구매 분석, 대시보드)
-- Database: tnnt_db (Tenant Database)
-- Schema: bim
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS bim;

COMMENT ON SCHEMA bim IS 'BIM: BI/분석 스키마 (KPI, 매출/구매 분석, 대시보드)';

-- =====================================================================================
-- 테이블: bim.kpi_definitions
-- 설명: KPI(핵심성과지표) 정의 및 설정 정보를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.kpi_definitions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- KPI 정의 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- KPI 기본 정보
    kpi_code                VARCHAR(50)              NOT NULL,                                           -- KPI 코드
    kpi_name                VARCHAR(200)             NOT NULL,                                           -- KPI 명칭
    kpi_name_en             VARCHAR(200),                                                                -- KPI 영문명 -- 추가
    description             TEXT,                                                                        -- KPI 상세 설명
    
    -- KPI 분류
    category                VARCHAR(50),                                                                 -- KPI 카테고리 (매출/수익성/효율성/품질/고객만족)
    sub_category            VARCHAR(50),                                                                 -- 하위 카테고리 -- 추가
    business_area           VARCHAR(50),                                                                 -- 사업 영역 (영업/생산/재무/인사 등) -- 추가
    
    -- 측정 정보
    measurement_unit        VARCHAR(20),                                                                 -- 측정 단위 (원/% /건수/시간 등)
    calculation_formula     TEXT,                                                                        -- 계산 방법 (수식/집계 방법)
    data_source             TEXT,                                                                        -- 데이터 출처 -- 추가
    measurement_frequency   VARCHAR(20)              DEFAULT 'MONTHLY',                                  -- 측정 주기 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY) -- 추가
    
    -- 목표 설정
    target_type             VARCHAR(20)              DEFAULT 'HIGHER_BETTER',                            -- 목표 유형 (HIGHER_BETTER/LOWER_BETTER/TARGET_VALUE/RANGE)
    default_target_value    NUMERIC(18,4),                                                               -- 기본 목표값 -- 추가
    threshold_warning       NUMERIC(18,4),                                                               -- 경고 임계값 -- 추가
    threshold_critical      NUMERIC(18,4),                                                               -- 위험 임계값 -- 추가
    
    -- 표시 정보
    display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서 -- 추가
    chart_type              VARCHAR(20),                                                                 -- 차트 유형 (LINE/BAR/PIE/GAUGE) -- 추가
    color_code              VARCHAR(7),                                                                  -- 색상 코드 (#RRGGBB) -- 추가
    icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 -- 추가
    
    -- 책임 및 소유
    owner_user_id           UUID,                                                                        -- KPI 담당자 UUID -- 추가
    owner_department_id     UUID,                                                                        -- KPI 책임 부서 UUID -- 추가
    
    -- 추가 정보
    notes                   TEXT,                                                                        -- 비고 -- 추가
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성화 여부
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 목표 유형 체크 (HIGHER_BETTER: 높을수록 좋음, LOWER_BETTER: 낮을수록 좋음, TARGET_VALUE: 목표값 달성, RANGE: 범위 내)
    CONSTRAINT ck_bim_kpi_definitions__target_type  CHECK (target_type IN ('HIGHER_BETTER', 'LOWER_BETTER', 'TARGET_VALUE', 'RANGE')),
    -- 측정 주기 체크
    CONSTRAINT ck_bim_kpi_definitions__frequency    CHECK (measurement_frequency IS NULL OR measurement_frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    -- 차트 유형 체크
    CONSTRAINT ck_bim_kpi_definitions__chart_type   CHECK (chart_type IS NULL OR chart_type IN ('LINE', 'BAR', 'PIE', 'GAUGE', 'AREA', 'SCATTER')),
    -- 표시 순서 양수 체크
    CONSTRAINT ck_bim_kpi_definitions__display_order CHECK (display_order >= 0),
    -- 색상 코드 형식 체크 (#RRGGBB)
    CONSTRAINT ck_bim_kpi_definitions__color_code   CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE  bim.kpi_definitions                        IS 'KPI(핵심성과지표) 정의 및 설정 정보 관리 테이블';
COMMENT ON COLUMN bim.kpi_definitions.id                     IS 'KPI 정의 고유 식별자 (UUID)';
COMMENT ON COLUMN bim.kpi_definitions.created_at             IS '등록 일시';
COMMENT ON COLUMN bim.kpi_definitions.created_by             IS '등록자 UUID';
COMMENT ON COLUMN bim.kpi_definitions.updated_at             IS '수정 일시';
COMMENT ON COLUMN bim.kpi_definitions.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN bim.kpi_definitions.kpi_code               IS 'KPI 코드';
COMMENT ON COLUMN bim.kpi_definitions.kpi_name               IS 'KPI 명칭';
COMMENT ON COLUMN bim.kpi_definitions.kpi_name_en            IS 'KPI 영문명';
COMMENT ON COLUMN bim.kpi_definitions.description            IS 'KPI 상세 설명';
COMMENT ON COLUMN bim.kpi_definitions.category               IS 'KPI 카테고리 (매출/수익성/효율성/품질/고객만족)';
COMMENT ON COLUMN bim.kpi_definitions.sub_category           IS '하위 카테고리';
COMMENT ON COLUMN bim.kpi_definitions.business_area          IS '사업 영역 (영업/생산/재무/인사 등)';
COMMENT ON COLUMN bim.kpi_definitions.measurement_unit       IS '측정 단위 (원/% /건수/시간 등)';
COMMENT ON COLUMN bim.kpi_definitions.calculation_formula    IS '계산 방법 (수식/집계 방법)';
COMMENT ON COLUMN bim.kpi_definitions.data_source            IS '데이터 출처';
COMMENT ON COLUMN bim.kpi_definitions.measurement_frequency  IS '측정 주기 (DAILY: 일별/WEEKLY: 주별/MONTHLY: 월별/QUARTERLY: 분기별/YEARLY: 연별)';
COMMENT ON COLUMN bim.kpi_definitions.target_type            IS '목표 유형 (HIGHER_BETTER: 높을수록 좋음/LOWER_BETTER: 낮을수록 좋음/TARGET_VALUE: 목표값 달성/RANGE: 범위 내)';
COMMENT ON COLUMN bim.kpi_definitions.default_target_value   IS '기본 목표값';
COMMENT ON COLUMN bim.kpi_definitions.threshold_warning      IS '경고 임계값';
COMMENT ON COLUMN bim.kpi_definitions.threshold_critical     IS '위험 임계값';
COMMENT ON COLUMN bim.kpi_definitions.display_order          IS '표시 순서';
COMMENT ON COLUMN bim.kpi_definitions.chart_type             IS '차트 유형 (LINE: 선형/BAR: 막대/PIE: 원형/GAUGE: 게이지/AREA: 영역/SCATTER: 산점도)';
COMMENT ON COLUMN bim.kpi_definitions.color_code             IS '색상 코드 (#RRGGBB 형식)';
COMMENT ON COLUMN bim.kpi_definitions.icon_name              IS '아이콘 이름';
COMMENT ON COLUMN bim.kpi_definitions.owner_user_id          IS 'KPI 담당자 UUID';
COMMENT ON COLUMN bim.kpi_definitions.owner_department_id    IS 'KPI 책임 부서 UUID';
COMMENT ON COLUMN bim.kpi_definitions.notes                  IS '비고';
COMMENT ON COLUMN bim.kpi_definitions.is_active              IS '활성화 여부';
COMMENT ON COLUMN bim.kpi_definitions.is_deleted             IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: bim.kpi_targets
-- 설명: KPI 목표값 및 실적을 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.kpi_targets 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- KPI 목표 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- KPI 참조
    kpi_id                  UUID                     NOT NULL,                                           -- KPI 정의 식별자
    
    -- 기간 및 대상
    target_period           VARCHAR(7)               NOT NULL,                                           -- 목표 기간 (YYYY-MM)
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 -- 추가
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) -- 추가
    department_id           UUID,                                                                        -- 부서 식별자
    user_id                 UUID,                                                                        -- 사용자 식별자
    team_id                 UUID,                                                                        -- 팀 식별자 -- 추가
    
    -- 목표 및 실적
    target_value            NUMERIC(18,4)            NOT NULL,                                           -- 목표값
    actual_value            NUMERIC(18,4),                                                               -- 실적값
    achievement_rate        NUMERIC(5,2),                                                                -- 달성률 (%)
    
    -- 상태 및 평가
    status                  VARCHAR(20)              DEFAULT 'IN_PROGRESS',                              -- 상태 (NOT_STARTED/IN_PROGRESS/ACHIEVED/NOT_ACHIEVED/EXCEEDED) -- 추가
    performance_grade       VARCHAR(10),                                                                 -- 성과 등급 (S/A/B/C/D) -- 추가
    
    -- 편차 분석
    variance_value          NUMERIC(18,4),                                                               -- 편차값 (실적-목표) -- 추가
    variance_rate           NUMERIC(5,2),                                                                -- 편차율 (%) -- 추가
    
    -- 일자 정보
    start_date              DATE,                                                                        -- 시작일 -- 추가
    end_date                DATE,                                                                        -- 종료일 -- 추가
    last_measured_at        TIMESTAMP                WITH TIME ZONE,                                     -- 최종 측정 일시 -- 추가
    
    -- 메모
    comments                TEXT,                                                                        -- 코멘트/메모 -- 추가
    action_plan             TEXT,                                                                        -- 실행 계획 -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_bim_kpi_targets__period           CHECK (target_period ~ '^\d{4}-\d{2}$'),
    -- 달성률 범위 체크 (0~999.99%)
    CONSTRAINT ck_bim_kpi_targets__achievement_rate CHECK (achievement_rate IS NULL OR achievement_rate BETWEEN 0 AND 999.99),
    -- 상태 체크
    CONSTRAINT ck_bim_kpi_targets__status           CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED', 'EXCEEDED', 'CANCELLED')),
    -- 성과 등급 체크
    CONSTRAINT ck_bim_kpi_targets__grade            CHECK (performance_grade IS NULL OR performance_grade IN ('S', 'A', 'B', 'C', 'D', 'F')),
    -- 분기 형식 체크
    CONSTRAINT ck_bim_kpi_targets__quarter          CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))

);

COMMENT ON TABLE  bim.kpi_targets                        IS 'KPI 목표값 및 실적 관리 테이블';
COMMENT ON COLUMN bim.kpi_targets.id                     IS 'KPI 목표 고유 식별자 (UUID)';
COMMENT ON COLUMN bim.kpi_targets.created_at             IS '등록 일시';
COMMENT ON COLUMN bim.kpi_targets.created_by             IS '등록자 UUID';
COMMENT ON COLUMN bim.kpi_targets.updated_at             IS '수정 일시';
COMMENT ON COLUMN bim.kpi_targets.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN bim.kpi_targets.kpi_id                 IS 'KPI 정의 식별자';
COMMENT ON COLUMN bim.kpi_targets.target_period          IS '목표 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.kpi_targets.fiscal_year            IS '회계 연도';
COMMENT ON COLUMN bim.kpi_targets.quarter                IS '분기 (Q1/Q2/Q3/Q4)';
COMMENT ON COLUMN bim.kpi_targets.department_id          IS '부서 식별자';
COMMENT ON COLUMN bim.kpi_targets.user_id                IS '사용자 식별자';
COMMENT ON COLUMN bim.kpi_targets.team_id                IS '팀 식별자';
COMMENT ON COLUMN bim.kpi_targets.target_value           IS '목표값';
COMMENT ON COLUMN bim.kpi_targets.actual_value           IS '실적값';
COMMENT ON COLUMN bim.kpi_targets.achievement_rate       IS '달성률 (%)';
COMMENT ON COLUMN bim.kpi_targets.status                 IS '상태 (NOT_STARTED: 미시작/IN_PROGRESS: 진행중/ACHIEVED: 달성/NOT_ACHIEVED: 미달성/EXCEEDED: 초과달성/CANCELLED: 취소)';
COMMENT ON COLUMN bim.kpi_targets.performance_grade      IS '성과 등급 (S/A/B/C/D/F)';
COMMENT ON COLUMN bim.kpi_targets.variance_value         IS '편차값 (실적-목표)';
COMMENT ON COLUMN bim.kpi_targets.variance_rate          IS '편차율 (%)';
COMMENT ON COLUMN bim.kpi_targets.start_date             IS '시작일';
COMMENT ON COLUMN bim.kpi_targets.end_date               IS '종료일';
COMMENT ON COLUMN bim.kpi_targets.last_measured_at       IS '최종 측정 일시';
COMMENT ON COLUMN bim.kpi_targets.comments               IS '코멘트/메모';
COMMENT ON COLUMN bim.kpi_targets.action_plan            IS '실행 계획';
COMMENT ON COLUMN bim.kpi_targets.is_deleted             IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: bim.sales_analytics
-- 설명: 매출 데이터 분석 및 집계 정보를 관리하는 테이블 (월별 집계)
-- 작성일: 2024-10-20
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
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 -- 추가
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) -- 추가
    
    -- 분석 차원
    customer_id             UUID,                                                                        -- 고객 식별자
    customer_segment        VARCHAR(50),                                                                 -- 고객 세그먼트 -- 추가
    item_category_id        UUID,                                                                        -- 품목 카테고리 식별자
    item_id                 UUID,                                                                        -- 품목 식별자 -- 추가
    sales_person_id         UUID,                                                                        -- 영업 담당자 식별자
    department_id           UUID,                                                                        -- 부서 식별자 -- 추가
    region_code             VARCHAR(50),                                                                 -- 지역 코드 -- 추가
    
    -- 매출 정보
    sales_amount            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출액
    sales_qty               INTEGER                  DEFAULT 0,                                          -- 매출 수량
    order_count             INTEGER                  DEFAULT 0,                                          -- 주문 건수 -- 추가
    
    -- 원가 및 이익
    cost_amount             NUMERIC(18,4)            DEFAULT 0,                                          -- 원가
    gross_profit            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출 총이익
    gross_profit_rate       NUMERIC(5,2),                                                                -- 매출 총이익률 (%) -- 추가
    
    -- 반품 및 할인
    return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 -- 추가
    return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 -- 추가
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 -- 추가
    
    -- 통화 및 환율
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 -- 추가
    
    -- 평균 지표
    avg_order_value         NUMERIC(18,4),                                                               -- 평균 주문 금액 -- 추가
    avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 -- 추가
    
    -- 전년 대비
    yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) -- 추가
    mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_bim_sales_analytics__period       CHECK (period ~ '^\d{4}-\d{2}$'),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_bim_sales_analytics__currency     CHECK (currency ~ '^[A-Z]{3}$'),
    -- 금액 양수 체크
    CONSTRAINT ck_bim_sales_analytics__amounts      CHECK (sales_amount >= 0 AND cost_amount >= 0 AND gross_profit >= sales_amount - cost_amount - 0.01),
    -- 수량 양수 체크
    CONSTRAINT ck_bim_sales_analytics__quantities   CHECK (sales_qty >= 0 AND order_count >= 0 AND return_qty >= 0),
    -- 분기 형식 체크
    CONSTRAINT ck_bim_sales_analytics__quarter      CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
);

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
COMMENT ON COLUMN bim.sales_analytics.item_category_id       IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.sales_analytics.item_id                IS '품목 식별자';
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

-- =====================================================================================
-- 테이블: bim.purchase_analytics
-- 설명: 구매 데이터 분석 및 집계 정보를 관리하는 테이블 (월별 집계)
-- 작성일: 2024-10-20
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
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 -- 추가
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) -- 추가
    
    -- 분석 차원
    vendor_id               UUID,                                                                        -- 공급업체 식별자
    vendor_category         VARCHAR(50),                                                                 -- 공급업체 분류 -- 추가
    item_category_id        UUID,                                                                        -- 품목 카테고리 식별자
    item_id                 UUID,                                                                        -- 품목 식별자 -- 추가
    buyer_id                UUID,                                                                        -- 구매 담당자 식별자 -- 추가
    department_id           UUID,                                                                        -- 부서 식별자 -- 추가
    
    -- 구매 정보
    purchase_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 구매액
    purchase_qty            INTEGER                  DEFAULT 0,                                          -- 구매 수량
    order_count             INTEGER                  DEFAULT 0,                                          -- 발주 건수 -- 추가
    
    -- 반품 및 할인
    return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 -- 추가
    return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 -- 추가
    discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 -- 추가
    
    -- 통화 및 환율
    currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 -- 추가
    
    -- 평균 지표
    avg_order_value         NUMERIC(18,4),                                                               -- 평균 발주 금액 -- 추가
    avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 -- 추가
    avg_lead_time_days      NUMERIC(5,1),                                                                -- 평균 리드타임 (일) -- 추가
    
    -- 품질 지표
    defect_qty              INTEGER                  DEFAULT 0,                                          -- 불량 수량 -- 추가
    defect_rate             NUMERIC(5,2),                                                                -- 불량률 (%) -- 추가
    on_time_delivery_rate   NUMERIC(5,2),                                                                -- 정시 납품률 (%) -- 추가
    
    -- 전년 대비
    yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) -- 추가
    mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_bim_purchase_analytics__period    CHECK (period ~ '^\d{4}-\d{2}$'),
    -- 통화 코드 형식 체크
    CONSTRAINT ck_bim_purchase_analytics__currency  CHECK (currency ~ '^[A-Z]{3}$'),
    -- 금액 양수 체크
    CONSTRAINT ck_bim_purchase_analytics__amounts   CHECK (purchase_amount >= 0 AND return_amount >= 0 AND discount_amount >= 0),
    -- 수량 양수 체크
    CONSTRAINT ck_bim_purchase_analytics__quantities CHECK (purchase_qty >= 0 AND order_count >= 0 AND return_qty >= 0 AND defect_qty >= 0),
    -- 분기 형식 체크
    CONSTRAINT ck_bim_purchase_analytics__quarter   CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    -- 비율 범위 체크 (0~100%)
    CONSTRAINT ck_bim_purchase_analytics__rates     CHECK ((defect_rate IS NULL OR defect_rate BETWEEN 0 AND 100) 
                                                            AND (on_time_delivery_rate IS NULL OR on_time_delivery_rate BETWEEN 0 AND 100))
);
COMMENT ON TABLE  bim.purchase_analytics                     IS '구매 데이터 분석 및 집계 정보 관리 테이블 (월별 집계)';
COMMENT ON COLUMN bim.purchase_analytics.id                  IS '구매 분석 고유 식별자 (UUID)';
COMMENT ON COLUMN bim.purchase_analytics.created_at          IS '등록 일시';
COMMENT ON COLUMN bim.purchase_analytics.created_by          IS '등록자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.updated_at          IS '수정 일시';
COMMENT ON COLUMN bim.purchase_analytics.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.period              IS '분석 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.purchase_analytics.fiscal_year         IS '회계 연도';
COMMENT ON COLUMN bim.purchase_analytics.quarter             IS '분기 (Q1/Q2/Q3/Q4)';
COMMENT ON COLUMN bim.purchase_analytics.vendor_id           IS '공급업체 식별자';
COMMENT ON COLUMN bim.purchase_analytics.vendor_category     IS '공급업체 분류';
COMMENT ON COLUMN bim.purchase_analytics.item_category_id    IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.purchase_analytics.item_id             IS '품목 식별자';
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

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- kpi_definitions 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__kpi_code
    ON bim.kpi_definitions (kpi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__kpi_code IS 'KPI 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__kpi_name
    ON bim.kpi_definitions (kpi_name)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__kpi_name IS 'KPI 명칭 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__category
    ON bim.kpi_definitions (category, sub_category)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__category IS '카테고리 및 하위카테고리별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__business_area
    ON bim.kpi_definitions (business_area)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__business_area IS '사업 영역별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__is_active
    ON bim.kpi_definitions (is_active, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__is_active IS '활성화 상태 및 표시 순서별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_definitions__owner
    ON bim.kpi_definitions (owner_user_id, owner_department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_definitions__owner IS 'KPI 담당자 및 부서별 조회 인덱스';

-- kpi_targets 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__kpi_id
    ON bim.kpi_targets (kpi_id, target_period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__kpi_id IS 'KPI별 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__target_period
    ON bim.kpi_targets (target_period DESC, status)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__target_period IS '목표 기간 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__department_id
    ON bim.kpi_targets (department_id, target_period DESC)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__department_id IS '부서별 KPI 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__user_id
    ON bim.kpi_targets (user_id, target_period DESC)
 WHERE user_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__user_id IS '사용자별 KPI 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__fiscal_year
    ON bim.kpi_targets (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__fiscal_year IS '회계연도 및 분기별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_kpi_targets__status
    ON bim.kpi_targets (status, target_period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_kpi_targets__status IS '상태 및 기간별 조회 인덱스';

-- sales_analytics 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__period
    ON bim.sales_analytics (period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__period IS '분석 기간별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__customer_id
    ON bim.sales_analytics (customer_id, period DESC)
 WHERE customer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__customer_id IS '고객별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__item_category_id
    ON bim.sales_analytics (item_category_id, period DESC)
 WHERE item_category_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__item_category_id IS '품목 카테고리별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__sales_person_id
    ON bim.sales_analytics (sales_person_id, period DESC)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__sales_person_id IS '영업 담당자별 매출 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__fiscal_year
    ON bim.sales_analytics (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__fiscal_year IS '회계연도 및 분기별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_sales_analytics__region_code
    ON bim.sales_analytics (region_code, period DESC)
 WHERE region_code IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_sales_analytics__region_code IS '지역별 매출 분석 조회 인덱스';

-- purchase_analytics 테이블 인덱스
CREATE INDEX IF NOT EXISTS ix_bim_purchase_analytics__period
    ON bim.purchase_analytics (period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_bim_purchase_analytics__period IS '분석 기간별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_purchase_analytics__vendor_id
    ON bim.purchase_analytics (vendor_id, period DESC)
 WHERE vendor_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_purchase_analytics__vendor_id IS '공급업체별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_purchase_analytics__item_category_id
    ON bim.purchase_analytics (item_category_id, period DESC)
 WHERE item_category_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_purchase_analytics__item_category_id IS '품목 카테고리별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_purchase_analytics__buyer_id
    ON bim.purchase_analytics (buyer_id, period DESC)
 WHERE buyer_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_purchase_analytics__buyer_id IS '구매 담당자별 구매 분석 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_bim_purchase_analytics__fiscal_year
    ON bim.purchase_analytics (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_bim_purchase_analytics__fiscal_year IS '회계연도 및 분기별 조회 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- KPI 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_bim_kpi_definitions__code
    ON bim.kpi_definitions (kpi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_bim_kpi_definitions__code IS 'KPI 코드 유니크 제약';

-- KPI 목표 유니크 (KPI + 기간 + 부서 + 사용자 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_bim_kpi_targets__unique
    ON bim.kpi_targets (kpi_id, target_period, COALESCE(department_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX ux_bim_kpi_targets__unique IS 'KPI 목표 유니크 제약 (KPI + 기간 + 부서 + 사용자)';

-- 매출 분석 유니크 (기간 + 고객 + 카테고리 + 영업담당 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_bim_sales_analytics__unique
    ON bim.sales_analytics (period, COALESCE(customer_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                            COALESCE(item_category_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                            COALESCE(sales_person_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX ux_bim_sales_analytics__unique IS '매출 분석 유니크 제약 (기간 + 고객 + 카테고리 + 영업담당)';

-- 구매 분석 유니크 (기간 + 공급업체 + 카테고리 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_bim_purchase_analytics__unique
    ON bim.purchase_analytics (period, COALESCE(vendor_id, '00000000-0000-0000-0000-000000000000'::uuid), 
                                COALESCE(item_category_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX ux_bim_purchase_analytics__unique IS '구매 분석 유니크 제약 (기간 + 공급업체 + 카테고리)';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- kpi_targets 테이블 외래키
-- KPI 정의 참조 외래키
ALTER TABLE bim.kpi_targets ADD CONSTRAINT fk_bim_kpi_targets__kpi_id
    FOREIGN KEY (kpi_id) REFERENCES bim.kpi_definitions(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_bim_kpi_targets__kpi_id ON bim.kpi_targets IS 'KPI 정의 참조 외래키 (CASCADE 삭제)';