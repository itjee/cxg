"""테넌트 API v1 라우터 - 자동 생성 (모든 스키마 포함)"""

from fastapi import APIRouter

# 기준정보
from src.modules.tenants.adm.code_groups.router import router as tenants_adm_code_groups_router
from src.modules.tenants.adm.codes.router import router as tenants_adm_codes_router
from src.modules.tenants.adm.currencies.router import router as tenants_adm_currencies_router
from src.modules.tenants.adm.exchange_rates.router import (
    router as tenants_adm_exchange_rates_router,
)
from src.modules.tenants.adm.payment_terms.router import router as tenants_adm_payment_terms_router
from src.modules.tenants.adm.settings.router import router as tenants_adm_settings_router
from src.modules.tenants.adm.units.router import router as tenants_adm_units_router

# 전자결재
from src.modules.tenants.apm.approval_histories.router import (
    router as tenants_apm_approval_histories_router,
)
from src.modules.tenants.apm.approval_line_items.router import (
    router as tenants_apm_approval_line_items_router,
)
from src.modules.tenants.apm.approval_lines.router import (
    router as tenants_apm_approval_lines_router,
)
from src.modules.tenants.apm.approval_requests.router import (
    router as tenants_apm_approval_requests_router,
)

# 서비스관리
from src.modules.tenants.asm.customer_feedback.router import (
    router as tenants_asm_customer_feedback_router,
)
from src.modules.tenants.asm.faqs.router import router as tenants_asm_faqs_router
from src.modules.tenants.asm.nps_surveys.router import router as tenants_asm_nps_surveys_router
from src.modules.tenants.asm.service_parts.router import router as tenants_asm_service_parts_router
from src.modules.tenants.asm.service_requests.router import (
    router as tenants_asm_service_requests_router,
)
from src.modules.tenants.asm.service_works.router import router as tenants_asm_service_works_router
from src.modules.tenants.asm.support_tickets.router import (
    router as tenants_asm_support_tickets_router,
)
from src.modules.tenants.asm.ticket_comments.router import (
    router as tenants_asm_ticket_comments_router,
)

# 비즈니스인텔리전스
from src.modules.tenants.bim.kpi_definitions.router import (
    router as tenants_bim_kpi_definitions_router,
)
from src.modules.tenants.bim.kpi_targets.router import router as tenants_bim_kpi_targets_router
from src.modules.tenants.bim.purchase_analytics.router import (
    router as tenants_bim_purchase_analytics_router,
)
from src.modules.tenants.bim.sales_analytics.router import (
    router as tenants_bim_sales_analytics_router,
)

# 고객관리
from src.modules.tenants.crm.activities.router import router as tenants_crm_activities_router
from src.modules.tenants.crm.campaign_members.router import (
    router as tenants_crm_campaign_members_router,
)
from src.modules.tenants.crm.campaigns.router import router as tenants_crm_campaigns_router
from src.modules.tenants.crm.contracts.router import router as tenants_crm_contracts_router
from src.modules.tenants.crm.customer_segment_members.router import (
    router as tenants_crm_customer_segment_members_router,
)
from src.modules.tenants.crm.customer_segments.router import (
    router as tenants_crm_customer_segments_router,
)
from src.modules.tenants.crm.customer_surveys.router import (
    router as tenants_crm_customer_surveys_router,
)
from src.modules.tenants.crm.email_templates.router import (
    router as tenants_crm_email_templates_router,
)
from src.modules.tenants.crm.interactions.router import router as tenants_crm_interactions_router
from src.modules.tenants.crm.leads.router import router as tenants_crm_leads_router
from src.modules.tenants.crm.opportunities.router import router as tenants_crm_opportunities_router
from src.modules.tenants.crm.partner_addresses.router import (
    router as tenants_crm_partner_addresses_router,
)
from src.modules.tenants.crm.partner_banks.router import router as tenants_crm_partner_banks_router
from src.modules.tenants.crm.partner_contacts.router import (
    router as tenants_crm_partner_contacts_router,
)
from src.modules.tenants.crm.partner_managers.router import (
    router as tenants_crm_partner_managers_router,
)
from src.modules.tenants.crm.partners.router import router as tenants_crm_partners_router
from src.modules.tenants.crm.rfq_items.router import router as tenants_crm_rfq_items_router
from src.modules.tenants.crm.rfqs.router import router as tenants_crm_rfqs_router
from src.modules.tenants.crm.sales_targets.router import router as tenants_crm_sales_targets_router

