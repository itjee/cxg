-- =====================================================================================
-- 테이블: crm.sales_targets
-- 설명: 영업 목표 및 실적 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.sales_targets 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 목표 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 목표 기본 정보
    target_code             VARCHAR(50)              NOT NULL,                               -- 목표 코드
    target_name             VARCHAR(200)             NOT NULL,                               -- 목표명
    target_type             VARCHAR(20)              NOT NULL,                               -- 목표 유형
    description             TEXT,                                                            -- 설명
    
    -- 대상 정보    
    employee_id             UUID,                                                            -- 대상 직원
    department_id           UUID,                                                            -- 대상 팀/부서
    
    -- 기간 정보
    period_type             VARCHAR(20)              NOT NULL,                               -- 기간 유형
    start_date              DATE                     NOT NULL,                               -- 시작일
    end_date                DATE                     NOT NULL,                               -- 종료일
    year                    INTEGER                  NOT NULL,                               -- 연도
    quarter                 INTEGER,                                                         -- 분기 (1-4)
    month                   INTEGER,                                                         -- 월 (1-12)
    
    -- 금액 목표
    target_revenue          NUMERIC(18,2)            DEFAULT 0,                              -- 목표 매출
    actual_revenue          NUMERIC(18,2)            DEFAULT 0,                              -- 실제 매출
    revenue_achievement_rate NUMERIC(5,2)            DEFAULT 0,                              -- 매출 달성률 (%)
    
    -- 건수 목표
    target_deals            INTEGER                  DEFAULT 0,                              -- 목표 계약 건수
    actual_deals            INTEGER                  DEFAULT 0,                              -- 실제 계약 건수
    deals_achievement_rate  NUMERIC(5,2)            DEFAULT 0,                              -- 건수 달성률 (%)
    
    -- 리드/기회 목표
    target_leads            INTEGER                  DEFAULT 0,                              -- 목표 리드 수
    actual_leads            INTEGER                  DEFAULT 0,                              -- 실제 리드 수
    target_opportunities    INTEGER                  DEFAULT 0,                              -- 목표 영업기회 수
    actual_opportunities    INTEGER                  DEFAULT 0,                              -- 실제 영업기회 수
    
    -- 전환율 목표
    target_conversion_rate  NUMERIC(5,2),                                                    -- 목표 전환율 (%)
    actual_conversion_rate  NUMERIC(5,2),                                                    -- 실제 전환율 (%)
    
    -- 통화
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 목표 코드 형식 체크
    CONSTRAINT ck_sales_targets__code               CHECK (target_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 목표 유형 체크 (INDIVIDUAL: 개인, TEAM: 팀, DEPARTMENT: 부서, COMPANY: 회사)
    CONSTRAINT ck_sales_targets__target_type        CHECK (target_type IN ('INDIVIDUAL', 'TEAM', 'DEPARTMENT', 'COMPANY')),
    
    -- 기간 유형 체크 (MONTH: 월별, QUARTER: 분기별, YEAR: 연도별, CUSTOM: 사용자 정의)
    CONSTRAINT ck_sales_targets__period_type        CHECK (period_type IN ('MONTH', 'QUARTER', 'YEAR', 'CUSTOM')),
    
    -- 상태 체크 (ACTIVE: 활성, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_sales_targets__status             CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    
    -- 목표 매출 음수 불가 체크
    CONSTRAINT ck_sales_targets__target_revenue     CHECK (target_revenue >= 0),
    
    -- 실제 매출 음수 불가 체크
    CONSTRAINT ck_sales_targets__actual_revenue     CHECK (actual_revenue >= 0),
    
    -- 목표 건수 음수 불가 체크
    CONSTRAINT ck_sales_targets__target_deals       CHECK (target_deals >= 0),
    
    -- 실제 건수 음수 불가 체크
    CONSTRAINT ck_sales_targets__actual_deals       CHECK (actual_deals >= 0),
    
    -- 분기 범위 체크 (1-4)
    CONSTRAINT ck_sales_targets__quarter            CHECK (quarter IS NULL OR (quarter >= 1 AND quarter <= 4)),
    
    -- 월 범위 체크 (1-12)
    CONSTRAINT ck_sales_targets__month              CHECK (month IS NULL OR (month >= 1 AND month <= 12)),
    
    -- 달성률 범위 체크 (0-999.99%)
    CONSTRAINT ck_sales_targets__revenue_achievement CHECK (revenue_achievement_rate >= 0 AND revenue_achievement_rate <= 999.99),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_sales_targets__currency           CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 종료일은 시작일 이후여야 함
    CONSTRAINT ck_sales_targets__dates              CHECK (end_date >= start_date),
    
    -- 대상은 직원 또는 팀 중 하나는 필수
    CONSTRAINT ck_sales_targets__target             CHECK (
        (target_type = 'INDIVIDUAL' AND employee_id IS NOT NULL) OR
        (target_type IN ('TEAM', 'DEPARTMENT') AND department_id IS NOT NULL) OR
        (target_type = 'COMPANY')
    )
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.sales_targets                      IS '영업 목표 및 실적 관리 테이블';
COMMENT ON COLUMN crm.sales_targets.id                   IS '목표 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.sales_targets.created_at           IS '등록 일시';
COMMENT ON COLUMN crm.sales_targets.created_by           IS '등록자 UUID';
COMMENT ON COLUMN crm.sales_targets.updated_at           IS '수정 일시';
COMMENT ON COLUMN crm.sales_targets.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN crm.sales_targets.target_code          IS '목표 코드 (고유번호)';
COMMENT ON COLUMN crm.sales_targets.target_name          IS '목표명';
COMMENT ON COLUMN crm.sales_targets.target_type          IS '목표 유형 (INDIVIDUAL: 개인, TEAM: 팀, DEPARTMENT: 부서, COMPANY: 회사)';
COMMENT ON COLUMN crm.sales_targets.description          IS '설명';
COMMENT ON COLUMN crm.sales_targets.employee_id          IS '대상 직원 UUID';
COMMENT ON COLUMN crm.sales_targets.department_id        IS '대상 팀/부서 UUID';
COMMENT ON COLUMN crm.sales_targets.period_type          IS '기간 유형 (MONTH: 월별, QUARTER: 분기별, YEAR: 연도별, CUSTOM: 사용자 정의)';
COMMENT ON COLUMN crm.sales_targets.start_date           IS '시작일';
COMMENT ON COLUMN crm.sales_targets.end_date             IS '종료일';
COMMENT ON COLUMN crm.sales_targets.year                 IS '연도';
COMMENT ON COLUMN crm.sales_targets.quarter              IS '분기 (1-4)';
COMMENT ON COLUMN crm.sales_targets.month                IS '월 (1-12)';
COMMENT ON COLUMN crm.sales_targets.target_revenue       IS '목표 매출';
COMMENT ON COLUMN crm.sales_targets.actual_revenue       IS '실제 매출';
COMMENT ON COLUMN crm.sales_targets.revenue_achievement_rate IS '매출 달성률 (%)';
COMMENT ON COLUMN crm.sales_targets.target_deals         IS '목표 계약 건수';
COMMENT ON COLUMN crm.sales_targets.actual_deals         IS '실제 계약 건수';
COMMENT ON COLUMN crm.sales_targets.deals_achievement_rate IS '건수 달성률 (%)';
COMMENT ON COLUMN crm.sales_targets.target_leads         IS '목표 리드 수';
COMMENT ON COLUMN crm.sales_targets.actual_leads         IS '실제 리드 수';
COMMENT ON COLUMN crm.sales_targets.target_opportunities IS '목표 영업기회 수';
COMMENT ON COLUMN crm.sales_targets.actual_opportunities IS '실제 영업기회 수';
COMMENT ON COLUMN crm.sales_targets.target_conversion_rate IS '목표 전환율 (%)';
COMMENT ON COLUMN crm.sales_targets.actual_conversion_rate IS '실제 전환율 (%)';
COMMENT ON COLUMN crm.sales_targets.currency             IS '통화 (ISO 4217)';
COMMENT ON COLUMN crm.sales_targets.status               IS '상태 (ACTIVE: 활성, COMPLETED: 완료, CANCELLED: 취소)';
COMMENT ON COLUMN crm.sales_targets.is_deleted           IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.sales_targets.notes                IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_sales_targets__code 
    ON crm.sales_targets (target_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_sales_targets__code IS '목표 코드 유니크 제약';

CREATE UNIQUE INDEX ux_sales_targets__employee_period 
    ON crm.sales_targets (employee_id, period_type, year, quarter, month)
 WHERE employee_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_sales_targets__employee_period IS '직원별 기간 유니크 제약';

CREATE UNIQUE INDEX ux_sales_targets__team_period 
    ON crm.sales_targets (department_id, period_type, year, quarter, month)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_sales_targets__team_period IS '팀별 기간 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_sales_targets__target_type 
    ON crm.sales_targets (target_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__target_type IS '목표 유형별 조회 인덱스';

CREATE INDEX ix_sales_targets__employee_id 
    ON crm.sales_targets (employee_id)
 WHERE employee_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__employee_id IS '직원별 조회 인덱스';

CREATE INDEX ix_sales_targets__department_id 
    ON crm.sales_targets (department_id)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__department_id IS '팀별 조회 인덱스';

CREATE INDEX ix_sales_targets__period 
    ON crm.sales_targets (period_type, year, quarter, month)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__period IS '기간별 조회 인덱스';

CREATE INDEX ix_sales_targets__year_quarter 
    ON crm.sales_targets (year DESC, quarter DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__year_quarter IS '연도/분기별 조회 인덱스';

CREATE INDEX ix_sales_targets__status 
    ON crm.sales_targets (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__status IS '상태별 조회 인덱스';

CREATE INDEX ix_sales_targets__achievement 
    ON crm.sales_targets (revenue_achievement_rate DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_sales_targets__achievement IS '달성률별 조회 인덱스';

-- 외래키 제약조건
-- 직원 참조 (CASCADE 삭제)
ALTER TABLE crm.sales_targets 
  ADD CONSTRAINT fk_sales_targets__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_sales_targets__employee_id ON crm.sales_targets IS '직원 참조 외래키 (CASCADE 삭제)';

-- 팀 참조 (CASCADE 삭제)
ALTER TABLE crm.sales_targets 
  ADD CONSTRAINT fk_sales_targets__department_id
    FOREIGN KEY (department_id) 
    REFERENCES hrm.departments(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_sales_targets__department_id ON crm.sales_targets IS '팀 참조 외래키 (CASCADE 삭제)';

-- =====================================================================================
-- 완료: crm.sales_targets 테이블 정의
-- =====================================================================================
