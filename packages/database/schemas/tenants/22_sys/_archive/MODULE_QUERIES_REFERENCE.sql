-- =====================================================================================
-- 파일: 모듈 관리 쿼리 참고 자료
-- 설명: sys.modules와 sys.tenant_modules 관련 유용한 쿼리 모음
-- 작성일: 2025-01-26
-- =====================================================================================

-- ============================================================================
-- 1. 모듈 조회 쿼리
-- ============================================================================

-- 1.1. 전체 모듈 목록 (표시 순서대로)
SELECT 
    module_code,
    module_name,
    module_name_en,
    schema_name,
    icon,
    route_path,
    is_core,
    license_type
FROM sys.modules
ORDER BY display_order;

-- 1.2. 활성 모듈만 조회
SELECT 
    module_code,
    module_name,
    icon,
    color_scheme,
    route_path
FROM sys.modules
WHERE is_active = true
ORDER BY display_order;

-- 1.3. 라이선스별 모듈 조회
SELECT 
    license_type,
    COUNT(*) as module_count,
    string_agg(module_name, ', ' ORDER BY display_order) as modules
FROM sys.modules
WHERE requires_license = true
GROUP BY license_type
ORDER BY 
    CASE license_type
        WHEN 'BASIC' THEN 1
        WHEN 'STANDARD' THEN 2
        WHEN 'PREMIUM' THEN 3
        WHEN 'ENTERPRISE' THEN 4
    END;

-- 1.4. 코어 모듈 vs 옵션 모듈
SELECT 
    CASE WHEN is_core THEN '코어 모듈' ELSE '옵션 모듈' END as module_type,
    COUNT(*) as count,
    string_agg(module_code, ', ' ORDER BY display_order) as modules
FROM sys.modules
GROUP BY is_core;

-- ============================================================================
-- 2. 테넌트 모듈 관리
-- ============================================================================

-- 2.1. 특정 테넌트의 활성 모듈 조회
SELECT 
    m.module_code,
    m.module_name,
    m.icon,
    m.route_path,
    tm.subscribed_at,
    tm.expires_at,
    tm.access_count
FROM sys.modules m
INNER JOIN sys.tenant_modules tm ON m.id = tm.module_id
WHERE tm.tenant_id = :tenant_id
  AND tm.is_enabled = true
ORDER BY m.display_order;

-- 2.2. 테넌트에게 모듈 구독 추가
INSERT INTO sys.tenant_modules (tenant_id, module_id, is_enabled, subscribed_at)
SELECT 
    :tenant_id,
    id,
    true,
    CURRENT_TIMESTAMP
FROM sys.modules
WHERE module_code IN ('PSM', 'SRM', 'IVM')
ON CONFLICT (tenant_id, module_id) DO NOTHING;

-- 2.3. 만료 예정 구독 조회 (30일 이내)
SELECT 
    tm.tenant_id,
    m.module_code,
    m.module_name,
    tm.expires_at,
    (tm.expires_at - CURRENT_TIMESTAMP) as time_remaining
FROM sys.tenant_modules tm
INNER JOIN sys.modules m ON tm.module_id = m.id
WHERE tm.expires_at IS NOT NULL
  AND tm.expires_at <= CURRENT_TIMESTAMP + INTERVAL '30 days'
  AND tm.is_enabled = true
ORDER BY tm.expires_at;

-- 2.4. 모듈 활성화/비활성화
UPDATE sys.tenant_modules
SET 
    is_enabled = :is_enabled,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = :user_id
WHERE tenant_id = :tenant_id
  AND module_id = (SELECT id FROM sys.modules WHERE module_code = :module_code);

-- ============================================================================
-- 3. 통계 및 분석
-- ============================================================================

-- 3.1. 모듈별 구독 테넌트 수
SELECT 
    m.module_code,
    m.module_name,
    COUNT(DISTINCT tm.tenant_id) as tenant_count,
    COUNT(DISTINCT CASE WHEN tm.is_enabled THEN tm.tenant_id END) as active_tenant_count
