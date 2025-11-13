-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: adm
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 테이블: adm.brands
-- 액션: 컬럼 추가 (6개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(100) NOT NULL;

COMMENT ON COLUMN adm.brands.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(100) ;

COMMENT ON COLUMN adm.brands.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] BRND_NM (varchar)
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS brnd_name VARCHAR(200) NOT NULL;

COMMENT ON COLUMN adm.brands.brnd_name
IS '레거시 컬럼: BRND_NM';

-- [MIGRATED FROM LEGACY] SORT_SEQ (int)
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS sort_order INTEGER ;

COMMENT ON COLUMN adm.brands.sort_order
IS '레거시 컬럼: SORT_SEQ';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.brands.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_BRND_MST__USE_YN ()
ALTER TABLE adm.brands
ADD COLUMN IF NOT EXISTS ix_tbs_brnd_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.brands.ix_tbs_brnd_mst__use_flag
IS '레거시 컬럼: IX_TBS_BRND_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.cldrs
-- 레거시: TBS_CLDR_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.cldrs (
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
    cldr_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] CLDR_DT
    cldr_yy                        CHAR(4)                        NOT NULL  ,  -- [LEGACY] CLDR_YY
    cldr_mm                        CHAR(2)                        NOT NULL  ,  -- [LEGACY] CLDR_MM
    cldr_dd                        CHAR(2)                        NOT NULL  ,  -- [LEGACY] CLDR_DD
    cldr_dw                        CHAR(3)                        NOT NULL  ,  -- [LEGACY] CLDR_DW
    cldr_wk                        INTEGER                        NOT NULL  ,  -- [LEGACY] CLDR_WK
    cldr_mw                        INTEGER                        NOT NULL  ,  -- [LEGACY] CLDR_MW
    hldy_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] HLDY_YN
    hldy_name                      VARCHAR(50)                              ,  -- [LEGACY] HLDY_NM
    ix_tbs_cldr_mst__cldr_dd       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_DD
    ix_tbs_cldr_mst__cldr_dw       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_DW
    ix_tbs_cldr_mst__cldr_mm       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_MM
    ix_tbs_cldr_mst__cldr_mw       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_MW
    ix_tbs_cldr_mst__cldr_wk       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_WK
    ix_tbs_cldr_mst__cldr_yy       TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__CLDR_YY
    ix_tbs_cldr_mst__hldy_flag     TEXT                                     ,  -- [LEGACY] IX_TBS_CLDR_MST__HLDY_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.cldrs
IS '레거시 테이블 TBS_CLDR_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_cldrs__is_deleted
    ON adm.cldrs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_lock
-- 레거시: TBS_CLMT_LOCK
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_lock (
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
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    refr_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] REFR_TP
    refr_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] REFR_NO
    refr_id                        INTEGER                                  ,  -- [LEGACY] REFR_ID
    lock_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] LOCK_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_clmt_lock__crdt_id      TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK__CRDT_ID
    ix_tbs_clmt_lock__cust_code    TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK__CUST_CD
    ix_tbs_clmt_lock__refr_id      TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK__REFR_ID
    ix_tbs_clmt_lock__refr_number  TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK__REFR_NO
    ix_tbs_clmt_lock__refr_type    TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK__REFR_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_lock
IS '레거시 테이블 TBS_CLMT_LOCK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_lock__is_deleted
    ON adm.clmt_lock (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_lock_history
-- 레거시: TBS_CLMT_LOCK_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_lock_history (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    refr_type                      CHAR(2)                        NOT NULL  ,  -- [LEGACY] REFR_TP
    refr_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] REFR_NO
    refr_id                        INTEGER                                  ,  -- [LEGACY] REFR_ID
    lock_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] LOCK_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_clmt_lock_hist__id      TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_LOCK_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_lock_history
IS '레거시 테이블 TBS_CLMT_LOCK_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_lock_history__is_deleted
    ON adm.clmt_lock_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmts
-- 레거시: TBS_CLMT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmts (
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
    clmt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] CLMT_NO
    clmt_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CLMT_TP
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    clmt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_AMT
    refr_number                    VARCHAR(20)                              ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    ix_tbs_clmt_mst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__BASE_DT
    ix_tbs_clmt_mst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__BEND_DT
    ix_tbs_clmt_mst__clmt_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__CLMT_TP
    ix_tbs_clmt_mst__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__CRDT_ID
    ix_tbs_clmt_mst__crlm_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__CRLM_TP
    ix_tbs_clmt_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__CUST_CD
    ix_tbs_clmt_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__DEPT_CD
    ix_tbs_clmt_mst__eas_sign_id   TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__EAS_SIGN_ID
    ix_tbs_clmt_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__EMPY_CD
    ix_tbs_clmt_mst__proc_st       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__PROC_ST
    ix_tbs_clmt_mst__refr_number   TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_MST__REFR_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmts
IS '레거시 테이블 TBS_CLMT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmts__is_deleted
    ON adm.clmts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_mst_history
-- 레거시: TBS_CLMT_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_mst_history (
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
    clmt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] CLMT_NO
    clmt_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CLMT_TP
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    clmt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_AMT
    refr_number                    VARCHAR(20)                              ,  -- [LEGACY] REFR_NO
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    proc_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] PROC_ST
    eas_sign_id                    INTEGER                                  ,  -- [LEGACY] EAS_SIGN_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_mst_history
IS '레거시 테이블 TBS_CLMT_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_mst_history__is_deleted
    ON adm.clmt_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_summaries
-- 레거시: TBS_CLMT_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_summaries (
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
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    clmt_tot_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_TOT_AMT
    clmt_use_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_USE_AMT
    clmt_rem_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CLMT_REM_AMT
    ix_tbs_clmt_sum__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_SUM__CRDT_ID
    ix_tbs_clmt_sum__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_SUM__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_summaries
IS '레거시 테이블 TBS_CLMT_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_summaries__is_deleted
    ON adm.clmt_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_transactions
-- 레거시: TBS_CLMT_TRN
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_transactions (
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
    crdt_id                        INTEGER                                  ,  -- [LEGACY] CRDT_ID
    ctrn_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] CTRN_TP
    ctrn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] CTRN_DT
    ctrn_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CTRN_AMT
    refr_number                    VARCHAR(20)                              ,  -- [LEGACY] REFR_NO
    refr_id                        INTEGER                                  ,  -- [LEGACY] REFR_ID
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tbs_clmt_trn__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__CRDT_ID
    ix_tbs_clmt_trn__ctrn_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__CTRN_DT
    ix_tbs_clmt_trn__ctrn_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__CTRN_TP
    ix_tbs_clmt_trn__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__CUST_CD
    ix_tbs_clmt_trn__refr_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__REFR_ID
    ix_tbs_clmt_trn__refr_number   TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN__REFR_NO
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_transactions
IS '레거시 테이블 TBS_CLMT_TRN에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_transactions__is_deleted
    ON adm.clmt_transactions (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clmt_trn_history
-- 레거시: TBS_CLMT_TRN_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clmt_trn_history (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_id                        INTEGER                                  ,  -- [LEGACY] CRDT_ID
    ctrn_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] CTRN_TP
    ctrn_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] CTRN_DT
    ctrn_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CTRN_AMT
    refr_number                    VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] REFR_NO
    refr_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] REFR_ID
    description                    VARCHAR(500)                             ,  -- [LEGACY] NOTES
    ix_tbs_clmt_trn_hist__id       TEXT                                     ,  -- [LEGACY] IX_TBS_CLMT_TRN_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clmt_trn_history
IS '레거시 테이블 TBS_CLMT_TRN_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clmt_trn_history__is_deleted
    ON adm.clmt_trn_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.clsfs
-- 레거시: TBS_CLSF_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.clsfs (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE       NOT NULL  ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                        NOT NULL  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(100)                             ,  -- [LEGACY] UPDATE_BY
    clsf_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] CLSF_NM
    sort_order                     INTEGER                                  ,  -- [LEGACY] SORT_SEQ
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.clsfs
IS '레거시 테이블 TBS_CLSF_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_clsfs__is_deleted
    ON adm.clsfs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.colls
