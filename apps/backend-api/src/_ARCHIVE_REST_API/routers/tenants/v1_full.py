"""테넌트 API v1 라우터 - 자동 생성 (모든 스키마 포함)"""

from fastapi import APIRouter

# TENANTS Modules
from src.modules.tenants.adm.code_groups.router import router as tenants_adm_code_groups_router
from src.modules.tenants.adm.codes.router import router as tenants_adm_codes_router
from src.modules.tenants.adm.currencies.router import router as tenants_adm_currencies_router
from src.modules.tenants.adm.exchange_rates.router import (
    router as tenants_adm_exchange_rates_router,
)
from src.modules.tenants.adm.payment_terms.router import router as tenants_adm_payment_terms_router
from src.modules.tenants.adm.settings.router import router as tenants_adm_settings_router
from src.modules.tenants.adm.units.router import router as tenants_adm_units_router
from src.modules.tenants.asm.service_requests.router import (
    router as tenants_asm_service_requests_router,
)
from src.modules.tenants.crm.activities.router import router as tenants_crm_activities_router
from src.modules.tenants.crm.contracts.router import router as tenants_crm_contracts_router
from src.modules.tenants.crm.opportunities.router import router as tenants_crm_opportunities_router
from src.modules.tenants.crm.partner_addresses.router import (
    router as tenants_crm_partner_addresses_router,
)
from src.modules.tenants.crm.partners.router import router as tenants_crm_partners_router
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
from src.modules.tenants.fim.payment_transactions.router import (
    router as tenants_fim_payment_transactions_router,
)
from src.modules.tenants.fim.tax_invoices.router import router as tenants_fim_tax_invoices_router
from src.modules.tenants.hrm.employees.router import router as tenants_hrm_employees_router
from src.modules.tenants.hrm.salary_structures.router import (
    router as tenants_hrm_salary_structures_router,
)
from src.modules.tenants.lwm.steps.router import router as tenants_lwm_steps_router
from src.modules.tenants.lwm.tasks.router import router as tenants_lwm_tasks_router
from src.modules.tenants.lwm.workflows.router import router as tenants_lwm_workflows_router
from src.modules.tenants.psm.purchase_orders.router import (
    router as tenants_psm_purchase_orders_router,
)
from src.modules.tenants.srm.sales_invoices.router import (
    router as tenants_srm_sales_invoices_router,
)
from src.modules.tenants.srm.sales_orders.router import router as tenants_srm_sales_orders_router


router = APIRouter()

# ==================== 대:테넌트 ====================

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

# 중:서비스관리
router.include_router(
    tenants_asm_service_requests_router,
    prefix="/asm/service-requests",
    tags=["테넌트 > 서비스관리 > 서비스요청"],
)

# 중:고객관리
router.include_router(
    tenants_crm_activities_router, prefix="/crm/activities", tags=["테넌트 > 고객관리 > 영업활동"]
)
router.include_router(
    tenants_crm_contracts_router, prefix="/crm/contracts", tags=["테넌트 > 고객관리 > 계약"]
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
    tenants_crm_partners_router, prefix="/crm/partners", tags=["테넌트 > 고객관리 > 거래처"]
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
    tenants_fim_payment_transactions_router,
    prefix="/fim/payment-transactions",
    tags=["테넌트 > 재무관리 > 결제거래"],
)
router.include_router(
    tenants_fim_tax_invoices_router,
    prefix="/fim/tax-invoices",
    tags=["테넌트 > 재무관리 > 세금계산서"],
)

# 중:인사관리
router.include_router(
    tenants_hrm_employees_router, prefix="/hrm/employees", tags=["테넌트 > 인사관리 > 직원"]
)
router.include_router(
    tenants_hrm_salary_structures_router,
    prefix="/hrm/salary-structures",
    tags=["테넌트 > 인사관리 > 급여구조"],
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

# 중:구매관리
router.include_router(
    tenants_psm_purchase_orders_router,
    prefix="/psm/purchase-orders",
    tags=["테넌트 > 구매관리 > 구매주문"],
)

# 중:판매관리
router.include_router(
    tenants_srm_sales_invoices_router,
    prefix="/srm/sales-invoices",
    tags=["테넌트 > 판매관리 > 판매청구서"],
)
router.include_router(
    tenants_srm_sales_orders_router,
    prefix="/srm/sales-orders",
    tags=["테넌트 > 판매관리 > 판매주문"],
)
