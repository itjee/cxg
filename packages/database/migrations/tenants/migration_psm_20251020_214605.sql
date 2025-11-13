-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: psm
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: psm.edi_files
-- 레거시: TMM_EDI_FILE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.edi_files (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    edi_docu_number                CHAR(15)                       NOT NULL  ,  -- [LEGACY] EDI_DOCU_NO
    seq                            INTEGER                        NOT NULL  ,  -- [LEGACY] SEQ
    report_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] REPORT_DT
    edi_type                       CHAR(3)                        NOT NULL  ,  -- [LEGACY] EDI_TP
    edi_filepath                   VARCHAR(500)                             ,  -- [LEGACY] EDI_FILEPATH
    edi_filename                   VARCHAR(200)                             ,  -- [LEGACY] EDI_FILENAME
    edi_filesize                   DOUBLE PRECISION                         ,  -- [LEGACY] EDI_FILESIZE
    send_date                      TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] SEND_DT
    send_by                        VARCHAR(50)                              ,  -- [LEGACY] SEND_BY
    send_id                        INTEGER                                  ,  -- [LEGACY] SEND_ID
    send_flag                      CHAR(1)                                  ,  -- [LEGACY] SEND_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.edi_files
IS '레거시 테이블 TMM_EDI_FILE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_edi_files__is_deleted
    ON psm.edi_files (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.edi_file_po
-- 레거시: TMM_EDI_FILE_PO
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.edi_file_po (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    edi_file_number                VARCHAR(30)                    NOT NULL  ,  -- [LEGACY] EDI_FILE_NO
    edi_purc_ord_number            VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] EDI_PURC_ORD_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.edi_file_po
IS '레거시 테이블 TMM_EDI_FILE_PO에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_edi_file_po__is_deleted
    ON psm.edi_file_po (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.edi_file_sal
-- 레거시: TMM_EDI_FILE_SAL
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.edi_file_sal (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    edi_file_number                VARCHAR(30)                    NOT NULL  ,  -- [LEGACY] EDI_FILE_NO
    edi_sale_number                VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] EDI_SALE_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.edi_file_sal
IS '레거시 테이블 TMM_EDI_FILE_SAL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_edi_file_sal__is_deleted
    ON psm.edi_file_sal (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_dct
-- 레거시: TMM_PURC_DCT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_dct (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_dct_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_DCT_NO
    purc_dct_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_DCT_TP
    purc_dct_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_DCT_DT
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    tot_sup_amt                    NUMERIC(17, 2)                           ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                           ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                           ,  -- [LEGACY] TOT_SUM_AMT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    purc_id                        INTEGER                                  ,  -- [LEGACY] PURC_ID
    ix_tmm_purc_dct__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__CUST_CD
    ix_tmm_purc_dct__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__DEPT_CD
    ix_tmm_purc_dct__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__EAS_SIGN_ID
    ix_tmm_purc_dct__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__EMPY_CD
    ix_tmm_purc_dct__proc_st       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__PROC_ST
    ix_tmm_purc_dct__purc_dct_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__PURC_DCT_DT
    ix_tmm_purc_dct__purc_dct_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__PURC_DCT_TP
    ix_tmm_purc_dct__purc_id       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT__PURC_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_dct
IS '레거시 테이블 TMM_PURC_DCT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_dct__is_deleted
    ON psm.purc_dct (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_dct_product
-- 레거시: TMM_PURC_DCT_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_dct_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_dct_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_DCT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    purc_dct_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_DCT_QTY
    purc_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tmm_purc_dct_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT_PRDT__PRDT_CD
    ix_tmm_purc_dct_prdt__purc_dct_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_DCT_PRDT__PURC_DCT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_dct_product
IS '레거시 테이블 TMM_PURC_DCT_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_dct_product__is_deleted
    ON psm.purc_dct_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_files
-- 레거시: TMM_PURC_FILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_files (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    purc_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_NO
    file_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_SEQ
    file_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_ID
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    reg_datem                      TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] REG_DTM
    reg_emp_number                 VARCHAR(8)                     NOT NULL  ,  -- [LEGACY] REG_EMP_NO
    upd_datem                      TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPD_DTM
    upd_emp_number                 VARCHAR(8)                               ,  -- [LEGACY] UPD_EMP_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_files
IS '레거시 테이블 TMM_PURC_FILES에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_files__is_deleted
    ON psm.purc_files (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purcs
-- 레거시: TMM_PURC_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purcs (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_NO
    purc_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_DT
    slip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SLIP_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    gift_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] GIFT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    org_purc_number                CHAR(14)                                 ,  -- [LEGACY] ORG_PURC_NO
    purc_ord_id                    INTEGER                                  ,  -- [LEGACY] PURC_ORD_ID
    tax_bill_number                VARCHAR(100)                             ,  -- [LEGACY] TAX_BILL_NO
    lad_bill_number                VARCHAR(100)                             ,  -- [LEGACY] LAD_BILL_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tmm_purc_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__CUST_CD
    ix_tmm_purc_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__DEPT_CD
    ix_tmm_purc_mst__lad_bill_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__LAD_BILL_NO
    ix_tmm_purc_mst__org_purc_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__ORG_PURC_NO
    ix_tmm_purc_mst__path_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__PATH_TP
    ix_tmm_purc_mst__purc_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__PURC_DT
    ix_tmm_purc_mst__purc_ord_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__PURC_ORD_ID
    ix_tmm_purc_mst__slip_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__SLIP_TP
    ix_tmm_purc_mst__tax_bill_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__TAX_BILL_NO
    ix_tmm_purc_mst__whse_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purcs
IS '레거시 테이블 TMM_PURC_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purcs__is_deleted
    ON psm.purcs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_mst_history
-- 레거시: TMM_PURC_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_mst_history (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    hist_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] HIST_TP
    hist_on                        TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] HIST_ON
    id                             INTEGER                        NOT NULL  ,  -- [LEGACY] ID
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_NO
    purc_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_DT
    slip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SLIP_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    gift_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] GIFT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    org_purc_number                CHAR(14)                                 ,  -- [LEGACY] ORG_PURC_NO
    purc_ord_id                    INTEGER                                  ,  -- [LEGACY] PURC_ORD_ID
    tax_bill_number                VARCHAR(100)                             ,  -- [LEGACY] TAX_BILL_NO
    lad_bill_number                VARCHAR(50)                              ,  -- [LEGACY] LAD_BILL_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_mst_history
IS '레거시 테이블 TMM_PURC_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_mst_history__is_deleted
    ON psm.purc_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_mst_product
-- 레거시: TMM_PURC_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_mst_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] PURC_USD_AMT
    purc_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    purc_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] PURC_ORD_PRDT_ID
    lad_bill_number                VARCHAR(100)                             ,  -- [LEGACY] LAD_BILL_NO
    ix_tmm_purc_mst_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT__PRDT_CD
    ix_tmm_purc_mst_prdt__purc_id  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT__PURC_ID
    ix_tmm_purc_mst_prdt__purc_ord_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT__PURC_ORD_PRDT_ID
    ix_tmm_purc_mst_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_mst_product
IS '레거시 테이블 TMM_PURC_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_mst_product__is_deleted
    ON psm.purc_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_mst_product_history
-- 레거시: TMM_PURC_MST_PRDT_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_mst_product_history (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    hist_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] HIST_TP
    hist_on                        TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] HIST_ON
    id                             INTEGER                        NOT NULL  ,  -- [LEGACY] ID
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] PURC_USD_AMT
    purc_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    purc_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] PURC_ORD_PRDT_ID
    lad_bill_number                VARCHAR(100)                             ,  -- [LEGACY] LAD_BILL_NO
    ix_tmm_purc_mst_prdt_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT_HIST__HIST_TP
    ix_tmm_purc_mst_prdt_hist__id  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRDT_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_mst_product_history
