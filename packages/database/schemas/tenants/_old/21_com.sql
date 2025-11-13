-- ============================================================================
-- Communication Schema (com)
-- ============================================================================
-- Description: 커뮤니케이션/지원 스키마 (공통코드, 워크플로우, 첨부파일, 캘린더)
-- Database: tnnt_db (Tenant Database)
-- Schema: com
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS com;

COMMENT ON SCHEMA com IS 'COM: 커뮤니케이션/지원 스키마 (공통코드, 워크플로우, 첨부파일, 캘린더)';

-- =====================================================================================
-- 테이블: com.code_groups
-- 설명: 공통 코드 그룹을 관리하는 테이블 (코드의 카테고리별 분류)
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.code_groups 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 그룹 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 그룹 기본 정보
    group_code              VARCHAR(50)              NOT NULL,                                           -- 그룹 코드 (테넌트 내 유니크)
    group_name              VARCHAR(100)             NOT NULL,                                           -- 그룹명
    group_name_en           VARCHAR(100),                                                                -- 그룹 영문명 -- 추가
    description             TEXT,                                                                        -- 그룹 설명
    
    -- 그룹 속성
    is_system_group         BOOLEAN                  DEFAULT false,                                      -- 시스템 기본 그룹 여부 (삭제 불가)
    display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서 -- 추가
    icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 -- 추가
    color_code              VARCHAR(7),                                                                  -- 색상 코드 -- 추가
    
    -- 추가 정보
    notes                   TEXT,                                                                        -- 비고 -- 추가
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 표시 순서 양수 체크
    CONSTRAINT ck_com_code_groups__display_order    CHECK (display_order >= 0),
    -- 색상 코드 형식 체크 (#RRGGBB)
    CONSTRAINT ck_com_code_groups__color_code       CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE  com.code_groups                   IS '공통 코드 그룹 관리 테이블 (코드의 카테고리별 분류)';
COMMENT ON COLUMN com.code_groups.id                IS '코드 그룹 고유 식별자 (UUID)';
COMMENT ON COLUMN com.code_groups.created_at        IS '등록 일시';
COMMENT ON COLUMN com.code_groups.created_by        IS '등록자 UUID';
COMMENT ON COLUMN com.code_groups.updated_at        IS '수정 일시';
COMMENT ON COLUMN com.code_groups.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN com.code_groups.group_code        IS '그룹 코드 (예: CURRENCY, PAYMENT_TERMS, STATUS)';
COMMENT ON COLUMN com.code_groups.group_name        IS '그룹명';
COMMENT ON COLUMN com.code_groups.group_name_en     IS '그룹 영문명';
COMMENT ON COLUMN com.code_groups.description       IS '그룹 설명';
COMMENT ON COLUMN com.code_groups.is_system_group   IS '시스템 기본 그룹 여부 (true: 시스템 필수 그룹/삭제 불가, false: 사용자 정의 그룹)';
COMMENT ON COLUMN com.code_groups.display_order     IS '표시 순서';
COMMENT ON COLUMN com.code_groups.icon_name         IS '아이콘 이름';
COMMENT ON COLUMN com.code_groups.color_code        IS '색상 코드 (#RRGGBB 형식)';
COMMENT ON COLUMN com.code_groups.notes             IS '비고';
COMMENT ON COLUMN com.code_groups.is_active         IS '활성 상태';
COMMENT ON COLUMN com.code_groups.is_deleted        IS '논리 삭제 플래그';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_com_code_groups__group_code
    ON com.code_groups (group_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_code_groups__group_code IS '코드 그룹 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_code_groups__is_active
    ON com.code_groups (is_active, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_code_groups__is_active IS '활성 상태 및 표시 순서별 조회 인덱스';

-- 유니크 제약 조건
CREATE UNIQUE INDEX IF NOT EXISTS ux_com_code_groups__code
    ON com.code_groups (group_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_com_code_groups__code IS '코드 그룹 코드 유니크 제약';

-- =====================================================================================
-- 테이블: com.codes
-- 설명: 시스템에서 사용하는 모든 공통 코드를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.codes 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 코드 그룹 참조
    group_id                UUID                     NOT NULL,                                           -- 코드 그룹 식별자
    
    -- 코드 기본 정보
    code                    VARCHAR(50)              NOT NULL,                                           -- 코드값
    name                    VARCHAR(100)             NOT NULL,                                           -- 코드명
    name_en                 VARCHAR(100),                                                                -- 코드 영문명 -- 추가
    description             TEXT,                                                                        -- 코드 설명
    
    -- 코드 속성
    sort_order              INTEGER                  DEFAULT 0,                                          -- 정렬 순서
    parent_code_id          UUID,                                                                        -- 상위 코드 식별자 (계층 구조용) -- 추가
    level_depth             INTEGER                  DEFAULT 1,                                          -- 계층 깊이 -- 추가
    
    -- 추가 속성
    additional_value1       VARCHAR(100),                                                                -- 추가 값 1 -- 추가
    additional_value2       VARCHAR(100),                                                                -- 추가 값 2 -- 추가
    additional_value3       VARCHAR(100),                                                                -- 추가 값 3 -- 추가
    attributes              JSONB,                                                                       -- 추가 속성 (JSON) -- 추가
    
    -- 표시 정보
    icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 -- 추가
    color_code              VARCHAR(7),                                                                  -- 색상 코드 -- 추가
    
    -- 추가 정보
    notes                   TEXT,                                                                        -- 비고 -- 추가
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 정렬 순서 양수 체크
    CONSTRAINT ck_com_codes__sort_order             CHECK (sort_order >= 0),
    -- 계층 깊이 범위 체크
    CONSTRAINT ck_com_codes__level_depth            CHECK (level_depth BETWEEN 1 AND 10),
    -- 자기 참조 방지
    CONSTRAINT ck_com_codes__parent_not_self        CHECK (parent_code_id != id),
    -- 색상 코드 형식 체크
    CONSTRAINT ck_com_codes__color_code             CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE  com.codes                         IS '시스템 공통 코드 관리 테이블 (드롭다운, 선택 옵션 등에 사용)';
COMMENT ON COLUMN com.codes.id                      IS '코드 고유 식별자 (UUID)';
COMMENT ON COLUMN com.codes.created_at              IS '등록 일시';
COMMENT ON COLUMN com.codes.created_by              IS '등록자 UUID';
COMMENT ON COLUMN com.codes.updated_at              IS '수정 일시';
COMMENT ON COLUMN com.codes.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN com.codes.group_id                IS '코드 그룹 식별자';
COMMENT ON COLUMN com.codes.code                    IS '코드값 (예: KRW, USD, EUR)';
COMMENT ON COLUMN com.codes.name                    IS '코드명 (예: 한국원, 미국달러, 유로)';
COMMENT ON COLUMN com.codes.name_en                 IS '코드 영문명';
COMMENT ON COLUMN com.codes.description             IS '코드 설명';
COMMENT ON COLUMN com.codes.sort_order              IS '정렬 순서 (작은 값이 우선)';
COMMENT ON COLUMN com.codes.parent_code_id          IS '상위 코드 식별자 (계층 구조용)';
COMMENT ON COLUMN com.codes.level_depth             IS '계층 깊이';
COMMENT ON COLUMN com.codes.additional_value1       IS '추가 값 1';
COMMENT ON COLUMN com.codes.additional_value2       IS '추가 값 2';
COMMENT ON COLUMN com.codes.additional_value3       IS '추가 값 3';
COMMENT ON COLUMN com.codes.attributes              IS '추가 속성 (JSON 형식)';
COMMENT ON COLUMN com.codes.icon_name               IS '아이콘 이름';
COMMENT ON COLUMN com.codes.color_code              IS '색상 코드 (#RRGGBB 형식)';
COMMENT ON COLUMN com.codes.notes                   IS '비고';
COMMENT ON COLUMN com.codes.is_active               IS '활성 상태';
COMMENT ON COLUMN com.codes.is_deleted              IS '논리 삭제 플래그';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_com_codes__group_id
    ON com.codes (group_id, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_codes__group_id IS '코드 그룹별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_codes__code
    ON com.codes (group_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_codes__code IS '그룹 및 코드값 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_codes__parent_code_id
    ON com.codes (parent_code_id)
 WHERE parent_code_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX ix_com_codes__parent_code_id IS '상위 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_codes__is_active
    ON com.codes (is_active, group_id, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_codes__is_active IS '활성 상태별 조회 인덱스';

-- 유니크 제약 조건
CREATE UNIQUE INDEX IF NOT EXISTS ux_com_codes__group_code
    ON com.codes (group_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_com_codes__group_code IS '그룹 및 코드값 유니크 제약';

-- 외래키 제약 조건
-- 코드 그룹 참조 외래키
ALTER TABLE com.codes ADD CONSTRAINT fk_com_codes__group_id
    FOREIGN KEY (group_id) REFERENCES com.code_groups(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_com_codes__group_id ON com.codes IS '코드 그룹 참조 외래키 (CASCADE 삭제)';

-- 상위 코드 참조 외래키
ALTER TABLE com.codes ADD CONSTRAINT fk_com_codes__parent_code_id
    FOREIGN KEY (parent_code_id) REFERENCES com.codes(id) ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_com_codes__parent_code_id ON com.codes IS '상위 코드 참조 외래키 (CASCADE 삭제)';

-- =====================================================================================
-- 테이블: com.workflows
-- 설명: 전자결재 워크플로우 정의를 관리하는 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS com.workflows 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 워크플로우 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 워크플로우 기본 정보
    workflow_code           VARCHAR(50)              NOT NULL,                                           -- 워크플로우 코드 (테넌트 내 유니크)
    workflow_name           VARCHAR(100)             NOT NULL,                                           -- 워크플로우명
    workflow_name_en        VARCHAR(100),                                                                -- 워크플로우 영문명 -- 추가
    description             TEXT,                                                                        -- 워크플로우 설명
    
    -- 적용 대상
    module_code             VARCHAR(50)              NOT NULL,                                           -- 모듈 코드 (PSM, SRM 등)
    document_type           VARCHAR(50)              NOT NULL,                                           -- 문서 유형 (PURCHASE_ORDER, SALES_ORDER 등)
    
    -- 워크플로우 설정
    version                 INTEGER                  DEFAULT 1,                                          -- 버전 -- 추가
    is_default              BOOLEAN                  DEFAULT false,                                      -- 기본 워크플로우 여부 -- 추가
    priority                INTEGER                  DEFAULT 0,                                          -- 우선순위 -- 추가
    
    -- 조건 설정
    condition_rule          JSONB,                                                                       -- 조건 규칙 (JSON) -- 추가
    min_amount              NUMERIC(18,4),                                                               -- 최소 금액 (조건) -- 추가
    max_amount              NUMERIC(18,4),                                                               -- 최대 금액 (조건) -- 추가
    
    -- 알림 설정
    notification_enabled    BOOLEAN                  DEFAULT true,                                       -- 알림 활성화 여부 -- 추가
    escalation_enabled      BOOLEAN                  DEFAULT false,                                      -- 에스컬레이션 활성화 여부 -- 추가
    escalation_hours        INTEGER,                                                                     -- 에스컬레이션 시간 (시간) -- 추가
    
    -- 추가 정보
    notes                   TEXT,                                                                        -- 비고 -- 추가
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- 버전 양수 체크
    CONSTRAINT ck_com_workflows__version            CHECK (version > 0),
    -- 우선순위 양수 체크
    CONSTRAINT ck_com_workflows__priority           CHECK (priority >= 0),
    -- 금액 범위 체크
    CONSTRAINT ck_com_workflows__amount_range       CHECK (min_amount IS NULL OR max_amount IS NULL OR min_amount <= max_amount),
    -- 에스컬레이션 시간 양수 체크
    CONSTRAINT ck_com_workflows__escalation_hours   CHECK (escalation_hours IS NULL OR escalation_hours > 0)
);

COMMENT ON TABLE  com.workflows                     IS '전자결재 워크플로우 정의 관리 테이블';
COMMENT ON COLUMN com.workflows.id                  IS '워크플로우 고유 식별자 (UUID)';
COMMENT ON COLUMN com.workflows.created_at          IS '등록 일시';
COMMENT ON COLUMN com.workflows.created_by          IS '등록자 UUID';
COMMENT ON COLUMN com.workflows.updated_at          IS '수정 일시';
COMMENT ON COLUMN com.workflows.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN com.workflows.workflow_code       IS '워크플로우 코드';
COMMENT ON COLUMN com.workflows.workflow_name       IS '워크플로우명';
COMMENT ON COLUMN com.workflows.workflow_name_en    IS '워크플로우 영문명';
COMMENT ON COLUMN com.workflows.description         IS '워크플로우 설명';
COMMENT ON COLUMN com.workflows.module_code         IS '모듈 코드 (PSM: 구매, SRM: 판매, FIM: 재무 등)';
COMMENT ON COLUMN com.workflows.document_type       IS '문서 유형 (PURCHASE_ORDER: 구매주문, SALES_ORDER: 판매주문, EXPENSE_REPORT: 경비보고 등)';
COMMENT ON COLUMN com.workflows.version             IS '버전';
COMMENT ON COLUMN com.workflows.is_default          IS '기본 워크플로우 여부';
COMMENT ON COLUMN com.workflows.priority            IS '우선순위 (낮은 값이 높은 우선순위)';
COMMENT ON COLUMN com.workflows.condition_rule      IS '조건 규칙 (JSON 형식)';
COMMENT ON COLUMN com.workflows.min_amount          IS '최소 금액 (조건)';
COMMENT ON COLUMN com.workflows.max_amount          IS '최대 금액 (조건)';
COMMENT ON COLUMN com.workflows.notification_enabled IS '알림 활성화 여부';
COMMENT ON COLUMN com.workflows.escalation_enabled  IS '에스컬레이션 활성화 여부';
COMMENT ON COLUMN com.workflows.escalation_hours    IS '에스컬레이션 시간 (시간)';
COMMENT ON COLUMN com.workflows.notes               IS '비고';
COMMENT ON COLUMN com.workflows.is_active           IS '활성 상태';
COMMENT ON COLUMN com.workflows.is_deleted          IS '논리 삭제 플래그';

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_com_workflows__workflow_code
    ON com.workflows (workflow_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_workflows__workflow_code IS '워크플로우 코드 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_workflows__module_document
    ON com.workflows (module_code, document_type)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_workflows__module_document IS '모듈 및 문서 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_com_workflows__is_active
    ON com.workflows (is_active, priority)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_com_workflows__is_active IS '활성 상태 및 우선순위별 조회 인덱스';

-- 유니크 제약 조건
CREATE UNIQUE INDEX IF NOT EXISTS ux_com_workflows__code
    ON com.workflows (workflow_code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_com_workflows__code IS '워크플로우 코드 유니크 제약';

