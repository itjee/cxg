CREATE TABLE IF NOT EXISTS mntr.health_checks
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 헬스체크 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 헬스체크 수행 일시
    created_by                  UUID,                                                              	-- 헬스체크 실행 시스템 UUID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 헬스체크 수정 일시
    updated_by                  UUID,                                                              	-- 헬스체크 수정자 UUID

	-- 모니터링 대상 정보
    service_name                VARCHAR(100)             NOT NULL,                                 	-- 모니터링 대상 서비스명 (API/DATABASE/REDIS/STORAGE 등)
    api_endpoint                VARCHAR(500),                                                      	-- 체크 대상 엔드포인트 URL
    check_type                  VARCHAR(50)              NOT NULL,                                 	-- 체크 유형 (HTTP/TCP/DATABASE/REDIS/CUSTOM)

	-- 체크 결과 정보
    response_time               INTEGER,                                                           	-- 응답 시간 (밀리초)
    error_message               TEXT,                                                              	-- 오류 메시지 (실패 시)

	-- 체크 설정 정보
    timeout_duration            INTEGER                  DEFAULT 5000,                            	-- 타임아웃 시간 (밀리초)
    expected_status_code        INTEGER,                                                           	-- HTTP 체크 시 예상 상태 코드 (200, 204 등)

	-- 확장 메타데이터
    check_data                  JSONB                    DEFAULT '{}',                            	-- 추가 체크 데이터 (헤더, 파라미터 등)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL,                                 	-- 헬스 상태 (HEALTHY/DEGRADED/UNHEALTHY)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT ck_health_checks__status 					CHECK (status IN ('HEALTHY', 'DEGRADED', 'UNHEALTHY')),
    CONSTRAINT ck_health_checks__check_type 				CHECK (check_type IN ('HTTP', 'TCP', 'DATABASE', 'REDIS', 'ELASTICSEARCH', 'CUSTOM')),
    CONSTRAINT ck_health_checks__response_time 				CHECK (response_time IS NULL OR response_time >= 0),
    CONSTRAINT ck_health_checks__timeout_duration 			CHECK (timeout_duration > 0),
    CONSTRAINT ck_health_checks__expected_status_code 		CHECK (expected_status_code IS NULL OR (expected_status_code >= 100 AND expected_status_code < 600))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  mntr.health_checks						IS '시스템 헬스체크 - 각 서비스 컴포넌트의 상태 모니터링과 가용성 추적을 통한 시스템 안정성 관리';
