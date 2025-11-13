CREATE TABLE IF NOT EXISTS asm.ticket_comments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 댓글 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 티켓 참조
    ticket_id               UUID                     NOT NULL,                                           -- 티켓 식별자
    
    -- 댓글 내용
    comment_text            TEXT                     NOT NULL,                                           -- 댓글 내용
    comment_type            VARCHAR(20)              DEFAULT 'COMMENT',                                  -- 댓글 유형 (COMMENT/STATUS_CHANGE/ASSIGNMENT) -- 추가
    
    -- 댓글 속성
    is_internal             BOOLEAN                  DEFAULT false,                                      -- 내부 메모 여부 (true: 내부용, false: 고객 공개)
    
    -- 첨부파일
    attachments             JSONB,                                                                       -- 첨부파일 정보 (JSON 배열) -- 추가
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 댓글 유형 체크 (COMMENT: 일반댓글, STATUS_CHANGE: 상태변경, ASSIGNMENT: 담당자배정)
    CONSTRAINT ck_ticket_comments__comment_type     CHECK (comment_type IN ('COMMENT', 'STATUS_CHANGE', 'ASSIGNMENT'))
);

COMMENT ON TABLE  asm.ticket_comments                            IS '지원 티켓의 댓글 및 처리 이력 관리 테이블';
COMMENT ON COLUMN asm.ticket_comments.id                         IS '댓글 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.ticket_comments.created_at                 IS '등록 일시';
COMMENT ON COLUMN asm.ticket_comments.created_by                 IS '등록자 UUID';
COMMENT ON COLUMN asm.ticket_comments.updated_at                 IS '수정 일시';
COMMENT ON COLUMN asm.ticket_comments.updated_by                 IS '수정자 UUID';
COMMENT ON COLUMN asm.ticket_comments.ticket_id                  IS '티켓 식별자';
COMMENT ON COLUMN asm.ticket_comments.comment_text               IS '댓글 내용';
COMMENT ON COLUMN asm.ticket_comments.comment_type               IS '댓글 유형 (COMMENT: 일반댓글/STATUS_CHANGE: 상태변경/ASSIGNMENT: 담당자배정)';
COMMENT ON COLUMN asm.ticket_comments.is_internal                IS '내부 메모 여부 (true: 내부용, false: 고객 공개)';
COMMENT ON COLUMN asm.ticket_comments.attachments                IS '첨부파일 정보 (JSON 배열 형식: [{"name": "file.pdf", "url": "..."}])';
COMMENT ON COLUMN asm.ticket_comments.is_deleted                 IS '논리 삭제 플래그';

-- =====================================================================================
-- 테이블: asm.faqs
-- 설명: 자주 묻는 질문(FAQ) 정보를 관리하는 테이블
-- 작성일: 2025-01-20
-- =====================================================================================
