-- =====================================================================================
-- Manager Database - Unified Schema Initialization Script
-- =====================================================================================
-- 목적: Manager 데이터베이스의 모든 스키마와 테이블을 생성하는 통합 초기화 스크립트
-- 생성일: 2024-10-26
-- 실행 순서: 스키마 생성 -> 테이블 생성 (외래키 의존성 순서 고려)
--
-- 주의사항:
-- 1. 이 스크립트는 통합 실행 시에만 사용
-- 2. 개별 스키마 초기화 시에는 각 스키마 폴더의 파일들을 순차적으로 실행
-- 3. 외래키 제약조건 때문에 tnnt 스키마가 가장 먼저 생성되어야 함
-- =====================================================================================

-- =====================================================================================
-- 1단계: 모든 스키마 생성 (Schema Creation)
-- =====================================================================================

-- 01_tnnt - 테넌트 관리
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/00_schema_init.sql'

-- 02_idam - 사용자 및 접근 관리
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/00_schema_init.sql'

-- 03_bill - 요금 및 청구 관리
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/03_bill/00_schema_init.sql'

-- 04_ifra - 인프라 및 리소스 관리
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/04_ifra/00_schema_init.sql'

-- 05_stat - 성능 및 분석
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/05_stat/00_schema_init.sql'

-- 06_mntr - 시스템 모니터링
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/06_mntr/00_schema_init.sql'

-- 07_intg - 외부 연동
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/07_intg/00_schema_init.sql'

-- 08_supt - 고객 지원
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/08_supt/00_schema_init.sql'

-- 09_audt - 보안 및 감사
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/09_audt/00_schema_init.sql'

-- 10_auto - 자동화
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/10_auto/00_schema_init.sql'

-- 11_cnfg - 설정
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/11_cnfg/00_schema_init.sql'

-- 12_noti - 알림 및 커뮤니케이션
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/12_noti/00_schema.sql'

-- 13_bkup - 백업 및 복구
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/13_bkup/00_schema.sql'

-- =====================================================================================
-- 2단계: 테넌트 관리 테이블 생성 (tnnt schema - Root Domain)
-- =====================================================================================
-- 주의: tnnt 스키마가 다른 스키마의 외래키 참조 기준이므로 가장 먼저 생성

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/01_tenants.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/02_subscriptions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/03_onboardings.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/04_tenant_users.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/05_tenant_roles.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/01_tnnt/06_views_functions.sql'

-- =====================================================================================
-- 3단계: 사용자 및 접근 관리 테이블 생성 (idam schema - Identity & Access Management)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/01_users.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/02_permissions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/03_roles.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/04_role_permissions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/05_user_roles.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/06_api_keys.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/07_sessions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/02_idam/08_login_logs.sql'

-- =====================================================================================
-- 4단계: 요금 및 청구 관리 테이블 생성 (bill schema - Billing Management)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/03_bill/01_plans.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/03_bill/02_invoices.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/03_bill/03_transactions.sql'

-- =====================================================================================
-- 5단계: 인프라 및 리소스 관리 테이블 생성 (ifra schema - Infrastructure Management)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/04_ifra/01_resources.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/04_ifra/02_resource_usages.sql'

-- =====================================================================================
-- 6단계: 성능 및 분석 테이블 생성 (stat schema - Statistics)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/05_stat/01_tenant_stats.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/05_stat/02_usage_stats.sql'

-- =====================================================================================
-- 7단계: 시스템 모니터링 테이블 생성 (mntr schema - Monitoring)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/06_mntr/01_health_checks.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/06_mntr/02_incidents.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/06_mntr/03_system_metrics.sql'

-- =====================================================================================
-- 8단계: 외부 연동 테이블 생성 (intg schema - Integration)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/07_intg/01_apis.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/07_intg/02_webhooks.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/07_intg/03_rate_limits.sql'

-- =====================================================================================
-- 9단계: 고객 지원 테이블 생성 (supt schema - Support Management)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/08_supt/01_tickets.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/08_supt/02_ticket_comments.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/08_supt/03_feedbacks.sql'

-- =====================================================================================
-- 10단계: 보안 및 감사 테이블 생성 (audt schema - Audit)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/09_audt/01_audit_logs.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/09_audt/02_compliances.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/09_audt/03_policies.sql'

-- =====================================================================================
-- 11단계: 자동화 테이블 생성 (auto schema - Automation)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/10_auto/01_workflows.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/10_auto/02_executions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/10_auto/03_tasks.sql'

-- =====================================================================================
-- 12단계: 설정 테이블 생성 (cnfg schema - Configuration)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/11_cnfg/01_configurations.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/11_cnfg/02_feature_flags.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/11_cnfg/03_tenant_features.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/11_cnfg/04_service_quotas.sql'

-- =====================================================================================
-- 13단계: 알림 및 커뮤니케이션 테이블 생성 (noti schema - Notifications)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/12_noti/01_notifications.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/12_noti/02_templates.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/12_noti/03_campaigns.sql'

-- =====================================================================================
-- 14단계: 백업 및 복구 테이블 생성 (bkup schema - Backup & Disaster Recovery)
-- =====================================================================================

\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/13_bkup/01_executions.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/13_bkup/02_schedules.sql'
\i '/home/itjee/workspace/cxg/packages/database/schemas/manager/13_bkup/03_recovery_plans.sql'

-- =====================================================================================
-- 완료 메시지
-- =====================================================================================
\echo '=========================================='
\echo 'Manager Database Initialization Complete!'
\echo '=========================================='
\echo '✓ 13개 스키마 생성 완료'
\echo '✓ 모든 테이블 생성 완료'
\echo '✓ 모든 인덱스 생성 완료'
\echo '=========================================='
