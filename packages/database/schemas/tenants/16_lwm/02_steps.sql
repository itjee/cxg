-- =====================================================================================
-- 테이블: lwm.steps
-- 설명: 워크플로우 단계 테이블
-- 작성일: 2025-10-25
-- 수정일: 2025-10-25
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.steps
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단계 고유 식별자    
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID
    
    -- 워크플로우 관계
    workflow_id             UUID                     NOT NULL,                               -- 워크플로우 ID

    -- 단계 정보
    step_no                 INTEGER                  NOT NULL,                               -- 단계 번호
    step_name               VARCHAR(255)             NOT NULL,                               -- 단계명
    step_type               VARCHAR(50)              NOT NULL,                               -- 단계 유형 (sequential, parallel, conditional)
    action_type             VARCHAR(50)              NOT NULL,                               -- 작업 유형 (approve, reject, review, etc)
    description             TEXT,                                                            -- 설명        

    -- 승인 설정
    required_approvers      INTEGER                  DEFAULT 1,                              -- 필요한 승인자 수
    timeout_days            INTEGER,                                                         -- 타임아웃 (일 수)

    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    config                  JSONB,                                                           -- 단계 설정 (JSON)

    -- 외래키 제약
    -- CONSTRAINT fk_steps__tenant_id          FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
    CONSTRAINT fk_steps__workflow_id        FOREIGN KEY (workflow_id) REFERENCES lwm.workflows(id) ON DELETE CASCADE
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  lwm.steps                             IS '워크플로우 단계 테이블';
COMMENT ON COLUMN lwm.steps.id                          IS '단계 고유 식별자 (UUID)';
COMMENT ON COLUMN lwm.steps.tenant_id                   IS '테넌트 ID';
COMMENT ON COLUMN lwm.steps.created_at                  IS '등록 일시';
COMMENT ON COLUMN lwm.steps.created_by                  IS '등록자 UUID';
COMMENT ON COLUMN lwm.steps.updated_at                  IS '수정 일시';
COMMENT ON COLUMN lwm.steps.updated_by                  IS '수정자 UUID';
COMMENT ON COLUMN lwm.steps.workflow_id                 IS '워크플로우 ID';
COMMENT ON COLUMN lwm.steps.step_no                     IS '단계 번호';
COMMENT ON COLUMN lwm.steps.step_name                   IS '단계명';
COMMENT ON COLUMN lwm.steps.description                 IS '설명';
COMMENT ON COLUMN lwm.steps.step_type                   IS '단계 유형 (sequential, parallel, conditional)';
COMMENT ON COLUMN lwm.steps.action_type                 IS '작업 유형 (approve, reject, review, etc)';
COMMENT ON COLUMN lwm.steps.required_approvers          IS '필요한 승인자 수';
COMMENT ON COLUMN lwm.steps.timeout_days                IS '타임아웃 (일 수)';
COMMENT ON COLUMN lwm.steps.is_active                   IS '활성 여부';
COMMENT ON COLUMN lwm.steps.config                      IS '단계 설정 (JSON)';

-- 일반 인덱스
CREATE INDEX ix_steps__tenant_id
    ON lwm.steps (tenant_id);
COMMENT ON INDEX lwm.ix_steps__tenant_id IS '테넌트별 조회 인덱스';

CREATE INDEX ix_steps__workflow_id
    ON lwm.steps (workflow_id);
COMMENT ON INDEX lwm.ix_steps__workflow_id IS '워크플로우별 단계 조회 인덱스';

CREATE INDEX ix_steps__step_no
    ON lwm.steps (workflow_id, step_no);
COMMENT ON INDEX lwm.ix_steps__step_no IS '워크플로우별 단계 번호 조회 인덱스';

CREATE INDEX ix_steps__is_active
    ON lwm.steps (is_active);
COMMENT ON INDEX lwm.ix_steps__is_active IS '활성 단계 조회 인덱스';
