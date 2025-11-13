-- ============================================================================
-- Customer Service Management Schema (csm)
-- ============================================================================
-- Description: 고객 서비스 관리 (CRM, 고객관리, 서비스티켓, 문의사항)
-- Database: tnnt_db (Tenant Database)
-- Schema: csm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS csm;

COMMENT ON SCHEMA csm IS 'CSM: 고객 서비스 관리 스키마 (CRM, 서비스티켓)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- CSM: 고객지원 (Customer Service Management)
-- ============================================================================

-- =====================================================================================
-- 테이블: csm.support_tickets
-- 설명: 고객 지원 티켓 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS csm.support_tickets 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 티켓 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    ticket_code             VARCHAR(50)              NOT NULL,                                  -- 티켓 코드
    customer_id             UUID,                                                               -- 고객 식별자
    
    -- 연락처 정보
    contact_name            VARCHAR(100),                                                       -- 연락처 담당자명
    contact_email           VARCHAR(255),                                                       -- 연락처 이메일
    contact_phone           VARCHAR(50),                                                        -- 연락처 전화번호
    
    -- 티켓 정보
    subject                 VARCHAR(255)             NOT NULL,                                  -- 제목
    description             TEXT,                                                               -- 상세 설명
    category                VARCHAR(50),                                                        -- 카테고리
    priority                VARCHAR(20)              DEFAULT 'MEDIUM',                          -- 우선순위
    status                  VARCHAR(20)              DEFAULT 'OPEN',                            -- 상태
    
    -- 처리 정보
    assigned_to             UUID,                                                               -- 담당자 식별자
    resolved_at             TIMESTAMP WITH TIME ZONE,                                           -- 해결 일시
    resolution              TEXT,                                                               -- 해결 내용
    satisfaction_rating     INTEGER,                                                            -- 만족도 평가 (1-5)
    
    -- 상태 관리
    is_deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_support_tickets__priority         CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT ck_support_tickets__status           CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED')),
    CONSTRAINT ck_support_tickets__satisfaction     CHECK (satisfaction_rating IS NULL OR satisfaction_rating BETWEEN 1 AND 5),
    CONSTRAINT ck_support_tickets__email            CHECK (contact_email IS NULL OR contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT ck_support_tickets__phone            CHECK (contact_phone IS NULL OR contact_phone ~ '^[0-9\-\+\(\)\s]{8,20}$')
);

-- =====================================================================================
-- 테이블: csm.ticket_comments
-- 설명: 티켓 댓글 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS csm.ticket_comments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 댓글 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 댓글 정보
    ticket_id               UUID                     NOT NULL,                                  -- 티켓 식별자
    comment_text            TEXT                     NOT NULL,                                  -- 댓글 내용
    is_internal             BOOLEAN                  DEFAULT false,                             -- 내부 메모 여부
    
    -- 상태 관리
    is_deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
);

