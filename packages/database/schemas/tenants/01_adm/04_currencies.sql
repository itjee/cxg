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
COMMENT ON INDEX adm.ux_currencies__code IS '통화 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_currencies__is_active 
    ON adm.currencies (is_active);
COMMENT ON INDEX adm.ix_currencies__is_active IS '활성 통화 조회 인덱스';

CREATE INDEX ix_currencies__is_base_currency 
    ON adm.currencies (is_base_currency)
 WHERE is_base_currency = true;
COMMENT ON INDEX adm.ix_currencies__is_base_currency IS '기준 통화 조회 인덱스';