COMMENT ON COLUMN mntr.health_checks.id 					IS '헬스체크 고유 식별자 - UUID 형태의 기본키, 각 헬스체크 실행을 구분하는 고유값';
COMMENT ON COLUMN mntr.health_checks.created_at 			IS '헬스체크 수행 일시 - 헬스체크가 실행된 시점의 타임스탬프';
COMMENT ON COLUMN mntr.health_checks.created_by 			IS '헬스체크 실행 시스템 UUID - 헬스체크를 수행한 모니터링 시스템 또는 스케줄러의 식별자';
COMMENT ON COLUMN mntr.health_checks.updated_at 			IS '헬스체크 수정 일시 - 헬스체크 결과가 수정된 시점의 타임스탬프';
COMMENT ON COLUMN mntr.health_checks.updated_by 			IS '헬스체크 수정자 UUID - 헬스체크 결과를 수정한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN mntr.health_checks.service_name 			IS '모니터링 대상 서비스명 - API(웹서비스), DATABASE(데이터베이스), REDIS(캐시), STORAGE(스토리지), QUEUE(메시지큐) 등 서비스 구분';
COMMENT ON COLUMN mntr.health_checks.api_endpoint 			IS '체크 대상 엔드포인트 URL - HTTP 헬스체크 시 호출할 URL 또는 TCP 연결할 주소 (예: https://api.example.com/health, tcp://redis:6379)';
COMMENT ON COLUMN mntr.health_checks.check_type	 			IS '체크 유형 - HTTP(웹서비스), TCP(포트연결), DATABASE(DB연결), REDIS(Redis연결), ELASTICSEARCH(검색엔진), CUSTOM(사용자정의)';
COMMENT ON COLUMN mntr.health_checks.response_time 			IS '응답 시간 - 헬스체크 요청부터 응답까지의 소요 시간 (밀리초 단위, 성능 모니터링 지표)';
COMMENT ON COLUMN mntr.health_checks.error_message 			IS '오류 메시지 - 헬스체크 실패 시 발생한 상세 오류 내용 (연결 실패, 타임아웃, 예외 메시지 등)';
COMMENT ON COLUMN mntr.health_checks.timeout_duration 		IS '타임아웃 시간 - 헬스체크 요청 시 최대 대기 시간 (밀리초, 기본값 5초)';
COMMENT ON COLUMN mntr.health_checks.expected_status_code 	IS 'HTTP 체크 시 예상 상태 코드 - 정상으로 간주할 HTTP 응답 코드 (200, 201, 204 등, HTTP 체크 시에만 사용)';
COMMENT ON COLUMN mntr.health_checks.check_data 			IS '추가 체크 데이터 - 헬스체크 수행 시 필요한 추가 설정 정보 (JSON 형태, HTTP 헤더, 인증 정보, 쿼리 파라미터 등)';
COMMENT ON COLUMN mntr.health_checks.status 				IS '헬스 상태 - HEALTHY(정상), DEGRADED(성능저하), UNHEALTHY(장애) 서비스 가용성 상태 구분';
COMMENT ON COLUMN mntr.health_checks.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 서비스별 헬스체크 이력 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__service_name
    ON mntr.health_checks (service_name, created_at DESC)
 WHERE deleted = FALSE;

-- 상태별 헬스체크 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__status
    ON mntr.health_checks (status, created_at DESC)
 WHERE deleted = FALSE;

-- 체크 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__check_type
    ON mntr.health_checks (check_type, created_at DESC)
 WHERE deleted = FALSE;

-- 시간 기준 헬스체크 이력 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__created_at
    ON mntr.health_checks (created_at DESC);

-- 장애 서비스 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__unhealthy_services
    ON mntr.health_checks (status, service_name, created_at DESC)
 WHERE status = 'UNHEALTHY' AND deleted = FALSE;

-- 응답 시간별 성능 분석 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__response_time
    ON mntr.health_checks (response_time DESC NULLS LAST, created_at DESC)
 WHERE response_time IS NOT NULL AND deleted = FALSE;

-- 서비스별 상태 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__service_status
    ON mntr.health_checks (service_name, status, created_at DESC)
 WHERE deleted = FALSE;

-- 엔드포인트별 헬스체크 조회 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__api_endpoint
    ON mntr.health_checks (api_endpoint, created_at DESC)
 WHERE api_endpoint IS NOT NULL AND deleted = FALSE;

-- 오류 분석을 위한 인덱스
CREATE INDEX IF NOT EXISTS ix_health_checks__error_analysis
    ON mntr.health_checks (status, error_message)
 WHERE status != 'HEALTHY' AND error_message IS NOT NULL AND deleted = FALSE;

-- 서비스별 성능 모니터링 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__performance_monitoring
    ON mntr.health_checks (service_name, response_time, created_at DESC)
 WHERE response_time IS NOT NULL AND deleted = FALSE;

-- 타임아웃 분석 최적화
CREATE INDEX IF NOT EXISTS ix_health_checks__timeout_analysis
    ON mntr.health_checks (timeout_duration, response_time, created_at DESC)
 WHERE response_time IS NOT NULL AND deleted = FALSE;

-- 체크 데이터 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_health_checks__check_data
    ON mntr.health_checks USING GIN (check_data)
 WHERE deleted = FALSE;
