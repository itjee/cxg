-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: srm
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: srm.dpsts
-- 레거시: TSD_DPST_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.dpsts (
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
    dpst_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] DPST_NO
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    dpst_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] DPST_DT
    dpst_tm                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] DPST_TM
    dpst_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] DPST_TP
    cbib_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] CBIB_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                                  ,  -- [LEGACY] CRDT_ID
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    dpst_usd_amt                   NUMERIC(17, 4)                           ,  -- [LEGACY] DPST_USD_AMT
    dpst_tot_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_TOT_AMT
    dpst_net_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_NET_AMT
    dpst_fee_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_FEE_AMT
    dpst_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_SUM_AMT
    fnsh_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FNSH_YN
    refr_number                    VARCHAR(100)                             ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_dpst_mst__cbib_type     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__CBIB_TP
    ix_tsd_dpst_mst__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__CRDT_ID
    ix_tsd_dpst_mst__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__CRDT_TP
    ix_tsd_dpst_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__CUST_CD
    ix_tsd_dpst_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__DEPT_CD
    ix_tsd_dpst_mst__dpst_date     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__DPST_DT
    ix_tsd_dpst_mst__dpst_type     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__DPST_TP
    ix_tsd_dpst_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__EMPY_CD
    ix_tsd_dpst_mst__fnsh_flag     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__FNSH_YN
    ix_tsd_dpst_mst__refr_number   TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__REFR_NO
    ix_tsd_dpst_mst__regi_date     TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST__REGI_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.dpsts
IS '레거시 테이블 TSD_DPST_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dpsts__is_deleted
    ON srm.dpsts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.dpst_mst_bank
-- 레거시: TSD_DPST_MST_BANK
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.dpst_mst_bank (
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
    dpst_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] DPST_ID
    bank_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] BANK_CD
    acct_number                    VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] ACCT_NO
    rmtr_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] RMTR_NM
    dpst_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] DPST_DT
    ix_tsd_dpst_mst_bank__acct_number TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_BANK__ACCT_NO
    ix_tsd_dpst_mst_bank__bank_code TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_BANK__BANK_CD
    ix_tsd_dpst_mst_bank__dpst_date TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_BANK__DPST_DT
    ix_tsd_dpst_mst_bank__rmtr_name TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_BANK__RMTR_NM
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.dpst_mst_bank
IS '레거시 테이블 TSD_DPST_MST_BANK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dpst_mst_bank__is_deleted
    ON srm.dpst_mst_bank (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.dpst_mst_card
-- 레거시: TSD_DPST_MST_CARD
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.dpst_mst_card (
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
    dpst_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] DPST_ID
    deal_number                    VARCHAR(20)                              ,  -- [LEGACY] DEAL_NO
    card_code                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CARD_CD
    card_number                    VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] CARD_NO
    card_name                      VARCHAR(50)                              ,  -- [LEGACY] CARD_NM
    appv_number                    VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] APPV_NO
    appv_on                        VARCHAR(20)                              ,  -- [LEGACY] APPV_ON
    ix_tsd_dpst_mst_card__appv_number TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_CARD__APPV_NO
    ix_tsd_dpst_mst_card__card_code TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_CARD__CARD_CD
    ix_tsd_dpst_mst_card__card_number TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_CARD__CARD_NO
    ix_tsd_dpst_mst_card__deal_number TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_CARD__DEAL_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.dpst_mst_card
IS '레거시 테이블 TSD_DPST_MST_CARD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dpst_mst_card__is_deleted
    ON srm.dpst_mst_card (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.dpst_mst_history
-- 레거시: TSD_DPST_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.dpst_mst_history (
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
    dpst_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] DPST_NO
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    dpst_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] DPST_DT
    dpst_tm                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] DPST_TM
    dpst_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] DPST_TP
    cbib_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] CBIB_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                                  ,  -- [LEGACY] CRDT_ID
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    dpst_usd_amt                   NUMERIC(17, 4)                           ,  -- [LEGACY] DPST_USD_AMT
    dpst_tot_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_TOT_AMT
    dpst_net_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_NET_AMT
    dpst_fee_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_FEE_AMT
    dpst_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_SUM_AMT
    fnsh_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FNSH_YN
    refr_number                    VARCHAR(100)                             ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_dpst_mst_hist__id       TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.dpst_mst_history
IS '레거시 테이블 TSD_DPST_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dpst_mst_history__is_deleted
    ON srm.dpst_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.dpst_mst_note
-- 레거시: TSD_DPST_MST_NOTE
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.dpst_mst_note (
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
    dpst_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] DPST_ID
    note_number                    VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] NOTE_NO
    issu_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] ISSU_DT
    expn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EXPN_DT
    bank_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] BANK_CD
    brch_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] BRCH_NM
    issr_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] ISSR_NM
    endr_name                      VARCHAR(50)                              ,  -- [LEGACY] ENDR_NM
    ix_tsd_dpst_mst_numberte__brch_name TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_NOTE__BRCH_NM
    ix_tsd_dpst_mst_numberte__expn_date TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_NOTE__EXPN_DT
    ix_tsd_dpst_mst_numberte__numberte_number TEXT                                     ,  -- [LEGACY] IX_TSD_DPST_MST_NOTE__NOTE_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.dpst_mst_note
IS '레거시 테이블 TSD_DPST_MST_NOTE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dpst_mst_note__is_deleted
    ON srm.dpst_mst_note (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.excis
-- 레거시: TSD_EXCI_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.excis (
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
    exci_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EXCI_DT
    exci_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] EXCI_NO
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    shipper                        VARCHAR(500)                             ,  -- [LEGACY] SHIPPER
    consignee                      VARCHAR(500)                             ,  -- [LEGACY] CONSIGNEE
    importer                       VARCHAR(500)                             ,  -- [LEGACY] IMPORTER
    load_port                      VARCHAR(100)                             ,  -- [LEGACY] LOAD_PORT
    finl_dstn                      VARCHAR(100)                             ,  -- [LEGACY] FINL_DSTN
    carrier                        VARCHAR(100)                             ,  -- [LEGACY] CARRIER
    ship_date                      CHAR(8)                                  ,  -- [LEGACY] SHIP_DT
    airw_number                    VARCHAR(50)                              ,  -- [LEGACY] AIRW_NO
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exlc_number                    VARCHAR(20)                              ,  -- [LEGACY] EXLC_NO
    exlc_date                      CHAR(8)                                  ,  -- [LEGACY] EXLC_DT
    exlc_bank                      VARCHAR(100)                             ,  -- [LEGACY] EXLC_BANK
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    ix_tsd_exci_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST__CUST_CD
    ix_tsd_exci_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST__DEPT_CD
    ix_tsd_exci_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST__EMPY_CD
    ix_tsd_exci_mst__exci_date     TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST__EXCI_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.excis
IS '레거시 테이블 TSD_EXCI_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_excis__is_deleted
    ON srm.excis (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.exci_mst_product
-- 레거시: TSD_EXCI_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.exci_mst_product (
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
    exci_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] EXCI_ID
    ship_mark                      VARCHAR(50)                              ,  -- [LEGACY] SHIP_MARK
    prdt_dscr                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] PRDT_DSCR
    prdt_code                      CHAR(14)                                 ,  -- [LEGACY] PRDT_CD
    exci_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] EXCI_QTY
    exci_pr                        NUMERIC(17, 2)                           ,  -- [LEGACY] EXCI_PR
    exci_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCI_AMT
    ix_tsd_exci_mst_prdt__exci_id  TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST_PRDT__EXCI_ID
    ix_tsd_exci_mst_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_EXCI_MST_PRDT__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.exci_mst_product
