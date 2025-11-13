-- =====================================================================================
-- 초기 데이터: sys.modules
-- 설명: ConexGrow 시스템의 16개 모듈 마스터 데이터
-- 작성일: 2025-01-26
-- =====================================================================================

-- 모듈 초기 데이터 삽입
INSERT INTO sys.modules (
    module_code, module_name, module_name_en, description,
    parent_module_id, display_order, level_depth,
    icon, color_scheme, route_path,
    is_active, is_core, requires_license, license_type,
    schema_name, version
) VALUES
-- 필수 코어 모듈 (is_core = true)
('SYS', '시스템 관리', 'System Management', '사용자, 역할, 권한 등 시스템 기본 설정', NULL, 1, 1, 'settings', 'gray', '/system', true, true, false, NULL, 'sys', '1.0.0'),
('ADM', '관리자', 'Administration', '공통 코드, 단위, 환율, 결제조건 등 기본 관리', NULL, 2, 1, 'database', 'blue', '/admin', true, true, false, NULL, 'adm', '1.0.0'),
('COM', '공통', 'Common', '공통 코드, 워크플로우 등 전사 공통 기능', NULL, 3, 1, 'layers', 'purple', '/common', true, true, false, NULL, 'com', '1.0.0'),

-- 인사 관리
('HRM', '인사 관리', 'Human Resources', '조직, 사원, 급여, 근태 관리', NULL, 10, 1, 'users', 'green', '/hr', true, false, true, 'STANDARD', 'hrm', '1.0.0'),

-- 고객 관계 관리
('CRM', '고객 관계 관리', 'Customer Relationship Management', '거래처, 리드, 영업기회, 활동 관리', NULL, 20, 1, 'user-check', 'cyan', '/crm', true, false, true, 'PREMIUM', 'crm', '1.0.0'),

-- 제품 정보 관리
('PIM', '제품 정보 관리', 'Product Information Management', '제품, 카테고리, 브랜드, 옵션 관리', NULL, 30, 1, 'package', 'orange', '/products', true, false, true, 'STANDARD', 'pim', '1.0.0'),

-- 창고 관리
('WMS', '창고 관리', 'Warehouse Management', '창고, 로케이션, 입출고, 재고 관리', NULL, 40, 1, 'warehouse', 'indigo', '/warehouse', true, false, true, 'PREMIUM', 'wms', '1.0.0'),

-- 승인 관리
('APM', '승인 관리', 'Approval Management', '승인선, 승인요청, 승인이력 관리', NULL, 50, 1, 'check-circle', 'teal', '/approval', true, false, true, 'STANDARD', 'apm', '1.0.0'),

-- 재고 관리
('IVM', '재고 관리', 'Inventory Management', '재고잔량, 이동, 조정, 실사, 로트 관리', NULL, 60, 1, 'boxes', 'yellow', '/inventory', true, false, true, 'PREMIUM', 'ivm', '1.0.0'),

-- 구매 관리
('PSM', '구매 관리', 'Purchasing Management', '구매요청, 구매발주, 입고, 견적 관리', NULL, 70, 1, 'shopping-cart', 'blue', '/purchase', true, false, true, 'PREMIUM', 'psm', '1.0.0'),

-- 판매 관리
('SRM', '판매 관리', 'Sales & Revenue Management', '견적, 수주, 출하, 반품, 프로모션 관리', NULL, 80, 1, 'trending-up', 'green', '/sales', true, false, true, 'PREMIUM', 'srm', '1.0.0'),

-- 고객 서비스 관리
('ASM', '고객 서비스 관리', 'After-Sales Management', '서비스 요청, 작업, 지원티켓, FAQ 관리', NULL, 90, 1, 'headphones', 'pink', '/service', true, false, true, 'STANDARD', 'asm', '1.0.0'),

-- 재무회계
('FIM', '재무회계', 'Financial & Accounting', '계정과목, 분개, 채권/채무, 세금계산서 관리', NULL, 100, 1, 'dollar-sign', 'emerald', '/finance', true, false, true, 'PREMIUM', 'fim', '1.0.0'),

-- 고정자산 관리
('FAM', '고정자산 관리', 'Fixed Asset Management', '고정자산, 감가상각, 처분 관리', NULL, 110, 1, 'building', 'stone', '/assets', true, false, true, 'STANDARD', 'fam', '1.0.0'),

-- 워크플로우 관리
('LWM', '워크플로우 관리', 'Workflow Management', '워크플로우, 단계, 태스크 관리', NULL, 120, 1, 'git-branch', 'violet', '/workflow', true, false, true, 'PREMIUM', 'lwm', '1.0.0'),

-- BI/분석
('BIM', 'BI/분석', 'Business Intelligence', 'KPI, 지표, 판매/구매 분석', NULL, 130, 1, 'bar-chart', 'rose', '/analytics', true, false, true, 'ENTERPRISE', 'bim', '1.0.0')

ON CONFLICT (module_code) DO NOTHING;

-- 확인 쿼리 (주석 처리)
-- SELECT module_code, module_name, schema_name, is_core, license_type 
-- FROM sys.modules 
-- ORDER BY display_order;
