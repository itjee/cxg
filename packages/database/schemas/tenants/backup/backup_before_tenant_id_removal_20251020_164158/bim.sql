-- ============================================================================
-- Business Intelligence & Analytics Schema (bim)
-- ============================================================================
-- Description: BI/분석 (대시보드, 리포트, KPI, 데이터 분석)
-- Database: tnnt_db (Tenant Database)
-- Schema: bim
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS bim;

COMMENT ON SCHEMA bim IS 'BIM: BI/분석 스키마 (대시보드, 리포트, KPI)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- BIM: 경영분석 (Business Intelligence & EPM)
-- ============================================================================

-- =====================================================================================
-- 테이블: bim.kpi_definitions
-- 설명: KPI 정의 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.kpi_definitions 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- KPI 정의 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    kpi_code                VARCHAR(50)              NOT NULL,                                  -- KPI 코드
    kpi_name                VARCHAR(200)             NOT NULL,                                  -- KPI 명칭
    description             TEXT,                                                               -- KPI 설명
    category                VARCHAR(50),                                                        -- KPI 카테고리
    
    -- 측정 정보
    measurement_unit        VARCHAR(20),                                                        -- 측정 단위
    calculation_formula     TEXT,                                                               -- 계산 공식
    target_type             VARCHAR(20)              DEFAULT 'HIGHER_BETTER',                   -- 목표 유형
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                              -- 활성화 상태
    is_deleted              BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_kpi_definitions__target_type      CHECK (target_type IN ('HIGHER_BETTER', 'LOWER_BETTER', 'TARGET_VALUE'))
);

-- =====================================================================================
-- 테이블: bim.kpi_targets
-- 설명: KPI 목표값 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.kpi_targets 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- KPI 목표 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 목표 정보
    kpi_id                  UUID                     NOT NULL,                                  -- KPI 정의 식별자
    target_period           VARCHAR(7)               NOT NULL,                                  -- 목표 기간 (YYYY-MM)
    department_id           UUID,                                                               -- 부서 식별자
    user_id                 UUID,                                                               -- 사용자 식별자
    
    -- 목표/실적 정보
    target_value            NUMERIC(18,4)            NOT NULL,                                  -- 목표값
    actual_value            NUMERIC(18,4),                                                      -- 실적값
    achievement_rate        NUMERIC(5,2),                                                       -- 달성률
    
    -- 제약조건
    CONSTRAINT ck_kpi_targets__achievement_rate     CHECK (achievement_rate >= 0)
);

-- =====================================================================================
-- 테이블: bim.sales_analytics
-- 설명: 매출 분석 테이블 (월별 집계)
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.sales_analytics 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 분석 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    period                  VARCHAR(7)               NOT NULL,                                  -- 집계 기간 (YYYY-MM)
    
    -- 분석 차원
    customer_id             UUID,                                                               -- 고객 식별자
    item_category_id        UUID,                                                               -- 품목 카테고리 식별자
    sales_person_id         UUID,                                                               -- 영업사원 식별자
    
    -- 집계 정보
    sales_amount            NUMERIC(18,4)            DEFAULT 0,                                 -- 매출액
    sales_qty               INTEGER                  DEFAULT 0,                                 -- 매출수량
    cost_amount             NUMERIC(18,4)            DEFAULT 0,                                 -- 원가
    gross_profit            NUMERIC(18,4)            DEFAULT 0,                                 -- 매출총이익
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 제약조건
    CONSTRAINT ck_sales_analytics__amounts          CHECK (sales_amount >= 0 AND cost_amount >= 0),
    CONSTRAINT ck_sales_analytics__sales_qty        CHECK (sales_qty >= 0)
);

