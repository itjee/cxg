
# ==================== 대:관리자 ====================

# 중:감사
router.include_router(manager_audt_audit_logs_router, prefix="/audt/audit-logs", tags=["관리자 > 감사 > 감사로그"])
router.include_router(manager_audt_compliances_router, prefix="/audt/compliances", tags=["관리자 > 감사 > Compliances"])
router.include_router(manager_audt_policies_router, prefix="/audt/policies", tags=["관리자 > 감사 > Policies"])

# 중:자동화
router.include_router(manager_auto_executions_router, prefix="/auto/executions", tags=["관리자 > 자동화 > Executions"])
router.include_router(manager_auto_tasks_router, prefix="/auto/tasks", tags=["관리자 > 자동화 > Tasks"])
router.include_router(manager_auto_workflows_router, prefix="/auto/workflows", tags=["관리자 > 자동화 > 워크플로우"])

# 중:청구
router.include_router(manager_bill_invoices_router, prefix="/bill/invoices", tags=["관리자 > 청구 > 청구서"])
router.include_router(manager_bill_plans_router, prefix="/bill/plans", tags=["관리자 > 청구 > 요금제"])
router.include_router(manager_bill_transactions_router, prefix="/bill/transactions", tags=["관리자 > 청구 > 거래내역"])

# 중:백업
router.include_router(manager_bkup_executions_router, prefix="/bkup/executions", tags=["관리자 > 백업 > Executions"])
router.include_router(manager_bkup_recovery_plans_router, prefix="/bkup/recovery-plans", tags=["관리자 > 백업 > Recovery Plans"])
router.include_router(manager_bkup_schedules_router, prefix="/bkup/schedules", tags=["관리자 > 백업 > Schedules"])

# 중:설정
router.include_router(manager_cnfg_configurations_router, prefix="/cnfg/configurations", tags=["관리자 > 설정 > Configurations"])
router.include_router(manager_cnfg_feature_flags_router, prefix="/cnfg/feature-flags", tags=["관리자 > 설정 > Feature Flags"])
router.include_router(manager_cnfg_service_quotas_router, prefix="/cnfg/service-quotas", tags=["관리자 > 설정 > Service Quotas"])
router.include_router(manager_cnfg_tenant_features_router, prefix="/cnfg/tenant-features", tags=["관리자 > 설정 > Tenant Features"])

# 중:사용자권한
router.include_router(manager_idam_api_keys_router, prefix="/idam/api-keys", tags=["관리자 > 사용자권한 > Api Keys"])
router.include_router(manager_idam_login_logs_router, prefix="/idam/login-logs", tags=["관리자 > 사용자권한 > Login Logs"])
router.include_router(manager_idam_permissions_router, prefix="/idam/permissions", tags=["관리자 > 사용자권한 > 권한"])
router.include_router(manager_idam_role_permissions_router, prefix="/idam/role-permissions", tags=["관리자 > 사용자권한 > Role Permissions"])
router.include_router(manager_idam_roles_router, prefix="/idam/roles", tags=["관리자 > 사용자권한 > 역할"])
router.include_router(manager_idam_sessions_router, prefix="/idam/sessions", tags=["관리자 > 사용자권한 > Sessions"])
router.include_router(manager_idam_user_roles_router, prefix="/idam/user-roles", tags=["관리자 > 사용자권한 > User Roles"])
router.include_router(manager_idam_users_router, prefix="/idam/users", tags=["관리자 > 사용자권한 > 사용자"])

# 중:인프라
router.include_router(manager_ifra_resource_usages_router, prefix="/ifra/resource-usages", tags=["관리자 > 인프라 > Resource Usages"])
router.include_router(manager_ifra_resources_router, prefix="/ifra/resources", tags=["관리자 > 인프라 > Resources"])

# 중:통합
router.include_router(manager_intg_apis_router, prefix="/intg/apis", tags=["관리자 > 통합 > Apis"])
router.include_router(manager_intg_rate_limits_router, prefix="/intg/rate-limits", tags=["관리자 > 통합 > Rate Limits"])
router.include_router(manager_intg_webhooks_router, prefix="/intg/webhooks", tags=["관리자 > 통합 > Webhooks"])

# 중:모니터링
router.include_router(manager_mntr_health_checks_router, prefix="/mntr/health-checks", tags=["관리자 > 모니터링 > Health Checks"])
router.include_router(manager_mntr_incidents_router, prefix="/mntr/incidents", tags=["관리자 > 모니터링 > Incidents"])
router.include_router(manager_mntr_system_metrics_router, prefix="/mntr/system-metrics", tags=["관리자 > 모니터링 > System Metrics"])

# 중:알림
router.include_router(manager_noti_campaigns_router, prefix="/noti/campaigns", tags=["관리자 > 알림 > Campaigns"])
router.include_router(manager_noti_notifications_router, prefix="/noti/notifications", tags=["관리자 > 알림 > Notifications"])
router.include_router(manager_noti_templates_router, prefix="/noti/templates", tags=["관리자 > 알림 > Templates"])

# 중:통계
router.include_router(manager_stat_tenant_stats_router, prefix="/stat/tenant-stats", tags=["관리자 > 통계 > Tenant Stats"])
router.include_router(manager_stat_usage_stats_router, prefix="/stat/usage-stats", tags=["관리자 > 통계 > Usage Stats"])

