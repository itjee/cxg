-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: lwm
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: lwm.accts
-- 레거시: TEA_ACCT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.accts (
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
    acct_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] ACCT_CD
    acct_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] ACCT_NM
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    remark                         TEXT                                     ,  -- [LEGACY] REMARK
    ix_tea_acct_mst__acct_name     TEXT                                     ,  -- [LEGACY] IX_TEA_ACCT_MST__ACCT_NM
    ix_tea_acct_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TEA_ACCT_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.accts
IS '레거시 테이블 TEA_ACCT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_accts__is_deleted
    ON lwm.accts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.boards
-- 레거시: TEA_BOARD_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.boards (
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
    subject                        VARCHAR(500)                   NOT NULL  ,  -- [LEGACY] SUBJECT
    contents                       TEXT                                     ,  -- [LEGACY] CONTENTS
    st_date                        CHAR(8)                                  ,  -- [LEGACY] ST_DATE
    ed_date                        CHAR(8)                                  ,  -- [LEGACY] ED_DATE
    is_fix                         BOOLEAN                        NOT NULL  ,  -- [LEGACY] IS_FIX
    is_view                        BOOLEAN                        NOT NULL  ,  -- [LEGACY] IS_VIEW
    is_delete                      BOOLEAN                        NOT NULL  ,  -- [LEGACY] IS_DELETE
    expose_date                    CHAR(8)                                  ,  -- [LEGACY] EXPOSE_DATE
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.boards
IS '레거시 테이블 TEA_BOARD_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_boards__is_deleted
    ON lwm.boards (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.board_mst_file
-- 레거시: TEA_BOARD_MST_FILE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.board_mst_file (
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
    board_id                       INTEGER                        NOT NULL  ,  -- [LEGACY] BOARD_ID
    file_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FILE_NM
    file_path                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FILE_PATH
    file_order                     INTEGER                                  ,  -- [LEGACY] FILE_SEQ
    file_size                      NUMERIC(17, 2)                           ,  -- [LEGACY] FILE_SIZE
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.board_mst_file
IS '레거시 테이블 TEA_BOARD_MST_FILE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_board_mst_file__is_deleted
    ON lwm.board_mst_file (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.board_mst_read
-- 레거시: TEA_BOARD_MST_READ
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.board_mst_read (
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
    board_id                       INTEGER                        NOT NULL  ,  -- [LEGACY] BOARD_ID
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.board_mst_read
IS '레거시 테이블 TEA_BOARD_MST_READ에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_board_mst_read__is_deleted
    ON lwm.board_mst_read (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.dec_arb
-- 레거시: TEA_DEC_ARB
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.dec_arb (
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
    start_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] START_DT
    close_date                     CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLOSE_DT
    eas_form_id                    INTEGER                                  ,  -- [LEGACY] EAS_FORM_ID
    dec_arb_type                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] DEC_ARB_TP
    sub_empy_code                  CHAR(10)                                 ,  -- [LEGACY] SUB_EMPY_CD
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_dec_arb__close_date     TEXT                                     ,  -- [LEGACY] IX_TEA_DEC_ARB__CLOSE_DT
    ix_tea_dec_arb__dec_arb_type   TEXT                                     ,  -- [LEGACY] IX_TEA_DEC_ARB__DEC_ARB_TP
    ix_tea_dec_arb__empy_code      TEXT                                     ,  -- [LEGACY] IX_TEA_DEC_ARB__EMPY_CD
    ix_tea_dec_arb__start_date     TEXT                                     ,  -- [LEGACY] IX_TEA_DEC_ARB__START_DT
    ix_tea_dec_arb__sub_empy_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DEC_ARB__SUB_EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.dec_arb
IS '레거시 테이블 TEA_DEC_ARB에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_dec_arb__is_deleted
    ON lwm.dec_arb (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.docs
-- 레거시: TEA_DOC_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.docs (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    eas_pay_type                   CHAR(1)                                  ,  -- [LEGACY] EAS_PAY_TP
    eas_acc_type                   CHAR(4)                                  ,  -- [LEGACY] EAS_ACC_TP
    regi_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] REGI_DT
    acct_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] ACCT_YM
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    subject                        VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] SUBJECT
    sub_txt                        VARCHAR(500)                             ,  -- [LEGACY] SUB_TXT
    content                        TEXT                           NOT NULL  ,  -- [LEGACY] CONTENT
    content_rtf                    TEXT                                     ,  -- [LEGACY] CONTENT_RTF
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    org_doc_number                 CHAR(14)                                 ,  -- [LEGACY] ORG_DOC_NO
    pay_req_date                   CHAR(8)                                  ,  -- [LEGACY] PAY_REQ_DT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    acc_proc_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ACC_PROC_YN
    acc_proc_on                    TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] ACC_PROC_ON
    acc_proc_by                    VARCHAR(50)                              ,  -- [LEGACY] ACC_PROC_BY
    acc_proc_id                    INTEGER                                  ,  -- [LEGACY] ACC_PROC_ID
    ix_tea_doc_mst__acc_proc_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__ACC_PROC_YN
    ix_tea_doc_mst__acct_ym        TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__ACCT_YM
    ix_tea_doc_mst__dept_code      TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__DEPT_CD
    ix_tea_doc_mst__eas_acc_type   TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__EAS_ACC_TP
    ix_tea_doc_mst__eas_form_id    TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__EAS_FORM_ID
    ix_tea_doc_mst__eas_pay_type   TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__EAS_PAY_TP
    ix_tea_doc_mst__empy_code      TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__EMPY_CD
    ix_tea_doc_mst__org_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__ORG_DOC_NO
    ix_tea_doc_mst__pay_req_date   TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__PAY_REQ_DT
    ix_tea_doc_mst__proc_st        TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__PROC_ST
    ix_tea_doc_mst__regi_date      TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__REGI_DT
    ix_tea_doc_mst__subject        TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST__SUBJECT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.docs
IS '레거시 테이블 TEA_DOC_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_docs__is_deleted
    ON lwm.docs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1000
-- 레거시: TEA_DOC_MST_1000
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1000 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    tmpl_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] TMPL_ID
    subject                        VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] SUBJECT
    eas_rule                       TEXT                                     ,  -- [LEGACY] EAS_RULE
    contents                       TEXT                                     ,  -- [LEGACY] CONTENTS
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1000
IS '레거시 테이블 TEA_DOC_MST_1000에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1000__is_deleted
    ON lwm.doc_mst_1000 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1001
-- 레거시: TEA_DOC_MST_1001
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1001 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    sale_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SALE_TP
    purc_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURC_TP
    cur_unit                       CHAR(3)                                  ,  -- [LEGACY] CUR_UNIT
    purc_cust_code                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] PURC_CUST_CD
    sale_cust_code                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] SALE_CUST_CD
    cust_mgr_name                  VARCHAR(50)                              ,  -- [LEGACY] CUST_MGR_NM
    cust_mgr_tel                   VARCHAR(50)                              ,  -- [LEGACY] CUST_MGR_TEL
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    sal_due_date                   VARCHAR(100)                             ,  -- [LEGACY] SAL_DUE_DT
    sal_pay_date                   CHAR(8)                                  ,  -- [LEGACY] SAL_PAY_DT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_1001__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1001__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1001
IS '레거시 테이블 TEA_DOC_MST_1001에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1001__is_deleted
    ON lwm.doc_mst_1001 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10011
-- 레거시: TEA_DOC_MST_10011
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10011 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    prdt_item                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] PRDT_ITEM
    prdt_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] PRDT_NM
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PR
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    prft_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRFT_AMT
    ix_tea_doc_mst_10011__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10011__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10011
IS '레거시 테이블 TEA_DOC_MST_10011에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10011__is_deleted
    ON lwm.doc_mst_10011 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1002
-- 레거시: TEA_DOC_MST_1002
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1002 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    sale_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] SALE_DT
    st_keep_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_KEEP_DT
    ed_keep_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_KEEP_DT
    reason                         TEXT                                     ,  -- [LEGACY] REASON
    ix_tea_doc_mst_1002__cust_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1002__CUST_CD
    ix_tea_doc_mst_1002__sale_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1002__SALE_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1002
