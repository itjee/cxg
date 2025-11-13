CREATE TABLE IF NOT EXISTS cnfg.feature_flags
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 기능 플래그 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 기능 플래그 생성 일시
    created_by                  UUID,                                                               -- 기능 플래그 생성자 UUID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                           -- 기능 플래그 수정 일시
    updated_by                  UUID,                                                               -- 기능 플래그 수정자 UUID

    -- 기능 기본 정보
    flag_code                   VARCHAR(100)             NOT NULL,                           		-- 기능 플래그 코드 (애플리케이션에서 사용)
    flag_name                   VARCHAR(200)             NOT NULL,                                  -- 기능 플래그 표시명
    description                 TEXT,                                                               -- 기능 상세 설명

    -- 플래그 활성화 설정
    enabled                 	BOOLEAN                  NOT NULL DEFAULT FALSE,                    -- 기능 전체 활성화 여부
    rollout_rate                INTEGER                  DEFAULT 0,                                 -- 점진적 배포 비율 (0-100%)

    -- 대상 환경 및 사용자 설정
    target_environment          VARCHAR(20)              DEFAULT 'PRODUCTION',                      -- 대상 환경 (DEVELOPMENT/STAGING/PRODUCTION/ALL)
    target_user_groups          TEXT[],                                                             -- 대상 사용자 그룹 배열
    target_tenant_types         TEXT[],                                                             -- 대상 테넌트 유형 배열
    excluded_tenants            UUID[],                                                             -- 제외할 테넌트 ID 목록

    -- 조건부 활성화 규칙
    activation_conditions       JSONB                    DEFAULT '{}',                              -- 기능 활성화 조건 (JSON 형태)
    deactivation_conditions     JSONB                    DEFAULT '{}',                              -- 기능 비활성화 조건 (JSON 형태)

    -- 스케줄링 정보
    scheduled_enable_at         TIMESTAMP WITH TIME ZONE,                                           -- 예약 활성화 시각
    scheduled_disable_at        TIMESTAMP WITH TIME ZONE,                                           -- 예약 비활성화 시각

    -- 사용량 및 성능 메트릭
    usage_count                 INTEGER                  DEFAULT 0,                                 -- 기능 호출 횟수
    error_count                 INTEGER                  DEFAULT 0,                                 -- 기능 사용 중 오류 발생 횟수
    last_used_at                TIMESTAMP WITH TIME ZONE,                                           -- 마지막 기능 사용 시각

    -- 관리 및 소유권 정보
    owner_team                  VARCHAR(100),                                                       -- 기능 소유 팀
    contact_email               VARCHAR(255),                                                       -- 담당자 연락처 이메일

    -- 논리적 삭제 플래그
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,                    -- 논리적 삭제 플래그

    -- 제약조건
	CONSTRAINT uk_feature_flags__flag_code 				UNIQUE (flag_code),

    CONSTRAINT ck_feature_flags__rollout_rate           CHECK (rollout_rate >= 0 AND rollout_rate <= 100),
    CONSTRAINT ck_feature_flags__target_environment     CHECK (target_environment IN ('DEVELOPMENT', 'STAGING', 'PRODUCTION', 'ALL')),
    CONSTRAINT ck_feature_flags__usage_count            CHECK (usage_count >= 0),
    CONSTRAINT ck_feature_flags__error_count            CHECK (error_count >= 0),
    CONSTRAINT ck_feature_flags__flag_code_format       CHECK (flag_code ~ '^[a-zA-Z0-9._-]+$'),
    CONSTRAINT ck_feature_flags__schedule_logic         CHECK (scheduled_disable_at IS NULL OR scheduled_enable_at IS NULL OR scheduled_disable_at > scheduled_enable_at),
    CONSTRAINT ck_feature_flags__contact_email_format   CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 컬럼별 코멘트 추가