-- =====================================================================================
-- 테이블: csm.faqs
-- 설명: FAQ 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS csm.faqs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- FAQ 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    tenant_id               UUID                     NOT NULL,                                  -- 테넌트 식별자
    category                VARCHAR(50),                                                        -- 카테고리
    
    -- FAQ 내용
    question                TEXT                     NOT NULL,                                  -- 질문
    answer                  TEXT                     NOT NULL,                                  -- 답변
    
    -- 정렬 및 통계
    sort_order              INTEGER                  DEFAULT 0,                                 -- 정렬 순서
    view_count              INTEGER                  DEFAULT 0,                                 -- 조회수
    
    -- 상태 관리
    is_published            BOOLEAN                  DEFAULT true,                              -- 공개 여부
    is_deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_faqs__sort_order                  CHECK (sort_order >= 0),
    CONSTRAINT ck_faqs__view_count                  CHECK (view_count >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  csm.support_tickets                      IS '고객 지원 티켓 관리 테이블';
COMMENT ON COLUMN csm.support_tickets.id                   IS '티켓 고유 식별자';
COMMENT ON COLUMN csm.support_tickets.created_at           IS '등록 일시';
COMMENT ON COLUMN csm.support_tickets.created_by           IS '등록자 UUID';
COMMENT ON COLUMN csm.support_tickets.updated_at           IS '수정 일시';
COMMENT ON COLUMN csm.support_tickets.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN csm.support_tickets.tenant_id            IS '테넌트 식별자';
COMMENT ON COLUMN csm.support_tickets.company_id           IS '회사 식별자';
COMMENT ON COLUMN csm.support_tickets.ticket_code          IS '티켓 코드';
COMMENT ON COLUMN csm.support_tickets.customer_id          IS '고객 식별자';
COMMENT ON COLUMN csm.support_tickets.contact_name         IS '연락처 담당자명';
COMMENT ON COLUMN csm.support_tickets.contact_email        IS '연락처 이메일';
COMMENT ON COLUMN csm.support_tickets.contact_phone        IS '연락처 전화번호';
COMMENT ON COLUMN csm.support_tickets.subject              IS '제목';
COMMENT ON COLUMN csm.support_tickets.description          IS '상세 설명';
COMMENT ON COLUMN csm.support_tickets.category             IS '카테고리';
COMMENT ON COLUMN csm.support_tickets.priority             IS '우선순위 (LOW/MEDIUM/HIGH/URGENT)';
COMMENT ON COLUMN csm.support_tickets.status               IS '상태 (OPEN/IN_PROGRESS/RESOLVED/CLOSED/CANCELLED)';
COMMENT ON COLUMN csm.support_tickets.assigned_to          IS '담당자 식별자';
COMMENT ON COLUMN csm.support_tickets.resolved_at          IS '해결 일시';
COMMENT ON COLUMN csm.support_tickets.resolution           IS '해결 내용';
COMMENT ON COLUMN csm.support_tickets.satisfaction_rating  IS '만족도 평가 (1-5)';
COMMENT ON COLUMN csm.support_tickets.is_deleted              IS '논리 삭제 플래그';

COMMENT ON TABLE  csm.ticket_comments                      IS '티켓 댓글 관리 테이블';
COMMENT ON COLUMN csm.ticket_comments.id                   IS '댓글 고유 식별자';
COMMENT ON COLUMN csm.ticket_comments.created_at           IS '등록 일시';
COMMENT ON COLUMN csm.ticket_comments.created_by           IS '등록자 UUID';
COMMENT ON COLUMN csm.ticket_comments.updated_at           IS '수정 일시';
COMMENT ON COLUMN csm.ticket_comments.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN csm.ticket_comments.ticket_id            IS '티켓 식별자';
COMMENT ON COLUMN csm.ticket_comments.comment_text         IS '댓글 내용';
COMMENT ON COLUMN csm.ticket_comments.is_internal          IS '내부 메모 여부';
COMMENT ON COLUMN csm.ticket_comments.is_deleted              IS '논리 삭제 플래그';

COMMENT ON TABLE  csm.faqs                                 IS 'FAQ 관리 테이블';
COMMENT ON COLUMN csm.faqs.id                              IS 'FAQ 고유 식별자';
COMMENT ON COLUMN csm.faqs.created_at                      IS '등록 일시';
COMMENT ON COLUMN csm.faqs.created_by                      IS '등록자 UUID';
COMMENT ON COLUMN csm.faqs.updated_at                      IS '수정 일시';
COMMENT ON COLUMN csm.faqs.updated_by                      IS '수정자 UUID';
COMMENT ON COLUMN csm.faqs.tenant_id                       IS '테넌트 식별자';
COMMENT ON COLUMN csm.faqs.category                        IS '카테고리';
COMMENT ON COLUMN csm.faqs.question                        IS '질문';
COMMENT ON COLUMN csm.faqs.answer                          IS '답변';
COMMENT ON COLUMN csm.faqs.sort_order                      IS '정렬 순서';
COMMENT ON COLUMN csm.faqs.view_count                      IS '조회수';
COMMENT ON COLUMN csm.faqs.is_published                    IS '공개 여부';
COMMENT ON COLUMN csm.faqs.is_deleted                         IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 기본 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_support_tickets__tenant_id
    ON csm.support_tickets (tenant_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__company_id
    ON csm.support_tickets (company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__ticket_code
    ON csm.support_tickets (ticket_code)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__customer_id
    ON csm.support_tickets (customer_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__assigned_to
    ON csm.support_tickets (assigned_to)
 WHERE assigned_to IS NOT NULL
   AND is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__status
    ON csm.support_tickets (status, company_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__priority
    ON csm.support_tickets (priority)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__category
    ON csm.support_tickets (category)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_support_tickets__created_at
    ON csm.support_tickets (created_at)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_ticket_comments__ticket_id
    ON csm.ticket_comments (ticket_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_ticket_comments__created_at
    ON csm.ticket_comments (created_at)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_faqs__tenant_id
    ON csm.faqs (tenant_id)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_faqs__category
    ON csm.faqs (category, sort_order)
 WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS ix_faqs__is_published
    ON csm.faqs (is_published)
 WHERE is_deleted = false;

-- =====================================================================================
-- 유니크 제약 조건 (Unique Index)
-- =====================================================================================

-- 회사별 티켓 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_support_tickets__company_code
    ON csm.support_tickets (company_id, ticket_code)
 WHERE is_deleted = false;

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

ALTER TABLE csm.ticket_comments ADD CONSTRAINT fk_ticket_comments__ticket_id
    FOREIGN KEY (ticket_id) REFERENCES csm.support_tickets(id) ON DELETE CASCADE;
