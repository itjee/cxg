-- =====================================================================================
-- 테이블: bim.kpi_definitions
-- 설명: KPI(핵심성과지표) 정의 및 설정 정보 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
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
    kpi_name_en             VARCHAR(200),                                                                -- KPI 영문명 (추가 - 다국어 지원)
    description             TEXT,                                                                        -- KPI 상세 설명
    
    -- KPI 분류
    category                VARCHAR(50),                                                                 -- KPI 카테고리 (매출/수익성/효율성/품질/고객만족)
    sub_category            VARCHAR(50),                                                                 -- 하위 카테고리 (추가)
    business_area           VARCHAR(50),                                                                 -- 사업 영역 (영업/생산/재무/인사 등) (추가)
    
    -- 측정 정보
    measurement_unit        VARCHAR(20),                                                                 -- 측정 단위 (원/%/건수/시간 등)
    calculation_formula     TEXT,                                                                        -- 계산 방법 (수식/집계 방법)
    data_source             TEXT,                                                                        -- 데이터 출처 (추가)
    measurement_frequency   VARCHAR(20)              DEFAULT 'MONTHLY',                                  -- 측정 주기 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY) (추가)
    
    -- 목표 설정
    target_type             VARCHAR(20)              DEFAULT 'HIGHER_BETTER',                            -- 목표 유형 (HIGHER_BETTER/LOWER_BETTER/TARGET_VALUE/RANGE)
    default_target_value    NUMERIC(18,4),                                                               -- 기본 목표값 (추가)
    threshold_warning       NUMERIC(18,4),                                                               -- 경고 임계값 (추가)
    threshold_critical      NUMERIC(18,4),                                                               -- 위험 임계값 (추가)
    
    -- 표시 정보
    display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서 (추가)
    chart_type              VARCHAR(20),                                                                 -- 차트 유형 (LINE/BAR/PIE/GAUGE) (추가)
    color_code              VARCHAR(7),                                                                  -- 색상 코드 (#RRGGBB) (추가)
    icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 (추가)
    
    -- 책임 및 소유
    owner_user_id           UUID,                                                                        -- KPI 담당자 UUID (추가)
    owner_department_id     UUID,                                                                        -- KPI 책임 부서 UUID (추가)
    
    -- 추가 정보
    notes                   TEXT,                                                                        -- 비고 (추가)
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성화 여부
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 목표 유형 체크 (HIGHER_BETTER: 높을수록 좋음, LOWER_BETTER: 낮을수록 좋음, TARGET_VALUE: 목표값 달성, RANGE: 범위 내)
    CONSTRAINT ck_kpi_definitions__target_type  CHECK (target_type IN ('HIGHER_BETTER', 'LOWER_BETTER', 'TARGET_VALUE', 'RANGE')),
    
    -- 측정 주기 체크
    CONSTRAINT ck_kpi_definitions__frequency    CHECK (measurement_frequency IS NULL OR measurement_frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    
    -- 차트 유형 체크
    CONSTRAINT ck_kpi_definitions__chart_type   CHECK (chart_type IS NULL OR chart_type IN ('LINE', 'BAR', 'PIE', 'GAUGE', 'AREA', 'SCATTER')),
    
    -- 표시 순서 양수 체크
    CONSTRAINT ck_kpi_definitions__display_order CHECK (display_order >= 0),
    
    -- 색상 코드 형식 체크 (#RRGGBB)
    CONSTRAINT ck_kpi_definitions__color_code   CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

-- 테이블 및 컬럼 주석
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
COMMENT ON COLUMN bim.kpi_definitions.measurement_unit       IS '측정 단위 (원/%/건수/시간 등)';
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

-- 유니크 인덱스
-- KPI 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_kpi_definitions__code
    ON bim.kpi_definitions (kpi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ux_kpi_definitions__code IS 'KPI 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_kpi_definitions__kpi_code
    ON bim.kpi_definitions (kpi_code)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__kpi_code IS 'KPI 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__kpi_name
    ON bim.kpi_definitions (kpi_name)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__kpi_name IS 'KPI 명칭 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__category
    ON bim.kpi_definitions (category, sub_category)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__category IS '카테고리 및 하위카테고리별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__business_area
    ON bim.kpi_definitions (business_area)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__business_area IS '사업 영역별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__is_active
    ON bim.kpi_definitions (is_active, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__is_active IS '활성화 상태 및 표시 순서별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_definitions__owner
    ON bim.kpi_definitions (owner_user_id, owner_department_id)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_definitions__owner IS 'KPI 담당자 및 부서별 조회 인덱스';
