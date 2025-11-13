-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: ivm
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: ivm.sale_rsv
-- 레거시: TIV_SALE_RSV
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.sale_rsv (
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
    sale_rsv_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_RSV_NO
    sale_rsv_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_RSV_DT
    sale_rsv_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_RSV_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    resv_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RESV_QTY
    expn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EXPN_DT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                                  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tiv_sale_rsv__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__DEPT_CD
    ix_tiv_sale_rsv__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__EAS_SIGN_ID
    ix_tiv_sale_rsv__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__EMPY_CD
    ix_tiv_sale_rsv__expn_date     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__EXPN_DT
    ix_tiv_sale_rsv__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__PRDT_CD
    ix_tiv_sale_rsv__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__PROC_ST
    ix_tiv_sale_rsv__sale_rsv_date TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__SALE_RSV_DT
    ix_tiv_sale_rsv__sale_rsv_type TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__SALE_RSV_TP
    ix_tiv_sale_rsv__stck_type     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__STCK_TP
    ix_tiv_sale_rsv__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.sale_rsv
IS '레거시 테이블 TIV_SALE_RSV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rsv__is_deleted
    ON ivm.sale_rsv (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.sale_rsv_ext
-- 레거시: TIV_SALE_RSV_EXT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.sale_rsv_ext (
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
    sale_rsv_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_RSV_ID
    sbmt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SBMT_DT
    expn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] EXPN_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tiv_sale_rsv_ext__dept_code TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__DEPT_CD
    ix_tiv_sale_rsv_ext__eas_sign_id TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__EAS_SIGN_ID
    ix_tiv_sale_rsv_ext__empy_code TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__EMPY_CD
    ix_tiv_sale_rsv_ext__expn_date TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__EXPN_DT
    ix_tiv_sale_rsv_ext__proc_st   TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__PROC_ST
    ix_tiv_sale_rsv_ext__sale_rsv_id TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__SALE_RSV_ID
    ix_tiv_sale_rsv_ext__sbmt_date TEXT                                     ,  -- [LEGACY] IX_TIV_SALE_RSV_EXT__SBMT_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.sale_rsv_ext
IS '레거시 테이블 TIV_SALE_RSV_EXT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sale_rsv_ext__is_deleted
    ON ivm.sale_rsv_ext (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_acc
-- 레거시: TIV_STCK_ACC
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_acc (
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
    stck_acc_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_ACC_NO
    stck_acc_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] STCK_ACC_DT
    stck_acc_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_ACC_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    shpt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SHPT_DT
    shpt_type                      CHAR(4)                                  ,  -- [LEGACY] SHPT_TP
    delv_addr_id                   INTEGER                                  ,  -- [LEGACY] DELV_ADDR_ID
    delv_memo                      VARCHAR(500)                             ,  -- [LEGACY] DELV_MEMO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tiv_stck_acc__delv_addr_id  TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__DELV_ADDR_ID
    ix_tiv_stck_acc__delv_ord_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__DELV_ORD_ID
    ix_tiv_stck_acc__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__DEPT_CD
    ix_tiv_stck_acc__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__DWEL_ORD_ID
    ix_tiv_stck_acc__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__EAS_SIGN_ID
    ix_tiv_stck_acc__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__EMPY_CD
    ix_tiv_stck_acc__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__PROC_ST
    ix_tiv_stck_acc__shpt_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__SHPT_DT
    ix_tiv_stck_acc__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__SHPT_TP
    ix_tiv_stck_acc__stck_acc_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__STCK_ACC_DT
    ix_tiv_stck_acc__stck_acc_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__STCK_ACC_TP
    ix_tiv_stck_acc__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_acc
IS '레거시 테이블 TIV_STCK_ACC에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_acc__is_deleted
    ON ivm.stck_acc (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_acc_product
-- 레거시: TIV_STCK_ACC_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_acc_product (
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
    stck_acc_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_ACC_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    stck_acc_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_ACC_QTY
    cost_pr                        NUMERIC(17, 2)                           ,  -- [LEGACY] COST_PR
    cost_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] COST_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tiv_stck_acc_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC_PRDT__PRDT_CD
    ix_tiv_stck_acc_prdt__stck_acc_id TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC_PRDT__STCK_ACC_ID
    ix_tiv_stck_acc_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ACC_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_acc_product
IS '레거시 테이블 TIV_STCK_ACC_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_acc_product__is_deleted
    ON ivm.stck_acc_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_adj
-- 레거시: TIV_STCK_ADJ
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_adj (
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
    stck_adj_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_ADJ_NO
    stck_adj_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] STCK_ADJ_DT
    stck_adj_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_ADJ_TP
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    aply_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] APLY_DT
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tiv_stck_adj__aply_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__APLY_DT
    ix_tiv_stck_adj__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__DEPT_CD
    ix_tiv_stck_adj__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__EAS_SIGN_ID
    ix_tiv_stck_adj__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__EMPY_CD
    ix_tiv_stck_adj__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__PROC_ST
    ix_tiv_stck_adj__stck_adj_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__STCK_ADJ_DT
    ix_tiv_stck_adj__stck_adj_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__STCK_ADJ_TP
    ix_tiv_stck_adj__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_adj
IS '레거시 테이블 TIV_STCK_ADJ에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_adj__is_deleted
    ON ivm.stck_adj (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_adj_product
-- 레거시: TIV_STCK_ADJ_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_adj_product (
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
    stck_adj_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_ADJ_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    stck_adj_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_ADJ_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    purc_date                      CHAR(8)                                  ,  -- [LEGACY] PURC_DT
    purc_pr                        NUMERIC(17, 2)                           ,  -- [LEGACY] PURC_PR
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    ix_tiv_stck_adj_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ_PRDT__PRDT_CD
    ix_tiv_stck_adj_prdt__stck_adj_id TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ_PRDT__STCK_ADJ_ID
    ix_tiv_stck_adj_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_ADJ_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_adj_product
IS '레거시 테이블 TIV_STCK_ADJ_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_adj_product__is_deleted
    ON ivm.stck_adj_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_age
-- 레거시: TIV_STCK_AGE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_age (
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
    base_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] BASE_YM
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    purc_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_NO
    purc_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_DT
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    stck_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_QTY
    exct_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] EXCT_QTY
    long_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] LONG_QTY
    xprm_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XPRM_QTY
    xrma_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XRMA_QTY
    xdoa_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XDOA_QTY
    xrep_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XREP_QTY
    ix_tiv_stck_age__base_ym       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE__BASE_YM
    ix_tiv_stck_age__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE__PRDT_CD
    ix_tiv_stck_age__purc_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE__PURC_DT
    ix_tiv_stck_age__purc_number   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE__PURC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_age
IS '레거시 테이블 TIV_STCK_AGE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_age__is_deleted
    ON ivm.stck_age (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_age_day
-- 레거시: TIV_STCK_AGE_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_age_day (
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
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    purc_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_NO
    purc_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] PURC_DT
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    stck_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_QTY
    exct_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] EXCT_QTY
    long_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] LONG_QTY
    xprm_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XPRM_QTY
    xrma_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XRMA_QTY
    xdoa_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XDOA_QTY
    xrep_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] XREP_QTY
    ix_tiv_stck_age_day__base_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE_DAY__BASE_DT
    ix_tiv_stck_age_day__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE_DAY__PRDT_CD
    ix_tiv_stck_age_day__purc_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE_DAY__PURC_DT
    ix_tiv_stck_age_day__purc_number TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_AGE_DAY__PURC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_age_day
IS '레거시 테이블 TIV_STCK_AGE_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_age_day__is_deleted
    ON ivm.stck_age_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_chg
-- 레거시: TIV_STCK_CHG
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_chg (
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
    stck_chg_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_CHG_NO
    stck_chg_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] STCK_CHG_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    description                    TEXT                           NOT NULL  ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    aply_date                      CHAR(8)                                  ,  -- [LEGACY] APLY_DT
    ix_tiv_stck_chg__aply_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__APLY_DT
    ix_tiv_stck_chg__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__DEPT_CD
    ix_tiv_stck_chg__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__EMPY_CD
    ix_tiv_stck_chg__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__PROC_ST
    ix_tiv_stck_chg__stck_chg_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__STCK_CHG_DT
    ix_tiv_stck_chg__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_chg
IS '레거시 테이블 TIV_STCK_CHG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_chg__is_deleted
    ON ivm.stck_chg (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_chg_product
-- 레거시: TIV_STCK_CHG_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_chg_product (
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
    stck_chg_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_CHG_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    org_stck_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ORG_STCK_TP
    chg_stck_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CHG_STCK_TP
    stck_chg_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_CHG_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tiv_stck_chg_prdt__chg_stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG_PRDT__CHG_STCK_TP
    ix_tiv_stck_chg_prdt__org_stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG_PRDT__ORG_STCK_TP
    ix_tiv_stck_chg_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG_PRDT__PRDT_CD
    ix_tiv_stck_chg_prdt__stck_chg_id TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CHG_PRDT__STCK_CHG_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_chg_product
IS '레거시 테이블 TIV_STCK_CHG_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_chg_product__is_deleted
    ON ivm.stck_chg_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_cto
-- 레거시: TIV_STCK_CTO
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_cto (
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
    updated_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] UPDATE_ID
    stck_cto_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_CTO_NO
    stck_cto_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] STCK_CTO_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    work_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] WORK_DT
    org_prdt_code                  CHAR(14)                       NOT NULL  ,  -- [LEGACY] ORG_PRDT_CD
    org_stck_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ORG_STCK_TP
    cto_prdt_code                  CHAR(14)                       NOT NULL  ,  -- [LEGACY] CTO_PRDT_CD
    cto_stck_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CTO_STCK_TP
    stck_cto_qty                   INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_CTO_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    ix_tiv_stck_cto__cto_prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__CTO_PRDT_CD
    ix_tiv_stck_cto__cto_stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__CTO_STCK_TP
    ix_tiv_stck_cto__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__DEPT_CD
    ix_tiv_stck_cto__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__EMPY_CD
    ix_tiv_stck_cto__org_prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__ORG_PRDT_CD
    ix_tiv_stck_cto__org_stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__ORG_STCK_TP
    ix_tiv_stck_cto__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__PROC_ST
    ix_tiv_stck_cto__stck_cto_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__STCK_CTO_DT
    ix_tiv_stck_cto__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__WHSE_CD
    ix_tiv_stck_cto__work_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO__WORK_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_cto
IS '레거시 테이블 TIV_STCK_CTO에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_cto__is_deleted
    ON ivm.stck_cto (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_cto_product
-- 레거시: TIV_STCK_CTO_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_cto_product (
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
    updated_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] UPDATE_ON
    updated_by_name                VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] UPDATE_BY
    updated_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] UPDATE_ID
    stck_cto_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_CTO_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    comp_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] COMP_TP
    comp_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] COMP_QTY
    base_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_PR
    base_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tiv_stck_cto_prdt__comp_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_PRDT__COMP_TP
    ix_tiv_stck_cto_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_PRDT__PRDT_CD
    ix_tiv_stck_cto_prdt__stck_cto_id TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_PRDT__STCK_CTO_ID
    ix_tiv_stck_cto_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_cto_product
