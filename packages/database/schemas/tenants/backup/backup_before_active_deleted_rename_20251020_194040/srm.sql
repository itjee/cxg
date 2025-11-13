-- ============================================================================
-- Sales & Revenue Management Schema (srm)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS srm;
COMMENT ON SCHEMA srm IS 'SRM: 판매/영업 관리 스키마';

-- 견적서
CREATE TABLE IF NOT EXISTS srm.quotations (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    quote_code              VARCHAR(50)              NOT NULL,
    customer_id             UUID                     NOT NULL,
    doc_date                DATE                     NOT NULL,
    valid_until             DATE,
    sales_person_id         UUID,
    total_amount            NUMERIC(18,4)            DEFAULT 0,
    currency                VARCHAR(3)               DEFAULT 'KRW',
    status                  VARCHAR(20)              DEFAULT 'DRAFT',
    deleted                 BOOLEAN                  DEFAULT false,
    CONSTRAINT ck_quotations__status CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'))
);
-- 견적서 라인
CREATE TABLE IF NOT EXISTS srm.quotation_lines (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    quote_id                UUID                     NOT NULL,
    line_no                 INTEGER                  NOT NULL,
    product_id                 UUID                     NOT NULL,
    description             TEXT,
    qty                     INTEGER                  NOT NULL,
    unit_price              NUMERIC(18,4)            NOT NULL,
    discount_rate           NUMERIC(5,2)             DEFAULT 0,
    total_amount            NUMERIC(18,4)            NOT NULL,
    CONSTRAINT ck_quotation_lines__qty CHECK (qty > 0)
);

-- 판매주문
CREATE TABLE IF NOT EXISTS srm.sales_orders (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    so_code                 VARCHAR(50)              NOT NULL,
    customer_id             UUID                     NOT NULL,
    doc_date                DATE                     NOT NULL,
    delivery_date           DATE,
    warehouse_id            UUID,
    sales_person_id         UUID,
    payment_terms           VARCHAR(20),
    total_amount            NUMERIC(18,4)            DEFAULT 0,
    currency                VARCHAR(3)               DEFAULT 'KRW',
    status                  VARCHAR(20)              DEFAULT 'DRAFT',
    deleted                 BOOLEAN                  DEFAULT false,
    CONSTRAINT ck_sales_orders__status CHECK (status IN ('DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'))
);
-- 판매주문 라인
CREATE TABLE IF NOT EXISTS srm.sales_order_lines (
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              UUID,
    updated_at              TIMESTAMP WITH TIME ZONE,
    updated_by              UUID,
    so_id                   UUID                     NOT NULL,
    line_no                 INTEGER                  NOT NULL,
    product_id                 UUID                     NOT NULL,
    description             TEXT,
    qty                     INTEGER                  NOT NULL,
    unit_price              NUMERIC(18,4)            NOT NULL,
    discount_rate           NUMERIC(5,2)             DEFAULT 0,
    total_amount            NUMERIC(18,4)            NOT NULL,
    shipped_qty             INTEGER                  DEFAULT 0,
    CONSTRAINT ck_sales_order_lines__qty CHECK (qty > 0)
);

COMMENT ON TABLE srm.quotations IS '판매 견적서 관리 테이블';
COMMENT ON TABLE srm.quotation_lines IS '견적 상세 라인 테이블';
COMMENT ON TABLE srm.sales_orders IS '판매 주문 관리 테이블';
COMMENT ON TABLE srm.sales_order_lines IS '판매주문 상세 라인 테이블';


CREATE INDEX IF NOT EXISTS ix_quotation_lines__quote_id ON srm.quotation_lines (quote_id);

CREATE INDEX IF NOT EXISTS ix_sales_order_lines__so_id ON srm.sales_order_lines (so_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_quotations__quote_code ON srm.quotations (quote_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_quotation_lines__quote_line ON srm.quotation_lines (quote_id, line_no);
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_orders__so_code ON srm.sales_orders (so_code) WHERE deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS ux_sales_order_lines__so_line ON srm.sales_order_lines (so_id, line_no);

ALTER TABLE srm.quotation_lines ADD CONSTRAINT fk_quotation_lines__quote_id FOREIGN KEY (quote_id) REFERENCES srm.quotations(id) ON DELETE CASCADE;
ALTER TABLE srm.sales_order_lines ADD CONSTRAINT fk_sales_order_lines__so_id FOREIGN KEY (so_id) REFERENCES srm.sales_orders(id) ON DELETE CASCADE;