# 중:지원
router.include_router(manager_supt_feedbacks_router, prefix="/supt/feedbacks", tags=["관리자 > 지원 > Feedbacks"])
router.include_router(manager_supt_ticket_comments_router, prefix="/supt/ticket-comments", tags=["관리자 > 지원 > Ticket Comments"])
router.include_router(manager_supt_tickets_router, prefix="/supt/tickets", tags=["관리자 > 지원 > Tickets"])

# 중:테넌트
router.include_router(manager_tnnt_subscriptions_router, prefix="/tnnt/subscriptions", tags=["관리자 > 테넌트 > 구독"])
router.include_router(manager_tnnt_tenants_router, prefix="/tnnt/tenants", tags=["관리자 > 테넌트 > 테넌트"])


# ==================== 대:테넌트 ====================

# 중:기준정보
router.include_router(tenants_adm_code_groups_router, prefix="/adm/code-groups", tags=["테넌트 > 기준정보 > 코드그룹"])
router.include_router(tenants_adm_codes_router, prefix="/adm/codes", tags=["테넌트 > 기준정보 > 코드"])
router.include_router(tenants_adm_currencies_router, prefix="/adm/currencies", tags=["테넌트 > 기준정보 > 통화"])
router.include_router(tenants_adm_exchange_rates_router, prefix="/adm/exchange-rates", tags=["테넌트 > 기준정보 > 환율"])
router.include_router(tenants_adm_payment_terms_router, prefix="/adm/payment-terms", tags=["테넌트 > 기준정보 > Payment Terms"])
router.include_router(tenants_adm_settings_router, prefix="/adm/settings", tags=["테넌트 > 기준정보 > Settings"])
router.include_router(tenants_adm_units_router, prefix="/adm/units", tags=["테넌트 > 기준정보 > Units"])

# 중:서비스관리
router.include_router(tenants_asm_service_requests_router, prefix="/asm/service-requests", tags=["테넌트 > 서비스관리 > Service Requests"])

# 중:고객관리
router.include_router(tenants_crm_activities_router, prefix="/crm/activities", tags=["테넌트 > 고객관리 > Activities"])
router.include_router(tenants_crm_contracts_router, prefix="/crm/contracts", tags=["테넌트 > 고객관리 > Contracts"])
router.include_router(tenants_crm_opportunities_router, prefix="/crm/opportunities", tags=["테넌트 > 고객관리 > Opportunities"])
router.include_router(tenants_crm_partner_addresses_router, prefix="/crm/partner-addresses", tags=["테넌트 > 고객관리 > Partner Addresses"])
router.include_router(tenants_crm_partners_router, prefix="/crm/partners", tags=["테넌트 > 고객관리 > 거래처"])

# 중:재무관리
router.include_router(tenants_fim_accounts_router, prefix="/fim/accounts", tags=["테넌트 > 재무관리 > 계정과목"])
router.include_router(tenants_fim_accounts_payable_router, prefix="/fim/accounts-payable", tags=["테넌트 > 재무관리 > Accounts Payable"])
router.include_router(tenants_fim_accounts_receivable_router, prefix="/fim/accounts-receivable", tags=["테넌트 > 재무관리 > Accounts Receivable"])
router.include_router(tenants_fim_business_documents_router, prefix="/fim/business-documents", tags=["테넌트 > 재무관리 > Business Documents"])
router.include_router(tenants_fim_journal_entries_router, prefix="/fim/journal-entries", tags=["테넌트 > 재무관리 > Journal Entries"])
router.include_router(tenants_fim_payment_transactions_router, prefix="/fim/payment-transactions", tags=["테넌트 > 재무관리 > Payment Transactions"])
router.include_router(tenants_fim_tax_invoices_router, prefix="/fim/tax-invoices", tags=["테넌트 > 재무관리 > Tax Invoices"])

# 중:인사관리
router.include_router(tenants_hrm_employees_router, prefix="/hrm/employees", tags=["테넌트 > 인사관리 > 직원"])
router.include_router(tenants_hrm_salary_structures_router, prefix="/hrm/salary-structures", tags=["테넌트 > 인사관리 > Salary Structures"])

# 중:워크플로우
router.include_router(tenants_lwm_steps_router, prefix="/lwm/steps", tags=["테넌트 > 워크플로우 > Steps"])
router.include_router(tenants_lwm_tasks_router, prefix="/lwm/tasks", tags=["테넌트 > 워크플로우 > Tasks"])
router.include_router(tenants_lwm_workflows_router, prefix="/lwm/workflows", tags=["테넌트 > 워크플로우 > 워크플로우"])

# 중:구매관리
router.include_router(tenants_psm_purchase_orders_router, prefix="/psm/purchase-orders", tags=["테넌트 > 구매관리 > 구매주문"])

# 중:판매관리
router.include_router(tenants_srm_sales_invoices_router, prefix="/srm/sales-invoices", tags=["테넌트 > 판매관리 > Sales Invoices"])
router.include_router(tenants_srm_sales_orders_router, prefix="/srm/sales-orders", tags=["테넌트 > 판매관리 > 판매주문"])
