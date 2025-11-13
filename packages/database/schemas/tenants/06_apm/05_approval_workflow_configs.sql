-- =====================================================================================
-- 테이블: apm.approval_workflow_configs
-- 설명: 결재선별 워크플로우 설정 (금액 조건, 에스컬레이션 등)
-- 작성일: 2025-10-27
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS apm.approval_workflow_configs
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 워크플로우 설정 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 결재선 참조
    line_id                 UUID                     NOT NULL,                               -- 결재선 ID
    
    -- 적용 대상
    module_code             VARCHAR(50)              NOT NULL,                               -- 모듈 코드 (PSM, SRM, FIM 등)
    
    -- 우선순위 및 기본 설정
    version                 INTEGER                  NOT NULL DEFAULT 1,                     -- 버전
    is_default              BOOLEAN                  NOT NULL DEFAULT false,                 -- 기본 워크플로우 여부
    priority                INTEGER                  NOT NULL DEFAULT 0,                     -- 우선순위
    
    -- 조건 설정
    condition_rule          JSONB,                                                           -- 조건 규칙 (JSON)
    min_amount              NUMERIC(18,4),                                                   -- 최소 금액 (조건)
    max_amount              NUMERIC(18,4),                                                   -- 최대 금액 (조건)
    
    -- 알림 설정
    is_notification_enabled BOOLEAN                  NOT NULL DEFAULT true,                  -- 알림 활성화 여부
    escalation_enabled      BOOLEAN                  NOT NULL DEFAULT false,                 -- 에스컬레이션 활성화 여부
    escalation_hours        INTEGER,                                                         -- 에스컬레이션 시간 (시간)
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 외래키 제약조건
    CONSTRAINT fk_approval_workflow_configs__line_id    
        FOREIGN KEY (line_id) 
        REFERENCES apm.approval_lines(id) 
        ON DELETE CASCADE,
    
    -- CHECK 제약조건
    CONSTRAINT ck_approval_workflow_configs__version            
        CHECK (version > 0),
    
    CONSTRAINT ck_approval_workflow_configs__priority           
        CHECK (priority >= 0),
    
    CONSTRAINT ck_approval_workflow_configs__amount_range       
        CHECK (min_amount IS NULL OR max_amount IS NULL OR min_amount <= max_amount),
    
    CONSTRAINT ck_approval_workflow_configs__escalation_hours   
        CHECK (escalation_hours IS NULL OR escalation_hours > 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  apm.approval_workflow_configs                         IS '결재선별 워크플로우 설정 (금액 조건, 에스컬레이션 등)';
COMMENT ON COLUMN apm.approval_workflow_configs.id                      IS '워크플로우 설정 고유 식별자';
COMMENT ON COLUMN apm.approval_workflow_configs.created_at              IS '등록 일시';
COMMENT ON COLUMN apm.approval_workflow_configs.created_by              IS '등록자 UUID';
COMMENT ON COLUMN apm.approval_workflow_configs.updated_at              IS '수정 일시';
COMMENT ON COLUMN apm.approval_workflow_configs.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN apm.approval_workflow_configs.line_id                 IS '결재선 ID';
COMMENT ON COLUMN apm.approval_workflow_configs.module_code             IS '모듈 코드 (PSM: 구매, SRM: 판매, FIM: 재무 등)';
COMMENT ON COLUMN apm.approval_workflow_configs.version                 IS '버전';
COMMENT ON COLUMN apm.approval_workflow_configs.is_default              IS '기본 워크플로우 여부';
COMMENT ON COLUMN apm.approval_workflow_configs.priority                IS '우선순위 (낮은 값이 높은 우선순위)';
COMMENT ON COLUMN apm.approval_workflow_configs.condition_rule          IS '조건 규칙 (JSON 형식)';
COMMENT ON COLUMN apm.approval_workflow_configs.min_amount              IS '최소 금액 (조건)';
COMMENT ON COLUMN apm.approval_workflow_configs.max_amount              IS '최대 금액 (조건)';
COMMENT ON COLUMN apm.approval_workflow_configs.is_notification_enabled IS '알림 활성화 여부';
COMMENT ON COLUMN apm.approval_workflow_configs.escalation_enabled      IS '에스컬레이션 활성화 여부';
COMMENT ON COLUMN apm.approval_workflow_configs.escalation_hours        IS '에스컬레이션 시간 (시간)';
COMMENT ON COLUMN apm.approval_workflow_configs.notes                   IS '비고';
COMMENT ON COLUMN apm.approval_workflow_configs.is_active               IS '활성 상태';
COMMENT ON COLUMN apm.approval_workflow_configs.is_deleted              IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_approval_workflow_configs__line_id
    ON apm.approval_workflow_configs (line_id)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ix_approval_workflow_configs__line_id IS '결재선별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_workflow_configs__module_code
    ON apm.approval_workflow_configs (module_code)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ix_approval_workflow_configs__module_code IS '모듈별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_workflow_configs__is_active
    ON apm.approval_workflow_configs (is_active, priority)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ix_approval_workflow_configs__is_active IS '활성 상태 및 우선순위별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_approval_workflow_configs__amount_range
    ON apm.approval_workflow_configs (min_amount, max_amount)
 WHERE is_deleted = false 
   AND (min_amount IS NOT NULL OR max_amount IS NOT NULL);
COMMENT ON INDEX apm.ix_approval_workflow_configs__amount_range IS '금액 범위 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_workflow_configs__line_module
    ON apm.approval_workflow_configs (line_id, module_code)
 WHERE is_deleted = false;
COMMENT ON INDEX apm.ux_approval_workflow_configs__line_module IS '결재선별 모듈 유니크 제약';