IS '레거시 테이블 TIV_STCK_CTO_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_cto_product__is_deleted
    ON ivm.stck_cto_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_cto_summaries
-- 레거시: TIV_STCK_CTO_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_cto_summaries (
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
    base_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] BASE_YM
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PRDT_QTY
    part_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PART_CD
    part_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PART_QTY
    part_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PART_AMT
    ix_tiv_stck_cto_sum__base_ym   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_SUM__BASE_YM
    ix_tiv_stck_cto_sum__part_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_SUM__PART_CD
    ix_tiv_stck_cto_sum__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_CTO_SUM__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_cto_summaries
IS '레거시 테이블 TIV_STCK_CTO_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_cto_summaries__is_deleted
    ON ivm.stck_cto_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_rma
-- 레거시: TIV_STCK_RMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_rma (
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
    stck_rma_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_RMA_NO
    sym_numbertes                  VARCHAR(300)                             ,  -- [LEGACY] SYM_NOTES
    rcpt_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] RCPT_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    sale_cust_name                 VARCHAR(50)                              ,  -- [LEGACY] SALE_CUST_NM
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_sn                        VARCHAR(50)                              ,  -- [LEGACY] PRDT_SN
    rcv_qty                        INTEGER                        NOT NULL  ,  -- [LEGACY] RCV_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    shpt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] SHPT_TP
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    address1                       VARCHAR(200)                             ,  -- [LEGACY] ADDRESS
    address2                       VARCHAR(200)                             ,  -- [LEGACY] BLDG_NM
    rcvr_name                      VARCHAR(100)                             ,  -- [LEGACY] RCVR_NM
    phne_number                    VARCHAR(100)                             ,  -- [LEGACY] PHNE_NO
    delv_memo                      TEXT                                     ,  -- [LEGACY] DELV_MEMO
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    delv_rcv_id                    INTEGER                                  ,  -- [LEGACY] DELV_RCV_ID
    dwel_rcv_id                    INTEGER                                  ,  -- [LEGACY] DWEL_RCV_ID
    delv_rcv_date                  CHAR(8)                                  ,  -- [LEGACY] DELV_RCV_DT
    out_whse_code                  CHAR(10)                                 ,  -- [LEGACY] OUT_WHSE_CD
    out_prdt_code                  CHAR(14)                                 ,  -- [LEGACY] OUT_PRDT_CD
    out_prdt_sn                    VARCHAR(50)                              ,  -- [LEGACY] OUT_PRDT_SN
    out_qty                        INTEGER                                  ,  -- [LEGACY] OUT_QTY
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_out_id                    INTEGER                                  ,  -- [LEGACY] DWEL_OUT_ID
    delv_out_date                  CHAR(8)                                  ,  -- [LEGACY] DELV_OUT_DT
    stck_acc_id                    INTEGER                                  ,  -- [LEGACY] STCK_ACC_ID
    ix_tiv_stck_rma__cust_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__CUST_CD
    ix_tiv_stck_rma__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__DEPT_CD
    ix_tiv_stck_rma__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__EMPY_CD
    ix_tiv_stck_rma__out_prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__OUT_PRDT_CD
    ix_tiv_stck_rma__out_whse_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__OUT_WHSE_CD
    ix_tiv_stck_rma__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__PRDT_CD
    ix_tiv_stck_rma__prdt_sn       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__PRDT_SN
    ix_tiv_stck_rma__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__PROC_ST
    ix_tiv_stck_rma__rcpt_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__RCPT_DT
    ix_tiv_stck_rma__stck_acc_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__STCK_ACC_ID
    ix_tiv_stck_rma__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RMA__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_rma
