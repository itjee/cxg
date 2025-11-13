-- ============================================================================
-- Workflow Management Schema (lwm)
-- ============================================================================
-- Description: 워크플로우/결재 관리 (결재선, 결재진행, 결재이력)
-- Database: tnnt_db (Tenant Database)
-- Schema: lwm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS lwm;

COMMENT ON SCHEMA lwm IS 'LWM: 워크플로우/결재 관리 스키마';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- LWM: 물류/창고 관리 (Logistics & WMS)
-- ============================================================================

-- =====================================================================================
-- 테이블: lwm.goods_receipts
-- 설명: 입고 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.goods_receipts 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 입고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gr_code                 VARCHAR(50)              NOT NULL,                                  -- 입고 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    -- 참조 정보
    po_id                   UUID,                                                               -- 구매발주 식별자
    vendor_id               UUID,                                                               -- 공급업체 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    receiver_id             UUID,                                                               -- 입고 담당자 식별자
    
    -- 수량 정보
    total_qty               INTEGER                  DEFAULT 0,                                 -- 총 수량
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_goods_receipts__status            CHECK (status IN ('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT ck_goods_receipts__total_qty         CHECK (total_qty >= 0)
);

-- =====================================================================================
-- 테이블: lwm.goods_receipt_lines
-- 설명: 입고 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.goods_receipt_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 입고 라인 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gr_id                   UUID                     NOT NULL,                                  -- 입고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    po_line_id              UUID,                                                               -- 구매발주 라인 식별자
    product_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    ordered_qty             INTEGER                  DEFAULT 0,                                 -- 발주 수량
    received_qty            INTEGER                  NOT NULL,                                  -- 입고 수량
    rejected_qty            INTEGER                  DEFAULT 0,                                 -- 불량 수량
    
    -- 원가 정보
    unit_cost               NUMERIC(18,4)            DEFAULT 0,                                 -- 단가
    
    -- 제약조건
    CONSTRAINT ck_goods_receipt_lines__line_no      CHECK (line_no > 0),
    CONSTRAINT ck_goods_receipt_lines__quantities   CHECK (ordered_qty >= 0 AND received_qty >= 0 AND rejected_qty >= 0),
    CONSTRAINT ck_goods_receipt_lines__unit_cost    CHECK (unit_cost >= 0)
);

-- =====================================================================================
-- 테이블: lwm.goods_issues
-- 설명: 출고 헤더 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.goods_issues 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_code                 VARCHAR(50)              NOT NULL,                                  -- 출고 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    -- 참조 정보
    so_id                   UUID,                                                               -- 판매주문 식별자
    customer_id             UUID,                                                               -- 고객 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    picker_id               UUID,                                                               -- 피커 식별자
    
    -- 수량 정보
    total_qty               INTEGER                  DEFAULT 0,                                 -- 총 수량
    
    -- 상태 관리
    status                  VARCHAR(20)              DEFAULT 'DRAFT',                           -- 상태
    deleted                 BOOLEAN                  DEFAULT false,                             -- 논리 삭제 플래그
    
    -- 제약조건
    CONSTRAINT ck_goods_issues__status              CHECK (status IN ('DRAFT', 'PICKING', 'PICKED', 'SHIPPED', 'CANCELLED')),
    CONSTRAINT ck_goods_issues__total_qty           CHECK (total_qty >= 0)
);

-- =====================================================================================
-- 테이블: lwm.goods_issue_lines
-- 설명: 출고 라인 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lwm.goods_issue_lines 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 출고 라인 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    gi_id                   UUID                     NOT NULL,                                  -- 출고 헤더 식별자
    line_no                 INTEGER                  NOT NULL,                                  -- 라인 번호
    so_line_id              UUID,                                                               -- 판매주문 라인 식별자
    product_id                 UUID                     NOT NULL,                                  -- 제품 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 정보
    requested_qty           INTEGER                  DEFAULT 0,                                 -- 요청 수량
    picked_qty              INTEGER                  NOT NULL,                                  -- 피킹 수량
    
    -- 제약조건
    CONSTRAINT ck_goods_issue_lines__line_no        CHECK (line_no > 0),
    CONSTRAINT ck_goods_issue_lines__quantities     CHECK (requested_qty >= 0 AND picked_qty >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  lwm.goods_receipts            IS '입고 헤더 관리 테이블';
COMMENT ON TABLE  lwm.goods_receipt_lines       IS '입고 라인 관리 테이블';
COMMENT ON TABLE  lwm.goods_issues              IS '출고 헤더 관리 테이블';
COMMENT ON TABLE  lwm.goods_issue_lines         IS '출고 라인 관리 테이블';

-- =====================================================================================
-- 인덱스
-- =====================================================================================


CREATE INDEX IF NOT EXISTS ix_goods_receipts__gr_code       ON lwm.goods_receipts (gr_code) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_goods_receipts__warehouse_id  ON lwm.goods_receipts (warehouse_id) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_goods_receipts__status        ON lwm.goods_receipts (status) WHERE deleted = false;

CREATE INDEX IF NOT EXISTS ix_goods_receipt_lines__gr_id    ON lwm.goods_receipt_lines (gr_id);
CREATE INDEX IF NOT EXISTS ix_goods_receipt_lines__item_id  ON lwm.goods_receipt_lines (product_id);


CREATE INDEX IF NOT EXISTS ix_goods_issues__gi_code         ON lwm.goods_issues (gi_code) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_goods_issues__warehouse_id    ON lwm.goods_issues (warehouse_id) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_goods_issues__status          ON lwm.goods_issues (status) WHERE deleted = false;

CREATE INDEX IF NOT EXISTS ix_goods_issue_lines__gi_id      ON lwm.goods_issue_lines (gi_id);
CREATE INDEX IF NOT EXISTS ix_goods_issue_lines__item_id    ON lwm.goods_issue_lines (product_id);

-- =====================================================================================
-- 유니크 제약 조건
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_goods_receipts__company_code   ON lwm.goods_receipts (gr_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_goods_receipt_lines__gr_line   ON lwm.goods_receipt_lines (gr_id, line_no);
CREATE UNIQUE INDEX IF NOT EXISTS ux_goods_issues__company_code     ON lwm.goods_issues (gi_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_goods_issue_lines__gi_line     ON lwm.goods_issue_lines (gi_id, line_no);

-- =====================================================================================
-- 외래키 제약 조건
-- =====================================================================================

ALTER TABLE lwm.goods_receipt_lines ADD CONSTRAINT fk_goods_receipt_lines__gr_id
    FOREIGN KEY (gr_id) REFERENCES lwm.goods_receipts(id) ON DELETE CASCADE;

ALTER TABLE lwm.goods_issue_lines ADD CONSTRAINT fk_goods_issue_lines__gi_id
    FOREIGN KEY (gi_id) REFERENCES lwm.goods_issues(id) ON DELETE CASCADE;
