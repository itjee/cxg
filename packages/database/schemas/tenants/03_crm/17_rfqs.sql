-- =====================================================================================
-- 테이블: crm.rfqs
-- 설명: 견적 요청서 헤더 관리 테이블 (Request for Quotation)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.rfqs 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 요청서 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 견적 요청서 기본 정보
    rfq_code                VARCHAR(50)              NOT NULL,                               -- 견적 요청서 코드
    title                   VARCHAR(200)             NOT NULL,                               -- 제목
    description             TEXT,                                                            -- 설명
    
    -- 고객 정보
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    contact_id              UUID,                                                            -- 담당자 ID
    
    -- 일정 정보
    request_date            DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 요청일
    due_date                DATE,                                                            -- 회신 마감일
    required_delivery_date  DATE,                                                            -- 납품 희망일
    
    -- 배송 정보
    delivery_address        TEXT,                                                            -- 배송 주소
    delivery_terms          VARCHAR(100),                                                    -- 배송 조건
    
    -- 결제 정보
    payment_terms           VARCHAR(100),                                                    -- 결제 조건
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화
    
    -- 담당자 정보
    owner_id                UUID,                                                            -- 담당 영업자
    
    -- 전환 정보
    converted_quote_id      UUID,                                                            -- 전환된 견적서 ID
    converted_at            TIMESTAMP WITH TIME ZONE,                                        -- 전환 일시
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    priority                VARCHAR(20)              DEFAULT 'NORMAL',                       -- 우선순위
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 견적 요청서 코드 형식 체크
    CONSTRAINT ck_rfqs__code                        CHECK (rfq_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 상태 체크 (DRAFT: 임시, SUBMITTED: 제출, IN_REVIEW: 검토중, QUOTED: 견적완료, DECLINED: 거절, CANCELLED: 취소)
    CONSTRAINT ck_rfqs__status                      CHECK (status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'QUOTED', 'DECLINED', 'CANCELLED')),
    
    -- 우선순위 체크
    CONSTRAINT ck_rfqs__priority                    CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_rfqs__currency                    CHECK (currency ~ '^[A-Z]{3}$')
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.rfqs                               IS '견적 요청서 헤더 관리 테이블 (Request for Quotation)';
COMMENT ON COLUMN crm.rfqs.id                            IS '견적 요청서 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.rfqs.created_at                    IS '등록 일시';
COMMENT ON COLUMN crm.rfqs.created_by                    IS '등록자 UUID';
COMMENT ON COLUMN crm.rfqs.updated_at                    IS '수정 일시';
COMMENT ON COLUMN crm.rfqs.updated_by                    IS '수정자 UUID';
COMMENT ON COLUMN crm.rfqs.rfq_code                      IS '견적 요청서 코드 (고유번호)';
COMMENT ON COLUMN crm.rfqs.title                         IS '제목';
COMMENT ON COLUMN crm.rfqs.description                   IS '설명';
COMMENT ON COLUMN crm.rfqs.partner_id                    IS '거래처 ID';
COMMENT ON COLUMN crm.rfqs.lead_id                       IS '리드 ID';
COMMENT ON COLUMN crm.rfqs.contact_id                    IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.rfqs.request_date                  IS '요청일';
COMMENT ON COLUMN crm.rfqs.due_date                      IS '회신 마감일';
COMMENT ON COLUMN crm.rfqs.required_delivery_date        IS '납품 희망일';
COMMENT ON COLUMN crm.rfqs.delivery_address              IS '배송 주소';
COMMENT ON COLUMN crm.rfqs.delivery_terms                IS '배송 조건';
COMMENT ON COLUMN crm.rfqs.payment_terms                 IS '결제 조건';
COMMENT ON COLUMN crm.rfqs.currency                      IS '통화 (ISO 4217)';
COMMENT ON COLUMN crm.rfqs.owner_id                      IS '담당 영업자 UUID';
COMMENT ON COLUMN crm.rfqs.converted_quote_id            IS '전환된 견적서 ID';
COMMENT ON COLUMN crm.rfqs.converted_at                  IS '전환 일시';
COMMENT ON COLUMN crm.rfqs.status                        IS '상태 (DRAFT/SUBMITTED/IN_REVIEW/QUOTED/DECLINED/CANCELLED)';
COMMENT ON COLUMN crm.rfqs.priority                      IS '우선순위 (URGENT/HIGH/NORMAL/LOW)';
COMMENT ON COLUMN crm.rfqs.is_deleted                    IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.rfqs.notes                         IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_rfqs__code 
    ON crm.rfqs (rfq_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_rfqs__code IS '견적 요청서 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_rfqs__partner_id 
    ON crm.rfqs (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_rfqs__lead_id 
    ON crm.rfqs (lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__lead_id IS '리드별 조회 인덱스';

CREATE INDEX ix_rfqs__owner_id 
    ON crm.rfqs (owner_id)
 WHERE owner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__owner_id IS '담당 영업자별 조회 인덱스';

CREATE INDEX ix_rfqs__status 
    ON crm.rfqs (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__status IS '상태별 조회 인덱스';

CREATE INDEX ix_rfqs__priority 
    ON crm.rfqs (priority)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__priority IS '우선순위별 조회 인덱스';

CREATE INDEX ix_rfqs__request_date 
    ON crm.rfqs (request_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__request_date IS '요청일별 조회 인덱스';

CREATE INDEX ix_rfqs__due_date 
    ON crm.rfqs (due_date)
 WHERE due_date IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_rfqs__due_date IS '마감일별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.rfqs 
  ADD CONSTRAINT fk_rfqs__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_rfqs__partner_id ON crm.rfqs IS '거래처 참조 외래키 (SET NULL 삭제)';

-- 리드 참조 (SET NULL 삭제)
ALTER TABLE crm.rfqs 
  ADD CONSTRAINT fk_rfqs__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_rfqs__lead_id ON crm.rfqs IS '리드 참조 외래키 (SET NULL 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.rfqs 
  ADD CONSTRAINT fk_rfqs__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_rfqs__contact_id ON crm.rfqs IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 담당 영업자 참조 (SET NULL 삭제)
ALTER TABLE crm.rfqs 
  ADD CONSTRAINT fk_rfqs__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_rfqs__owner_id ON crm.rfqs IS '담당 영업자 참조 외래키 (SET NULL 삭제)';

-- 견적서 참조 (SET NULL 삭제)
-- ALTER TABLE crm.rfqs 
--   ADD CONSTRAINT fk_rfqs__converted_quote_id
--     FOREIGN KEY (converted_quote_id) 
--     REFERENCES srm.quotations(id) 
--     ON DELETE SET NULL;
-- COMMENT ON CONSTRAINT fk_rfqs__converted_quote_id ON crm.rfqs IS '견적서 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.rfqs 테이블 정의
-- =====================================================================================
