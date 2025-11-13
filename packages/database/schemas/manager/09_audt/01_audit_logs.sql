CREATE TABLE IF NOT EXISTS audt.audit_logs
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 감사 로그 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 감사 로그 생성 일시
    created_by                  UUID,                                                              	-- 감사 로그 생성자 UUID (시스템 또는 프로세스)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 감사 로그 수정 일시
    updated_by                  UUID,                                                              	-- 감사 로그 수정자 UUID
    -- 관련 엔티티 연결
    tenant_id                   UUID,                                                              	-- 테넌트별 이벤트인 경우 테넌트 ID
    user_id                     UUID,                                                              	-- 사용자별 이벤트인 경우 사용자 ID
    -- 이벤트 분류 및 정보
    event_type                  VARCHAR(50)              NOT NULL,                                 	-- 이벤트 유형 (LOGIN/LOGOUT/API_CALL/DATA_ACCESS/ADMIN_ACTION)
    event_category              VARCHAR(50)              NOT NULL,                                 	-- 이벤트 분류 (AUTHENTICATION/AUTHORIZATION/DATA_MODIFICATION/SYSTEM_CHANGE)
    description                 TEXT                     NOT NULL,                                 	-- 이벤트 상세 설명
    -- 클라이언트 접근 정보
    source_ip                   VARCHAR(45),                                                       	-- 클라이언트 IP 주소 (IPv4/IPv6 지원)
    user_agent                  TEXT,                                                              	-- 브라우저/클라이언트 정보
    session_id                  VARCHAR(255),                                                      	-- 세션 ID
    -- 대상 리소스 정보
    resource               VARCHAR(50),                                                       	-- 리소스 유형 (TABLE/API_ENDPOINT/FILE/CONFIGURATION)
    resource_id                 VARCHAR(255),                                                      	-- 접근한 리소스 식별자
    action_performed            VARCHAR(50),                                                       	-- 수행된 작업 (CREATE/READ/UPDATE/DELETE/EXECUTE)
    -- 결과 및 위험도 정보
    result                      VARCHAR(20)              NOT NULL,                                 	-- 이벤트 결과 (SUCCESS/FAILURE/BLOCKED)
    failure_reason              TEXT,                                                              	-- 실패 사유 (실패 시 상세 이유)
    risk_level                  VARCHAR(20)              NOT NULL DEFAULT 'LOW',                  	-- 위험도 (HIGH/MEDIUM/LOW)
    -- 확장 메타데이터
    extra_data             		JSONB                    DEFAULT '{}',                            	-- 추가 데이터 (JSON 형태)
    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 감사 로그 상태 (ACTIVE/ARCHIVED/PURGED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_audit_logs__tenant_id 			FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,
    CONSTRAINT fk_audit_logs__user_id 				FOREIGN KEY (user_id) 	REFERENCES tnnt.users(id)	ON DELETE CASCADE,

    CONSTRAINT ck_audit_logs__event_type 			CHECK (event_type IN ('LOGIN', 'LOGOUT', 'API_CALL', 'DATA_ACCESS', 'ADMIN_ACTION', 'PASSWORD_CHANGE', 'PERMISSION_CHANGE')),
    CONSTRAINT ck_audit_logs__event_category 		CHECK (event_category IN ('AUTHENTICATION', 'AUTHORIZATION', 'DATA_MODIFICATION', 'SYSTEM_CHANGE', 'SECURITY_VIOLATION')),
    CONSTRAINT ck_audit_logs__resource_type 		CHECK (resource IN ('TABLE', 'API_ENDPOINT', 'FILE', 'CONFIGURATION', 'USER_ACCOUNT', 'TENANT_SETTINGS')),
    CONSTRAINT ck_audit_logs__action_performed 		CHECK (action_performed IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE', 'LOGIN', 'LOGOUT')),
    CONSTRAINT ck_audit_logs__result 				CHECK (result IN ('SUCCESS', 'FAILURE', 'BLOCKED')),
    CONSTRAINT ck_audit_logs__risk_level 			CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT ck_audit_logs__status 				CHECK (status IN ('ACTIVE', 'ARCHIVED', 'PURGED'))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  audt.audit_logs					IS '보안 감사 로그 - 모든 보안 관련 이벤트와 중요한 비즈니스 액션의 상세 기록을 통한 컴플라이언스 및 보안 모니터링';
COMMENT ON COLUMN audt.audit_logs.id 				IS '감사 로그 고유 식별자 - UUID 형태의 기본키, 각 감사 이벤트를 구분하는 고유값';
COMMENT ON COLUMN audt.audit_logs.created_at 		IS '감사 로그 생성 일시 - 감사 이벤트가 발생한 시점의 타임스탬프';
COMMENT ON COLUMN audt.audit_logs.created_by 		IS '감사 로그 생성자 UUID - 감사 이벤트를 기록한 시스템 프로세스 또는 서비스의 식별자';
COMMENT ON COLUMN audt.audit_logs.updated_at 		IS '감사 로그 수정 일시 - 감사 로그 정보가 수정된 시점의 타임스탬프 (일반적으로 수정되지 않음)';
COMMENT ON COLUMN audt.audit_logs.updated_by 		IS '감사 로그 수정자 UUID - 감사 로그를 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN audt.audit_logs.tenant_id 		IS '테넌트별 이벤트인 경우 테넌트 ID - 특정 테넌트와 관련된 이벤트의 테넌트 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN audt.audit_logs.user_id 			IS '사용자별 이벤트인 경우 사용자 ID - 특정 사용자가 수행한 액션의 사용자 식별자 (users 테이블 참조)';
COMMENT ON COLUMN audt.audit_logs.event_type 		IS '이벤트 유형 - LOGIN(로그인), LOGOUT(로그아웃), API_CALL(API호출), DATA_ACCESS(데이터접근), ADMIN_ACTION(관리자작업), PASSWORD_CHANGE(비밀번호변경)';
COMMENT ON COLUMN audt.audit_logs.event_category 	IS '이벤트 분류 - AUTHENTICATION(인증), AUTHORIZATION(권한부여), DATA_MODIFICATION(데이터수정), SYSTEM_CHANGE(시스템변경), SECURITY_VIOLATION(보안위반)';
COMMENT ON COLUMN audt.audit_logs.description 		IS '이벤트 상세 설명 - 수행된 액션의 구체적인 내용과 맥락 정보';
COMMENT ON COLUMN audt.audit_logs.source_ip 		IS '클라이언트 IP 주소 - 요청을 보낸 클라이언트의 IP 주소 (IPv4/IPv6 지원, 최대 45자)';
COMMENT ON COLUMN audt.audit_logs.user_agent 		IS '브라우저/클라이언트 정보 - HTTP User-Agent 헤더 또는 클라이언트 애플리케이션 정보';
COMMENT ON COLUMN audt.audit_logs.session_id 		IS '세션 ID - 이벤트가 발생한 사용자 세션의 식별자 (세션 추적용)';
COMMENT ON COLUMN audt.audit_logs.resource 	IS '리소스 유형 - TABLE(테이블), API_ENDPOINT(API엔드포인트), FILE(파일), CONFIGURATION(설정), USER_ACCOUNT(사용자계정), TENANT_SETTINGS(테넌트설정)';
COMMENT ON COLUMN audt.audit_logs.resource_id 		IS '접근한 리소스 식별자 - 액션의 대상이 된 구체적인 리소스의 ID 또는 경로';
COMMENT ON COLUMN audt.audit_logs.action_performed 	IS '수행된 작업 - CREATE(생성), READ(조회), UPDATE(수정), DELETE(삭제), EXECUTE(실행), LOGIN(로그인), LOGOUT(로그아웃)';
COMMENT ON COLUMN audt.audit_logs.result 			IS '이벤트 결과 - SUCCESS(성공), FAILURE(실패), BLOCKED(차단) 액션 수행 결과';
COMMENT ON COLUMN audt.audit_logs.failure_reason 	IS '실패 사유 - 액션이 실패하거나 차단된 경우의 구체적인 이유와 오류 메시지';
COMMENT ON COLUMN audt.audit_logs.risk_level 		IS '위험도 - HIGH(높음, 민감한 작업), MEDIUM(보통, 일반적 작업), LOW(낮음, 단순 조회) 보안 위험도 평가';
COMMENT ON COLUMN audt.audit_logs.extra_data 		IS '추가 감사 데이터 - 이벤트와 관련된 추가 정보 (JSON 형태, 변경 전후 값, 요청 파라미터 등)';
COMMENT ON COLUMN audt.audit_logs.status 			IS '감사 로그 상태 - ACTIVE(활성), ARCHIVED(보관), PURGED(삭제예정) 로그 관리 상태';
COMMENT ON COLUMN audt.audit_logs.deleted 			IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 시간 기준 감사 로그 조회 최적화 (가장 중요)
CREATE INDEX IF NOT EXISTS ix_audit_logs__created_at
    ON audt.audit_logs (created_at DESC);

-- 테넌트별 감사 로그 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__tenant_id
    ON audt.audit_logs (tenant_id, created_at DESC)
 WHERE tenant_id IS NOT NULL
   AND deleted = FALSE;

-- 사용자별 감사 로그 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__user_id
    ON audt.audit_logs (user_id, created_at DESC)
 WHERE user_id IS NOT NULL
   AND deleted = FALSE;

-- 이벤트 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__event_type
    ON audt.audit_logs (event_type, created_at DESC)
 WHERE deleted = FALSE;

-- 이벤트 분류별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__event_category
    ON audt.audit_logs (event_category, created_at DESC)
 WHERE deleted = FALSE;

-- 위험도별 감사 로그 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__risk_level
    ON audt.audit_logs (risk_level, created_at DESC)
 WHERE deleted = FALSE;

-- 결과별 감사 로그 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__result
    ON audt.audit_logs (result, created_at DESC)
 WHERE deleted = FALSE;

-- 고위험 이벤트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__high_risk_audit_logs
    ON audt.audit_logs (risk_level, event_type, created_at DESC)
 WHERE risk_level = 'HIGH'
   AND deleted = FALSE;

-- 실패/차단 이벤트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__failed_audit_logs
    ON audt.audit_logs (result, event_type, created_at DESC)
 WHERE result IN ('FAILURE', 'BLOCKED')
   AND deleted = FALSE;

-- IP별 감사 로그 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__source_ip
    ON audt.audit_logs (source_ip, created_at DESC)
 WHERE source_ip IS NOT NULL
   AND deleted = FALSE;

-- 세션별 감사 로그 추적 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__session_id
    ON audt.audit_logs (session_id, created_at DESC)
 WHERE session_id IS NOT NULL
   AND deleted = FALSE;

-- 리소스별 접근 기록 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__resource_access
    ON audt.audit_logs (resource, resource_id, created_at DESC)
 WHERE resource IS NOT NULL
   AND deleted = FALSE;

-- 사용자별 액션 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__user_actions
    ON audt.audit_logs (user_id, action_performed, created_at DESC)
 WHERE user_id IS NOT NULL
   AND deleted = FALSE;

-- 테넌트별 보안 이벤트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_audit_logs__tenant_security
    ON audt.audit_logs (tenant_id, risk_level, event_category, created_at DESC)
 WHERE tenant_id IS NOT NULL
   AND deleted = FALSE;

-- 추가 데이터 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_audit_logs__extra_data
    ON audt.audit_logs USING GIN (extra_data)
 WHERE deleted = FALSE;
