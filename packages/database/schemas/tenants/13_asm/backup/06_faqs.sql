CREATE TABLE IF NOT EXISTS asm.faqs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- FAQ 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- FAQ 분류
    category                VARCHAR(50),                                                                 -- 카테고리 (제품/기술지원/정책/기타)
    sub_category            VARCHAR(50),                                                                 -- 하위 카테고리 -- 추가
    tags                    VARCHAR(200),                                                                -- 태그 (쉼표 구분) -- 추가
    
    -- FAQ 내용
    question                TEXT                     NOT NULL,                                           -- 질문
    answer                  TEXT                     NOT NULL,                                           -- 답변
    answer_summary          VARCHAR(500),                                                                -- 답변 요약 -- 추가
    
    -- 정렬 및 통계
    sort_order              INTEGER                  DEFAULT 0,                                          -- 정렬 순서
    view_count              INTEGER                  DEFAULT 0,                                          -- 조회수
    helpful_count           INTEGER                  DEFAULT 0,                                          -- 도움됨 카운트 -- 추가
    not_helpful_count       INTEGER                  DEFAULT 0,                                          -- 도움안됨 카운트 -- 추가
    
    -- 링크 정보
    related_articles        JSONB,                                                                       -- 관련 문서 (JSON 배열) -- 추가
    video_url               VARCHAR(500),                                                                -- 동영상 URL -- 추가
    
    -- 상태 관리
    is_published            BOOLEAN                  DEFAULT true,                                       -- 공개 여부
    is_featured             BOOLEAN                  DEFAULT false,                                      -- 추천 FAQ 여부 -- 추가
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 정렬 순서 양수 체크
    CONSTRAINT ck_faqs__sort_order              CHECK (sort_order >= 0),
    -- 조회수 양수 체크
    CONSTRAINT ck_faqs__view_count              CHECK (view_count >= 0),
    -- 도움됨 카운트 양수 체크
    CONSTRAINT ck_faqs__helpful_count           CHECK (helpful_count >= 0),
    -- 도움안됨 카운트 양수 체크
    CONSTRAINT ck_faqs__not_helpful_count       CHECK (not_helpful_count >= 0)
);

COMMENT ON TABLE  asm.faqs                                       IS '자주 묻는 질문(FAQ) 정보 관리 테이블';
COMMENT ON COLUMN asm.faqs.id                                    IS 'FAQ 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.faqs.created_at                            IS '등록 일시';
COMMENT ON COLUMN asm.faqs.created_by                            IS '등록자 UUID';
COMMENT ON COLUMN asm.faqs.updated_at                            IS '수정 일시';
COMMENT ON COLUMN asm.faqs.updated_by                            IS '수정자 UUID';
COMMENT ON COLUMN asm.faqs.category                              IS '카테고리 (제품/기술지원/정책/기타)';
COMMENT ON COLUMN asm.faqs.sub_category                          IS '하위 카테고리';
COMMENT ON COLUMN asm.faqs.tags                                  IS '태그 (쉼표로 구분)';
COMMENT ON COLUMN asm.faqs.question                              IS '질문';
COMMENT ON COLUMN asm.faqs.answer                                IS '답변';
COMMENT ON COLUMN asm.faqs.answer_summary                        IS '답변 요약';
COMMENT ON COLUMN asm.faqs.sort_order                            IS '정렬 순서';
COMMENT ON COLUMN asm.faqs.view_count                            IS '조회수';
COMMENT ON COLUMN asm.faqs.helpful_count                         IS '도움됨 카운트';
COMMENT ON COLUMN asm.faqs.not_helpful_count                     IS '도움안됨 카운트';
COMMENT ON COLUMN asm.faqs.related_articles                      IS '관련 문서 (JSON 배열 형식: [{"title": "...", "url": "..."}])';
COMMENT ON COLUMN asm.faqs.video_url                             IS '설명 동영상 URL';
COMMENT ON COLUMN asm.faqs.is_published                          IS '공개 여부';
COMMENT ON COLUMN asm.faqs.is_featured                           IS '추천 FAQ 여부';
COMMENT ON COLUMN asm.faqs.is_deleted                            IS '논리 삭제 플래그';

-- =====================================================================================
-- 고객 지원 인덱스
-- =====================================================================================

