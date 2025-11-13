CREATE TABLE IF NOT EXISTS intg.rate_limits
(
   id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    	-- API 호출 제한 고유 식별자
   created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,         -- 제한 규칙 생성 일시
   created_by                  UUID,                                                              	-- 제한 규칙 생성자 UUID
   updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 제한 규칙 수정 일시
   updated_by                  UUID,                                                              	-- 제한 규칙 수정자 UUID

   -- 제한 대상
   tenant_id                   UUID,                                                              	-- 테넌트별 제한 대상 ID
   user_id                     UUID,                                                              	-- 사용자별 제한 대상 ID
   api_key_id                  UUID,                                                              	-- API 키별 제한 대상 ID
   client_ip                   VARCHAR(45),                                                       	-- IP별 제한 대상 주소

   -- 제한 설정
   limit_type                  VARCHAR(50)              NOT NULL,                                 	-- 제한 유형 (분당/시간당/일당 요청 수)
   limit_value                 INTEGER                  NOT NULL,                                 	-- 제한 임계값
   window_size                 INTEGER                  NOT NULL,                                 	-- 시간 윈도우 크기 (초)

   -- 현재 사용량 추적
   current_usage               INTEGER                  DEFAULT 0,                                	-- 현재 윈도우 내 사용량
   window_start                TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,                           	-- 현재 윈도우 시작 시각

   -- 제한 초과 처리
   action_on_exceed            VARCHAR(20)              DEFAULT 'BLOCK' NOT NULL,                	-- 제한 초과 시 조치 방법
   burst_allowance             INTEGER                  DEFAULT 0,                                	-- 버스트 트래픽 허용량

   -- 통계 및 모니터링
   last_access_at              TIMESTAMP WITH TIME ZONE,                                          	-- 마지막 API 접근 시각
   total_requests              INTEGER                  DEFAULT 0,                                	-- 총 요청 수
   blocked_requests            INTEGER                  DEFAULT 0,                                	-- 차단된 요청 수

   -- 만료 관리
   expires_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 제한 규칙 만료 시각
   deleted                     BOOLEAN                  DEFAULT FALSE NOT NULL,                   	-- 논리적 삭제 여부

   CONSTRAINT fk_rate_limits__tenant_id       	FOREIGN KEY (tenant_id) 	REFERENCES tnnt.tenants(id)		ON DELETE CASCADE,
   CONSTRAINT fk_rate_limits__api_key_id      	FOREIGN KEY (api_key_id) 	REFERENCES tnnt.api_keys(id)	ON DELETE CASCADE,
   CONSTRAINT fk_rate_limits__user_id       	FOREIGN KEY (user_id) 		REFERENCES tnnt.users(id)		ON DELETE CASCADE,

   CONSTRAINT ck_rate_limits__action_on_exceed 	CHECK (action_on_exceed IN ('BLOCK', 'THROTTLE', 'LOG_ONLY')),
   CONSTRAINT ck_rate_limits__limit_type        CHECK (limit_type IN ('REQUESTS_PER_MINUTE', 'REQUESTS_PER_HOUR', 'REQUESTS_PER_DAY', 'BANDWIDTH'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  intg.rate_limits						IS 'API 호출 제한 - 테넌트, 사용자, IP별 API 사용량 제한 및 모니터링';
COMMENT ON COLUMN intg.rate_limits.id               	IS 'API 호출 제한 고유 식별자';
COMMENT ON COLUMN intg.rate_limits.created_at       	IS '제한 규칙 생성 일시';
COMMENT ON COLUMN intg.rate_limits.created_by       	IS '제한 규칙 생성자 UUID';
COMMENT ON COLUMN intg.rate_limits.updated_at       	IS '제한 규칙 수정 일시';
COMMENT ON COLUMN intg.rate_limits.updated_by       	IS '제한 규칙 수정자 UUID';
COMMENT ON COLUMN intg.rate_limits.tenant_id        	IS '테넌트별 제한 대상 ID';
COMMENT ON COLUMN intg.rate_limits.api_key_id       	IS 'API 키별 제한 대상 ID';
COMMENT ON COLUMN intg.rate_limits.user_id          	IS '사용자별 제한 대상 ID';
COMMENT ON COLUMN intg.rate_limits.client_ip        	IS 'IP별 제한 대상 주소 (IPv4/IPv6)';
COMMENT ON COLUMN intg.rate_limits.limit_type       	IS '제한 유형 (REQUESTS_PER_MINUTE, REQUESTS_PER_HOUR, REQUESTS_PER_DAY, BANDWIDTH)';
COMMENT ON COLUMN intg.rate_limits.limit_value      	IS '제한 임계값 (요청 수 또는 대역폭)';
COMMENT ON COLUMN intg.rate_limits.window_size      	IS '시간 윈도우 크기 (초 단위)';
COMMENT ON COLUMN intg.rate_limits.current_usage    	IS '현재 윈도우 내 사용량';
COMMENT ON COLUMN intg.rate_limits.window_start     	IS '현재 윈도우 시작 시각';
COMMENT ON COLUMN intg.rate_limits.action_on_exceed 	IS '제한 초과 시 조치 방법 (BLOCK, THROTTLE, LOG_ONLY)';
COMMENT ON COLUMN intg.rate_limits.burst_allowance  	IS '버스트 트래픽 허용량';
COMMENT ON COLUMN intg.rate_limits.last_access_at   	IS '마지막 API 접근 시각';
COMMENT ON COLUMN intg.rate_limits.total_requests   	IS '총 요청 수 (누적 통계)';
COMMENT ON COLUMN intg.rate_limits.blocked_requests 	IS '차단된 요청 수 (누적 통계)';
COMMENT ON COLUMN intg.rate_limits.expires_at       	IS '제한 규칙 만료 시각';
COMMENT ON COLUMN intg.rate_limits.deleted          	IS '논리적 삭제 여부';

-- 테넌트별 제한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__tenant_id
	ON intg.rate_limits (tenant_id)
 WHERE deleted = FALSE;

-- API 키별 제한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__api_key_id
	ON intg.rate_limits (api_key_id)
 WHERE deleted = FALSE;

-- 사용자별 제한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__user_id
	ON intg.rate_limits (user_id)
 WHERE deleted = FALSE;

-- IP별 제한 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__client_ip
	ON intg.rate_limits (client_ip)
 WHERE deleted = FALSE;

-- 제한 유형별 조회용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__limit_type
	ON intg.rate_limits (limit_type)
 WHERE deleted = FALSE;

-- 만료된 제한 규칙 정리용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__expires_at
	ON intg.rate_limits (expires_at)
 WHERE deleted = FALSE
   AND expires_at IS NOT NULL;

-- 윈도우 시작 시각 기준 정리용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__window_start
	ON intg.rate_limits (window_start)
 WHERE deleted = FALSE;

-- 복합 조회 최적화용 인덱스 (테넌트 + 제한 유형)
CREATE INDEX IF NOT EXISTS ix_rate_limits__tenant_limit_type
	ON intg.rate_limits (tenant_id, limit_type)
 WHERE deleted = FALSE;

-- 마지막 접근 시각 기준 통계용 인덱스
CREATE INDEX IF NOT EXISTS ix_rate_limits__last_access_at
	ON intg.rate_limits (last_access_at)
 WHERE deleted = FALSE;
