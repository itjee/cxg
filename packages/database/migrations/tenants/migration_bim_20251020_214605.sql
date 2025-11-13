-- ============================================================================
-- 레거시 테이블 마이그레이션 스크립트
-- Schema: bim
-- Generated: 2025-10-20 21:46:05
-- ============================================================================

-- ============================================================================
-- 신규 테이블: bim.cost_day
-- 레거시: TCO_COST_DAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.cost_day (
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
    base_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] BASE_QTY
    base_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_AMT
    base_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    make_qty                       INTEGER                                  ,  -- [LEGACY] MAKE_QTY
    make_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] MAKE_AMT
    make_pr                        NUMERIC(17, 2)                           ,  -- [LEGACY] MAKE_PR
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    sale_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PR
    cost_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] COST_QTY
    cost_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_AMT
    cost_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_PR
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_cost_day__base_date     TEXT                                     ,  -- [LEGACY] IX_TCO_COST_DAY__BASE_DT
    ix_tco_cost_day__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TCO_COST_DAY__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.cost_day
IS '레거시 테이블 TCO_COST_DAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_cost_day__is_deleted
    ON bim.cost_day (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.cost_ext
-- 레거시: TCO_COST_EXT
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.cost_ext (
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
    cost_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_PR
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_cost_ext__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_COST_EXT__BASE_YM
    ix_tco_cost_ext__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TCO_COST_EXT__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.cost_ext
IS '레거시 테이블 TCO_COST_EXT에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_cost_ext__is_deleted
    ON bim.cost_ext (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.cost_mon
-- 레거시: TCO_COST_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.cost_mon (
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
    base_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] BASE_QTY
    base_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_AMT
    base_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] BASE_PR
    purc_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] PURC_QTY
    purc_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_AMT
    purc_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_PR
    make_qty                       INTEGER                                  ,  -- [LEGACY] MAKE_QTY
    make_amt                       NUMERIC(17, 2)                           ,  -- [LEGACY] MAKE_AMT
    make_pr                        NUMERIC(17, 2)                           ,  -- [LEGACY] MAKE_PR
    sale_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] SALE_QTY
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    sale_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PR
    cost_qty                       INTEGER                        NOT NULL  ,  -- [LEGACY] COST_QTY
    cost_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_AMT
    cost_pr                        NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_PR
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_cost_mon__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_COST_MON__BASE_YM
    ix_tco_cost_mon__prdt_code     TEXT                                     ,  -- [LEGACY] IX_TCO_COST_MON__PRDT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.cost_mon
IS '레거시 테이블 TCO_COST_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_cost_mon__is_deleted
    ON bim.cost_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.nspf_mon
