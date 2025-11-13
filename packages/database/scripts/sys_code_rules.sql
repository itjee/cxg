-- ============================================================================
-- 코드 규칙 관리 테이블 (Code Rules Management)
-- ============================================================================
-- 설명: 엔티티별 자동 생성 코드의 Prefix와 일련번호를 관리하는 테이블
-- 데이터베이스: tnnt_db (Tenant Database)
-- 스키마: sys (시스템 관리)
-- 생성일: 2024-10-20
-- ============================================================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS sys_code_rules (
    -- 기본키
    id                  BIGSERIAL PRIMARY KEY,
    
    -- 엔티티 정보
    entity_name         VARCHAR(100) NOT NULL,              -- 엔티티명 (예: 거래처, 제품, 창고)
    entity_code         VARCHAR(50) NOT NULL UNIQUE,        -- 엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)
    
    -- 코드 규칙
    prefix              CHAR(3) NOT NULL,                   -- 코드 Prefix (3자리 영문 대문자, 예: MCO, MPT, MWH)
    current_number      INTEGER NOT NULL DEFAULT 0,         -- 현재 일련번호 (다음 발급될 번호)
    digit_length        SMALLINT NOT NULL DEFAULT 4,        -- 일련번호 자릿수 (2-10)
    
    -- 추가 정보
    description         VARCHAR(500),                       -- 설명
    example_code        VARCHAR(20),                        -- 예시 코드 (자동 생성)
    
    -- 상태 관리
    status              VARCHAR(20) NOT NULL DEFAULT 'active',  -- 상태 (active: 활성, inactive: 비활성)
    
    -- 감사 정보
    created_by          BIGINT,                             -- 생성자 ID
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 생성일시
    updated_by          BIGINT,                             -- 수정자 ID
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 수정일시
    
    -- 제약 조건
    CONSTRAINT chk_prefix_format CHECK (prefix ~ '^[A-Z]{3}$'),  -- Prefix는 3자리 영문 대문자만
    CONSTRAINT chk_digit_length CHECK (digit_length BETWEEN 2 AND 10),  -- 자릿수는 2-10
    CONSTRAINT chk_current_number CHECK (current_number >= 0),  -- 일련번호는 0 이상
    CONSTRAINT chk_status CHECK (status IN ('active', 'inactive'))  -- 상태값 제한
);

-- 코멘트 추가
COMMENT ON TABLE sys_code_rules IS '엔티티별 코드 자동 생성 규칙 관리 테이블';
COMMENT ON COLUMN sys_code_rules.id IS '기본키';
COMMENT ON COLUMN sys_code_rules.entity_name IS '엔티티명 (한글)';
COMMENT ON COLUMN sys_code_rules.entity_code IS '엔티티 코드 (영문 대문자, UNIQUE)';
COMMENT ON COLUMN sys_code_rules.prefix IS '코드 Prefix (3자리 영문 대문자)';
COMMENT ON COLUMN sys_code_rules.current_number IS '현재 일련번호 (다음 발급될 번호)';
COMMENT ON COLUMN sys_code_rules.digit_length IS '일련번호 자릿수 (2-10)';
COMMENT ON COLUMN sys_code_rules.description IS '규칙 설명';
COMMENT ON COLUMN sys_code_rules.example_code IS '코드 형식 예시';
COMMENT ON COLUMN sys_code_rules.status IS '상태 (active/inactive)';
COMMENT ON COLUMN sys_code_rules.created_by IS '생성자 사용자 ID';
COMMENT ON COLUMN sys_code_rules.created_at IS '생성일시';
COMMENT ON COLUMN sys_code_rules.updated_by IS '수정자 사용자 ID';
COMMENT ON COLUMN sys_code_rules.updated_at IS '수정일시';

-- 인덱스 생성
CREATE INDEX idx_sys_code_rules_entity_code ON sys_code_rules(entity_code);
CREATE INDEX idx_sys_code_rules_status ON sys_code_rules(status);
CREATE INDEX idx_sys_code_rules_created_at ON sys_code_rules(created_at);

-- Updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_sys_code_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at 자동 업데이트 트리거
CREATE TRIGGER trg_sys_code_rules_updated_at
    BEFORE UPDATE ON sys_code_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_sys_code_rules_updated_at();

-- ============================================================================
-- 초기 데이터 삽입 (기본 엔티티)
-- ============================================================================

INSERT INTO sys_code_rules (entity_name, entity_code, prefix, current_number, digit_length, description, status) VALUES
    ('회사', 'COMPANY', 'MCO', 0, 3, '회사 코드 자동 생성 (Master Company)', 'active'),
    ('부서', 'DEPARTMENT', 'MDP', 0, 3, '부서 코드 자동 생성 (Master Department)', 'active'),
    ('거래처', 'PARTNER', 'MBP', 0, 4, '거래처 코드 자동 생성 (Master Business Partner)', 'active'),
    ('제품', 'PRODUCT', 'MPD', 0, 5, '제품 코드 자동 생성 (Master ProDuct)', 'active'),
    ('창고', 'WAREHOUSE', 'MWH', 0, 2, '창고 코드 자동 생성 (Master Warehouse)', 'active'),
    ('사원', 'EMPLOYEE', 'MEM', 0, 4, '사원 코드 자동 생성 (Master EMployee)', 'active')
