-- ============================================================================
-- NOTI Schema - Templates Table
-- ============================================================================
-- Purpose: Manage multi-language notification templates with version control
-- Created: 2024-10-26
-- ============================================================================

CREATE TABLE IF NOT EXISTS noti.templates
(
    -- Basic identifier and audit fields
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                  UUID,
    updated_at                  TIMESTAMP WITH TIME ZONE,
    updated_by                  UUID,

    -- Template basic information
    template_code               VARCHAR(100)             UNIQUE NOT NULL,
    template_name               VARCHAR(200)             NOT NULL,
    description                 TEXT,

    -- Template classification information
    category                    VARCHAR(50)              NOT NULL,
    notify_type                 VARCHAR(50)              NOT NULL,

    -- Multi-channel template content
    email_subject               VARCHAR(500),
    email_body                  TEXT,
    sms_message                 VARCHAR(1000),
    push_title                  VARCHAR(200),
    push_body                   VARCHAR(500),
    in_app_title                VARCHAR(200),
    in_app_message              TEXT,

    -- Template metadata
    template_variables          JSONB                    NOT NULL DEFAULT '{}',

    -- Multi-language support
    locale                      VARCHAR(10)              NOT NULL DEFAULT 'ko-KR',

    -- Version management
    version                     VARCHAR(20)              NOT NULL DEFAULT '1.0',
    previous_version_id         UUID,

    -- Test support
    test_data                   JSONB                    NOT NULL DEFAULT '{}',

    -- Status management
    status                      VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',

    -- Logical deletion flag
    deleted                     BOOLEAN                  NOT NULL DEFAULT FALSE,

    -- Constraints
    CONSTRAINT fk_templates__previous_version_id
        FOREIGN KEY (previous_version_id) REFERENCES noti.templates(id),

    CONSTRAINT ck_templates__category
        CHECK (category IN ('SYSTEM', 'BILLING', 'SECURITY', 'MARKETING', 'SUPPORT', 'MAINTENANCE', 'USER_ACCOUNT')),
    CONSTRAINT ck_templates__notify_type
        CHECK (notify_type IN ('SYSTEM_ALERT', 'BILLING_NOTICE', 'FEATURE_UPDATE', 'MAINTENANCE', 'SECURITY_ALERT', 'USER_NOTIFICATION', 'ADMIN_ALERT')),
    CONSTRAINT ck_templates__status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_templates__sms_length
        CHECK (sms_message IS NULL OR length(sms_message) <= 1000),
    CONSTRAINT ck_templates__push_title_length
        CHECK (push_title IS NULL OR length(push_title) <= 200),
    CONSTRAINT ck_templates__push_body_length
        CHECK (push_body IS NULL OR length(push_body) <= 500),
    CONSTRAINT ck_templates__has_content
        CHECK (
            email_subject   IS NOT NULL OR
            email_body      IS NOT NULL OR
            sms_message     IS NOT NULL OR
            push_title      IS NOT NULL OR
            push_body       IS NOT NULL OR
            in_app_title    IS NOT NULL OR
            in_app_message  IS NOT NULL
        )
);

-- Table comment
COMMENT ON TABLE  noti.templates
IS '알림 템플릿 - 각종 알림의 다국어 템플릿 및 버전 관리';

