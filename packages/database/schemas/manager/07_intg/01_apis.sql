CREATE TABLE IF NOT EXISTS intg.apis
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 외부 연동 고유 식별자
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 연동 설정 생성 일시
    created_by                  UUID,                                                              	-- 연동 설정 생성자 UUID
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 연동 설정 수정 일시
    updated_by                  UUID,                                                              	-- 연동 설정 수정자 UUID

    -- 테넌트 연결
    tenant_id                   UUID,                                                              	-- 테넌트별 연동인 경우 테넌트 ID

    -- 연동 기본 정보
    api_type            		VARCHAR(50)              NOT NULL,                                 	-- 연동 유형 (PAYMENT_GATEWAY/CRM/ERP/EMAIL_SERVICE 등)
    api_name            		VARCHAR(200)             NOT NULL,                                 	-- 연동 이름
    provider               		VARCHAR(100)             NOT NULL,                                 	-- 서비스 제공업체명

    -- API 연결 설정
    api_endpoint                VARCHAR(500),                                                      	-- API 엔드포인트 URL
    api_version                 VARCHAR(20),                                                       	-- API 버전
    authentication_type         VARCHAR(50)              NOT NULL DEFAULT 'API_KEY',              	-- 인증 방식

    -- 암호화된 인증 정보
    api_key                		VARCHAR(255),                                                      	-- 암호화된 API 키
    client_id                   VARCHAR(255),                                                      	-- OAuth 클라이언트 ID
    client_secret          		VARCHAR(255),                                                      	-- 암호화된 클라이언트 시크릿
    access_token           		VARCHAR(255),                                                      	-- 암호화된 액세스 토큰
    refresh_token         	 	VARCHAR(255),                                                      	-- 암호화된 리프레시 토큰
    token_expires_at            TIMESTAMP WITH TIME ZONE,                                          	-- 토큰 만료 시각

    -- 연동 상세 설정
    configuration               JSONB                    NOT NULL DEFAULT '{}',                   	-- 연동별 상세 설정
    mapping_rules               JSONB                    NOT NULL DEFAULT '{}',                   	-- 데이터 매핑 규칙
    sync_frequency              VARCHAR(20)              NOT NULL DEFAULT 'HOURLY',               	-- 동기화 주기

    -- 상태 모니터링
    last_sync_at                TIMESTAMP WITH TIME ZONE,                                          	-- 마지막 동기화 시각
    last_success_at             TIMESTAMP WITH TIME ZONE,                                         	-- 마지막 성공 시각
    last_error_at               TIMESTAMP WITH TIME ZONE,                                          	-- 마지막 오류 발생 시각
    last_error_message          TEXT,                                                              	-- 마지막 오류 메시지
    consecutive_failures        INTEGER                  NOT NULL DEFAULT 0,                      	-- 연속 실패 횟수

    -- 사용 통계
    total_requests              INTEGER                  NOT NULL DEFAULT 0,                      	-- 총 요청 수
    successful_requests         INTEGER                  NOT NULL DEFAULT 0,                      	-- 성공 요청 수
    failed_requests             INTEGER                  NOT NULL DEFAULT 0,                      	-- 실패 요청 수

    -- 제한 설정
    rate_limit                  INTEGER                  NOT NULL DEFAULT 100,                    	-- 분당 요청 제한
    daily_limit         		INTEGER                  NOT NULL DEFAULT 10000,                  	-- 일일 요청 제한

    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',               	-- 연동 상태

    -- 논리적 삭제 플래그
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,                   	-- 논리적 삭제 플래그

    -- 제약조건
    CONSTRAINT fk_apis__tenant_id 	     				FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,

    CONSTRAINT ck_apis__api_type 						CHECK (api_type IN ('PAYMENT_GATEWAY', 'CRM', 'ERP', 'EMAIL_SERVICE', 'SMS_SERVICE', 'STORAGE', 'ANALYTICS', 'NOTIFICATION', 'IDENTITY_PROVIDER')),
    CONSTRAINT ck_apis__authentication_type 			CHECK (authentication_type IN ('API_KEY', 'OAUTH2', 'BASIC_AUTH', 'JWT', 'BEARER_TOKEN')),
    CONSTRAINT ck_apis__sync_frequency         			CHECK (sync_frequency IN ('REALTIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MANUAL')),
    CONSTRAINT ck_apis__status         					CHECK (status IN ('ACTIVE', 'INACTIVE', 'ERROR', 'SUSPENDED')),
    CONSTRAINT ck_apis__consecutive_failures_positive	CHECK (consecutive_failures >= 0),
    CONSTRAINT ck_apis__requests_statistics_positive   	CHECK (total_requests >= 0 AND successful_requests >= 0 AND failed_requests >= 0),
    CONSTRAINT ck_apis__requests_statistics_logic      	CHECK (total_requests = successful_requests + failed_requests),
    CONSTRAINT ck_apis__rate_limits_positive         	CHECK (rate_limit > 0 AND daily_limit > 0),
    CONSTRAINT ck_apis__token_expiry_logic         		CHECK (authentication_type != 'OAUTH2' OR token_expires_at IS NOT NULL)
);