-- 레거시: TBS_COLL_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.colls (
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
    coll_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] COLL_NO
    coll_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] COLL_TP
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    coll_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COLL_AMT
    real_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REAL_AMT
    coll_st                        CHAR(1)                        NOT NULL  ,  -- [LEGACY] COLL_ST
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    prop_ownr_name                 VARCHAR(200)                             ,  -- [LEGACY] PROP_OWNR_NM
    prop_post_code                 VARCHAR(10)                              ,  -- [LEGACY] PROP_POST_CD
    prop_addr1                     VARCHAR(200)                             ,  -- [LEGACY] PROP_ADDR1
    prop_addr2                     VARCHAR(200)                             ,  -- [LEGACY] PROP_ADDR2
    bond_trns_name                 VARCHAR(100)                             ,  -- [LEGACY] BOND_TRNS_NM
    thrd_dbtr_name                 VARCHAR(100)                             ,  -- [LEGACY] THRD_DBTR_NM
    bond_post_code                 VARCHAR(10)                              ,  -- [LEGACY] BOND_POST_CD
    bond_addr1                     VARCHAR(200)                             ,  -- [LEGACY] BOND_ADDR1
    bond_addr2                     VARCHAR(200)                             ,  -- [LEGACY] BOND_ADDR2
    bank_brch_name                 VARCHAR(100)                             ,  -- [LEGACY] BANK_BRCH_NM
    bank_acct_number               VARCHAR(100)                             ,  -- [LEGACY] BANK_ACCT_NO
    bank_dpst_name                 VARCHAR(100)                             ,  -- [LEGACY] BANK_DPST_NM
    insu_brch_name                 VARCHAR(100)                             ,  -- [LEGACY] INSU_BRCH_NM
    insu_plcy_number               VARCHAR(100)                             ,  -- [LEGACY] INSU_PLCY_NO
    insu_ownr_name                 VARCHAR(100)                             ,  -- [LEGACY] INSU_OWNR_NM
    guar_brch_name                 VARCHAR(100)                             ,  -- [LEGACY] GUAR_BRCH_NM
    guar_plcy_number               VARCHAR(100)                             ,  -- [LEGACY] GUAR_PLCY_NO
    guar_pobx_number               VARCHAR(100)                             ,  -- [LEGACY] GUAR_POBX_NO
    paym_brch_name                 VARCHAR(100)                             ,  -- [LEGACY] PAYM_BRCH_NM
    note_brch_name                 VARCHAR(100)                             ,  -- [LEGACY] NOTE_BRCH_NM
    coll_type_name                 VARCHAR(100)                             ,  -- [LEGACY] COLL_TYPE_NM
    end_user_name                  VARCHAR(100)                             ,  -- [LEGACY] END_USER_NM
    contract_name                  VARCHAR(100)                             ,  -- [LEGACY] CONTRACT_NM
    pjt_sign_date                  CHAR(8)                                  ,  -- [LEGACY] PJT_SIGN_DT
    pjt_paym_date                  CHAR(8)                                  ,  -- [LEGACY] PJT_PAYM_DT
    othr_coll_name                 TEXT                                     ,  -- [LEGACY] OTHR_COLL_NM
    ix_tbs_coll_mst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__BASE_DT
    ix_tbs_coll_mst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__BEND_DT
    ix_tbs_coll_mst__coll_st       TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__COLL_ST
    ix_tbs_coll_mst__coll_type     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__COLL_TP
    ix_tbs_coll_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__CUST_CD
    ix_tbs_coll_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__DEPT_CD
    ix_tbs_coll_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_COLL_MST__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.colls
