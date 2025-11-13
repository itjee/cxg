-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: fim
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: fim.banks
-- 레거시: TFI_BANK_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.banks (
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
    bank_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] BANK_CD
    bank_acct_number               VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] BANK_ACCT_NO
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tfi_bank_mst__bank_acct_number TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_MST__BANK_ACCT_NO
    ix_tfi_bank_mst__bank_code     TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_MST__BANK_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.banks
IS '레거시 테이블 TFI_BANK_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_banks__is_deleted
    ON fim.banks (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.bank_transactions
-- 레거시: TFI_BANK_TRN
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.bank_transactions (
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
    bank_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] BANK_CD
    bank_acct_number               VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] BANK_ACCT_NO
    bank_trn_number                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] BANK_TRN_NO
    bank_trn_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] BANK_TRN_DT
    bank_trn_sq                    INTEGER                        NOT NULL  ,  -- [LEGACY] BANK_TRN_SQ
    bank_trn_tm                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] BANK_TRN_TM
    bank_rcv_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BANK_RCV_AMT
    bank_out_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BANK_OUT_AMT
    bank_rem_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BANK_REM_AMT
    remark1                        VARCHAR(500)                             ,  -- [LEGACY] REMARK1
    remark2                        VARCHAR(500)                             ,  -- [LEGACY] REMARK2
    remark3                        VARCHAR(500)                             ,  -- [LEGACY] REMARK3
    remark4                        VARCHAR(500)                             ,  -- [LEGACY] REMARK4
    memo                           VARCHAR(100)                             ,  -- [LEGACY] MEMO
    reg_datem                      VARCHAR(14)                              ,  -- [LEGACY] REG_DTM
    del_flag                       VARCHAR(1)                               ,  -- [LEGACY] DEL_YN
    ix_tfi_bank_trn__bank_acct_number TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_TRN__BANK_ACCT_NO
    ix_tfi_bank_trn__bank_code     TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_TRN__BANK_CD
    ix_tfi_bank_trn__bank_trn_date TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_TRN__BANK_TRN_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.bank_transactions
IS '레거시 테이블 TFI_BANK_TRN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_bank_transactions__is_deleted
    ON fim.bank_transactions (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.bank_trn_dpst
-- 레거시: TFI_BANK_TRN_DPST
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.bank_trn_dpst (
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
    bank_trn_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] BANK_TRN_ID
    dpst_mst_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] DPST_MST_ID
    ix_tfi_bank_trn_dpst__bank_trn_id TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_TRN_DPST__BANK_TRN_ID
    ix_tfi_bank_trn_dpst__dpst_mst_id TEXT                                     ,  -- [LEGACY] IX_TFI_BANK_TRN_DPST__DPST_MST_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.bank_trn_dpst
IS '레거시 테이블 TFI_BANK_TRN_DPST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_bank_trn_dpst__is_deleted
    ON fim.bank_trn_dpst (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.bank_trn_wthd
-- 레거시: TFI_BANK_TRN_WTHD
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.bank_trn_wthd (
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
    bank_trn_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] BANK_TRN_ID
    wthd_mst_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] WTHD_MST_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.bank_trn_wthd
