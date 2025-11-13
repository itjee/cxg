-- =====================================================================================
-- 테이블: sys.code_rules
-- 설명: 엔티티별 코드 자동 생성 규칙 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-11-04
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.code_rules 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 규칙 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 엔티티 정보
    entity_code             VARCHAR(100)             NOT NULL,                                           -- 엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)
    entity_name             VARCHAR(200)             NOT NULL,                                           -- 엔티티명 (예: 거래처, 제품, 창고)
    entity_name_en          VARCHAR(200),                                                                -- 엔티티명 (영문)
    
    -- 코드 생성 규칙
    prefix                  VARCHAR(10)              NOT NULL,                                           -- 코드 Prefix (예: PTN, PRD, WHS)
    current_number          INTEGER                  NOT NULL DEFAULT 0,                                 -- 현재 일련번호 (다음 발급될 번호)
    digit_length            SMALLINT                 NOT NULL DEFAULT 4,                                 -- 일련번호 자릿수 (2-10)
    separator               VARCHAR(5)               DEFAULT '',                                         -- 구분자 (예: '-', '_', '' 등)
    
    -- 추가 설정
    use_date                BOOLEAN                  DEFAULT false,                                      -- 날짜 사용 여부 (예: PTN-20250104-0001)
    date_format             VARCHAR(20)              DEFAULT 'YYYYMMDD',                                 -- 날짜 포맷 (YYYY, YYYYMM, YYYYMMDD 등)
    reset_cycle             VARCHAR(20)              DEFAULT 'NONE',                                     -- 리셋 주기 (NONE, DAILY, MONTHLY, YEARLY)
    
    -- 예시 및 설명
    description             TEXT,                                                                        -- 규칙 설명
    example_code            VARCHAR(50),                                                                 -- 예시 코드 (자동 생성)
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 메타 데이터
    meta_data               JSONB,                                                                       -- 추가 메타 정보 (JSON)
    
    -- 제약조건
    -- Prefix 형식 체크 (영문 대문자, 숫자)
    CONSTRAINT ck_code_rules__prefix_format        CHECK (prefix ~ '^[A-Z0-9]+$'),
    
    -- 엔티티 코드 형식 체크 (대문자 영문, 숫자, 언더스코어)
    CONSTRAINT ck_code_rules__entity_code_format   CHECK (entity_code ~ '^[A-Z0-9_]+$'),
    
    -- 자릿수 체크 (2-10)
    CONSTRAINT ck_code_rules__digit_length         CHECK (digit_length BETWEEN 2 AND 10),
    
    -- 일련번호 체크 (0 이상)
    CONSTRAINT ck_code_rules__current_number       CHECK (current_number >= 0),
    
    -- 리셋 주기 체크
    CONSTRAINT ck_code_rules__reset_cycle          CHECK (reset_cycle IN ('NONE', 'DAILY', 'MONTHLY', 'YEARLY'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.code_rules                       IS '엔티티별 코드 자동 생성 규칙 관리 테이블 (예: PTN-0001, PRD-20250104-0001)';
COMMENT ON COLUMN sys.code_rules.id                    IS '코드 규칙 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.code_rules.created_at            IS '등록 일시';
COMMENT ON COLUMN sys.code_rules.created_by            IS '등록자 UUID';
COMMENT ON COLUMN sys.code_rules.updated_at            IS '수정 일시';
COMMENT ON COLUMN sys.code_rules.updated_by            IS '수정자 UUID';
COMMENT ON COLUMN sys.code_rules.entity_code           IS '엔티티 코드 (영문 대문자, 예: PARTNER, PRODUCT, WAREHOUSE)';
COMMENT ON COLUMN sys.code_rules.entity_name           IS '엔티티명 (사용자에게 표시되는 이름)';
COMMENT ON COLUMN sys.code_rules.entity_name_en        IS '엔티티명 (영문)';
COMMENT ON COLUMN sys.code_rules.prefix                IS '코드 Prefix (예: PTN, PRD, WHS)';
COMMENT ON COLUMN sys.code_rules.current_number        IS '현재 일련번호 (다음 발급될 번호, 0부터 시작)';
COMMENT ON COLUMN sys.code_rules.digit_length          IS '일련번호 자릿수 (2-10, 예: 4면 0001)';
COMMENT ON COLUMN sys.code_rules.separator             IS '구분자 (예: ''-'', ''_'', 빈 문자열 등)';
COMMENT ON COLUMN sys.code_rules.use_date              IS '날짜 사용 여부 (true면 코드에 날짜 포함)';
COMMENT ON COLUMN sys.code_rules.date_format           IS '날짜 포맷 (YYYY, YYYYMM, YYYYMMDD 등)';
COMMENT ON COLUMN sys.code_rules.reset_cycle           IS '리셋 주기 (NONE: 리셋안함, DAILY: 매일, MONTHLY: 매월, YEARLY: 매년)';
COMMENT ON COLUMN sys.code_rules.description           IS '규칙 설명';
COMMENT ON COLUMN sys.code_rules.example_code          IS '코드 형식 예시 (예: PTN-0001, PRD-20250104-0001)';
COMMENT ON COLUMN sys.code_rules.is_active             IS '활성 상태';
COMMENT ON COLUMN sys.code_rules.is_deleted            IS '논리 삭제 플래그';
COMMENT ON COLUMN sys.code_rules.meta_data             IS '추가 메타 정보 (JSON 형식으로 확장 가능)';

-- 유니크 인덱스
-- 엔티티 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_code_rules__entity_code
    ON sys.code_rules (entity_code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_code_rules__entity_code IS '엔티티 코드 유니크 제약';

-- 일반 인덱스
-- 활성 상태 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_code_rules__is_active
    ON sys.code_rules (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_code_rules__is_active IS '활성 상태별 조회 인덱스';

-- Prefix 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_code_rules__prefix
    ON sys.code_rules (prefix)
 WHERE is_deleted = false AND is_active = true;
COMMENT ON INDEX sys.ix_code_rules__prefix IS 'Prefix별 조회 인덱스';

-- 생성일시 조회 인덱스
CREATE INDEX IF NOT EXISTS ix_code_rules__created_at
    ON sys.code_rules (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_code_rules__created_at IS '생성일시별 조회 인덱스';