-- support_tickets 인덱스
CREATE INDEX IF NOT EXISTS ix_support_tickets__ticket_code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__ticket_code IS '티켓 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__customer_id
    ON asm.support_tickets (customer_id, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__customer_id IS '고객별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__status
    ON asm.support_tickets (status, priority, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__status IS '상태 및 우선순위별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__assigned_to
    ON asm.support_tickets (assigned_to, status)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__assigned_to IS '담당자 및 상태별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__category
    ON asm.support_tickets (category, sub_category)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__category IS '카테고리 및 하위카테고리별 지원 티켓 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__created_at
    ON asm.support_tickets (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__created_at IS '등록일시 조회 인덱스 (최신순)';

CREATE INDEX IF NOT EXISTS ix_support_tickets__linked_service_request_id
    ON asm.support_tickets (linked_service_request_id)
 WHERE linked_service_request_id IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__linked_service_request_id IS 'A/S 요청 연계 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__contact_email
    ON asm.support_tickets (contact_email)
 WHERE contact_email IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__contact_email IS '문의자 이메일별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_support_tickets__resolved_at
    ON asm.support_tickets (resolved_at DESC)
 WHERE resolved_at IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_support_tickets__resolved_at IS '해결일시 조회 인덱스';

-- ticket_comments 인덱스
CREATE INDEX IF NOT EXISTS ix_ticket_comments__ticket_id
    ON asm.ticket_comments (ticket_id, created_at ASC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_ticket_comments__ticket_id IS '티켓별 댓글 조회 인덱스 (시간순)';

CREATE INDEX IF NOT EXISTS ix_ticket_comments__created_by
    ON asm.ticket_comments (created_by, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_ticket_comments__created_by IS '작성자별 댓글 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_ticket_comments__comment_type
    ON asm.ticket_comments (comment_type, ticket_id)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ix_ticket_comments__comment_type IS '댓글 유형별 조회 인덱스';

-- faqs 인덱스
CREATE INDEX IF NOT EXISTS ix_faqs__category
    ON asm.faqs (category, sub_category, sort_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__category IS '카테고리 및 하위카테고리별 FAQ 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_faqs__view_count
    ON asm.faqs (view_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__view_count IS '조회수 기준 FAQ 정렬 인덱스';

CREATE INDEX IF NOT EXISTS ix_faqs__helpful_count
    ON asm.faqs (helpful_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__helpful_count IS '도움됨 카운트 기준 FAQ 정렬 인덱스';

CREATE INDEX IF NOT EXISTS ix_faqs__is_featured
    ON asm.faqs (is_featured, sort_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__is_featured IS '추천 FAQ 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_faqs__question_text
    ON asm.faqs USING gin(to_tsvector('korean', question))
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__question_text IS 'FAQ 질문 전문 검색 인덱스';

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- A/S 요청 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_service_requests__code
    ON asm.service_requests (sr_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ux_service_requests__code IS 'A/S 요청 코드 유니크 제약 (삭제되지 않은 데이터만)';

-- 지원 티켓 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_support_tickets__code
    ON asm.support_tickets (ticket_code)
 WHERE is_deleted = false;
COMMENT ON INDEX asm.ux_support_tickets__code IS '지원 티켓 코드 유니크 제약';

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

-- service_works 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 작업 내역도 함께 삭제)
ALTER TABLE asm.service_works ADD CONSTRAINT fk_service_works__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_service_works__service_request_id ON asm.service_works IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- service_parts 테이블 외래키
-- A/S 요청 참조 외래키 (A/S 요청 삭제 시 부품 내역도 함께 삭제)
ALTER TABLE asm.service_parts ADD CONSTRAINT fk_service_parts__service_request_id
    FOREIGN KEY (service_request_id) REFERENCES asm.service_requests(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_service_parts__service_request_id ON asm.service_parts IS 'A/S 요청 참조 외래키 (CASCADE 삭제)';

-- ticket_comments 테이블 외래키
-- 지원 티켓 참조 외래키 (티켓 삭제 시 댓글도 함께 삭제)
ALTER TABLE asm.ticket_comments ADD CONSTRAINT fk_ticket_comments__ticket_id
    FOREIGN KEY (ticket_id) REFERENCES asm.support_tickets(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_ticket_comments__ticket_id ON asm.ticket_comments IS '지원 티켓 참조 외래키 (CASCADE 삭제)';

-- support_tickets 테이블 외래키
-- A/S 요청 연계 외래키 (A/S 요청 삭제 시 연계 정보만 NULL로 설정)
ALTER TABLE asm.support_tickets ADD CONSTRAINT fk_support_tickets__linked_service_request_id
    FOREIGN KEY (linked_service_request_id) REFERENCES asm.service_requests(id) ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_support_tickets__linked_service_request_id ON asm.support_tickets IS 'A/S 요청 연계 외래키 (SET NULL)';
