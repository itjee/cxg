-- =====================================================================================
-- 테이블: sys.code_rules
-- 설명: 엔티티별 자동 생성 코드의 규칙 관리 테이블 (Prefix 및 일련번호)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS sys.code_rules 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 규칙 고유 식별자 (UUID)
    created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시
    created_by              UUID,                                                                        -- 등록자 UUID
    updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시
    updated_by              UUID,                                                                        -- 수정자 UUID
    
    -- 엔티티 정보
    entity_name             VARCHAR(100)             NOT NULL,                                           -- 엔티티명 (예: 거래처, 제품, 창고)
    entity_code             VARCHAR(50)              NOT NULL,                                           -- 엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)
    
    -- 코드 규칙
    prefix                  VARCHAR(3)               NOT NULL,                                           -- 코드 Prefix (3자리 영문 대문자, 예: MCO, MPT, MWH)
    current_number          INTEGER                  NOT NULL DEFAULT 0,                                 -- 현재 일련번호 (다음 발급될 번호)
    digit_length            SMALLINT                 NOT NULL DEFAULT 4,                                 -- 일련번호 자릿수 (2-10)
    
    -- 추가 정보
    description             TEXT,                                                                        -- 설명
    example_code            VARCHAR(20),                                                                 -- 예시 코드 (자동 생성)
    
    -- 상태 관리
    is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태
    is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그
    
    -- 제약조건
    -- Prefix 형식 체크 (3자리 영문 대문자)
    CONSTRAINT ck_code_rules__prefix_format     CHECK (prefix ~ '^[A-Z]{3}$'),
    
    -- 자릿수 범위 체크 (2-10)
    CONSTRAINT ck_code_rules__digit_length      CHECK (digit_length BETWEEN 2 AND 10),
    
    -- 일련번호 양수 체크
    CONSTRAINT ck_code_rules__current_number    CHECK (current_number >= 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  sys.code_rules                    IS '엔티티별 코드 자동 생성 규칙 관리 테이블 (Prefix 및 일련번호 관리)';
COMMENT ON COLUMN sys.code_rules.id                 IS '코드 규칙 고유 식별자 (UUID)';
COMMENT ON COLUMN sys.code_rules.created_at         IS '등록 일시';
COMMENT ON COLUMN sys.code_rules.created_by         IS '등록자 UUID';
COMMENT ON COLUMN sys.code_rules.updated_at         IS '수정 일시';
COMMENT ON COLUMN sys.code_rules.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN sys.code_rules.entity_name        IS '엔티티명 (예: 거래처, 제품, 창고)';
COMMENT ON COLUMN sys.code_rules.entity_code        IS '엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)';
COMMENT ON COLUMN sys.code_rules.prefix             IS '코드 Prefix (3자리 영문 대문자, 예: MBP, MPD, MWH)';
COMMENT ON COLUMN sys.code_rules.current_number     IS '현재 일련번호 (다음 발급될 번호)';
COMMENT ON COLUMN sys.code_rules.digit_length       IS '일련번호 자릿수 (2-10)';
COMMENT ON COLUMN sys.code_rules.description        IS '규칙 설명';
COMMENT ON COLUMN sys.code_rules.example_code       IS '코드 형식 예시 (예: MBP0001)';
COMMENT ON COLUMN sys.code_rules.is_active          IS '활성 상태';
COMMENT ON COLUMN sys.code_rules.is_deleted         IS '논리 삭제 플래그';

-- 유니크 인덱스
-- 엔티티 코드 유니크
CREATE UNIQUE INDEX IF NOT EXISTS ux_code_rules__entity_code
    ON sys.code_rules (entity_code)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_code_rules__entity_code IS '엔티티 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX IF NOT EXISTS ix_code_rules__is_active
    ON sys.code_rules (is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_code_rules__is_active IS '활성 상태별 조회 인덱스';

-- =====================================================================================
-- 코드 생성 함수들
-- =====================================================================================

-- 다음 코드 생성 및 일련번호 증가 함수
CREATE OR REPLACE FUNCTION generate_next_code(p_entity_code VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    v_prefix VARCHAR(3);
    v_current_number INTEGER;
    v_digit_length SMALLINT;
    v_next_code VARCHAR(20);
BEGIN
    -- 코드 규칙 조회 및 일련번호 증가 (FOR UPDATE로 동시성 제어)
    SELECT prefix, current_number + 1, digit_length
    INTO v_prefix, v_current_number, v_digit_length
    FROM sys.code_rules
    WHERE entity_code = p_entity_code
        AND is_active = true
        AND is_deleted = false
    FOR UPDATE;
    
    -- 규칙이 없으면 에러
    IF NOT FOUND THEN
        RAISE EXCEPTION '코드 규칙을 찾을 수 없습니다: %', p_entity_code;
    END IF;
    
    -- 일련번호 업데이트
    UPDATE sys.code_rules
    SET current_number = v_current_number,
        updated_at = CURRENT_TIMESTAMP
    WHERE entity_code = p_entity_code;
    
    -- 코드 생성 (Prefix + 0으로 패딩된 번호)
    v_next_code := v_prefix || LPAD(v_current_number::TEXT, v_digit_length, '0');
    
    RETURN v_next_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_next_code(VARCHAR) IS '엔티티 코드를 받아 다음 코드를 생성하고 일련번호를 증가시키는 함수';

-- 다음 코드 미리보기 함수 (일련번호 증가 없이)
CREATE OR REPLACE FUNCTION preview_next_code(p_entity_code VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    v_prefix VARCHAR(3);
    v_next_number INTEGER;
    v_digit_length SMALLINT;
    v_preview_code VARCHAR(20);
BEGIN
    -- 코드 규칙 조회
    SELECT prefix, current_number + 1, digit_length
    INTO v_prefix, v_next_number, v_digit_length
    FROM sys.code_rules
    WHERE entity_code = p_entity_code
        AND is_active = true
        AND is_deleted = false;
    
    -- 규칙이 없으면 NULL 반환
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- 미리보기 코드 생성
    v_preview_code := v_prefix || LPAD(v_next_number::TEXT, v_digit_length, '0');
    
    RETURN v_preview_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION preview_next_code(VARCHAR) IS '엔티티 코드를 받아 다음 코드를 미리보기하는 함수 (일련번호 증가 없음)';

-- 현재 번호 조회 함수
CREATE OR REPLACE FUNCTION get_current_number(p_entity_code VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    v_current_number INTEGER;
BEGIN
    SELECT current_number
    INTO v_current_number
    FROM sys.code_rules
    WHERE entity_code = p_entity_code
        AND is_active = true
        AND is_deleted = false;
    
    RETURN COALESCE(v_current_number, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_current_number(VARCHAR) IS '엔티티 코드의 현재 일련번호를 조회하는 함수';

-- =====================================================================================
-- 초기 데이터 삽입 (기본 엔티티)
-- =====================================================================================

INSERT INTO sys.code_rules (entity_name, entity_code, prefix, current_number, digit_length, description, example_code, is_active) VALUES
    ('회사', 'COMPANY', 'MCO', 0, 3, '회사 코드 자동 생성 (Master Company)', 'MCO001', true),
    ('부서', 'DEPARTMENT', 'MDP', 0, 3, '부서 코드 자동 생성 (Master Department)', 'MDP001', true),
    ('거래처', 'PARTNER', 'MBP', 0, 4, '거래처 코드 자동 생성 (Master Business Partner)', 'MBP0001', true),
    ('제품', 'PRODUCT', 'MPD', 0, 5, '제품 코드 자동 생성 (Master ProDuct)', 'MPD00001', true),
    ('창고', 'WAREHOUSE', 'MWH', 0, 2, '창고 코드 자동 생성 (Master Warehouse)', 'MWH01', true),
    ('사원', 'EMPLOYEE', 'MEM', 0, 4, '사원 코드 자동 생성 (Master EMployee)', 'MEM0001', true)
ON CONFLICT (entity_code) WHERE is_deleted = false DO NOTHING;