FROM sys.modules m
LEFT JOIN sys.tenant_modules tm ON m.id = tm.module_id
GROUP BY m.module_code, m.module_name
ORDER BY active_tenant_count DESC;

-- 3.2. 모듈별 사용 통계
SELECT 
    m.module_code,
    m.module_name,
    COUNT(tm.tenant_id) as subscribed_count,
    AVG(tm.access_count) as avg_access_count,
    MAX(tm.last_accessed_at) as last_accessed
FROM sys.modules m
LEFT JOIN sys.tenant_modules tm ON m.id = tm.module_id
WHERE tm.is_enabled = true
GROUP BY m.module_code, m.module_name
ORDER BY avg_access_count DESC NULLS LAST;

-- 3.3. 테넌트별 모듈 구독 현황
SELECT 
    tm.tenant_id,
    COUNT(DISTINCT tm.module_id) as total_modules,
    COUNT(DISTINCT CASE WHEN tm.is_enabled THEN tm.module_id END) as active_modules,
    SUM(tm.access_count) as total_access_count
FROM sys.tenant_modules tm
GROUP BY tm.tenant_id
ORDER BY active_modules DESC;

-- 3.4. 라이선스 티어별 구독 현황
SELECT 
    m.license_type,
    COUNT(DISTINCT tm.tenant_id) as tenant_count,
    SUM(tm.access_count) as total_accesses
FROM sys.modules m
INNER JOIN sys.tenant_modules tm ON m.id = tm.module_id
WHERE m.requires_license = true
  AND tm.is_enabled = true
GROUP BY m.license_type
ORDER BY 
    CASE m.license_type
        WHEN 'BASIC' THEN 1
        WHEN 'STANDARD' THEN 2
        WHEN 'PREMIUM' THEN 3
        WHEN 'ENTERPRISE' THEN 4
    END;

-- ============================================================================
-- 4. 권한 관리 (module_id FK 활용)
-- ============================================================================

-- 4.1. 모듈별 권한 목록
SELECT 
    m.module_code,
    m.module_name,
    p.permission_code,
    p.permission_name,
    p.resource,
    p.action
FROM sys.modules m
INNER JOIN sys.permissions p ON m.id = p.module_id
WHERE m.module_code = :module_code
  AND p.is_active = true
ORDER BY p.resource, p.action;

-- 4.2. 테넌트가 사용 가능한 권한 조회
SELECT DISTINCT
    m.module_code,
    p.permission_code,
    p.permission_name,
    p.resource,
    p.action
FROM sys.modules m
INNER JOIN sys.tenant_modules tm ON m.id = tm.module_id
INNER JOIN sys.permissions p ON m.id = p.module_id
WHERE tm.tenant_id = :tenant_id
  AND tm.is_enabled = true
  AND p.is_active = true
ORDER BY m.display_order, p.resource, p.action;

-- ============================================================================
-- 5. 동적 UI 생성용 쿼리
-- ============================================================================

-- 5.1. 네비게이션 메뉴 데이터 (JSON 형식)
SELECT 
    json_agg(
        json_build_object(
            'code', module_code,
            'name', module_name,
            'nameEn', module_name_en,
            'icon', icon,
            'colorScheme', color_scheme,
            'routePath', route_path,
            'displayOrder', display_order
        ) ORDER BY display_order
    ) as navigation_items
FROM sys.modules
WHERE is_active = true;

-- 5.2. 테넌트별 네비게이션 메뉴 (활성 모듈만)
SELECT 
    json_agg(
        json_build_object(
            'code', m.module_code,
            'name', m.module_name,
            'icon', m.icon,
            'route', m.route_path,
            'accessCount', tm.access_count
        ) ORDER BY m.display_order
    ) as menu_items
FROM sys.modules m
INNER JOIN sys.tenant_modules tm ON m.id = tm.module_id
WHERE tm.tenant_id = :tenant_id
  AND tm.is_enabled = true
  AND m.is_active = true;

