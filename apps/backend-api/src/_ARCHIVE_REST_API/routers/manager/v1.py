"""관리자 API v1 라우터 - 자동 생성 (모든 스키마 포함)"""

from fastapi import APIRouter

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

# Auth 별도 처리 (기존 구조 유지)
from src.modules.manager.auth.router import router as auth_router


router = APIRouter()

# ==================== 대:관리자 ====================

# 인증 (특수 처리)
router.include_router(auth_router, prefix="/auth", tags=["관리자 > 인증 > 로그인"])

# 중:감사
router.include_router(manager_audt_audit_logs_router, prefix="/audt/audit-logs", tags=["관리자 > 감사 > 감사로그"])
router.include_router(manager_audt_compliances_router, prefix="/audt/compliances", tags=["관리자 > 감사 > 컴플라이언스"])
router.include_router(manager_audt_policies_router, prefix="/audt/policies", tags=["관리자 > 감사 > 정책"])

# 중:자동화
router.include_router(manager_auto_executions_router, prefix="/auto/executions", tags=["관리자 > 자동화 > 실행내역"])
router.include_router(manager_auto_tasks_router, prefix="/auto/tasks", tags=["관리자 > 자동화 > 작업"])
router.include_router(manager_auto_workflows_router, prefix="/auto/workflows", tags=["관리자 > 자동화 > 워크플로우"])

# 중:청구
router.include_router(manager_bill_invoices_router, prefix="/bill/invoices", tags=["관리자 > 청구 > 청구서"])
router.include_router(manager_bill_plans_router, prefix="/bill/plans", tags=["관리자 > 청구 > 요금제"])
router.include_router(manager_bill_transactions_router, prefix="/bill/transactions", tags=["관리자 > 청구 > 거래내역"])

# 중:백업
router.include_router(manager_bkup_executions_router, prefix="/bkup/executions", tags=["관리자 > 백업 > 실행내역"])
router.include_router(manager_bkup_recovery_plans_router, prefix="/bkup/recovery-plans", tags=["관리자 > 백업 > 복구계획"])
router.include_router(manager_bkup_schedules_router, prefix="/bkup/schedules", tags=["관리자 > 백업 > 스케줄"])

# 중:설정
router.include_router(manager_cnfg_configurations_router, prefix="/cnfg/configurations", tags=["관리자 > 설정 > 구성"])
router.include_router(manager_cnfg_feature_flags_router, prefix="/cnfg/feature-flags", tags=["관리자 > 설정 > 기능플래그"])
router.include_router(manager_cnfg_service_quotas_router, prefix="/cnfg/service-quotas", tags=["관리자 > 설정 > 서비스할당량"])
router.include_router(manager_cnfg_tenant_features_router, prefix="/cnfg/tenant-features", tags=["관리자 > 설정 > 테넌트기능"])

# 중:사용자권한
router.include_router(manager_idam_api_keys_router, prefix="/idam/api-keys", tags=["관리자 > 사용자권한 > API키"])
router.include_router(manager_idam_login_logs_router, prefix="/idam/login-logs", tags=["관리자 > 사용자권한 > 로그인로그"])
router.include_router(manager_idam_permissions_router, prefix="/idam/permissions", tags=["관리자 > 사용자권한 > 권한"])
router.include_router(manager_idam_role_permissions_router, prefix="/idam/role-permissions", tags=["관리자 > 사용자권한 > 역할권한"])
router.include_router(manager_idam_roles_router, prefix="/idam/roles", tags=["관리자 > 사용자권한 > 역할"])
router.include_router(manager_idam_sessions_router, prefix="/idam/sessions", tags=["관리자 > 사용자권한 > 세션"])
router.include_router(manager_idam_user_roles_router, prefix="/idam/user-roles", tags=["관리자 > 사용자권한 > 사용자역할"])
router.include_router(manager_idam_users_router, prefix="/idam/users", tags=["관리자 > 사용자권한 > 사용자"])

# 중:인프라
router.include_router(manager_ifra_resource_usages_router, prefix="/ifra/resource-usages", tags=["관리자 > 인프라 > 리소스사용량"])
router.include_router(manager_ifra_resources_router, prefix="/ifra/resources", tags=["관리자 > 인프라 > 리소스"])

# 중:통합
router.include_router(manager_intg_apis_router, prefix="/intg/apis", tags=["관리자 > 통합 > 외부API"])
router.include_router(manager_intg_rate_limits_router, prefix="/intg/rate-limits", tags=["관리자 > 통합 > API제한"])
router.include_router(manager_intg_webhooks_router, prefix="/intg/webhooks", tags=["관리자 > 통합 > 웹훅"])

# 중:모니터링
router.include_router(manager_mntr_health_checks_router, prefix="/mntr/health-checks", tags=["관리자 > 모니터링 > 헬스체크"])
router.include_router(manager_mntr_incidents_router, prefix="/mntr/incidents", tags=["관리자 > 모니터링 > 인시던트"])
router.include_router(manager_mntr_system_metrics_router, prefix="/mntr/system-metrics", tags=["관리자 > 모니터링 > 시스템메트릭"])

# 중:알림
router.include_router(manager_noti_campaigns_router, prefix="/noti/campaigns", tags=["관리자 > 알림 > 캠페인"])
router.include_router(manager_noti_notifications_router, prefix="/noti/notifications", tags=["관리자 > 알림 > 알림"])
router.include_router(manager_noti_templates_router, prefix="/noti/templates", tags=["관리자 > 알림 > 템플릿"])

# 중:통계
router.include_router(manager_stat_tenant_stats_router, prefix="/stat/tenant-stats", tags=["관리자 > 통계 > 테넌트통계"])
router.include_router(manager_stat_usage_stats_router, prefix="/stat/usage-stats", tags=["관리자 > 통계 > 사용통계"])

# 중:지원
router.include_router(manager_supt_feedbacks_router, prefix="/supt/feedbacks", tags=["관리자 > 지원 > 피드백"])
router.include_router(manager_supt_ticket_comments_router, prefix="/supt/ticket-comments", tags=["관리자 > 지원 > 티켓댓글"])
router.include_router(manager_supt_tickets_router, prefix="/supt/tickets", tags=["관리자 > 지원 > 티켓"])

# 중:테넌트
router.include_router(manager_tnnt_subscriptions_router, prefix="/tnnt/subscriptions", tags=["관리자 > 테넌트 > 구독"])
router.include_router(manager_tnnt_tenants_router, prefix="/tnnt/tenants", tags=["관리자 > 테넌트 > 테넌트"])
