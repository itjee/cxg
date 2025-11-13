-- =====================================================================================
-- 테이블: asm.faqs
-- 설명: 자주 묻는 질문(FAQ) 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS asm.faqs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- FAQ 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- FAQ 분류
    category                VARCHAR(50),                                                     -- 카테고리
    sub_category            VARCHAR(50),                                                     -- 하위 카테고리
    tags                    VARCHAR(200),                                                    -- 태그 (쉼표 구분)
    
    -- FAQ 내용
    question                TEXT                     NOT NULL,                               -- 질문
    question_en             TEXT,                                                            -- 질문 (영문)
    answer                  TEXT                     NOT NULL,                               -- 답변
    answer_en               TEXT,                                                            -- 답변 (영문)
    answer_summary          VARCHAR(500),                                                    -- 답변 요약
    
    -- 추가 리소스
    related_articles        JSONB,                                                           -- 관련 문서 (JSON 배열)
    video_url               VARCHAR(500),                                                    -- 동영상 URL
    
    -- 정렬 및 통계
    display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서
    view_count              INTEGER                  DEFAULT 0,                              -- 조회수
    helpful_count           INTEGER                  DEFAULT 0,                              -- 도움됨 카운트
    not_helpful_count       INTEGER                  DEFAULT 0,                              -- 도움안됨 카운트
    
    -- 상태 관리
    is_published            BOOLEAN                  DEFAULT true,                           -- 공개 여부
    is_featured             BOOLEAN                  DEFAULT false,                          -- 추천 FAQ 여부
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 정렬 순서 양수 체크
    CONSTRAINT ck_faqs__display_order           CHECK (display_order >= 0),
    
    -- 조회수 양수 체크
    CONSTRAINT ck_faqs__view_count              CHECK (view_count >= 0),
    
    -- 도움됨 카운트 양수 체크
    CONSTRAINT ck_faqs__helpful_count           CHECK (helpful_count >= 0),
    
    -- 도움안됨 카운트 양수 체크
    CONSTRAINT ck_faqs__not_helpful_count       CHECK (not_helpful_count >= 0)
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  asm.faqs                          IS '자주 묻는 질문(FAQ) 관리 테이블';
COMMENT ON COLUMN asm.faqs.id                       IS 'FAQ 고유 식별자 (UUID)';
COMMENT ON COLUMN asm.faqs.created_at               IS '등록 일시';
COMMENT ON COLUMN asm.faqs.created_by               IS '등록자 UUID';
COMMENT ON COLUMN asm.faqs.updated_at               IS '수정 일시';
COMMENT ON COLUMN asm.faqs.updated_by               IS '수정자 UUID';
COMMENT ON COLUMN asm.faqs.category                 IS '카테고리 (제품/기술지원/정책/기타)';
COMMENT ON COLUMN asm.faqs.sub_category             IS '하위 카테고리';
COMMENT ON COLUMN asm.faqs.tags                     IS '태그 (쉼표로 구분)';
COMMENT ON COLUMN asm.faqs.question                 IS '질문';
COMMENT ON COLUMN asm.faqs.question_en              IS '질문 (영문)';
COMMENT ON COLUMN asm.faqs.answer                   IS '답변';
COMMENT ON COLUMN asm.faqs.answer_en                IS '답변 (영문)';
COMMENT ON COLUMN asm.faqs.answer_summary           IS '답변 요약';
COMMENT ON COLUMN asm.faqs.related_articles         IS '관련 문서 (JSON 배열: [{"title": "...", "url": "..."}])';
COMMENT ON COLUMN asm.faqs.video_url                IS '설명 동영상 URL';
COMMENT ON COLUMN asm.faqs.display_order            IS '정렬 순서';
COMMENT ON COLUMN asm.faqs.view_count               IS '조회수';
COMMENT ON COLUMN asm.faqs.helpful_count            IS '도움됨 카운트';
COMMENT ON COLUMN asm.faqs.not_helpful_count        IS '도움안됨 카운트';
COMMENT ON COLUMN asm.faqs.is_published             IS '공개 여부';
COMMENT ON COLUMN asm.faqs.is_featured              IS '추천 FAQ 여부';
COMMENT ON COLUMN asm.faqs.is_deleted               IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 일반 인덱스
CREATE INDEX ix_faqs__category
    ON asm.faqs (category, sub_category, display_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__category IS '카테고리별 FAQ 조회 인덱스';

CREATE INDEX ix_faqs__view_count
    ON asm.faqs (view_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__view_count IS '조회수 기준 FAQ 정렬 인덱스';

CREATE INDEX ix_faqs__helpful_count
    ON asm.faqs (helpful_count DESC)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__helpful_count IS '도움됨 카운트 기준 FAQ 정렬 인덱스';

CREATE INDEX ix_faqs__is_featured
    ON asm.faqs (is_featured, display_order)
 WHERE is_published = true 
   AND is_deleted = false;
COMMENT ON INDEX asm.ix_faqs__is_featured IS '추천 FAQ 조회 인덱스';

-- CREATE INDEX ix_faqs__question_search
--     ON asm.faqs USING gin(to_tsvector('korean', question))
--  WHERE is_published = true 
--    AND is_deleted = false;
-- COMMENT ON INDEX asm.ix_faqs__question_search IS 'FAQ 질문 전문 검색 인덱스';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- FAQs는 독립적인 컨텐츠이므로 외래키 없음