-- ============================================================================
-- 6. 유지보수 쿼리
-- ============================================================================

-- 6.1. 미사용 모듈 찾기 (구독이 없는 모듈)
SELECT 
    m.module_code,
    m.module_name,
    m.created_at
FROM sys.modules m
LEFT JOIN sys.tenant_modules tm ON m.id = tm.module_id
WHERE tm.id IS NULL
  AND m.is_active = true
ORDER BY m.created_at;

-- 6.2. 만료된 구독 정리
UPDATE sys.tenant_modules
SET 
    is_enabled = false,
    updated_at = CURRENT_TIMESTAMP
WHERE expires_at IS NOT NULL
  AND expires_at < CURRENT_TIMESTAMP
  AND is_enabled = true;

-- 6.3. 모듈 사용량 업데이트 (접근 시마다 호출)
UPDATE sys.tenant_modules
SET 
    last_accessed_at = CURRENT_TIMESTAMP,
    access_count = access_count + 1
WHERE tenant_id = :tenant_id
  AND module_id = (SELECT id FROM sys.modules WHERE module_code = :module_code);

-- 6.4. 데이터 일관성 검증
-- 권한 테이블에 유효하지 않은 module_id가 있는지 확인
SELECT 
    p.permission_code,
    p.module_code as old_module_code,
    p.module_id
FROM sys.permissions p
LEFT JOIN sys.modules m ON p.module_id = m.id
WHERE p.module_id IS NOT NULL
  AND m.id IS NULL;

-- ============================================================================
-- 7. 백업 및 복원
-- ============================================================================

-- 7.1. 모듈 설정 백업
COPY (
    SELECT * FROM sys.modules
    ORDER BY display_order
) TO '/tmp/modules_backup.csv' WITH CSV HEADER;

-- 7.2. 테넌트 모듈 구독 백업
COPY (
    SELECT 
        tm.*,
        m.module_code
    FROM sys.tenant_modules tm
    INNER JOIN sys.modules m ON tm.module_id = m.id
    ORDER BY tm.tenant_id, m.display_order
) TO '/tmp/tenant_modules_backup.csv' WITH CSV HEADER;

-- ============================================================================
-- 8. 성능 모니터링
-- ============================================================================

-- 8.1. 인덱스 사용 통계
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'sys'
  AND (tablename = 'modules' OR tablename = 'tenant_modules')
ORDER BY idx_scan DESC;

-- 8.2. 테이블 크기 확인
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'sys'
  AND (tablename = 'modules' OR tablename = 'tenant_modules');

-- ============================================================================
-- 9. 개발/테스트용 쿼리
-- ============================================================================

-- 9.1. 테스트 테넌트 모듈 구독 생성 (모든 모듈)
INSERT INTO sys.tenant_modules (tenant_id, module_id, is_enabled, subscribed_at)
SELECT 
    :test_tenant_id,
    id,
    true,
    CURRENT_TIMESTAMP
FROM sys.modules
WHERE is_active = true
ON CONFLICT (tenant_id, module_id) DO UPDATE
SET is_enabled = true;

-- 9.2. 특정 모듈의 모든 정보 조회 (디버깅용)
SELECT 
    m.*,
    COUNT(DISTINCT tm.tenant_id) as tenant_count,
    COUNT(DISTINCT p.id) as permission_count
FROM sys.modules m
LEFT JOIN sys.tenant_modules tm ON m.id = tm.module_id AND tm.is_enabled = true
LEFT JOIN sys.permissions p ON m.id = p.module_id AND p.is_active = true
WHERE m.module_code = :module_code
GROUP BY m.id;

-- ============================================================================
-- 참고: 매개변수 설명
-- ============================================================================
-- :tenant_id      - 테넌트 UUID
-- :module_code    - 모듈 코드 (예: 'PSM', 'SRM')
-- :user_id        - 사용자 UUID
-- :is_enabled     - 활성화 여부 (true/false)
-- :test_tenant_id - 테스트 테넌트 UUID
