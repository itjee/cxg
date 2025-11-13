-- =====================================================================================
-- 테이블: lwm.workflows
-- 설명: 워크플로우 테이블 - 승인/작업 흐름 정의
-- 작성일: 2025-10-25
-- 수정일: 2025-10-25
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.workflows
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 워크플로우 고유 식별자    
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID

    -- 워크플로우 정보
    workflow_name           VARCHAR(255)             NOT NULL,                               -- 워크플로우명
    workflow_type           VARCHAR(50)              NOT NULL,                               -- 워크플로우 유형 (approval, task, etc)
    description             TEXT,                                                            -- 설명    
    status                  VARCHAR(50)              NOT NULL DEFAULT 'draft',                -- 상태 (draft, active, inactive)

    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    version                 INTEGER                  NOT NULL DEFAULT 1,                     -- 버전
    config                  JSONB                                                            -- 워크플로우 설정 (JSON)

    -- 테넌트별 인덱스
    -- CONSTRAINT fk_workflows__tenant_id      FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  lwm.workflows                         IS '워크플로우 테이블 - 승인/작업 흐름 정의';
COMMENT ON COLUMN lwm.workflows.id                      IS '워크플로우 고유 식별자 (UUID)';
COMMENT ON COLUMN lwm.workflows.created_at              IS '등록 일시';
COMMENT ON COLUMN lwm.workflows.created_by              IS '등록자 UUID';
COMMENT ON COLUMN lwm.workflows.updated_at              IS '수정 일시';
COMMENT ON COLUMN lwm.workflows.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN lwm.workflows.tenant_id               IS '테넌트 ID';
COMMENT ON COLUMN lwm.workflows.workflow_name           IS '워크플로우명';
COMMENT ON COLUMN lwm.workflows.workflow_type           IS '워크플로우 유형 (approval, task, etc)';
COMMENT ON COLUMN lwm.workflows.description             IS '설명';
COMMENT ON COLUMN lwm.workflows.status                  IS '상태 (draft, active, inactive)';
COMMENT ON COLUMN lwm.workflows.is_active               IS '활성 여부';
COMMENT ON COLUMN lwm.workflows.version                 IS '버전';
COMMENT ON COLUMN lwm.workflows.config                  IS '워크플로우 설정 (JSON)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_workflows__tenant_id__name
    ON lwm.workflows (tenant_id, workflow_name);
COMMENT ON INDEX lwm.ux_workflows__tenant_id__name IS '테넌트별 워크플로우명 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_workflows__tenant_id
    ON lwm.workflows (tenant_id);
COMMENT ON INDEX lwm.ix_workflows__tenant_id IS '테넌트별 조회 인덱스';

CREATE INDEX ix_workflows__is_active
    ON lwm.workflows (is_active);
COMMENT ON INDEX lwm.ix_workflows__is_active IS '활성 워크플로우 조회 인덱스';

CREATE INDEX ix_workflows__workflow_type
    ON lwm.workflows (workflow_type);
COMMENT ON INDEX lwm.ix_workflows__workflow_type IS '워크플로우 유형 조회 인덱스';

CREATE INDEX ix_workflows__status
    ON lwm.workflows (status);
COMMENT ON INDEX lwm.ix_workflows__status IS '워크플로우 상태 조회 인덱스';