IS '레거시 테이블 TSD_EXCI_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_exci_mst_product__is_deleted
    ON srm.exci_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.expis
-- 레거시: TSD_EXPI_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.expis (
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
    expi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EXPI_DT
    expi_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] EXPI_NO
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    bill_to                        VARCHAR(100)                             ,  -- [LEGACY] BILL_TO
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    vald_term                      VARCHAR(50)                              ,  -- [LEGACY] VALD_TERM
    ship_date                      CHAR(8)                                  ,  -- [LEGACY] SHIP_DATE
    ship_term                      CHAR(3)                                  ,  -- [LEGACY] SHIP_TERM
    dlvr_addr                      VARCHAR(200)                             ,  -- [LEGACY] DLVR_ADDR
    paym_term                      VARCHAR(20)                              ,  -- [LEGACY] PAYM_TERM
    insp_mthd                      VARCHAR(100)                             ,  -- [LEGACY] INSP_MTHD
    pack_mthd                      VARCHAR(100)                             ,  -- [LEGACY] PACK_MTHD
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    paym_bank_code                 VARCHAR(20)                              ,  -- [LEGACY] PAYM_BANK_CD
    paym_bank_name                 VARCHAR(50)                              ,  -- [LEGACY] PAYM_BANK_NM
    paym_acct_number               VARCHAR(20)                              ,  -- [LEGACY] PAYM_ACCT_NO
    paym_acct_name                 VARCHAR(50)                              ,  -- [LEGACY] PAYM_ACCT_NM
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    ix_tsd_expi_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST__CUST_CD
    ix_tsd_expi_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST__DEPT_CD
    ix_tsd_expi_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST__EMPY_CD
    ix_tsd_expi_mst__expi_date     TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST__EXPI_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.expis
IS '레거시 테이블 TSD_EXPI_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_expis__is_deleted
    ON srm.expis (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.expi_mst_product
-- 레거시: TSD_EXPI_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.expi_mst_product (
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
    expi_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] EXPI_ID
    prdt_code                      VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] PRDT_NM
    expi_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] EXPI_QTY
    expi_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPI_PR
    expi_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPI_AMT
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    ix_tsd_expi_mst_prdt__expi_id  TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST_PRDT__EXPI_ID
    ix_tsd_expi_mst_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_EXPI_MST_PRDT__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.expi_mst_product
IS '레거시 테이블 TSD_EXPI_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_expi_mst_product__is_deleted
    ON srm.expi_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.ovrd_day
-- 레거시: TSD_OVRD_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.ovrd_day (
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
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    ovrd_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] OVRD_AMT
    intr_rat                       NUMERIC(5, 2)                  NOT NULL  ,  -- [LEGACY] INTR_RAT
    intr_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INTR_AMT
    dpst_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_AMT
    blnc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BLNC_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_ovrd_day__base_date     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__BASE_DT
    ix_tsd_ovrd_day__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__CRDT_ID
    ix_tsd_ovrd_day__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__CRDT_TP
    ix_tsd_ovrd_day__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__CUST_CD
    ix_tsd_ovrd_day__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__DEPT_CD
    ix_tsd_ovrd_day__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__EMPY_CD
    ix_tsd_ovrd_day__paym_date     TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY__PAYM_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.ovrd_day
IS '레거시 테이블 TSD_OVRD_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_ovrd_day__is_deleted
    ON srm.ovrd_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.ovrd_day_history
-- 레거시: TSD_OVRD_DAY_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.ovrd_day_history (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    ovrd_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] OVRD_AMT
    intr_rat                       NUMERIC(5, 2)                  NOT NULL  ,  -- [LEGACY] INTR_RAT
    intr_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INTR_AMT
    dpst_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_AMT
    blnc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BLNC_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_ovrd_day_hist__base_date TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__BASE_DT
    ix_tsd_ovrd_day_hist__crdt_id  TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__CRDT_ID
    ix_tsd_ovrd_day_hist__crdt_type TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__CRDT_TP
    ix_tsd_ovrd_day_hist__cust_code TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__CUST_CD
    ix_tsd_ovrd_day_hist__dept_code TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__DEPT_CD
    ix_tsd_ovrd_day_hist__empy_code TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__EMPY_CD
    ix_tsd_ovrd_day_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__HIST_TP
    ix_tsd_ovrd_day_hist__id       TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__ID
    ix_tsd_ovrd_day_hist__paym_date TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_DAY_HIST__PAYM_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.ovrd_day_history
IS '레거시 테이블 TSD_OVRD_DAY_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_ovrd_day_history__is_deleted
    ON srm.ovrd_day_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.ovrds