# 고정자산관리
from src.modules.tenants.fam.asset_depreciation.router import (
    router as tenants_fam_asset_depreciation_router,
)
from src.modules.tenants.fam.asset_disposals.router import (
    router as tenants_fam_asset_disposals_router,
)
from src.modules.tenants.fam.fixed_assets.router import router as tenants_fam_fixed_assets_router

# 재무관리
from src.modules.tenants.fim.accounts.router import router as tenants_fim_accounts_router
from src.modules.tenants.fim.accounts_payable.router import (
    router as tenants_fim_accounts_payable_router,
)
from src.modules.tenants.fim.accounts_receivable.router import (
    router as tenants_fim_accounts_receivable_router,
)
from src.modules.tenants.fim.business_documents.router import (
    router as tenants_fim_business_documents_router,
)
from src.modules.tenants.fim.journal_entries.router import (
    router as tenants_fim_journal_entries_router,
)
from src.modules.tenants.fim.journal_entry_lines.router import (
    router as tenants_fim_journal_entry_lines_router,
)
from src.modules.tenants.fim.payment_transactions.router import (
    router as tenants_fim_payment_transactions_router,
)
from src.modules.tenants.fim.tax_invoice_lines.router import (
    router as tenants_fim_tax_invoice_lines_router,
)
from src.modules.tenants.fim.tax_invoices.router import router as tenants_fim_tax_invoices_router

# 인사관리
from src.modules.tenants.hrm.absences.router import router as tenants_hrm_absences_router
from src.modules.tenants.hrm.attendances.router import router as tenants_hrm_attendances_router
from src.modules.tenants.hrm.department_histories.router import (
    router as tenants_hrm_department_histories_router,
)
from src.modules.tenants.hrm.departments.router import router as tenants_hrm_departments_router
from src.modules.tenants.hrm.employee_histories.router import (
    router as tenants_hrm_employee_histories_router,
)
from src.modules.tenants.hrm.employees.router import router as tenants_hrm_employees_router
from src.modules.tenants.hrm.leave_policies.router import (
    router as tenants_hrm_leave_policies_router,
)
from src.modules.tenants.hrm.payroll_records.router import (
    router as tenants_hrm_payroll_records_router,
)
from src.modules.tenants.hrm.salary_structures.router import (
    router as tenants_hrm_salary_structures_router,
)

# 재고관리
from src.modules.tenants.ivm.inventory_adjustments.router import (
    router as tenants_ivm_inventory_adjustments_router,
)
from src.modules.tenants.ivm.inventory_balances.router import (
    router as tenants_ivm_inventory_balances_router,
)
from src.modules.tenants.ivm.inventory_count_items.router import (
    router as tenants_ivm_inventory_count_items_router,
)
from src.modules.tenants.ivm.inventory_counts.router import (
    router as tenants_ivm_inventory_counts_router,
)
from src.modules.tenants.ivm.inventory_cycle_counts.router import (
    router as tenants_ivm_inventory_cycle_counts_router,
)
from src.modules.tenants.ivm.inventory_lots.router import (
    router as tenants_ivm_inventory_lots_router,
)
from src.modules.tenants.ivm.inventory_movements.router import (
    router as tenants_ivm_inventory_movements_router,
)
from src.modules.tenants.ivm.inventory_reservations.router import (
    router as tenants_ivm_inventory_reservations_router,
)
from src.modules.tenants.ivm.inventory_serial_numbers.router import (
    router as tenants_ivm_inventory_serial_numbers_router,
)
from src.modules.tenants.ivm.inventory_transfers.router import (
    router as tenants_ivm_inventory_transfers_router,
)

# 워크플로우
from src.modules.tenants.lwm.steps.router import router as tenants_lwm_steps_router
from src.modules.tenants.lwm.tasks.router import router as tenants_lwm_tasks_router
from src.modules.tenants.lwm.workflows.router import router as tenants_lwm_workflows_router

# 상품정보관리
from src.modules.tenants.pim.brands.router import router as tenants_pim_brands_router
from src.modules.tenants.pim.categories.router import router as tenants_pim_categories_router
from src.modules.tenants.pim.category_managers.router import (
    router as tenants_pim_category_managers_router,
)
from src.modules.tenants.pim.makers.router import router as tenants_pim_makers_router
from src.modules.tenants.pim.product_images.router import (
    router as tenants_pim_product_images_router,
)
from src.modules.tenants.pim.product_managers.router import (
    router as tenants_pim_product_managers_router,
)
from src.modules.tenants.pim.product_option_values.router import (
    router as tenants_pim_product_option_values_router,
)
from src.modules.tenants.pim.product_options.router import (
    router as tenants_pim_product_options_router,
)
from src.modules.tenants.pim.product_price_history.router import (
    router as tenants_pim_product_price_history_router,
)
from src.modules.tenants.pim.product_relations.router import (
    router as tenants_pim_product_relations_router,
)
from src.modules.tenants.pim.product_suppliers.router import (
    router as tenants_pim_product_suppliers_router,
)
from src.modules.tenants.pim.product_tags.router import router as tenants_pim_product_tags_router
from src.modules.tenants.pim.product_unit_conversions.router import (
    router as tenants_pim_product_unit_conversions_router,
)
from src.modules.tenants.pim.product_units.router import router as tenants_pim_product_units_router
from src.modules.tenants.pim.product_variants.router import (
    router as tenants_pim_product_variants_router,
)
from src.modules.tenants.pim.products.router import router as tenants_pim_products_router

