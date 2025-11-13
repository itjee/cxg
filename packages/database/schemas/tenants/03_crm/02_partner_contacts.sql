-- =====================================================================================
-- 테이블: crm.partner_contacts
-- 설명: 거래처 담당자 정보를 관리하는 테이블
-- 작성일: 2024-12-19
-- 수정일: 2025-10-23 - partners 통합 관리로 전환
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.partner_contacts 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by          UUID,                                                            -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by          UUID,                                                            -- 수정자 UUID
    
    -- 담당자 기본 정보
    partner_id          UUID                     NOT NULL,                               -- 거래처 식별자
    contact_name        VARCHAR(100)             NOT NULL,                               -- 담당자명
    position            VARCHAR(100),                                                    -- 직책/직위
    department          VARCHAR(100),                                                    -- 소속 부서
    
    -- 연락처 정보
    phone               VARCHAR(50),                                                     -- 직장 전화번호
    mobile              VARCHAR(50),                                                     -- 휴대폰 번호
    email               VARCHAR(255),                                                    -- 이메일 주소
    
    -- 담당 업무
    contact_type        VARCHAR(20),                                                     -- 업무 유형
    is_primary          BOOLEAN                  NOT NULL DEFAULT false,                 -- 주담당자 여부
    
    -- 비고
    notes               TEXT,                                                            -- 비고
    
    -- 상태 관리
    status              VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted          BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_partner_contacts__email           CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),  -- 이메일 형식 체크
    CONSTRAINT ck_partner_contacts__phone           CHECK (phone IS NULL OR phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),  -- 전화번호 형식 체크
    CONSTRAINT ck_partner_contacts__mobile          CHECK (mobile IS NULL OR mobile ~ '^[0-9\-\+\(\)\s]{8,20}$'),  -- 휴대폰 형식 체크
    CONSTRAINT ck_partner_contacts__contact_info    CHECK (phone IS NOT NULL OR mobile IS NOT NULL OR email IS NOT NULL),  -- 연락처 필수 체크
    CONSTRAINT ck_partner_contacts__contact_type    CHECK (contact_type IS NULL OR contact_type IN ('SALES', 'PURCHASING', 'ACCOUNTING', 'TECHNICAL', 'MANAGEMENT', 'OTHER')),  -- 업무 유형 체크
    CONSTRAINT ck_partner_contacts__status          CHECK (status IN ('ACTIVE', 'INACTIVE'))  -- 상태 체크
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  crm.partner_contacts               IS '거래처 담당자 정보 관리 테이블';
COMMENT ON COLUMN crm.partner_contacts.id            IS '담당자 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.partner_contacts.created_at    IS '등록 일시';
COMMENT ON COLUMN crm.partner_contacts.created_by    IS '등록자 UUID';
COMMENT ON COLUMN crm.partner_contacts.updated_at    IS '수정 일시';
COMMENT ON COLUMN crm.partner_contacts.updated_by    IS '수정자 UUID';
COMMENT ON COLUMN crm.partner_contacts.partner_id    IS '거래처 식별자';
COMMENT ON COLUMN crm.partner_contacts.contact_name  IS '담당자명';
COMMENT ON COLUMN crm.partner_contacts.position      IS '직책/직위';
COMMENT ON COLUMN crm.partner_contacts.department    IS '소속 부서';
COMMENT ON COLUMN crm.partner_contacts.phone         IS '직장 전화번호';
COMMENT ON COLUMN crm.partner_contacts.mobile        IS '휴대폰 번호';
COMMENT ON COLUMN crm.partner_contacts.email         IS '이메일 주소';
COMMENT ON COLUMN crm.partner_contacts.contact_type  IS '업무 유형 (SALES: 영업, PURCHASING: 구매, ACCOUNTING: 회계, TECHNICAL: 기술, MANAGEMENT: 경영진, OTHER: 기타)';
COMMENT ON COLUMN crm.partner_contacts.is_primary    IS '주담당자 여부';
COMMENT ON COLUMN crm.partner_contacts.notes         IS '비고';
COMMENT ON COLUMN crm.partner_contacts.status        IS '상태 (ACTIVE/INACTIVE)';
COMMENT ON COLUMN crm.partner_contacts.is_deleted    IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 일반 인덱스
CREATE INDEX ix_partner_contacts__partner_id
    ON crm.partner_contacts (partner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__partner_id IS '거래처별 담당자 조회 인덱스';

CREATE INDEX ix_partner_contacts__contact_name
    ON crm.partner_contacts (contact_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__contact_name IS '담당자명별 조회 인덱스';

CREATE INDEX ix_partner_contacts__email
    ON crm.partner_contacts (email)
 WHERE email IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__email IS '이메일별 조회 인덱스';

CREATE INDEX ix_partner_contacts__mobile
    ON crm.partner_contacts (mobile)
 WHERE mobile IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__mobile IS '휴대폰번호별 조회 인덱스';

CREATE INDEX ix_partner_contacts__position
    ON crm.partner_contacts (position)
 WHERE position IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__position IS '직책별 조회 인덱스';

CREATE INDEX ix_partner_contacts__department
    ON crm.partner_contacts (department)
 WHERE department IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__department IS '부서별 조회 인덱스';

CREATE INDEX ix_partner_contacts__contact_type
    ON crm.partner_contacts (contact_type)
 WHERE contact_type IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__contact_type IS '업무 유형별 조회 인덱스';

CREATE INDEX ix_partner_contacts__is_primary
    ON crm.partner_contacts (partner_id, is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_contacts__is_primary IS '주담당자 조회 인덱스';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_partner_contacts__partner_name
    ON crm.partner_contacts (partner_id, contact_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_partner_contacts__partner_name IS '거래처별 담당자명 유니크 제약';

CREATE UNIQUE INDEX ux_partner_contacts__email
    ON crm.partner_contacts (email)
 WHERE email IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_partner_contacts__email IS '이메일 유니크 제약';

CREATE UNIQUE INDEX ux_partner_contacts__mobile
    ON crm.partner_contacts (mobile)
 WHERE mobile IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX crm.ux_partner_contacts__mobile IS '휴대폰번호 유니크 제약';

-- =====================================================================================
-- 외래키 제약조건
-- =====================================================================================

-- 거래처 참조
ALTER TABLE crm.partner_contacts 
  ADD CONSTRAINT fk_partner_contacts__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_partner_contacts__partner_id ON crm.partner_contacts IS '거래처 참조 외래키 (CASCADE 삭제)';