IS '레거시 테이블 TEA_DOC_MST_1002에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1002__is_deleted
    ON lwm.doc_mst_1002 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10021
-- 레거시: TEA_DOC_MST_10021
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10021 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PR
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    ix_tea_doc_mst_10021__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10021__EAS_DOC_NO
    ix_tea_doc_mst_10021__prdt_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10021__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10021
IS '레거시 테이블 TEA_DOC_MST_10021에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10021__is_deleted
    ON lwm.doc_mst_10021 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1003
-- 레거시: TEA_DOC_MST_1003
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1003 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    seal_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] SEAL_TP
    use_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_TP
    purpose_type                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] PURPOSE_TP
    description                    VARCHAR(200)                             ,  -- [LEGACY] DESCRIPTION
    submission                     VARCHAR(100)                             ,  -- [LEGACY] SUBMISSION
    return_date                    VARCHAR(50)                              ,  -- [LEGACY] RETURN_DT
    ix_tea_doc_mst_1003__return_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1003__RETURN_DT
    ix_tea_doc_mst_1003__seal_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1003__SEAL_TP
    ix_tea_doc_mst_1003__use_type  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1003__USE_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1003
IS '레거시 테이블 TEA_DOC_MST_1003에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1003__is_deleted
    ON lwm.doc_mst_1003 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1004
-- 레거시: TEA_DOC_MST_1004
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1004 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    leave_type1                    CHAR(4)                        NOT NULL  ,  -- [LEGACY] LEAVE_TP1
    leave_type2                    CHAR(4)                                  ,  -- [LEGACY] LEAVE_TP2
    leave_type3                    CHAR(4)                                  ,  -- [LEGACY] LEAVE_TP3
    st_vac_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_VAC_DT
    ed_vac_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_VAC_DT
    vac_days                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] VAC_DAYS
    reason                         TEXT                                     ,  -- [LEGACY] REASON
    trip_type                      CHAR(1)                                  ,  -- [LEGACY] TRIP_TP
    place                          VARCHAR(500)                             ,  -- [LEGACY] PLACE
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1004
IS '레거시 테이블 TEA_DOC_MST_1004에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1004__is_deleted
    ON lwm.doc_mst_1004 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1004_log
-- 레거시: TEA_DOC_MST_1004_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1004_log (
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

COMMENT ON TABLE lwm.doc_mst_1004_log
IS '레거시 테이블 TEA_DOC_MST_1004_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1004_log__is_deleted
    ON lwm.doc_mst_1004_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1005
-- 레거시: TEA_DOC_MST_1005
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1005 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    trip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] TRIP_TP
    cntr_name                      VARCHAR(100)                             ,  -- [LEGACY] CNTR_NM
    st_trip_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_TRIP_DT
    ed_trip_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_TRIP_DT
    our_list                       VARCHAR(200)                             ,  -- [LEGACY] OUR_LIST
    etc_list                       VARCHAR(200)                             ,  -- [LEGACY] ETC_LIST
    cash_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CASH_AMT
    card_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CARD_AMT
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    ix_tea_doc_mst_1005__trip_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1005__TRIP_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1005
IS '레거시 테이블 TEA_DOC_MST_1005에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1005__is_deleted
    ON lwm.doc_mst_1005 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10051
-- 레거시: TEA_DOC_MST_10051
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10051 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    trip_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] TRIP_DT
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    contact                        VARCHAR(100)                             ,  -- [LEGACY] CONTACT
    task                           VARCHAR(500)                             ,  -- [LEGACY] TASK
    ix_tea_doc_mst_10051__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10051__EAS_DOC_NO
    ix_tea_doc_mst_10051__trip_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10051__TRIP_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10051
IS '레거시 테이블 TEA_DOC_MST_10051에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10051__is_deleted
    ON lwm.doc_mst_10051 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10052
-- 레거시: TEA_DOC_MST_10052
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10052 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    exp_type                       CHAR(2)                        NOT NULL  ,  -- [LEGACY] EXP_TP
    exp_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXP_AMT
    cust_name                      VARCHAR(200)                             ,  -- [LEGACY] CUST_NM
    cust_mgr                       VARCHAR(50)                              ,  -- [LEGACY] CUST_MGR
    corp_pay_flag                  CHAR(1)                                  ,  -- [LEGACY] CORP_PAY_YN
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_10052__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10052__EAS_DOC_NO
    ix_tea_doc_mst_10052__exp_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10052__EXP_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10052
IS '레거시 테이블 TEA_DOC_MST_10052에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10052__is_deleted
    ON lwm.doc_mst_10052 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10053
-- 레거시: TEA_DOC_MST_10053
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10053 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    cust_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CUST_NM
    cust_mgr                       VARCHAR(50)                              ,  -- [LEGACY] CUST_MGR
    mgr_pos                        VARCHAR(50)                              ,  -- [LEGACY] MGR_POS
    with_flag                      CHAR(1)                                  ,  -- [LEGACY] WITH_YN
    ix_tea_doc_mst_10053__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10053__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10053
IS '레거시 테이블 TEA_DOC_MST_10053에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10053__is_deleted
    ON lwm.doc_mst_10053 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1006
-- 레거시: TEA_DOC_MST_1006
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1006 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    trip_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] TRIP_TP
    st_trip_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_TRIP_DT
    ed_trip_date                   CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_TRIP_DT
    trip_list                      VARCHAR(200)                             ,  -- [LEGACY] TRIP_LIST
    description                    TEXT                                     ,  -- [LEGACY] DESCRIPTION
    cash_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CASH_AMT
    card_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CARD_AMT
    ix_tea_doc_mst_1006__ed_trip_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1006__ED_TRIP_DT
    ix_tea_doc_mst_1006__st_trip_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1006__ST_TRIP_DT
    ix_tea_doc_mst_1006__trip_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1006__TRIP_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1006
IS '레거시 테이블 TEA_DOC_MST_1006에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1006__is_deleted
    ON lwm.doc_mst_1006 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10061
-- 레거시: TEA_DOC_MST_10061
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10061 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    trip_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] TRIP_DT
    purpose                        VARCHAR(300)                             ,  -- [LEGACY] PURPOSE
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_10061__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10061__EAS_DOC_NO
    ix_tea_doc_mst_10061__trip_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10061__TRIP_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10061
IS '레거시 테이블 TEA_DOC_MST_10061에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10061__is_deleted
    ON lwm.doc_mst_10061 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10062
-- 레거시: TEA_DOC_MST_10062
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10062 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    exp_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] EXP_TP
    exp_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXP_AMT
    biz_name                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_NM
    cust_name                      VARCHAR(200)                             ,  -- [LEGACY] CUST_NM
    acct_code                      CHAR(4)                                  ,  -- [LEGACY] ACCT_CD
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_10062__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10062__EAS_DOC_NO
    ix_tea_doc_mst_10062__exp_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10062__EXP_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10062
IS '레거시 테이블 TEA_DOC_MST_10062에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10062__is_deleted
    ON lwm.doc_mst_10062 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1007
-- 레거시: TEA_DOC_MST_1007
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1007 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    req_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REQ_TP
    req_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REQ_YN
    reason                         VARCHAR(500)                             ,  -- [LEGACY] REASON
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1007
IS '레거시 테이블 TEA_DOC_MST_1007에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1007__is_deleted
    ON lwm.doc_mst_1007 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10071
-- 레거시: TEA_DOC_MST_10071
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10071 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    matr_item_id                   INTEGER                        NOT NULL  ,  -- [LEGACY] MATR_ITEM_ID
    min_pr                         NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MIN_PR
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PR
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    prft_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRFT_AMT
    ix_tea_doc_mst_10071__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10071__EAS_DOC_NO
    ix_tea_doc_mst_10071__matr_item_id TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10071__MATR_ITEM_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10071
IS '레거시 테이블 TEA_DOC_MST_10071에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10071__is_deleted
    ON lwm.doc_mst_10071 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1008