# 구매관리
from src.modules.tenants.psm.purchase_order_items.router import (
    router as tenants_psm_purchase_order_items_router,
)
from src.modules.tenants.psm.purchase_order_pr_links.router import (
    router as tenants_psm_purchase_order_pr_links_router,
)
from src.modules.tenants.psm.purchase_order_receipt_items.router import (
    router as tenants_psm_purchase_order_receipt_items_router,
)
from src.modules.tenants.psm.purchase_order_receipts.router import (
    router as tenants_psm_purchase_order_receipts_router,
)
from src.modules.tenants.psm.purchase_orders.router import (
    router as tenants_psm_purchase_orders_router,
)
from src.modules.tenants.psm.purchase_price_agreements.router import (
    router as tenants_psm_purchase_price_agreements_router,
)
from src.modules.tenants.psm.purchase_quotation_items.router import (
    router as tenants_psm_purchase_quotation_items_router,
)
from src.modules.tenants.psm.purchase_quotations.router import (
    router as tenants_psm_purchase_quotations_router,
)
from src.modules.tenants.psm.purchase_requisition_items.router import (
    router as tenants_psm_purchase_requisition_items_router,
)
from src.modules.tenants.psm.purchase_requisitions.router import (
    router as tenants_psm_purchase_requisitions_router,
)

# 판매관리
from src.modules.tenants.srm.promotion_usage.router import (
    router as tenants_srm_promotion_usage_router,
)
from src.modules.tenants.srm.promotions.router import router as tenants_srm_promotions_router
from src.modules.tenants.srm.quotation_items.router import (
    router as tenants_srm_quotation_items_router,
)
from src.modules.tenants.srm.quotations.router import router as tenants_srm_quotations_router
from src.modules.tenants.srm.sales_deliveries.router import (
    router as tenants_srm_sales_deliveries_router,
)
from src.modules.tenants.srm.sales_delivery_items.router import (
    router as tenants_srm_sales_delivery_items_router,
)
from src.modules.tenants.srm.sales_invoice_items.router import (
    router as tenants_srm_sales_invoice_items_router,
)
from src.modules.tenants.srm.sales_invoices.router import (
    router as tenants_srm_sales_invoices_router,
)
from src.modules.tenants.srm.sales_order_items.router import (
    router as tenants_srm_sales_order_items_router,
)
from src.modules.tenants.srm.sales_orders.router import router as tenants_srm_sales_orders_router
from src.modules.tenants.srm.sales_return_items.router import (
    router as tenants_srm_sales_return_items_router,
)
from src.modules.tenants.srm.sales_returns.router import router as tenants_srm_sales_returns_router

# 시스템
from src.modules.tenants.sys.code_rules.router import router as tenants_sys_code_rules_router
from src.modules.tenants.sys.permission_conflict_resolution.router import (
    router as tenants_sys_permission_conflict_resolution_router,
)
from src.modules.tenants.sys.permissions.router import router as tenants_sys_permissions_router
from src.modules.tenants.sys.role_permissions.router import (
    router as tenants_sys_role_permissions_router,
)
from src.modules.tenants.sys.roles.router import router as tenants_sys_roles_router
from src.modules.tenants.sys.user_roles.router import router as tenants_sys_user_roles_router
from src.modules.tenants.sys.users.router import router as tenants_sys_users_router
from src.modules.tenants.sys.menus.router import router as tenants_sys_menus_router

# 창고관리
from src.modules.tenants.wms.inventory.router import router as tenants_wms_inventory_router
from src.modules.tenants.wms.receiving.router import router as tenants_wms_receiving_router
from src.modules.tenants.wms.receiving_items.router import (
    router as tenants_wms_receiving_items_router,
)
from src.modules.tenants.wms.shipping.router import router as tenants_wms_shipping_router
from src.modules.tenants.wms.shipping_items.router import (
    router as tenants_wms_shipping_items_router,
)
from src.modules.tenants.wms.warehouse_employees.router import (
    router as tenants_wms_warehouse_employees_router,
)
from src.modules.tenants.wms.warehouse_locations.router import (
    router as tenants_wms_warehouse_locations_router,
)
from src.modules.tenants.wms.warehouses.router import router as tenants_wms_warehouses_router