-- Column comments
COMMENT ON COLUMN noti.templates.id
IS '알림 템플릿 고유 식별자 (UUID)';
COMMENT ON COLUMN noti.templates.created_at
IS '템플릿 생성 일시';
COMMENT ON COLUMN noti.templates.created_by
IS '템플릿 생성자 UUID (개발자 또는 관리자)';
COMMENT ON COLUMN noti.templates.updated_at
IS '템플릿 수정 일시';
COMMENT ON COLUMN noti.templates.updated_by
IS '템플릿 수정자 UUID';
COMMENT ON COLUMN noti.templates.template_code
IS '템플릿 식별 코드 - 애플리케이션에서 템플릿을 참조하는 고유 키';
COMMENT ON COLUMN noti.templates.template_name
IS '템플릿 이름 - 관리자가 식별하기 위한 친숙한 이름';
COMMENT ON COLUMN noti.templates.description
IS '템플릿 설명 - 템플릿의 용도와 사용 목적에 대한 설명';
COMMENT ON COLUMN noti.templates.category
IS '템플릿 카테고리 - 시스템, 청구, 보안, 마케팅, 지원 등으로 분류';
COMMENT ON COLUMN noti.templates.notify_type
IS '알림 유형 - 시스템 경고, 청구 안내, 기능 업데이트 등 구체적인 알림 타입';
COMMENT ON COLUMN noti.templates.email_subject
IS '이메일 제목 템플릿 - 이메일 발송 시 사용할 제목 템플릿';
COMMENT ON COLUMN noti.templates.email_body
IS '이메일 본문 템플릿 (HTML) - 이메일 발송 시 사용할 HTML 본문';
COMMENT ON COLUMN noti.templates.sms_message
IS 'SMS 메시지 템플릿 - SMS 발송 시 사용할 메시지 (최대 1000자)';
COMMENT ON COLUMN noti.templates.push_title
IS '푸시 알림 제목 템플릿 - 푸시 알림 발송 시 사용할 제목';
COMMENT ON COLUMN noti.templates.push_body
IS '푸시 알림 본문 템플릿 - 푸시 알림 발송 시 사용할 본문';
COMMENT ON COLUMN noti.templates.in_app_title
IS '앱 내 알림 제목 템플릿 - 앱 내 알림 표시 시 사용할 제목';
COMMENT ON COLUMN noti.templates.in_app_message
IS '앱 내 알림 메시지 템플릿 - 앱 내 알림 표시 시 사용할 메시지';
COMMENT ON COLUMN noti.templates.template_variables
IS '템플릿에서 사용 가능한 변수 정의 - JSON 형태로 치환 가능한 변수 목록';
COMMENT ON COLUMN noti.templates.locale
IS '언어 로케일 - 템플릿이 작성된 언어 (ko-KR, en-US 등)';
COMMENT ON COLUMN noti.templates.version
IS '템플릿 버전 - 템플릿의 버전 관리를 위한 버전 번호';
COMMENT ON COLUMN noti.templates.previous_version_id
IS '이전 버전 템플릿 ID - 버전 히스토리 추적을 위한 이전 버전 참조';
COMMENT ON COLUMN noti.templates.test_data
IS '테스트용 샘플 데이터 - 템플릿 테스트 시 사용할 변수 값들';
COMMENT ON COLUMN noti.templates.status
IS '템플릿 상태 - 초안, 활성, 보관 중 하나';
COMMENT ON COLUMN noti.templates.deleted
IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- ============================================================================
-- Indexes for noti.templates
-- Purpose: Optimize template queries and management
-- ============================================================================

-- Index for active template lookup (most frequent query pattern)
CREATE INDEX IF NOT EXISTS ix_templates__active_lookup
    ON noti.templates (template_code, status, locale)
 WHERE deleted = FALSE
   AND status = 'ACTIVE';

-- Index for category-based template management
CREATE INDEX IF NOT EXISTS ix_templates__category_management
    ON noti.templates (category, notify_type, status)
 WHERE deleted = FALSE;

-- Index for notification type-based queries
CREATE INDEX IF NOT EXISTS ix_templates__notification_type
    ON noti.templates (notify_type, locale, status)
 WHERE deleted = FALSE;

-- Index for locale management (multi-language support)
CREATE INDEX IF NOT EXISTS ix_templates__locale_management
    ON noti.templates (locale, category, status)
 WHERE deleted = FALSE;

-- Index for version history tracking
CREATE INDEX IF NOT EXISTS ix_templates__version_history
    ON noti.templates (template_code, version, created_at DESC)
 WHERE deleted = FALSE;

-- Index for template status management
CREATE INDEX IF NOT EXISTS ix_templates__status_management
    ON noti.templates (status, updated_at DESC)
 WHERE deleted = FALSE;

-- Index for template name search
CREATE INDEX IF NOT EXISTS ix_templates__template_name
    ON noti.templates (template_name)
 WHERE deleted = FALSE;

-- Index for creation date-based queries
CREATE INDEX IF NOT EXISTS ix_templates__created_at
    ON noti.templates (created_at DESC)
 WHERE deleted = FALSE;

-- Index for creator-based template management
CREATE INDEX IF NOT EXISTS ix_templates__creator_management
    ON noti.templates (created_by, created_at DESC)
 WHERE deleted = FALSE;

-- Index for previous version tracking
CREATE INDEX IF NOT EXISTS ix_templates__previous_version_tracking
    ON noti.templates (previous_version_id)
 WHERE deleted = FALSE
   AND previous_version_id IS NOT NULL;

-- Index for draft template management
CREATE INDEX IF NOT EXISTS ix_templates__draft_management
    ON noti.templates (status, created_at DESC, created_by)
 WHERE deleted = FALSE
   AND status = 'DRAFT';

-- GIN Index for JSON template variable search
CREATE INDEX IF NOT EXISTS ix_templates__template_variables_gin
    ON noti.templates USING GIN (template_variables)
 WHERE deleted = FALSE
   AND template_variables != '{}';

-- GIN Index for test data search
CREATE INDEX IF NOT EXISTS ix_templates__test_data_gin
    ON noti.templates USING GIN (test_data)
 WHERE deleted = FALSE
   AND test_data != '{}';

-- Index for specific locale active template queries
CREATE INDEX IF NOT EXISTS ix_templates__active_by_locale_type
    ON noti.templates (locale, notify_type, template_code)
 WHERE deleted = FALSE
   AND status = 'ACTIVE';

-- ============================================================================
-- End of Templates Table
-- ============================================================================