IS '레거시 테이블 TIV_STCK_RMA에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_rma__is_deleted
    ON ivm.stck_rma (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_rsv
-- 레거시: TIV_STCK_RSV
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_rsv (
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
    tran_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] TRAN_NO
    tran_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] TRAN_TP
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    resv_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] RESV_QTY
    used_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] USED_QTY
    lock_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] LOCK_QTY
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    expn_date                      CHAR(8)                                  ,  -- [LEGACY] EXPN_DT
    refr_number                    VARCHAR(20)                              ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tiv_stck_rsv__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RSV__PRDT_CD
    ix_tiv_stck_rsv__refr_number   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RSV__REFR_NO
    ix_tiv_stck_rsv__stck_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RSV__STCK_TP
    ix_tiv_stck_rsv__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_RSV__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_rsv
IS '레거시 테이블 TIV_STCK_RSV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_rsv__is_deleted
    ON ivm.stck_rsv (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_sto
-- 레거시: TIV_STCK_STO
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_sto (
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
    stck_sto_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] STCK_STO_NO
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    move_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] MOVE_DT
    snd_whse_code                  CHAR(10)                       NOT NULL  ,  -- [LEGACY] SND_WHSE_CD
    rcv_whse_code                  CHAR(10)                       NOT NULL  ,  -- [LEGACY] RCV_WHSE_CD
    shpt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] SHPT_TP
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    delv_out_id                    INTEGER                                  ,  -- [LEGACY] DELV_OUT_ID
    dwel_ord_id                    INTEGER                                  ,  -- [LEGACY] DWEL_ORD_ID
    ix_tiv_stck_sto__delv_out_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__DELV_OUT_ID
    ix_tiv_stck_sto__dept_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__DEPT_CD
    ix_tiv_stck_sto__dwel_ord_id   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__DWEL_ORD_ID
    ix_tiv_stck_sto__empy_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__EMPY_CD
    ix_tiv_stck_sto__move_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__MOVE_DT
    ix_tiv_stck_sto__proc_st       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__PROC_ST
    ix_tiv_stck_sto__rcv_whse_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__RCV_WHSE_CD
    ix_tiv_stck_sto__shpt_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__SHPT_TP
    ix_tiv_stck_sto__snd_whse_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO__SND_WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_sto