router = APIRouter()

# ==================== 대:테넌트 ====================

# 중:전자결재
router.include_router(
    tenants_apm_approval_histories_router,
    prefix="/apm/approval-histories",
    tags=["테넌트 > 전자결재 > 결재이력"],
)
router.include_router(
    tenants_apm_approval_line_items_router,
    prefix="/apm/approval-line-items",
    tags=["테넌트 > 전자결재 > 결재선항목"],
)
router.include_router(
    tenants_apm_approval_lines_router,
    prefix="/apm/approval-lines",
    tags=["테넌트 > 전자결재 > 결재선"],
)
router.include_router(
    tenants_apm_approval_requests_router,
    prefix="/apm/approval-requests",
    tags=["테넌트 > 전자결재 > 결재요청"],
)

# 중:서비스관리
router.include_router(
    tenants_asm_customer_feedback_router,
    prefix="/asm/customer-feedback",
    tags=["테넌트 > 서비스관리 > 고객피드백"],
)
router.include_router(
    tenants_asm_faqs_router, prefix="/asm/faqs", tags=["테넌트 > 서비스관리 > FAQ"]
)
router.include_router(
    tenants_asm_nps_surveys_router,
    prefix="/asm/nps-surveys",
    tags=["테넌트 > 서비스관리 > NPS설문"],
)
router.include_router(
    tenants_asm_service_parts_router,
    prefix="/asm/service-parts",
    tags=["테넌트 > 서비스관리 > 서비스부품"],
)
router.include_router(
    tenants_asm_service_requests_router,
    prefix="/asm/service-requests",
    tags=["테넌트 > 서비스관리 > 서비스요청"],
)
router.include_router(
    tenants_asm_service_works_router,
    prefix="/asm/service-works",
    tags=["테넌트 > 서비스관리 > 서비스작업"],
)
router.include_router(
    tenants_asm_support_tickets_router,
    prefix="/asm/support-tickets",
    tags=["테넌트 > 서비스관리 > 지원티켓"],
)
router.include_router(
    tenants_asm_ticket_comments_router,
    prefix="/asm/ticket-comments",
    tags=["테넌트 > 서비스관리 > 티켓댓글"],
)

# 중:비즈니스인텔리전스
router.include_router(
    tenants_bim_kpi_definitions_router,
    prefix="/bim/kpi-definitions",
    tags=["테넌트 > 비즈니스인텔리전스 > KPI정의"],
)
router.include_router(
    tenants_bim_kpi_targets_router,
    prefix="/bim/kpi-targets",
    tags=["테넌트 > 비즈니스인텔리전스 > KPI목표"],
)
router.include_router(
    tenants_bim_purchase_analytics_router,
    prefix="/bim/purchase-analytics",
    tags=["테넌트 > 비즈니스인텔리전스 > 구매분석"],
)
router.include_router(
    tenants_bim_sales_analytics_router,
    prefix="/bim/sales-analytics",
    tags=["테넌트 > 비즈니스인텔리전스 > 매출분석"],
)