ON CONFLICT (entity_code) DO NOTHING;

-- ============================================================================
-- 코드 생성 함수
-- ============================================================================

-- 다음 코드 생성 및 일련번호 증가 함수
CREATE OR REPLACE FUNCTION generate_next_code(p_entity_code VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    v_prefix VARCHAR(2);
    v_current_number INTEGER;
    v_digit_length SMALLINT;
    v_next_code VARCHAR(20);
BEGIN
    -- 코드 규칙 조회 및 일련번호 증가 (FOR UPDATE로 동시성 제어)
    SELECT prefix, current_number + 1, digit_length
    INTO v_prefix, v_current_number, v_digit_length
    FROM sys_code_rules
    WHERE entity_code = p_entity_code
        AND status = 'active'
    FOR UPDATE;
    
    -- 규칙이 없으면 에러
    IF NOT FOUND THEN
        RAISE EXCEPTION '코드 규칙을 찾을 수 없습니다: %', p_entity_code;
    END IF;
    
    -- 일련번호 업데이트
    UPDATE sys_code_rules
    SET current_number = v_current_number
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
    v_prefix VARCHAR(2);
    v_next_number INTEGER;
    v_digit_length SMALLINT;
    v_preview_code VARCHAR(20);
BEGIN
    -- 코드 규칙 조회
    SELECT prefix, current_number + 1, digit_length
    INTO v_prefix, v_next_number, v_digit_length
    FROM sys_code_rules
    WHERE entity_code = p_entity_code
        AND status = 'active';
    
    -- 규칙이 없으면 NULL 반환
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- 미리보기 코드 생성
    v_preview_code := v_prefix || LPAD(v_next_number::TEXT, v_digit_length, '0');
    
    RETURN v_preview_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION preview_next_code(VARCHAR) IS '엔티티 코드를 받아 다음 코드를 미리보기하는 함수 (일련번호 증가 안함)';

-- 현재 번호 조회 함수
CREATE OR REPLACE FUNCTION get_current_number(p_entity_code VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    v_current_number INTEGER;
BEGIN
    SELECT current_number
    INTO v_current_number
    FROM sys_code_rules
    WHERE entity_code = p_entity_code
        AND status = 'active';
    
    RETURN COALESCE(v_current_number, 0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_current_number(VARCHAR) IS '엔티티 코드의 현재 일련번호를 조회하는 함수';

-- ============================================================================
-- 사용 예시
-- ============================================================================
/*
-- 1. 다음 코드 생성 (일련번호 자동 증가)
SELECT generate_next_code('PARTNER');  -- 결과: MBP0001

-- 2. 다음 코드 미리보기 (일련번호 증가 안함)
SELECT preview_next_code('PRODUCT');   -- 결과: MPD00001

-- 3. 현재 번호 조회
SELECT get_current_number('WAREHOUSE'); -- 결과: 0

-- 4. 모든 코드 규칙 조회
SELECT 
    entity_name,
    entity_code,
    prefix,
    current_number,
    digit_length,
    prefix || LPAD((current_number + 1)::TEXT, digit_length, '0') AS next_code,
    status
FROM sys_code_rules
WHERE status = 'active'
ORDER BY entity_code;

-- 5. 코드 규칙 추가
INSERT INTO sys_code_rules (entity_name, entity_code, prefix, current_number, digit_length, description)
VALUES ('고객', 'CUSTOMER', 'CU', 0, 4, '고객 코드 자동 생성');

-- 6. 코드 규칙 수정
UPDATE sys_code_rules
SET digit_length = 5,
    description = '제품 코드 자동 생성 (5자리)'
WHERE entity_code = 'PRODUCT';

-- 7. 일련번호 초기화 (주의: 중복 코드 발생 가능)
UPDATE sys_code_rules
SET current_number = 0
WHERE entity_code = 'PARTNER';

-- 8. 코드 규칙 비활성화
UPDATE sys_code_rules
SET status = 'inactive'
WHERE entity_code = 'OLD_ENTITY';
*/

-- ============================================================================
-- 권한 설정 (필요시 사용)
-- ============================================================================
-- GRANT SELECT, INSERT, UPDATE ON sys_code_rules TO tenant_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE sys_code_rules_id_seq TO tenant_app_user;
-- GRANT EXECUTE ON FUNCTION generate_next_code(VARCHAR) TO tenant_app_user;
-- GRANT EXECUTE ON FUNCTION preview_next_code(VARCHAR) TO tenant_app_user;
-- GRANT EXECUTE ON FUNCTION get_current_number(VARCHAR) TO tenant_app_user;
