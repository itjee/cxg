-- =====================================================================================
-- 테이블: crm.customer_contacts
-- 설명: 거래처 담당자 정보 관리 테이블 - 거래처별 연락 담당자 정보
-- 작성일: 2025-01-20
-- 수정일: 2025-01-22
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_contacts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 담당자 기본 정보
    customer_id             UUID                     NOT NULL,                               -- 거래처 식별자
    name                    VARCHAR(100)             NOT NULL,                               -- 담당자명
    name_en                 VARCHAR(100),                                                    -- 담당자명 (영문) (추가 - 다국어 지원)
    position                VARCHAR(100),                                                    -- 직책/직위
    department              VARCHAR(100),                                                    -- 소속 부서
    
    -- 연락처 정보
    phone                   VARCHAR(50),                                                     -- 직장 전화번호
    mobile                  VARCHAR(50),                                                     -- 휴대폰 번호
    email                   VARCHAR(255),                                                    -- 이메일 주소
    fax                     VARCHAR(50),                                                     -- 팩스번호 (추가)
    
    -- 설정 정보
    is_primary              BOOLEAN                  NOT NULL DEFAULT false,                 -- 주담당자 여부
    
    -- 메모 (추가)
    notes                   TEXT,                                                            -- 비고/메모 (추가)
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 이메일 형식 체크
    CONSTRAINT ck_customer_contacts__email          CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 전화번호 형식 체크
    CONSTRAINT ck_customer_contacts__phone          CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 휴대폰 형식 체크
    CONSTRAINT ck_customer_contacts__mobile         CHECK (mobile IS NULL OR mobile ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 연락처 필수 체크 (전화/휴대폰/이메일 중 최소 1개)
    CONSTRAINT ck_customer_contacts__contact_info   CHECK (phone IS NOT NULL OR mobile IS NOT NULL OR email IS NOT NULL),
    
    -- 상태 체크
    CONSTRAINT ck_customer_contacts__status         CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_contacts                  IS '거래처 담당자 정보 관리 테이블 - 거래처별 연락 담당자 정보';
COMMENT ON COLUMN crm.customer_contacts.id               IS '담당자 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_contacts.created_at       IS '등록 일시';
COMMENT ON COLUMN crm.customer_contacts.created_by       IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_contacts.updated_at       IS '수정 일시';
COMMENT ON COLUMN crm.customer_contacts.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_contacts.customer_id      IS '거래처 식별자';
COMMENT ON COLUMN crm.customer_contacts.name             IS '담당자명';
COMMENT ON COLUMN crm.customer_contacts.name_en          IS '담당자명 (영문, 다국어 지원)';
COMMENT ON COLUMN crm.customer_contacts.position         IS '직책/직위';
COMMENT ON COLUMN crm.customer_contacts.department       IS '소속 부서';
COMMENT ON COLUMN crm.customer_contacts.phone            IS '직장 전화번호';
COMMENT ON COLUMN crm.customer_contacts.mobile           IS '휴대폰 번호';
COMMENT ON COLUMN crm.customer_contacts.email            IS '이메일 주소';
COMMENT ON COLUMN crm.customer_contacts.fax              IS '팩스번호';
COMMENT ON COLUMN crm.customer_contacts.is_primary       IS '주담당자 여부';
COMMENT ON COLUMN crm.customer_contacts.notes            IS '비고/메모';
COMMENT ON COLUMN crm.customer_contacts.status           IS '상태 (ACTIVE: 활성, INACTIVE: 비활성)';
COMMENT ON COLUMN crm.customer_contacts.is_deleted       IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_customer_contacts__customer_name 
    ON crm.customer_contacts (customer_id, name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_customer_contacts__customer_name IS '거래처별 담당자명 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_contacts__email 
    ON crm.customer_contacts (email)
 WHERE email IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_contacts__email IS '이메일 유니크 제약 (삭제되지 않은 레코드만)';

CREATE UNIQUE INDEX ux_customer_contacts__mobile 
    ON crm.customer_contacts (mobile)
 WHERE mobile IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_customer_contacts__mobile IS '휴대폰번호 유니크 제약 (삭제되지 않은 레코드만)';

-- 일반 인덱스
CREATE INDEX ix_customer_contacts__customer_id 
    ON crm.customer_contacts (customer_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_contacts__customer_id IS '거래처별 담당자 조회 인덱스';

CREATE INDEX ix_customer_contacts__name 
    ON crm.customer_contacts (name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_contacts__name IS '담당자명별 조회 인덱스';

CREATE INDEX ix_customer_contacts__position 
    ON crm.customer_contacts (position)
 WHERE position IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_contacts__position IS '직책별 조회 인덱스';

CREATE INDEX ix_customer_contacts__is_primary 
    ON crm.customer_contacts (customer_id, is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_contacts__is_primary IS '주담당자 조회 인덱스';

CREATE INDEX ix_customer_contacts__status 
    ON crm.customer_contacts (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_contacts__status IS '상태별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조
ALTER TABLE crm.customer_contacts 
  ADD CONSTRAINT fk_customer_contacts__customer_id
    FOREIGN KEY (customer_id) 
    REFERENCES crm.customers(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_customer_contacts__customer_id ON crm.customer_contacts IS '거래처 참조 외래키 (CASCADE 삭제)';