# 중:고객관리
router.include_router(
    tenants_crm_activities_router, prefix="/crm/activities", tags=["테넌트 > 고객관리 > 영업활동"]
)
router.include_router(
    tenants_crm_campaign_members_router,
    prefix="/crm/campaign-members",
    tags=["테넌트 > 고객관리 > 캠페인구성원"],
)
router.include_router(
    tenants_crm_campaigns_router, prefix="/crm/campaigns", tags=["테넌트 > 고객관리 > 캠페인"]
)
router.include_router(
    tenants_crm_contracts_router, prefix="/crm/contracts", tags=["테넌트 > 고객관리 > 계약"]
)
router.include_router(
    tenants_crm_customer_segment_members_router,
    prefix="/crm/customer-segment-members",
    tags=["테넌트 > 고객관리 > 고객세그먼트구성원"],
)
router.include_router(
    tenants_crm_customer_segments_router,
    prefix="/crm/customer-segments",
    tags=["테넌트 > 고객관리 > 고객세그먼트"],
)
router.include_router(
    tenants_crm_customer_surveys_router,
    prefix="/crm/customer-surveys",
    tags=["테넌트 > 고객관리 > 고객설문"],
)
router.include_router(
    tenants_crm_email_templates_router,
    prefix="/crm/email-templates",
    tags=["테넌트 > 고객관리 > 이메일템플릿"],
)
router.include_router(
    tenants_crm_interactions_router,
    prefix="/crm/interactions",
    tags=["테넌트 > 고객관리 > 상호작용"],
)
router.include_router(
    tenants_crm_leads_router, prefix="/crm/leads", tags=["테넌트 > 고객관리 > 리드"]
)
router.include_router(
    tenants_crm_opportunities_router,
    prefix="/crm/opportunities",
    tags=["테넌트 > 고객관리 > 영업기회"],
)
router.include_router(
    tenants_crm_partner_addresses_router,
    prefix="/crm/partner-addresses",
    tags=["테넌트 > 고객관리 > 거래처주소"],
)
router.include_router(
    tenants_crm_partner_banks_router,
    prefix="/crm/partner-banks",
    tags=["테넌트 > 고객관리 > 거래처계좌"],
)
router.include_router(
    tenants_crm_partner_contacts_router,
    prefix="/crm/partner-contacts",
    tags=["테넌트 > 고객관리 > 거래처담당자"],
)
router.include_router(
    tenants_crm_partner_managers_router,
    prefix="/crm/partner-managers",
    tags=["테넌트 > 고객관리 > 거래처관리자"],
)
router.include_router(
    tenants_crm_partners_router, prefix="/crm/partners", tags=["테넌트 > 고객관리 > 거래처"]
)
router.include_router(
    tenants_crm_rfq_items_router, prefix="/crm/rfq-items", tags=["테넌트 > 고객관리 > 견적요청항목"]
)
router.include_router(
    tenants_crm_rfqs_router, prefix="/crm/rfqs", tags=["테넌트 > 고객관리 > 견적요청"]
)
router.include_router(
    tenants_crm_sales_targets_router,
    prefix="/crm/sales-targets",
    tags=["테넌트 > 고객관리 > 판매목표"],
)

# 중:고정자산관리
router.include_router(
    tenants_fam_asset_depreciation_router,
    prefix="/fam/asset-depreciation",
    tags=["테넌트 > 고정자산관리 > 자산감가상각"],
)
router.include_router(
    tenants_fam_asset_disposals_router,
    prefix="/fam/asset-disposals",
    tags=["테넌트 > 고정자산관리 > 자산처분"],
)
router.include_router(
    tenants_fam_fixed_assets_router,
    prefix="/fam/fixed-assets",
    tags=["테넌트 > 고정자산관리 > 고정자산"],
)

# 중:재무관리
router.include_router(
    tenants_fim_accounts_router, prefix="/fim/accounts", tags=["테넌트 > 재무관리 > 계정과목"]
)
router.include_router(
    tenants_fim_accounts_payable_router,
    prefix="/fim/accounts-payable",
    tags=["테넌트 > 재무관리 > 매입채무"],
)
router.include_router(
    tenants_fim_accounts_receivable_router,
    prefix="/fim/accounts-receivable",
    tags=["테넌트 > 재무관리 > 매출채권"],
)
router.include_router(
    tenants_fim_business_documents_router,
    prefix="/fim/business-documents",
    tags=["테넌트 > 재무관리 > 증빙문서"],
)
router.include_router(
    tenants_fim_journal_entries_router,
    prefix="/fim/journal-entries",
    tags=["테넌트 > 재무관리 > 분개"],
)
router.include_router(
    tenants_fim_journal_entry_lines_router,
    prefix="/fim/journal-entry-lines",
    tags=["테넌트 > 재무관리 > 분개 항목"],
)
router.include_router(
    tenants_fim_payment_transactions_router,
    prefix="/fim/payment-transactions",
    tags=["테넌트 > 재무관리 > 결제거래"],
)
router.include_router(
    tenants_fim_tax_invoice_lines_router,
    prefix="/fim/tax-invoice-lines",
    tags=["테넌트 > 재무관리 > 세금계산서 항목"],
)
router.include_router(
    tenants_fim_tax_invoices_router,
    prefix="/fim/tax-invoices",
    tags=["테넌트 > 재무관리 > 세금계산서"],
)

