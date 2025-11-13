-- ============================================================================
-- Common Administration Schema (adm)
-- ============================================================================
-- Description: 공통 기준정보 (공통코드, 설정, 통화, 단위)
-- Database: tnnt_db (Tenant Database)
-- Schema: adm
-- Created: 2025-01-20
-- Modified: 2025-01-22 - 표준 형식 적용
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS adm;

COMMENT ON SCHEMA adm IS 'ADM: 공통 기준정보 스키마 (공통코드, 설정, 통화, 단위)';

-- ============================================================================
-- ADM: 공통 기준정보 (Common Administration Data)
-- ============================================================================
-- Note: 조직(hrm), 고객(crm), 제품(pim), 창고(wms)는 별도 스키마로 분리됨
-- ============================================================================

-- =====================================================================================
-- 테이블: adm.code_groups
-- 설명: 공통코드 그룹 테이블 - 시스템 전체에서 사용하는 코드 분류 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
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
    description             TEXT,                                                            -- 설명
    
    -- 추가 속성 (추가)
    parent_group_id         UUID,                                                            -- 상위 그룹 식별자 (추가 - 계층구조 지원)
    level                   INTEGER                  DEFAULT 1,                              -- 그룹 레벨 (추가 - 계층 레벨)
    
    -- 정렬
    sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 그룹 코드 형식 체크 (영대문자, 숫자, 언더스코어 2-50자)
    CONSTRAINT ck_code_groups__code                 CHECK (code ~ '^[A-Z0-9_]{2,50}$'),
    
    -- 레벨 체크 (1 이상)
    CONSTRAINT ck_code_groups__level                CHECK (level >= 1)
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
COMMENT ON COLUMN adm.code_groups.description            IS '설명';
COMMENT ON COLUMN adm.code_groups.parent_group_id        IS '상위 그룹 식별자 (계층구조 지원)';
COMMENT ON COLUMN adm.code_groups.level                  IS '그룹 레벨 (계층 레벨, 1부터 시작)';
COMMENT ON COLUMN adm.code_groups.sort_order             IS '정렬 순서';
COMMENT ON COLUMN adm.code_groups.is_active              IS '활성 여부';
COMMENT ON COLUMN adm.code_groups.is_deleted             IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_code_groups__code 
    ON adm.code_groups (code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_code_groups__code IS '그룹 코드 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_code_groups__parent_group_id 
    ON adm.code_groups (parent_group_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_code_groups__parent_group_id IS '상위 그룹별 조회 인덱스';

CREATE INDEX ix_code_groups__is_active 
    ON adm.code_groups (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_code_groups__is_active IS '활성 상태별 조회 인덱스';

-- 외래키 제약조건 (자기 참조)
ALTER TABLE adm.code_groups 
  ADD CONSTRAINT fk_code_groups__parent_group_id
    FOREIGN KEY (parent_group_id) 
    REFERENCES adm.code_groups(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_code_groups__parent_group_id ON adm.code_groups IS '상위 그룹 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 테이블: adm.codes
-- 설명: 공통코드 테이블 - 시스템 전체에서 사용하는 코드값 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
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
    name_en                 VARCHAR(200),                                                    -- 영문 코드명 (추가 - 다국어 지원)
    description             TEXT,                                                            -- 설명
    
    -- 추가 속성 (추가)
    attribute1              VARCHAR(100),                                                    -- 추가 속성1 (추가 - 확장 속성)
    attribute2              VARCHAR(100),                                                    -- 추가 속성2 (추가 - 확장 속성)
    attribute3              VARCHAR(100),                                                    -- 추가 속성3 (추가 - 확장 속성)
    
    -- 정렬
    sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 코드 여부 (추가 - 수정/삭제 제한)
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 코드값 형식 체크 (영대문자, 숫자, 언더스코어 1-50자)
    CONSTRAINT ck_codes__code                       CHECK (code ~ '^[A-Z0-9_]{1,50}$')
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
COMMENT ON COLUMN adm.codes.attribute1                   IS '추가 속성1 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute2                   IS '추가 속성2 (확장 속성)';
COMMENT ON COLUMN adm.codes.attribute3                   IS '추가 속성3 (확장 속성)';
COMMENT ON COLUMN adm.codes.sort_order                   IS '정렬 순서';
COMMENT ON COLUMN adm.codes.is_active                    IS '활성 여부';
COMMENT ON COLUMN adm.codes.is_system                    IS '시스템 코드 여부 (수정/삭제 제한)';
COMMENT ON COLUMN adm.codes.is_deleted                   IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_codes__group_code 
    ON adm.codes (group_id, code)
 WHERE is_deleted = false;
COMMENT ON INDEX ux_codes__group_code IS '그룹내 코드값 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_codes__group_id 
    ON adm.codes (group_id)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_codes__group_id IS '그룹별 코드 조회 인덱스';

CREATE INDEX ix_codes__is_active 
    ON adm.codes (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX ix_codes__is_active IS '활성 상태별 조회 인덱스';

CREATE INDEX ix_codes__sort_order 
    ON adm.codes (group_id, sort_order);
COMMENT ON INDEX ix_codes__sort_order IS '그룹별 정렬 순서 조회 인덱스';

-- 외래키 제약조건
-- 코드그룹 참조 (CASCADE 삭제)
ALTER TABLE adm.codes 
  ADD CONSTRAINT fk_codes__group_id
    FOREIGN KEY (group_id) 
    REFERENCES adm.code_groups(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_codes__group_id ON adm.codes IS '코드그룹 참조 외래키 (CASCADE 삭제)';

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
COMMENT ON INDEX ux_settings__key IS '설정 키 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_settings__category 
    ON adm.settings (category)
 WHERE is_active = true;
COMMENT ON INDEX ix_settings__category IS '카테고리별 설정 조회 인덱스';

CREATE INDEX ix_settings__is_system 
    ON adm.settings (is_system)
 WHERE is_active = true;
COMMENT ON INDEX ix_settings__is_system IS '시스템 설정 필터 인덱스';

-- =====================================================================================
-- 테이블: adm.currencies
-- 설명: 통화 테이블 - ISO 4217 표준 통화 코드 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.currencies 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 통화 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 통화 정보
    code                    VARCHAR(3)               NOT NULL,                               -- 통화 코드 (ISO 4217 - 3자리 영대문자)
    name                    VARCHAR(100)             NOT NULL,                               -- 통화명 (한글명)
    name_en                 VARCHAR(100),                                                    -- 통화명 (영문명) (추가 - 다국어 지원)
    symbol                  VARCHAR(10),                                                     -- 심볼 (¥, $, € 등)
    decimal_places          INTEGER                  DEFAULT 2,                              -- 소수점 자릿수 (추가 - 통화별 자릿수)
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_base_currency        BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 통화 여부 (추가 - 환율 기준)
    
    -- 통화 코드 형식 체크 (ISO 4217 - 3자리 영대문자)
    CONSTRAINT ck_currencies__code                  CHECK (code ~ '^[A-Z]{3}$'),
    
    -- 소수점 자릿수 체크 (0-4 범위)
    CONSTRAINT ck_currencies__decimal_places        CHECK (decimal_places >= 0 AND decimal_places <= 4)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.currencies                         IS '통화 테이블 - ISO 4217 표준 통화 코드 관리';
COMMENT ON COLUMN adm.currencies.id                      IS '통화 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.currencies.created_at              IS '등록 일시';
COMMENT ON COLUMN adm.currencies.created_by              IS '등록자 UUID';
COMMENT ON COLUMN adm.currencies.updated_at              IS '수정 일시';
COMMENT ON COLUMN adm.currencies.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN adm.currencies.code                    IS '통화 코드 (ISO 4217 - 3자리 영대문자, 예: KRW, USD, JPY)';
COMMENT ON COLUMN adm.currencies.name                    IS '통화명 (한글명, 예: 대한민국 원)';
COMMENT ON COLUMN adm.currencies.name_en                 IS '통화명 (영문명, 예: South Korean Won)';
COMMENT ON COLUMN adm.currencies.symbol                  IS '심볼 (¥, $, € 등)';
COMMENT ON COLUMN adm.currencies.decimal_places          IS '소수점 자릿수 (통화별 자릿수, 0-4)';
COMMENT ON COLUMN adm.currencies.is_active               IS '활성 여부';
COMMENT ON COLUMN adm.currencies.is_base_currency        IS '기준 통화 여부 (환율 계산 기준)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_currencies__code 
    ON adm.currencies (code);
COMMENT ON INDEX ux_currencies__code IS '통화 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_currencies__is_active 
    ON adm.currencies (is_active);
COMMENT ON INDEX ix_currencies__is_active IS '활성 통화 조회 인덱스';

CREATE INDEX ix_currencies__is_base_currency 
    ON adm.currencies (is_base_currency)
 WHERE is_base_currency = true;
COMMENT ON INDEX ix_currencies__is_base_currency IS '기준 통화 조회 인덱스';

-- =====================================================================================
-- 테이블: adm.exchange_rates
-- 설명: 환율 테이블 - 통화간 환율 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.exchange_rates 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 환율 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시 (추가)
    updated_by              UUID,                                                            -- 수정자 UUID (추가)
    
    -- 환율 정보
    from_currency           VARCHAR(3)               NOT NULL,                               -- 기준 통화 (ISO 4217)
    to_currency             VARCHAR(3)               NOT NULL,                               -- 대상 통화 (ISO 4217)
    rate                    NUMERIC(18,6)            NOT NULL,                               -- 환율 (소수점 6자리까지)
    rate_date               DATE                     NOT NULL,                               -- 환율 적용일
    
    -- 추가 정보 (추가)
    source                  VARCHAR(50),                                                     -- 환율 출처 (추가 - 중앙은행, API 등)
    rate_type               VARCHAR(20)              DEFAULT 'SPOT',                         -- 환율 유형 (추가 - SPOT/FORWARD/BUYING/SELLING)
    
    -- 환율 양수 체크
    CONSTRAINT ck_exchange_rates__rate              CHECK (rate > 0),
    
    -- 기준통화와 대상통화 동일 방지
    CONSTRAINT ck_exchange_rates__currencies        CHECK (from_currency <> to_currency)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.exchange_rates                     IS '환율 테이블 - 통화간 환율 정보 관리';
COMMENT ON COLUMN adm.exchange_rates.id                  IS '환율 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.exchange_rates.created_at          IS '등록 일시';
COMMENT ON COLUMN adm.exchange_rates.created_by          IS '등록자 UUID';
COMMENT ON COLUMN adm.exchange_rates.updated_at          IS '수정 일시';
COMMENT ON COLUMN adm.exchange_rates.updated_by          IS '수정자 UUID';
COMMENT ON COLUMN adm.exchange_rates.from_currency       IS '기준 통화 (ISO 4217, 예: USD)';
COMMENT ON COLUMN adm.exchange_rates.to_currency         IS '대상 통화 (ISO 4217, 예: KRW)';
COMMENT ON COLUMN adm.exchange_rates.rate                IS '환율 (기준통화 1단위당 대상통화 환산율, 소수점 6자리까지)';
COMMENT ON COLUMN adm.exchange_rates.rate_date           IS '환율 적용일';
COMMENT ON COLUMN adm.exchange_rates.source              IS '환율 출처 (중앙은행, API 등)';
COMMENT ON COLUMN adm.exchange_rates.rate_type           IS '환율 유형 (SPOT: 현물환율, FORWARD: 선물환율, BUYING: 매입율, SELLING: 매도율)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_exchange_rates__currencies_date_type 
    ON adm.exchange_rates (from_currency, to_currency, rate_date, rate_type);
COMMENT ON INDEX ux_exchange_rates__currencies_date_type IS '통화쌍별 날짜 및 유형 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_exchange_rates__currencies_date 
    ON adm.exchange_rates (from_currency, to_currency, rate_date DESC);
COMMENT ON INDEX ix_exchange_rates__currencies_date IS '통화쌍 및 날짜별 환율 조회 인덱스 (최신순)';

CREATE INDEX ix_exchange_rates__rate_date 
    ON adm.exchange_rates (rate_date DESC);
COMMENT ON INDEX ix_exchange_rates__rate_date IS '날짜별 환율 조회 인덱스 (최신순)';

CREATE INDEX ix_exchange_rates__from_currency 
    ON adm.exchange_rates (from_currency, rate_date DESC);
COMMENT ON INDEX ix_exchange_rates__from_currency IS '기준 통화별 환율 조회 인덱스';

-- 외래키 제약조건
-- 기준 통화 참조
ALTER TABLE adm.exchange_rates 
  ADD CONSTRAINT fk_exchange_rates__from_currency
    FOREIGN KEY (from_currency) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_exchange_rates__from_currency ON adm.exchange_rates IS '기준 통화 참조 외래키 (RESTRICT 삭제)';

-- 대상 통화 참조
ALTER TABLE adm.exchange_rates 
  ADD CONSTRAINT fk_exchange_rates__to_currency
    FOREIGN KEY (to_currency) 
    REFERENCES adm.currencies(code) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_exchange_rates__to_currency ON adm.exchange_rates IS '대상 통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 테이블: adm.units
-- 설명: 단위 테이블 - 재고, 수량, 길이, 무게 등의 측정 단위 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS adm.units 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 단위 정보
    code                    VARCHAR(20)              NOT NULL,                               -- 단위 코드 (영대문자, 숫자)
    name                    VARCHAR(100)             NOT NULL,                               -- 단위명 (한글명)
    name_en                 VARCHAR(100),                                                    -- 단위명 (영문명) (추가 - 다국어 지원)
    unit_type               VARCHAR(20),                                                     -- 단위 유형 (QUANTITY/WEIGHT/LENGTH/VOLUME/AREA 등)
    symbol                  VARCHAR(10),                                                     -- 단위 심볼 (추가 - kg, m, L 등)
    
    -- 환산 정보 (추가)
    base_unit_id            UUID,                                                            -- 기준 단위 식별자 (추가 - 단위 환산용)
    conversion_rate         NUMERIC(18,6),                                                   -- 기준 단위 환산율 (추가 - 예: 1kg = 1000g)
    
    -- 상태 관리
    is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부
    is_base_unit            BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 단위 여부 (추가 - 유형별 기준)
    
    -- 단위 코드 형식 체크 (영대문자, 숫자 1-20자)
    CONSTRAINT ck_units__code                       CHECK (code ~ '^[A-Z0-9]{1,20}$'),
    
    -- 환산율 양수 체크
    CONSTRAINT ck_units__conversion_rate            CHECK (conversion_rate IS NULL OR conversion_rate > 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  adm.units                              IS '단위 테이블 - 재고, 수량, 길이, 무게 등의 측정 단위 관리';
COMMENT ON COLUMN adm.units.id                           IS '단위 고유 식별자 (UUID)';
COMMENT ON COLUMN adm.units.created_at                   IS '등록 일시';
COMMENT ON COLUMN adm.units.created_by                   IS '등록자 UUID';
COMMENT ON COLUMN adm.units.updated_at                   IS '수정 일시';
COMMENT ON COLUMN adm.units.updated_by                   IS '수정자 UUID';
COMMENT ON COLUMN adm.units.code                         IS '단위 코드 (영대문자, 숫자 1-20자, 예: EA, KG, M, L)';
COMMENT ON COLUMN adm.units.name                         IS '단위명 (한글명, 예: 개, 킬로그램, 미터, 리터)';
COMMENT ON COLUMN adm.units.name_en                      IS '단위명 (영문명, 예: Each, Kilogram, Meter, Liter)';
COMMENT ON COLUMN adm.units.unit_type                    IS '단위 유형 (QUANTITY: 개수, WEIGHT: 무게, LENGTH: 길이, VOLUME: 부피, AREA: 면적 등)';
COMMENT ON COLUMN adm.units.symbol                       IS '단위 심볼 (예: kg, m, L, ㎡)';
COMMENT ON COLUMN adm.units.base_unit_id                 IS '기준 단위 식별자 (단위 환산용, 예: g의 기준은 kg)';
COMMENT ON COLUMN adm.units.conversion_rate              IS '기준 단위 환산율 (예: 1kg = 1000g 이면 g의 환산율은 0.001)';
COMMENT ON COLUMN adm.units.is_active                    IS '활성 여부';
COMMENT ON COLUMN adm.units.is_base_unit                 IS '기준 단위 여부 (유형별 기준 단위 표시)';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_units__code 
    ON adm.units (code);
COMMENT ON INDEX ux_units__code IS '단위 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_units__unit_type 
    ON adm.units (unit_type)
 WHERE is_active = true;
COMMENT ON INDEX ix_units__unit_type IS '단위 유형별 조회 인덱스';

CREATE INDEX ix_units__is_active 
    ON adm.units (is_active);
COMMENT ON INDEX ix_units__is_active IS '활성 단위 조회 인덱스';

CREATE INDEX ix_units__base_unit_id 
    ON adm.units (base_unit_id)
 WHERE base_unit_id IS NOT NULL;
COMMENT ON INDEX ix_units__base_unit_id IS '기준 단위별 파생 단위 조회 인덱스';

-- 외래키 제약조건
-- 기준 단위 참조 (자기 참조)
ALTER TABLE adm.units 
  ADD CONSTRAINT fk_units__base_unit_id
    FOREIGN KEY (base_unit_id) 
    REFERENCES adm.units(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_units__base_unit_id ON adm.units IS '기준 단위 참조 외래키 (자기 참조, SET NULL 삭제)';

-- =====================================================================================
-- 완료: adm 스키마의 모든 테이블 정의
-- =====================================================================================
