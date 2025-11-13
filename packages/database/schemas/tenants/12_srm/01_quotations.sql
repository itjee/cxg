-- =====================================================================================
-- 테이블: srm.quotations
-- 설명: 판매 견적서 헤더 관리 테이블
-- 작성일: 2025-01-20
-- 수정일: 2025-10-24 - 표준 형식 적용
-- =====================================================================================

CREATE TABLE IF NOT EXISTS srm.quotations 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 기본 정보
    quote_code              VARCHAR(50)              NOT NULL,                               -- 견적서 코드
    quote_date              DATE                     NOT NULL,                               -- 견적 일자
    customer_id             UUID                     NOT NULL,                               -- 고객 식별자    
    valid_until             DATE,                                                            -- 유효기간 만료일
    sales_person_id         UUID,                                                            -- 영업 담당자 식별자
    
    -- 금액 정보
    total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 상태 체크 (DRAFT: 임시저장, SENT: 발송, ACCEPTED: 수락, REJECTED: 거절, EXPIRED: 만료)
    CONSTRAINT ck_quotations__status                CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    
    -- 총 금액 음수 불가 체크 (0 이상)
    CONSTRAINT ck_quotations__total_amount          CHECK (total_amount >= 0),
    
    -- 통화 코드 형식 체크 (ISO 4217, 3자리 영문 대문자)
    CONSTRAINT ck_quotations__currency              CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 유효기간 체크 (전표일자보다 이후여야 함)
    CONSTRAINT ck_quotations__valid_until           CHECK (valid_until IS NULL OR valid_until >= quote_date)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  srm.quotations                         IS '판매 견적서 헤더 관리 테이블';
COMMENT ON COLUMN srm.quotations.id                      IS '견적서 고유 식별자 (UUID)';
COMMENT ON COLUMN srm.quotations.created_at              IS '등록 일시';
COMMENT ON COLUMN srm.quotations.created_by              IS '등록자 UUID';
COMMENT ON COLUMN srm.quotations.updated_at              IS '수정 일시';
COMMENT ON COLUMN srm.quotations.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN srm.quotations.quote_code              IS '견적서 코드 (견적번호)';
COMMENT ON COLUMN srm.quotations.quote_date              IS '견적 일자';
COMMENT ON COLUMN srm.quotations.customer_id             IS '고객 식별자';
COMMENT ON COLUMN srm.quotations.valid_until             IS '유효기간 만료일';
COMMENT ON COLUMN srm.quotations.sales_person_id         IS '영업 담당자 식별자';
COMMENT ON COLUMN srm.quotations.total_amount            IS '총 금액';
COMMENT ON COLUMN srm.quotations.currency                IS '통화 (ISO 4217)';
COMMENT ON COLUMN srm.quotations.status                  IS '상태 (DRAFT/SENT/ACCEPTED/REJECTED/EXPIRED)';
COMMENT ON COLUMN srm.quotations.is_deleted              IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_quotations__quote_code 
    ON srm.quotations (quote_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ux_quotations__quote_code IS '견적서 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_quotations__quote_code 
    ON srm.quotations (quote_code)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__quote_code IS '견적서 코드별 조회 인덱스';

CREATE INDEX ix_quotations__customer_id 
    ON srm.quotations (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__customer_id IS '고객별 견적서 조회 인덱스';

CREATE INDEX ix_quotations__sales_person_id 
    ON srm.quotations (sales_person_id)
 WHERE sales_person_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__sales_person_id IS '영업 담당자별 견적서 조회 인덱스';

CREATE INDEX ix_quotations__status 
    ON srm.quotations (status)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__status IS '상태별 견적서 조회 인덱스';

CREATE INDEX ix_quotations__quote_date 
    ON srm.quotations (quote_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__quote_date IS '전표 일자별 조회 인덱스';

CREATE INDEX ix_quotations__valid_until 
    ON srm.quotations (valid_until)
 WHERE valid_until IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX srm.ix_quotations__valid_until IS '유효기간별 조회 인덱스';

-- 외래키 제약조건
-- 고객 참조 (RESTRICT 삭제)
ALTER TABLE srm.quotations 
  ADD CONSTRAINT fk_quotations__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.partners(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_quotations__customer_id ON srm.quotations IS '고객 참조 외래키 (RESTRICT 삭제)';

-- 영업 담당자 참조 (SET NULL 삭제)
ALTER TABLE srm.quotations 
  ADD CONSTRAINT fk_quotations__sales_person_id
    FOREIGN KEY (sales_person_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_quotations__sales_person_id ON srm.quotations IS '영업 담당자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: srm.quotations 테이블 정의
-- =====================================================================================