IS '레거시 테이블 TMM_PURC_MST_PRDT_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_mst_product_history__is_deleted
    ON psm.purc_mst_product_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_mst_price
-- 레거시: TMM_PURC_MST_PRICE
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_mst_price (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_ID
    purc_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_PRDT_ID
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    usd_purc_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_AMT
    str_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] STR_FEE_AMT
    ins_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INS_FEE_AMT
    thc_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] THC_FEE_AMT
    dty_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DTY_FEE_AMT
    cle_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLE_FEE_AMT
    fre_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] FRE_FEE_AMT
    hnc_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] HNC_FEE_AMT
    tot_fee_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_FEE_AMT
    net_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NET_PURC_PR
    fee_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] FEE_PURC_PR
    pass_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PASS_DT
    lcns_date                      CHAR(8)                                  ,  -- [LEGACY] LCNS_DT
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    krw_purc_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_AMT
    ix_tmm_purc_mst_price__purc_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_PRICE__PURC_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_mst_price
IS '레거시 테이블 TMM_PURC_MST_PRICE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_mst_price__is_deleted
    ON psm.purc_mst_price (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_mst_upload
-- 레거시: TMM_PURC_MST_UPLOAD
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_mst_upload (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                                  ,  -- [LEGACY] BASE_DT
    purc_number                    CHAR(14)                                 ,  -- [LEGACY] PURC_NO
    purc_date                      CHAR(8)                                  ,  -- [LEGACY] PURC_DT
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                                 ,  -- [LEGACY] WHSE_CD
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    prdt_code                      CHAR(14)                                 ,  -- [LEGACY] PRDT_CD
    model_name                     VARCHAR(100)                             ,  -- [LEGACY] MODEL_NM
    purc_qty                       INTEGER                                  ,  -- [LEGACY] PURC_QTY
    usd_purc_pr                    NUMERIC(17, 4)                           ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                           ,  -- [LEGACY] KRW_PURC_PR
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    prdt_3pl_code                  VARCHAR(20)                              ,  -- [LEGACY] PRDT_3PL_CD
    old_prdt_code                  VARCHAR(100)                             ,  -- [LEGACY] OLD_PRDT_CD
    old_prdt_name                  VARCHAR(200)                             ,  -- [LEGACY] OLD_PRDT_NM
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    proc_msg                       TEXT                                     ,  -- [LEGACY] PROC_MSG
    ix_tmm_purc_mst_upload__base_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_UPLOAD__BASE_DT
    ix_tmm_purc_mst_upload__proc_st TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_UPLOAD__PROC_ST
    ix_tmm_purc_mst_upload__purc_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_MST_UPLOAD__PURC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_mst_upload
IS '레거시 테이블 TMM_PURC_MST_UPLOAD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_mst_upload__is_deleted
    ON psm.purc_mst_upload (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_ord
-- 레거시: TMM_PURC_ORD
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_ord (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_ord_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_ORD_NO
    purc_ord_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_ORD_DT
    purc_ord_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_ORD_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    gift_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] GIFT_TP
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    paym_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PAYM_YN
    paym_dc_rat                    NUMERIC(5, 2)                  NOT NULL  ,  -- [LEGACY] PAYM_DC_RAT
    paym_dc_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PAYM_DC_AMT
    refr_number                    VARCHAR(100)                             ,  -- [LEGACY] REFR_NO
    rent_mst_id                    INTEGER                                  ,  -- [LEGACY] RENT_MST_ID
    sale_ord_id                    INTEGER                                  ,  -- [LEGACY] SALE_ORD_ID
    crm_oppr_id                    INTEGER                                  ,  -- [LEGACY] CRM_OPPR_ID
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    delv_rcv_id                    INTEGER                                  ,  -- [LEGACY] DELV_RCV_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    proc_mst_id                    INTEGER                                  ,  -- [LEGACY] PROC_MST_ID
    ix_tmm_purc_ord__crm_oppr_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__CRM_OPPR_ID
    ix_tmm_purc_ord__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__CUST_CD
    ix_tmm_purc_ord__delv_rcv_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__DELV_RCV_ID
    ix_tmm_purc_ord__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__DEPT_CD
    ix_tmm_purc_ord__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__DWEL_ORD_ID
    ix_tmm_purc_ord__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__EAS_SIGN_ID
    ix_tmm_purc_ord__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__EMPY_CD
    ix_tmm_purc_ord__gift_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__GIFT_TP
    ix_tmm_purc_ord__path_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PATH_TP
    ix_tmm_purc_ord__proc_st       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PROC_ST
    ix_tmm_purc_ord__purc_ord_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PURC_ORD_DT
    ix_tmm_purc_ord__purc_ord_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PURC_ORD_NO
    ix_tmm_purc_ord__purc_ord_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PURC_ORD_TP
    ix_tmm_purc_ord__purc_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__PURC_TP
    ix_tmm_purc_ord__sale_ord_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__SALE_ORD_ID
    ix_tmm_purc_ord__whse_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_ord
IS '레거시 테이블 TMM_PURC_ORD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_ord__is_deleted
    ON psm.purc_ord (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_ord_product
-- 레거시: TMM_PURC_ORD_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_ord_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_ord_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_ORD_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    usd_purc_pr                    NUMERIC(17, 4)                           ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    vat_purc_pr                    NUMERIC(17, 2)                           ,  -- [LEGACY] VAT_PURC_PR
    purc_ord_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_ORD_QTY
    purc_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] PURC_USD_AMT
    purc_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    purc_rcv_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_RCV_DT
    fnsh_flag                      CHAR(1)                                  ,  -- [LEGACY] FNSH_YN
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    sale_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] SALE_ORD_PRDT_ID
    purc_req_prdt_id               INTEGER                                  ,  -- [LEGACY] PURC_REQ_PRDT_ID
    lad_bill_number                VARCHAR(100)                             ,  -- [LEGACY] LAD_BILL_NO
    ix_tmm_purc_ord_prdt__fnsh_flag TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__FNSH_YN
    ix_tmm_purc_ord_prdt__lad_bill_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__LAD_BILL_NO
    ix_tmm_purc_ord_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__PRDT_CD
    ix_tmm_purc_ord_prdt__purc_ord_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__PURC_ORD_ID
    ix_tmm_purc_ord_prdt__purc_rcv_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__PURC_RCV_DT
    ix_tmm_purc_ord_prdt__purc_req_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__PURC_REQ_PRDT_ID
    ix_tmm_purc_ord_prdt__sale_ord_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_ORD_PRDT__SALE_ORD_PRDT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_ord_product
IS '레거시 테이블 TMM_PURC_ORD_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_ord_product__is_deleted
    ON psm.purc_ord_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_price_bl
-- 레거시: TMM_PURC_PRICE_BL
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_price_bl (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    bl_number                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] BL_NO
    storage_fee                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] STORAGE_FEE
    insurance_fee                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INSURANCE_FEE
    thc_fee                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] THC_FEE
    duty_fee                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DUTY_FEE
    clearance_fee                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLEARANCE_FEE
    freight_fee                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] FREIGHT_FEE
    hc_fee                         NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] HC_FEE
    total_fee                      NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOTAL_FEE
    reg_datem                      TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] REG_DTM
    reg_emp_number                 VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] REG_EMP_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_price_bl
