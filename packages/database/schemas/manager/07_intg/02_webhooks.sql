CREATE TABLE IF NOT EXISTS intg.webhooks
(
   id 							UUID 					 PRIMARY KEY DEFAULT gen_random_uuid(),		-- 웹훅 엔드포인트 고유 식별자
   created_at 					TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 엔드포인트 생성 일시
   created_by 					UUID,                                                        		-- 엔드포인트 생성자 UUID
   updated_at 					TIMESTAMP WITH TIME ZONE,                                    		-- 엔드포인트 수정 일시
   updated_by 					UUID,                                                       		-- 엔드포인트 수정자 UUID

   tenant_id 					UUID 					 NOT NULL,                                  -- 테넌트 ID (다중 테넌트 구분)
   integration_id 				UUID,                                                    			-- 연동 서비스 ID (외부 통합 서비스와 연관)

   -- 웹훅 기본 정보
   webhook_name 				VARCHAR(200)			 NOT NULL,                                  -- 웹훅 엔드포인트 이름
   webhook_url 					VARCHAR(500)			 NOT NULL,                                  -- 웹훅을 받을 대상 URL
   description 					TEXT,                                                       		-- 웹훅 엔드포인트 설명

   -- 이벤트 설정
   event_types 					TEXT[]					 NOT NULL,                                  -- 구독할 이벤트 유형 목록
   event_filters 				JSONB					 DEFAULT '{}',                              -- 이벤트 필터링 조건 (JSON 형태)

   -- 보안 설정
   secret_key_hash 				VARCHAR(255),                                           			-- 서명 검증용 시크릿 키 해시값
   signature_algorithm 			VARCHAR(20)				 DEFAULT 'HMAC_SHA256',                  	-- 웹훅 서명 알고리즘

   -- HTTP 전송 설정
   http_method 					VARCHAR(10)				 DEFAULT 'POST',                            -- HTTP 요청 메소드
   content_type 				VARCHAR(50)				 DEFAULT 'application/json',                -- HTTP 컨텐츠 타입
   custom_headers 				JSONB					 DEFAULT '{}',                              -- 커스텀 HTTP 헤더 (JSON 형태)
   timeout 						INTEGER					 DEFAULT 30,                                -- HTTP 요청 타임아웃 (초)

   -- 재시도 설정
   max_retry_attempts 			INTEGER					 DEFAULT 3,                                 -- 최대 재시도 횟수
   retry_backoff 				INTEGER					 DEFAULT 60,                               	-- 재시도 간격 (초)

   -- 전송 통계
   total_deliveries 			INTEGER					 DEFAULT 0,                                 -- 총 웹훅 전송 횟수
   successful_deliveries 		INTEGER					 DEFAULT 0,                                	-- 성공한 웹훅 전송 횟수
   failed_deliveries 			INTEGER					 DEFAULT 0,                                 -- 실패한 웹훅 전송 횟수
   last_delivery_at 			TIMESTAMP WITH TIME ZONE,                              				-- 마지막 웹훅 전송 시각
   last_success_at 				TIMESTAMP WITH TIME ZONE,                               			-- 마지막 성공 전송 시각
   last_failure_at 				TIMESTAMP WITH TIME ZONE,                               			-- 마지막 실패 전송 시각
   last_failure_reason 			TEXT,                                               				-- 마지막 실패 사유

   -- 상태 관리
   enabled 						BOOLEAN					 DEFAULT TRUE,                              -- 웹훅 활성화 여부
   deleted 						BOOLEAN					 NOT NULL DEFAULT FALSE,                    -- 논리적 삭제 여부

   CONSTRAINT fk_webhooks__tenant_id       		FOREIGN KEY (tenant_id) 		REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,
   CONSTRAINT fk_webhooks__integration_id		FOREIGN KEY (integration_id) 	REFERENCES intg.apis(id)	ON DELETE CASCADE,

   CONSTRAINT ck_webhooks__http_method      	CHECK (http_method IN ('POST', 'PUT', 'PATCH')),
   CONSTRAINT ck_webhooks__signature_algorithm	CHECK (signature_algorithm IN ('HMAC_SHA256', 'HMAC_SHA512'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  intg.webhooks 						IS '웹훅 엔드포인트 - 외부 시스템으로 이벤트 알림을 전송하는 웹훅 관리';
COMMENT ON COLUMN intg.webhooks.id 						IS '웹훅 엔드포인트 고유 식별자';
COMMENT ON COLUMN intg.webhooks.created_at 				IS '엔드포인트 생성 일시';
COMMENT ON COLUMN intg.webhooks.created_by 				IS '엔드포인트 생성자 UUID';
COMMENT ON COLUMN intg.webhooks.updated_at 				IS '엔드포인트 수정 일시';
COMMENT ON COLUMN intg.webhooks.updated_by 				IS '엔드포인트 수정자 UUID';
COMMENT ON COLUMN intg.webhooks.tenant_id 				IS '테넌트 ID (다중 테넌트 구분)';
COMMENT ON COLUMN intg.webhooks.integration_id 			IS '연동 서비스 ID (외부 통합 서비스와 연관)';
COMMENT ON COLUMN intg.webhooks.webhook_name 			IS '웹훅 엔드포인트 이름';
COMMENT ON COLUMN intg.webhooks.webhook_url 			IS '웹훅을 받을 대상 URL';
COMMENT ON COLUMN intg.webhooks.description 			IS '웹훅 엔드포인트 설명';
COMMENT ON COLUMN intg.webhooks.event_types 			IS '구독할 이벤트 유형 목록 (배열)';
COMMENT ON COLUMN intg.webhooks.event_filters 			IS '이벤트 필터링 조건 (JSON 형태)';
COMMENT ON COLUMN intg.webhooks.secret_key_hash 		IS '서명 검증용 시크릿 키 해시값';
COMMENT ON COLUMN intg.webhooks.signature_algorithm 	IS '웹훅 서명 알고리즘 (HMAC_SHA256, HMAC_SHA512)';
COMMENT ON COLUMN intg.webhooks.http_method 			IS 'HTTP 요청 메소드 (POST, PUT, PATCH)';
COMMENT ON COLUMN intg.webhooks.content_type 			IS 'HTTP 컨텐츠 타입';
COMMENT ON COLUMN intg.webhooks.custom_headers 			IS '커스텀 HTTP 헤더 (JSON 형태)';
COMMENT ON COLUMN intg.webhooks.timeout 				IS 'HTTP 요청 타임아웃 (초)';
COMMENT ON COLUMN intg.webhooks.max_retry_attempts 		IS '최대 재시도 횟수';
COMMENT ON COLUMN intg.webhooks.retry_backoff 			IS '재시도 간격 (초)';
COMMENT ON COLUMN intg.webhooks.total_deliveries 		IS '총 웹훅 전송 횟수';
COMMENT ON COLUMN intg.webhooks.successful_deliveries 	IS '성공한 웹훅 전송 횟수';
COMMENT ON COLUMN intg.webhooks.failed_deliveries 		IS '실패한 웹훅 전송 횟수';
COMMENT ON COLUMN intg.webhooks.last_delivery_at 		IS '마지막 웹훅 전송 시각';
COMMENT ON COLUMN intg.webhooks.last_success_at 		IS '마지막 성공 전송 시각';
COMMENT ON COLUMN intg.webhooks.last_failure_at 		IS '마지막 실패 전송 시각';
COMMENT ON COLUMN intg.webhooks.last_failure_reason 	IS '마지막 실패 사유';
COMMENT ON COLUMN intg.webhooks.enabled 				IS '웹훅 활성화 여부';
COMMENT ON COLUMN intg.webhooks.deleted 				IS '논리적 삭제 여부';

-- 인덱스

-- 활성 웹훅 엔드포인트만 인덱싱
CREATE INDEX IF NOT EXISTS ix_webhooks__tenant_id
    ON intg.webhooks (tenant_id)
 WHERE deleted = FALSE;

-- 활성 웹훅 엔드포인트만 인덱싱
CREATE INDEX IF NOT EXISTS ix_webhooks__integration_id
    ON intg.webhooks (integration_id)
 WHERE deleted = FALSE;

-- 이벤트 타입 배열 검색용
CREATE INDEX IF NOT EXISTS ix_webhooks__event_types
    ON intg.webhooks USING GIN (event_types)
 WHERE deleted = FALSE;

-- 활성/비활성 및 삭제 상태 조회용
CREATE INDEX IF NOT EXISTS ix_webhooks__enabled_deleted
    ON intg.webhooks (enabled, deleted);

-- 마지막 전송 시각 기준 정렬용
CREATE INDEX IF NOT EXISTS ix_webhooks__last_delivery_at
    ON intg.webhooks (last_delivery_at)
 WHERE deleted = FALSE;

-- 엔드포인트 이름 검색용
CREATE INDEX IF NOT EXISTS ix_webhooks__webhook_name
    ON intg.webhooks (webhook_name)
 WHERE deleted = FALSE;