COMMENT ON TABLE  cnfg.feature_flags 							IS '기능 플래그 관리 테이블 - 애플리케이션 기능의 동적 활성화/비활성화 관리';
COMMENT ON COLUMN cnfg.feature_flags.id 						IS '기능 플래그 고유 식별자 (UUID)';
COMMENT ON COLUMN cnfg.feature_flags.created_at 				IS '기능 플래그 생성 일시';
COMMENT ON COLUMN cnfg.feature_flags.created_by 				IS '기능 플래그 생성자 UUID (개발팀 또는 제품팀)';
COMMENT ON COLUMN cnfg.feature_flags.updated_at 				IS '기능 플래그 수정 일시';
COMMENT ON COLUMN cnfg.feature_flags.updated_by 				IS '기능 플래그 수정자 UUID';
COMMENT ON COLUMN cnfg.feature_flags.flag_code 					IS '기능 플래그 코드 - 애플리케이션 코드에서 사용하는 고유 식별자';
COMMENT ON COLUMN cnfg.feature_flags.flag_name 					IS '기능 플래그 표시명 - 관리자 화면에서 보여지는 사용자 친화적 이름';
COMMENT ON COLUMN cnfg.feature_flags.description 				IS '기능 상세 설명 - 기능의 목적과 영향 범위 설명';
COMMENT ON COLUMN cnfg.feature_flags.enabled 					IS '기능 전체 활성화 여부 - 마스터 스위치 역할';
COMMENT ON COLUMN cnfg.feature_flags.rollout_rate 				IS '점진적 배포 비율 (0-100%) - 사용자 대상 점진적 기능 배포';
COMMENT ON COLUMN cnfg.feature_flags.target_environment 		IS '대상 환경 - 기능이 적용될 환경 (DEVELOPMENT/STAGING/PRODUCTION/ALL)';
COMMENT ON COLUMN cnfg.feature_flags.target_user_groups 		IS '대상 사용자 그룹 배열 - 기능이 적용될 사용자 그룹 목록';
COMMENT ON COLUMN cnfg.feature_flags.target_tenant_types 		IS '대상 테넌트 유형 배열 - 기능이 적용될 테넌트 유형 목록 (TRIAL/STANDARD/PREMIUM 등)';
COMMENT ON COLUMN cnfg.feature_flags.excluded_tenants 			IS '제외할 테넌트 ID 목록 - 기능 적용에서 제외할 특정 테넌트들';
COMMENT ON COLUMN cnfg.feature_flags.activation_conditions 		IS '기능 활성화 조건 - JSON 형태의 복잡한 활성화 조건';
COMMENT ON COLUMN cnfg.feature_flags.deactivation_conditions 	IS '기능 비활성화 조건 - JSON 형태의 복잡한 비활성화 조건';
COMMENT ON COLUMN cnfg.feature_flags.scheduled_enable_at 		IS '예약 활성화 시각 - 자동으로 기능을 활성화할 예정 시간';
COMMENT ON COLUMN cnfg.feature_flags.scheduled_disable_at 		IS '예약 비활성화 시각 - 자동으로 기능을 비활성화할 예정 시간';
COMMENT ON COLUMN cnfg.feature_flags.usage_count 				IS '기능 호출 횟수 - 기능이 실제로 사용된 총 횟수';
COMMENT ON COLUMN cnfg.feature_flags.error_count 				IS '기능 사용 중 오류 발생 횟수 - 기능 사용 시 발생한 오류 통계';
COMMENT ON COLUMN cnfg.feature_flags.last_used_at 				IS '마지막 기능 사용 시각 - 가장 최근 기능이 호출된 시간';
COMMENT ON COLUMN cnfg.feature_flags.owner_team 				IS '기능 소유 팀 - 기능을 담당하는 개발팀 (Backend/Frontend/Data 등)';
COMMENT ON COLUMN cnfg.feature_flags.contact_email 				IS '담당자 연락처 이메일 - 기능 관련 문의 시 연락할 담당자';
COMMENT ON COLUMN cnfg.feature_flags.deleted 					IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- 인덱스 생성
-- 기본 조회용 인덱스 (논리적 삭제되지 않은 활성 플래그)
CREATE INDEX IF NOT EXISTS ix_feature_flags__active_lookup
    ON cnfg.feature_flags (flag_code, enabled)
 WHERE deleted = FALSE;

-- 환경별 조회용 인덱스 (특정 환경에서 활성화된 플래그)
CREATE INDEX IF NOT EXISTS ix_feature_flags__environment_enabled
    ON cnfg.feature_flags (target_environment, enabled, rollout_rate)
 WHERE deleted = FALSE;

-- 스케줄링 관리용 인덱스 (예약된 활성화/비활성화 작업)
CREATE INDEX IF NOT EXISTS ix_feature_flags__tasks
    ON cnfg.feature_flags (scheduled_enable_at, scheduled_disable_at)
 WHERE (scheduled_enable_at IS NOT NULL OR scheduled_disable_at IS NOT NULL)
   AND deleted = FALSE;

-- 사용량 분석용 인덱스 (최근 사용된 플래그들)
CREATE INDEX IF NOT EXISTS ix_feature_flags__usage_analysis
    ON cnfg.feature_flags (last_used_at DESC, usage_count DESC)
 WHERE deleted = FALSE;

-- 팀별 관리용 인덱스 (팀별 플래그 조회)
CREATE INDEX IF NOT EXISTS ix_feature_flags__team_management
    ON cnfg.feature_flags (owner_team, created_at DESC)
 WHERE deleted = FALSE;

-- 생성일자 기준 조회용 인덱스 (최근 생성된 플래그들)
CREATE INDEX IF NOT EXISTS ix_feature_flags__created_at
    ON cnfg.feature_flags (created_at DESC)
 WHERE deleted = FALSE;

-- GIN 인덱스 (사용자 그룹 배열 검색용)
CREATE INDEX IF NOT EXISTS ix_feature_flags__target_groups_gin
    ON cnfg.feature_flags USING GIN (target_user_groups)
 WHERE deleted = FALSE;

-- GIN 인덱스 (테넌트 유형 배열 검색용)
CREATE INDEX IF NOT EXISTS ix_feature_flags__tenant_types_gin
    ON cnfg.feature_flags USING GIN (target_tenant_types)
 WHERE deleted = FALSE;

-- GIN 인덱스 (활성화 조건 JSON 검색용)
CREATE INDEX IF NOT EXISTS ix_feature_flags__activation_conditions_gin
    ON cnfg.feature_flags USING GIN (activation_conditions)
 WHERE deleted = FALSE;