IS '레거시 테이블 TIV_STCK_STO에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_sto__is_deleted
    ON ivm.stck_sto (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_sto_product
-- 레거시: TIV_STCK_STO_PRDT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_sto_product (
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
    stck_sto_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_STO_ID
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    move_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] MOVE_QTY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tiv_stck_sto_prdt__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO_PRDT__PRDT_CD
    ix_tiv_stck_sto_prdt__stck_sto_id TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO_PRDT__STCK_STO_ID
    ix_tiv_stck_sto_prdt__stck_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_STO_PRDT__STCK_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_sto_product
IS '레거시 테이블 TIV_STCK_STO_PRDT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_sto_product__is_deleted
    ON ivm.stck_sto_product (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_summaries
-- 레거시: TIV_STCK_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_summaries (
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
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    stck_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] STCK_QTY
    ix_tiv_stck_sum__invt_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM__INVT_TP
    ix_tiv_stck_sum__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM__PRDT_CD
    ix_tiv_stck_sum__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_summaries
IS '레거시 테이블 TIV_STCK_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_summaries__is_deleted
    ON ivm.stck_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_sum_day
-- 레거시: TIV_STCK_SUM_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_sum_day (
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
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    day_rcv_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] DAY_RCV_QTY
    day_shp_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] DAY_SHP_QTY
    day_sum_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] DAY_SUM_QTY
    ix_tiv_stck_day__base_date     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_DAY__BASE_DT
    ix_tiv_stck_day__invt_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_DAY__INVT_TP
    ix_tiv_stck_day__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_DAY__PRDT_CD
    ix_tiv_stck_day__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_DAY__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_sum_day