-- 레거시: TEA_DOC_MST_1008
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1008 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    fulltime_cnt                   INTEGER                        NOT NULL  ,  -- [LEGACY] FULLTIME_CNT
    dispatch_cnt                   INTEGER                        NOT NULL  ,  -- [LEGACY] DISPATCH_CNT
    contract_cnt                   INTEGER                        NOT NULL  ,  -- [LEGACY] CONTRACT_CNT
    parttime_cnt                   INTEGER                        NOT NULL  ,  -- [LEGACY] PARTTIME_CNT
    st_work_date                   CHAR(8)                                  ,  -- [LEGACY] ST_WORK_DT
    ed_work_date                   CHAR(8)                                  ,  -- [LEGACY] ED_WORK_DT
    work_days                      INTEGER                                  ,  -- [LEGACY] WORK_DAYS
    st_work_tm                     CHAR(4)                                  ,  -- [LEGACY] ST_WORK_TM
    ed_work_tm                     CHAR(4)                                  ,  -- [LEGACY] ED_WORK_TM
    man_cnt                        INTEGER                        NOT NULL  ,  -- [LEGACY] MAN_CNT
    woman_cnt                      INTEGER                        NOT NULL  ,  -- [LEGACY] WOMAN_CNT
    free_cnt                       INTEGER                        NOT NULL  ,  -- [LEGACY] FREE_CNT
    newcom_cnt                     INTEGER                        NOT NULL  ,  -- [LEGACY] NEWCOM_CNT
    career_cnt                     INTEGER                        NOT NULL  ,  -- [LEGACY] CAREER_CNT
    career_year                    INTEGER                        NOT NULL  ,  -- [LEGACY] CAREER_YEAR
    new_cnt                        INTEGER                        NOT NULL  ,  -- [LEGACY] NEW_CNT
    vac_cnt                        INTEGER                        NOT NULL  ,  -- [LEGACY] VAC_CNT
    vac_emp_name                   VARCHAR(100)                             ,  -- [LEGACY] VAC_EMP_NM
    assigned_task                  VARCHAR(500)                             ,  -- [LEGACY] ASSIGNED_TASK
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1008
IS '레거시 테이블 TEA_DOC_MST_1008에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1008__is_deleted
    ON lwm.doc_mst_1008 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1009
-- 레거시: TEA_DOC_MST_1009
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1009 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    fev_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] FEV_TP
    rel_type                       CHAR(2)                        NOT NULL  ,  -- [LEGACY] REL_TP
    fev_dscr                       TEXT                                     ,  -- [LEGACY] FEV_DSCR
    fev_date                       CHAR(8)                        NOT NULL  ,  -- [LEGACY] FEV_DT
    addr                           VARCHAR(200)                             ,  -- [LEGACY] ADDR
    contact                        VARCHAR(100)                             ,  -- [LEGACY] CONTACT
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    fev_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] FEV_AMT
    fev_item                       VARCHAR(100)                             ,  -- [LEGACY] FEV_ITEM
    fev_etc                        VARCHAR(100)                             ,  -- [LEGACY] FEV_ETC
    ix_tea_doc_mst_1009__fev_date  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1009__FEV_DT
    ix_tea_doc_mst_1009__fev_type  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1009__FEV_TP
    ix_tea_doc_mst_1009__rel_type  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1009__REL_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1009
IS '레거시 테이블 TEA_DOC_MST_1009에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1009__is_deleted
    ON lwm.doc_mst_1009 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1010
-- 레거시: TEA_DOC_MST_1010
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1010 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    cust_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CUST_NM
    fev_type                       CHAR(1)                                  ,  -- [LEGACY] FEV_TP
    fev_dscr                       TEXT                                     ,  -- [LEGACY] FEV_DSCR
    fev_date                       CHAR(8)                        NOT NULL  ,  -- [LEGACY] FEV_DT
    fev_tm                         CHAR(4)                                  ,  -- [LEGACY] FEV_TM
    addr                           VARCHAR(200)                             ,  -- [LEGACY] ADDR
    contact                        VARCHAR(100)                             ,  -- [LEGACY] CONTACT
    description                    VARCHAR(200)                             ,  -- [LEGACY] NOTES
    fev_amt_type                   CHAR(2)                                  ,  -- [LEGACY] FEV_AMT_TP
    fev_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] FEV_AMT
    fev_item_type                  CHAR(2)                                  ,  -- [LEGACY] FEV_ITEM_TP
    fev_item                       VARCHAR(100)                             ,  -- [LEGACY] FEV_ITEM
    fev_type_desc                  VARCHAR(200)                             ,  -- [LEGACY] FEV_TP_DESC
    ix_tea_doc_mst_1010__fev_date  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1010__FEV_DT
    ix_tea_doc_mst_1010__fev_type  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1010__FEV_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1010
IS '레거시 테이블 TEA_DOC_MST_1010에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1010__is_deleted
    ON lwm.doc_mst_1010 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1011
-- 레거시: TEA_DOC_MST_1011
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1011 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    biz_name                       VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] BIZ_NM
    biz_number                     VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] BIZ_NO
    biz_item                       VARCHAR(50)                              ,  -- [LEGACY] BIZ_ITEM
    use_mon                        INTEGER                        NOT NULL  ,  -- [LEGACY] USE_MON
    pay_date                       CHAR(8)                        NOT NULL  ,  -- [LEGACY] PAY_DT
    pay_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PAY_AMT
    exp_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXP_AMT
    st_exp_ym                      CHAR(6)                        NOT NULL  ,  -- [LEGACY] ST_EXP_YM
    ed_exp_ym                      CHAR(6)                        NOT NULL  ,  -- [LEGACY] ED_EXP_YM
    end_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] END_YN
    ix_tea_doc_mst_1011__end_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1011__END_YN
    ix_tea_doc_mst_1011__pay_date  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_1011__PAY_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1011
IS '레거시 테이블 TEA_DOC_MST_1011에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1011__is_deleted
    ON lwm.doc_mst_1011 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1012
-- 레거시: TEA_DOC_MST_1012
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1012 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    pur_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PUR_AMT
    exp_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXP_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1012
IS '레거시 테이블 TEA_DOC_MST_1012에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1012__is_deleted
    ON lwm.doc_mst_1012 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10121
-- 레거시: TEA_DOC_MST_10121
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10121 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    book_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] BOOK_NM
    author                         VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] AUTHOR
    pur_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PUR_AMT
    ix_tea_doc_mst_10121__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10121__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10121
IS '레거시 테이블 TEA_DOC_MST_10121에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10121__is_deleted
    ON lwm.doc_mst_10121 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1013
-- 레거시: TEA_DOC_MST_1013
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1013 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    edu_name                       VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] EDU_NM
    edu_dscr                       VARCHAR(300)                             ,  -- [LEGACY] EDU_DSCR
    purpose                        VARCHAR(100)                             ,  -- [LEGACY] PURPOSE
    biz_name                       VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] BIZ_NM
    biz_number                     VARCHAR(20)                              ,  -- [LEGACY] BIZ_NO
    st_edu_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_EDU_DT
    ed_edu_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_EDU_DT
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    tax_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_YN
    tax_date                       CHAR(8)                        NOT NULL  ,  -- [LEGACY] TAX_DT
    refund_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] REFUND_YN
    pay_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] PAY_TP
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1013
IS '레거시 테이블 TEA_DOC_MST_1013에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1013__is_deleted
    ON lwm.doc_mst_1013 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1014
-- 레거시: TEA_DOC_MST_1014
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1014 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    st_off_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_OFF_DT
    ed_off_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_OFF_DT
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    holiday_type                   CHAR(4)                                  ,  -- [LEGACY] HOLIDAY_TP
    holiday_st                     CHAR(4)                                  ,  -- [LEGACY] HOLIDAY_ST
    task                           TEXT                                     ,  -- [LEGACY] TASK
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1014
IS '레거시 테이블 TEA_DOC_MST_1014에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1014__is_deleted
    ON lwm.doc_mst_1014 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1015
