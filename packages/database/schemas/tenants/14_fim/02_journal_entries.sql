-- =====================================================================================
-- 테이블: fim.journal_entries
-- 설명: 회계 분개 전표 헤더 정보 관리
-- 작성일: 2025-01-20
-- 수정일: 2025-10-23 - DDL 표준 형식 적용, 인덱스 및 외래키 추가
-- =====================================================================================

CREATE TABLE IF NOT EXISTS fim.journal_entries 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 분개 전표 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 전표 기본 정보
    je_code                 VARCHAR(50)              NOT NULL,                               -- 분개 전표 코드
    je_type                 VARCHAR(20)              DEFAULT 'GENERAL',                      -- 전표 유형 (추가)
    je_date                 DATE                     NOT NULL,                               -- 전표 일자 (문서 일자)
    posting_date            DATE                     NOT NULL,                               -- 전기 일자
    period                  VARCHAR(7)               NOT NULL,                               -- 회계 기간 (YYYY-MM)
    fiscal_year             VARCHAR(4),                                                      -- 회계 연도 (추가)
    
    -- 참조 정보
    ref_doc_type            VARCHAR(50),                                                     -- 참조 문서 유형
    ref_doc_id              UUID,                                                            -- 참조 문서 식별자
    ref_doc_no              VARCHAR(100),                                                    -- 참조 번호 (추가)
    
    -- 금액 정보
    total_debit             NUMERIC(18,4)            DEFAULT 0,                              -- 총 차변 금액
    total_credit            NUMERIC(18,4)            DEFAULT 0,                              -- 총 대변 금액
    currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)
    exchange_rate           NUMERIC(15,6)            DEFAULT 1,                              -- 환율 (추가)
    
    -- 전표 내용
    description             TEXT,                                                            -- 적요 (전표 설명)
    memo                    TEXT,                                                            -- 메모 (추가)
    
    -- 상태 및 승인
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태
    posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시
    posted_by               UUID,                                                            -- 전기자 UUID
    approved_by             UUID,                                                            -- 승인자 UUID (추가)
    approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)
    reversed_je_id          UUID,                                                            -- 역분개 전표 ID (추가)
    
    -- 상태 관리
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 전표 유형 체크
    CONSTRAINT ck_journal_entries__je_type      CHECK (je_type IN ('GENERAL', 'PURCHASE', 'SALES', 'PAYROLL', 'ADJUSTMENT', 'CLOSING')),
    
    -- 상태 체크
    CONSTRAINT ck_journal_entries__status       CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED', 'CANCELLED')),
    
    -- 회계기간 형식 체크 (YYYY-MM)
    CONSTRAINT ck_journal_entries__period       CHECK (period ~ '^\d{4}-\d{2}$'),
    
    -- 차대평균 체크 (차변과 대변 합계 일치)
    CONSTRAINT ck_journal_entries__balance      CHECK (total_debit = total_credit),
    
    -- 통화 코드 형식 체크
    CONSTRAINT ck_journal_entries__currency     CHECK (currency ~ '^[A-Z]{3}$'),
    
    -- 환율 양수 체크
    CONSTRAINT ck_journal_entries__exchange_rate CHECK (exchange_rate > 0),
    
    -- 역분개 전표 참조 외래키 (SET NULL)
    CONSTRAINT fk_journal_entries__reversed_je_id FOREIGN KEY (reversed_je_id) REFERENCES fim.journal_entries(id) ON DELETE SET NULL,
    
    -- 통화 참조 외래키 (RESTRICT 삭제)
    CONSTRAINT fk_journal_entries__currency     FOREIGN KEY (currency) REFERENCES adm.currencies(code) ON DELETE RESTRICT
);

-- =====================================================================================
-- 테이블 및 컬럼 주석
-- =====================================================================================

