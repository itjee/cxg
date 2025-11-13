-- =====================================================================================
-- 테이블: crm.partner_managers
-- 설명: 거래처 담당자 배정 관리 테이블 - 자사 영업/관리 담당자 매핑
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - partners 통합 관리로 전환
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.partner_managers 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 배정 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 담당자 배정 기본 정보
    partner_id              UUID                     NOT NULL,                               -- 거래처 식별자
    employee_id             UUID                     NOT NULL,                               -- 담당 사원 식별자
    
    -- 담당 기간
    start_date              DATE                     NOT NULL,                               -- 담당 시작일
    end_date                DATE,                                                            -- 담당 종료일 (추가 - NULL이면 현재 담당)
    
    -- 담당자 유형 및 역할
    manager_type            VARCHAR(20)              NOT NULL DEFAULT 'PRIMARY',             -- 담당자 유형
    description             TEXT,                                                            -- 담당 업무/역할
    
    -- 추가 정보
    notes                   TEXT,                                                            -- 비고/메모
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 담당자 유형 체크
    CONSTRAINT ck_partner_managers__manager_type   CHECK (manager_type IN ('PRIMARY', 'SECONDARY', 'BACKUP', 'TECHNICAL', 'SALES', 'SUPPORT')),
    
    -- 상태 체크
    CONSTRAINT ck_partner_managers__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'TERMINATED')),
    
    -- 날짜 범위 체크 (종료일이 시작일 이후)
    CONSTRAINT ck_partner_managers__date_range     CHECK (end_date IS NULL OR end_date >= start_date)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.partner_managers                  IS '거래처 담당자 배정 관리 테이블 - 자사 영업/관리 담당자 매핑';
COMMENT ON COLUMN crm.partner_managers.id               IS '담당자 배정 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.partner_managers.created_at       IS '등록 일시';
COMMENT ON COLUMN crm.partner_managers.created_by       IS '등록자 UUID';
COMMENT ON COLUMN crm.partner_managers.updated_at       IS '수정 일시';
COMMENT ON COLUMN crm.partner_managers.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN crm.partner_managers.partner_id       IS '거래처 식별자';
COMMENT ON COLUMN crm.partner_managers.employee_id      IS '담당 사원 식별자';
COMMENT ON COLUMN crm.partner_managers.start_date       IS '담당 시작일';
COMMENT ON COLUMN crm.partner_managers.end_date         IS '담당 종료일 (NULL이면 현재 담당 중)';
COMMENT ON COLUMN crm.partner_managers.manager_type     IS '담당자 유형 (PRIMARY: 주담당, SECONDARY: 부담당, BACKUP: 백업, TECHNICAL: 기술, SALES: 영업, SUPPORT: 지원)';
COMMENT ON COLUMN crm.partner_managers.description      IS '담당 업무/역할';
COMMENT ON COLUMN crm.partner_managers.notes            IS '비고/메모';
COMMENT ON COLUMN crm.partner_managers.status           IS '상태 (ACTIVE: 활성, INACTIVE: 비활성, EXPIRED: 만료, TERMINATED: 종료)';
COMMENT ON COLUMN crm.partner_managers.is_deleted       IS '논리 삭제 플래그';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_partner_managers__customer_type_period 
    ON crm.partner_managers (partner_id, manager_type, start_date)
 WHERE is_deleted = false 
   AND end_date IS NULL;
COMMENT ON INDEX crm.ux_partner_managers__customer_type_period IS '고객별 담당자 유형 및 활성 기간 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_partner_managers__partner_id 
    ON crm.partner_managers (partner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__partner_id IS '고객별 담당자 조회 인덱스';

CREATE INDEX ix_partner_managers__employee_id 
    ON crm.partner_managers (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__employee_id IS '사원별 담당 고객 조회 인덱스';

CREATE INDEX ix_partner_managers__date_range 
    ON crm.partner_managers (start_date, end_date)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__date_range IS '담당 기간별 조회 인덱스';

CREATE INDEX ix_partner_managers__manager_type 
    ON crm.partner_managers (manager_type, partner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__manager_type IS '담당자 유형별 조회 인덱스';

CREATE INDEX ix_partner_managers__status 
    ON crm.partner_managers (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__status IS '상태별 조회 인덱스';

CREATE INDEX ix_partner_managers__active_assignments 
    ON crm.partner_managers (employee_id, partner_id)
 WHERE status = 'ACTIVE' 
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_partner_managers__active_assignments IS '활성 담당 배정 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조
ALTER TABLE crm.partner_managers 
  ADD CONSTRAINT fk_partner_managers__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_partner_managers__partner_id ON crm.partner_managers IS '거래처 참조 외래키 (CASCADE 삭제)';

-- 담당 사원 참조
ALTER TABLE crm.partner_managers 
  ADD CONSTRAINT fk_partner_managers__employee_id
    FOREIGN KEY (employee_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_partner_managers__employee_id ON crm.partner_managers IS '담당 사원 참조 외래키 (RESTRICT 삭제)';
