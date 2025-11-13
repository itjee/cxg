CREATE TABLE IF NOT EXISTS tnnt.onboardings
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 온보딩 프로세스 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 온보딩 단계 생성 일시
    created_by                  UUID,                                 								-- 온보딩 단계 생성자 UUID (시스템)
    updated_at                  TIMESTAMP WITH TIME ZONE,                   						-- 온보딩 단계 수정 일시
    updated_by                  UUID,                                 								-- 온보딩 단계 수정자 UUID

	-- 대상 테넌트
    tenant_id                   UUID                     NOT NULL,                                 	-- 온보딩 대상 테넌트 ID

	-- 온보딩 단계 정보
    step_name                   VARCHAR(50)              NOT NULL,                                 	-- 온보딩 단계명 (REGISTRATION/EMAIL_VERIFICATION/SCHEMA_CREATION/INITIAL_SETUP/COMPLETED)
    step_order                  INTEGER                  NOT NULL,                                 	-- 단계 실행 순서 (1, 2, 3, ...)
    step_status                 VARCHAR(20)              NOT NULL DEFAULT 'PENDING',              	-- 단계 상태 (PENDING/IN_PROGRESS/COMPLETED/FAILED)

	-- 단계 처리 시간 정보
    started_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 단계 시작 일시
    completed_at                TIMESTAMP WITH TIME ZONE,                                          	-- 단계 완료 일시
    error_message               TEXT,                                                              	-- 실패 시 오류 메시지
    retry_count                 INTEGER                  DEFAULT 0,                               	-- 재시도 횟수 (실패 시)

	-- 단계별 메타데이터
    step_data                   JSONB                    DEFAULT '{}',                            	-- 각 단계별 필요한 추가 데이터 (JSON 형태)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 온보딩 레코드 상태 (ACTIVE/ARCHIVED/OBSOLETE)
    is_deleted                  BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_onboardings__tenant_id 			FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,

    CONSTRAINT ck_onboardings__step_name 			CHECK (step_name IN ('REGISTRATION', 'EMAIL_VERIFICATION', 'SCHEMA_CREATION', 'INITIAL_SETUP', 'DATA_MIGRATION', 'CONFIGURATION', 'COMPLETED')),
    CONSTRAINT ck_onboardings__step_status 			CHECK (step_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED')),
    CONSTRAINT ck_onboardings__status 				CHECK (status IN ('ACTIVE', 'ARCHIVED', 'OBSOLETE')),
    CONSTRAINT ck_onboardings__step_order 			CHECK (step_order > 0),
    CONSTRAINT ck_onboardings__retry_count 			CHECK (retry_count >= 0),
    CONSTRAINT ck_onboardings__completion_logic 	CHECK ((step_status = 'COMPLETED' AND completed_at IS NOT NULL) OR (step_status != 'COMPLETED')),
    CONSTRAINT ck_onboardings__start_logic 			CHECK ((step_status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED') AND started_at IS NOT NULL) OR (step_status = 'PENDING')),
    CONSTRAINT ck_onboardings__time_sequence 		CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  tnnt.onboardings					IS '테넌트 온보딩 프로세스 추적 - 신규 테넌트의 초기 설정 과정을 단계별로 관리하고 진행 상황을 추적';
COMMENT ON COLUMN tnnt.onboardings.id 				IS '온보딩 프로세스 고유 식별자 - UUID 형태의 기본키, 각 온보딩 단계를 구분하는 고유값';
COMMENT ON COLUMN tnnt.onboardings.created_at 		IS '온보딩 단계 생성 일시 - 해당 온보딩 단계가 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN tnnt.onboardings.created_by 		IS '온보딩 단계 생성자 UUID - 온보딩 프로세스를 생성한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN tnnt.onboardings.updated_at 		IS '온보딩 단계 수정 일시 - 온보딩 단계 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN tnnt.onboardings.updated_by 		IS '온보딩 단계 수정자 UUID - 온보딩 단계를 최종 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN tnnt.onboardings.tenant_id 		IS '온보딩 대상 테넌트 ID - 온보딩 과정을 진행하는 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN tnnt.onboardings.step_name 		IS '온보딩 단계명 - REGISTRATION(가입), EMAIL_VERIFICATION(이메일인증), SCHEMA_CREATION(스키마생성), INITIAL_SETUP(초기설정), DATA_MIGRATION(데이터마이그레이션), CONFIGURATION(환경설정), COMPLETED(완료)';
COMMENT ON COLUMN tnnt.onboardings.step_order 		IS '단계 실행 순서 - 온보딩 프로세스에서 이 단계가 수행되어야 하는 순서 (1부터 시작하는 정수)';
COMMENT ON COLUMN tnnt.onboardings.step_status 		IS '단계 상태 - PENDING(대기중), IN_PROGRESS(진행중), COMPLETED(완료), FAILED(실패), SKIPPED(건너뜀) 각 단계의 진행 상태';
COMMENT ON COLUMN tnnt.onboardings.started_at 		IS '단계 시작 일시 - 해당 온보딩 단계가 실제로 시작된 시점';
COMMENT ON COLUMN tnnt.onboardings.completed_at 	IS '단계 완료 일시 - 해당 온보딩 단계가 성공적으로 완료된 시점';
COMMENT ON COLUMN tnnt.onboardings.error_message 	IS '실패 시 오류 메시지 - 온보딩 단계가 실패했을 때의 상세 오류 내용 및 원인';
COMMENT ON COLUMN tnnt.onboardings.retry_count 		IS '재시도 횟수 - 해당 단계가 실패한 후 재시도된 횟수 (자동 또는 수동 재시도 포함)';
COMMENT ON COLUMN tnnt.onboardings.step_data 		IS '각 단계별 필요한 추가 데이터 - 온보딩 단계 수행에 필요한 설정값, 파라미터, 결과 데이터 등을 JSON 형태로 저장';
COMMENT ON COLUMN tnnt.onboardings.status 			IS '온보딩 레코드 상태 - ACTIVE(활성), ARCHIVED(보관), OBSOLETE(구버전) 온보딩 기록의 생명주기 관리';
COMMENT ON COLUMN tnnt.onboardings.is_deleted 		IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 테넌트별 온보딩 단계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__tenant_id
    ON tnnt.onboardings (tenant_id, step_order)
 WHERE is_deleted = FALSE;

-- 단계 상태별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__step_status
    ON tnnt.onboardings (step_status, created_at DESC)
 WHERE is_deleted = FALSE;

-- 단계명별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__step_name
    ON tnnt.onboardings (step_name, step_status, created_at DESC)
 WHERE is_deleted = FALSE;

-- 테넌트별 단계 상태 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__tenant_status
    ON tnnt.onboardings (tenant_id, step_status)
 WHERE is_deleted = FALSE;

-- 실패한 단계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__failed_steps
    ON tnnt.onboardings (step_status, retry_count, created_at DESC)
 WHERE step_status = 'FAILED' AND is_deleted = FALSE;

-- 진행중인 단계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__in_progress
    ON tnnt.onboardings (step_status, started_at DESC)
 WHERE step_status = 'IN_PROGRESS' AND is_deleted = FALSE;

-- 대기중인 단계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__pending_steps
    ON tnnt.onboardings (step_status, step_order, created_at DESC)
 WHERE step_status = 'PENDING' AND is_deleted = FALSE;

-- 완료된 단계 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__completed_steps
    ON tnnt.onboardings (step_status, completed_at DESC)
 WHERE step_status = 'COMPLETED' AND is_deleted = FALSE;

-- 재시도 분석 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__retry_analysis
    ON tnnt.onboardings (retry_count DESC, step_name, created_at DESC)
 WHERE retry_count > 0 AND is_deleted = FALSE;

-- 단계 순서별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__step_order
    ON tnnt.onboardings (step_order, step_status)
 WHERE is_deleted = FALSE;

-- 테넌트별 진행상황 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__tenant_progress
    ON tnnt.onboardings (tenant_id, step_name, step_status, step_order)
 WHERE is_deleted = FALSE;

-- 단계별 데이터 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_onboardings__step_data
    ON tnnt.onboardings USING GIN (step_data)
 WHERE is_deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_onboardings__created_at
    ON tnnt.onboardings (created_at DESC);
