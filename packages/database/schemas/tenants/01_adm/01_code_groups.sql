-- =====================================================================================
-- 테이블: adm.code_groups
-- 설명: 공통코드 그룹 테이블 - 시스템 전체에서 사용하는 코드 분류 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-27 - com.code_groups 통합 (UI 필드 추가)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.code_groups 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 코드그룹 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 코드그룹 정보
    code                    VARCHAR(50)              NOT NULL,                               -- 그룹 코드 (영대문자, 숫자, 언더스코어)
    name                    VARCHAR(200)             NOT NULL,                               -- 그룹명
    name_en                 VARCHAR(200),                                                    -- 그룹 영문명 (다국어 지원)
    description             TEXT,                                                            -- 설명
    
    -- 계층 구조
    parent_group_id         UUID,                                                            -- 상위 그룹 식별자 (계층구조 지원)
    level                   INTEGER                  DEFAULT 1,                              -- 그룹 레벨 (계층 레벨)
    
    -- UI 표시 속성
    sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서
    icon_name               VARCHAR(50),                                                     -- 아이콘 이름
    color_code              VARCHAR(7),                                                      -- 색상 코드 (#RRGGBB)
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고
    
    -- 상태 관리
    is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 기본 그룹 (삭제 불가)
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- CHECK 제약조건
    CONSTRAINT ck_code_groups__code                 CHECK (code ~ '^[A-Z0-9_]{2,50}$'),
    CONSTRAINT ck_code_groups__level                CHECK (level >= 1),
    CONSTRAINT ck_code_groups__sort_order           CHECK (sort_order >= 0),
    CONSTRAINT ck_code_groups__color_code           CHECK (color_code IS NULL OR color_code ~ '^#[0-9A-Fa-f]{6}$')
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.code_groups                        IS '공통코드 그룹 테이블 - 시스템 전체에서 사용하는 코드 분류 관리';
COMMENT ON COLUMN adm.code_groups.id                     IS '코드그룹 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.code_groups.created_at             IS '등록 일시';
COMMENT ON COLUMN adm.code_groups.created_by             IS '등록자 UUID';
COMMENT ON COLUMN adm.code_groups.updated_at             IS '수정 일시';
COMMENT ON COLUMN adm.code_groups.updated_by             IS '수정자 UUID';
COMMENT ON COLUMN adm.code_groups.code                   IS '그룹 코드 (영대문자, 숫자, 언더스코어 2-50자)';
COMMENT ON COLUMN adm.code_groups.name                   IS '그룹명';
COMMENT ON COLUMN adm.code_groups.name_en                IS '그룹 영문명';
COMMENT ON COLUMN adm.code_groups.description            IS '설명';
COMMENT ON COLUMN adm.code_groups.parent_group_id        IS '상위 그룹 식별자 (계층구조 지원)';
COMMENT ON COLUMN adm.code_groups.level                  IS '그룹 레벨 (계층 레벨, 1부터 시작)';
COMMENT ON COLUMN adm.code_groups.sort_order             IS '정렬 순서';
COMMENT ON COLUMN adm.code_groups.icon_name              IS '아이콘 이름';
COMMENT ON COLUMN adm.code_groups.color_code             IS '색상 코드 (#RRGGBB)';
COMMENT ON COLUMN adm.code_groups.notes                  IS '비고';
COMMENT ON COLUMN adm.code_groups.is_system              IS '시스템 기본 그룹 여부 (삭제 불가)';
COMMENT ON COLUMN adm.code_groups.is_active              IS '활성 여부';
COMMENT ON COLUMN adm.code_groups.is_deleted             IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_code_groups__code 
    ON adm.code_groups (code)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ux_code_groups__code IS '그룹 코드 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_code_groups__parent_group_id 
    ON adm.code_groups (parent_group_id)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_code_groups__parent_group_id IS '상위 그룹별 조회 인덱스';

CREATE INDEX ix_code_groups__is_active 
    ON adm.code_groups (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX adm.ix_code_groups__is_active IS '활성 상태별 조회 인덱스';

-- 외래키 제약조건 (자기 참조)
ALTER TABLE adm.code_groups 
  ADD CONSTRAINT fk_code_groups__parent_group_id
    FOREIGN KEY (parent_group_id) 
    REFERENCES adm.code_groups(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_code_groups__parent_group_id ON adm.code_groups IS '상위 그룹 참조 외래키 (SET NULL 삭제)';
