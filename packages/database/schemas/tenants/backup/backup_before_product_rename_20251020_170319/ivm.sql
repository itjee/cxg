-- ============================================================================
-- Inventory Management Schema (ivm)
-- ============================================================================
-- Description: 재고 관리 (입출고, 재고조정, 재고실사)
-- Database: tnnt_db (Tenant Database)
-- Schema: ivm
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS ivm;

COMMENT ON SCHEMA ivm IS 'IVM: 재고 관리 스키마 (입출고, 재고조정)';

-- ============================================================================
-- AI 기반 업무지원 플랫폼 - 데이터베이스 DDL
-- 멀티테넌시: schema per tenant 전략
-- PostgreSQL 15+ 사용
-- ============================================================================

-- ============================================================================
-- IVM: 재고/자재 관리 (Inventory & Materials)
-- ============================================================================

-- =====================================================================================
-- 테이블: ivm.inventory_balances
-- 설명: 재고 현황 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_balances 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 재고 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    item_id                 UUID                     NOT NULL,                                  -- 품목 식별자
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 재고 수량
    on_hand_qty             INTEGER                  DEFAULT 0,                                 -- 현재고 수량
    available_qty           INTEGER                  DEFAULT 0,                                 -- 가용 수량
    reserved_qty            INTEGER                  DEFAULT 0,                                 -- 예약 수량
    
    -- 원가 정보
    avg_cost                NUMERIC(18,4)            DEFAULT 0,                                 -- 평균 단가
    last_movement_date      TIMESTAMP WITH TIME ZONE,                                           -- 최종 이동 일시
    
    -- 제약조건
    CONSTRAINT ck_inventory_balances__quantities    CHECK (on_hand_qty >= 0 AND available_qty >= 0 AND reserved_qty >= 0),
    CONSTRAINT ck_inventory_balances__avg_cost      CHECK (avg_cost >= 0)
);

-- =====================================================================================
-- 테이블: ivm.inventory_movements
-- 설명: 재고 이동 이력 관리 테이블
-- 작성일: 2024-10-20
-- =====================================================================================

CREATE TABLE IF NOT EXISTS ivm.inventory_movements 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    -- 이동 고유 식별자 (UUID)
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 등록 일시
    created_by              UUID,                                                               -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                           -- 수정 일시
    updated_by              UUID,                                                               -- 수정자 UUID
    
    -- 기본 정보
    company_id              UUID                     NOT NULL,                                  -- 회사 식별자
    movement_code           VARCHAR(50)              NOT NULL,                                  -- 이동 코드
    doc_date                DATE                     NOT NULL,                                  -- 전표 일자
    movement_type           VARCHAR(20)              NOT NULL,                                  -- 이동 유형
    -- 참조 정보
    reference_doc_type      VARCHAR(50),                                                        -- 참조 문서 유형
    reference_doc_id        UUID,                                                               -- 참조 문서 식별자
    
    -- 위치 및 품목 정보
    warehouse_id            UUID                     NOT NULL,                                  -- 창고 식별자
    location_id             UUID,                                                               -- 로케이션 식별자
    item_id                 UUID                     NOT NULL,                                  -- 품목 식별자
    
    -- 로트/시리얼 정보
    lot_number              VARCHAR(100),                                                       -- 로트 번호
    serial_number           VARCHAR(100),                                                       -- 시리얼 번호
    
    -- 수량 및 원가
    qty                     INTEGER                  NOT NULL,                                  -- 이동 수량
    unit_cost               NUMERIC(18,4)            DEFAULT 0,                                 -- 단가
    total_cost              NUMERIC(18,4)            DEFAULT 0,                                 -- 총 원가
    
    -- 사유
    reason_code             VARCHAR(50),                                                        -- 사유 코드
    notes                   TEXT,                                                               -- 비고
    
    -- 제약조건
    CONSTRAINT ck_inventory_movements__movement_type    CHECK (movement_type IN ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT')),
    CONSTRAINT ck_inventory_movements__qty              CHECK (qty != 0),
    CONSTRAINT ck_inventory_movements__costs            CHECK (unit_cost >= 0 AND total_cost >= 0)
);

-- =====================================================================================
-- 코멘트
-- =====================================================================================
COMMENT ON TABLE  ivm.inventory_balances                IS '재고 현황 관리 테이블';
COMMENT ON TABLE  ivm.inventory_movements               IS '재고 이동 이력 관리 테이블';

-- =====================================================================================
-- 인덱스
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_inventory_balances__company_id    ON ivm.inventory_balances (company_id);
CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_id  ON ivm.inventory_balances (warehouse_id);
CREATE INDEX IF NOT EXISTS ix_inventory_balances__item_id       ON ivm.inventory_balances (item_id);
CREATE INDEX IF NOT EXISTS ix_inventory_balances__lot_number    ON ivm.inventory_balances (lot_number) WHERE lot_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_inventory_movements__company_id   ON ivm.inventory_movements (company_id);
CREATE INDEX IF NOT EXISTS ix_inventory_movements__movement_code ON ivm.inventory_movements (movement_code);
CREATE INDEX IF NOT EXISTS ix_inventory_movements__warehouse_id ON ivm.inventory_movements (warehouse_id);
CREATE INDEX IF NOT EXISTS ix_inventory_movements__item_id      ON ivm.inventory_movements (item_id);
CREATE INDEX IF NOT EXISTS ix_inventory_movements__movement_type ON ivm.inventory_movements (movement_type);
CREATE INDEX IF NOT EXISTS ix_inventory_movements__doc_date     ON ivm.inventory_movements (doc_date);

-- =====================================================================================
-- 유니크 제약 조건
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_balances__item_location 
    ON ivm.inventory_balances (warehouse_id, item_id, COALESCE(lot_number, ''), COALESCE(serial_number, ''));

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_movements__company_code 
    ON ivm.inventory_movements (company_id, movement_code);