# 중:인사관리
router.include_router(
    tenants_hrm_absences_router, prefix="/hrm/absences", tags=["테넌트 > 인사관리 > 부재"]
)
router.include_router(
    tenants_hrm_attendances_router, prefix="/hrm/attendances", tags=["테넌트 > 인사관리 > 출퇴근"]
)
router.include_router(
    tenants_hrm_department_histories_router,
    prefix="/hrm/department-histories",
    tags=["테넌트 > 인사관리 > 부서 이력"],
)
router.include_router(
    tenants_hrm_departments_router, prefix="/hrm/departments", tags=["테넌트 > 인사관리 > 부서"]
)
router.include_router(
    tenants_hrm_employee_histories_router,
    prefix="/hrm/employee-histories",
    tags=["테넌트 > 인사관리 > 직원 이력"],
)
router.include_router(
    tenants_hrm_employees_router, prefix="/hrm/employees", tags=["테넌트 > 인사관리 > 직원"]
)
router.include_router(
    tenants_hrm_leave_policies_router,
    prefix="/hrm/leave-policies",
    tags=["테넌트 > 인사관리 > 휴가 정책"],
)
router.include_router(
    tenants_hrm_payroll_records_router,
    prefix="/hrm/payroll-records",
    tags=["테넌트 > 인사관리 > 급여 기록"],
)
router.include_router(
    tenants_hrm_salary_structures_router,
    prefix="/hrm/salary-structures",
    tags=["테넌트 > 인사관리 > 급여구조"],
)

# 중:재고관리
router.include_router(
    tenants_ivm_inventory_adjustments_router,
    prefix="/ivm/inventory-adjustments",
    tags=["테넌트 > 재고관리 > 재고조정"],
)
router.include_router(
    tenants_ivm_inventory_balances_router,
    prefix="/ivm/inventory-balances",
    tags=["테넌트 > 재고관리 > 재고잔액"],
)
router.include_router(
    tenants_ivm_inventory_count_items_router,
    prefix="/ivm/inventory-count-items",
    tags=["테넌트 > 재고관리 > 재고실사항목"],
)
router.include_router(
    tenants_ivm_inventory_counts_router,
    prefix="/ivm/inventory-counts",
    tags=["테넌트 > 재고관리 > 재고실사"],
)
router.include_router(
    tenants_ivm_inventory_cycle_counts_router,
    prefix="/ivm/inventory-cycle-counts",
    tags=["테넌트 > 재고관리 > 순환재고실사"],
)
router.include_router(
    tenants_ivm_inventory_lots_router,
    prefix="/ivm/inventory-lots",
    tags=["테넌트 > 재고관리 > 재고로트"],
)
router.include_router(
    tenants_ivm_inventory_movements_router,
    prefix="/ivm/inventory-movements",
    tags=["테넌트 > 재고관리 > 재고이동"],
)
router.include_router(
    tenants_ivm_inventory_reservations_router,
    prefix="/ivm/inventory-reservations",
    tags=["테넌트 > 재고관리 > 재고예약"],
)
router.include_router(
    tenants_ivm_inventory_serial_numbers_router,
    prefix="/ivm/inventory-serial-numbers",
    tags=["테넌트 > 재고관리 > 재고일련번호"],
)
router.include_router(
    tenants_ivm_inventory_transfers_router,
    prefix="/ivm/inventory-transfers",
    tags=["테넌트 > 재고관리 > 재고이관"],
)

# 중:워크플로우
router.include_router(
    tenants_lwm_steps_router, prefix="/lwm/steps", tags=["테넌트 > 워크플로우 > 단계"]
)
router.include_router(
    tenants_lwm_tasks_router, prefix="/lwm/tasks", tags=["테넌트 > 워크플로우 > 작업"]
)
router.include_router(
    tenants_lwm_workflows_router, prefix="/lwm/workflows", tags=["테넌트 > 워크플로우 > 워크플로우"]
)

