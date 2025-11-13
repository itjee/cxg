-- ============================================================================
-- Procurement & Supply Management Schema (psm)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS psm;
COMMENT ON SCHEMA psm IS 'PSM: 구매/조달 관리 스키마';

-- 구매요청
CREATE TABLE IF NOT EXISTS psm.purchase_requisitions (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    tenant_id               UUID                     NOT NULL,
    company_id              UUID                     NOT NULL,
    pr_code                 VARCHAR(50)              NOT NULL,
    doc_date                DATE                     NOT NULL,
    requester_id            UUID                     NOT NULL,
    department_id           UUID,
    required_date           DATE,
    purpose                 TEXT,
    total_amount            NUMERIC(18,4)            DEFAULT 0,
    currency                VARCHAR(3)               DEFAULT 'KRW',
    status                  VARCHAR(20)              DEFAULT 'DRAFT',
    approved_at             TIMESTAMP WITH TIME ZONE,
    approved_by             UUID,
    deleted                 BOOLEAN                  DEFAULT false,
    CONSTRAINT ck_purchase_requisitions__status CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ORDERED'))
);

-- 구매요청 라인
CREATE TABLE IF NOT EXISTS psm.purchase_requisition_lines (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    pr_id                   UUID                     NOT NULL,
    line_no                 INTEGER                  NOT NULL,
    item_id                 UUID                     NOT NULL,
    description             TEXT,
    qty                     INTEGER                  NOT NULL,
    unit_price              NUMERIC(18,4)            DEFAULT 0,
    total_amount            NUMERIC(18,4)            DEFAULT 0,
    required_date           DATE,
    CONSTRAINT ck_purchase_requisition_lines__qty CHECK (qty > 0)
);

-- 구매발주
CREATE TABLE IF NOT EXISTS psm.purchase_orders (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    tenant_id               UUID                     NOT NULL,
    company_id              UUID                     NOT NULL,
    po_code                 VARCHAR(50)              NOT NULL,
    vendor_id               UUID                     NOT NULL,
    doc_date                DATE                     NOT NULL,
    delivery_date           DATE,
    warehouse_id            UUID,
    payment_terms           VARCHAR(20),
    total_amount            NUMERIC(18,4)            DEFAULT 0,
    currency                VARCHAR(3)               DEFAULT 'KRW',
    status                  VARCHAR(20)              DEFAULT 'DRAFT',
    approved_at             TIMESTAMP WITH TIME ZONE,
    approved_by             UUID,
    deleted                 BOOLEAN                  DEFAULT false,
    CONSTRAINT ck_purchase_orders__status CHECK (status IN ('DRAFT', 'APPROVED', 'ORDERED', 'RECEIVING', 'COMPLETED', 'CANCELLED'))
);

-- 구매발주 라인
CREATE TABLE IF NOT EXISTS psm.purchase_order_lines (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    po_id                   UUID                     NOT NULL,
    line_no                 INTEGER                  NOT NULL,
    item_id                 UUID                     NOT NULL,
    description             TEXT,
    qty                     INTEGER                  NOT NULL,
    unit_price              NUMERIC(18,4)            NOT NULL,
    total_amount            NUMERIC(18,4)            NOT NULL,
    received_qty            INTEGER                  DEFAULT 0,
    CONSTRAINT ck_purchase_order_lines__qty CHECK (qty > 0)
);

COMMENT ON TABLE psm.purchase_requisitions IS '구매 요청 관리 테이블';
COMMENT ON TABLE psm.purchase_requisition_lines IS '구매요청 상세 라인 테이블';
COMMENT ON TABLE psm.purchase_orders IS '구매 발주 관리 테이블';
COMMENT ON TABLE psm.purchase_order_lines IS '구매발주 상세 라인 테이블';

CREATE INDEX IF NOT EXISTS ix_purchase_requisitions__company_id ON psm.purchase_requisitions (company_id) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_purchase_requisition_lines__pr_id ON psm.purchase_requisition_lines (pr_id);
CREATE INDEX IF NOT EXISTS ix_purchase_orders__company_id ON psm.purchase_orders (company_id) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS ix_purchase_order_lines__po_id ON psm.purchase_order_lines (po_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisitions__company_code ON psm.purchase_requisitions (company_id, pr_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_requisition_lines__pr_line ON psm.purchase_requisition_lines (pr_id, line_no);
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_orders__company_code ON psm.purchase_orders (company_id, po_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_purchase_order_lines__po_line ON psm.purchase_order_lines (po_id, line_no);

ALTER TABLE psm.purchase_requisition_lines ADD CONSTRAINT fk_purchase_requisition_lines__pr_id FOREIGN KEY (pr_id) REFERENCES psm.purchase_requisitions(id) ON DELETE CASCADE;
ALTER TABLE psm.purchase_order_lines ADD CONSTRAINT fk_purchase_order_lines__po_id FOREIGN KEY (po_id) REFERENCES psm.purchase_orders(id) ON DELETE CASCADE;
