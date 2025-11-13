CREATE TABLE IF NOT EXISTS supt.feedbacks
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 고객 피드백 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 피드백 생성 일시
    created_by                  UUID,                                                              	-- 피드백 생성자 UUID (고객 또는 시스템)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 피드백 수정 일시
    updated_by                  UUID,                                                              	-- 피드백 수정자 UUID

	-- 피드백 제공자 정보
    tenant_id                   UUID                     NOT NULL,                                 	-- 피드백 제공 테넌트 ID
    user_id                     UUID,                                                              	-- 피드백 제공자 사용자 ID

	-- 피드백 기본 정보
    feedback_type               VARCHAR(50)              NOT NULL,                                 	-- 피드백 유형 (FEATURE_REQUEST/BUG_REPORT/IMPROVEMENT/COMPLIMENT/COMPLAINT)
    title                       VARCHAR(200)             NOT NULL,                                 	-- 피드백 제목
    description                 TEXT                     NOT NULL,                                 	-- 피드백 상세 내용

	-- 만족도 평가 정보
    overall_rating              INTEGER,                                                           	-- 전체 만족도 (1-5점)
    feature_ratings             JSONB                    DEFAULT '{}',                            	-- 기능별 상세 평점 (JSON 형태)

	-- 피드백 분류 정보
    product_area                VARCHAR(50),                                                       	-- 관련 제품 영역 (UI, API, DATABASE 등)
    urgency               		VARCHAR(20)              DEFAULT 'MEDIUM',                        	-- 긴급도 (LOW/MEDIUM/HIGH)

	-- 검토 및 처리 정보
    reviewed_by                 VARCHAR(100),                                                      	-- 피드백 검토자 (제품 관리자, 개발팀 등)
    reviewed_at                 TIMESTAMP WITH TIME ZONE,                                          	-- 검토 완료 일시
    implement_priority     		INTEGER,                                                           	-- 구현 우선순위 (1-10, 1이 최고 우선순위)
    implement_status       		VARCHAR(20)              DEFAULT 'SUBMITTED',                     	-- 구현 상태 (SUBMITTED/REVIEWING/PLANNED/IN_PROGRESS/COMPLETED/REJECTED)

	-- 고객 응답 정보
    response_message            TEXT,                                                              	-- 피드백에 대한 회사 측 응답
    response_sent_at            TIMESTAMP WITH TIME ZONE,                                          	-- 응답 발송 일시

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 피드백 상태 (ACTIVE/ARCHIVED/SPAM)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_feedbacks__tenant_id 					FOREIGN KEY (tenant_id) REFERENCES tnnt.tenants(id)	ON DELETE CASCADE,
    CONSTRAINT fk_feedbacks__user_id 					FOREIGN KEY (user_id) 	REFERENCES tnnt.users(id)	ON DELETE CASCADE,

    CONSTRAINT ck_feedbacks__feedback_type 				CHECK (feedback_type IN ('FEATURE_REQUEST', 'BUG_REPORT', 'IMPROVEMENT', 'COMPLIMENT', 'COMPLAINT', 'GENERAL')),
    CONSTRAINT ck_feedbacks__urgency 					CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT ck_feedbacks__implement_status 			CHECK (implement_status IN ('SUBMITTED', 'REVIEWING', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'DEFERRED')),
    CONSTRAINT ck_feedbacks__status 					CHECK (status IN ('ACTIVE', 'ARCHIVED', 'SPAM')),
    CONSTRAINT ck_feedbacks__overall_rating 			CHECK (overall_rating IS NULL OR (overall_rating >= 1 AND overall_rating <= 5)),
    CONSTRAINT ck_feedbacks__implement_priority 		CHECK (implement_priority IS NULL OR (implement_priority >= 1 AND implement_priority <= 10)),
    CONSTRAINT ck_feedbacks__review_logic 				CHECK ((reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL) OR (reviewed_by IS NULL AND reviewed_at IS NULL)),
    CONSTRAINT ck_feedbacks__response_logic 			CHECK ((response_message IS NOT NULL AND response_sent_at IS NOT NULL) OR (response_message IS NULL AND response_sent_at IS NULL))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  supt.feedbacks						IS '고객 피드백 - 제품 개선 요청, 버그 신고, 만족도 조사 결과를 체계적으로 수집하고 관리하여 제품 개발과 고객 만족도 향상에 활용';
