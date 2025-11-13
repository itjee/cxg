-- =====================================================================================
-- 테이블: crm.customer_segments
-- 설명: 고객 세그먼트 관리 테이블
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.customer_segments 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세그먼트 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 세그먼트 기본 정보
    segment_code            VARCHAR(50)              NOT NULL,                               -- 세그먼트 코드
    segment_name            VARCHAR(200)             NOT NULL,                               -- 세그먼트명
    segment_type            VARCHAR(20)              NOT NULL,                               -- 세그먼트 유형
    description             TEXT,                                                            -- 설명
    
    -- 세그먼트 조건 (JSON)
    criteria                JSONB,                                                           -- 세그먼트 조건 (JSON)
    
    -- 통계 정보
    member_count            INTEGER                  DEFAULT 0,                              -- 회원 수
    last_calculated_at      TIMESTAMP WITH TIME ZONE,                                        -- 마지막 계산 일시
    
    -- 자동 업데이트 설정
    is_dynamic              BOOLEAN                  DEFAULT false,                          -- 동적 세그먼트 여부
    is_auto_update          BOOLEAN                  DEFAULT false,                          -- 자동 업데이트 여부
    update_frequency        VARCHAR(20),                                                     -- 업데이트 주기
    
    -- 담당자 정보
    owner_id                UUID,                                                            -- 담당자
    
    -- 상태 관리
    status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태
    is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 세그먼트 코드 형식 체크
    CONSTRAINT ck_customer_segments__code           CHECK (segment_code ~ '^[A-Z0-9_-]{2,50}$'),
    
    -- 세그먼트 유형 체크 (STATIC: 정적, DYNAMIC: 동적, BEHAVIORAL: 행동 기반, DEMOGRAPHIC: 인구통계)
    CONSTRAINT ck_customer_segments__type           CHECK (segment_type IN ('STATIC', 'DYNAMIC', 'BEHAVIORAL', 'DEMOGRAPHIC', 'GEOGRAPHIC', 'VALUE_BASED', 'CUSTOM')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, ARCHIVED: 보관)
    CONSTRAINT ck_customer_segments__status         CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    
    -- 업데이트 주기 체크 (HOURLY: 시간별, DAILY: 일별, WEEKLY: 주별, MONTHLY: 월별)
    CONSTRAINT ck_customer_segments__frequency      CHECK (update_frequency IS NULL OR update_frequency IN ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY')),
    
    -- 회원 수 음수 불가 체크
    CONSTRAINT ck_customer_segments__member_count   CHECK (member_count >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.customer_segments                  IS '고객 세그먼트 관리 테이블';
COMMENT ON COLUMN crm.customer_segments.id               IS '세그먼트 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.customer_segments.created_at       IS '등록 일시';
COMMENT ON COLUMN crm.customer_segments.created_by       IS '등록자 UUID';
COMMENT ON COLUMN crm.customer_segments.updated_at       IS '수정 일시';
COMMENT ON COLUMN crm.customer_segments.updated_by       IS '수정자 UUID';
COMMENT ON COLUMN crm.customer_segments.segment_code     IS '세그먼트 코드 (고유번호)';
COMMENT ON COLUMN crm.customer_segments.segment_name     IS '세그먼트명';
COMMENT ON COLUMN crm.customer_segments.segment_type     IS '세그먼트 유형 (STATIC/DYNAMIC/BEHAVIORAL/DEMOGRAPHIC/GEOGRAPHIC/VALUE_BASED/CUSTOM)';
COMMENT ON COLUMN crm.customer_segments.description      IS '설명';
COMMENT ON COLUMN crm.customer_segments.criteria         IS '세그먼트 조건 (JSON 형식, 예: {"industry": "IT", "revenue": ">1000000"})';
COMMENT ON COLUMN crm.customer_segments.member_count     IS '회원 수 (캐시)';
COMMENT ON COLUMN crm.customer_segments.last_calculated_at IS '마지막 계산 일시';
COMMENT ON COLUMN crm.customer_segments.is_dynamic       IS '동적 세그먼트 여부 (조건에 따라 자동 추가/제거)';
COMMENT ON COLUMN crm.customer_segments.is_auto_update     IS '자동 업데이트 여부';
COMMENT ON COLUMN crm.customer_segments.update_frequency IS '업데이트 주기 (HOURLY/DAILY/WEEKLY/MONTHLY)';
COMMENT ON COLUMN crm.customer_segments.owner_id         IS '담당자 UUID';
COMMENT ON COLUMN crm.customer_segments.status           IS '세그먼트 상태 (ACTIVE: 활성, INACTIVE: 비활성, ARCHIVED: 보관)';
COMMENT ON COLUMN crm.customer_segments.is_deleted       IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.customer_segments.notes            IS '비고';

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_customer_segments__code 
    ON crm.customer_segments (segment_code)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ux_customer_segments__code IS '세그먼트 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_customer_segments__name 
    ON crm.customer_segments (segment_name)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_segments__name IS '세그먼트명별 조회 인덱스';

CREATE INDEX ix_customer_segments__type 
    ON crm.customer_segments (segment_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_segments__type IS '세그먼트 유형별 조회 인덱스';

CREATE INDEX ix_customer_segments__status
    ON crm.customer_segments (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_segments__status IS '상태별 조회 인덱스';

CREATE INDEX ix_customer_segments__owner_id 
    ON crm.customer_segments (owner_id)
 WHERE owner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_customer_segments__owner_id IS '담당자별 조회 인덱스';

CREATE INDEX ix_customer_segments__criteria 
    ON crm.customer_segments USING GIN (criteria)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_customer_segments__criteria IS 'JSON 조건 검색 인덱스 (GIN)';

-- 외래키 제약조건
-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.customer_segments 
  ADD CONSTRAINT fk_customer_segments__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_customer_segments__owner_id ON crm.customer_segments IS '담당자 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.customer_segments 테이블 정의
-- =====================================================================================