IS '레거시 테이블 TBS_COLL_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_colls__is_deleted
    ON adm.colls (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.corps
-- 레거시: TBS_CORP_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.corps (
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
    corp_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CORP_CD
    corp_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CORP_NM
    dept_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] DEPT_TP
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    acc_corp_code                  VARCHAR(20)                              ,  -- [LEGACY] ACC_CORP_CD
    tax_bill_type                  CHAR(1)                                  ,  -- [LEGACY] TAX_BILL_TP
    logo_file                      VARCHAR(200)                             ,  -- [LEGACY] LOGO_FILE
    noti_corp_name                 VARCHAR(100)                             ,  -- [LEGACY] NOTI_CORP_NM
    noti_send_key                  VARCHAR(100)                             ,  -- [LEGACY] NOTI_SEND_KEY
    noti_phne_number               VARCHAR(100)                             ,  -- [LEGACY] NOTI_PHNE_NO
    corp_name_eng                  VARCHAR(100)                             ,  -- [LEGACY] CORP_NM_ENG
    address_eng                    VARCHAR(500)                             ,  -- [LEGACY] ADDRESS_ENG
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.corps
IS '레거시 테이블 TBS_CORP_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_corps__is_deleted
    ON adm.corps (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.crdt_day
-- 레거시: TBS_CRDT_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.crdt_day (
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
    cday_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CDAY_TP
    base_day                       INTEGER                                  ,  -- [LEGACY] BASE_DAY
    bend_day                       INTEGER                                  ,  -- [LEGACY] BEND_DAY
    paym_mon                       INTEGER                                  ,  -- [LEGACY] PAYM_MON
    paym_day                       INTEGER                                  ,  -- [LEGACY] PAYM_DAY
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_crdt_day__base_day      TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_DAY__BASE_DAY
    ix_tbs_crdt_day__bend_day      TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_DAY__BEND_DAY
    ix_tbs_crdt_day__codeay_type   TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_DAY__CDAY_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.crdt_day
IS '레거시 테이블 TBS_CRDT_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_crdt_day__is_deleted
    ON adm.crdt_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.crdt_lvl
-- 레거시: TBS_CRDT_LVL
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.crdt_lvl (
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
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    clvl_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CLVL_TP
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_crdt_lvl__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_LVL__BASE_DT
    ix_tbs_crdt_lvl__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_LVL__BEND_DT
    ix_tbs_crdt_lvl__clvl_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_LVL__CLVL_TP
    ix_tbs_crdt_lvl__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_LVL__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.crdt_lvl
IS '레거시 테이블 TBS_CRDT_LVL에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_crdt_lvl__is_deleted
    ON adm.crdt_lvl (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.crdt_mgr
-- 레거시: TBS_CRDT_MGR
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.crdt_mgr (
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
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    cday_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CDAY_TP
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_crdt_mgr__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MGR__BASE_DT
    ix_tbs_crdt_mgr__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MGR__BEND_DT
    ix_tbs_crdt_mgr__codeay_type   TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MGR__CDAY_TP
    ix_tbs_crdt_mgr__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MGR__CRDT_ID
    ix_tbs_crdt_mgr__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MGR__DEPT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.crdt_mgr
IS '레거시 테이블 TBS_CRDT_MGR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_crdt_mgr__is_deleted
    ON adm.crdt_mgr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.crdts
-- 레거시: TBS_CRDT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.crdts (
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
    crdt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] CRDT_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crcy_type                      CHAR(3)                                  ,  -- [LEGACY] CRCY_TP
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_crdt_mst__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MST__CRDT_TP
    ix_tbs_crdt_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MST__CUST_CD
    ix_tbs_crdt_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.crdts
IS '레거시 테이블 TBS_CRDT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_crdts__is_deleted
    ON adm.crdts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.crdt_summaries
-- 레거시: TBS_CRDT_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.crdt_summaries (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    crdt_type                      CHAR(4)                        NOT NULL  ,  -- [LEGACY] CRDT_TP
    crdt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CRDT_ID
    base_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_AMT
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    dpst_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DPST_AMT
    mdfy_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MDFY_AMT
    blnc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BLNC_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_crdt_sum__base_ym       TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_SUM__BASE_YM
    ix_tbs_crdt_sum__crdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_SUM__CRDT_ID
    ix_tbs_crdt_sum__crdt_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_SUM__CRDT_TP
    ix_tbs_crdt_sum__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_SUM__CUST_CD
    ix_tbs_crdt_sum__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CRDT_SUM__DEPT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.crdt_summaries
IS '레거시 테이블 TBS_CRDT_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_crdt_summaries__is_deleted
    ON adm.crdt_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.category_mgr
-- 레거시: TBS_CTGR_MGR
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.category_mgr (
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
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_ctgr_mgr__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MGR__BASE_DT
    ix_tbs_ctgr_mgr__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MGR__BEND_DT
    ix_tbs_ctgr_mgr__ctgr_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MGR__CTGR_CD
    ix_tbs_ctgr_mgr__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MGR__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.category_mgr
IS '레거시 테이블 TBS_CTGR_MGR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_category_mgr__is_deleted
    ON adm.category_mgr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.category_mrgs
-- 레거시: TBS_CTGR_MRG_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.category_mrgs (
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
    ctgr_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CTGR_ID
    mrg_rat                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MRG_RAT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.category_mrgs
IS '레거시 테이블 TBS_CTGR_MRG_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_category_mrgs__is_deleted
    ON adm.category_mrgs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.categorys
-- 레거시: TBS_CTGR_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.categorys (
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
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    ctgr_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CTGR_NM
    ctgr_type                      CHAR(1)                                  ,  -- [LEGACY] CTGR_TP
    parent_code                    CHAR(10)                                 ,  -- [LEGACY] PARENT_CD
    empy_code                      VARCHAR(10)                              ,  -- [LEGACY] EMPY_CD
    sort_order                     INTEGER                        NOT NULL  ,  -- [LEGACY] SORT_SEQ
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    maj_ctgr_code                  CHAR(10)                                 ,  -- [LEGACY] MAJ_CTGR_CD
    mid_ctgr_code                  CHAR(10)                                 ,  -- [LEGACY] MID_CTGR_CD
    min_ctgr_code                  CHAR(10)                                 ,  -- [LEGACY] MIN_CTGR_CD
    stdn_name                      VARCHAR(100)                             ,  -- [LEGACY] STDN_NM
    ix_tbs_ctgr_mst__ctgr_type     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__CTGR_TP
    ix_tbs_ctgr_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__EMPY_CD
    ix_tbs_ctgr_mst__maj_ctgr_code TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__MAJ_CTGR_CD
    ix_tbs_ctgr_mst__mid_ctgr_code TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__MID_CTGR_CD
    ix_tbs_ctgr_mst__min_ctgr_code TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__MIN_CTGR_CD
    ix_tbs_ctgr_mst__parent_code   TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__PARENT_CD
    ix_tbs_ctgr_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_CTGR_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.categorys
IS '레거시 테이블 TBS_CTGR_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_categorys__is_deleted
    ON adm.categorys (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.ctrts
-- 레거시: TBS_CTRT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.ctrts (
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
    ctrt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] CTRT_NO
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    over_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] OVER_RAT
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    uncl_flag                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] UNCL_YN
    uncl_reason                    TEXT                                     ,  -- [LEGACY] UNCL_REASON
    ix_tbs_ctrt_mst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__BASE_DT
    ix_tbs_ctrt_mst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__BEND_DT
    ix_tbs_ctrt_mst__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__CUST_CD
    ix_tbs_ctrt_mst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__DEPT_CD
    ix_tbs_ctrt_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__EMPY_CD
    ix_tbs_ctrt_mst__uncl_flag     TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__UNCL_YN
    ix_tbs_ctrt_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_CTRT_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.ctrts
IS '레거시 테이블 TBS_CTRT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_ctrts__is_deleted
    ON adm.ctrts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_addr
-- 레거시: TBS_CUST_ADDR
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_addr (
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
    base_flag                      CHAR(1)                                  ,  -- [LEGACY] BASE_YN
    addr_type                      CHAR(1)                                  ,  -- [LEGACY] ADDR_TP
    addr_name                      VARCHAR(100)                             ,  -- [LEGACY] ADDR_NM
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    address1                       VARCHAR(200)                             ,  -- [LEGACY] ADDRESS
    address2                       VARCHAR(200)                             ,  -- [LEGACY] BLDG_NM
    rcvr_name                      VARCHAR(100)                             ,  -- [LEGACY] RCVR_NM
    phne_number                    VARCHAR(100)                             ,  -- [LEGACY] PHNE_NO
    ix_tbs_cust_addr__addr_type    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_ADDR__ADDR_TP
    ix_tbs_cust_addr__base_flag    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_ADDR__BASE_YN
    ix_tbs_cust_addr__cust_code    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_ADDR__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_addr
IS '레거시 테이블 TBS_CUST_ADDR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_addr__is_deleted
    ON adm.customer_addr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_bank
-- 레거시: TBS_CUST_BANK
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_bank (
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
    bank_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] BANK_TP
    bank_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] BANK_CD
    acct_number                    VARCHAR(30)                    NOT NULL  ,  -- [LEGACY] ACCT_NO
    dptr_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] DPTR_NM
    ix_tbs_cust_bank__acct_number  TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_BANK__ACCT_NO
    ix_tbs_cust_bank__bank_code    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_BANK__BANK_CD
    ix_tbs_cust_bank__bank_type    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_BANK__BANK_TP
    ix_tbs_cust_bank__cust_code    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_BANK__CUST_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_bank
IS '레거시 테이블 TBS_CUST_BANK에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_bank__is_deleted
    ON adm.customer_bank (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_biz
-- 레거시: TBS_CUST_BIZ
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_biz (
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
    biz_number                     VARCHAR(20)                    NOT NULL  ,  -- [LEGACY] BIZ_NO
    biz_name                       VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] BIZ_NM
    biz_type                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] BIZ_TP
    open_date                      CHAR(8)                                  ,  -- [LEGACY] OPEN_DT
    biz_st                         CHAR(1)                                  ,  -- [LEGACY] BIZ_ST
    reg_number                     VARCHAR(20)                              ,  -- [LEGACY] REG_NO
    ceo_name                       VARCHAR(50)                              ,  -- [LEGACY] CEO_NM
    biz_type                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_TYPE
    biz_item                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_ITEM
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    address1                       VARCHAR(100)                             ,  -- [LEGACY] ADDRESS
    address2                       VARCHAR(100)                             ,  -- [LEGACY] BLDG_NM
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_biz
IS '레거시 테이블 TBS_CUST_BIZ에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_biz__is_deleted
    ON adm.customer_biz (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_eng
-- 레거시: TBS_CUST_ENG
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_eng (
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
    cust_name                      VARCHAR(100)                             ,  -- [LEGACY] CUST_NM
    addr                           VARCHAR(200)                             ,  -- [LEGACY] ADDR
    city                           VARCHAR(50)                              ,  -- [LEGACY] CITY
    state                          VARCHAR(50)                              ,  -- [LEGACY] STATE
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    country_code                   VARCHAR(10)                              ,  -- [LEGACY] COUNTRY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_eng
IS '레거시 테이블 TBS_CUST_ENG에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_eng__is_deleted
    ON adm.customer_eng (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_mgr
-- 레거시: TBS_CUST_MGR
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_mgr (
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
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_cust_mgr__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR__BASE_DT
    ix_tbs_cust_mgr__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR__BEND_DT
    ix_tbs_cust_mgr__cust_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR__CUST_CD
    ix_tbs_cust_mgr__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR__EMPY_CD
    ix_tbs_cust_mgr__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_mgr
IS '레거시 테이블 TBS_CUST_MGR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_mgr__is_deleted
    ON adm.customer_mgr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_mgr_history
-- 레거시: TBS_CUST_MGR_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_mgr_history (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_cust_mgr_hist__hist_type TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR_HIST__HIST_TP
    ix_tbs_cust_mgr_hist__id       TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MGR_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_mgr_history
IS '레거시 테이블 TBS_CUST_MGR_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_mgr_history__is_deleted
    ON adm.customer_mgr_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.customers
-- 액션: 컬럼 추가 (29개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.customers.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.customers.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] CUST_CD (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_code CHAR(14) NOT NULL;

COMMENT ON COLUMN adm.customers.cust_code
IS '레거시 컬럼: CUST_CD';

-- [MIGRATED FROM LEGACY] CUST_NM (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_name VARCHAR(100) NOT NULL;

COMMENT ON COLUMN adm.customers.cust_name
IS '레거시 컬럼: CUST_NM';

-- [MIGRATED FROM LEGACY] CUST_BIZ_TP (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_biz_type CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.customers.cust_biz_type
IS '레거시 컬럼: CUST_BIZ_TP';

-- [MIGRATED FROM LEGACY] CUST_TRN_TP (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_trn_type CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.customers.cust_trn_type
IS '레거시 컬럼: CUST_TRN_TP';

-- [MIGRATED FROM LEGACY] CUST_PUR_TP (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_pur_type CHAR(1) ;

COMMENT ON COLUMN adm.customers.cust_pur_type
IS '레거시 컬럼: CUST_PUR_TP';

-- [MIGRATED FROM LEGACY] CUST_DET_TP (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_det_type CHAR(2) ;

COMMENT ON COLUMN adm.customers.cust_det_type
IS '레거시 컬럼: CUST_DET_TP';

-- [MIGRATED FROM LEGACY] CUST_PUB_TP (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cust_pub_type CHAR(1) ;

COMMENT ON COLUMN adm.customers.cust_pub_type
IS '레거시 컬럼: CUST_PUB_TP';

-- [MIGRATED FROM LEGACY] CORP_REG_NO (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS corp_reg_number VARCHAR(20) ;

COMMENT ON COLUMN adm.customers.corp_reg_number
IS '레거시 컬럼: CORP_REG_NO';

-- [MIGRATED FROM LEGACY] BIZ_OPEN_DT (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_open_date CHAR(8) ;

COMMENT ON COLUMN adm.customers.biz_open_date
IS '레거시 컬럼: BIZ_OPEN_DT';

-- [MIGRATED FROM LEGACY] BIZ_REG_NO (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_reg_number VARCHAR(20) ;

COMMENT ON COLUMN adm.customers.biz_reg_number
IS '레거시 컬럼: BIZ_REG_NO';

-- [MIGRATED FROM LEGACY] BIZ_REG_NM (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_reg_name VARCHAR(100) ;

COMMENT ON COLUMN adm.customers.biz_reg_name
IS '레거시 컬럼: BIZ_REG_NM';

-- [MIGRATED FROM LEGACY] BIZ_CEO_NM (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_ceo_name VARCHAR(50) ;

COMMENT ON COLUMN adm.customers.biz_ceo_name
IS '레거시 컬럼: BIZ_CEO_NM';

-- [MIGRATED FROM LEGACY] BIZ_TYPE (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_type VARCHAR(100) ;

COMMENT ON COLUMN adm.customers.biz_type
IS '레거시 컬럼: BIZ_TYPE';

-- [MIGRATED FROM LEGACY] BIZ_ITEM (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS biz_item VARCHAR(100) ;

COMMENT ON COLUMN adm.customers.biz_item
IS '레거시 컬럼: BIZ_ITEM';

-- [MIGRATED FROM LEGACY] FAX_NO (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS fax VARCHAR(20) ;

COMMENT ON COLUMN adm.customers.fax
IS '레거시 컬럼: FAX_NO';

-- [MIGRATED FROM LEGACY] HPAGE (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS hpage VARCHAR(100) ;

COMMENT ON COLUMN adm.customers.hpage
IS '레거시 컬럼: HPAGE';

-- [MIGRATED FROM LEGACY] CONT_MNG_TP (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS cont_mng_type VARCHAR(1) ;

COMMENT ON COLUMN adm.customers.cont_mng_type
IS '레거시 컬럼: CONT_MNG_TP';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.customers.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] TRN_YN (char)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS trn_flag CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.customers.trn_flag
IS '레거시 컬럼: TRN_YN';

-- [MIGRATED FROM LEGACY] NOTES (varchar)
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS description TEXT ;

COMMENT ON COLUMN adm.customers.description
IS '레거시 컬럼: NOTES';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__CUST_BIZ_TP ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__cust_biz_type TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__cust_biz_type
IS '레거시 컬럼: IX_TBS_CUST_MST__CUST_BIZ_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__CUST_DET_TP ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__cust_det_type TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__cust_det_type
IS '레거시 컬럼: IX_TBS_CUST_MST__CUST_DET_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__CUST_PUB_TP ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__cust_pub_type TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__cust_pub_type
IS '레거시 컬럼: IX_TBS_CUST_MST__CUST_PUB_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__CUST_PUR_TP ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__cust_pur_type TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__cust_pur_type
IS '레거시 컬럼: IX_TBS_CUST_MST__CUST_PUR_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__CUST_TRN_TP ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__cust_trn_type TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__cust_trn_type
IS '레거시 컬럼: IX_TBS_CUST_MST__CUST_TRN_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__TRN_YN ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__trn_flag TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__trn_flag
IS '레거시 컬럼: IX_TBS_CUST_MST__TRN_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_CUST_MST__USE_YN ()
ALTER TABLE adm.customers
ADD COLUMN IF NOT EXISTS ix_tbs_cust_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.customers.ix_tbs_cust_mst__use_flag
IS '레거시 컬럼: IX_TBS_CUST_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.customer_mst_history
-- 레거시: TBS_CUST_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_mst_history (
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
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    cust_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] CUST_NM
    cust_biz_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CUST_BIZ_TP
    cust_trn_type                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] CUST_TRN_TP
    cust_pur_type                  CHAR(1)                                  ,  -- [LEGACY] CUST_PUR_TP
    cust_det_type                  CHAR(2)                                  ,  -- [LEGACY] CUST_DET_TP
    cust_pub_type                  CHAR(1)                                  ,  -- [LEGACY] CUST_PUB_TP
    cust_biz_id                    INTEGER                                  ,  -- [LEGACY] CUST_BIZ_ID
    corp_reg_number                VARCHAR(20)                              ,  -- [LEGACY] CORP_REG_NO
    biz_open_date                  CHAR(8)                                  ,  -- [LEGACY] BIZ_OPEN_DT
    biz_reg_number                 VARCHAR(20)                              ,  -- [LEGACY] BIZ_REG_NO
    biz_reg_name                   VARCHAR(100)                             ,  -- [LEGACY] BIZ_REG_NM
    biz_ceo_name                   VARCHAR(50)                              ,  -- [LEGACY] BIZ_CEO_NM
    biz_type                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_TYPE
    biz_item                       VARCHAR(100)                             ,  -- [LEGACY] BIZ_ITEM
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    address1                       VARCHAR(100)                             ,  -- [LEGACY] ADDRESS
    address2                       VARCHAR(100)                             ,  -- [LEGACY] BLDG_NM
    phone                          VARCHAR(20)                              ,  -- [LEGACY] TEL_NO
    fax                            VARCHAR(20)                              ,  -- [LEGACY] FAX_NO
    email                          VARCHAR(100)                             ,  -- [LEGACY] EMAIL
    hpage                          VARCHAR(100)                             ,  -- [LEGACY] HPAGE
    cont_mng_type                  VARCHAR(1)                               ,  -- [LEGACY] CONT_MNG_TP
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    trn_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] TRN_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_cust_mst_hist__id       TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_MST_HIST__ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_mst_history
IS '레거시 테이블 TBS_CUST_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_mst_history__is_deleted
    ON adm.customer_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.customer_staf
-- 레거시: TBS_CUST_STAF
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.customer_staf (
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
    staf_name                      VARCHAR(20)                              ,  -- [LEGACY] STAF_NM
    posi_name                      VARCHAR(50)                              ,  -- [LEGACY] POSI_NM
    phone                          VARCHAR(30)                              ,  -- [LEGACY] TEL_NO
    fax                            VARCHAR(30)                              ,  -- [LEGACY] FAX_NO
    mobile                         VARCHAR(30)                              ,  -- [LEGACY] CEL_NO
    email                          VARCHAR(100)                             ,  -- [LEGACY] EMAIL
    staf_type                      CHAR(1)                                  ,  -- [LEGACY] STAF_TP
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    pay_numberti_flag              CHAR(1)                                  ,  -- [LEGACY] PAY_NOTI_YN
    ord_numberti_flag              CHAR(1)                                  ,  -- [LEGACY] ORD_NOTI_YN
    out_numberti_flag              CHAR(1)                                  ,  -- [LEGACY] OUT_NOTI_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_cust_staf__cust_code    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__CUST_CD
    ix_tbs_cust_staf__ord_numberti_flag TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__ORD_NOTI_YN
    ix_tbs_cust_staf__out_numberti_flag TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__OUT_NOTI_YN
    ix_tbs_cust_staf__pay_numberti_flag TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__PAY_NOTI_YN
    ix_tbs_cust_staf__staf_type    TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__STAF_TP
    ix_tbs_cust_staf__use_flag     TEXT                                     ,  -- [LEGACY] IX_TBS_CUST_STAF__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.customer_staf
IS '레거시 테이블 TBS_CUST_STAF에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_customer_staf__is_deleted
    ON adm.customer_staf (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.department_hst
-- 레거시: TBS_DEPT_HST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.department_hst (
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
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    dept_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] DEPT_NM
    dept_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] DEPT_TP
    parent_code                    CHAR(10)                                 ,  -- [LEGACY] PARENT_CD
    mngr_code                      CHAR(10)                                 ,  -- [LEGACY] MNGR_CD
    sort_order                     INTEGER                                  ,  -- [LEGACY] SORT_SEQ
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    ix_tbs_dept_hst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__BASE_DT
    ix_tbs_dept_hst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__BEND_DT
    ix_tbs_dept_hst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__DEPT_CD
    ix_tbs_dept_hst__mngr_code     TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__MNGR_CD
    ix_tbs_dept_hst__parent_code   TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__PARENT_CD
    ix_tbs_dept_hst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_DEPT_HST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.department_hst
IS '레거시 테이블 TBS_DEPT_HST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_department_hst__is_deleted
    ON adm.department_hst (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.departments
-- 액션: 컬럼 추가 (17개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.departments.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.departments.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] DEPT_CD (char)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS dept_code CHAR(10) NOT NULL;

COMMENT ON COLUMN adm.departments.dept_code
IS '레거시 컬럼: DEPT_CD';

-- [MIGRATED FROM LEGACY] DEPT_NM (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS dept_name VARCHAR(100) NOT NULL;

COMMENT ON COLUMN adm.departments.dept_name
IS '레거시 컬럼: DEPT_NM';

-- [MIGRATED FROM LEGACY] DEPT_TP (char)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS dept_type CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.departments.dept_type
IS '레거시 컬럼: DEPT_TP';

-- [MIGRATED FROM LEGACY] PARENT_CD (char)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS parent_code CHAR(10) ;

COMMENT ON COLUMN adm.departments.parent_code
IS '레거시 컬럼: PARENT_CD';

-- [MIGRATED FROM LEGACY] MNGR_CD (char)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS mngr_code CHAR(10) ;

COMMENT ON COLUMN adm.departments.mngr_code
IS '레거시 컬럼: MNGR_CD';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.departments.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] NOTES (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS description TEXT ;

COMMENT ON COLUMN adm.departments.description
IS '레거시 컬럼: NOTES';

-- [MIGRATED FROM LEGACY] FAX_NO (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS fax VARCHAR(20) ;

COMMENT ON COLUMN adm.departments.fax
IS '레거시 컬럼: FAX_NO';

-- [MIGRATED FROM LEGACY] POST_CD (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS postcode VARCHAR(10) ;

COMMENT ON COLUMN adm.departments.postcode
IS '레거시 컬럼: POST_CD';

-- [MIGRATED FROM LEGACY] ADDRESS (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS address1 VARCHAR(200) ;

COMMENT ON COLUMN adm.departments.address1
IS '레거시 컬럼: ADDRESS';

-- [MIGRATED FROM LEGACY] BLDG_NM (varchar)
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS address2 VARCHAR(200) ;

COMMENT ON COLUMN adm.departments.address2
IS '레거시 컬럼: BLDG_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_DEPT_MST__DEPT_TP ()
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS ix_tbs_dept_mst__dept_type TEXT ;

COMMENT ON COLUMN adm.departments.ix_tbs_dept_mst__dept_type
IS '레거시 컬럼: IX_TBS_DEPT_MST__DEPT_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_DEPT_MST__MNGR_CD ()
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS ix_tbs_dept_mst__mngr_code TEXT ;

COMMENT ON COLUMN adm.departments.ix_tbs_dept_mst__mngr_code
IS '레거시 컬럼: IX_TBS_DEPT_MST__MNGR_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_DEPT_MST__PARENT_CD ()
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS ix_tbs_dept_mst__parent_code TEXT ;

COMMENT ON COLUMN adm.departments.ix_tbs_dept_mst__parent_code
IS '레거시 컬럼: IX_TBS_DEPT_MST__PARENT_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_DEPT_MST__USE_YN ()
ALTER TABLE adm.departments
ADD COLUMN IF NOT EXISTS ix_tbs_dept_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.departments.ix_tbs_dept_mst__use_flag
IS '레거시 컬럼: IX_TBS_DEPT_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.employee_hst
-- 레거시: TBS_EMPY_HST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.employee_hst (
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
    work_st                        CHAR(1)                                  ,  -- [LEGACY] WORK_ST
    empy_number                    VARCHAR(20)                              ,  -- [LEGACY] EMPY_NO
    dept_code                      CHAR(10)                                 ,  -- [LEGACY] DEPT_CD
    posi_type                      CHAR(4)                                  ,  -- [LEGACY] POSI_TP
    duty_type                      CHAR(2)                                  ,  -- [LEGACY] DUTY_TP
    job_dscr                       TEXT                                     ,  -- [LEGACY] JOB_DSCR
    erp_use_flag                   CHAR(1)                                  ,  -- [LEGACY] ERP_USE_YN
    crm_use_flag                   CHAR(1)                                  ,  -- [LEGACY] CRM_USE_YN
    eas_use_flag                   CHAR(1)                                  ,  -- [LEGACY] EAS_USE_YN
    ix_tbs_empy_hst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__BASE_DT
    ix_tbs_empy_hst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__BEND_DT
    ix_tbs_empy_hst__dept_code     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__DEPT_CD
    ix_tbs_empy_hst__duty_type     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__DUTY_TP
    ix_tbs_empy_hst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__EMPY_CD
    ix_tbs_empy_hst__empy_number   TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__EMPY_NO
    ix_tbs_empy_hst__posi_type     TEXT                                     ,  -- [LEGACY] IX_TBS_EMPY_HST__POSI_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.employee_hst
IS '레거시 테이블 TBS_EMPY_HST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_employee_hst__is_deleted
    ON adm.employee_hst (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.employees
-- 액션: 컬럼 추가 (10개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.employees.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.employees.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] EMPY_CD (char)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS empy_code CHAR(10) NOT NULL;

COMMENT ON COLUMN adm.employees.empy_code
IS '레거시 컬럼: EMPY_CD';

-- [MIGRATED FROM LEGACY] EMPY_NM (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS empy_name VARCHAR(50) NOT NULL;

COMMENT ON COLUMN adm.employees.empy_name
IS '레거시 컬럼: EMPY_NM';

-- [MIGRATED FROM LEGACY] EMPY_DT (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS empy_date VARCHAR(8) ;

COMMENT ON COLUMN adm.employees.empy_date
IS '레거시 컬럼: EMPY_DT';

-- [MIGRATED FROM LEGACY] FAX_NO (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS fax VARCHAR(20) ;

COMMENT ON COLUMN adm.employees.fax
IS '레거시 컬럼: FAX_NO';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.employees.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] NOTES (varchar)
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS description TEXT ;

COMMENT ON COLUMN adm.employees.description
IS '레거시 컬럼: NOTES';

-- [MIGRATED FROM LEGACY] IX_TBS_EMPY_MST__EMPY_NM ()
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS ix_tbs_empy_mst__empy_name TEXT ;

COMMENT ON COLUMN adm.employees.ix_tbs_empy_mst__empy_name
IS '레거시 컬럼: IX_TBS_EMPY_MST__EMPY_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_EMPY_MST__USE_YN ()
ALTER TABLE adm.employees
ADD COLUMN IF NOT EXISTS ix_tbs_empy_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.employees.ix_tbs_empy_mst__use_flag
IS '레거시 컬럼: IX_TBS_EMPY_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.exchs
-- 레거시: TBS_EXCH_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.exchs (
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
    crcy_type                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] CRCY_TP
    exch_rat                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXCH_RAT
    remark                         TEXT                                     ,  -- [LEGACY] REMARK
    ix_tbs_exch_mst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_EXCH_MST__BASE_DT
    ix_tbs_exch_mst__crcy_type     TEXT                                     ,  -- [LEGACY] IX_TBS_EXCH_MST__CRCY_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.exchs
IS '레거시 테이블 TBS_EXCH_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_exchs__is_deleted
    ON adm.exchs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.files
-- 레거시: TBS_FILE_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.files (
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
    file_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FILE_NM
    file_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] FILE_NAME
    file_path                      VARCHAR(200)                             ,  -- [LEGACY] FILE_PATH
    file_size                      NUMERIC(17, 2)                           ,  -- [LEGACY] FILE_SIZE
    file_ext                       VARCHAR(10)                              ,  -- [LEGACY] FILE_EXT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_file_mst__file_name     TEXT                                     ,  -- [LEGACY] IX_TBS_FILE_MST__FILE_NAME
    ix_tbs_file_mst__file_name     TEXT                                     ,  -- [LEGACY] IX_TBS_FILE_MST__FILE_NM
    ix_tbs_file_mst__file_path     TEXT                                     ,  -- [LEGACY] IX_TBS_FILE_MST__FILE_PATH
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.files
IS '레거시 테이블 TBS_FILE_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_files__is_deleted
    ON adm.files (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.gntrs
-- 레거시: TBS_GNTR_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.gntrs (
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
    ctrt_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] CTRT_ID
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    gntr_name                      VARCHAR(100)                   NOT NULL  ,  -- [LEGACY] GNTR_NM
    gntr_rel                       VARCHAR(20)                              ,  -- [LEGACY] GNTR_REL
    brth_date                      VARCHAR(10)                              ,  -- [LEGACY] BRTH_DT
    postcode                       VARCHAR(10)                              ,  -- [LEGACY] POST_CD
    address1                       VARCHAR(200)                             ,  -- [LEGACY] ADDRESS
    address2                       VARCHAR(200)                             ,  -- [LEGACY] BLDG_NM
    phne_number                    VARCHAR(20)                              ,  -- [LEGACY] PHNE_NO
    key_flag                       CHAR(1)                        NOT NULL  ,  -- [LEGACY] KEY_YN
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_gntr_mst__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__BASE_DT
    ix_tbs_gntr_mst__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__BEND_DT
    ix_tbs_gntr_mst__ctrt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__CTRT_ID
    ix_tbs_gntr_mst__gntr_name     TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__GNTR_NM
    ix_tbs_gntr_mst__key_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__KEY_YN
    ix_tbs_gntr_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_GNTR_MST__USE_YN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.gntrs
IS '레거시 테이블 TBS_GNTR_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_gntrs__is_deleted
    ON adm.gntrs (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.hldys
-- 레거시: TBS_HLDY_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.hldys (
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
    hldy_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] HLDY_DT
    hldy_name                      VARCHAR(50)                    NOT NULL  ,  -- [LEGACY] HLDY_NM
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.hldys
IS '레거시 테이블 TBS_HLDY_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_hldys__is_deleted
    ON adm.hldys (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.lbrys
-- 레거시: TBS_LBRY_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.lbrys (
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
    lbry_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] LBRY_NM
    lbry_doc_type                  CHAR(2)                        NOT NULL  ,  -- [LEGACY] LBRY_DOC_TP
    lbry_cat_type                  CHAR(4)                        NOT NULL  ,  -- [LEGACY] LBRY_CAT_TP
    file_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] FILE_ID
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_lbry_mst__file_id       TEXT                                     ,  -- [LEGACY] IX_TBS_LBRY_MST__FILE_ID
    ix_tbs_lbry_mst__lbry_cat_type TEXT                                     ,  -- [LEGACY] IX_TBS_LBRY_MST__LBRY_CAT_TP
    ix_tbs_lbry_mst__lbry_doc_type TEXT                                     ,  -- [LEGACY] IX_TBS_LBRY_MST__LBRY_DOC_TP
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.lbrys
IS '레거시 테이블 TBS_LBRY_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_lbrys__is_deleted
    ON adm.lbrys (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.makers
-- 액션: 컬럼 추가 (6개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(100) NOT NULL;

COMMENT ON COLUMN adm.makers.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(100) ;

COMMENT ON COLUMN adm.makers.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] MAKR_NM (varchar)
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS makr_name VARCHAR(200) NOT NULL;

COMMENT ON COLUMN adm.makers.makr_name
IS '레거시 컬럼: MAKR_NM';

-- [MIGRATED FROM LEGACY] SORT_SEQ (int)
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS sort_order INTEGER ;

COMMENT ON COLUMN adm.makers.sort_order
IS '레거시 컬럼: SORT_SEQ';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.makers.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_MAKR_MST__USE_YN ()
ALTER TABLE adm.makers
ADD COLUMN IF NOT EXISTS ix_tbs_makr_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.makers.ix_tbs_makr_mst__use_flag
IS '레거시 컬럼: IX_TBS_MAKR_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.product_mgr
-- 레거시: TBS_PRDT_MGR
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.product_mgr (
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
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    base_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BASE_DT
    bend_date                      CHAR(8)                        NOT NULL  ,  -- [LEGACY] BEND_DT
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    remarks                        TEXT                                     ,  -- [LEGACY] REMARKS
    ix_tbs_prdt_mgr__base_date     TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_MGR__BASE_DT
    ix_tbs_prdt_mgr__bend_date     TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_MGR__BEND_DT
    ix_tbs_prdt_mgr__empy_code     TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_MGR__EMPY_CD
    ix_tbs_prdt_mgr__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_MGR__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.product_mgr
IS '레거시 테이블 TBS_PRDT_MGR에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_product_mgr__is_deleted
    ON adm.product_mgr (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.products
-- 액션: 컬럼 추가 (51개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.products.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.products.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] PRDT_CD (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_code CHAR(14) NOT NULL;

COMMENT ON COLUMN adm.products.prdt_code
IS '레거시 컬럼: PRDT_CD';

-- [MIGRATED FROM LEGACY] PRDT_NM (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_name VARCHAR(200) NOT NULL;

COMMENT ON COLUMN adm.products.prdt_name
IS '레거시 컬럼: PRDT_NM';

-- [MIGRATED FROM LEGACY] PRDT_NO (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_number CHAR(5) ;

COMMENT ON COLUMN adm.products.prdt_number
IS '레거시 컬럼: PRDT_NO';

-- [MIGRATED FROM LEGACY] PRDT_TP (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_type CHAR(2) ;

COMMENT ON COLUMN adm.products.prdt_type
IS '레거시 컬럼: PRDT_TP';

-- [MIGRATED FROM LEGACY] CTGR_CD (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ctgr_code CHAR(10) ;

COMMENT ON COLUMN adm.products.ctgr_code
IS '레거시 컬럼: CTGR_CD';

-- [MIGRATED FROM LEGACY] EMPY_CD (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS empy_code CHAR(10) ;

COMMENT ON COLUMN adm.products.empy_code
IS '레거시 컬럼: EMPY_CD';

-- [MIGRATED FROM LEGACY] PRDT_STD_CD (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_std_code CHAR(14) ;

COMMENT ON COLUMN adm.products.prdt_std_code
IS '레거시 컬럼: PRDT_STD_CD';

-- [MIGRATED FROM LEGACY] PRDT_VND_CD (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_vnd_code VARCHAR(100) ;

COMMENT ON COLUMN adm.products.prdt_vnd_code
IS '레거시 컬럼: PRDT_VND_CD';

-- [MIGRATED FROM LEGACY] PRDT_BAR_CD (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_bar_code VARCHAR(50) ;

COMMENT ON COLUMN adm.products.prdt_bar_code
IS '레거시 컬럼: PRDT_BAR_CD';

-- [MIGRATED FROM LEGACY] PRDT_3PL_CD (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_3pl_code VARCHAR(20) ;

COMMENT ON COLUMN adm.products.prdt_3pl_code
IS '레거시 컬럼: PRDT_3PL_CD';

-- [MIGRATED FROM LEGACY] PRDT_CUST_TP (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_cust_type CHAR(1) ;

COMMENT ON COLUMN adm.products.prdt_cust_type
IS '레거시 컬럼: PRDT_CUST_TP';

-- [MIGRATED FROM LEGACY] PRDT_SALE_TP (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_sale_type CHAR(4) ;

COMMENT ON COLUMN adm.products.prdt_sale_type
IS '레거시 컬럼: PRDT_SALE_TP';

-- [MIGRATED FROM LEGACY] PRDT_CUST_CD (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_cust_code VARCHAR(50) ;

COMMENT ON COLUMN adm.products.prdt_cust_code
IS '레거시 컬럼: PRDT_CUST_CD';

-- [MIGRATED FROM LEGACY] PRDT_CUST_NM (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_cust_name VARCHAR(100) ;

COMMENT ON COLUMN adm.products.prdt_cust_name
IS '레거시 컬럼: PRDT_CUST_NM';

-- [MIGRATED FROM LEGACY] FREE_TAX_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS free_tax_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.free_tax_flag
IS '레거시 컬럼: FREE_TAX_YN';

-- [MIGRATED FROM LEGACY] BIGDEAL_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS bigdeal_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.bigdeal_flag
IS '레거시 컬럼: BIGDEAL_YN';

-- [MIGRATED FROM LEGACY] BARCODE_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS barcode_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.barcode_flag
IS '레거시 컬럼: BARCODE_YN';

-- [MIGRATED FROM LEGACY] CHECKNO_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS checkno_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.checkno_flag
IS '레거시 컬럼: CHECKNO_YN';

-- [MIGRATED FROM LEGACY] PRDT_SN_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS prdt_sn_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.prdt_sn_flag
IS '레거시 컬럼: PRDT_SN_YN';

-- [MIGRATED FROM LEGACY] INV_MNG_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS inv_mng_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.inv_mng_flag
IS '레거시 컬럼: INV_MNG_YN';

-- [MIGRATED FROM LEGACY] STD_SALE_PR (decimal)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS std_sale_pr NUMERIC(17, 2) ;

COMMENT ON COLUMN adm.products.std_sale_pr
IS '레거시 컬럼: STD_SALE_PR';

-- [MIGRATED FROM LEGACY] MIN_SALE_PR (decimal)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS min_sale_pr NUMERIC(17, 2) ;

COMMENT ON COLUMN adm.products.min_sale_pr
IS '레거시 컬럼: MIN_SALE_PR';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS is_active CHAR(1) ;

COMMENT ON COLUMN adm.products.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] EOP_YN (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS eop_flag CHAR(1) ;

COMMENT ON COLUMN adm.products.eop_flag
IS '레거시 컬럼: EOP_YN';

-- [MIGRATED FROM LEGACY] EOP_DT (char)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS eop_date CHAR(8) ;

COMMENT ON COLUMN adm.products.eop_date
IS '레거시 컬럼: EOP_DT';

-- [MIGRATED FROM LEGACY] EOP_PROC_ON (datetime)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS eop_proc_on TIMESTAMP WITH TIME ZONE ;

COMMENT ON COLUMN adm.products.eop_proc_on
IS '레거시 컬럼: EOP_PROC_ON';

-- [MIGRATED FROM LEGACY] EOP_PROC_BY (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS eop_proc_by VARCHAR(50) ;

COMMENT ON COLUMN adm.products.eop_proc_by
IS '레거시 컬럼: EOP_PROC_BY';

-- [MIGRATED FROM LEGACY] CUST_T2_NM (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS cust_t2_name VARCHAR(200) ;

COMMENT ON COLUMN adm.products.cust_t2_name
IS '레거시 컬럼: CUST_T2_NM';

-- [MIGRATED FROM LEGACY] PURC_ORD_EMPY_CD (varchar)
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS purc_ord_empy_code VARCHAR(20) ;

COMMENT ON COLUMN adm.products.purc_ord_empy_code
IS '레거시 컬럼: PURC_ORD_EMPY_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__BARCODE_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__barcode_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__barcode_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__BARCODE_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__BIGDEAL_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__bigdeal_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__bigdeal_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__BIGDEAL_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__CHECKNO_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__checkno_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__checkno_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__CHECKNO_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__CTGR_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__ctgr_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__ctgr_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__CTGR_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__EMPY_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__empy_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__empy_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__EMPY_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__EOP_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__eop_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__eop_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__EOP_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__FREE_TAX_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__free_tax_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__free_tax_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__FREE_TAX_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__INV_MNG_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__inv_mng_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__inv_mng_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__INV_MNG_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__ITEM_TP ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__item_type TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__item_type
IS '레거시 컬럼: IX_TBS_PRDT_MST__ITEM_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__MODEL_NM ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__model_name TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__model_name
IS '레거시 컬럼: IX_TBS_PRDT_MST__MODEL_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_BAR_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_bar_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_bar_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_BAR_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_CUST_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_cust_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_cust_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_CUST_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_CUST_NM ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_cust_name TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_cust_name
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_CUST_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_NM ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_name TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_name
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_NO ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_number TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_number
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_NO';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_SN_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_sn_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_sn_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_SN_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_STD_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_std_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_std_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_STD_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_TP ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_type TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_type
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_TP';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__PRDT_VND_CD ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__prdt_vnd_code TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__prdt_vnd_code
IS '레거시 컬럼: IX_TBS_PRDT_MST__PRDT_VND_CD';

-- [MIGRATED FROM LEGACY] IX_TBS_PRDT_MST__USE_YN ()
ALTER TABLE adm.products
ADD COLUMN IF NOT EXISTS ix_tbs_prdt_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.products.ix_tbs_prdt_mst__use_flag
IS '레거시 컬럼: IX_TBS_PRDT_MST__USE_YN';


-- ============================================================================
-- 신규 테이블: adm.product_mst_history
-- 레거시: TBS_PRDT_MST_HIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.product_mst_history (
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
    prdt_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] PRDT_CD
    prdt_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] PRDT_NM
    prdt_number                    CHAR(5)                                  ,  -- [LEGACY] PRDT_NO
    prdt_type                      CHAR(2)                                  ,  -- [LEGACY] PRDT_TP
    item_type                      CHAR(4)                                  ,  -- [LEGACY] ITEM_TP
    makr_id                        INTEGER                                  ,  -- [LEGACY] MAKR_ID
    brnd_id                        INTEGER                                  ,  -- [LEGACY] BRND_ID
    ctgr_code                      CHAR(10)                                 ,  -- [LEGACY] CTGR_CD
    empy_code                      CHAR(10)                                 ,  -- [LEGACY] EMPY_CD
    model_name                     VARCHAR(100)                             ,  -- [LEGACY] MODEL_NM
    prdt_std_code                  CHAR(14)                                 ,  -- [LEGACY] PRDT_STD_CD
    prdt_vnd_code                  VARCHAR(100)                             ,  -- [LEGACY] PRDT_VND_CD
    prdt_bar_code                  VARCHAR(50)                              ,  -- [LEGACY] PRDT_BAR_CD
    prdt_3pl_code                  VARCHAR(20)                              ,  -- [LEGACY] PRDT_3PL_CD
    prdt_cust_type                 CHAR(1)                                  ,  -- [LEGACY] PRDT_CUST_TP
    prdt_sale_type                 CHAR(4)                                  ,  -- [LEGACY] PRDT_SALE_TP
    prdt_cust_code                 VARCHAR(50)                              ,  -- [LEGACY] PRDT_CUST_CD
    prdt_cust_name                 VARCHAR(100)                             ,  -- [LEGACY] PRDT_CUST_NM
    free_tax_flag                  CHAR(1)                                  ,  -- [LEGACY] FREE_TAX_YN
    prdt_cto_id                    VARCHAR(50)                              ,  -- [LEGACY] PRDT_CTO_ID
    eclipse_id                     VARCHAR(20)                              ,  -- [LEGACY] ECLIPSE_ID
    procure_id                     VARCHAR(20)                              ,  -- [LEGACY] PROCURE_ID
    bigdeal_flag                   CHAR(1)                                  ,  -- [LEGACY] BIGDEAL_YN
    barcode_flag                   CHAR(1)                                  ,  -- [LEGACY] BARCODE_YN
    checkno_flag                   CHAR(1)                                  ,  -- [LEGACY] CHECKNO_YN
    prdt_sn_flag                   CHAR(1)                                  ,  -- [LEGACY] PRDT_SN_YN
    inv_mng_flag                   CHAR(1)                                  ,  -- [LEGACY] INV_MNG_YN
    std_sale_pr                    NUMERIC(17, 2)                           ,  -- [LEGACY] STD_SALE_PR
    min_sale_pr                    NUMERIC(17, 2)                           ,  -- [LEGACY] MIN_SALE_PR
    image_url                      VARCHAR(200)                             ,  -- [LEGACY] IMAGE_URL
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    is_active                      CHAR(1)                                  ,  -- [LEGACY] USE_YN
    eop_flag                       CHAR(1)                                  ,  -- [LEGACY] EOP_YN
    eop_date                       CHAR(8)                                  ,  -- [LEGACY] EOP_DT
    eop_proc_on                    TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] EOP_PROC_ON
    eop_proc_by                    VARCHAR(50)                              ,  -- [LEGACY] EOP_PROC_BY
    eop_proc_id                    INTEGER                                  ,  -- [LEGACY] EOP_PROC_ID
    cust_t2_name                   VARCHAR(200)                             ,  -- [LEGACY] CUST_T2_NM
    purc_ord_empy_code             VARCHAR(20)                              ,  -- [LEGACY] PURC_ORD_EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.product_mst_history
IS '레거시 테이블 TBS_PRDT_MST_HIST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_product_mst_history__is_deleted
    ON adm.product_mst_history (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.product_sno
-- 레거시: TBS_PRDT_SNO
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.product_sno (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    ix_tbs_prdt_sno__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_SNO__PRDT_CD
    ix_tbs_prdt_sno__prdt_id       TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_SNO__PRDT_ID
    ix_tbs_prdt_sno__prdt_sn       TEXT                                     ,  -- [LEGACY] IX_TBS_PRDT_SNO__PRDT_SN
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.product_sno
IS '레거시 테이블 TBS_PRDT_SNO에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_product_sno__is_deleted
    ON adm.product_sno (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.vendors
-- 레거시: TBS_VNDR_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.vendors (
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_at          TIMESTAMP WITH TIME ZONE,
    updated_by          UUID,
    
    -- 비즈니스 컬럼 (레거시에서 마이그레이션)
    created_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] CREATE_ON
    created_by                     INTEGER                                  ,  -- [LEGACY] CREATE_ID
    created_by_name                VARCHAR(100)                             ,  -- [LEGACY] CREATE_BY
    updated_at                     TIMESTAMP WITH TIME ZONE                 ,  -- [LEGACY] UPDATE_ON
    updated_by                     INTEGER                                  ,  -- [LEGACY] UPDATE_ID
    updated_by_name                VARCHAR(100)                             ,  -- [LEGACY] UPDATE_BY
    vndr_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] VNDR_CD
    vndr_name                      VARCHAR(200)                   NOT NULL  ,  -- [LEGACY] VNDR_NM
    sort_order                     INTEGER                                  ,  -- [LEGACY] SORT_SEQ
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_vndr_mst__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_VNDR_MST__USE_YN
    ix_tbs_vndr_mst__vndr_code     TEXT                                     ,  -- [LEGACY] IX_TBS_VNDR_MST__VNDR_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.vendors
IS '레거시 테이블 TBS_VNDR_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_vendors__is_deleted
    ON adm.vendors (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: adm.warehouse_emp
-- 레거시: TBS_WHSE_EMP
-- ============================================================================

CREATE TABLE IF NOT EXISTS adm.warehouse_emp (
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
    whse_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] WHSE_ID
    empy_id                        INTEGER                        NOT NULL  ,  -- [LEGACY] EMPY_ID
    is_active                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] USE_YN
    noti_rcv_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] NOTI_RCV_YN
    noti_out_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] NOTI_OUT_YN
    noti_ccl_flag                  CHAR(1)                        NOT NULL  ,  -- [LEGACY] NOTI_CCL_YN
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tbs_whse_emp__empy_id       TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__EMPY_ID
    ix_tbs_whse_emp__numberti_ccl_flag TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__NOTI_CCL_YN
    ix_tbs_whse_emp__numberti_out_flag TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__NOTI_OUT_YN
    ix_tbs_whse_emp__numberti_rcv_flag TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__NOTI_RCV_YN
    ix_tbs_whse_emp__use_flag      TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__USE_YN
    ix_tbs_whse_emp__whse_id       TEXT                                     ,  -- [LEGACY] IX_TBS_WHSE_EMP__WHSE_ID
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE adm.warehouse_emp
IS '레거시 테이블 TBS_WHSE_EMP에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_warehouse_emp__is_deleted
    ON adm.warehouse_emp (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 테이블: adm.warehouses
-- 액션: 컬럼 추가 (9개)
-- ============================================================================

-- [MIGRATED FROM LEGACY] CREATE_BY (varchar)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.warehouses.created_by_name
IS '레거시 컬럼: CREATE_BY';

-- [MIGRATED FROM LEGACY] UPDATE_BY (varchar)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(50) ;

COMMENT ON COLUMN adm.warehouses.updated_by_name
IS '레거시 컬럼: UPDATE_BY';

-- [MIGRATED FROM LEGACY] WHSE_CD (char)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS whse_code CHAR(10) NOT NULL;

COMMENT ON COLUMN adm.warehouses.whse_code
IS '레거시 컬럼: WHSE_CD';

-- [MIGRATED FROM LEGACY] WHSE_NM (varchar)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS whse_name VARCHAR(50) NOT NULL;

COMMENT ON COLUMN adm.warehouses.whse_name
IS '레거시 컬럼: WHSE_NM';

-- [MIGRATED FROM LEGACY] WHSE_TP (char)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS whse_type CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.warehouses.whse_type
IS '레거시 컬럼: WHSE_TP';

-- [MIGRATED FROM LEGACY] USE_YN (char)
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS is_active CHAR(1) NOT NULL;

COMMENT ON COLUMN adm.warehouses.is_active
IS '레거시 컬럼: USE_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_WHSE_MST__USE_YN ()
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS ix_tbs_whse_mst__use_flag TEXT ;

COMMENT ON COLUMN adm.warehouses.ix_tbs_whse_mst__use_flag
IS '레거시 컬럼: IX_TBS_WHSE_MST__USE_YN';

-- [MIGRATED FROM LEGACY] IX_TBS_WHSE_MST__WHSE_NM ()
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS ix_tbs_whse_mst__whse_name TEXT ;

COMMENT ON COLUMN adm.warehouses.ix_tbs_whse_mst__whse_name
IS '레거시 컬럼: IX_TBS_WHSE_MST__WHSE_NM';

-- [MIGRATED FROM LEGACY] IX_TBS_WHSE_MST__WHSE_TP ()
ALTER TABLE adm.warehouses
ADD COLUMN IF NOT EXISTS ix_tbs_whse_mst__whse_type TEXT ;

COMMENT ON COLUMN adm.warehouses.ix_tbs_whse_mst__whse_type
IS '레거시 컬럼: IX_TBS_WHSE_MST__WHSE_TP';