COMMENT ON TABLE  fim.journal_entries                    IS '회계 분개 전표 헤더 정보 관리 테이블';
COMMENT ON COLUMN fim.journal_entries.id                 IS '분개 전표 고유 식별자 (UUID)';
COMMENT ON COLUMN fim.journal_entries.created_at         IS '등록 일시';
COMMENT ON COLUMN fim.journal_entries.created_by         IS '등록자 UUID';
COMMENT ON COLUMN fim.journal_entries.updated_at         IS '수정 일시';
COMMENT ON COLUMN fim.journal_entries.updated_by         IS '수정자 UUID';
COMMENT ON COLUMN fim.journal_entries.je_code            IS '분개 전표 코드';
COMMENT ON COLUMN fim.journal_entries.je_type            IS '전표 유형 (GENERAL: 일반/PURCHASE: 매입/SALES: 매출/PAYROLL: 급여/ADJUSTMENT: 조정/CLOSING: 결산)';
COMMENT ON COLUMN fim.journal_entries.je_date           IS '전표 일자 (문서 일자)';
COMMENT ON COLUMN fim.journal_entries.posting_date       IS '전기 일자';
COMMENT ON COLUMN fim.journal_entries.period             IS '회계 기간 (YYYY-MM)';
COMMENT ON COLUMN fim.journal_entries.fiscal_year        IS '회계 연도';
COMMENT ON COLUMN fim.journal_entries.ref_doc_type IS '참조 문서 유형 (구매전표/판매전표/급여전표 등)';
COMMENT ON COLUMN fim.journal_entries.ref_doc_id   IS '참조 문서 식별자';
COMMENT ON COLUMN fim.journal_entries.ref_doc_no   IS '참조 번호';
COMMENT ON COLUMN fim.journal_entries.total_debit        IS '총 차변 금액';
COMMENT ON COLUMN fim.journal_entries.total_credit       IS '총 대변 금액';
COMMENT ON COLUMN fim.journal_entries.currency           IS '통화 (ISO 4217)';
COMMENT ON COLUMN fim.journal_entries.exchange_rate      IS '환율';
COMMENT ON COLUMN fim.journal_entries.description        IS '적요 (전표 설명)';
COMMENT ON COLUMN fim.journal_entries.memo               IS '메모';
COMMENT ON COLUMN fim.journal_entries.status             IS '상태 (DRAFT: 임시저장/POSTED: 전기완료/REVERSED: 역분개/CANCELLED: 취소)';
COMMENT ON COLUMN fim.journal_entries.posted_at          IS '전기 일시';
COMMENT ON COLUMN fim.journal_entries.posted_by          IS '전기자 UUID';
COMMENT ON COLUMN fim.journal_entries.approved_by        IS '승인자 UUID';
COMMENT ON COLUMN fim.journal_entries.approved_at        IS '승인 일시';
COMMENT ON COLUMN fim.journal_entries.reversed_je_id     IS '역분개 전표 ID';
COMMENT ON COLUMN fim.journal_entries.is_deleted         IS '논리 삭제 플래그';

COMMENT ON CONSTRAINT fk_journal_entries__reversed_je_id ON fim.journal_entries IS '역분개 전표 참조 외래키 (SET NULL)';
COMMENT ON CONSTRAINT fk_journal_entries__currency ON fim.journal_entries IS '통화 참조 외래키 (RESTRICT 삭제)';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

-- 유니크 인덱스
CREATE UNIQUE INDEX ux_journal_entries__code
    ON fim.journal_entries (je_code)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ux_journal_entries__code IS '분개 전표 코드 유니크 제약';

-- 일반 인덱스
CREATE INDEX ix_journal_entries__posting_date
    ON fim.journal_entries (posting_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entries__posting_date IS '전기일자 조회 인덱스';

CREATE INDEX ix_journal_entries__period
    ON fim.journal_entries (period, status)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entries__period IS '회계기간 및 상태별 조회 인덱스';

CREATE INDEX ix_journal_entries__status
    ON fim.journal_entries (status, posting_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entries__status IS '상태 및 전기일자별 조회 인덱스';

CREATE INDEX ix_journal_entries__reference
    ON fim.journal_entries (ref_doc_type, ref_doc_id)
 WHERE ref_doc_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX fim.ix_journal_entries__reference IS '참조 문서별 조회 인덱스';