# 중:상품정보관리
router.include_router(
    tenants_pim_brands_router, prefix="/pim/brands", tags=["테넌트 > 상품정보관리 > 브랜드"]
)
router.include_router(
    tenants_pim_categories_router,
    prefix="/pim/categories",
    tags=["테넌트 > 상품정보관리 > 카테고리"],
)
router.include_router(
    tenants_pim_category_managers_router,
    prefix="/pim/category-managers",
    tags=["테넌트 > 상품정보관리 > 카테고리 담당자"],
)
router.include_router(
    tenants_pim_makers_router, prefix="/pim/makers", tags=["테넌트 > 상품정보관리 > 제조사"]
)
router.include_router(
    tenants_pim_product_images_router,
    prefix="/pim/product-images",
    tags=["테넌트 > 상품정보관리 > 상품이미지"],
)
router.include_router(
    tenants_pim_product_managers_router,
    prefix="/pim/product-managers",
    tags=["테넌트 > 상품정보관리 > 상품 담당자"],
)
router.include_router(
    tenants_pim_product_option_values_router,
    prefix="/pim/product-option-values",
    tags=["테넌트 > 상품정보관리 > 상품 옵션 값"],
)
router.include_router(
    tenants_pim_product_options_router,
    prefix="/pim/product-options",
    tags=["테넌트 > 상품정보관리 > 상품 옵션"],
)
router.include_router(
    tenants_pim_product_price_history_router,
    prefix="/pim/product-price-history",
    tags=["테넌트 > 상품정보관리 > 상품 가격 이력"],
)
router.include_router(
    tenants_pim_product_relations_router,
    prefix="/pim/product-relations",
    tags=["테넌트 > 상품정보관리 > 상품 연관관계"],
)
router.include_router(
    tenants_pim_product_suppliers_router,
    prefix="/pim/product-suppliers",
    tags=["테넌트 > 상품정보관리 > 상품 공급업체"],
)
router.include_router(
    tenants_pim_product_tags_router,
    prefix="/pim/product-tags",
    tags=["테넌트 > 상품정보관리 > 상품 태그"],
)
router.include_router(
    tenants_pim_product_unit_conversions_router,
    prefix="/pim/product-unit-conversions",
    tags=["테넌트 > 상품정보관리 > 상품 단위 변환"],
)
router.include_router(
    tenants_pim_product_units_router,
    prefix="/pim/product-units",
    tags=["테넌트 > 상품정보관리 > 상품 단위"],
)
router.include_router(
    tenants_pim_product_variants_router,
    prefix="/pim/product-variants",
    tags=["테넌트 > 상품정보관리 > 상품변형"],
)
router.include_router(
    tenants_pim_products_router, prefix="/pim/products", tags=["테넌트 > 상품정보관리 > 상품"]
)

# 중:구매관리
router.include_router(
    tenants_psm_purchase_order_items_router,
    prefix="/psm/purchase-order-items",
    tags=["테넌트 > 구매관리 > 구매주문항목"],
)
router.include_router(
    tenants_psm_purchase_order_pr_links_router,
    prefix="/psm/purchase-order-pr-links",
    tags=["테넌트 > 구매관리 > 구매 발주 구매요청 연결"],
)
router.include_router(
    tenants_psm_purchase_order_receipt_items_router,
    prefix="/psm/purchase-order-receipt-items",
    tags=["테넌트 > 구매관리 > 구매 발주 입고 품목"],
)
router.include_router(
    tenants_psm_purchase_order_receipts_router,
    prefix="/psm/purchase-order-receipts",
    tags=["테넌트 > 구매관리 > 구매 발주 입고"],
)
router.include_router(
    tenants_psm_purchase_orders_router,
    prefix="/psm/purchase-orders",
    tags=["테넌트 > 구매관리 > 구매주문"],
)
router.include_router(
    tenants_psm_purchase_price_agreements_router,
    prefix="/psm/purchase-price-agreements",
    tags=["테넌트 > 구매관리 > 구매 가격 계약"],
)
router.include_router(
    tenants_psm_purchase_quotation_items_router,
    prefix="/psm/purchase-quotation-items",
    tags=["테넌트 > 구매관리 > 구매 견적 품목"],
)
router.include_router(
    tenants_psm_purchase_quotations_router,
    prefix="/psm/purchase-quotations",
    tags=["테넌트 > 구매관리 > 구매 견적"],
)
router.include_router(
    tenants_psm_purchase_requisition_items_router,
    prefix="/psm/purchase-requisition-items",
    tags=["테넌트 > 구매관리 > 구매요청항목"],
)
router.include_router(
    tenants_psm_purchase_requisitions_router,
    prefix="/psm/purchase-requisitions",
    tags=["테넌트 > 구매관리 > 구매요청"],
)

# 중:판매관리
router.include_router(
    tenants_srm_promotion_usage_router,
    prefix="/srm/promotion-usage",
    tags=["테넌트 > 판매관리 > 프로모션 사용"],
)
router.include_router(
    tenants_srm_promotions_router, prefix="/srm/promotions", tags=["테넌트 > 판매관리 > 프로모션"]
)
router.include_router(
    tenants_srm_quotation_items_router,
    prefix="/srm/quotation-items",
    tags=["테넌트 > 판매관리 > 견적항목"],
)
router.include_router(
    tenants_srm_quotations_router, prefix="/srm/quotations", tags=["테넌트 > 판매관리 > 견적"]
)
router.include_router(
    tenants_srm_sales_deliveries_router,
    prefix="/srm/sales-deliveries",
    tags=["테넌트 > 판매관리 > 판매출하"],
)
router.include_router(
    tenants_srm_sales_delivery_items_router,
    prefix="/srm/sales-delivery-items",
    tags=["테넌트 > 판매관리 > 판매출하항목"],
)
router.include_router(
    tenants_srm_sales_invoice_items_router,
    prefix="/srm/sales-invoice-items",
    tags=["테넌트 > 판매관리 > 판매청구서항목"],
)
router.include_router(
    tenants_srm_sales_invoices_router,
    prefix="/srm/sales-invoices",
    tags=["테넌트 > 판매관리 > 판매청구서"],
)
router.include_router(
    tenants_srm_sales_order_items_router,
    prefix="/srm/sales-order-items",
    tags=["테넌트 > 판매관리 > 판매주문항목"],
)
router.include_router(
    tenants_srm_sales_orders_router,
    prefix="/srm/sales-orders",
    tags=["테넌트 > 판매관리 > 판매주문"],
)
router.include_router(
    tenants_srm_sales_return_items_router,
    prefix="/srm/sales-return-items",
    tags=["테넌트 > 판매관리 > 판매반품항목"],
)
router.include_router(
    tenants_srm_sales_returns_router,
    prefix="/srm/sales-returns",
    tags=["테넌트 > 판매관리 > 판매반품"],
)

