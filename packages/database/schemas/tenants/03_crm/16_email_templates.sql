-- =====================================================================================
-- 테이블: crm.email_templates
-- 설명: 이메일 템플릿 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.email_templates 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 템플릿 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 템플릿 기본 정보
    template_code           VARCHAR(50)              NOT NULL,                               -- 템플릿 코드
    template_name           VARCHAR(200)             NOT NULL,                               -- 템플릿명
    template_type           VARCHAR(20)              NOT NULL,                               -- 템플릿 유형
    description             TEXT,                                                            -- 설명
    
    -- 카테고리 및 유형
    category                VARCHAR(50),                                                     -- 카테고리    
    
    -- 이메일 내용
    subject                 VARCHAR(500)             NOT NULL,                               -- 제목
    body_html               TEXT                     NOT NULL,                               -- 본문 (HTML)
    body_text               TEXT,                                                            -- 본문 (텍스트)
    
    -- 변수 정의
    variables               JSONB,                                                           -- 변수 목록 (JSON)
    
    -- 발신자 정보
    from_name               VARCHAR(100),                                                    -- 발신자명
    from_email              VARCHAR(100),                                                    -- 발신자 이메일
    reply_to                VARCHAR(100),                                                    -- 답장 주소
    
    -- 첨부파일
    default_attachments     JSONB,                                                           -- 기본 첨부파일 (JSON)
    
    -- 사용 통계
    usage_count             INTEGER                  DEFAULT 0,                              -- 사용 횟수
    last_used_at            TIMESTAMP WITH TIME ZONE,                                        -- 마지막 사용 일시
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 템플릿 코드 형식 체크
    CONSTRAINT ck_email_templates__code             CHECK (template_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 템플릿 유형 체크 (WELCOME: 환영, FOLLOW_UP: 후속, CAMPAIGN: 캠페인, QUOTE: 견적, ORDER: 주문, SURVEY: 설문)
    CONSTRAINT ck_email_templates__type             CHECK (template_type IN ('WELCOME', 'FOLLOW_UP', 'CAMPAIGN', 'QUOTE', 'ORDER', 'INVOICE', 'SURVEY', 'NOTIFICATION', 'CUSTOM')),
    
    -- 상태 체크 (DRAFT: 임시, ACTIVE: 활성, ARCHIVED: 보관)
    CONSTRAINT ck_email_templates__status           CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
    
    -- 이메일 형식 체크
    CONSTRAINT ck_email_templates__from_email       CHECK (from_email IS NULL OR from_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 사용 횟수 음수 불가 체크
    CONSTRAINT ck_email_templates__usage_count      CHECK (usage_count >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.email_templates                    IS '이메일 템플릿 관리 테이블';
COMMENT ON COLUMN crm.email_templates.id                 IS '템플릿 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.email_templates.created_at         IS '등록 일시';
COMMENT ON COLUMN crm.email_templates.created_by         IS '등록자 UUID';
COMMENT ON COLUMN crm.email_templates.updated_at         IS '수정 일시';
COMMENT ON COLUMN crm.email_templates.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN crm.email_templates.template_code      IS '템플릿 코드 (고유번호)';
COMMENT ON COLUMN crm.email_templates.template_name      IS '템플릿명';
COMMENT ON COLUMN crm.email_templates.template_type      IS '템플릿 유형 (WELCOME/FOLLOW_UP/CAMPAIGN/QUOTE/ORDER/INVOICE/SURVEY/NOTIFICATION/CUSTOM)';
COMMENT ON COLUMN crm.email_templates.description        IS '설명';
COMMENT ON COLUMN crm.email_templates.category           IS '카테고리 (영업, 마케팅, 고객지원 등)';
COMMENT ON COLUMN crm.email_templates.subject            IS '이메일 제목 (변수 사용 가능: {{customer_name}})';
COMMENT ON COLUMN crm.email_templates.body_html          IS '본문 HTML (변수 사용 가능)';
COMMENT ON COLUMN crm.email_templates.body_text          IS '본문 텍스트 (HTML 미지원 클라이언트용)';
COMMENT ON COLUMN crm.email_templates.variables          IS '사용 가능한 변수 목록 (JSON, 예: ["customer_name", "order_number"])';
COMMENT ON COLUMN crm.email_templates.from_name          IS '발신자명';
COMMENT ON COLUMN crm.email_templates.from_email         IS '발신자 이메일';
COMMENT ON COLUMN crm.email_templates.reply_to           IS '답장 주소';
COMMENT ON COLUMN crm.email_templates.default_attachments IS '기본 첨부파일 정보 (JSON)';
COMMENT ON COLUMN crm.email_templates.usage_count        IS '사용 횟수';
COMMENT ON COLUMN crm.email_templates.last_used_at       IS '마지막 사용 일시';
COMMENT ON COLUMN crm.email_templates.status             IS '상태 (DRAFT/ACTIVE/ARCHIVED)';
COMMENT ON COLUMN crm.email_templates.is_deleted         IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.email_templates.notes              IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_email_templates__code 
    ON crm.email_templates (template_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_email_templates__code IS '템플릿 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_email_templates__name 
    ON crm.email_templates (template_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_email_templates__name IS '템플릿명별 조회 인덱스';

CREATE INDEX ix_email_templates__category 
    ON crm.email_templates (category)
 WHERE category IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_email_templates__category IS '카테고리별 조회 인덱스';

CREATE INDEX ix_email_templates__type 
    ON crm.email_templates (template_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_email_templates__type IS '템플릿 유형별 조회 인덱스';

CREATE INDEX ix_email_templates__status 
    ON crm.email_templates (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_email_templates__status IS '상태별 조회 인덱스';

CREATE INDEX ix_email_templates__usage_count 
    ON crm.email_templates (usage_count DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_email_templates__usage_count IS '사용 횟수별 조회 인덱스';

-- =====================================================================================
-- 완료: crm.email_templates 테이블 정의
-- =====================================================================================