IS '레거시 테이블 TMM_PURC_PRICE_BL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_price_bl__is_deleted
    ON psm.purc_price_bl (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_req
-- 레거시: TMM_PURC_REQ
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_req (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_req_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_REQ_NO
    purc_req_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_REQ_DT
    purc_rcv_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_RCV_DT
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    crm_oppr_id                    INTEGER                                  ,  -- [LEGACY] CRM_OPPR_ID
    sale_ord_id                    INTEGER                                  ,  -- [LEGACY] SALE_ORD_ID
    ix_tmm_purc_req__crm_oppr_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__CRM_OPPR_ID
    ix_tmm_purc_req__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__CUST_CD
    ix_tmm_purc_req__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__DEPT_CD
    ix_tmm_purc_req__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__EMPY_CD
    ix_tmm_purc_req__path_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__PATH_TP
    ix_tmm_purc_req__proc_st       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__PROC_ST
    ix_tmm_purc_req__purc_rcv_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__PURC_RCV_DT
    ix_tmm_purc_req__purc_req_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__PURC_REQ_DT
    ix_tmm_purc_req__sale_ord_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ__SALE_ORD_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_req
IS '레거시 테이블 TMM_PURC_REQ에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_req__is_deleted
    ON psm.purc_req (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_req_product
-- 레거시: TMM_PURC_REQ_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_req_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_req_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_REQ_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    purc_req_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_REQ_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    sale_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] SALE_ORD_PRDT_ID
    ix_tmm_purc_req_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ_PRDT__PRDT_CD
    ix_tmm_purc_req_prdt__purc_req_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ_PRDT__PURC_REQ_ID
    ix_tmm_purc_req_prdt__sale_ord_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_REQ_PRDT__SALE_ORD_PRDT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_req_product
IS '레거시 테이블 TMM_PURC_REQ_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_req_product__is_deleted
    ON psm.purc_req_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rma
-- 레거시: TMM_PURC_RMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rma (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rma_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_RMA_NO
    purc_rma_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_RMA_DT
    purc_rma_type                  CHAR(3)                        NOT NULL  ,  -- [LEGACY] PURC_RMA_TP
    vndr_rma_number                VARCHAR(50)                              ,  -- [LEGACY] VNDR_RMA_NO
    expt_rpt_number                VARCHAR(50)                              ,  -- [LEGACY] EXPT_RPT_NO
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    shpt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SHPT_DT
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tmm_purc_rma__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__CUST_CD
    ix_tmm_purc_rma__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__DEPT_CD
    ix_tmm_purc_rma__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__EMPY_CD
    ix_tmm_purc_rma__expt_rpt_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__EXPT_RPT_NO
    ix_tmm_purc_rma__proc_st       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__PROC_ST
    ix_tmm_purc_rma__purc_rma_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__PURC_RMA_DT
    ix_tmm_purc_rma__purc_rma_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__PURC_RMA_TP
    ix_tmm_purc_rma__shpt_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__SHPT_DT
    ix_tmm_purc_rma__vndr_rma_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__VNDR_RMA_NO
    ix_tmm_purc_rma__whse_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rma
IS '레거시 테이블 TMM_PURC_RMA에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rma__is_deleted
    ON psm.purc_rma (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rma_back
-- 레거시: TMM_PURC_RMA_BACK
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rma_back (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rma_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RMA_PRDT_ID
    back_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BACK_DT
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_sn                        VARCHAR(50)                              ,  -- [LEGACY] PRDT_SN
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    back_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] BACK_QTY
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tmm_purc_rma_back__back_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_BACK__BACK_DT
    ix_tmm_purc_rma_back__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_BACK__PRDT_CD
    ix_tmm_purc_rma_back__prdt_sn  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_BACK__PRDT_SN
    ix_tmm_purc_rma_back__purc_rma_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_BACK__PURC_RMA_PRDT_ID
    ix_tmm_purc_rma_back__stck_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_BACK__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rma_back
IS '레거시 테이블 TMM_PURC_RMA_BACK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rma_back__is_deleted
    ON psm.purc_rma_back (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rma_product
-- 레거시: TMM_PURC_RMA_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rma_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rma_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RMA_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_sn                        VARCHAR(50)                              ,  -- [LEGACY] PRDT_SN
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    purc_rma_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RMA_QTY
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    cust_own_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CUST_OWN_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tmm_purc_rma_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_PRDT__PRDT_CD
    ix_tmm_purc_rma_prdt__prdt_sn  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_PRDT__PRDT_SN
    ix_tmm_purc_rma_prdt__purc_rma_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_PRDT__PURC_RMA_ID
    ix_tmm_purc_rma_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rma_product
IS '레거시 테이블 TMM_PURC_RMA_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rma_product__is_deleted
    ON psm.purc_rma_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rma_retr
-- 레거시: TMM_PURC_RMA_RETR
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rma_retr (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rma_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RMA_PRDT_ID
    retr_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] RETR_DT
    retr_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RETR_QTY
    ofst_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] OFST_YN
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    usd_purc_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_AMT
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    krw_purc_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_AMT
    cn_number                      VARCHAR(100)                             ,  -- [LEGACY] CN_NO
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    purc_id                        INTEGER                                  ,  -- [LEGACY] PURC_ID
    ix_tmm_purc_rma_retr__cn_number TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_RETR__CN_NO
    ix_tmm_purc_rma_retr__ofst_flag TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_RETR__OFST_YN
    ix_tmm_purc_rma_retr__purc_id  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_RETR__PURC_ID
    ix_tmm_purc_rma_retr__purc_rma_prdt_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_RETR__PURC_RMA_PRDT_ID
    ix_tmm_purc_rma_retr__retr_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RMA_RETR__RETR_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rma_retr
IS '레거시 테이블 TMM_PURC_RMA_RETR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rma_retr__is_deleted
    ON psm.purc_rma_retr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rtn
-- 레거시: TMM_PURC_RTN
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rtn (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rtn_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_RTN_NO
    purc_rtn_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_RTN_DT
    purc_rtn_type                  CHAR(2)                                  ,  -- [LEGACY] PURC_RTN_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    shpt_date                      CHAR(8)                                  ,  -- [LEGACY] SHPT_DT
    shpt_type                      CHAR(4)                                  ,  -- [LEGACY] SHPT_TP
    delv_addr_id                   INTEGER                                  ,  -- [LEGACY] DELV_ADDR_ID
    delv_memo                      TEXT                                     ,  -- [LEGACY] DELV_MEMO
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tmm_purc_rtn__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__CUST_CD
    ix_tmm_purc_rtn__delv_addr_id  TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__DELV_ADDR_ID
    ix_tmm_purc_rtn__delv_out_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__DELV_OUT_ID
    ix_tmm_purc_rtn__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__DEPT_CD
    ix_tmm_purc_rtn__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__DWEL_ORD_ID
    ix_tmm_purc_rtn__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__EAS_SIGN_ID
    ix_tmm_purc_rtn__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__EMPY_CD
    ix_tmm_purc_rtn__proc_st       TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__PROC_ST
    ix_tmm_purc_rtn__purc_rtn_date TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__PURC_RTN_DT
    ix_tmm_purc_rtn__purc_rtn_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__PURC_RTN_TP
    ix_tmm_purc_rtn__purc_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__PURC_TP
    ix_tmm_purc_rtn__shpt_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__SHPT_DT
    ix_tmm_purc_rtn__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__SHPT_TP
    ix_tmm_purc_rtn__whse_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rtn
IS '레거시 테이블 TMM_PURC_RTN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rtn__is_deleted
    ON psm.purc_rtn (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_rtn_product
-- 레거시: TMM_PURC_RTN_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_rtn_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    purc_rtn_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RTN_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 0)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    purc_rtn_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_RTN_QTY
    purc_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] PURC_USD_AMT
    purc_sup_amt                   NUMERIC(17, 0)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 0)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 0)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tmm_purc_rtn_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN_PRDT__PRDT_CD
    ix_tmm_purc_rtn_prdt__purc_rtn_id TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN_PRDT__PURC_RTN_ID
    ix_tmm_purc_rtn_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_RTN_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_rtn_product
IS '레거시 테이블 TMM_PURC_RTN_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_rtn_product__is_deleted
    ON psm.purc_rtn_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.purc_summaries
-- 레거시: TMM_PURC_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.purc_summaries (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    ix_tmm_purc_sum__base_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__BASE_DT
    ix_tmm_purc_sum__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__CUST_CD
    ix_tmm_purc_sum__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__DEPT_CD
    ix_tmm_purc_sum__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__EMPY_CD
    ix_tmm_purc_sum__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__PRDT_CD
    ix_tmm_purc_sum__stck_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PURC_SUM__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.purc_summaries
IS '레거시 테이블 TMM_PURC_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_purc_summaries__is_deleted
    ON psm.purc_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.pybl_summaries
-- 레거시: TMM_PYBL_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.pybl_summaries (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    pybl_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYBL_AMT
    ix_tmm_pybl_sum__crcy_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_SUM__CRCY_TP
    ix_tmm_pybl_sum__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_SUM__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.pybl_summaries
IS '레거시 테이블 TMM_PYBL_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pybl_summaries__is_deleted
    ON psm.pybl_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.pybl_sum_day
-- 레거시: TMM_PYBL_SUM_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.pybl_sum_day (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    pymt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYMT_AMT
    pybl_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYBL_AMT
    ix_tmm_pybl_sum_day__base_date TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_SUM_DAY__BASE_DT
    ix_tmm_pybl_sum_day__crcy_type TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_SUM_DAY__CRCY_TP
    ix_tmm_pybl_sum_day__cust_code TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_SUM_DAY__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.pybl_sum_day
IS '레거시 테이블 TMM_PYBL_SUM_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pybl_sum_day__is_deleted
    ON psm.pybl_sum_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.pybl_transactions
-- 레거시: TMM_PYBL_TRN
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.pybl_transactions (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    tran_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] TRAN_TP
    tran_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] TRAN_NO
    tran_id                        INTEGER                                  ,  -- [LEGACY] TRAN_ID
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    io_type                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] IO_TP
    io_amt                         NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] IO_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tmm_pybl_trn__base_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__BASE_DT
    ix_tmm_pybl_trn__crcy_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__CRCY_TP
    ix_tmm_pybl_trn__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__CUST_CD
    ix_tmm_pybl_trn__io_type       TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__IO_TP
    ix_tmm_pybl_trn__tran_id       TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__TRAN_ID
    ix_tmm_pybl_trn__tran_number   TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN__TRAN_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.pybl_transactions
IS '레거시 테이블 TMM_PYBL_TRN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pybl_transactions__is_deleted
    ON psm.pybl_transactions (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.pybl_trn_history
-- 레거시: TMM_PYBL_TRN_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.pybl_trn_history (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    hist_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] HIST_TP
    hist_on                        TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] HIST_ON
    id                             INTEGER                        NOT NULL  ,  -- [LEGACY] ID
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    tran_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] TRAN_TP
    tran_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] TRAN_NO
    tran_id                        INTEGER                                  ,  -- [LEGACY] TRAN_ID
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    io_type                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] IO_TP
    io_amt                         NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] IO_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tmm_pybl_trn_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN_HIST__HIST_TP
    ix_tmm_pybl_trn_hist__id       TEXT                                     ,  -- [LEGACY] IX_TMM_PYBL_TRN_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.pybl_trn_history
IS '레거시 테이블 TMM_PYBL_TRN_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pybl_trn_history__is_deleted
    ON psm.pybl_trn_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: psm.pymts
-- 레거시: TMM_PYMT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS psm.pymts (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by_name                VARCHAR(50)                              ,  -- [LEGACY] CREATE_BY
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                              ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    pymt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PYMT_NO
    pymt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PYMT_DT
    pymt_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PYMT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    pymt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYMT_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    purc_number                    CHAR(14)                                 ,  -- [LEGACY] PURC_NO
    ix_tmm_pymt_mst__crcy_type     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__CRCY_TP
    ix_tmm_pymt_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__CUST_CD
    ix_tmm_pymt_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__DEPT_CD
    ix_tmm_pymt_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__EMPY_CD
    ix_tmm_pymt_mst__pymt_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__PYMT_DT
    ix_tmm_pymt_mst__regi_date     TEXT                                     ,  -- [LEGACY] IX_TMM_PYMT_MST__REGI_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE psm.pymts
IS '레거시 테이블 TMM_PYMT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pymts__is_deleted
    ON psm.pymts (is_deleted)
 WHERE is_deleted = false;


