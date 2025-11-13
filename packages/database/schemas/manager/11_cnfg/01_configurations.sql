CREATE TABLE IF NOT EXISTS cnfg.configurations
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    	-- 시스템 구성 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 구성 설정 생성 일시
    created_by                  UUID,                                                              	-- 구성 설정 생성자 UUID (관리자 또는 시스템)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 구성 설정 수정 일시
    updated_by                  UUID,                                                              	-- 구성 설정 수정자 UUID

	-- 설정 기본 정보
    config_category             VARCHAR(50)              NOT NULL,                                 	-- 설정 카테고리 (SYSTEM/SECURITY/BILLING/NOTIFICATION/INTEGRATION)
    config_code                 VARCHAR(200)             NOT NULL,                                 	-- 설정 코드 (고유 식별자)
    config_value                TEXT,                                                              	-- 현재 설정 값
    config_type                 VARCHAR(20)              NOT NULL DEFAULT 'STRING',               	-- 설정값 데이터 타입 (STRING/INTEGER/BOOLEAN/JSON/ENCRYPTED)

	-- 설정 설명 및 기본값
    description                 TEXT,                                                              	-- 설정 설명 (용도, 영향, 주의사항)
    default_value               TEXT,                                                              	-- 기본값

	-- 설정 제약 조건
    required                 	BOOLEAN                  DEFAULT FALSE,                           	-- 필수 설정 여부
    validation_rules            JSONB                    DEFAULT '{}',                            	-- 유효성 검사 규칙 (JSON 형태)

	-- 환경별 구성
    environment                 VARCHAR(20)              NOT NULL DEFAULT 'PRODUCTION',           	-- 적용 환경 (DEVELOPMENT/STAGING/PRODUCTION)
    applies_to_all 				BOOLEAN                  DEFAULT TRUE,                            	-- 모든 환경 적용 여부

	-- 변경 이력 추적
    previous_value              TEXT,                                                              	-- 이전 설정 값 (변경 추적용)
    changed_by                  VARCHAR(100),                                                      	-- 변경자 (관리자 또는 시스템)
	change_reason               TEXT,                                                              	-- 변경 사유

	-- 설정 적용 상태
    start_time             	 	TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                 -- 설정 적용 시작 시간
    close_time                	TIMESTAMP WITH TIME ZONE,                                          	-- 설정 적용 종료 시간 (NULL: 무기한)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 구성 상태 (ACTIVE/INACTIVE/DEPRECATED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT uk_configurations__category_key_env 		UNIQUE (config_category, config_code, environment),
    CONSTRAINT ck_configurations__config_category 		CHECK (config_category IN ('SYSTEM', 'SECURITY', 'BILLING', 'NOTIFICATION', 'INTEGRATION', 'PERFORMANCE', 'MONITORING')),
    CONSTRAINT ck_configurations__config_type 			CHECK (config_type IN ('STRING', 'INTEGER', 'BOOLEAN', 'JSON', 'ENCRYPTED', 'DECIMAL')),
    CONSTRAINT ck_configurations__environment 			CHECK (environment IN ('DEVELOPMENT', 'STAGING', 'PRODUCTION', 'ALL')),
    CONSTRAINT ck_configurations__status 				CHECK (status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED')),
    CONSTRAINT ck_configurations__effective_period 		CHECK (close_time IS NULL OR close_time >= start_time),
    CONSTRAINT ck_configurations__config_code_format	CHECK (config_code ~ '^[a-zA-Z0-9._-]+$')
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  cnfg.configurations					IS '시스템 구성 관리 - 플랫폼 전역 설정과 환경별 구성을 중앙화하여 관리하고 변경 이력을 추적';
COMMENT ON COLUMN cnfg.configurations.id 				IS '시스템 구성 고유 식별자 - UUID 형태의 기본키, 각 설정 항목을 구분하는 고유값';
COMMENT ON COLUMN cnfg.configurations.created_at 		IS '구성 설정 생성 일시 - 설정이 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN cnfg.configurations.created_by 		IS '구성 설정 생성자 UUID - 설정을 생성한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN cnfg.configurations.updated_at 		IS '구성 설정 수정 일시 - 설정이 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN cnfg.configurations.updated_by 		IS '구성 설정 수정자 UUID - 설정을 최종 수정한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN cnfg.configurations.config_category 	IS '설정 카테고리 - SYSTEM(시스템), SECURITY(보안), BILLING(과금), NOTIFICATION(알림), INTEGRATION(통합), PERFORMANCE(성능), MONITORING(모니터링)';
COMMENT ON COLUMN cnfg.configurations.config_code 		IS '설정 키 - 설정 항목을 식별하는 고유한 키 (예: smtp.host, jwt.expiry_hours, max_concurrent_users)';
COMMENT ON COLUMN cnfg.configurations.config_value 		IS '현재 설정 값 - 실제 적용되고 있는 설정값 (암호화된 값 포함)';
COMMENT ON COLUMN cnfg.configurations.config_type 		IS '설정값 데이터 타입 - STRING(문자열), INTEGER(정수), BOOLEAN(불린), JSON(JSON객체), ENCRYPTED(암호화된값), DECIMAL(소수)';
COMMENT ON COLUMN cnfg.configurations.description 		IS '설정 설명 - 설정의 용도, 시스템에 미치는 영향, 변경 시 주의사항 등의 상세 설명';
COMMENT ON COLUMN cnfg.configurations.default_value 	IS '기본값 - 설정이 정의되지 않았을 때 사용되는 기본값';
COMMENT ON COLUMN cnfg.configurations.required 			IS '필수 설정 여부 - TRUE(필수설정, 값이 반드시 존재해야 함), FALSE(선택설정)';
COMMENT ON COLUMN cnfg.configurations.validation_rules 	IS '유효성 검사 규칙 - 설정값의 형식, 범위, 패턴 등을 검증하는 규칙 (JSON 형태)';
COMMENT ON COLUMN cnfg.configurations.environment 		IS '적용 환경 - DEVELOPMENT(개발), STAGING(스테이징), PRODUCTION(운영), ALL(모든환경)';
COMMENT ON COLUMN cnfg.configurations.applies_to_all 	IS '모든 환경 적용 여부 - TRUE(모든 환경에 동일 적용), FALSE(환경별 개별 설정)';
COMMENT ON COLUMN cnfg.configurations.previous_value 	IS '이전 설정 값 - 변경 전의 설정값 (변경 이력 추적 및 롤백용)';
COMMENT ON COLUMN cnfg.configurations.changed_by 		IS '변경자 - 설정을 변경한 관리자나 시스템의 이름 또는 식별자';
COMMENT ON COLUMN cnfg.configurations.change_reason 	IS '변경 사유 - 설정 변경의 목적이나 배경, 관련 이슈 번호 등';
COMMENT ON COLUMN cnfg.configurations.start_time 		IS '설정 적용 시작 시간 - 이 설정이 실제로 효력을 발휘하기 시작하는 시점';
COMMENT ON COLUMN cnfg.configurations.close_time 		IS '설정 적용 종료 시간 - 이 설정이 효력을 잃는 시점 (NULL인 경우 무기한)';
COMMENT ON COLUMN cnfg.configurations.status 			IS '구성 상태 - ACTIVE(활성), INACTIVE(비활성), DEPRECATED(사용중단예정) 설정의 생명주기 상태';
COMMENT ON COLUMN cnfg.configurations.deleted 			IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 카테고리-키-환경 조합 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_configurations
	ON cnfg.configurations (config_category, config_code, environment)
 WHERE deleted = FALSE;

-- 카테고리별 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__config_category
	ON cnfg.configurations (config_category, created_at DESC)
 WHERE deleted = FALSE;

-- 설정 키별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__config_code
	ON cnfg.configurations (config_code, environment)
 WHERE deleted = FALSE;

-- 환경별 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__environment
	ON cnfg.configurations (environment, config_category)
 WHERE deleted = FALSE;

-- 활성 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__active
	ON cnfg.configurations (status, config_category, config_code)
 WHERE deleted = FALSE AND status = 'ACTIVE';

-- 유효 기간 기준 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__effective_period
	ON cnfg.configurations (start_time, close_time, status)
 WHERE deleted = FALSE;

-- 변경자별 설정 이력 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__changed_by
	ON cnfg.configurations (changed_by, updated_at DESC)
 WHERE changed_by IS NOT NULL AND deleted = FALSE;

-- 설정 타입별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__config_type
	ON cnfg.configurations (config_type, config_category)
 WHERE deleted = FALSE;

-- 필수 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__required_settings
	ON cnfg.configurations (required, config_category, environment)
 WHERE required = TRUE AND deleted = FALSE;

-- 전역 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__all_environments
	ON cnfg.configurations (applies_to_all, config_code)
 WHERE applies_to_all = TRUE AND deleted = FALSE;

-- 유효성 규칙 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_configurations__validation_rules
	ON cnfg.configurations USING GIN (validation_rules)
 WHERE deleted = FALSE;

-- 최근 변경 설정 조회 최적화
--CREATE INDEX IF NOT EXISTS ix_configurations__recent_changes
--	ON cnfg.configurations (updated_at DESC, changed_by)
-- WHERE updated_at > (NOW() - INTERVAL '30 days') AND deleted = FALSE;

-- 상태별 설정 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__status
	ON cnfg.configurations (status, config_category, created_at DESC)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_configurations__created_at
	ON cnfg.configurations (created_at DESC);