IS '레거시 테이블 TIV_STCK_SUM_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_sum_day__is_deleted
    ON ivm.stck_sum_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_sum_mon
-- 레거시: TIV_STCK_SUM_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_sum_mon (
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
    base_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] BASE_YM
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    mon_rcv_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] MON_RCV_QTY
    mon_shp_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] MON_SHP_QTY
    mon_sum_qty                    INTEGER                        NOT NULL  ,  -- [LEGACY] MON_SUM_QTY
    ix_tiv_stck_sum_mon__base_ym   TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM_MON__BASE_YM
    ix_tiv_stck_sum_mon__invt_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM_MON__INVT_TP
    ix_tiv_stck_sum_mon__prdt_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM_MON__PRDT_CD
    ix_tiv_stck_sum_mon__whse_code TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_SUM_MON__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_sum_mon
IS '레거시 테이블 TIV_STCK_SUM_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_sum_mon__is_deleted
    ON ivm.stck_sum_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_transactions
-- 레거시: TIV_STCK_TRN
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_transactions (
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
    tran_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] TRAN_ID
    tran_sq                        INTEGER                        NOT NULL  ,  -- [LEGACY] TRAN_SQ
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    io_type                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] IO_TP
    io_qty                         INTEGER                        NOT NULL  ,  -- [LEGACY] IO_QTY
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    ix_tiv_stck_trn__io_type       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__IO_TP
    ix_tiv_stck_trn__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__PRDT_CD
    ix_tiv_stck_trn__stck_type     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__STCK_TP
    ix_tiv_stck_trn__stck_trn_date TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__STCK_TRN_DT
    ix_tiv_stck_trn__stck_trn_number TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__STCK_TRN_NO
    ix_tiv_stck_trn__stck_trn_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__STCK_TRN_TP
    ix_tiv_stck_trn__whse_code     TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN__WHSE_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_transactions
IS '레거시 테이블 TIV_STCK_TRN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_transactions__is_deleted
    ON ivm.stck_transactions (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: ivm.stck_trn_history
-- 레거시: TIV_STCK_TRN_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS ivm.stck_trn_history (
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
    tran_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] TRAN_ID
    tran_sq                        INTEGER                        NOT NULL  ,  -- [LEGACY] TRAN_SQ
    whse_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] WHSE_CD
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    stck_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] STCK_TP
    io_type                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] IO_TP
    io_qty                         INTEGER                        NOT NULL  ,  -- [LEGACY] IO_QTY
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    ix_tiv_stck_trn_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN_HIST__HIST_TP
    ix_tiv_stck_trn_hist__id       TEXT                                     ,  -- [LEGACY] IX_TIV_STCK_TRN_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE ivm.stck_trn_history
IS '레거시 테이블 TIV_STCK_TRN_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_stck_trn_history__is_deleted
    ON ivm.stck_trn_history (is_deleted)
 WHERE is_deleted = false;