-- 레거시: TCO_NSPF_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.nspf_mon (
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
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    cost_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_AMT
    prft_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRFT_AMT
    rebt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_AMT
    expv_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPV_AMT
    tspf_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TSPF_AMT
    expd_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPD_AMT
    expi_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPI_AMT
    nspf_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NSPF_AMT
    ix_tco_nspf_mon__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_NSPF_MON__BASE_YM
    ix_tco_nspf_mon__dept_code     TEXT                                     ,  -- [LEGACY] IX_TCO_NSPF_MON__DEPT_CD
    ix_tco_nspf_mon__empy_code     TEXT                                     ,  -- [LEGACY] IX_TCO_NSPF_MON__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.nspf_mon
IS '레거시 테이블 TCO_NSPF_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_nspf_mon__is_deleted
    ON bim.nspf_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.plan_purc
-- 레거시: TCO_PLAN_PURC
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.plan_purc (
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
    plan_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] PLAN_YM
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    plan_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PLAN_AMT
    ix_tco_plan_purc__dept_code    TEXT                                     ,  -- [LEGACY] IX_TCO_PLAN_PURC__DEPT_CD
    ix_tco_plan_purc__empy_code    TEXT                                     ,  -- [LEGACY] IX_TCO_PLAN_PURC__EMPY_CD
    ix_tco_plan_purc__plan_ym      TEXT                                     ,  -- [LEGACY] IX_TCO_PLAN_PURC__PLAN_YM
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.plan_purc
IS '레거시 테이블 TCO_PLAN_PURC에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_plan_purc__is_deleted
    ON bim.plan_purc (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.plan_purc_mon
-- 레거시: TCO_PLAN_PURC_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.plan_purc_mon (
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
    plan_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] PLAN_YM
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    cost_rat                       NUMERIC(17, 5)                 NOT NULL  ,  -- [LEGACY] COST_RAT
    plan_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PLAN_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_plan_purc_mon__dept_code    TEXT                                     ,  -- [LEGACY] IX_PLAN_PURC_MON__DEPT_CD
    ix_plan_purc_mon__empy_number  TEXT                                     ,  -- [LEGACY] IX_PLAN_PURC_MON__EMPY_NO
    ix_plan_purc_mon__plan_ym      TEXT                                     ,  -- [LEGACY] IX_PLAN_PURC_MON__PLAN_YM
    ix_plan_purc_mon__prdt_anl_code TEXT                                     ,  -- [LEGACY] IX_PLAN_PURC_MON__PRDT_ANL_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.plan_purc_mon
IS '레거시 테이블 TCO_PLAN_PURC_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_plan_purc_mon__is_deleted
    ON bim.plan_purc_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.plan_sale
-- 레거시: TCO_PLAN_SALE
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.plan_sale (
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
    plan_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] PLAN_YM
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    sale_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_AMT
    cost_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] COST_AMT
    prft_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PRFT_AMT
    inct_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INCT_AMT
    tspf_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TSPF_AMT
    dexp_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] DEXP_AMT
    cexp_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] CEXP_AMT
    nspf_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NSPF_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_plan_sale__dept_code        TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE__DEPT_CD
    ix_plan_sale__empy_code        TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE__EMPY_CD
    ix_plan_sale__plan_ym          TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE__PLAN_YM
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.plan_sale
IS '레거시 테이블 TCO_PLAN_SALE에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_plan_sale__is_deleted
    ON bim.plan_sale (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.plan_sale_mon
-- 레거시: TCO_PLAN_SALE_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.plan_sale_mon (
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
    plan_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] PLAN_YM
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    cust_code                      CHAR(14)                       NOT NULL  ,  -- [LEGACY] CUST_CD
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    plan_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PLAN_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_plan_sale_mon__ctgr_code    TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE_MON__CTGR_CD
    ix_plan_sale_mon__cust_code    TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE_MON__CUST_CD
    ix_plan_sale_mon__dept_code    TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE_MON__DEPT_CD
    ix_plan_sale_mon__empy_code    TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE_MON__EMPY_CD
    ix_plan_sale_mon__plan_ym      TEXT                                     ,  -- [LEGACY] IX_PLAN_SALE_MON__PLAN_YM
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.plan_sale_mon
IS '레거시 테이블 TCO_PLAN_SALE_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_plan_sale_mon__is_deleted
    ON bim.plan_sale_mon (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.rebts
-- 레거시: TCO_REBT_MST
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.rebts (
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
    rebt_number                    CHAR(14)                       NOT NULL  ,  -- [LEGACY] REBT_NO
    rebt_ym                        CHAR(6)                        NOT NULL  ,  -- [LEGACY] REBT_YM
    vndr_code                      CHAR(3)                        NOT NULL  ,  -- [LEGACY] VNDR_CD
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    rebt_type                      CHAR(1)                        NOT NULL  ,  -- [LEGACY] REBT_TP
    rebt_amt                       NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_AMT
    prmt_type                      CHAR(4)                                  ,  -- [LEGACY] PRMT_TP
    st_prmt_date                   CHAR(8)                                  ,  -- [LEGACY] ST_PRMT_DT
    ed_prmt_date                   CHAR(8)                                  ,  -- [LEGACY] ED_PRMT_DT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_rebt_mst__ctgr_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__CTGR_CD
    ix_tco_rebt_mst__ed_prmt_date  TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__ED_PRMT_DT
    ix_tco_rebt_mst__empy_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__EMPY_CD
    ix_tco_rebt_mst__prmt_type     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__PRMT_TP
    ix_tco_rebt_mst__rebt_number   TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__REBT_NO
    ix_tco_rebt_mst__rebt_type     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__REBT_TP
    ix_tco_rebt_mst__rebt_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__REBT_YM
    ix_tco_rebt_mst__st_prmt_date  TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__ST_PRMT_DT
    ix_tco_rebt_mst__vndr_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_MST__VNDR_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.rebts
IS '레거시 테이블 TCO_REBT_MST에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rebts__is_deleted
    ON bim.rebts (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.rebt_pay
-- 레거시: TCO_REBT_PAY
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.rebt_pay (
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
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    rebt_vnd_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_VND_AMT
    rebt_gen_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_GEN_AMT
    rebt_pay_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_PAY_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_rebt_pay__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_PAY__BASE_YM
    ix_tco_rebt_pay__ctgr_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_PAY__CTGR_CD
    ix_tco_rebt_pay__dept_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_PAY__DEPT_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.rebt_pay
IS '레거시 테이블 TCO_REBT_PAY에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rebt_pay__is_deleted
    ON bim.rebt_pay (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.rebt_rcv
-- 레거시: TCO_REBT_RCV
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.rebt_rcv (
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
    rebt_mst_id                    INTEGER                        NOT NULL  ,  -- [LEGACY] REBT_MST_ID
    rebt_rcv_ym                    CHAR(6)                        NOT NULL  ,  -- [LEGACY] REBT_RCV_YM
    rebt_rcv_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] REBT_RCV_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_rebt_rcv__rebt_mst_id   TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_RCV__REBT_MST_ID
    ix_tco_rebt_rcv__rebt_rcv_ym   TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_RCV__REBT_RCV_YM
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.rebt_rcv
IS '레거시 테이블 TCO_REBT_RCV에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rebt_rcv__is_deleted
    ON bim.rebt_rcv (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.rebt_summaries
-- 레거시: TCO_REBT_SUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.rebt_summaries (
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
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    nrcv_bas_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NRCV_BAS_AMT
    nrcv_rcv_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NRCV_RCV_AMT
    nrcv_occ_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NRCV_OCC_AMT
    nrcv_rem_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NRCV_REM_AMT
    yrcv_occ_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] YRCV_OCC_AMT
    trcv_occ_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TRCV_OCC_AMT
    purc_dct_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_DCT_AMT
    purc_adj_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_ADJ_AMT
    purc_fex_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_FEX_AMT
    stck_acc_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] STCK_ACC_AMT
    make_trn_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] MAKE_TRN_AMT
    othr_adj_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] OTHR_ADJ_AMT
    npay_bas_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_BAS_AMT
    npay_occ_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_OCC_AMT
    npay_use_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_USE_AMT
    npay_rem_amt                   NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_REM_AMT
    description                    TEXT                                     ,  -- [LEGACY] NOTES
    ix_tco_rebt_sum__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_SUM__BASE_YM
    ix_tco_rebt_sum__ctgr_code     TEXT                                     ,  -- [LEGACY] IX_TCO_REBT_SUM__CTGR_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.rebt_summaries
IS '레거시 테이블 TCO_REBT_SUM에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_rebt_summaries__is_deleted
    ON bim.rebt_summaries (is_deleted)
 WHERE is_deleted = false;


-- ============================================================================
-- 신규 테이블: bim.vspf_mon
-- 레거시: TCO_VSPF_MON
-- ============================================================================

CREATE TABLE IF NOT EXISTS bim.vspf_mon (
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
    dept_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] DEPT_CD
    empy_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] EMPY_CD
    ctgr_code                      CHAR(10)                       NOT NULL  ,  -- [LEGACY] CTGR_CD
    sale_prdt_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PRDT_AMT
    inct_tsum_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INCT_TSUM_AMT
    inct_nrcv_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INCT_NRCV_AMT
    inct_yrcv_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INCT_YRCV_AMT
    sale_cost_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_COST_AMT
    invt_base_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_BASE_AMT
    invt_purc_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_PURC_AMT
    purc_disc_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_DISC_AMT
    purc_exch_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] PURC_EXCH_AMT
    invt_trns_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_TRNS_AMT
    invt_typeck_amt                NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_TPCK_AMT
    invt_tcto_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_TCTO_AMT
    invt_blnc_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] INVT_BLNC_AMT
    sale_prft_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] SALE_PRFT_AMT
    npay_base_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_BASE_AMT
    nrcv_msum_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NRCV_MSUM_AMT
    npay_blnc_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NPAY_BLNC_AMT
    tspf_rslt_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] TSPF_RSLT_AMT
    expn_rslt_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] EXPN_RSLT_AMT
    nspf_rslt_amt                  NUMERIC(17, 2)                 NOT NULL  ,  -- [LEGACY] NSPF_RSLT_AMT
    ix_tco_vspf_mon__base_ym       TEXT                                     ,  -- [LEGACY] IX_TCO_VSPF_MON__BASE_YM
    ix_tco_vspf_mon__ctgr_code     TEXT                                     ,  -- [LEGACY] IX_TCO_VSPF_MON__CTGR_CD
    ix_tco_vspf_mon__dept_code     TEXT                                     ,  -- [LEGACY] IX_TCO_VSPF_MON__DEPT_CD
    ix_tco_vspf_mon__empy_code     TEXT                                     ,  -- [LEGACY] IX_TCO_VSPF_MON__EMPY_CD
    
    -- 상태 관리
    is_deleted          BOOLEAN                  DEFAULT false
);

COMMENT ON TABLE bim.vspf_mon
IS '레거시 테이블 TCO_VSPF_MON에서 마이그레이션';

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS ix_vspf_mon__is_deleted
    ON bim.vspf_mon (is_deleted)
 WHERE is_deleted = false;


