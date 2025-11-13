CREATE OR REPLACE VIEW tnnt.v_tenant_user_stats AS
SELECT
    tu.tenant_id,
    tu.user_id,
    u.username,
    u.email,
    u.full_name,
    u.user_type,
    tu.role,
    tu.department,
    tu.position,
    tu.employee_id,
    tu.status as tenant_status,
    tu.is_primary,
    tu.is_admin as is_admin,
    tu.start_date,
    tu.close_date,

    -- 역할 정보 집계
    COUNT(tur.id) as role_count,
    STRING_AGG(
        COALESCE(tr.name, r.name),
        ', ' ORDER BY COALESCE(tr.priority, r.priority)
    ) as roles,

    -- 최고 우선순위 역할
    MIN(COALESCE(tr.priority, r.priority)) as highest_priority

FROM
    tnnt.tenant_users tu
JOIN
    idam.users u ON tu.user_id = u.id
LEFT JOIN
    idam.user_roles tur ON tu.id = tur.user_id AND tur.status = 'ACTIVE'
LEFT JOIN
    tnnt.tenant_roles tr ON tur.role_id = tr.id AND tr.is_enabled = TRUE
LEFT JOIN
    idam.roles r ON tr.role_id = r.id
GROUP BY
    tu.tenant_id, tu.user_id, u.username, u.email, u.full_name, u.user_type,
    tu.role, tu.department, tu.position, tu.employee_id,
    tu.status, tu.is_primary, tu.is_admin, tu.start_date, tu.close_date;

COMMENT ON VIEW tnnt.v_tenant_user_summary IS '테넌트 사용자 요약 정보 뷰 (역할 정보 포함)';

-- ============================================================================
-- 테넌트 역할 통계 뷰 (편의성)
-- ============================================================================
CREATE OR REPLACE VIEW tnnt.v_tenant_role_summary AS
SELECT
    tr.tenant_id,
    tr.role_id,
    r.code,
    COALESCE(tr.name, r.name) as name,
    COALESCE(tr.description, r.description) as description,
    r.type,
    r.scope,
    tr.is_default,
    tr.priority as tenant_priority,
    r.priority as global_priority,
    tr.enabled,
    tr.max_users,
    tr.current_users,

    -- 실제 사용자 수 (current_users와 대조용)
    COUNT(tur.id) as actual_user_count

FROM
    tnnt.tenant_roles tr
JOIN
    idam.roles r ON tr.role_id = r.id
LEFT JOIN
    idam.user_roles tur ON tr.id = tur.role_id AND tur.status = 'ACTIVE'
GROUP BY
    tr.tenant_id, tr.role_id, r.code, tr.role_name_override, r.name,
    tr.description_override, r.description, r.type, r.scope,
    tr.is_tenant_default, tr.tenant_priority, r.priority,
    tr.is_enabled, tr.max_users, tr.current_users;

COMMENT ON VIEW tnnt.v_tenant_role_summary IS '테넌트 역할 요약 정보 뷰 (사용자 수 포함)';

-- ============================================================================
-- 트리거 함수: 테넌트 역할 사용자 수 자동 업데이트
-- ============================================================================
CREATE OR REPLACE FUNCTION tnnt.update_tenant_role_user_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 역할 할당 시 사용자 수 증가
        UPDATE tnnt.tenant_roles
        SET current_users = current_users + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.tenant_role_id;
        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        -- 역할 해제 시 사용자 수 감소
        UPDATE tnnt.tenant_roles
        SET current_users = GREATEST(current_users - 1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.tenant_role_id;
        RETURN OLD;

    ELSIF TG_OP = 'UPDATE' THEN
        -- 상태 변경 시 사용자 수 조정
        IF OLD.status = 'ACTIVE' AND NEW.status != 'ACTIVE' THEN
            -- 비활성화
            UPDATE tnnt.tenant_roles
            SET current_users = GREATEST(current_users - 1, 0),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.tenant_role_id;
        ELSIF OLD.status != 'ACTIVE' AND NEW.status = 'ACTIVE' THEN
            -- 활성화
            UPDATE tnnt.tenant_roles
            SET current_users = current_users + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.tenant_role_id;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_tenant_role_user_count
    AFTER INSERT OR UPDATE OR DELETE ON tnnt.tenant_user_roles
    FOR EACH ROW
    EXECUTE FUNCTION tnnt.update_tenant_role_user_count();
