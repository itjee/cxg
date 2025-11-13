CREATE TABLE IF NOT EXISTS supt.ticket_comments
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 티켓 댓글 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 댓글 생성 일시
    created_by                  UUID,                                                              	-- 댓글 생성자 UUID (사용자 또는 시스템)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 댓글 수정 일시
    updated_by                  UUID,                                                              	-- 댓글 수정자 UUID

	-- 관련 엔티티 연결
    ticket_id                   UUID                     NOT NULL,                                 	-- 소속 티켓 ID
    user_id                     UUID,                                                              	-- 댓글 작성자 ID (고객 또는 지원팀원)

	-- 댓글 내용 정보
    comment_text                TEXT                     NOT NULL,                                 	-- 댓글 본문 내용
    comment_type                VARCHAR(20)              NOT NULL DEFAULT 'COMMENT',              	-- 댓글 유형 (COMMENT/INTERNAL_NOTE/STATUS_CHANGE/RESOLUTION)
    is_internal                 BOOLEAN                  DEFAULT FALSE,                           	-- 내부 댓글 여부 (고객에게 비공개)

	-- 첨부파일 정보
    files           	 		JSONB                    DEFAULT '[]',                            	-- 첨부 파일 목록 (JSON 배열)

	-- 자동화 정보
    automated                	BOOLEAN                  DEFAULT FALSE,                           	-- 시스템 자동 생성 여부
    automation_source           VARCHAR(50),                                                       	-- 자동화 소스 (EMAIL/CHATBOT/WORKFLOW/API)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              	-- 댓글 상태 (ACTIVE/HIDDEN/DELETED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_ticket_comments__ticket_id 				FOREIGN KEY (ticket_id) REFERENCES supt.tickets(id)	ON DELETE CASCADE,
    CONSTRAINT fk_ticket_comments__user_id 					FOREIGN KEY (user_id) 	REFERENCES tnnt.users(id)	ON DELETE CASCADE,

    CONSTRAINT ck_ticket_comments__comment_type 			CHECK (comment_type IN ('COMMENT', 'INTERNAL_NOTE', 'STATUS_CHANGE', 'RESOLUTION', 'SYSTEM_UPDATE')),
    CONSTRAINT ck_ticket_comments__automation_source 		CHECK (automation_source IN ('EMAIL', 'CHATBOT', 'WORKFLOW', 'API', 'ESCALATION', 'SLA_ALERT')),
    CONSTRAINT ck_ticket_comments__status 					CHECK (status IN ('ACTIVE', 'HIDDEN', 'DELETED')),
    CONSTRAINT ck_ticket_comments__automation_logic 		CHECK ((automated = TRUE AND automation_source IS NOT NULL) OR (automated = FALSE))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  supt.ticket_comments						IS '티켓 댓글 및 대화 - 지원 티켓의 모든 의사소통 기록, 내부 노트, 상태 변경 이력을 관리';
COMMENT ON COLUMN supt.ticket_comments.id 					IS '티켓 댓글 고유 식별자 - UUID 형태의 기본키, 각 댓글을 구분하는 고유값';
COMMENT ON COLUMN supt.ticket_comments.created_at 			IS '댓글 생성 일시 - 댓글이 작성된 시점의 타임스탬프';
COMMENT ON COLUMN supt.ticket_comments.created_by 			IS '댓글 생성자 UUID - 댓글을 작성한 사용자 또는 시스템의 식별자';
COMMENT ON COLUMN supt.ticket_comments.updated_at 			IS '댓글 수정 일시 - 댓글이 최종 수정된 시점의 타임스탬프';
COMMENT ON COLUMN supt.ticket_comments.updated_by 			IS '댓글 수정자 UUID - 댓글을 최종 수정한 사용자 또는 시스템의 식별자';
COMMENT ON COLUMN supt.ticket_comments.ticket_id 			IS '소속 티켓 ID - 이 댓글이 속한 지원 티켓의 고유 식별자 (support_tickets 테이블 참조)';
COMMENT ON COLUMN supt.ticket_comments.user_id 				IS '댓글 작성자 ID - 댓글을 작성한 고객 또는 지원팀원의 식별자 (users 테이블 참조, 시스템 자동 댓글시 NULL)';
COMMENT ON COLUMN supt.ticket_comments.comment_text 		IS '댓글 본문 내용 - 실제 댓글 텍스트, 답변, 설명, 또는 상태 변경 사유 등';
COMMENT ON COLUMN supt.ticket_comments.comment_type 		IS '댓글 유형 - COMMENT(일반댓글), INTERNAL_NOTE(내부메모), STATUS_CHANGE(상태변경), RESOLUTION(해결방안), SYSTEM_UPDATE(시스템업데이트)';
COMMENT ON COLUMN supt.ticket_comments.is_internal 			IS '내부 댓글 여부 - TRUE(지원팀 내부용, 고객에게 비공개), FALSE(고객과 공유되는 공개 댓글)';
COMMENT ON COLUMN supt.ticket_comments.files 				IS '첨부 파일 목록 - 댓글과 함께 첨부된 파일들의 정보 (JSON 배열, 파일명, 경로, 크기 등 포함)';
COMMENT ON COLUMN supt.ticket_comments.automated 			IS '시스템 자동 생성 여부 - TRUE(시스템이 자동으로 생성), FALSE(사용자가 직접 작성)';
COMMENT ON COLUMN supt.ticket_comments.automation_source 	IS '자동화 소스 - EMAIL(이메일연동), CHATBOT(챗봇), WORKFLOW(워크플로우), API(API호출), ESCALATION(에스컬레이션), SLA_ALERT(SLA알림)';
COMMENT ON COLUMN supt.ticket_comments.status 				IS '댓글 상태 - ACTIVE(활성), HIDDEN(숨김), DELETED(삭제) 댓글 표시 상태';
COMMENT ON COLUMN supt.ticket_comments.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 티켓별 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__ticket_id
    ON supt.ticket_comments (ticket_id, created_at DESC)
 WHERE deleted = FALSE;

-- 사용자별 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__user_id
    ON supt.ticket_comments (user_id, created_at DESC)
 WHERE user_id IS NOT NULL AND deleted = FALSE;

-- 댓글 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__comment_type
    ON supt.ticket_comments (comment_type, created_at DESC)
 WHERE deleted = FALSE;

-- 내부/공개 댓글 구분 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__is_internal
    ON supt.ticket_comments (is_internal, ticket_id, created_at DESC)
 WHERE deleted = FALSE;

-- 시간 기준 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__created_at
    ON supt.ticket_comments (created_at DESC);

-- 자동 생성 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__automated
    ON supt.ticket_comments (automated, automation_source, created_at DESC)
 WHERE automated = TRUE AND deleted = FALSE;

-- 고객 공개 댓글 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__public_comments
    ON supt.ticket_comments (ticket_id, is_internal, created_at DESC)
 WHERE is_internal = FALSE AND deleted = FALSE;

-- 내부 노트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__internal_notes
    ON supt.ticket_comments (ticket_id, is_internal, created_at DESC)
 WHERE is_internal = TRUE AND deleted = FALSE;

-- 상태 변경 이력 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__status_changes
    ON supt.ticket_comments (comment_type, ticket_id, created_at DESC)
 WHERE comment_type = 'STATUS_CHANGE' AND deleted = FALSE;

-- 첨부파일 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_ticket_comments__files
    ON supt.ticket_comments USING GIN (files)
 WHERE deleted = FALSE;

-- 티켓별 대화 이력 조회 최적화
CREATE INDEX IF NOT EXISTS ix_ticket_comments__ticket_conversation
    ON supt.ticket_comments (ticket_id, comment_type, is_internal, created_at)
 WHERE deleted = FALSE;