IS '레거시 테이블 TFI_BANK_TRN_WTHD에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_bank_trn_wthd__is_deleted
    ON fim.bank_trn_wthd (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.card_emp
-- 레거시: TFI_CARD_EMP
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.card_emp (
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
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    card_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] CARD_NO
    bank_code                      VARCHAR(10)                              ,  -- [LEGACY] BANK_CD
    bank_name                      VARCHAR(20)                              ,  -- [LEGACY] BANK_NM
    acct_card_code                 VARCHAR(2)                               ,  -- [LEGACY] ACCT_CARD_CD
    card_phne_number               VARCHAR(20)                              ,  -- [LEGACY] CARD_PHNE_NO
    sett_bank_name                 VARCHAR(20)                              ,  -- [LEGACY] SETT_BANK_NM
    sett_bank_acct_number          VARCHAR(20)                              ,  -- [LEGACY] SETT_BANK_ACCT_NO
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tfi_card_emp__acct_card_code TEXT                                     ,  -- [LEGACY] IX_TFI_CARD_EMP__ACCT_CARD_CD
    ix_tfi_card_emp__bank_code     TEXT                                     ,  -- [LEGACY] IX_TFI_CARD_EMP__BANK_CD
    ix_tfi_card_emp__bank_name     TEXT                                     ,  -- [LEGACY] IX_TFI_CARD_EMP__BANK_NM
    ix_tfi_card_emp__empy_code     TEXT                                     ,  -- [LEGACY] IX_TFI_CARD_EMP__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.card_emp
IS '레거시 테이블 TFI_CARD_EMP에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_card_emp__is_deleted
    ON fim.card_emp (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.tax_bill
-- 레거시: TFI_TAX_BILL
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.tax_bill (
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
    tax_bill_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] TAX_BILL_NO
    corp_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CORP_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    bill_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] BILL_TP
    note_type                      CHAR(1)                                  ,  -- [LEGACY] NOTE_TP
    nts_bill_number                VARCHAR(30)                              ,  -- [LEGACY] NTS_BILL_NO
    tax_issu_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] TAX_ISSU_DT
    tax_issu_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_ISSU_TP
    tax_bill_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_BILL_TP
    tax_chge_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_CHGE_TP
    tax_mthd_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_MTHD_TP
    tot_sup_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUP_AMT
    tot_tax_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_TAX_AMT
    tot_sum_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_SUM_AMT
    remark1                        VARCHAR(150)                             ,  -- [LEGACY] REMARK1
    remark2                        VARCHAR(150)                             ,  -- [LEGACY] REMARK2
    remark3                        VARCHAR(150)                             ,  -- [LEGACY] REMARK3
    selr_mgt_number                VARCHAR(30)                              ,  -- [LEGACY] SELR_MGT_NO
    selr_biz_number                VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] SELR_BIZ_NO
    selr_sub_id                    VARCHAR(10)                              ,  -- [LEGACY] SELR_SUB_ID
    selr_biz_name                  VARCHAR(200)                             ,  -- [LEGACY] SELR_BIZ_NM
    selr_ceo_name                  VARCHAR(100)                             ,  -- [LEGACY] SELR_CEO_NM
    selr_address                   VARCHAR(300)                             ,  -- [LEGACY] SELR_ADDRESS
    selr_biz_type                  VARCHAR(100)                             ,  -- [LEGACY] SELR_BIZ_TYPE
    selr_biz_item                  VARCHAR(100)                             ,  -- [LEGACY] SELR_BIZ_ITEM
    selr_empy_name                 VARCHAR(100)                             ,  -- [LEGACY] SELR_EMPY_NM
    selr_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] SELR_DEPT_NM
    selr_tel_number                VARCHAR(20)                              ,  -- [LEGACY] SELR_TEL_NO
    selr_cel_number                VARCHAR(20)                              ,  -- [LEGACY] SELR_CEL_NO
    selr_email                     VARCHAR(100)                             ,  -- [LEGACY] SELR_EMAIL
    selr_numberti_flag             CHAR(1)                                  ,  -- [LEGACY] SELR_NOTI_YN
    buyr_mgt_number                VARCHAR(30)                              ,  -- [LEGACY] BUYR_MGT_NO
    buyr_biz_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] BUYR_BIZ_TP
    buyr_biz_number                VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] BUYR_BIZ_NO
    buyr_sub_id                    VARCHAR(10)                              ,  -- [LEGACY] BUYR_SUB_ID
    buyr_biz_name                  VARCHAR(200)                             ,  -- [LEGACY] BUYR_BIZ_NM
    buyr_ceo_name                  VARCHAR(100)                             ,  -- [LEGACY] BUYR_CEO_NM
    buyr_address                   VARCHAR(300)                             ,  -- [LEGACY] BUYR_ADDRESS
    buyr_biz_type                  VARCHAR(100)                             ,  -- [LEGACY] BUYR_BIZ_TYPE
    buyr_biz_item                  VARCHAR(100)                             ,  -- [LEGACY] BUYR_BIZ_ITEM
    buyr_empy_name1                VARCHAR(100)                             ,  -- [LEGACY] BUYR_EMPY_NM1
    buyr_dept_name1                VARCHAR(100)                             ,  -- [LEGACY] BUYR_DEPT_NM1
    buyr_tel_number1               VARCHAR(20)                              ,  -- [LEGACY] BUYR_TEL_NO1
    buyr_cel_number1               VARCHAR(20)                              ,  -- [LEGACY] BUYR_CEL_NO1
    buyr_email1                    VARCHAR(100)                             ,  -- [LEGACY] BUYR_EMAIL1
    buyr_empy_name2                VARCHAR(100)                             ,  -- [LEGACY] BUYR_EMPY_NM2
    buyr_dept_name2                VARCHAR(100)                             ,  -- [LEGACY] BUYR_DEPT_NM2
    buyr_tel_number2               VARCHAR(20)                              ,  -- [LEGACY] BUYR_TEL_NO2
    buyr_cel_number2               VARCHAR(20)                              ,  -- [LEGACY] BUYR_CEL_NO2
    buyr_email2                    VARCHAR(100)                             ,  -- [LEGACY] BUYR_EMAIL2
    buyr_numberti_flag             CHAR(1)                                  ,  -- [LEGACY] BUYR_NOTI_YN
    buyr_cldn_st                   CHAR(1)                                  ,  -- [LEGACY] BUYR_CLDN_ST
    buyr_cldn_date                 CHAR(8)                                  ,  -- [LEGACY] BUYR_CLDN_DT
    trst_mgt_number                VARCHAR(30)                              ,  -- [LEGACY] TRST_MGT_NO
    trst_biz_number                VARCHAR(20)                              ,  -- [LEGACY] TRST_BIZ_NO
    trst_sub_id                    VARCHAR(10)                              ,  -- [LEGACY] TRST_SUB_ID
    trst_biz_name                  VARCHAR(200)                             ,  -- [LEGACY] TRST_BIZ_NM
    trst_ceo_name                  VARCHAR(100)                             ,  -- [LEGACY] TRST_CEO_NM
    trst_address                   VARCHAR(300)                             ,  -- [LEGACY] TRST_ADDRESS
    trst_biz_type                  VARCHAR(100)                             ,  -- [LEGACY] TRST_BIZ_TYPE
    trst_biz_item                  VARCHAR(100)                             ,  -- [LEGACY] TRST_BIZ_ITEM
    trst_empy_name                 VARCHAR(100)                             ,  -- [LEGACY] TRST_EMPY_NM
    trst_dept_name                 VARCHAR(100)                             ,  -- [LEGACY] TRST_DEPT_NM
    trst_tel_number                VARCHAR(20)                              ,  -- [LEGACY] TRST_TEL_NO
    trst_cel_number                VARCHAR(20)                              ,  -- [LEGACY] TRST_CEL_NO
    trst_email                     VARCHAR(100)                             ,  -- [LEGACY] TRST_EMAIL
    trst_numberti_flag             CHAR(1)                                  ,  -- [LEGACY] TRST_NOTI_YN
    tax_mdfy_type                  CHAR(1)                                  ,  -- [LEGACY] TAX_MDFY_TP
    nts_orgn_number                VARCHAR(30)                              ,  -- [LEGACY] NTS_ORGN_NO
    biz_rgst_flag                  CHAR(1)                                  ,  -- [LEGACY] BIZ_RGST_YN
    bnk_rgst_flag                  CHAR(1)                                  ,  -- [LEGACY] BNK_RGST_YN
    tax_sale_type                  VARCHAR(50)                              ,  -- [LEGACY] TAX_SALE_TP
    email_addr                     VARCHAR(100)                             ,  -- [LEGACY] EMAIL_ADDR
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    send_flag                      CHAR(1)                                  ,  -- [LEGACY] SEND_YN
    cancel_flag                    CHAR(1)                                  ,  -- [LEGACY] CANCEL_YN
    nts_confirm_num                VARCHAR(100)                             ,  -- [LEGACY] NTS_CONFIRM_NUM
    ix_tfi_tax_bill__nts_bill_number TEXT                                     ,  -- [LEGACY] IX_TFI_TAX_BILL__NTS_BILL_NO
    ix_tfi_tax_bill__tax_issu_date TEXT                                     ,  -- [LEGACY] IX_TFI_TAX_BILL__TAX_ISSU_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.tax_bill
