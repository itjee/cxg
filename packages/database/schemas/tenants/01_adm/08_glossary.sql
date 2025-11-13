-- =====================================================================================
-- 테이블: adm.glossary
-- 설명: 용어집 관리 테이블 - 시스템에서 사용되는 비즈니스 용어 정의 및 관리
-- 작성일: 2025-10-27
-- 수정일: 2025-10-27
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.glossary
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 용어 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 용어 기본 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 용어 코드 (테넌트 내 유니크)
    name                    VARCHAR(200)             NOT NULL,                               -- 용어명 (한글)
    name_en                 VARCHAR(200),                                                    -- 용어명 (영문)
    abbreviation            VARCHAR(50),                                                     -- 약어
    
    -- 용어 설명
    definition              TEXT                     NOT NULL,                               -- 용어 정의
    description             TEXT,                                                            -- 상세 설명
    example                 TEXT,                                                            -- 사용 예시
    
    -- 분류 정보
    category                VARCHAR(50),                                                     -- 카테고리 (재무, 구매, 판매, 인사 등)
    domain                  VARCHAR(50),                                                     -- 도메인 (PSM, SRM, FIM, HRM 등)
    tags                    TEXT[],                                                          -- 태그 배열 (검색용)
    
    -- 관계 정보
    parent_id               UUID,                                                            -- 상위 용어 ID (계층 구조)
    related_terms           UUID[],                                                          -- 관련 용어 ID 배열
    synonyms                TEXT[],                                                          -- 동의어 배열
    antonyms                TEXT[],                                                          -- 반의어 배열
    
    -- 참조 정보
    reference_url           TEXT,                                                            -- 참조 URL
    reference_document      TEXT,                                                            -- 참조 문서
    
    -- 사용 정보
    usage_count             INTEGER                  DEFAULT 0,                              -- 사용 빈도
    last_used_at            TIMESTAMP WITH TIME ZONE,                                        -- 마지막 사용 일시
    
    -- 표시 속성
    display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서
    is_important            BOOLEAN                  DEFAULT false,                          -- 중요 용어 여부
    is_system               BOOLEAN                  DEFAULT false,                          -- 시스템 기본 용어 여부 (삭제 불가)
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                           -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 외래키 제약조건
    CONSTRAINT fk_glossary__parent_id
        FOREIGN KEY (parent_id)
        REFERENCES adm.glossary(id)
        ON DELETE SET NULL,
    
    -- CHECK 제약조건
    CONSTRAINT ck_glossary__display_order
        CHECK (display_order >= 0),
    
    CONSTRAINT ck_glossary__usage_count
        CHECK (usage_count >= 0),
    
    CONSTRAINT ck_glossary__code
        CHECK (code ~ '^[A-Z0-9_]{2,50}$')
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  adm.glossary                      IS '용어집 관리 테이블 - 비즈니스 용어 정의 및 관리';
COMMENT ON COLUMN adm.glossary.id                   IS '용어 고유 식별자';
COMMENT ON COLUMN adm.glossary.created_at           IS '등록 일시';
COMMENT ON COLUMN adm.glossary.created_by           IS '등록자 UUID';
COMMENT ON COLUMN adm.glossary.updated_at           IS '수정 일시';
COMMENT ON COLUMN adm.glossary.updated_by           IS '수정자 UUID';
COMMENT ON COLUMN adm.glossary.code            IS '용어 코드';
COMMENT ON COLUMN adm.glossary.name            IS '용어명 (한글)';
COMMENT ON COLUMN adm.glossary.name_en         IS '용어명 (영문)';
COMMENT ON COLUMN adm.glossary.abbreviation         IS '약어';
COMMENT ON COLUMN adm.glossary.definition           IS '용어 정의';
COMMENT ON COLUMN adm.glossary.description          IS '상세 설명';
COMMENT ON COLUMN adm.glossary.example              IS '사용 예시';
COMMENT ON COLUMN adm.glossary.category             IS '카테고리 (재무, 구매, 판매, 인사 등)';
COMMENT ON COLUMN adm.glossary.domain               IS '도메인 (PSM, SRM, FIM, HRM 등)';
COMMENT ON COLUMN adm.glossary.tags                 IS '태그 배열 (검색용)';
COMMENT ON COLUMN adm.glossary.parent_id            IS '상위 용어 ID (계층 구조)';
COMMENT ON COLUMN adm.glossary.related_terms        IS '관련 용어 ID 배열';
COMMENT ON COLUMN adm.glossary.synonyms             IS '동의어 배열';
COMMENT ON COLUMN adm.glossary.antonyms             IS '반의어 배열';
COMMENT ON COLUMN adm.glossary.reference_url        IS '참조 URL';
COMMENT ON COLUMN adm.glossary.reference_document   IS '참조 문서';
COMMENT ON COLUMN adm.glossary.usage_count          IS '사용 빈도';
COMMENT ON COLUMN adm.glossary.last_used_at         IS '마지막 사용 일시';
COMMENT ON COLUMN adm.glossary.display_order        IS '표시 순서';
COMMENT ON COLUMN adm.glossary.is_important         IS '중요 용어 여부';
COMMENT ON COLUMN adm.glossary.is_system            IS '시스템 기본 용어 여부 (삭제 불가)';
COMMENT ON COLUMN adm.glossary.notes                IS '비고';
COMMENT ON COLUMN adm.glossary.is_active            IS '활성 상태';
COMMENT ON COLUMN adm.glossary.is_deleted           IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_glossary__name
    ON adm.glossary (name)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_glossary__name IS '용어명 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__name_en
    ON adm.glossary (name_en)
 WHERE is_deleted = false
   AND name_en IS NOT NULL;
COMMENT ON INDEX adm.ix_glossary__name_en IS '영문 용어명 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__category
    ON adm.glossary (category)
 WHERE is_deleted = false
   AND category IS NOT NULL;
COMMENT ON INDEX adm.ix_glossary__category IS '카테고리별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__domain
    ON adm.glossary (domain)
 WHERE is_deleted = false
   AND domain IS NOT NULL;
COMMENT ON INDEX adm.ix_glossary__domain IS '도메인별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__parent_id
    ON adm.glossary (parent_id)
 WHERE is_deleted = false
   AND parent_id IS NOT NULL;
COMMENT ON INDEX adm.ix_glossary__parent_id IS '상위 용어별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__tags
    ON adm.glossary USING GIN (tags)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_glossary__tags IS '태그 검색 인덱스 (GIN)';

CREATE INDEX IF NOT EXISTS ix_glossary__is_important
    ON adm.glossary (is_important, display_order)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_glossary__is_important IS '중요 용어 및 표시 순서 인덱스';

CREATE INDEX IF NOT EXISTS ix_glossary__usage_count
    ON adm.glossary (usage_count DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_glossary__usage_count IS '사용 빈도별 조회 인덱스';

-- 전체 텍스트 검색 인덱스
CREATE INDEX IF NOT EXISTS ix_glossary__search
    ON adm.glossary USING GIN (
        to_tsvector('simple', 
            COALESCE(name, '') || ' ' || 
            COALESCE(name_en, '') || ' ' || 
            COALESCE(abbreviation, '') || ' ' || 
            COALESCE(definition, '') || ' ' || 
            COALESCE(description, '')
        )
    )
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_glossary__search IS '전체 텍스트 검색 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_glossary__code
    ON adm.glossary (code)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ux_glossary__code IS '용어 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_glossary__name
    ON adm.glossary (name, category)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ux_glossary__name IS '카테고리별 용어명 유니크 제약';
