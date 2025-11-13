-- =====================================================================================
-- 테이블: lwm.tasks
-- 설명: 워크플로우 작업 테이블
-- 작성일: 2025-10-25
-- 수정일: 2025-10-25
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.tasks
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 작업 고유 식별자    
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID

    tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID

    -- 워크플로우 관계
    workflow_id             UUID                     NOT NULL,                               -- 워크플로우 ID
    step_id                 UUID                     NOT NULL,                               -- 단계 ID
    request_id              UUID,                                                            -- 요청 ID (승인 요청 참조)

    -- 작업 할당
    assigned_to             UUID,                                                            -- 할당 대상 (사용자 ID)
    assigned_group          UUID,                                                            -- 할당 그룹 (그룹 ID)

    -- 작업 상태
    task_status             VARCHAR(50)              NOT NULL DEFAULT 'pending',              -- 작업 상태 (pending, in_progress, completed, rejected)
    priority                VARCHAR(20)              NOT NULL DEFAULT 'normal',               -- 우선순위 (low, normal, high, urgent)

    -- 작업 타이밍
    due_date                TIMESTAMP WITH TIME ZONE,                                        -- 마감일
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료일
    completed_by            UUID,                                                            -- 완료자

    -- 의견 및 설정
    comments                TEXT,                                                            -- 의견/코멘트
    config                  JSONB,                                                           -- 작업 설정 (JSON)

    -- 외래키 제약
    -- CONSTRAINT fk_tasks__tenant_id          FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
    CONSTRAINT fk_tasks__workflow_id        FOREIGN KEY (workflow_id) REFERENCES lwm.workflows(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks__step_id            FOREIGN KEY (step_id) REFERENCES lwm.steps(id) ON DELETE CASCADE
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  lwm.tasks                             IS '워크플로우 작업 테이블';
COMMENT ON COLUMN lwm.tasks.id                          IS '작업 고유 식별자 (UUID)';
COMMENT ON COLUMN lwm.tasks.tenant_id                   IS '테넌트 ID';
COMMENT ON COLUMN lwm.tasks.created_at                  IS '등록 일시';
COMMENT ON COLUMN lwm.tasks.created_by                  IS '등록자 UUID';
COMMENT ON COLUMN lwm.tasks.updated_at                  IS '수정 일시';
COMMENT ON COLUMN lwm.tasks.updated_by                  IS '수정자 UUID';
COMMENT ON COLUMN lwm.tasks.workflow_id                 IS '워크플로우 ID';
COMMENT ON COLUMN lwm.tasks.step_id                     IS '단계 ID';
COMMENT ON COLUMN lwm.tasks.request_id                  IS '요청 ID (승인 요청 참조)';
COMMENT ON COLUMN lwm.tasks.assigned_to                 IS '할당 대상 (사용자 ID)';
COMMENT ON COLUMN lwm.tasks.assigned_group              IS '할당 그룹 (그룹 ID)';
COMMENT ON COLUMN lwm.tasks.task_status                 IS '작업 상태 (pending, in_progress, completed, rejected)';
COMMENT ON COLUMN lwm.tasks.priority                    IS '우선순위 (low, normal, high, urgent)';
COMMENT ON COLUMN lwm.tasks.due_date                    IS '마감일';
COMMENT ON COLUMN lwm.tasks.completed_at                IS '완료일';
COMMENT ON COLUMN lwm.tasks.completed_by                IS '완료자';
COMMENT ON COLUMN lwm.tasks.comments                    IS '의견/코멘트';
COMMENT ON COLUMN lwm.tasks.config                      IS '작업 설정 (JSON)';

-- 일반 인덱스
CREATE INDEX ix_tasks__tenant_id
    ON lwm.tasks (tenant_id);
COMMENT ON INDEX lwm.ix_tasks__tenant_id IS '테넌트별 조회 인덱스';

CREATE INDEX ix_tasks__workflow_id
    ON lwm.tasks (workflow_id);
COMMENT ON INDEX lwm.ix_tasks__workflow_id IS '워크플로우별 작업 조회 인덱스';

CREATE INDEX ix_tasks__step_id
    ON lwm.tasks (step_id);
COMMENT ON INDEX lwm.ix_tasks__step_id IS '단계별 작업 조회 인덱스';

CREATE INDEX ix_tasks__assigned_to
    ON lwm.tasks (assigned_to);
COMMENT ON INDEX lwm.ix_tasks__assigned_to IS '할당 사용자별 작업 조회 인덱스';

CREATE INDEX ix_tasks__task_status
    ON lwm.tasks (task_status);
COMMENT ON INDEX lwm.ix_tasks__task_status IS '작업 상태별 조회 인덱스';

CREATE INDEX ix_tasks__priority
    ON lwm.tasks (priority);
COMMENT ON INDEX lwm.ix_tasks__priority IS '우선순위별 조회 인덱스';

CREATE INDEX ix_tasks__due_date
    ON lwm.tasks (due_date)
    WHERE due_date IS NOT NULL;
COMMENT ON INDEX lwm.ix_tasks__due_date IS '마감일별 조회 인덱스';
