CREATE TABLE IF NOT EXISTS supt.tickets
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 지원 티켓 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 티켓 생성 일시
    created_by                  UUID,                                                              	-- 티켓 생성자 UUID (사용자 또는 시스템)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 티켓 수정 일시
    updated_by                  UUID,                                                              	-- 티켓 수정자 UUID
    -- 티켓 소유자 정보
    tenant_id                   UUID                     NOT NULL,                                 	-- 티켓 생성 테넌트 ID
    user_id                     UUID,                                                              	-- 티켓을 생성한 사용자 ID
    -- 티켓 기본 정보
    ticket_no                   VARCHAR(50)              NOT NULL UNIQUE,                          	-- 티켓 번호 (고유 식별용)
    title                       VARCHAR(200)             NOT NULL,                                 	-- 티켓 제목
    description                 TEXT                     NOT NULL,                                 	-- 문제 상세 설명
    category                    VARCHAR(50)              NOT NULL,                                 	-- 티켓 카테고리 (TECHNICAL/BILLING/FEATURE_REQUEST/BUG_REPORT/GENERAL)
    priority                    VARCHAR(20)              NOT NULL DEFAULT 'MEDIUM',               	-- 우선순위 (LOW/MEDIUM/HIGH/URGENT)
    -- 연락처 정보
    contact_email               VARCHAR(255)             NOT NULL,                                 	-- 연락용 이메일 주소
    contact_phone               VARCHAR(20),                                                       	-- 연락용 전화번호
    -- 할당 및 담당자 정보
    assigned_to                 VARCHAR(100),                                                      	-- 담당 지원팀원 또는 팀명
    assigned_at                 TIMESTAMP WITH TIME ZONE,                                          	-- 담당자 할당 일시
    -- SLA 및 응답 시간 관리
    sla_level                   VARCHAR(20)              NOT NULL DEFAULT 'STANDARD',             	-- SLA 수준 (BASIC/STANDARD/PREMIUM/ENTERPRISE)
    first_response_due          TIMESTAMP WITH TIME ZONE,                                          	-- SLA 기준 최초 응답 기한
    resolution_due              TIMESTAMP WITH TIME ZONE,                                          	-- SLA 기준 해결 기한
    first_response_at           TIMESTAMP WITH TIME ZONE,                                          	-- 실제 최초 응답 시각
    resolved_at                 TIMESTAMP WITH TIME ZONE,                                          	-- 실제 해결 완료 시각
    resolution_summary          TEXT,                                                              	-- 해결 요약 및 조치 내용
    -- 고객 만족도 정보
    customer_rating             INTEGER,                                                           	-- 고객 평점 (1-5점)
    customer_feedback          	TEXT,                                                              	-- 고객 피드백 및 의견
    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'OPEN',                 	-- 티켓 상태 (OPEN/IN_PROGRESS/PENDING_CUSTOMER/RESOLVED/CLOSED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_tickets__tenant_id 					FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,
    CONSTRAINT fk_tickets__user_id 						FOREIGN KEY (user_id) 	REFERENCES tnnt.users(id)	ON DELETE CASCADE,

    CONSTRAINT ck_tickets__category 					CHECK (category IN ('TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'GENERAL', 'ACCOUNT_ISSUE')),
    CONSTRAINT ck_tickets__priority 					CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT ck_tickets__sla_level 					CHECK (sla_level IN ('BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE')),
    CONSTRAINT ck_tickets__status 						CHECK (status IN ('OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'RESOLVED', 'CLOSED')),
    CONSTRAINT ck_tickets__customer_rating 				CHECK (customer_rating IS NULL OR (customer_rating >= 1 AND customer_rating <= 5)),
    CONSTRAINT ck_tickets__contact_email_format 		CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT ck_tickets__resolution_logic 			CHECK ((status = 'RESOLVED' AND resolved_at IS NOT NULL) OR (status != 'RESOLVED')),
    CONSTRAINT ck_tickets__assignment_logic 			CHECK ((assigned_to IS NOT NULL AND assigned_at IS NOT NULL) OR (assigned_to IS NULL AND assigned_at IS NULL))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  supt.tickets							IS '고객 지원 티켓 - 고객 문의, 기술 지원, 버그 리포트 등 모든 지원 요청의 생명주기 관리와 SLA 추적';
COMMENT ON COLUMN supt.tickets.id 						IS '지원 티켓 고유 식별자 - UUID 형태의 기본키, 각 지원 요청을 구분하는 고유값';
COMMENT ON COLUMN supt.tickets.created_at 				IS '티켓 생성 일시 - 고객이 지원 요청을 제출한 시점의 타임스탬프';
COMMENT ON COLUMN supt.tickets.created_by 				IS '티켓 생성자 UUID - 티켓을 생성한 사용자 또는 시스템의 식별자';
COMMENT ON COLUMN supt.tickets.updated_at 				IS '티켓 수정 일시 - 티켓 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN supt.tickets.updated_by 				IS '티켓 수정자 UUID - 티켓을 최종 수정한 지원팀원 또는 시스템의 식별자';
COMMENT ON COLUMN supt.tickets.tenant_id 				IS '티켓 생성 테넌트 ID - 지원 요청을 제출한 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN supt.tickets.user_id 					IS '티켓을 생성한 사용자 ID - 실제 지원 요청을 제출한 사용자의 식별자 (users 테이블 참조, 익명 요청시 NULL)';
COMMENT ON COLUMN supt.tickets.ticket_no 				IS '티켓 번호 - 고객과 지원팀이 참조하는 고유한 티켓 식별번호 (예: TK-2024-001, SUPPORT-20241201-001)';
COMMENT ON COLUMN supt.tickets.title 					IS '티켓 제목 - 문제나 요청의 간략한 요약 제목';
COMMENT ON COLUMN supt.tickets.description 				IS '문제 상세 설명 - 고객이 제공한 문제 상황, 오류 메시지, 재현 단계 등의 상세 내용';
COMMENT ON COLUMN supt.tickets.category 				IS '티켓 카테고리 - TECHNICAL(기술지원), BILLING(결제문의), FEATURE_REQUEST(기능요청), BUG_REPORT(버그신고), GENERAL(일반문의), ACCOUNT_ISSUE(계정문제)';
COMMENT ON COLUMN supt.tickets.priority 				IS '우선순위 - LOW(낮음), MEDIUM(보통), HIGH(높음), URGENT(긴급) 처리 우선도 구분';
COMMENT ON COLUMN supt.tickets.contact_email 			IS '연락용 이메일 주소 - 티켓 업데이트 알림을 받을 고객의 이메일 주소';
COMMENT ON COLUMN supt.tickets.contact_phone 			IS '연락용 전화번호 - 긴급한 경우 직접 연락 가능한 고객의 전화번호';
COMMENT ON COLUMN supt.tickets.assigned_to 				IS '담당 지원팀원 또는 팀명 - 이 티켓을 처리하는 담당자나 팀의 이름';
COMMENT ON COLUMN supt.tickets.assigned_at 				IS '담당자 할당 일시 - 티켓이 특정 담당자에게 할당된 시점';
COMMENT ON COLUMN supt.tickets.sla_level 				IS 'SLA 수준 - BASIC(기본), STANDARD(표준), PREMIUM(프리미엄), ENTERPRISE(기업) 고객 등급에 따른 지원 수준';
COMMENT ON COLUMN supt.tickets.first_response_due 		IS 'SLA 기준 최초 응답 기한 - 고객 등급에 따른 최초 응답 목표 시간';
COMMENT ON COLUMN supt.tickets.resolution_due 			IS 'SLA 기준 해결 기한 - 고객 등급에 따른 문제 해결 목표 시간';
COMMENT ON COLUMN supt.tickets.first_response_at 		IS '실제 최초 응답 시각 - 지원팀이 고객에게 첫 번째 응답을 보낸 실제 시점';
COMMENT ON COLUMN supt.tickets.resolved_at 				IS '실제 해결 완료 시각 - 문제가 완전히 해결된 실제 시점';
COMMENT ON COLUMN supt.tickets.resolution_summary 		IS '해결 요약 및 조치 내용 - 문제 해결을 위해 취한 조치와 최종 결과의 요약';
COMMENT ON COLUMN supt.tickets.customer_rating 			IS '고객 평점 - 지원 서비스에 대한 고객 만족도 평가 (1-5점, 5점이 최고)';
COMMENT ON COLUMN supt.tickets.customer_feedback		IS '고객 피드백 및 의견 - 지원 서비스에 대한 고객의 추가 의견이나 개선 제안';
COMMENT ON COLUMN supt.tickets.status 					IS '티켓 상태 - OPEN(접수), IN_PROGRESS(처리중), PENDING_CUSTOMER(고객대기), RESOLVED(해결완료), CLOSED(종료) 처리 단계';
COMMENT ON COLUMN supt.tickets.deleted 					IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 티켓 번호 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_tickets__ticket_no
	ON supt.tickets (ticket_no)
 WHERE deleted = FALSE;

-- 테넌트별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__tenant_id
	ON supt.tickets (tenant_id, created_at DESC)
 WHERE deleted = FALSE;

-- 사용자별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__user_id
	ON supt.tickets (user_id, created_at DESC)
 WHERE user_id IS NOT NULL
   AND deleted = FALSE;

-- 상태별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__status
	ON supt.tickets (status, created_at DESC)
 WHERE deleted = FALSE;

-- 카테고리별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__category
	ON supt.tickets (category, created_at DESC)
 WHERE deleted = FALSE;

-- 우선순위별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__priority
	ON supt.tickets (priority, created_at DESC)
 WHERE deleted = FALSE;

-- 담당자별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__assigned_to
	ON supt.tickets (assigned_to, status, created_at DESC)
 WHERE assigned_to IS NOT NULL
   AND deleted = FALSE;

-- SLA 수준별 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__sla_level
	ON supt.tickets (sla_level, created_at DESC)
 WHERE deleted = FALSE;

-- 진행중인 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__open_tickets
	ON supt.tickets (status, priority, created_at DESC)
 WHERE status IN ('OPEN', 'IN_PROGRESS')
   AND deleted = FALSE;

-- 긴급 티켓 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__urgent_tickets
	ON supt.tickets (priority, created_at DESC)
 WHERE priority = 'URGENT'
   AND status != 'CLOSED'
   AND deleted = FALSE;

-- SLA 추적 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__sla_tracking
	ON supt.tickets (first_response_due, resolution_due, created_at DESC)
 WHERE status NOT IN ('RESOLVED', 'CLOSED')
   AND deleted = FALSE;

--CREATE INDEX IF NOT EXISTS ix_tickets__overdue_response 		ON supt.tickets (first_response_due, first_response_at) WHERE first_response_at IS NULL AND first_response_due < NOW() AND deleted = FALSE;	-- 응답 지연 티켓 조회 최적화
--CREATE INDEX IF NOT EXISTS ix_tickets__overdue_resolution 		ON supt.tickets (resolution_due, resolved_at) WHERE resolved_at IS NULL AND resolution_due < NOW() AND deleted = FALSE; 						-- 해결 지연 티켓 조회 최적화

-- 만족도 분석 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__customer_satisfaction
 	ON supt.tickets (customer_rating DESC, created_at DESC)
 WHERE customer_rating IS NOT NULL
   AND deleted = FALSE;

-- 연락처로 티켓 검색 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__contact_email
	ON supt.tickets (contact_email)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_tickets__created_at
	ON supt.tickets (created_at DESC);
