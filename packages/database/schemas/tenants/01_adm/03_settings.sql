-- =====================================================================================
-- 테이블: adm.settings
-- 설명: 시스템 설정 테이블 - 애플리케이션 설정 및 환경 변수 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.settings 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 설정 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 설정 정보
    key                     VARCHAR(100)             NOT NULL,                               -- 설정 키 (도메인.기능.속성 형태 권장)
    value                   TEXT,                                                            -- 설정 값
    value_type              VARCHAR(20)              NOT NULL DEFAULT 'STRING',              -- 값 타입 (STRING/NUMBER/BOOLEAN/JSON)
    default_value           TEXT,                                                            -- 기본값 (추가 - 설정 초기화용)
    description             TEXT,                                                            -- 설명
    
    -- 분류
    category                VARCHAR(50),                                                     -- 카테고리 (system/tenant/feature 등)
    
    -- 상태 관리 (추가)
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부 (추가)
    is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 설정 여부 (추가 - 수정 제한)
    is_encrypted            BOOLEAN                  NOT NULL DEFAULT false,                 -- 암호화 여부 (추가 - 민감정보 표시)
    
    -- 값 타입 체크
    CONSTRAINT ck_settings__value_type              CHECK (value_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.settings                           IS '시스템 설정 테이블 - 애플리케이션 설정 및 환경 변수 관리';
COMMENT ON COLUMN adm.settings.id                        IS '설정 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.settings.created_at                IS '등록 일시';
COMMENT ON COLUMN adm.settings.created_by                IS '등록자 UUID';
COMMENT ON COLUMN adm.settings.updated_at                IS '수정 일시';
COMMENT ON COLUMN adm.settings.updated_by                IS '수정자 UUID';
COMMENT ON COLUMN adm.settings.key                       IS '설정 키 (도메인.기능.속성 형태 권장, 예: app.email.smtp_host)';
COMMENT ON COLUMN adm.settings.value                     IS '설정 값';
COMMENT ON COLUMN adm.settings.value_type                IS '값 타입 (STRING/NUMBER/BOOLEAN/JSON)';
COMMENT ON COLUMN adm.settings.default_value             IS '기본값 (설정 초기화용)';
COMMENT ON COLUMN adm.settings.description               IS '설명';
COMMENT ON COLUMN adm.settings.category                  IS '카테고리 (system/tenant/feature 등)';
COMMENT ON COLUMN adm.settings.is_active                 IS '활성 여부';
COMMENT ON COLUMN adm.settings.is_system                 IS '시스템 설정 여부 (수정 제한)';
COMMENT ON COLUMN adm.settings.is_encrypted              IS '암호화 여부 (민감정보 표시)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_settings__key 
    ON adm.settings (key);
COMMENT ON INDEX adm.ux_settings__key IS '설정 키 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_settings__category 
    ON adm.settings (category)
 WHERE is_active = true;
COMMENT ON INDEX adm.ix_settings__category IS '카테고리별 설정 조회 인덱스';

CREATE INDEX ix_settings__is_system 
    ON adm.settings (is_system)
 WHERE is_active = true;
COMMENT ON INDEX adm.ix_settings__is_system IS '시스템 설정 필터 인덱스';