-- 레거시: TEA_DOC_MST_1015
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1015 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    st_wks_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_WKS_DT
    ed_wks_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_WKS_DT
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    contact                        VARCHAR(100)                             ,  -- [LEGACY] CONTACT
    attendance                     VARCHAR(200)                             ,  -- [LEGACY] ATTENDANCE
    attendance_cnt                 INTEGER                                  ,  -- [LEGACY] ATTENDANCE_CNT
    purpose                        VARCHAR(100)                             ,  -- [LEGACY] PURPOSE
    schedule                       TEXT                                     ,  -- [LEGACY] SCHEDULE
    equip_type                     CHAR(1)                                  ,  -- [LEGACY] EQUIP_TP
    equipment                      VARCHAR(100)                             ,  -- [LEGACY] EQUIPMENT
    min_exp_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MIN_EXP_AMT
    max_exp_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MAX_EXP_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1015
IS '레거시 테이블 TEA_DOC_MST_1015에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1015__is_deleted
    ON lwm.doc_mst_1015 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_1016
-- 레거시: TEA_DOC_MST_1016
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_1016 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    st_wks_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_WKS_DT
    ed_wks_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_WKS_DT
    place                          VARCHAR(200)                             ,  -- [LEGACY] PLACE
    contact                        VARCHAR(100)                             ,  -- [LEGACY] CONTACT
    attendance                     VARCHAR(200)                             ,  -- [LEGACY] ATTENDANCE
    attendance_cnt                 INTEGER                        NOT NULL  ,  -- [LEGACY] ATTENDANCE_CNT
    schedule                       TEXT                                     ,  -- [LEGACY] SCHEDULE
    min_exp_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MIN_EXP_AMT
    max_exp_amt                    NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MAX_EXP_AMT
    cash_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CASH_AMT
    card_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CARD_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_1016
IS '레거시 테이블 TEA_DOC_MST_1016에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_1016__is_deleted
    ON lwm.doc_mst_1016 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_10161
-- 레거시: TEA_DOC_MST_10161
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_10161 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    exp_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] EXP_TP
    biz_name                       VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] BIZ_NM
    exp_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXP_AMT
    acct_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] ACCT_CD
    description                    VARCHAR(100)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_10161__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10161__EAS_DOC_NO
    ix_tea_doc_mst_10161__exp_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_10161__EXP_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_10161
IS '레거시 테이블 TEA_DOC_MST_10161에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_10161__is_deleted
    ON lwm.doc_mst_10161 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_2001
-- 레거시: TEA_DOC_MST_2001
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_2001 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    purc_type                      CHAR(1)                                  ,  -- [LEGACY] PURC_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_2001
IS '레거시 테이블 TEA_DOC_MST_2001에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_2001__is_deleted
    ON lwm.doc_mst_2001 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_20011
-- 레거시: TEA_DOC_MST_20011
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_20011 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    cost_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_PR
    qty                            INTEGER                        NOT NULL  ,  -- [LEGACY] QTY
    amt                            NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] AMT
    description                    VARCHAR(100)                             ,  -- [LEGACY] NOTES
    user_name                      VARCHAR(100)                             ,  -- [LEGACY] USER_NM
    ix_tea_doc_mst_20011__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_20011__EAS_DOC_NO
    ix_tea_doc_mst_20011__prdt_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_20011__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_20011
IS '레거시 테이블 TEA_DOC_MST_20011에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_20011__is_deleted
    ON lwm.doc_mst_20011 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_3001
-- 레거시: TEA_DOC_MST_3001
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_3001 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    crdt_id                        INTEGER                                  ,  -- [LEGACY] CRDT_ID
    crdt_type                      CHAR(4)                                  ,  -- [LEGACY] CRDT_TP
    cday_type                      CHAR(3)                                  ,  -- [LEGACY] CDAY_TP
    chg_type                       CHAR(1)                                  ,  -- [LEGACY] CHG_TP
    chg_base_date                  CHAR(8)                                  ,  -- [LEGACY] CHG_BASE_DT
    chg_codeay_type                CHAR(3)                                  ,  -- [LEGACY] CHG_CDAY_TP
    chg_dept_code                  CHAR(10)                                 ,  -- [LEGACY] CHG_DEPT_CD
    chg_paym_date                  CHAR(8)                                  ,  -- [LEGACY] CHG_PAYM_DT
    reason                         VARCHAR(500)                             ,  -- [LEGACY] REASON
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_3001
IS '레거시 테이블 TEA_DOC_MST_3001에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_3001__is_deleted
    ON lwm.doc_mst_3001 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_30011
-- 레거시: TEA_DOC_MST_30011
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_30011 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    rcbl_id                        INTEGER                                  ,  -- [LEGACY] RCBL_ID
    rcbl_number                    CHAR(18)                       NOT NULL  ,  -- [LEGACY] RCBL_NO
    crdt_date                      CHAR(8)                                  ,  -- [LEGACY] CRDT_DT
    paym_date                      CHAR(8)                                  ,  -- [LEGACY] PAYM_DT
    rcbl_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] RCBL_AMT
    dpst_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] DPST_AMT
    blnc_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] BLNC_AMT
    div_rcbl_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] DIV_RCBL_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_30011
IS '레거시 테이블 TEA_DOC_MST_30011에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_30011__is_deleted
    ON lwm.doc_mst_30011 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_3003
-- 레거시: TEA_DOC_MST_3003
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_3003 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    crdt_type                      CHAR(4)                                  ,  -- [LEGACY] CRDT_TP
    cday_type                      CHAR(3)                                  ,  -- [LEGACY] CDAY_TP
    clmt_tot_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] CLMT_TOT_AMT
    clmt_can_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] CLMT_CAN_AMT
    clmt_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CLMT_TP
    clmt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_AMT
    clmt_new_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] CLMT_NEW_AMT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_3003
IS '레거시 테이블 TEA_DOC_MST_3003에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_3003__is_deleted
    ON lwm.doc_mst_3003 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_5001
-- 레거시: TEA_DOC_MST_5001
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_5001 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    card_code                      VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] CARD_CD
    card_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] CARD_NO
    st_use_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ST_USE_DT
    ed_use_date                    CHAR(8)                        NOT NULL  ,  -- [LEGACY] ED_USE_DT
    sett_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SETT_AMT
    aprv_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] APRV_AMT
    sett_bank_code                 VARCHAR(50)                              ,  -- [LEGACY] SETT_BANK_CD
    sett_bank_acct_number          VARCHAR(20)                              ,  -- [LEGACY] SETT_BANK_ACCT_NO
    sett_bank_dept_name            VARCHAR(50)                              ,  -- [LEGACY] SETT_BANK_DEPT_NM
    ix_tea_doc_mst_5001__card_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_5001__CARD_CD
    ix_tea_doc_mst_5001__card_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_5001__CARD_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_5001
IS '레거시 테이블 TEA_DOC_MST_5001에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_5001__is_deleted
    ON lwm.doc_mst_5001 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_50011
-- 레거시: TEA_DOC_MST_50011
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_50011 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    chk_flag                       CHAR(1)                                  ,  -- [LEGACY] CHK_YN
    use_date                       CHAR(8)                        NOT NULL  ,  -- [LEGACY] USE_DT
    emp_name                       VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] EMP_NM
    biz_name                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_NM
    biz_number                     VARCHAR(20)                              ,  -- [LEGACY] BIZ_NO
    aprv_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] APRV_AMT
    sett_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SETT_AMT
    cust_name                      VARCHAR(100)                             ,  -- [LEGACY] CUST_NM
    cust_mgr_name                  VARCHAR(100)                             ,  -- [LEGACY] CUST_MGR_NM
    acct_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] ACCT_CD
    description                    VARCHAR(100)                             ,  -- [LEGACY] NOTES
    aprv_number                    VARCHAR(50)                              ,  -- [LEGACY] APRV_NO
    aprv_order                     INTEGER                                  ,  -- [LEGACY] APRV_SEQ
    ix_tea_doc_mst_50011__chk_flag TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_50011__CHK_YN
    ix_tea_doc_mst_50011__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_50011__EAS_DOC_NO
    ix_tea_doc_mst_50011__use_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_50011__USE_DT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_50011
IS '레거시 테이블 TEA_DOC_MST_50011에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_50011__is_deleted
    ON lwm.doc_mst_50011 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_5002
