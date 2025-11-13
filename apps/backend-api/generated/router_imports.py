# MANAGER Modules
from src.modules.manager.audt.audit_logs.router import router as manager_audt_audit_logs_router
from src.modules.manager.audt.compliances.router import router as manager_audt_compliances_router
from src.modules.manager.audt.policies.router import router as manager_audt_policies_router

from src.modules.manager.auto.executions.router import router as manager_auto_executions_router
from src.modules.manager.auto.tasks.router import router as manager_auto_tasks_router
from src.modules.manager.auto.workflows.router import router as manager_auto_workflows_router

from src.modules.manager.bill.invoices.router import router as manager_bill_invoices_router
from src.modules.manager.bill.plans.router import router as manager_bill_plans_router
from src.modules.manager.bill.transactions.router import router as manager_bill_transactions_router

from src.modules.manager.bkup.executions.router import router as manager_bkup_executions_router
from src.modules.manager.bkup.recovery_plans.router import router as manager_bkup_recovery_plans_router
from src.modules.manager.bkup.schedules.router import router as manager_bkup_schedules_router

from src.modules.manager.cnfg.configurations.router import router as manager_cnfg_configurations_router
from src.modules.manager.cnfg.feature_flags.router import router as manager_cnfg_feature_flags_router
from src.modules.manager.cnfg.service_quotas.router import router as manager_cnfg_service_quotas_router
from src.modules.manager.cnfg.tenant_features.router import router as manager_cnfg_tenant_features_router

from src.modules.manager.idam.api_keys.router import router as manager_idam_api_keys_router
from src.modules.manager.idam.login_logs.router import router as manager_idam_login_logs_router
from src.modules.manager.idam.permissions.router import router as manager_idam_permissions_router
from src.modules.manager.idam.role_permissions.router import router as manager_idam_role_permissions_router
from src.modules.manager.idam.roles.router import router as manager_idam_roles_router
from src.modules.manager.idam.sessions.router import router as manager_idam_sessions_router
from src.modules.manager.idam.user_roles.router import router as manager_idam_user_roles_router
from src.modules.manager.idam.users.router import router as manager_idam_users_router

from src.modules.manager.ifra.resource_usages.router import router as manager_ifra_resource_usages_router
from src.modules.manager.ifra.resources.router import router as manager_ifra_resources_router

from src.modules.manager.intg.apis.router import router as manager_intg_apis_router
from src.modules.manager.intg.rate_limits.router import router as manager_intg_rate_limits_router
from src.modules.manager.intg.webhooks.router import router as manager_intg_webhooks_router

from src.modules.manager.mntr.health_checks.router import router as manager_mntr_health_checks_router
from src.modules.manager.mntr.incidents.router import router as manager_mntr_incidents_router
from src.modules.manager.mntr.system_metrics.router import router as manager_mntr_system_metrics_router

from src.modules.manager.noti.campaigns.router import router as manager_noti_campaigns_router
from src.modules.manager.noti.notifications.router import router as manager_noti_notifications_router
from src.modules.manager.noti.templates.router import router as manager_noti_templates_router

from src.modules.manager.stat.tenant_stats.router import router as manager_stat_tenant_stats_router
from src.modules.manager.stat.usage_stats.router import router as manager_stat_usage_stats_router

from src.modules.manager.supt.feedbacks.router import router as manager_supt_feedbacks_router
from src.modules.manager.supt.ticket_comments.router import router as manager_supt_ticket_comments_router
from src.modules.manager.supt.tickets.router import router as manager_supt_tickets_router

from src.modules.manager.tnnt.subscriptions.router import router as manager_tnnt_subscriptions_router
from src.modules.manager.tnnt.tenants.router import router as manager_tnnt_tenants_router

# TENANTS Modules
from src.modules.tenants.adm.code_groups.router import router as tenants_adm_code_groups_router
from src.modules.tenants.adm.codes.router import router as tenants_adm_codes_router
from src.modules.tenants.adm.currencies.router import router as tenants_adm_currencies_router
from src.modules.tenants.adm.exchange_rates.router import router as tenants_adm_exchange_rates_router
from src.modules.tenants.adm.payment_terms.router import router as tenants_adm_payment_terms_router
from src.modules.tenants.adm.settings.router import router as tenants_adm_settings_router
from src.modules.tenants.adm.units.router import router as tenants_adm_units_router

from src.modules.tenants.asm.service_requests.router import router as tenants_asm_service_requests_router

from src.modules.tenants.crm.activities.router import router as tenants_crm_activities_router
from src.modules.tenants.crm.contracts.router import router as tenants_crm_contracts_router
from src.modules.tenants.crm.opportunities.router import router as tenants_crm_opportunities_router
from src.modules.tenants.crm.partner_addresses.router import router as tenants_crm_partner_addresses_router
from src.modules.tenants.crm.partners.router import router as tenants_crm_partners_router

from src.modules.tenants.fim.accounts.router import router as tenants_fim_accounts_router
from src.modules.tenants.fim.accounts_payable.router import router as tenants_fim_accounts_payable_router
from src.modules.tenants.fim.accounts_receivable.router import router as tenants_fim_accounts_receivable_router
from src.modules.tenants.fim.business_documents.router import router as tenants_fim_business_documents_router
from src.modules.tenants.fim.journal_entries.router import router as tenants_fim_journal_entries_router
from src.modules.tenants.fim.payment_transactions.router import router as tenants_fim_payment_transactions_router
from src.modules.tenants.fim.tax_invoices.router import router as tenants_fim_tax_invoices_router

from src.modules.tenants.hrm.employees.router import router as tenants_hrm_employees_router
from src.modules.tenants.hrm.salary_structures.router import router as tenants_hrm_salary_structures_router

from src.modules.tenants.lwm.steps.router import router as tenants_lwm_steps_router
from src.modules.tenants.lwm.tasks.router import router as tenants_lwm_tasks_router
from src.modules.tenants.lwm.workflows.router import router as tenants_lwm_workflows_router

from src.modules.tenants.psm.purchase_orders.router import router as tenants_psm_purchase_orders_router

from src.modules.tenants.srm.sales_invoices.router import router as tenants_srm_sales_invoices_router
from src.modules.tenants.srm.sales_orders.router import router as tenants_srm_sales_orders_router