# 중:시스템
router.include_router(
    tenants_sys_code_rules_router, prefix="/sys/code-rules", tags=["테넌트 > 시스템 > 코드규칙"]
)
router.include_router(
    tenants_sys_permission_conflict_resolution_router,
    prefix="/sys/permission-conflict-resolution",
    tags=["테넌트 > 시스템 > 권한충돌해결"],
)
router.include_router(
    tenants_sys_permissions_router, prefix="/sys/permissions", tags=["테넌트 > 시스템 > 권한"]
)
router.include_router(
    tenants_sys_role_permissions_router,
    prefix="/sys/role-permissions",
    tags=["테넌트 > 시스템 > 역할권한"],
)
router.include_router(
    tenants_sys_roles_router, prefix="/sys/roles", tags=["테넌트 > 시스템 > 역할"]
)
router.include_router(
    tenants_sys_user_roles_router, prefix="/sys/user-roles", tags=["테넌트 > 시스템 > 사용자역할"]
)
router.include_router(
    tenants_sys_users_router, prefix="/sys/users", tags=["테넌트 > 시스템 > 사용자"]
)
router.include_router(
    tenants_sys_menus_router, prefix="/sys/menus", tags=["테넌트 > 시스템 > 메뉴"]
)

# 중:창고관리
router.include_router(
    tenants_wms_inventory_router, prefix="/wms/inventory", tags=["테넌트 > 창고관리 > 재고"]
)
router.include_router(
    tenants_wms_receiving_router, prefix="/wms/receiving", tags=["테넌트 > 창고관리 > 입고"]
)
router.include_router(
    tenants_wms_receiving_items_router,
    prefix="/wms/receiving-items",
    tags=["테넌트 > 창고관리 > 입고항목"],
)
router.include_router(
    tenants_wms_shipping_router, prefix="/wms/shipping", tags=["테넌트 > 창고관리 > 출고"]
)
router.include_router(
    tenants_wms_shipping_items_router,
    prefix="/wms/shipping-items",
    tags=["테넌트 > 창고관리 > 출고항목"],
)
router.include_router(
    tenants_wms_warehouse_employees_router,
    prefix="/wms/warehouse-employees",
    tags=["테넌트 > 창고관리 > 창고직원"],
)
router.include_router(
    tenants_wms_warehouse_locations_router,
    prefix="/wms/warehouse-locations",
    tags=["테넌트 > 창고관리 > 창고위치"],
)
router.include_router(
    tenants_wms_warehouses_router, prefix="/wms/warehouses", tags=["테넌트 > 창고관리 > 창고"]
)

# 중:기준정보
router.include_router(
    tenants_adm_code_groups_router, prefix="/adm/code-groups", tags=["테넌트 > 기준정보 > 코드그룹"]
)
router.include_router(
    tenants_adm_codes_router, prefix="/adm/codes", tags=["테넌트 > 기준정보 > 코드"]
)
router.include_router(
    tenants_adm_currencies_router, prefix="/adm/currencies", tags=["테넌트 > 기준정보 > 통화"]
)
router.include_router(
    tenants_adm_exchange_rates_router,
    prefix="/adm/exchange-rates",
    tags=["테넌트 > 기준정보 > 환율"],
)
router.include_router(
    tenants_adm_payment_terms_router,
    prefix="/adm/payment-terms",
    tags=["테넌트 > 기준정보 > 결제조건"],
)
router.include_router(
    tenants_adm_settings_router, prefix="/adm/settings", tags=["테넌트 > 기준정보 > 설정"]
)
router.include_router(
    tenants_adm_units_router, prefix="/adm/units", tags=["테넌트 > 기준정보 > 단위"]
)