-- 레거시: TSD_OVRD_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.ovrds (
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
    start_day                      INTEGER                        NOT NULL  ,  -- [LEGACY] START_DAY
    close_day                      INTEGER                                  ,  -- [LEGACY] CLOSE_DAY
    overdue_rat                    NUMERIC(5, 2)                  NOT NULL  ,  -- [LEGACY] OVERDUE_RAT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_ovrd_mst__ed_day        TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_MST__ED_DAY
    ix_tsd_ovrd_mst__st_day        TEXT                                     ,  -- [LEGACY] IX_TSD_OVRD_MST__ST_DAY
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.ovrds
IS '레거시 테이블 TSD_OVRD_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_ovrds__is_deleted
    ON srm.ovrds (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_log
-- 레거시: TSD_PROC_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_log (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_log
IS '레거시 테이블 TSD_PROC_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_log__is_deleted
    ON srm.proc_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_log_history
-- 레거시: TSD_PROC_LOG_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_log_history (
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
    proc_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PROC_ID
    proc_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] PROC_PRDT_ID
    smry_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SMRY_TP
    smry_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SMRY_QTY
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_log_history
IS '레거시 테이블 TSD_PROC_LOG_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_log_history__is_deleted
    ON srm.proc_log_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.procs
-- 레거시: TSD_PROC_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.procs (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.procs
IS '레거시 테이블 TSD_PROC_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_procs__is_deleted
    ON srm.procs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_mst_product
-- 레거시: TSD_PROC_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_mst_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_mst_product
IS '레거시 테이블 TSD_PROC_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_mst_product__is_deleted
    ON srm.proc_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_rcv
-- 레거시: TSD_PROC_RCV
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_rcv (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_rcv
IS '레거시 테이블 TSD_PROC_RCV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_rcv__is_deleted
    ON srm.proc_rcv (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_rcv_product
-- 레거시: TSD_PROC_RCV_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_rcv_product (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_rcv_product
IS '레거시 테이블 TSD_PROC_RCV_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_rcv_product__is_deleted
    ON srm.proc_rcv_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.proc_summaries
-- 레거시: TSD_PROC_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.proc_summaries (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.proc_summaries
IS '레거시 테이블 TSD_PROC_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_proc_summaries__is_deleted
    ON srm.proc_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rcbl_dpst
-- 레거시: TSD_RCBL_DPST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rcbl_dpst (
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
    rcbl_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RCBL_ID
    dpst_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] DPST_ID
    dpst_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_rcbl_dpst__dpst_id      TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_DPST__DPST_ID
    ix_tsd_rcbl_dpst__rcbl_id      TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_DPST__RCBL_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rcbl_dpst
IS '레거시 테이블 TSD_RCBL_DPST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rcbl_dpst__is_deleted
    ON srm.rcbl_dpst (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rcbl_noti
-- 레거시: TSD_RCBL_NOTI
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rcbl_noti (
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
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    paym_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PAYM_AMT
    noti_log_id                    INTEGER                                  ,  -- [LEGACY] NOTI_LOG_ID
    ix_tsd_rcbl_numberti__base_date TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__BASE_DT
    ix_tsd_rcbl_numberti__crdt_type TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__CRDT_TP
    ix_tsd_rcbl_numberti__cust_code TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__CUST_CD
    ix_tsd_rcbl_numberti__dept_code TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__DEPT_CD
    ix_tsd_rcbl_numberti__empy_code TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__EMPY_CD
    ix_tsd_rcbl_numberti__numberti_log_id TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__NOTI_LOG_ID
    ix_tsd_rcbl_numberti__paym_date TEXT                                     ,  -- [LEGACY] IX_TSD_RCBL_NOTI__PAYM_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rcbl_noti
IS '레거시 테이블 TSD_RCBL_NOTI에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rcbl_noti__is_deleted
    ON srm.rcbl_noti (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rcbl_summaries
-- 레거시: TSD_RCBL_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rcbl_summaries (
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
    rcbl_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] RCBL_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] CRDT_DT
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    rcbl_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] RCBL_AMT
    dpst_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_AMT
    blnc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BLNC_AMT
    refr_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] REFR_TP
    refr_id                        INTEGER                                  ,  -- [LEGACY] REFR_ID
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rcbl_summaries
IS '레거시 테이블 TSD_RCBL_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rcbl_summaries__is_deleted
    ON srm.rcbl_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_ext
-- 레거시: TSD_RENT_EXT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_ext (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    rent_ext_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] RENT_EXT_NO
    rent_ext_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_EXT_DT
    rent_end_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_END_DT
    old_rent_end_date              CHAR(8)                                  ,  -- [LEGACY] OLD_RENT_END_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tsd_rent_ext__aprv_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT__APRV_ID
    ix_tsd_rent_ext__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT__PROC_ST
    ix_tsd_rent_ext__rent_end_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT__RENT_END_DT
    ix_tsd_rent_ext__rent_ext_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT__RENT_EXT_DT
    ix_tsd_rent_ext__rent_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT__RENT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_ext
IS '레거시 테이블 TSD_RENT_EXT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_ext__is_deleted
    ON srm.rent_ext (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_ext_product
-- 레거시: TSD_RENT_EXT_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_ext_product (
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
    rent_ext_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_EXT_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    rent_ext_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_EXT_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_rent_ext_prdt__rent_ext_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT_PRDT__RENT_EXT_ID
    ix_tsd_rent_ext_prdt__rent_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_EXT_PRDT__RENT_PRDT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_ext_product
IS '레거시 테이블 TSD_RENT_EXT_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_ext_product__is_deleted
    ON srm.rent_ext_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_log
-- 레거시: TSD_RENT_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_log (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    smry_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SMRY_TP
    smry_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SMRY_QTY
    ix_tsd_rent_log__rent_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_LOG__RENT_ID
    ix_tsd_rent_log__rent_prdt_id  TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_LOG__RENT_PRDT_ID
    ix_tsd_rent_log__smry_type     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_LOG__SMRY_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_log
IS '레거시 테이블 TSD_RENT_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_log__is_deleted
    ON srm.rent_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_log_history
-- 레거시: TSD_RENT_LOG_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_log_history (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    smry_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SMRY_TP
    smry_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SMRY_QTY
    ix_tsd_rent_log_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_LOG_HIST__HIST_TP
    ix_tsd_rent_log_hist__id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_LOG_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_log_history
IS '레거시 테이블 TSD_RENT_LOG_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_log_history__is_deleted
    ON srm.rent_log_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rents
-- 레거시: TSD_RENT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rents (
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
    rent_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] RENT_NO
    rent_req_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_REQ_DT
    rent_end_date                  CHAR(8)                                  ,  -- [LEGACY] RENT_END_DT
    rent_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] RENT_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    shpt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SHPT_DT
    shpt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] SHPT_TP
    delv_addr_id                   INTEGER                                  ,  -- [LEGACY] DELV_ADDR_ID
    delv_memo                      TEXT                                     ,  -- [LEGACY] DELV_MEMO
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tsd_rent_mst__aprv_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__APRV_ID
    ix_tsd_rent_mst__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__CRDT_ID
    ix_tsd_rent_mst__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__CRDT_TP
    ix_tsd_rent_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__CUST_CD
    ix_tsd_rent_mst__delv_addr_id  TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__DELV_ADDR_ID
    ix_tsd_rent_mst__delv_out_id   TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__DELV_OUT_ID
    ix_tsd_rent_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__DEPT_CD
    ix_tsd_rent_mst__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__DWEL_ORD_ID
    ix_tsd_rent_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__EMPY_CD
    ix_tsd_rent_mst__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__PROC_ST
    ix_tsd_rent_mst__rent_end_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__RENT_END_DT
    ix_tsd_rent_mst__rent_req_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__RENT_REQ_DT
    ix_tsd_rent_mst__rent_type     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__RENT_TP
    ix_tsd_rent_mst__shpt_date     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__SHPT_DT
    ix_tsd_rent_mst__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__SHPT_TP
    ix_tsd_rent_mst__whse_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rents
IS '레거시 테이블 TSD_RENT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rents__is_deleted
    ON srm.rents (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_mst_file
-- 레거시: TSD_RENT_MST_FILE
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_mst_file (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    file_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_ID
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tsd_rent_mst_file__file_id  TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST_FILE__FILE_ID
    ix_tsd_rent_mst_file__rent_id  TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST_FILE__RENT_ID
    ux_tsd_rent_mst_file           TEXT                                     ,  -- [LEGACY] UX_TSD_RENT_MST_FILE
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_mst_file
IS '레거시 테이블 TSD_RENT_MST_FILE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_mst_file__is_deleted
    ON srm.rent_mst_file (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_mst_product
-- 레거시: TSD_RENT_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_mst_product (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    rent_req_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_REQ_QTY
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tsd_rent_mst_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST_PRDT__PRDT_CD
    ix_tsd_rent_mst_prdt__rent_id  TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST_PRDT__RENT_ID
    ix_tsd_rent_mst_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_MST_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_mst_product
IS '레거시 테이블 TSD_RENT_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_mst_product__is_deleted
    ON srm.rent_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_rcv
-- 레거시: TSD_RENT_RCV
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_rcv (
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
    rent_rcv_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] RENT_RCV_NO
    rent_rcv_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_RCV_DT
    delv_rcv_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] DELV_RCV_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    delv_rcv_id                    INTEGER                                  ,  -- [LEGACY] DELV_RCV_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tsd_rent_rcv__delv_rcv_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__DELV_RCV_DT
    ix_tsd_rent_rcv__delv_rcv_id   TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__DELV_RCV_ID
    ix_tsd_rent_rcv__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__DEPT_CD
    ix_tsd_rent_rcv__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__DWEL_ORD_ID
    ix_tsd_rent_rcv__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__EMPY_CD
    ix_tsd_rent_rcv__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__PROC_ST
    ix_tsd_rent_rcv__rent_rcv_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__RENT_RCV_DT
    ix_tsd_rent_rcv__whse_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_rcv
IS '레거시 테이블 TSD_RENT_RCV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_rcv__is_deleted
    ON srm.rent_rcv (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_rcv_product
-- 레거시: TSD_RENT_RCV_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_rcv_product (
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
    rent_rcv_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_RCV_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    rent_rcv_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_RCV_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_rent_rcv_prdt__rent_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV_PRDT__RENT_PRDT_ID
    ix_tsd_rent_rcv_prdt__rent_rcv_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV_PRDT__RENT_RCV_ID
    ix_tsd_rent_rcv_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_RCV_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_rcv_product
IS '레거시 테이블 TSD_RENT_RCV_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_rcv_product__is_deleted
    ON srm.rent_rcv_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_sal
-- 레거시: TSD_RENT_SAL
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_sal (
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
    rent_sal_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] RENT_SAL_NO
    rent_sal_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_SAL_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    sale_id                        INTEGER                                  ,  -- [LEGACY] SALE_ID
    ix_tsd_rent_sal__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__CUST_CD
    ix_tsd_rent_sal__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__DEPT_CD
    ix_tsd_rent_sal__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__EMPY_CD
    ix_tsd_rent_sal__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__PROC_ST
    ix_tsd_rent_sal__rent_sal_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__RENT_SAL_DT
    ix_tsd_rent_sal__sale_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL__SALE_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_sal
IS '레거시 테이블 TSD_RENT_SAL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_sal__is_deleted
    ON srm.rent_sal (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_sal_product
-- 레거시: TSD_RENT_SAL_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_sal_product (
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
    rent_sal_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_SAL_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    usd_sale_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_PR
    usd_sale_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_AMT
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    krw_sale_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_rent_sal_prdt__rent_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL_PRDT__RENT_PRDT_ID
    ix_tsd_rent_sal_prdt__rent_sal_id TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SAL_PRDT__RENT_SAL_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_sal_product
IS '레거시 테이블 TSD_RENT_SAL_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_sal_product__is_deleted
    ON srm.rent_sal_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rent_summaries
-- 레거시: TSD_RENT_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rent_summaries (
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
    rent_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_ID
    rent_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_PRDT_ID
    rent_end_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] RENT_END_DT
    rent_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RENT_QTY
    recv_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RECV_QTY
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    blnc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] BLNC_QTY
    ix_tsd_rent_sum__rent_end_date TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SUM__RENT_END_DT
    ix_tsd_rent_sum__rent_id       TEXT                                     ,  -- [LEGACY] IX_TSD_RENT_SUM__RENT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rent_summaries
IS '레거시 테이블 TSD_RENT_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rent_summaries__is_deleted
    ON srm.rent_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_dct
-- 레거시: TSD_SALE_DCT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_dct (
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
    sale_dct_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_DCT_NO
    sale_dct_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_DCT_TP
    sale_dct_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DCT_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    zero_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ZERO_TAX_YN
    free_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] FREE_TAX_YN
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    sale_id                        INTEGER                                  ,  -- [LEGACY] SALE_ID
    ix_tsd_sale_dct__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__CRDT_ID
    ix_tsd_sale_dct__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__CRDT_TP
    ix_tsd_sale_dct__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__CUST_CD
    ix_tsd_sale_dct__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__DEPT_CD
    ix_tsd_sale_dct__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__EAS_SIGN_ID
    ix_tsd_sale_dct__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__EMPY_CD
    ix_tsd_sale_dct__paym_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__PAYM_DT
    ix_tsd_sale_dct__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__PROC_ST
    ix_tsd_sale_dct__sale_dct_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__SALE_DCT_DT
    ix_tsd_sale_dct__sale_dct_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__SALE_DCT_TP
    ix_tsd_sale_dct__sale_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT__SALE_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_dct
IS '레거시 테이블 TSD_SALE_DCT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_dct__is_deleted
    ON srm.sale_dct (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_dct_product
-- 레거시: TSD_SALE_DCT_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_dct_product (
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
    sale_dct_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_DCT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    sale_dct_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_DCT_QTY
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] SALE_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_sale_dct_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT_PRDT__PRDT_CD
    ix_tsd_sale_dct_prdt__sale_dct_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_DCT_PRDT__SALE_DCT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_dct_product
IS '레거시 테이블 TSD_SALE_DCT_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_dct_product__is_deleted
    ON srm.sale_dct_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_ext_chr
-- 레거시: TSD_SALE_EXT_CHR
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_ext_chr (
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
    sale_ord_number                CHAR(14)                                 ,  -- [LEGACY] SALE_ORD_NO
    extra_charge_flag              CHAR(1)                                  ,  -- [LEGACY] EXTRA_CHARGE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_ext_chr
IS '레거시 테이블 TSD_SALE_EXT_CHR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_ext_chr__is_deleted
    ON srm.sale_ext_chr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mod
-- 레거시: TSD_SALE_MOD
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mod (
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
    sale_mod_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_MOD_NO
    sale_mod_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_MOD_DT
    sale_mod_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_MOD_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tsd_sale_mod__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__DEPT_CD
    ix_tsd_sale_mod__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__EAS_SIGN_ID
    ix_tsd_sale_mod__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__EMPY_CD
    ix_tsd_sale_mod__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__PROC_ST
    ix_tsd_sale_mod__sale_mod_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__SALE_MOD_DT
    ix_tsd_sale_mod__sale_mod_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD__SALE_MOD_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mod
IS '레거시 테이블 TSD_SALE_MOD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mod__is_deleted
    ON srm.sale_mod (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mod_date
-- 레거시: TSD_SALE_MOD_DATE
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mod_date (
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
    sale_mod_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_MOD_ID
    sale_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_NO
    org_sale_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] ORG_SALE_DT
    chg_sale_date                  CHAR(8)                                  ,  -- [LEGACY] CHG_SALE_DT
    ix_tsd_sale_mod_date__sale_mod_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_DATE__SALE_MOD_ID
    ix_tsd_sale_mod_date__sale_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_DATE__SALE_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mod_date
IS '레거시 테이블 TSD_SALE_MOD_DATE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mod_date__is_deleted
    ON srm.sale_mod_date (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mod_product
-- 레거시: TSD_SALE_MOD_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mod_product (
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
    sale_mod_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_MOD_ID
    sale_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_NO
    sale_prdt_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_PRDT_ID
    chg_sale_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] CHG_SALE_QTY
    chg_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CHG_SALE_PR
    org_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] ORG_SALE_PR
    rtn_sale_number                CHAR(14)                                 ,  -- [LEGACY] RTN_SALE_NO
    nor_sale_number                CHAR(14)                                 ,  -- [LEGACY] NOR_SALE_NO
    ix_tsd_sale_mod_prdt__numberr_sale_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_PRDT__NOR_SALE_NO
    ix_tsd_sale_mod_prdt__rtn_sale_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_PRDT__RTN_SALE_NO
    ix_tsd_sale_mod_prdt__sale_mod_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_PRDT__SALE_MOD_ID
    ix_tsd_sale_mod_prdt__sale_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MOD_PRDT__SALE_PRDT_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mod_product
IS '레거시 테이블 TSD_SALE_MOD_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mod_product__is_deleted
    ON srm.sale_mod_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sales
-- 레거시: TSD_SALE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sales (
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
    corp_code                      CHAR(3)                                  ,  -- [LEGACY] CORP_CD
    sale_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_NO
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    slip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SLIP_TP
    mdfy_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] MDFY_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    cday_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CDAY_TP
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    use_pnt_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] USE_PNT_AMT
    crm_oppr_id                    INTEGER                                  ,  -- [LEGACY] CRM_OPPR_ID
    zero_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ZERO_TAX_YN
    free_tax_flag                  CHAR(1)                                  ,  -- [LEGACY] FREE_TAX_YN
    tax_pre_flag                   CHAR(1)                                  ,  -- [LEGACY] TAX_PRE_YN
    tax_bill_number                VARCHAR(50)                              ,  -- [LEGACY] TAX_BILL_NO
    tax_issu_type                  CHAR(1)                                  ,  -- [LEGACY] TAX_ISSU_TP
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    org_sale_id                    INTEGER                                  ,  -- [LEGACY] ORG_SALE_ID
    sale_ord_id                    INTEGER                                  ,  -- [LEGACY] SALE_ORD_ID
    sale_rtn_id                    INTEGER                                  ,  -- [LEGACY] SALE_RTN_ID
    delv_ord_id                    INTEGER                                  ,  -- [LEGACY] DELV_ORD_ID
    purc_req_id                    INTEGER                                  ,  -- [LEGACY] PURC_REQ_ID
    rent_id                        INTEGER                                  ,  -- [LEGACY] RENT_ID
    purc_id                        INTEGER                                  ,  -- [LEGACY] PURC_ID
    refr_number                    VARCHAR(50)                              ,  -- [LEGACY] REFR_NO
    proc_id                        INTEGER                                  ,  -- [LEGACY] PROC_ID
    ix_tsd_sale_mst__codeay_type   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__CDAY_TP
    ix_tsd_sale_mst__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__CRDT_ID
    ix_tsd_sale_mst__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__CRDT_TP
    ix_tsd_sale_mst__crm_oppr_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__CRM_OPPR_ID
    ix_tsd_sale_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__CUST_CD
    ix_tsd_sale_mst__delv_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__DELV_ORD_ID
    ix_tsd_sale_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__DEPT_CD
    ix_tsd_sale_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__EMPY_CD
    ix_tsd_sale_mst__mdfy_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__MDFY_TP
    ix_tsd_sale_mst__org_sale_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__ORG_SALE_ID
    ix_tsd_sale_mst__path_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__PATH_TP
    ix_tsd_sale_mst__paym_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__PAYM_DT
    ix_tsd_sale_mst__purc_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__PURC_ID
    ix_tsd_sale_mst__purc_req_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__PURC_REQ_ID
    ix_tsd_sale_mst__refr_number   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__REFR_NO
    ix_tsd_sale_mst__rent_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__RENT_ID
    ix_tsd_sale_mst__sale_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__SALE_DT
    ix_tsd_sale_mst__sale_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__SALE_ORD_ID
    ix_tsd_sale_mst__sale_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__SALE_TP
    ix_tsd_sale_mst__slip_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__SLIP_TP
    ix_tsd_sale_mst__whse_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sales
IS '레거시 테이블 TSD_SALE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sales__is_deleted
    ON srm.sales (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mst_history
-- 레거시: TSD_SALE_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mst_history (
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
    corp_code                      CHAR(3)                                  ,  -- [LEGACY] CORP_CD
    sale_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_NO
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    slip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SLIP_TP
    mdfy_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] MDFY_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    cday_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CDAY_TP
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    use_pnt_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] USE_PNT_AMT
    crm_oppr_id                    INTEGER                                  ,  -- [LEGACY] CRM_OPPR_ID
    zero_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ZERO_TAX_YN
    free_tax_flag                  CHAR(1)                                  ,  -- [LEGACY] FREE_TAX_YN
    tax_pre_flag                   CHAR(1)                                  ,  -- [LEGACY] TAX_PRE_YN
    tax_bill_number                VARCHAR(50)                              ,  -- [LEGACY] TAX_BILL_NO
    tax_issu_type                  CHAR(1)                                  ,  -- [LEGACY] TAX_ISSU_TP
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    org_sale_id                    INTEGER                                  ,  -- [LEGACY] ORG_SALE_ID
    sale_ord_id                    INTEGER                                  ,  -- [LEGACY] SALE_ORD_ID
    sale_rtn_id                    INTEGER                                  ,  -- [LEGACY] SALE_RTN_ID
    delv_ord_id                    INTEGER                                  ,  -- [LEGACY] DELV_ORD_ID
    purc_req_id                    INTEGER                                  ,  -- [LEGACY] PURC_REQ_ID
    rent_id                        INTEGER                                  ,  -- [LEGACY] RENT_ID
    purc_id                        INTEGER                                  ,  -- [LEGACY] PURC_ID
    refr_number                    VARCHAR(50)                              ,  -- [LEGACY] REFR_NO
    proc_id                        INTEGER                                  ,  -- [LEGACY] PROC_ID
    ix_tsd_sale_mst_hist__id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_HIST__ID
    ix_tsd_sale_mst_hist__sale_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_HIST__SALE_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mst_history
IS '레거시 테이블 TSD_SALE_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mst_history__is_deleted
    ON srm.sale_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mst_product
-- 레거시: TSD_SALE_MST_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mst_product (
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
    sale_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    usd_sale_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_PR
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] SALE_USD_AMT
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    tax_bill_item_id               INTEGER                                  ,  -- [LEGACY] TAX_BILL_ITEM_ID
    sale_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] SALE_ORD_PRDT_ID
    org_sale_prdt_id               INTEGER                                  ,  -- [LEGACY] ORG_SALE_PRDT_ID
    rent_prdt_id                   INTEGER                                  ,  -- [LEGACY] RENT_PRDT_ID
    proc_prdt_id                   INTEGER                                  ,  -- [LEGACY] PROC_PRDT_ID
    ix_tsd_sale_mst_prdt__org_sale_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__ORG_SALE_PRDT_ID
    ix_tsd_sale_mst_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__PRDT_CD
    ix_tsd_sale_mst_prdt__sale_id  TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__SALE_ID
    ix_tsd_sale_mst_prdt__sale_ord_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__SALE_ORD_PRDT_ID
    ix_tsd_sale_mst_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__STCK_TP
    ix_tsd_sale_mst_prdt__tax_bill_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT__TAX_BILL_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mst_product
IS '레거시 테이블 TSD_SALE_MST_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mst_product__is_deleted
    ON srm.sale_mst_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mst_product_history
-- 레거시: TSD_SALE_MST_PRDT_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mst_product_history (
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
    sale_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    usd_sale_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_PR
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] SALE_USD_AMT
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    tax_bill_item_id               INTEGER                                  ,  -- [LEGACY] TAX_BILL_ITEM_ID
    sale_ord_prdt_id               INTEGER                                  ,  -- [LEGACY] SALE_ORD_PRDT_ID
    org_sale_prdt_id               INTEGER                                  ,  -- [LEGACY] ORG_SALE_PRDT_ID
    rent_prdt_id                   INTEGER                                  ,  -- [LEGACY] RENT_PRDT_ID
    proc_prdt_id                   INTEGER                                  ,  -- [LEGACY] PROC_PRDT_ID
    ix_tsd_sale_mst_prdt_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT_HIST__HIST_TP
    ix_tsd_sale_mst_prdt_hist__id  TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_PRDT_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mst_product_history
IS '레거시 테이블 TSD_SALE_MST_PRDT_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mst_product_history__is_deleted
    ON srm.sale_mst_product_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_mst_upload
-- 레거시: TSD_SALE_MST_UPLOAD
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_mst_upload (
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
    sale_number                    CHAR(14)                                 ,  -- [LEGACY] SALE_NO
    sale_date                      CHAR(8)                                  ,  -- [LEGACY] SALE_DT
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    biz_reg_number                 VARCHAR(20)                              ,  -- [LEGACY] BIZ_REG_NO
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                                 ,  -- [LEGACY] WHSE_CD
    paym_date                      CHAR(8)                                  ,  -- [LEGACY] PAYM_DT
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    prdt_code                      CHAR(14)                                 ,  -- [LEGACY] PRDT_CD
    model_name                     VARCHAR(100)                             ,  -- [LEGACY] MODEL_NM
    sale_qty                       INTEGER                                  ,  -- [LEGACY] SALE_QTY
    krw_sale_pr                    NUMERIC(17, 2)                           ,  -- [LEGACY] KRW_SALE_PR
    old_prdt_code                  VARCHAR(100)                             ,  -- [LEGACY] OLD_PRDT_CD
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    proc_msg                       TEXT                                     ,  -- [LEGACY] PROC_MSG
    ix_tsd_sale_mst_upload__base_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_UPLOAD__BASE_DT
    ix_tsd_sale_mst_upload__proc_st TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_UPLOAD__PROC_ST
    ix_tsd_sale_mst_upload__sale_number TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_MST_UPLOAD__SALE_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_mst_upload
IS '레거시 테이블 TSD_SALE_MST_UPLOAD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_mst_upload__is_deleted
    ON srm.sale_mst_upload (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_ord
-- 레거시: TSD_SALE_ORD
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_ord (
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
    sale_ord_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_ORD_NO
    sale_ord_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_ORD_DT
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    path_type                      CHAR(1)                                  ,  -- [LEGACY] PATH_TP
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    cday_type                      CHAR(3)                                  ,  -- [LEGACY] CDAY_TP
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(12, 2)                           ,  -- [LEGACY] EXCH_RAT
    zero_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ZERO_TAX_YN
    free_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] FREE_TAX_YN
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    use_pnt_amt                    INTEGER                        NOT NULL  ,  -- [LEGACY] USE_PNT_AMT
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    shpt_date                      CHAR(8)                                  ,  -- [LEGACY] SHPT_DT
    shpt_type                      CHAR(4)                                  ,  -- [LEGACY] SHPT_TP
    delv_addr_id                   INTEGER                                  ,  -- [LEGACY] DELV_ADDR_ID
    delv_memo                      VARCHAR(500)                             ,  -- [LEGACY] DELV_MEMO
    ordr_name                      VARCHAR(50)                              ,  -- [LEGACY] ORDR_NM
    ordr_phne_number               VARCHAR(50)                              ,  -- [LEGACY] ORDR_PHNE_NO
    invc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] INVC_TP
    end_user                       VARCHAR(50)                              ,  -- [LEGACY] END_USER
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    refr_number                    VARCHAR(50)                              ,  -- [LEGACY] REFR_NO
    crm_oppr_id                    INTEGER                                  ,  -- [LEGACY] CRM_OPPR_ID
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    purc_cust_code                 CHAR(14)                                 ,  -- [LEGACY] PURC_CUST_CD
    rent_id                        INTEGER                                  ,  -- [LEGACY] RENT_ID
    proc_id                        INTEGER                                  ,  -- [LEGACY] PROC_ID
    ix_tsd_sale_ord__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__CRDT_ID
    ix_tsd_sale_ord__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__CRDT_TP
    ix_tsd_sale_ord__crm_oppr_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__CRM_OPPR_ID
    ix_tsd_sale_ord__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__CUST_CD
    ix_tsd_sale_ord__delv_addr_id  TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__DELV_ADDR_ID
    ix_tsd_sale_ord__delv_out_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__DELV_OUT_ID
    ix_tsd_sale_ord__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__DEPT_CD
    ix_tsd_sale_ord__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__DWEL_ORD_ID
    ix_tsd_sale_ord__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__EMPY_CD
    ix_tsd_sale_ord__free_tax_flag TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__FREE_TAX_YN
    ix_tsd_sale_ord__paym_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__PAYM_DT
    ix_tsd_sale_ord__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__PROC_ST
    ix_tsd_sale_ord__refr_number   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__REFR_NO
    ix_tsd_sale_ord__sale_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__SALE_DT
    ix_tsd_sale_ord__sale_ord_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__SALE_ORD_DT
    ix_tsd_sale_ord__sale_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__SALE_TP
    ix_tsd_sale_ord__shpt_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__SHPT_DT
    ix_tsd_sale_ord__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__SHPT_TP
    ix_tsd_sale_ord__whse_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__WHSE_CD
    ix_tsd_sale_ord__zero_tax_flag TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD__ZERO_TAX_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_ord
IS '레거시 테이블 TSD_SALE_ORD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_ord__is_deleted
    ON srm.sale_ord (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_ord_product
-- 레거시: TSD_SALE_ORD_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_ord_product (
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
    sale_ord_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ORD_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    free_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] FREE_TAX_YN
    std_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] STD_SALE_PR
    min_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MIN_SALE_PR
    usd_sale_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_PR
    krw_sale_pr                    NUMERIC(12, 0)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    sale_ord_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ORD_QTY
    sale_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] SALE_USD_AMT
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    rent_prdt_id                   INTEGER                                  ,  -- [LEGACY] RENT_PRDT_ID
    proc_prdt_id                   INTEGER                                  ,  -- [LEGACY] PROC_PRDT_ID
    ix_tsd_sale_ord_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD_PRDT__PRDT_CD
    ix_tsd_sale_ord_prdt__rent_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD_PRDT__RENT_PRDT_ID
    ix_tsd_sale_ord_prdt__sale_ord_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD_PRDT__SALE_ORD_ID
    ix_tsd_sale_ord_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_ORD_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_ord_product
IS '레거시 테이블 TSD_SALE_ORD_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_ord_product__is_deleted
    ON srm.sale_ord_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_ord_product_dr
-- 레거시: TSD_SALE_ORD_PRDT_DR
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_ord_product_dr (
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
    sale_ord_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ORD_PRDT_ID
    dr_number                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] DR_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_ord_product_dr
IS '레거시 테이블 TSD_SALE_ORD_PRDT_DR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_ord_product_dr__is_deleted
    ON srm.sale_ord_product_dr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_ord_work
-- 레거시: TSD_SALE_ORD_WORK
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_ord_work (
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
    ref_type                       CHAR(2)                        NOT NULL  ,  -- [LEGACY] REF_TP
    ref_id                         INTEGER                        NOT NULL  ,  -- [LEGACY] REF_ID
    prdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PRDT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    elc_work_type                  VARCHAR(4)                     NOT NULL  ,  -- [LEGACY] ELC_WORK_TP
    chk_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] CHK_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_ord_work
IS '레거시 테이블 TSD_SALE_ORD_WORK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_ord_work__is_deleted
    ON srm.sale_ord_work (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_rtn
-- 레거시: TSD_SALE_RTN
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_rtn (
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
    sale_rtn_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_RTN_NO
    sale_rtn_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_RTN_DT
    sale_rtn_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_RTN_TP
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    path_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PATH_TP
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    cday_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CDAY_TP
    paym_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAYM_DT
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    zero_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ZERO_TAX_YN
    free_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] FREE_TAX_YN
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    tot_usd_amt                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] TOT_USD_AMT
    tot_pnt_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_PNT_AMT
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    shpt_type                      CHAR(4)                                  ,  -- [LEGACY] SHPT_TP
    delv_addr_id                   INTEGER                                  ,  -- [LEGACY] DELV_ADDR_ID
    delv_memo                      VARCHAR(500)                             ,  -- [LEGACY] DELV_MEMO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    delv_rcv_id                    INTEGER                                  ,  -- [LEGACY] DELV_RCV_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tsd_sale_rtn__codeay_type   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__CDAY_TP
    ix_tsd_sale_rtn__crcy_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__CRCY_TP
    ix_tsd_sale_rtn__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__CRDT_ID
    ix_tsd_sale_rtn__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__CRDT_TP
    ix_tsd_sale_rtn__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__CUST_CD
    ix_tsd_sale_rtn__delv_rcv_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__DELV_RCV_ID
    ix_tsd_sale_rtn__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__DEPT_CD
    ix_tsd_sale_rtn__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__DWEL_ORD_ID
    ix_tsd_sale_rtn__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__EAS_SIGN_ID
    ix_tsd_sale_rtn__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__EMPY_CD
    ix_tsd_sale_rtn__free_tax_flag TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__FREE_TAX_YN
    ix_tsd_sale_rtn__proc_st       TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__PROC_ST
    ix_tsd_sale_rtn__sale_rtn_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__SALE_RTN_DT
    ix_tsd_sale_rtn__sale_rtn_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__SALE_RTN_TP
    ix_tsd_sale_rtn__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__SHPT_TP
    ix_tsd_sale_rtn__whse_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__WHSE_CD
    ix_tsd_sale_rtn__zero_tax_flag TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN__ZERO_TAX_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_rtn
IS '레거시 테이블 TSD_SALE_RTN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rtn__is_deleted
    ON srm.sale_rtn (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_rtn_doa_purc
-- 레거시: TSD_SALE_RTN_DOA_PURC
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_rtn_doa_purc (
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
    sale_rtn_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_RTN_PRDT_ID
    prdt_sn                        VARCHAR(50)                              ,  -- [LEGACY] PRDT_SN
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    purc_rtn_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_RTN_DT
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    usd_purc_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_PURC_PR
    krw_purc_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_PURC_PR
    purc_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] PURC_USD_AMT
    purc_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUP_AMT
    purc_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_TAX_AMT
    purc_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_SUM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    purc_id                        INTEGER                                  ,  -- [LEGACY] PURC_ID
    ix_tsd_sale_rtn_doa_purc__cust_code TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_PURC__CUST_CD
    ix_tsd_sale_rtn_doa_purc__prdt_sn TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_PURC__PRDT_SN
    ix_tsd_sale_rtn_doa_purc__proc_st TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_PURC__PROC_ST
    ix_tsd_sale_rtn_doa_purc__prtn_date TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_PURC__PRTN_DT
    ix_tsd_sale_rtn_doa_purc__purc_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_PURC__PURC_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_rtn_doa_purc
IS '레거시 테이블 TSD_SALE_RTN_DOA_PURC에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rtn_doa_purc__is_deleted
    ON srm.sale_rtn_doa_purc (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_rtn_doa_sale
-- 레거시: TSD_SALE_RTN_DOA_SALE
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_rtn_doa_sale (
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
    sale_rtn_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_RTN_PRDT_ID
    sale_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_ID
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tsd_sale_rtn_doa_sale__sale_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_DOA_SALE__SALE_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_rtn_doa_sale
IS '레거시 테이블 TSD_SALE_RTN_DOA_SALE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rtn_doa_sale__is_deleted
    ON srm.sale_rtn_doa_sale (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_rtn_product
-- 레거시: TSD_SALE_RTN_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_rtn_product (
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
    sale_rtn_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_RTN_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    free_tax_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] FREE_TAX_YN
    usd_sale_pr                    NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] USD_SALE_PR
    krw_sale_pr                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] KRW_SALE_PR
    sale_rtn_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_RTN_QTY
    sale_usd_amt                   NUMERIC(17, 4)                 NOT NULL  ,  -- [LEGACY] SALE_USD_AMT
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    sale_prdt_id                   INTEGER                                  ,  -- [LEGACY] SALE_PRDT_ID
    ix_tsd_sale_rtn_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_PRDT__PRDT_CD
    ix_tsd_sale_rtn_prdt__sale_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_PRDT__SALE_PRDT_ID
    ix_tsd_sale_rtn_prdt__sale_rtn_id TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_PRDT__SALE_RTN_ID
    ix_tsd_sale_rtn_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_RTN_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_rtn_product
IS '레거시 테이블 TSD_SALE_RTN_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rtn_product__is_deleted
    ON srm.sale_rtn_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.sale_summaries
-- 레거시: TSD_SALE_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.sale_summaries (
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
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_sup_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUP_AMT
    sale_tax_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_TAX_AMT
    sale_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_SUM_AMT
    ix_tsd_sale_sum__base_date     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__BASE_DT
    ix_tsd_sale_sum__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__CRDT_TP
    ix_tsd_sale_sum__cust_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__CUST_CD
    ix_tsd_sale_sum__dept_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__DEPT_CD
    ix_tsd_sale_sum__empy_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__EMPY_CD
    ix_tsd_sale_sum__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__PRDT_CD
    ix_tsd_sale_sum__sale_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__SALE_TP
    ix_tsd_sale_sum__stck_type     TEXT                                     ,  -- [LEGACY] IX_TSD_SALE_SUM__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.sale_summaries
IS '레거시 테이블 TSD_SALE_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_summaries__is_deleted
    ON srm.sale_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.wthds
-- 레거시: TSD_WTHD_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.wthds (
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
    wthd_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] WTHD_NO
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    wthd_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] WTHD_DT
    wthd_tm                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] WTHD_TM
    wthd_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] WTHD_TP
    cbib_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] CBIB_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                           ,  -- [LEGACY] EXCH_RAT
    wthd_usd_amt                   NUMERIC(17, 4)                           ,  -- [LEGACY] WTHD_USD_AMT
    wthd_tot_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] WTHD_TOT_AMT
    wthd_net_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] WTHD_NET_AMT
    wthd_fee_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] WTHD_FEE_AMT
    wthd_sum_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] WTHD_SUM_AMT
    fnsh_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FNSH_YN
    refr_number                    VARCHAR(100)                             ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.wthds
IS '레거시 테이블 TSD_WTHD_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_wthds__is_deleted
    ON srm.wthds (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_leas
-- 레거시: TSR_RNTL_LEAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_leas (
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
    cnrt_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] CNRT_NO
    cnrt_type                      VARCHAR(4)                     NOT NULL  ,  -- [LEGACY] CNRT_TP
    cnrt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CNRT_AMT
    cnrt_mns                       INTEGER                        NOT NULL  ,  -- [LEGACY] CNRT_MNS
    start_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] START_DT
    close_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLOSE_DT
    intr_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INTR_RAT
    pymt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYMT_AMT
    pymt_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PYMT_TP
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tsr_rntl_leas__close_date   TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__CLOSE_DT
    ix_tsr_rntl_leas__cnrt_type    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__CNRT_TP
    ix_tsr_rntl_leas__dept_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__DEPT_CD
    ix_tsr_rntl_leas__empy_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__EMPY_CD
    ix_tsr_rntl_leas__proc_st      TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__PROC_ST
    ix_tsr_rntl_leas__pymt_type    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__PYMT_TP
    ix_tsr_rntl_leas__regi_date    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__REGI_DT
    ix_tsr_rntl_leas__start_date   TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS__START_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_leas
IS '레거시 테이블 TSR_RNTL_LEAS에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_leas__is_deleted
    ON srm.rntl_leas (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_leas_details
-- 레거시: TSR_RNTL_LEAS_DTL
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_leas_details (
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
    rntl_leas_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_LEAS_ID
    pymt_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] PYMT_YM
    pymt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PYMT_AMT
    prnc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRNC_AMT
    intr_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INTR_AMT
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    pymt_proc_st                   CHAR(1)                                  ,  -- [LEGACY] PYMT_PROC_ST
    pymt_proc_on                   TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] PYMT_PROC_ON
    pymt_proc_by                   VARCHAR(50)                              ,  -- [LEGACY] PYMT_PROC_BY
    ix_tsr_rntl_leas_datel__pymt_proc_st TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS_DTL__PYMT_PROC_ST
    ix_tsr_rntl_leas_datel__pymt_ym TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS_DTL__PYMT_YM
    ix_tsr_rntl_leas_datel__rntl_leas_id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_LEAS_DTL__RNTL_LEAS_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_leas_details
IS '레거시 테이블 TSR_RNTL_LEAS_DTL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_leas_details__is_deleted
    ON srm.rntl_leas_details (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_ordr
-- 레거시: TSR_RNTL_ORDR
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_ordr (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    start_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] START_DT
    close_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLOSE_DT
    rntl_mns                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_MNS
    cust_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_DEPT_NM
    cust_site_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_SITE_NM
    cust_plce_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_PLCE_NM
    cnrt_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] CNRT_MNGR_NM
    cnrt_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] CNRT_MNGR_TEL
    site_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_NM
    site_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_TEL
    tax_email                      VARCHAR(100)                             ,  -- [LEGACY] TAX_EMAIL
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    org_rntl_ord_id                INTEGER                                  ,  -- [LEGACY] ORG_RNTL_ORD_ID
    ix_tsr_rntl_ordr__close_date   TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CLOSE_DT
    ix_tsr_rntl_ordr__cnrt_mngr_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CNRT_MNGR_NM
    ix_tsr_rntl_ordr__cust_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CUST_CD
    ix_tsr_rntl_ordr__cust_dept_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CUST_DEPT_NM
    ix_tsr_rntl_ordr__cust_plce_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CUST_PLCE_NM
    ix_tsr_rntl_ordr__cust_site_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__CUST_SITE_NM
    ix_tsr_rntl_ordr__dept_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__DEPT_CD
    ix_tsr_rntl_ordr__empy_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__EMPY_CD
    ix_tsr_rntl_ordr__proc_st      TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__PROC_ST
    ix_tsr_rntl_ordr__regi_date    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__REGI_DT
    ix_tsr_rntl_ordr__site_mngr_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__SITE_MNGR_NM
    ix_tsr_rntl_ordr__start_date   TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__START_DT
    ix_tsr_rntl_ordr__tax_email    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR__TAX_EMAIL
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_ordr
IS '레거시 테이블 TSR_RNTL_ORDR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_ordr__is_deleted
    ON srm.rntl_ordr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_ordr_history
-- 레거시: TSR_RNTL_ORDR_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_ordr_history (
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
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    start_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] START_DT
    close_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLOSE_DT
    rntl_mns                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_MNS
    cust_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_DEPT_NM
    cust_site_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_SITE_NM
    cust_plce_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_PLCE_NM
    ctrt_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] CTRT_MNGR_NM
    ctrt_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] CTRT_MNGR_TEL
    site_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_NM
    site_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_TEL
    tax_email                      VARCHAR(100)                             ,  -- [LEGACY] TAX_EMAIL
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tsr_rntl_ordr_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_HIST__HIST_TP
    ix_tsr_rntl_ordr_hist__id      TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_ordr_history
IS '레거시 테이블 TSR_RNTL_ORDR_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_ordr_history__is_deleted
    ON srm.rntl_ordr_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_ordr_product
-- 레거시: TSR_RNTL_ORDR_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_ordr_product (
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
    rntl_ordr_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    rntl_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_QTY
    unit_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] UNIT_PR
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tsr_rntl_ordr_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_PRDT__PRDT_CD
    ix_tsr_rntl_ordr_prdt__rntl_ordr_id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_PRDT__RNTL_ORDR_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_ordr_product
IS '레거시 테이블 TSR_RNTL_ORDR_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_ordr_product__is_deleted
    ON srm.rntl_ordr_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_ordr_product_history
-- 레거시: TSR_RNTL_ORDR_PRDT_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_ordr_product_history (
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
    rntl_ordr_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    rntl_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_QTY
    unit_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] UNIT_PR
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tsr_rntl_ordr_prdt_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_PRDT_HIST__HIST_TP
    ix_tsr_rntl_ordr_prdt_hist__id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_ORDR_PRDT_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_ordr_product_history
IS '레거시 테이블 TSR_RNTL_ORDR_PRDT_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_ordr_product_history__is_deleted
    ON srm.rntl_ordr_product_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_sale
-- 레거시: TSR_RNTL_SALE
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_sale (
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
    rntl_ordr_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_ID
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_DEPT_NM
    cust_site_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_SITE_NM
    cust_plce_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_PLCE_NM
    cnrt_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] CNRT_MNGR_NM
    cnrt_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] CNRT_MNGR_TEL
    site_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_NM
    site_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_TEL
    tax_email                      VARCHAR(100)                             ,  -- [LEGACY] TAX_EMAIL
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    tax_id                         INTEGER                                  ,  -- [LEGACY] TAX_ID
    ix_tsr_rntl_sale__cnrt_mngr_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__CNRT_MNGR_NM
    ix_tsr_rntl_sale__cust_dept_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__CUST_DEPT_NM
    ix_tsr_rntl_sale__cust_plce_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__CUST_PLCE_NM
    ix_tsr_rntl_sale__cust_site_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__CUST_SITE_NM
    ix_tsr_rntl_sale__dept_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__DEPT_CD
    ix_tsr_rntl_sale__empy_code    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__EMPY_CD
    ix_tsr_rntl_sale__rntl_ordr_id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__RNTL_ORDR_ID
    ix_tsr_rntl_sale__sale_date    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__SALE_DT
    ix_tsr_rntl_sale__site_mngr_name TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__SITE_MNGR_NM
    ix_tsr_rntl_sale__tax_email    TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE__TAX_EMAIL
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_sale
IS '레거시 테이블 TSR_RNTL_SALE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_sale__is_deleted
    ON srm.rntl_sale (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_sale_history
-- 레거시: TSR_RNTL_SALE_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_sale_history (
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
    rntl_ordr_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_ID
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_DEPT_NM
    cust_site_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_SITE_NM
    cust_plce_name                 VARCHAR(100)                             ,  -- [LEGACY] CUST_PLCE_NM
    ctrt_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] CTRT_MNGR_NM
    ctrt_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] CTRT_MNGR_TEL
    site_mngr_name                 VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_NM
    site_mngr_tel                  VARCHAR(100)                             ,  -- [LEGACY] SITE_MNGR_TEL
    tax_email                      VARCHAR(100)                             ,  -- [LEGACY] TAX_EMAIL
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    tax_id                         INTEGER                                  ,  -- [LEGACY] TAX_ID
    ix_tsr_rntl_sale_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_HIST__HIST_TP
    ix_tsr_rntl_sale_hist__id      TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_sale_history
IS '레거시 테이블 TSR_RNTL_SALE_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_sale_history__is_deleted
    ON srm.rntl_sale_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_sale_product
-- 레거시: TSR_RNTL_SALE_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_sale_product (
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
    rntl_sale_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_SALE_ID
    rntl_ordr_prdt_id              INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_PRDT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    rntl_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_QTY
    unit_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] UNIT_PR
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    tax_bill_item_id               INTEGER                                  ,  -- [LEGACY] TAX_BILL_ITEM_ID
    ix_tsr_rntl_sale_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_PRDT__PRDT_CD
    ix_tsr_rntl_sale_prdt__rntl_ordr_prdt_id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_PRDT__RNTL_ORDR_PRDT_ID
    ix_tsr_rntl_sale_prdt__rntl_sale_id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_PRDT__RNTL_SALE_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_sale_product
IS '레거시 테이블 TSR_RNTL_SALE_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_sale_product__is_deleted
    ON srm.rntl_sale_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: srm.rntl_sale_product_history
-- 레거시: TSR_RNTL_SALE_PRDT_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS srm.rntl_sale_product_history (
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
    rntl_sale_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_SALE_ID
    rntl_ordr_prdt_id              INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_ORDR_PRDT_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    rntl_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RNTL_QTY
    unit_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] UNIT_PR
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    tax_bill_item_id               INTEGER                                  ,  -- [LEGACY] TAX_BILL_ITEM_ID
    ix_tsr_rntl_sale_prdt_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_PRDT_HIST__HIST_TP
    ix_tsr_rntl_sale_prdt_hist__id TEXT                                     ,  -- [LEGACY] IX_TSR_RNTL_SALE_PRDT_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE srm.rntl_sale_product_history
IS '레거시 테이블 TSR_RNTL_SALE_PRDT_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rntl_sale_product_history__is_deleted
    ON srm.rntl_sale_product_history (is_deleted)
 WHERE is_deleted = false;