-- =====================================================================================
-- 테이블: bim.purchase_analytics
-- 설명: 구매 분석 테이블 (월별 집계)
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS bim.purchase_analytics 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 분석 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    period                  VARCHAR(7)               NOT NULL,                                  -- 집계 기간 (YYYY-MM)
    
    -- 분석 차원
    vendor_id               UUID,                                                               -- 공급업체 식별자
    item_category_id        UUID,                                                               -- 품목 카테고리 식별자
    
    -- 집계 정보
    purchase_amount         NUMERIC(18,4)            DEFAULT 0,                                 -- 구매액
    purchase_qty            INTEGER                  DEFAULT 0,                                 -- 구매수량
    currency                VARCHAR(3)               DEFAULT 'KRW',                             -- 통화
    
    -- 제약조건
    CONSTRAINT ck_purchase_analytics__amounts       CHECK (purchase_amount >= 0),
    CONSTRAINT ck_purchase_analytics__purchase_qty  CHECK (purchase_qty >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  bim.kpi_definitions                      IS 'KPI 정의 관리 테이블';
COMMENT ON COLUMN bim.kpi_definitions.id                   IS 'KPI 정의 고유 식별자';
COMMENT ON COLUMN bim.kpi_definitions.created_at           IS '등록 일시';
COMMENT ON COLUMN bim.kpi_definitions.created_by           IS '등록자 UUID';
COMMENT ON COLUMN bim.kpi_definitions.updated_at           IS '수정 일시';
COMMENT ON COLUMN bim.kpi_definitions.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN bim.kpi_definitions.tenant_id            IS '테넌트 식별자';
COMMENT ON COLUMN bim.kpi_definitions.company_id           IS '회사 식별자';
COMMENT ON COLUMN bim.kpi_definitions.kpi_code             IS 'KPI 코드';
COMMENT ON COLUMN bim.kpi_definitions.kpi_name             IS 'KPI 명칭';
COMMENT ON COLUMN bim.kpi_definitions.description          IS 'KPI 설명';
COMMENT ON COLUMN bim.kpi_definitions.category             IS 'KPI 카테고리';
COMMENT ON COLUMN bim.kpi_definitions.measurement_unit     IS '측정 단위';
COMMENT ON COLUMN bim.kpi_definitions.calculation_formula  IS '계산 공식';
COMMENT ON COLUMN bim.kpi_definitions.target_type          IS '목표 유형 (HIGHER_BETTER/LOWER_BETTER/TARGET_VALUE)';
COMMENT ON COLUMN bim.kpi_definitions.is_active            IS '활성화 상태';
COMMENT ON COLUMN bim.kpi_definitions.is_deleted              IS '논리 삭제 플래그';

COMMENT ON TABLE  bim.kpi_targets                          IS 'KPI 목표값 관리 테이블';
COMMENT ON COLUMN bim.kpi_targets.id                       IS 'KPI 목표 고유 식별자';
COMMENT ON COLUMN bim.kpi_targets.created_at               IS '등록 일시';
COMMENT ON COLUMN bim.kpi_targets.created_by               IS '등록자 UUID';
COMMENT ON COLUMN bim.kpi_targets.updated_at               IS '수정 일시';
COMMENT ON COLUMN bim.kpi_targets.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN bim.kpi_targets.kpi_id                   IS 'KPI 정의 식별자';
COMMENT ON COLUMN bim.kpi_targets.target_period            IS '목표 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.kpi_targets.department_id            IS '부서 식별자';
COMMENT ON COLUMN bim.kpi_targets.user_id                  IS '사용자 식별자';
COMMENT ON COLUMN bim.kpi_targets.target_value             IS '목표값';
COMMENT ON COLUMN bim.kpi_targets.actual_value             IS '실적값';
COMMENT ON COLUMN bim.kpi_targets.achievement_rate         IS '달성률';

COMMENT ON TABLE  bim.sales_analytics                      IS '매출 분석 테이블 (월별 집계)';
COMMENT ON COLUMN bim.sales_analytics.id                   IS '분석 고유 식별자';
COMMENT ON COLUMN bim.sales_analytics.created_at           IS '등록 일시';
COMMENT ON COLUMN bim.sales_analytics.created_by           IS '등록자 UUID';
COMMENT ON COLUMN bim.sales_analytics.updated_at           IS '수정 일시';
COMMENT ON COLUMN bim.sales_analytics.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN bim.sales_analytics.tenant_id            IS '테넌트 식별자';
COMMENT ON COLUMN bim.sales_analytics.company_id           IS '회사 식별자';
COMMENT ON COLUMN bim.sales_analytics.period               IS '집계 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.sales_analytics.customer_id          IS '고객 식별자';
COMMENT ON COLUMN bim.sales_analytics.item_category_id     IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.sales_analytics.sales_person_id      IS '영업사원 식별자';
COMMENT ON COLUMN bim.sales_analytics.sales_amount         IS '매출액';
COMMENT ON COLUMN bim.sales_analytics.sales_qty            IS '매출수량';
COMMENT ON COLUMN bim.sales_analytics.cost_amount          IS '원가';
COMMENT ON COLUMN bim.sales_analytics.gross_profit         IS '매출총이익';
COMMENT ON COLUMN bim.sales_analytics.currency             IS '통화 (ISO 4217)';

COMMENT ON TABLE  bim.purchase_analytics                   IS '구매 분석 테이블 (월별 집계)';
COMMENT ON COLUMN bim.purchase_analytics.id                IS '분석 고유 식별자';
COMMENT ON COLUMN bim.purchase_analytics.created_at        IS '등록 일시';
COMMENT ON COLUMN bim.purchase_analytics.created_by        IS '등록자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.updated_at        IS '수정 일시';
COMMENT ON COLUMN bim.purchase_analytics.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN bim.purchase_analytics.tenant_id         IS '테넌트 식별자';
COMMENT ON COLUMN bim.purchase_analytics.company_id        IS '회사 식별자';
COMMENT ON COLUMN bim.purchase_analytics.period            IS '집계 기간 (YYYY-MM)';
COMMENT ON COLUMN bim.purchase_analytics.vendor_id         IS '공급업체 식별자';
COMMENT ON COLUMN bim.purchase_analytics.item_category_id  IS '품목 카테고리 식별자';
COMMENT ON COLUMN bim.purchase_analytics.purchase_amount   IS '구매액';
COMMENT ON COLUMN bim.purchase_analytics.purchase_qty      IS '구매수량';
COMMENT ON COLUMN bim.purchase_analytics.currency          IS '통화 (ISO 4217)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 기본 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_kpi_definitions__tenant_id
    ON bim.kpi_definitions (tenant_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__company_id
    ON bim.kpi_definitions (company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__kpi_code
    ON bim.kpi_definitions (kpi_code)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__category
    ON bim.kpi_definitions (category)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__is_active
    ON bim.kpi_definitions (is_active)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_kpi_targets__kpi_id
    ON bim.kpi_targets (kpi_id);

CREATE INDEX IF NOT EXISTS ix_kpi_targets__target_period
    ON bim.kpi_targets (target_period);

CREATE INDEX IF NOT EXISTS ix_kpi_targets__department_id
    ON bim.kpi_targets (department_id)
 WHERE department_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_kpi_targets__user_id
    ON bim.kpi_targets (user_id)
 WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_sales_analytics__tenant_id
    ON bim.sales_analytics (tenant_id);

CREATE INDEX IF NOT EXISTS ix_sales_analytics__company_id
    ON bim.sales_analytics (company_id);

CREATE INDEX IF NOT EXISTS ix_sales_analytics__period
    ON bim.sales_analytics (period);

CREATE INDEX IF NOT EXISTS ix_sales_analytics__customer_id
    ON bim.sales_analytics (customer_id)
 WHERE customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_sales_analytics__sales_person_id
    ON bim.sales_analytics (sales_person_id)
 WHERE sales_person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__tenant_id
    ON bim.purchase_analytics (tenant_id);

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__company_id
    ON bim.purchase_analytics (company_id);

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__period
    ON bim.purchase_analytics (period);

CREATE INDEX IF NOT EXISTS ix_purchase_analytics__vendor_id
    ON bim.purchase_analytics (vendor_id)
 WHERE vendor_id IS NOT NULL;

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 회사별 KPI 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_kpi_definitions__company_code
    ON bim.kpi_definitions (company_id, kpi_code)
 WHERE is_deleted = false;

-- KPI별 목표 기간 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_kpi_targets__kpi_period_dept
    ON bim.kpi_targets (kpi_id, target_period, COALESCE(department_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- 매출 분석 기간별 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_analytics__company_period
    ON bim.sales_analytics (company_id, period, COALESCE(customer_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(item_category_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(sales_person_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- 구매 분석 기간별 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_analytics__company_period
    ON bim.purchase_analytics (company_id, period, COALESCE(vendor_id, '00000000-0000-0000-0000-000000000000'::UUID), COALESCE(item_category_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

ALTER TABLE bim.kpi_targets ADD CONSTRAINT fk_kpi_targets__kpi_id
    FOREIGN KEY (kpi_id) REFERENCES bim.kpi_definitions(id) ON DELETE CASCADE;