-- 컬럼별 코멘트 추가
COMMENT ON TABLE  intg.apis 						IS '외부 시스템 연동 - 결제, CRM, ERP 등 외부 서비스와의 API 연동 설정 및 상태 관리';
COMMENT ON COLUMN intg.apis.id 						IS '외부 연동 고유 식별자 (UUID)';
COMMENT ON COLUMN intg.apis.created_at 				IS '연동 설정 생성 일시';
COMMENT ON COLUMN intg.apis.created_by 				IS '연동 설정 생성자 UUID (시스템 관리자)';
COMMENT ON COLUMN intg.apis.updated_at 				IS '연동 설정 수정 일시';
COMMENT ON COLUMN intg.apis.updated_by 				IS '연동 설정 수정자 UUID';
COMMENT ON COLUMN intg.apis.tenant_id 				IS '테넌트별 연동인 경우 테넌트 ID - 전역 연동인 경우 NULL';
COMMENT ON COLUMN intg.apis.api_type 				IS '연동 유형 - 결제 게이트웨이, CRM, ERP, 이메일 서비스 등';
COMMENT ON COLUMN intg.apis.api_name 				IS '연동 이름 - 관리자가 식별하기 위한 친숙한 이름';
COMMENT ON COLUMN intg.apis.provider 				IS '서비스 제공업체명 - Stripe, Salesforce, AWS 등 실제 서비스 제공자';
COMMENT ON COLUMN intg.apis.api_endpoint 			IS 'API 엔드포인트 URL - 외부 서비스 API의 기본 URL';
COMMENT ON COLUMN intg.apis.api_version 			IS 'API 버전 - 사용하는 외부 서비스 API의 버전';
COMMENT ON COLUMN intg.apis.authentication_type 	IS '인증 방식 - API 키, OAuth2, 기본 인증, JWT 등';
COMMENT ON COLUMN intg.apis.api_key 				IS '암호화된 API 키 - 보안을 위해 해시화하여 저장';
COMMENT ON COLUMN intg.apis.client_id 				IS 'OAuth 클라이언트 ID - OAuth 인증 시 사용하는 클라이언트 식별자';
COMMENT ON COLUMN intg.apis.client_secret 			IS '암호화된 클라이언트 시크릿 - OAuth 클라이언트 비밀키 해시';
COMMENT ON COLUMN intg.apis.access_token 			IS '암호화된 액세스 토큰 - API 호출 시 사용하는 토큰 해시';
COMMENT ON COLUMN intg.apis.refresh_token 			IS '암호화된 리프레시 토큰 - 액세스 토큰 갱신용 토큰 해시';
COMMENT ON COLUMN intg.apis.token_expires_at 		IS '토큰 만료 시각 - 액세스 토큰이 만료되는 시간';
COMMENT ON COLUMN intg.apis.configuration 			IS '연동별 상세 설정 - JSON 형태의 서비스별 설정값들';
COMMENT ON COLUMN intg.apis.mapping_rules 			IS '데이터 매핑 규칙 - JSON 형태의 데이터 변환 및 매핑 규칙';
COMMENT ON COLUMN intg.apis.sync_frequency 			IS '동기화 주기 - 실시간, 시간별, 일별, 주별, 수동 중 선택';
COMMENT ON COLUMN intg.apis.last_sync_at 			IS '마지막 동기화 시각 - 가장 최근에 동기화를 시도한 시간';
COMMENT ON COLUMN intg.apis.last_success_at 		IS '마지막 성공 시각 - 가장 최근에 성공한 동기화 시간';
COMMENT ON COLUMN intg.apis.last_error_at 			IS '마지막 오류 발생 시각 - 가장 최근에 오류가 발생한 시간';
COMMENT ON COLUMN intg.apis.last_error_message 		IS '마지막 오류 메시지 - 가장 최근 오류의 상세 내용';
COMMENT ON COLUMN intg.apis.consecutive_failures 	IS '연속 실패 횟수 - 연속으로 실패한 동기화 시도 횟수';
COMMENT ON COLUMN intg.apis.total_requests 			IS '총 요청 수 - 이 연동을 통해 발생한 전체 API 요청 수';
COMMENT ON COLUMN intg.apis.successful_requests 	IS '성공 요청 수 - 성공한 API 요청 수';
COMMENT ON COLUMN intg.apis.failed_requests 		IS '실패 요청 수 - 실패한 API 요청 수';
COMMENT ON COLUMN intg.apis.rate_limit 				IS '분당 요청 제한 - 외부 서비스 호출 시 분당 최대 요청 수';
COMMENT ON COLUMN intg.apis.daily_limit 			IS '일일 요청 제한 - 외부 서비스 호출 시 일일 최대 요청 수';
COMMENT ON COLUMN intg.apis.status 					IS '연동 상태 - 활성, 비활성, 오류, 중단 중 하나';
COMMENT ON COLUMN intg.apis.deleted 				IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';