COMMENT ON COLUMN supt.feedbacks.id 					IS '고객 피드백 고유 식별자 - UUID 형태의 기본키, 각 피드백을 구분하는 고유값';
COMMENT ON COLUMN supt.feedbacks.created_at 			IS '피드백 생성 일시 - 고객이 피드백을 제출한 시점의 타임스탬프';
COMMENT ON COLUMN supt.feedbacks.created_by 			IS '피드백 생성자 UUID - 피드백을 제출한 고객 또는 시스템의 식별자';
COMMENT ON COLUMN supt.feedbacks.updated_at 			IS '피드백 수정 일시 - 피드백 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN supt.feedbacks.updated_by 			IS '피드백 수정자 UUID - 피드백을 최종 수정한 사용자 또는 관리자의 식별자';
COMMENT ON COLUMN supt.feedbacks.tenant_id 				IS '피드백 제공 테넌트 ID - 피드백을 제공한 테넌트의 고유 식별자 (tenants 테이블 참조)';
COMMENT ON COLUMN supt.feedbacks.user_id 				IS '피드백 제공자 사용자 ID - 실제 피드백을 작성한 사용자의 식별자 (users 테이블 참조, 익명 피드백시 NULL)';
COMMENT ON COLUMN supt.feedbacks.feedback_type 			IS '피드백 유형 - FEATURE_REQUEST(기능요청), BUG_REPORT(버그신고), IMPROVEMENT(개선제안), COMPLIMENT(칭찬), COMPLAINT(불만), GENERAL(일반의견)';
COMMENT ON COLUMN supt.feedbacks.title 					IS '피드백 제목 - 피드백의 요약이나 핵심 내용을 나타내는 제목';
COMMENT ON COLUMN supt.feedbacks.description 			IS '피드백 상세 내용 - 고객이 제공한 구체적인 피드백 내용, 개선 제안, 문제 상황 등의 상세 설명';
COMMENT ON COLUMN supt.feedbacks.overall_rating 		IS '전체 만족도 - 제품이나 서비스에 대한 전반적인 만족도 평가 (1-5점, 5점이 최고)';
COMMENT ON COLUMN supt.feedbacks.feature_ratings 		IS '기능별 상세 평점 - 개별 기능이나 영역에 대한 세부적인 평가 (JSON 형태, 기능명과 점수 매핑)';
COMMENT ON COLUMN supt.feedbacks.product_area 			IS '관련 제품 영역 - 피드백이 관련된 제품의 특정 영역 (UI, API, DATABASE, SECURITY, PERFORMANCE 등)';
COMMENT ON COLUMN supt.feedbacks.urgency 				IS '긴급도 - LOW(낮음), MEDIUM(보통), HIGH(높음), CRITICAL(심각) 피드백 처리의 긴급성 수준';
COMMENT ON COLUMN supt.feedbacks.reviewed_by 			IS '피드백 검토자 - 피드백을 검토한 제품 관리자, 개발팀 리더, 또는 고객 성공팀의 이름';
COMMENT ON COLUMN supt.feedbacks.reviewed_at 			IS '검토 완료 일시 - 피드백에 대한 내부 검토가 완료된 시점';
COMMENT ON COLUMN supt.feedbacks.implement_priority 	IS '구현 우선순위 - 개발팀에서 정한 구현 우선순위 (1-10, 1이 최고 우선순위, 10이 최저)';
COMMENT ON COLUMN supt.feedbacks.implement_status 		IS '구현 상태 - SUBMITTED(제출됨), REVIEWING(검토중), PLANNED(계획됨), IN_PROGRESS(진행중), COMPLETED(완료), REJECTED(거부), DEFERRED(연기)';
COMMENT ON COLUMN supt.feedbacks.response_message 		IS '피드백에 대한 회사 측 응답 - 고객의 피드백에 대한 공식적인 답변이나 조치 계획';
COMMENT ON COLUMN supt.feedbacks.response_sent_at 		IS '응답 발송 일시 - 고객에게 피드백 응답이 전달된 시점';
COMMENT ON COLUMN supt.feedbacks.status 				IS '피드백 상태 - ACTIVE(활성), ARCHIVED(보관), SPAM(스팸) 피드백의 관리 상태';
COMMENT ON COLUMN supt.feedbacks.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성

-- 테넌트별 피드백 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__tenant_id
    ON supt.feedbacks (tenant_id, created_at DESC)
 WHERE deleted = FALSE;

-- 사용자별 피드백 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__user_id
    ON supt.feedbacks (user_id, created_at DESC)
 WHERE user_id IS NOT NULL AND deleted = FALSE;

-- 피드백 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__feedback_type
    ON supt.feedbacks (feedback_type, created_at DESC)
 WHERE deleted = FALSE;

-- 구현 상태별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__implement_status
    ON supt.feedbacks (implement_status, created_at DESC)
 WHERE deleted = FALSE;

-- 긴급도별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__urgency
    ON supt.feedbacks (urgency, created_at DESC)
 WHERE deleted = FALSE;

-- 만족도별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__overall_rating
    ON supt.feedbacks (overall_rating DESC, created_at DESC)
 WHERE overall_rating IS NOT NULL AND deleted = FALSE;

-- 제품 영역별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__product_area
    ON supt.feedbacks (product_area, created_at DESC)
 WHERE product_area IS NOT NULL AND deleted = FALSE;

-- 우선순위별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__implement_priority
    ON supt.feedbacks (implement_priority, created_at DESC)
 WHERE implement_priority IS NOT NULL AND deleted = FALSE;

-- 검토 대기 피드백 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__pending_review
    ON supt.feedbacks (implement_status, created_at DESC)
 WHERE implement_status = 'SUBMITTED' AND deleted = FALSE;

-- 기능 요청 관리 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__feature_requests
    ON supt.feedbacks (feedback_type, implement_status, implement_priority, created_at DESC)
 WHERE feedback_type = 'FEATURE_REQUEST' AND deleted = FALSE;

-- 버그 신고 처리 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__bug_reports
    ON supt.feedbacks (feedback_type, urgency, created_at DESC)
 WHERE feedback_type = 'BUG_REPORT' AND deleted = FALSE;

-- 검토자별 피드백 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__reviewed_feedback
    ON supt.feedbacks (reviewed_by, reviewed_at DESC)
 WHERE reviewed_by IS NOT NULL AND deleted = FALSE;

-- 응답 대기 피드백 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__response_pending
    ON supt.feedbacks (implement_status, response_sent_at)
 WHERE response_sent_at IS NULL
   AND implement_status IN ('REVIEWING', 'PLANNED', 'COMPLETED', 'REJECTED')
   AND deleted = FALSE;

-- 기능별 평점 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_feedbacks__feature_ratings
    ON supt.feedbacks USING GIN (feature_ratings)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_feedbacks__created_at
    ON supt.feedbacks (created_at DESC);
