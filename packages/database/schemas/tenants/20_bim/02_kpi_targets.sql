-- =====================================================================================
-- 테이블: bim.kpi_targets
-- 설명: KPI 목표값 및 실적을 관리하는 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
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
    fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)
    quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)
    department_id           UUID,                                                                        -- 부서 식별자
    user_id                 UUID,                                                                        -- 사용자 식별자
    team_id                 UUID,                                                                        -- 팀 식별자 (추가)
    
    -- 목표 및 실적
    target_value            NUMERIC(18,4)            NOT NULL,                                           -- 목표값
    actual_value            NUMERIC(18,4),                                                               -- 실적값
    achievement_rate        NUMERIC(5,2),                                                                -- 달성률 (%)
    
    -- 상태 및 평가
    status                  VARCHAR(20)              DEFAULT 'IN_PROGRESS',                              -- 상태 (NOT_STARTED/IN_PROGRESS/ACHIEVED/NOT_ACHIEVED/EXCEEDED) (추가)
    performance_grade       VARCHAR(10),                                                                 -- 성과 등급 (S/A/B/C/D) (추가)
    
    -- 편차 분석
    variance_value          NUMERIC(18,4),                                                               -- 편차값 (실적-목표) (추가)
    variance_rate           NUMERIC(5,2),                                                                -- 편차율 (%) (추가)
    
    -- 일자 정보
    start_date              DATE,                                                                        -- 시작일 (추가)
    end_date                DATE,                                                                        -- 종료일 (추가)
    last_measured_at        TIMESTAMP                WITH TIME ZONE,                                     -- 최종 측정 일시 (추가)
    
    -- 메모
    comments                TEXT,                                                                        -- 코멘트/메모 (추가)
    action_plan             TEXT,                                                                        -- 실행 계획 (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_kpi_targets__period           CHECK (target_period ~ '^\d{4}-\d{2}$'),
    
    -- 달성률 범위 체크 (0~999.99%)
    CONSTRAINT ck_kpi_targets__achievement_rate CHECK (achievement_rate IS NULL OR achievement_rate BETWEEN 0 AND 999.99),
    
    -- 상태 체크
    CONSTRAINT ck_kpi_targets__status           CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED', 'EXCEEDED', 'CANCELLED')),
    
    -- 성과 등급 체크
    CONSTRAINT ck_kpi_targets__grade            CHECK (performance_grade IS NULL OR performance_grade IN ('S', 'A', 'B', 'C', 'D', 'F')),
    
    -- 분기 형식 체크
    CONSTRAINT ck_kpi_targets__quarter          CHECK (quarter IS NULL OR quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
);

-- 테이블 및 컬럼 주석
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

-- 유니크 인덱스
-- KPI 목표 유니크 (KPI + 기간 + 부서 + 사용자 조합)
CREATE UNIQUE INDEX IF NOT EXISTS ux_kpi_targets__unique
    ON bim.kpi_targets (kpi_id, target_period, COALESCE(department_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid))
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ux_kpi_targets__unique IS 'KPI 목표 유니크 제약 (KPI + 기간 + 부서 + 사용자)';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_kpi_targets__kpi_id
    ON bim.kpi_targets (kpi_id, target_period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__kpi_id IS 'KPI별 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_targets__target_period
    ON bim.kpi_targets (target_period DESC, status)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__target_period IS '목표 기간 및 상태별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_targets__department_id
    ON bim.kpi_targets (department_id, target_period DESC)
 WHERE department_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__department_id IS '부서별 KPI 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_targets__user_id
    ON bim.kpi_targets (user_id, target_period DESC)
 WHERE user_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__user_id IS '사용자별 KPI 목표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_targets__fiscal_year
    ON bim.kpi_targets (fiscal_year, quarter)
 WHERE fiscal_year IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__fiscal_year IS '회계연도 및 분기별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_kpi_targets__status
    ON bim.kpi_targets (status, target_period DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX bim.ix_kpi_targets__status IS '상태 및 기간별 조회 인덱스';

-- 외래키 제약조건
-- KPI 정의 참조 (CASCADE 삭제)
ALTER TABLE bim.kpi_targets 
  ADD CONSTRAINT fk_kpi_targets__kpi_id
    FOREIGN KEY (kpi_id) 
    REFERENCES bim.kpi_definitions(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_kpi_targets__kpi_id ON bim.kpi_targets IS 'KPI 정의 참조 외래키 (CASCADE 삭제)';
