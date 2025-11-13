-- =====================================================================================
-- 뷰: srm.vw_sales_invoices
-- 설명: 판매 송장/세금계산서 뷰 (fim.tax_invoices 통합됨)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - FIM 통합 및 VIEW 변경
-- =====================================================================================
--
-- 주의: 이 파일은 하위 호환성을 위해 뷰를 정의합니다.
-- 실제 데이터는 fim.tax_invoices 테이블에 저장되며,
-- 판매 관련 세금계산서는 sales_delivery_id가 설정된 행입니다.
--
-- 마이그레이션 경로:
-- 1. 기존 srm.sales_invoices 데이터를 fim.tax_invoices로 이관
-- 2. 애플리케이션에서 fim.tax_invoices 직접 사용으로 변경
-- 3. 이 VIEW 사용 제거 후 파일 삭제
--
-- =====================================================================================

-- 판매 송장 뷰 (하위 호환성 제공)
CREATE OR REPLACE VIEW srm.vw_sales_invoices AS
SELECT
    id,
    created_at,
    created_by,
    updated_at,
    updated_by,
    invoice_no AS invoice_code,          -- 세금계산서 번호를 송장 코드로 매핑
    CASE
        WHEN invoice_type = 'TAX' THEN 'TAX_INVOICE'
        WHEN invoice_type = 'CREDIT_NOTE' THEN 'CREDIT_NOTE'
        ELSE 'INVOICE'
    END AS invoice_type,
    sales_order_id AS so_id,
    sales_delivery_id AS delivery_id,
    customer_id,
    issue_date AS doc_date,
    due_date,
    invoice_no AS tax_invoice_no,
    issue_date,
    supply_amount AS subtotal,
    tax_amount,
    total_amount,
    currency_code AS currency,
    status,
    is_deleted,
    COALESCE(notes, remark) AS notes
FROM fim.tax_invoices
WHERE sales_delivery_id IS NOT NULL  -- 판매 세금계산서만 필터링
  AND is_deleted = false;

COMMENT ON VIEW srm.vw_sales_invoices IS
'판매 송장/세금계산서 뷰 (하위 호환성) - fim.tax_invoices에서 판매 데이터만 노출';

-- =====================================================================================
-- 주요 변경사항
-- =====================================================================================
--
-- 기존 테이블 srm.sales_invoices는 더 이상 사용되지 않습니다.
-- 모든 세금계산서 데이터는 fim.tax_invoices 테이블에 통합되었습니다.
--
-- 필드 매핑:
-- srm.sales_invoices.invoice_code     -> fim.tax_invoices.invoice_no
-- srm.sales_invoices.so_id            -> fim.tax_invoices.sales_order_id
-- srm.sales_invoices.delivery_id      -> fim.tax_invoices.sales_delivery_id
-- srm.sales_invoices.doc_date         -> fim.tax_invoices.issue_date
--
-- 마이그레이션:
-- 1. 애플리케이션에서 srm.vw_sales_invoices 또는 fim.tax_invoices 사용
-- 2. 향후 버전에서 이 VIEW 제거 예정
--
-- =====================================================================================