IS '레거시 테이블 TFI_TAX_BILL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_tax_bill__is_deleted
    ON fim.tax_bill (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.tax_bill_item
-- 레거시: TFI_TAX_BILL_ITEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.tax_bill_item (
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
    tax_bill_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] TAX_BILL_ID
    trde_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] TRDE_DT
    item_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] ITEM_NM
    spec_name                      VARCHAR(60)                              ,  -- [LEGACY] SPEC_NM
    qty                            INTEGER                        NOT NULL  ,  -- [LEGACY] QTY
    price                          NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRICE
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    remark                         VARCHAR(100)                             ,  -- [LEGACY] REMARK
    ix_tfi_tax_bill_item__tax_bill_id TEXT                                     ,  -- [LEGACY] IX_TFI_TAX_BILL_ITEM__TAX_BILL_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.tax_bill_item
IS '레거시 테이블 TFI_TAX_BILL_ITEM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_tax_bill_item__is_deleted
    ON fim.tax_bill_item (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: fim.tax_bill_sale
-- 레거시: TFI_TAX_BILL_SALE
-- ============================================================================

CREATE TABLE IF NOT EXISTS fim.tax_bill_sale (
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
    tax_bill_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] TAX_BILL_ID
    sale_mst_prdt_id               INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_MST_PRDT_ID
    ix_tfi_tax_bill_sale__sale_mst_prdt_id TEXT                                     ,  -- [LEGACY] IX_TFI_TAX_BILL_SALE__SALE_MST_PRDT_ID
    ix_tfi_tax_bill_sale__tax_bill_id TEXT                                     ,  -- [LEGACY] IX_TFI_TAX_BILL_SALE__TAX_BILL_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE fim.tax_bill_sale
IS '레거시 테이블 TFI_TAX_BILL_SALE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_tax_bill_sale__is_deleted
    ON fim.tax_bill_sale (is_deleted)
 WHERE is_deleted = false;


