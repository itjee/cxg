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
COMMENT ON INDEX adm.ux_exchange_rates__currencies_date_type IS '통화쌍별 날짜 및 유형 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_exchange_rates__currencies_date 
    ON adm.exchange_rates (from_currency, to_currency, rate_date DESC);
COMMENT ON INDEX adm.ix_exchange_rates__currencies_date IS '통화쌍 및 날짜별 환율 조회 인덱스 (최신순)';

CREATE INDEX ix_exchange_rates__rate_date 
    ON adm.exchange_rates (rate_date DESC);
COMMENT ON INDEX adm.ix_exchange_rates__rate_date IS '날짜별 환율 조회 인덱스 (최신순)';

CREATE INDEX ix_exchange_rates__from_currency 
    ON adm.exchange_rates (from_currency, rate_date DESC);
COMMENT ON INDEX adm.ix_exchange_rates__from_currency IS '기준 통화별 환율 조회 인덱스';

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
