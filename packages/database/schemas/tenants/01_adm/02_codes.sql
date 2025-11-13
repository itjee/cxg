-- =====================================================================================
-- 테이블: adm.codes
-- 설명: 공통코드 테이블 - 시스템 전체에서 사용하는 코드값 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-27 - com.codes 통합 (계층구조, 확장속성, UI 필드 추가)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.codes 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 코드 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 코드 정보
    group_id                UUID                     NOT NULL,                               -- 코드그룹 식별자
    code                    VARCHAR(50)              NOT NULL,                               -- 코드값 (영대문자, 숫자, 언더스코어)
    name                    VARCHAR(200)             NOT NULL,                               -- 코드명
    name_en                 VARCHAR(200),                                                    -- 영문 코드명 (다국어 지원)
    description             TEXT,                                                            -- 설명
    
    -- 계층 구조
    parent_id               UUID,                                                            -- 상위 코드 식별자 (계층 구조)
    level_depth             INTEGER                  DEFAULT 1,                              -- 계층 깊이
    
    -- 확장 속성
    attribute1              VARCHAR(100),                                                    -- 추가 속성1
    attribute2              VARCHAR(100),                                                    -- 추가 속성2
    attribute3              VARCHAR(100),                                                    -- 추가 속성3
    attribute4              VARCHAR(100),                                                    -- 추가 속성4
    attribute5              VARCHAR(100),                                                    -- 추가 속성5
    attributes              JSONB,                                                           -- 추가 속성 (JSON)
    
    -- UI 표시 속성
    sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서
    icon_name               VARCHAR(50),                                                     -- 아이콘 이름
    color_code              VARCHAR(7),                                                      -- 색상 코드 (#RRGGBB)
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 코드 여부 (수정/삭제 제한)
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- CHECK 제약조건
    CONSTRAINT ck_codes__code                       CHECK (code ~ '^[A-Z0-9_]{1,50}$'),
    CONSTRAINT ck_codes__sort_order                 CHECK (sort_order >= 0),
    CONSTRAINT ck_codes__level_depth                CHECK (level_depth BETWEEN 1 AND 10),
    CONSTRAINT ck_codes__parent_not_self            CHECK (parent_id != id),
    CONSTRAINT ck_codes__color_code                 CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.codes                              IS '공통코드 테이블 - 시스템 전체에서 사용하는 코드값 관리';
COMMENT ON COLUMN adm.codes.id                           IS '코드 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.codes.created_at                   IS '등록 일시';
COMMENT ON COLUMN adm.codes.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN adm.codes.updated_at                   IS '수정 일시';
COMMENT ON COLUMN adm.codes.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN adm.codes.group_id                     IS '코드그룹 식별자';
COMMENT ON COLUMN adm.codes.code                         IS '코드값 (영대문자, 숫자, 언더스코어 1-50자)';
COMMENT ON COLUMN adm.codes.name                         IS '코드명';
COMMENT ON COLUMN adm.codes.name_en                      IS '영문 코드명 (다국어 지원)';
COMMENT ON COLUMN adm.codes.description                  IS '설명';
COMMENT ON COLUMN adm.codes.parent_id                    IS '상위 코드 식별자 (계층 구조)';
COMMENT ON COLUMN adm.codes.level_depth                  IS '계층 깊이 (1-10)';
COMMENT ON COLUMN adm.codes.attribute1                   IS '추가 속성1 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute2                   IS '추가 속성2 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute3                   IS '추가 속성3 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute4                   IS '추가 속성4 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute5                   IS '추가 속성5 (확장 속성)';
COMMENT ON COLUMN adm.codes.attributes                   IS '추가 속성 (JSON 형식)';
COMMENT ON COLUMN adm.codes.sort_order                   IS '정렬 순서';
COMMENT ON COLUMN adm.codes.icon_name                    IS '아이콘 이름';
COMMENT ON COLUMN adm.codes.color_code                   IS '색상 코드 (#RRGGBB)';
COMMENT ON COLUMN adm.codes.notes                        IS '비고';
COMMENT ON COLUMN adm.codes.is_system                    IS '시스템 코드 여부 (수정/삭제 제한)';
COMMENT ON COLUMN adm.codes.is_active                    IS '활성 여부';
COMMENT ON COLUMN adm.codes.is_deleted                   IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_codes__group_code 
    ON adm.codes (group_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ux_codes__group_code IS '그룹내 코드값 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_codes__group_id 
    ON adm.codes (group_id)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_codes__group_id IS '그룹별 코드 조회 인덱스';

CREATE INDEX ix_codes__parent_id
    ON adm.codes (parent_id)
 WHERE is_deleted = false AND parent_id IS NOT NULL;
COMMENT ON INDEX adm.ix_codes__parent_id IS '상위 코드별 조회 인덱스 (계층 구조)';

CREATE INDEX ix_codes__is_active 
    ON adm.codes (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_codes__is_active IS '활성 상태별 조회 인덱스';

CREATE INDEX ix_codes__sort_order 
    ON adm.codes (group_id, sort_order);
COMMENT ON INDEX adm.ix_codes__sort_order IS '그룹별 정렬 순서 조회 인덱스';

-- 외래키 제약조건
-- 코드그룹 참조 (CASCADE 삭제)
ALTER TABLE adm.codes 
  ADD CONSTRAINT fk_codes__group_id
    FOREIGN KEY (group_id) 
    REFERENCES adm.code_groups(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_codes__group_id ON adm.codes IS '코드그룹 참조 외래키 (CASCADE 삭제)';

-- 상위 코드 참조 (자기 참조, SET NULL 삭제)
ALTER TABLE adm.codes
  ADD CONSTRAINT fk_codes__parent_id
    FOREIGN KEY (parent_id)
    REFERENCES adm.codes(id)
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_codes__parent_id ON adm.codes IS '상위 코드 참조 외래키 (자기 참조, SET NULL 삭제)';