-- 레거시: TEA_DOC_MST_5002
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_5002 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    month                          INTEGER                                  ,  -- [LEGACY] MONTH
    month_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] MONTH_SUM_AMT
    week1_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK1_SUM_AMT
    week2_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK2_SUM_AMT
    week3_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK3_SUM_AMT
    week4_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK4_SUM_AMT
    week5_sum_amt                  NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK5_SUM_AMT
    tot_sum_amt                    NUMERIC(17, 2)                           ,  -- [LEGACY] TOT_SUM_AMT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_5002
IS '레거시 테이블 TEA_DOC_MST_5002에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_5002__is_deleted
    ON lwm.doc_mst_5002 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_50021
-- 레거시: TEA_DOC_MST_50021
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_50021 (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    acct_code                      CHAR(3)                                  ,  -- [LEGACY] ACCT_CD
    month_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] MONTH_AMT
    week1_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK1_AMT
    week2_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK2_AMT
    week3_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK3_AMT
    week4_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK4_AMT
    week5_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK5_AMT
    week_sum_amt                   NUMERIC(17, 2)                           ,  -- [LEGACY] WEEK_SUM_AMT
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_50021
IS '레거시 테이블 TEA_DOC_MST_50021에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_50021__is_deleted
    ON lwm.doc_mst_50021 (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_50021_log
-- 레거시: TEA_DOC_MST_50021_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_50021_log (
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

COMMENT ON TABLE lwm.doc_mst_50021_log
IS '레거시 테이블 TEA_DOC_MST_50021_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_50021_log__is_deleted
    ON lwm.doc_mst_50021_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_5002_log
-- 레거시: TEA_DOC_MST_5002_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_5002_log (
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

COMMENT ON TABLE lwm.doc_mst_5002_log
IS '레거시 테이블 TEA_DOC_MST_5002_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_5002_log__is_deleted
    ON lwm.doc_mst_5002_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_back
-- 레거시: TEA_DOC_MST_BACK
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_back (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_back
IS '레거시 테이블 TEA_DOC_MST_BACK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_back__is_deleted
    ON lwm.doc_mst_back (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_exp
-- 레거시: TEA_DOC_MST_EXP
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_exp (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    acct_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] ACCT_CD
    remark                         VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] REMARK
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    sum_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUM_AMT
    prepaid_flag                   CHAR(1)                                  ,  -- [LEGACY] PREPAID_YN
    autotrn_flag                   CHAR(1)                                  ,  -- [LEGACY] AUTOTRN_YN
    tax_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_YN
    tax_number                     VARCHAR(50)                              ,  -- [LEGACY] TAX_NO
    tax_date                       CHAR(8)                                  ,  -- [LEGACY] TAX_DT
    brn_number                     CHAR(10)                                 ,  -- [LEGACY] BRN_NO
    biz_name                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_NM
    acc_cust_code                  VARCHAR(10)                              ,  -- [LEGACY] ACC_CUST_CD
    exp_dept_code                  CHAR(10)                                 ,  -- [LEGACY] EXP_DEPT_CD
    exp_empy_code                  CHAR(10)                                 ,  -- [LEGACY] EXP_EMPY_CD
    bank_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] BANK_CD
    bank_acct_number               VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] BANK_ACCT_NO
    bank_ownr_name                 VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] BANK_OWNR_NM
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_exp__acct_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__ACCT_CD
    ix_tea_doc_mst_exp__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__EAS_DOC_NO
    ix_tea_doc_mst_exp__exp_dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__EXP_DEPT_CD
    ix_tea_doc_mst_exp__exp_empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__EXP_EMPY_CD
    ix_tea_doc_mst_exp__tax_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__TAX_NO
    ix_tea_doc_mst_exp__tax_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_EXP__TAX_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_exp
IS '레거시 테이블 TEA_DOC_MST_EXP에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_exp__is_deleted
    ON lwm.doc_mst_exp (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_file
-- 레거시: TEA_DOC_MST_FILE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_file (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    file_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_SEQ
    file_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_ID
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_file__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_FILE__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_file
IS '레거시 테이블 TEA_DOC_MST_FILE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_file__is_deleted
    ON lwm.doc_mst_file (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_line
-- 레거시: TEA_DOC_MST_LINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_line (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    dec_arb_type                   CHAR(1)                                  ,  -- [LEGACY] DEC_ARB_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    proc_type                      CHAR(1)                                  ,  -- [LEGACY] PROC_TP
    proc_on                        TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] PROC_ON
    proc_by                        VARCHAR(10)                              ,  -- [LEGACY] PROC_BY
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    org_dept_code                  VARCHAR(10)                              ,  -- [LEGACY] ORG_DEPT_CD
    org_empy_code                  VARCHAR(10)                              ,  -- [LEGACY] ORG_EMPY_CD
    ix_tea_doc_mst_line__dec_arb_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__DEC_ARB_TP
    ix_tea_doc_mst_line__dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__DEPT_CD
    ix_tea_doc_mst_line__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__EAS_DOC_NO
    ix_tea_doc_mst_line__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__EMPY_CD
    ix_tea_doc_mst_line__line_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__LINE_TP
    ix_tea_doc_mst_line__proc_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE__PROC_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_line
IS '레거시 테이블 TEA_DOC_MST_LINE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_line__is_deleted
    ON lwm.doc_mst_line (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_line_temp
-- 레거시: TEA_DOC_MST_LINE_TEMP
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_line_temp (
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
    eas_form_code                  CHAR(4)                        NOT NULL  ,  -- [LEGACY] EAS_FORM_CD
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    ix_tea_doc_mst_line_temp__dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE_TEMP__DEPT_CD
    ix_tea_doc_mst_line_temp__eas_form_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE_TEMP__EAS_FORM_CD
    ix_tea_doc_mst_line_temp__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE_TEMP__EMPY_CD
    ix_tea_doc_mst_line_temp__line_type TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINE_TEMP__LINE_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_line_temp
IS '레거시 테이블 TEA_DOC_MST_LINE_TEMP에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_line_temp__is_deleted
    ON lwm.doc_mst_line_temp (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_line_to_title
-- 레거시: TEA_DOC_MST_LINE_TO_TITLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_line_to_title (
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
    tea_form_mst_key               CHAR(19)                       NOT NULL  ,  -- [LEGACY] TEA_FORM_MST_KEY
    eas_form_code                  CHAR(4)                        NOT NULL  ,  -- [LEGACY] EAS_FORM_CD
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_line_to_title
IS '레거시 테이블 TEA_DOC_MST_LINE_TO_TITLE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_line_to_title__is_deleted
    ON lwm.doc_mst_line_to_title (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_link
-- 레거시: TEA_DOC_MST_LINK
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_link (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    eas_doc_link_number            CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_LINK_NO
    ix_tea_doc_mst_link__eas_doc_link_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINK__EAS_DOC_LINK_NO
    ix_tea_doc_mst_link__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_LINK__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_link
IS '레거시 테이블 TEA_DOC_MST_LINK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_link__is_deleted
    ON lwm.doc_mst_link (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_pay
-- 레거시: TEA_DOC_MST_PAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_pay (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    pay_order                      INTEGER                                  ,  -- [LEGACY] PAY_SEQ
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    sup_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SUP_AMT
    tax_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TAX_AMT
    tot_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TOT_AMT
    tax_iss_date                   CHAR(8)                                  ,  -- [LEGACY] TAX_ISS_DT
    tax_number                     VARCHAR(50)                              ,  -- [LEGACY] TAX_NO
    tax_file_id                    INTEGER                                  ,  -- [LEGACY] TAX_FILE_ID
    description                    VARCHAR(300)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_pay__cust_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_PAY__CUST_CD
    ix_tea_doc_mst_pay__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_PAY__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_pay
IS '레거시 테이블 TEA_DOC_MST_PAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_pay__is_deleted
    ON lwm.doc_mst_pay (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_print
-- 레거시: TEA_DOC_MST_PRINT
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_print (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    print_on                       TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] PRINT_ON
    ix_tea_doc_mst_print__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_PRINT__EAS_DOC_NO
    ix_tea_doc_mst_print__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_PRINT__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_print
IS '레거시 테이블 TEA_DOC_MST_PRINT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_print__is_deleted
    ON lwm.doc_mst_print (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_read
-- 레거시: TEA_DOC_MST_READ
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_read (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    read_on                        TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] READ_ON
    view_type                      CHAR(2)                                  ,  -- [LEGACY] VIEW_TP
    ix_tea_doc_mst_read__dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_READ__DEPT_CD
    ix_tea_doc_mst_read__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_READ__EAS_DOC_NO
    ix_tea_doc_mst_read__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_READ__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_read
IS '레거시 테이블 TEA_DOC_MST_READ에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_read__is_deleted
    ON lwm.doc_mst_read (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_remit
-- 레거시: TEA_DOC_MST_REMIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_remit (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    remit_order                    INTEGER                        NOT NULL  ,  -- [LEGACY] REMIT_SEQ
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    bank_code                      VARCHAR(10)                              ,  -- [LEGACY] BANK_CD
    bank_name                      VARCHAR(50)                              ,  -- [LEGACY] BANK_NM
    bank_ownr_name                 VARCHAR(50)                              ,  -- [LEGACY] BANK_OWNR_NM
    bank_acct_number               VARCHAR(50)                              ,  -- [LEGACY] BANK_ACCT_NO
    remit_amt                      NUMERIC(17, 2)                           ,  -- [LEGACY] REMIT_AMT
    remit_exp_date                 CHAR(8)                                  ,  -- [LEGACY] REMIT_EXP_DT
    remit_date                     CHAR(8)                                  ,  -- [LEGACY] REMIT_DT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    remit_flag                     CHAR(1)                                  ,  -- [LEGACY] REMIT_YN
    remit_on                       TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] REMIT_ON
    remit_by                       VARCHAR(50)                              ,  -- [LEGACY] REMIT_BY
    ix_tea_doc_mst_remit__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REMIT__EAS_DOC_NO
    ix_tea_doc_mst_remit__remit_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REMIT__REMIT_DT
    ix_tea_doc_mst_remit__remit_exp_date TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REMIT__REMIT_EXP_DT
    ix_tea_doc_mst_remit__remit_flag TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REMIT__REMIT_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_remit
IS '레거시 테이블 TEA_DOC_MST_REMIT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_remit__is_deleted
    ON lwm.doc_mst_remit (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_rev
-- 레거시: TEA_DOC_MST_REV
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_rev (
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
    eas_doc_number                 CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_DOC_NO
    rev_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REV_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                                 ,  -- [LEGACY] CUST_CD
    ctgr_code                      CHAR(10)                                 ,  -- [LEGACY] CTGR_CD
    rev_amt                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REV_AMT
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_rev__ctgr_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__CTGR_CD
    ix_tea_doc_mst_rev__cust_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__CUST_CD
    ix_tea_doc_mst_rev__dept_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__DEPT_CD
    ix_tea_doc_mst_rev__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__EAS_DOC_NO
    ix_tea_doc_mst_rev__empy_code  TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__EMPY_CD
    ix_tea_doc_mst_rev__rev_type   TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_REV__REV_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_rev
IS '레거시 테이블 TEA_DOC_MST_REV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_rev__is_deleted
    ON lwm.doc_mst_rev (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_tmpl
-- 레거시: TEA_DOC_MST_TMPL
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_tmpl (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    subject                        VARCHAR(200)                             ,  -- [LEGACY] SUBJECT
    eas_rule                       TEXT                                     ,  -- [LEGACY] EAS_RULE
    sub_text                       VARCHAR(2000)                            ,  -- [LEGACY] SUB_TEXT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_tmpl
IS '레거시 테이블 TEA_DOC_MST_TMPL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_tmpl__is_deleted
    ON lwm.doc_mst_tmpl (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_mst_web_log
-- 레거시: TEA_DOC_MST_WEB_LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_mst_web_log (
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
    eas_doc_number                 CHAR(14)                                 ,  -- [LEGACY] EAS_DOC_NO
    line_type                      CHAR(1)                                  ,  -- [LEGACY] LINE_TP
    line_order                     INTEGER                                  ,  -- [LEGACY] LINE_SEQ
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    dec_arb_type                   CHAR(1)                                  ,  -- [LEGACY] DEC_ARB_TP
    proc_type                      CHAR(1)                                  ,  -- [LEGACY] PROC_TP
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_doc_mst_web_log__eas_doc_number TEXT                                     ,  -- [LEGACY] IX_TEA_DOC_MST_WEB_LOG__EAS_DOC_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_mst_web_log
IS '레거시 테이블 TEA_DOC_MST_WEB_LOG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_mst_web_log__is_deleted
    ON lwm.doc_mst_web_log (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_set_line
-- 레거시: TEA_DOC_SET_LINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_set_line (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    form_dept_code                 CHAR(10)                       NOT NULL  ,  -- [LEGACY] FORM_DEPT_CD
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_set_line
IS '레거시 테이블 TEA_DOC_SET_LINE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_set_line__is_deleted
    ON lwm.doc_set_line (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.doc_set_tmpl
-- 레거시: TEA_DOC_SET_TMPL
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.doc_set_tmpl (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    subject                        VARCHAR(200)                             ,  -- [LEGACY] SUBJECT
    eas_rule                       TEXT                                     ,  -- [LEGACY] EAS_RULE
    sub_text                       VARCHAR(2000)                            ,  -- [LEGACY] SUB_TEXT
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.doc_set_tmpl
IS '레거시 테이블 TEA_DOC_SET_TMPL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_doc_set_tmpl__is_deleted
    ON lwm.doc_set_tmpl (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.employee_set
-- 레거시: TEA_EMPY_SET
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.employee_set (
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
    eas_empy_code                  CHAR(10)                       NOT NULL  ,  -- [LEGACY] EAS_EMPY_CD
    ix_tea_empy_set__eas_empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_EMPY_SET__EAS_EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.employee_set
IS '레거시 테이블 TEA_EMPY_SET에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_set__is_deleted
    ON lwm.employee_set (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.forms
-- 레거시: TEA_FORM_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.forms (
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
    eas_form_name                  VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] EAS_FORM_NM
    eas_form_code                  CHAR(4)                        NOT NULL  ,  -- [LEGACY] EAS_FORM_CD
    eas_form_type                  CHAR(4)                        NOT NULL  ,  -- [LEGACY] EAS_FORM_TP
    description                    VARCHAR(500)                             ,  -- [LEGACY] DESCRIPTION
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    eas_pay_flag                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_PAY_YN
    eas_rev_flag                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_REV_YN
    eas_acc_flag                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_ACC_YN
    detail_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] DETAIL_YN
    secret_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] SECRET_YN
    cancel_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] CANCEL_YN
    reject_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] REJECT_YN
    change_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] CHANGE_YN
    notice_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] NOTICE_YN
    proc_dept_flag                 CHAR(1)                                  ,  -- [LEGACY] PROC_DEPT_YN
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_SEQ
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_form_mst__cancel_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__CANCEL_YN
    ix_tea_form_mst__change_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__CHANGE_YN
    ix_tea_form_mst__detail_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__DETAIL_YN
    ix_tea_form_mst__eas_acc_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__EAS_ACC_YN
    ix_tea_form_mst__eas_form_type TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__EAS_FORM_TP
    ix_tea_form_mst__eas_pay_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__EAS_PAY_YN
    ix_tea_form_mst__eas_rev_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__EAS_REV_YN
    ix_tea_form_mst__numbertice_flag TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__NOTICE_YN
    ix_tea_form_mst__proc_dept_flag TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__PROC_DEPT_YN
    ix_tea_form_mst__reject_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__REJECT_YN
    ix_tea_form_mst__secret_flag   TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__SECRET_YN
    ix_tea_form_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.forms
IS '레거시 테이블 TEA_FORM_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_forms__is_deleted
    ON lwm.forms (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.form_mst_acc
-- 레거시: TEA_FORM_MST_ACC
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.form_mst_acc (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    eas_acc_type                   CHAR(4)                        NOT NULL  ,  -- [LEGACY] EAS_ACC_TP
    acct_code                      VARCHAR(10)                              ,  -- [LEGACY] ACCT_CD
    ban_acct_code                  VARCHAR(10)                              ,  -- [LEGACY] BAN_ACCT_CD
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    eas_pset_id                    INTEGER                                  ,  -- [LEGACY] EAS_PSET_ID
    ix_tea_form_mst_acc__eas_acc_type TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC__EAS_ACC_TP
    ix_tea_form_mst_acc__eas_form_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC__EAS_FORM_ID
    ix_tea_form_mst_acc__eas_pset_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC__EAS_PSET_ID
    ix_tea_form_mst_acc__use_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.form_mst_acc
IS '레거시 테이블 TEA_FORM_MST_ACC에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_form_mst_acc__is_deleted
    ON lwm.form_mst_acc (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.form_mst_acc_acctcode
-- 레거시: TEA_FORM_MST_ACC_ACCTCODE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.form_mst_acc_acctcode (
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
    eas_form_acc_id                INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ACC_ID
    acct_code                      VARCHAR(10)                    NOT NULL  ,  -- [LEGACY] ACCT_CD
    ban_acct_code                  VARCHAR(10)                              ,  -- [LEGACY] BAN_ACCT_CD
    ix_tea_form_mst_acc_acctcode__acct_code TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC_ACCTCODE__ACCT_CD
    ix_tea_form_mst_acc_acctcode__ban_acct_code TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC_ACCTCODE__BAN_ACCT_CD
    ix_tea_form_mst_acc_acctcode__eas_form_acc_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_ACC_ACCTCODE__EAS_FORM_ACC_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.form_mst_acc_acctcode
IS '레거시 테이블 TEA_FORM_MST_ACC_ACCTCODE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_form_mst_acc_acctcode__is_deleted
    ON lwm.form_mst_acc_acctcode (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.form_mst_pay
-- 레거시: TEA_FORM_MST_PAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.form_mst_pay (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    eas_pay_type                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_PAY_TP
    eas_pset_id                    INTEGER                                  ,  -- [LEGACY] EAS_PSET_ID
    tax_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] TAX_YN
    acc_proc_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ACC_PROC_YN
    cms_if_flag                    CHAR(1)                        NOT NULL  ,  -- [LEGACY] CMS_IF_YN
    cust_reg_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CUST_REG_YN
    item_reg_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ITEM_REG_YN
    one_cust_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] ONE_CUST_YN
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    acc_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] ACC_YN
    rev_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REV_YN
    pay_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] PAY_YN
    rmt_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] RMT_YN
    pur_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] PUR_YN
    ref_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REF_YN
    cle_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] CLE_YN
    exp_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] EXP_YN
    cfs_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] CFS_YN
    oil_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] OIL_YN
    st_day                         INTEGER                                  ,  -- [LEGACY] ST_DAY
    ed_day                         INTEGER                                  ,  -- [LEGACY] ED_DAY
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_form_mst_pay__eas_form_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_PAY__EAS_FORM_ID
    ix_tea_form_mst_pay__eas_pay_type TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_PAY__EAS_PAY_TP
    ix_tea_form_mst_pay__eas_pset_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_PAY__EAS_PSET_ID
    ix_tea_form_mst_pay__use_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_PAY__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.form_mst_pay
IS '레거시 테이블 TEA_FORM_MST_PAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_form_mst_pay__is_deleted
    ON lwm.form_mst_pay (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.form_mst_rev
-- 레거시: TEA_FORM_MST_REV
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.form_mst_rev (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    rev_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] REV_TP
    acct_code                      VARCHAR(20)                              ,  -- [LEGACY] ACCT_CD
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tea_form_mst_rev__acct_code TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_REV__ACCT_CD
    ix_tea_form_mst_rev__eas_form_id TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_REV__EAS_FORM_ID
    ix_tea_form_mst_rev__rev_type  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_REV__REV_TP
    ix_tea_form_mst_rev__use_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_FORM_MST_REV__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.form_mst_rev
IS '레거시 테이블 TEA_FORM_MST_REV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_form_mst_rev__is_deleted
    ON lwm.form_mst_rev (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.lines
-- 레거시: TEA_LINE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.lines (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    form_dept_code                 CHAR(10)                       NOT NULL  ,  -- [LEGACY] FORM_DEPT_CD
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.lines
IS '레거시 테이블 TEA_LINE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_lines__is_deleted
    ON lwm.lines (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.psets
-- 레거시: TEA_PSET_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.psets (
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
    eas_pset_name                  VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] EAS_PSET_NM
    description                    VARCHAR(500)                             ,  -- [LEGACY] DESCRIPTION
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    step_01_flag                   CHAR(1)                                  ,  -- [LEGACY] STEP_01_YN
    step_02_flag                   CHAR(1)                                  ,  -- [LEGACY] STEP_02_YN
    step_03_flag                   CHAR(1)                                  ,  -- [LEGACY] STEP_03_YN
    step_04_flag                   CHAR(1)                                  ,  -- [LEGACY] STEP_04_YN
    step_05_flag                   CHAR(1)                                  ,  -- [LEGACY] STEP_05_YN
    ix_tea_pset_mst__step_01_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__STEP_01_YN
    ix_tea_pset_mst__step_02_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__STEP_02_YN
    ix_tea_pset_mst__step_03_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__STEP_03_YN
    ix_tea_pset_mst__step_04_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__STEP_04_YN
    ix_tea_pset_mst__step_05_flag  TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__STEP_05_YN
    ix_tea_pset_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.psets
IS '레거시 테이블 TEA_PSET_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_psets__is_deleted
    ON lwm.psets (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.pset_mst_details
-- 레거시: TEA_PSET_MST_DTL
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.pset_mst_details (
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
    eas_pset_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_PSET_ID
    line_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] LINE_SEQ
    line_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] LINE_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    end_flag                       CHAR(1)                                  ,  -- [LEGACY] END_YN
    end_empy_code                  CHAR(10)                                 ,  -- [LEGACY] END_EMPY_CD
    end_empy_code_ot               CHAR(10)                                 ,  -- [LEGACY] END_EMPY_CD_OT
    ix_tea_pset_mst_datel__dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__DEPT_CD
    ix_tea_pset_mst_datel__eas_pset_id TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__EAS_PSET_ID
    ix_tea_pset_mst_datel__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__EMPY_CD
    ix_tea_pset_mst_datel__end_empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__END_EMPY_CD
    ix_tea_pset_mst_datel__end_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__END_YN
    ix_tea_pset_mst_datel__line_type TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_DTL__LINE_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.pset_mst_details
IS '레거시 테이블 TEA_PSET_MST_DTL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pset_mst_details__is_deleted
    ON lwm.pset_mst_details (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.pset_mst_line
-- 레거시: TEA_PSET_MST_LINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.pset_mst_line (
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
    eas_pset_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_PSET_ID
    eas_posi_code                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_POSI_CD
    step_p01_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STEP_P01_YN
    step_p02_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STEP_P02_YN
    step_p03_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STEP_P03_YN
    step_p04_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STEP_P04_YN
    step_p05_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] STEP_P05_YN
    ix_tea_pset_mst_line__eas_posi_code TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__EAS_POSI_CD
    ix_tea_pset_mst_line__eas_pset_id TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__EAS_PSET_ID
    ix_tea_pset_mst_line__step_p01_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__STEP_P01_YN
    ix_tea_pset_mst_line__step_p02_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__STEP_P02_YN
    ix_tea_pset_mst_line__step_p03_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__STEP_P03_YN
    ix_tea_pset_mst_line__step_p04_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__STEP_P04_YN
    ix_tea_pset_mst_line__step_p05_flag TEXT                                     ,  -- [LEGACY] IX_TEA_PSET_MST_LINE__STEP_P05_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.pset_mst_line
IS '레거시 테이블 TEA_PSET_MST_LINE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_pset_mst_line__is_deleted
    ON lwm.pset_mst_line (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.signs
-- 레거시: TEA_SIGN_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.signs (
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
    eas_sign_number                CHAR(14)                       NOT NULL  ,  -- [LEGACY] EAS_SIGN_NO
    eas_sign_date                  CHAR(8)                        NOT NULL  ,  -- [LEGACY] EAS_SIGN_DT
    tran_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] TRAN_TP
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    refr_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] REFR_ID
    refr_number                    VARCHAR(20)                              ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    proc_memo                      TEXT                                     ,  -- [LEGACY] PROC_MEMO
    ix_tea_sign_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__DEPT_CD
    ix_tea_sign_mst__eas_sign_code TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__EAS_SIGN_CD
    ix_tea_sign_mst__eas_sign_date TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__EAS_SIGN_DT
    ix_tea_sign_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__EMPY_CD
    ix_tea_sign_mst__proc_st       TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__PROC_ST
    ix_tea_sign_mst__refr_id       TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__REFR_ID
    ix_tea_sign_mst__refr_number   TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__REFR_NO
    ix_tea_sign_mst__tran_type     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST__TRAN_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.signs
IS '레거시 테이블 TEA_SIGN_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_signs__is_deleted
    ON lwm.signs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_mst_email
-- 레거시: TEA_SIGN_MST_EMAIL
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_mst_email (
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
    eas_sign_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_SIGN_ID
    email                          VARCHAR(100)                             ,  -- [LEGACY] EMAIL
    subject                        VARCHAR(200)                             ,  -- [LEGACY] SUBJECT
    content                        TEXT                                     ,  -- [LEGACY] CONTENT
    ix_tea_sign_mst_email__eas_sign_id TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_EMAIL__EAS_SIGN_ID
    ix_tea_sign_mst_email__email   TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_EMAIL__EMAIL
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_mst_email
IS '레거시 테이블 TEA_SIGN_MST_EMAIL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_mst_email__is_deleted
    ON lwm.sign_mst_email (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_mst_line
-- 레거시: TEA_SIGN_MST_LINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_mst_line (
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
    eas_sign_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_SIGN_ID
    step_number                    INTEGER                        NOT NULL  ,  -- [LEGACY] STEP_NO
    prdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] PRDT_ID
    form_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FORM_TP
    posi_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] POSI_TP
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    proc_st                        CHAR(1)                                  ,  -- [LEGACY] PROC_ST
    proc_memo                      TEXT                                     ,  -- [LEGACY] PROC_MEMO
    noti_flag                      CHAR(1)                                  ,  -- [LEGACY] NOTI_YN
    noti_on                        TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] NOTI_ON
    noti_id                        INTEGER                                  ,  -- [LEGACY] NOTI_ID
    ix_tea_sign_mst_line__eas_sign_id TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__EAS_SIGN_ID
    ix_tea_sign_mst_line__empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__EMPY_CD
    ix_tea_sign_mst_line__form_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__FORM_TP
    ix_tea_sign_mst_line__numberti_flag TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__NOTI_YN
    ix_tea_sign_mst_line__posi_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__POSI_TP
    ix_tea_sign_mst_line__prdt_id  TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__PRDT_ID
    ix_tea_sign_mst_line__proc_st  TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__PROC_ST
    ix_tea_sign_mst_line__step_number TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_MST_LINE__STEP_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_mst_line
IS '레거시 테이블 TEA_SIGN_MST_LINE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_mst_line__is_deleted
    ON lwm.sign_mst_line (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_set
-- 레거시: TEA_SIGN_SET
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_set (
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
    tran_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] TRAN_TP
    rejt_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] REJT_TP
    hold_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] HOLD_YN
    noti_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] NOTI_YN
    noti_code                      VARCHAR(20)                              ,  -- [LEGACY] NOTI_CD
    noti_content                   TEXT                                     ,  -- [LEGACY] NOTI_CONTENT
    link_id                        INTEGER                                  ,  -- [LEGACY] LINK_ID
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_sign_set__numberti_flag TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET__NOTI_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_set
IS '레거시 테이블 TEA_SIGN_SET에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_set__is_deleted
    ON lwm.sign_set (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_set_line
-- 레거시: TEA_SIGN_SET_LINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_set_line (
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
    sign_set_id                    INTEGER                                  ,  -- [LEGACY] SIGN_SET_ID
    step_number                    INTEGER                        NOT NULL  ,  -- [LEGACY] STEP_NO
    form_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FORM_TP
    posi_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] POSI_TP
    rejt_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] REJT_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_sign_set_line__form_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE__FORM_TP
    ix_tea_sign_set_line__posi_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE__POSI_TP
    ix_tea_sign_set_line__rejt_flag TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE__REJT_YN
    ix_tea_sign_set_line__sign_set_id TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE__SIGN_SET_ID
    ix_tea_sign_set_line__step_number TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE__STEP_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_set_line
IS '레거시 테이블 TEA_SIGN_SET_LINE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_set_line__is_deleted
    ON lwm.sign_set_line (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_set_line_ex
-- 레거시: TEA_SIGN_SET_LINE_EX
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_set_line_ex (
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
    sign_set_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] SIGN_SET_ID
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    step_number                    INTEGER                        NOT NULL  ,  -- [LEGACY] STEP_NO
    form_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FORM_TP
    posi_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] POSI_TP
    rejt_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] REJT_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_sign_set_line_ex__dept_code TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__DEPT_CD
    ix_tea_sign_set_line_ex__form_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__FORM_TP
    ix_tea_sign_set_line_ex__posi_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__POSI_TP
    ix_tea_sign_set_line_ex__rejt_flag TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__REJT_YN
    ix_tea_sign_set_line_ex__sign_set_id TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__SIGN_SET_ID
    ix_tea_sign_set_line_ex__step_number TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SET_LINE_EX__STEP_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_set_line_ex
IS '레거시 테이블 TEA_SIGN_SET_LINE_EX에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_set_line_ex__is_deleted
    ON lwm.sign_set_line_ex (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.sign_sub
-- 레거시: TEA_SIGN_SUB
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.sign_sub (
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
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    fnsh_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] FNSH_YN
    sign_sub_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] SIGN_SUB_TP
    sub_empy_code                  CHAR(10)                                 ,  -- [LEGACY] SUB_EMPY_CD
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tea_sign_sub__base_date     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__BASE_DT
    ix_tea_sign_sub__bend_date     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__BEND_DT
    ix_tea_sign_sub__empy_code     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__EMPY_CD
    ix_tea_sign_sub__fnsh_flag     TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__FNSH_YN
    ix_tea_sign_sub__sign_sub_type TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__SIGN_SUB_TP
    ix_tea_sign_sub__sub_empy_code TEXT                                     ,  -- [LEGACY] IX_TEA_SIGN_SUB__SUB_EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.sign_sub
IS '레거시 테이블 TEA_SIGN_SUB에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_sign_sub__is_deleted
    ON lwm.sign_sub (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: lwm.template
-- 레거시: TEA_TEMPLATE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lwm.template (
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
    eas_form_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] EAS_FORM_ID
    eas_pay_type                   CHAR(1)                        NOT NULL  ,  -- [LEGACY] EAS_PAY_TP
    eas_acc_type                   CHAR(4)                                  ,  -- [LEGACY] EAS_ACC_TP
    content_txt                    TEXT                                     ,  -- [LEGACY] CONTENT_TXT
    content_rtf                    TEXT                                     ,  -- [LEGACY] CONTENT_RTF
    eas_rule                       TEXT                                     ,  -- [LEGACY] EAS_RULE
    subject                        VARCHAR(200)                             ,  -- [LEGACY] SUBJECT
    dept_chief_flag                CHAR(1)                                  ,  -- [LEGACY] DEPT_CHIEF_YN
    divs_chief_flag                CHAR(1)                                  ,  -- [LEGACY] DIVS_CHIEF_YN
    ix_tea_template__eas_acc_type  TEXT                                     ,  -- [LEGACY] IX_TEA_TEMPLATE__EAS_ACC_TP
    ix_tea_template__eas_form_id   TEXT                                     ,  -- [LEGACY] IX_TEA_TEMPLATE__EAS_FORM_ID
    ix_tea_template__eas_pay_type  TEXT                                     ,  -- [LEGACY] IX_TEA_TEMPLATE__EAS_PAY_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE lwm.template
IS '레거시 테이블 TEA_TEMPLATE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_template__is_deleted
    ON lwm.template (is_deleted)
 WHERE is_deleted = false;


