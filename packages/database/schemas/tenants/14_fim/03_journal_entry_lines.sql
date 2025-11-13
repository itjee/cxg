-- =====================================================================================
-- 테이블: fim.journal_entry_lines
-- 설명: 회계 분개 전표 상세 라인 정보 관리 (차변/대변)
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entry_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 분개 라인 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 분개 전표 참조
    je_id                   UUID                     NOT NULL,                               -- 분개 전표 식별자
    line_no                 INTEGER                  NOT NULL,                               -- 라인 번호 (순서)
    
    -- 계정 정보
    account_id              UUID                     NOT NULL,                               -- 계정과목 식별자
    
    -- 금액 정보
    debit_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 차변 금액
    credit_amount           NUMERIC(18,4)            DEFAULT 0,                              -- 대변 금액
    
    -- 상세 정보
    description             TEXT,                                                            -- 적요 (라인별 설명)
    
    -- 원가 및 관리 정보
    cost_center             VARCHAR(50),                                                     -- 원가센터 코드
    cost_center_id          UUID,                                                            -- 원가센터 식별자 (추가)
    project_code            VARCHAR(50),                                                     -- 프로젝트 코드
    project_id              UUID,                                                            -- 프로젝트 식별자 (추가)
    department_id           UUID,                                                            -- 부서 식별자 (추가)
    
    -- 거래처 정보
    partner_id              UUID,                                                            -- 거래처 식별자
    partner_type            VARCHAR(20),                                                     -- 거래처 유형 (추가)
    
    -- 세무 정보
    tax_code                VARCHAR(20),                                                     -- 세금 코드 (추가)
    tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)
    
    -- 수량 정보 (재고 관련)
    quantity                NUMERIC(15,3),                                                   -- 수량 (추가)
    unit_price              NUMERIC(18,4),                                                   -- 단가 (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 차변 또는 대변 중 하나만 입력 (둘 다 0이거나 둘 다 값이 있으면 안됨)
    CONSTRAINT ck_je_lines__debit_or_credit     CHECK ((debit_amount > 0 AND credit_amount = 0) OR (debit_amount = 0 AND credit_amount > 0)),
    
    -- 라인 번호 양수 체크
    CONSTRAINT ck_je_lines__line_no             CHECK (line_no > 0),
    
    -- 거래처 유형 체크
    CONSTRAINT ck_je_lines__partner_type        CHECK (partner_type IS NULL OR partner_type IN ('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'OTHER')),
    
    -- 분개 전표 참조 외래키 (CASCADE 삭제)
    CONSTRAINT fk_journal_entry_lines__je_id    FOREIGN KEY (je_id) REFERENCES fim.journal_entries(id) ON DELETE CASCADE,
    
    -- 계정과목 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_journal_entry_lines__account_id FOREIGN KEY (account_id) REFERENCES fim.accounts(id) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.journal_entry_lines                    IS '회계 분개 전표 상세 라인 정보 관리 테이블 (차변/대변)';
COMMENT ON COLUMN fim.journal_entry_lines.id                 IS '분개 라인 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.journal_entry_lines.created_at         IS '등록 일시';
COMMENT ON COLUMN fim.journal_entry_lines.created_by         IS '등록자 UUID';
COMMENT ON COLUMN fim.journal_entry_lines.updated_at         IS '수정 일시';
COMMENT ON COLUMN fim.journal_entry_lines.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN fim.journal_entry_lines.je_id              IS '분개 전표 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.line_no            IS '라인 번호 (순서)';
COMMENT ON COLUMN fim.journal_entry_lines.account_id         IS '계정과목 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.debit_amount       IS '차변 금액';
COMMENT ON COLUMN fim.journal_entry_lines.credit_amount      IS '대변 금액';
COMMENT ON COLUMN fim.journal_entry_lines.description        IS '적요 (라인별 설명)';
COMMENT ON COLUMN fim.journal_entry_lines.cost_center        IS '원가센터 코드';
COMMENT ON COLUMN fim.journal_entry_lines.cost_center_id     IS '원가센터 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.project_code       IS '프로젝트 코드';
COMMENT ON COLUMN fim.journal_entry_lines.project_id         IS '프로젝트 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.department_id      IS '부서 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.partner_id         IS '거래처 식별자';
COMMENT ON COLUMN fim.journal_entry_lines.partner_type       IS '거래처 유형 (CUSTOMER: 고객/VENDOR: 공급업체/EMPLOYEE: 임직원/OTHER: 기타)';
COMMENT ON COLUMN fim.journal_entry_lines.tax_code           IS '세금 코드';
COMMENT ON COLUMN fim.journal_entry_lines.tax_amount         IS '세액';
COMMENT ON COLUMN fim.journal_entry_lines.quantity           IS '수량 (재고 관련)';
COMMENT ON COLUMN fim.journal_entry_lines.unit_price         IS '단가';
COMMENT ON COLUMN fim.journal_entry_lines.is_deleted         IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_journal_entry_lines__je_id ON fim.journal_entry_lines IS '분개 전표 참조 외래키 (CASCADE 삭제)';
COMMENT ON CONSTRAINT fk_journal_entry_lines__account_id ON fim.journal_entry_lines IS '계정과목 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_journal_entry_lines__je_line
    ON fim.journal_entry_lines (je_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_journal_entry_lines__je_line IS '전표별 라인 번호 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_journal_entry_lines__je_id
    ON fim.journal_entry_lines (je_id, line_no)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entry_lines__je_id IS '전표별 라인 조회 인덱스';

CREATE INDEX ix_journal_entry_lines__account_id
    ON fim.journal_entry_lines (account_id)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entry_lines__account_id IS '계정과목별 분개 내역 조회 인덱스';

CREATE INDEX ix_journal_entry_lines__partner_id
    ON fim.journal_entry_lines (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entry_lines__partner_id IS '거래처별 분개 내역 조회 인덱스';

CREATE INDEX ix_journal_entry_lines__cost_center_id
    ON fim.journal_entry_lines (cost_center_id)
 WHERE cost_center_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entry_lines__cost_center_id IS '원가센터별 조회 인덱스';

CREATE INDEX ix_journal_entry_lines__project_id
    ON fim.journal_entry_lines (project_id)
 WHERE project_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entry_lines__project_id IS '프로젝트별 조회 인덱스';
