-- =====================================================================================
-- 파일: 05_menus_data.sql
-- 설명: 사이드바 메뉴 초기 데이터 INSERT 스크립트
-- 작성일: 2025-11-04
-- 기준: /apps/tenants-web/src/constants/menu-config.tsx
-- =====================================================================================

-- 기존 데이터 삭제 (개발 환경용)
-- TRUNCATE TABLE sys.menus CASCADE;

-- =====================================================================================
-- LEVEL 0: 대시보드
-- =====================================================================================

-- 대시보드 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('DASHBOARD', '대시보드', 'Dashboard', '홈 및 개요', NULL, 0, 1, 'FOLDER', 'SYS', 'home', 'lucide', true, true);

-- 홈
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, is_visible, is_active)
VALUES ('DASHBOARD_HOME', '홈', 'Home', '대시보드 홈', (SELECT id FROM sys.menus WHERE code = 'DASHBOARD'), 1, 1, 'MENU', 'SYS', '/overview', '@/pages/overview', 'home', 'lucide', true, true);

-- =====================================================================================
-- LEVEL 0: 포탈
-- =====================================================================================

-- 포탈 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('PORTAL', '포탈', 'Portal', '영업, 거래처, 제품 통합 포탈', NULL, 0, 2, 'FOLDER', 'BIM', 'gauge', 'lucide', true, true);

-- 영업사원 포탈
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, is_visible, is_active)
VALUES ('PORTAL_SALES', '영업사원 포탈', 'Sales Portal', '영업사원 포탈', (SELECT id FROM sys.menus WHERE code = 'PORTAL'), 1, 1, 'MENU', 'BIM', '/bim/sales-portal', '@/pages/bim/sales-portal', 'gauge', 'lucide', true, true);

-- 거래처 포탈
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, is_visible, is_active)
VALUES ('PORTAL_PARTNER', '거래처 포탈', 'Partner Portal', '거래처 포탈', (SELECT id FROM sys.menus WHERE code = 'PORTAL'), 1, 2, 'MENU', 'BIM', '/bim/partner-portal/1', '@/pages/bim/partner-portal', 'store', 'lucide', true, true);

-- 제품 포탈
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, is_visible, is_active)
VALUES ('PORTAL_PRODUCT', '제품 포탈', 'Product Portal', '제품 포탈', (SELECT id FROM sys.menus WHERE code = 'PORTAL'), 1, 3, 'MENU', 'BIM', '/bim/product-portal/1', '@/pages/bim/product-portal', 'box', 'lucide', true, true);

-- =====================================================================================
-- LEVEL 0: 기본설정 (ADM - Administration)
-- =====================================================================================

-- 기본설정 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('ADM', '기본설정', 'Administration', '공통 코드, 환율, 단위 등 기본 데이터', NULL, 0, 3, 'FOLDER', 'ADM', 'settings', 'lucide', true, true);

-- 코드관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_CODES', '코드관리', 'Codes', '시스템 코드 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 1, 'MENU', 'ADM', '/adm/codes', '@/pages/adm/codes', true, true);

-- 코드그룹
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_CODE_GROUPS', '코드그룹', 'Code Groups', '코드 그룹 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 2, 'MENU', 'ADM', '/adm/code-groups', '@/pages/adm/code-groups', true, true);

-- 통화관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_CURRENCIES', '통화관리', 'Currencies', '통화 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 3, 'MENU', 'ADM', '/adm/currencies', '@/pages/adm/currencies', true, true);

-- 환율관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_EXCHANGE_RATES', '환율관리', 'Exchange Rates', '환율 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 4, 'MENU', 'ADM', '/adm/exchange-rates', '@/pages/adm/exchange-rates', true, true);

-- 단위관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_UNITS', '단위관리', 'Units', '단위 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 5, 'MENU', 'ADM', '/adm/units', '@/pages/adm/units', true, true);

-- 결제조건
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('ADM_PAYMENT_TERMS', '결제조건', 'Payment Terms', '결제 조건 관리', (SELECT id FROM sys.menus WHERE code = 'ADM'), 1, 6, 'MENU', 'ADM', '/adm/payment-terms', '@/pages/adm/payment-terms', true, true);

-- =====================================================================================
-- LEVEL 0: 인사/급여 (HRM - Human Resource Management)
-- =====================================================================================

-- 인사/급여 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('HRM', '인사/급여', 'HR & Payroll', '직원, 부서, 급여, 근태 관리', NULL, 0, 4, 'FOLDER', 'HRM', 'users', 'lucide', true, true);

-- 부서관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_DEPARTMENTS', '부서관리', 'Departments', '부서 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 1, 'MENU', 'HRM', '/hrm/departments', '@/pages/hrm/departments', true, true);

-- 부서변경이력
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_DEPT_HISTORIES', '부서변경이력', 'Department Histories', '부서 변경 이력', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 2, 'MENU', 'HRM', '/hrm/department-histories', '@/pages/hrm/department-histories', true, true);

-- 사원관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_EMPLOYEES', '사원관리', 'Employees', '사원 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 3, 'MENU', 'HRM', '/hrm/employees', '@/pages/hrm/employees', true, true);

-- 인사발령
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_EMP_HISTORIES', '인사발령', 'Employee Histories', '인사 발령 이력', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 4, 'MENU', 'HRM', '/hrm/employee-histories', '@/pages/hrm/employee-histories', true, true);

-- 급여구조
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_PAYROLL_STRUCTURES', '급여구조', 'Payroll Structures', '급여 구조 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 5, 'MENU', 'HRM', '/hrm/payroll-structures', '@/pages/hrm/payroll-structures', true, true);

-- 급여기록
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_PAYROLL_RECORDS', '급여기록', 'Payroll Records', '급여 기록 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 6, 'MENU', 'HRM', '/hrm/payroll-records', '@/pages/hrm/payroll-records', true, true);

-- 근태관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_ATTENDANCES', '근태관리', 'Attendances', '근태 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 7, 'MENU', 'HRM', '/hrm/attendances', '@/pages/hrm/attendances', true, true);

-- 휴가관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_ABSENCES', '휴가관리', 'Absences', '휴가 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 8, 'MENU', 'HRM', '/hrm/absences', '@/pages/hrm/absences', true, true);

-- 휴가정책
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('HRM_LEAVE_POLICIES', '휴가정책', 'Leave Policies', '휴가 정책 관리', (SELECT id FROM sys.menus WHERE code = 'HRM'), 1, 9, 'MENU', 'HRM', '/hrm/leave-policies', '@/pages/hrm/leave-policies', true, true);

-- =====================================================================================
-- LEVEL 0: 고객관리 (CRM - Customer Relationship Management)
-- =====================================================================================

-- 고객관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('CRM', '고객관리', 'CRM', '거래처, 영업기회, 활동 관리', NULL, 0, 5, 'FOLDER', 'CRM', 'briefcase', 'lucide', true, true);

-- 거래처 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('CRM_PARTNERS', '거래처 관리', 'Partners', '거래처 관리', (SELECT id FROM sys.menus WHERE code = 'CRM'), 1, 1, 'MENU', 'CRM', '/crm/partners', '@/pages/crm/partners', true, true);

-- 거래처 연락처
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('CRM_PARTNER_CONTACTS', '거래처 연락처', 'Partner Contacts', '거래처 연락처 관리', (SELECT id FROM sys.menus WHERE code = 'CRM'), 1, 2, 'MENU', 'CRM', '/crm/partner-contacts', '@/pages/crm/partner-contacts', true, true);

-- 영업 기회
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('CRM_OPPORTUNITIES', '영업 기회', 'Opportunities', '영업 기회 관리', (SELECT id FROM sys.menus WHERE code = 'CRM'), 1, 3, 'MENU', 'CRM', '/crm/opportunities', '@/pages/crm/opportunities', true, true);

-- 활동 기록
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('CRM_ACTIVITIES', '활동 기록', 'Activities', '영업 활동 기록', (SELECT id FROM sys.menus WHERE code = 'CRM'), 1, 4, 'MENU', 'CRM', '/crm/activities', '@/pages/crm/activities', true, true);

-- 캠페인 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('CRM_CAMPAIGNS', '캠페인 관리', 'Campaigns', '마케팅 캠페인 관리', (SELECT id FROM sys.menus WHERE code = 'CRM'), 1, 5, 'MENU', 'CRM', '/crm/campaigns', '@/pages/crm/campaigns', true, true);

-- =====================================================================================
-- LEVEL 0: 제품관리 (PIM - Product Information Management)
-- =====================================================================================

-- 제품관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('PIM', '제품관리', 'PIM', '제품, 카테고리, 브랜드 관리', NULL, 0, 6, 'FOLDER', 'PIM', 'package', 'lucide', true, true);

-- 제품
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PIM_PRODUCTS', '제품', 'Products', '제품 관리', (SELECT id FROM sys.menus WHERE code = 'PIM'), 1, 1, 'MENU', 'PIM', '/pim/products', '@/pages/pim/products', true, true);

-- 카테고리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PIM_CATEGORIES', '카테고리', 'Categories', '제품 카테고리 관리', (SELECT id FROM sys.menus WHERE code = 'PIM'), 1, 2, 'MENU', 'PIM', '/pim/categories', '@/pages/pim/categories', true, true);

-- 브랜드
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PIM_BRANDS', '브랜드', 'Brands', '브랜드 관리', (SELECT id FROM sys.menus WHERE code = 'PIM'), 1, 3, 'MENU', 'PIM', '/pim/brands', '@/pages/pim/brands', true, true);

-- 제조사
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PIM_MAKERS', '제조사', 'Makers', '제조사 관리', (SELECT id FROM sys.menus WHERE code = 'PIM'), 1, 4, 'MENU', 'PIM', '/pim/makers', '@/pages/pim/makers', true, true);

-- 제품변형
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PIM_PRODUCT_VARIANTS', '제품변형', 'Product Variants', '제품 변형 관리', (SELECT id FROM sys.menus WHERE code = 'PIM'), 1, 5, 'MENU', 'PIM', '/pim/product-variants', '@/pages/pim/product-variants', true, true);

-- =====================================================================================
-- LEVEL 0: 창고 관리 (WMS - Warehouse Management System)
-- =====================================================================================

-- 창고 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('WMS', '창고 관리', 'WMS', '창고, 수령, 배송, 재고', NULL, 0, 7, 'FOLDER', 'WMS', 'warehouse', 'lucide', true, true);

-- 창고 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('WMS_WAREHOUSES', '창고 관리', 'Warehouses', '창고 관리', (SELECT id FROM sys.menus WHERE code = 'WMS'), 1, 1, 'MENU', 'WMS', '/wms/warehouses', '@/pages/wms/warehouses', true, true);

-- 창고 위치
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('WMS_WAREHOUSE_LOCATIONS', '창고 위치', 'Warehouse Locations', '창고 위치 관리', (SELECT id FROM sys.menus WHERE code = 'WMS'), 1, 2, 'MENU', 'WMS', '/wms/warehouse-locations', '@/pages/wms/warehouse-locations', true, true);

-- 수령 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('WMS_RECEIVING', '수령 관리', 'Receiving', '수령 관리', (SELECT id FROM sys.menus WHERE code = 'WMS'), 1, 3, 'MENU', 'WMS', '/wms/receiving', '@/pages/wms/receiving', true, true);

-- 배송 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('WMS_SHIPPING', '배송 관리', 'Shipping', '배송 관리', (SELECT id FROM sys.menus WHERE code = 'WMS'), 1, 4, 'MENU', 'WMS', '/wms/shipping', '@/pages/wms/shipping', true, true);

-- 실시간 재고
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('WMS_INVENTORY', '실시간 재고', 'Inventory', '실시간 재고 조회', (SELECT id FROM sys.menus WHERE code = 'WMS'), 1, 5, 'MENU', 'WMS', '/wms/inventory', '@/pages/wms/inventory', true, true);

-- =====================================================================================
-- LEVEL 0: 승인 관리 (APM - Approval Management)
-- =====================================================================================

-- 승인 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('APM', '승인 관리', 'Approval', '승인 요청 및 이력 관리', NULL, 0, 8, 'FOLDER', 'APM', 'clock', 'lucide', true, true);

-- 승인 라인
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('APM_APPROVAL_LINES', '승인 라인', 'Approval Lines', '승인 라인 관리', (SELECT id FROM sys.menus WHERE code = 'APM'), 1, 1, 'MENU', 'APM', '/apm/approval-lines', '@/pages/apm/approval-lines', true, true);

-- 승인 요청
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('APM_APPROVAL_REQUESTS', '승인 요청', 'Approval Requests', '승인 요청 관리', (SELECT id FROM sys.menus WHERE code = 'APM'), 1, 2, 'MENU', 'APM', '/apm/approval-requests', '@/pages/apm/approval-requests', true, true);

-- 승인 이력
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('APM_APPROVAL_HISTORIES', '승인 이력', 'Approval Histories', '승인 이력 조회', (SELECT id FROM sys.menus WHERE code = 'APM'), 1, 3, 'MENU', 'APM', '/apm/approval-histories', '@/pages/apm/approval-histories', true, true);

-- =====================================================================================
-- LEVEL 0: 재고 관리 (IVM - Inventory Management)
-- =====================================================================================

-- 재고 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('IVM', '재고 관리', 'Inventory', '재고 잔액, 이동, 조정, 실사', NULL, 0, 9, 'FOLDER', 'IVM', 'package', 'lucide', true, true);

-- 재고 잔액
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('IVM_INVENTORY_BALANCES', '재고 잔액', 'Inventory Balances', '재고 잔액 조회', (SELECT id FROM sys.menus WHERE code = 'IVM'), 1, 1, 'MENU', 'IVM', '/ivm/inventory-balances', '@/pages/ivm/inventory-balances', true, true);

-- 재고 이동
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('IVM_INVENTORY_MOVEMENTS', '재고 이동', 'Inventory Movements', '재고 이동 관리', (SELECT id FROM sys.menus WHERE code = 'IVM'), 1, 2, 'MENU', 'IVM', '/ivm/inventory-movements', '@/pages/ivm/inventory-movements', true, true);

-- 재고 조정
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('IVM_INVENTORY_ADJUSTMENTS', '재고 조정', 'Inventory Adjustments', '재고 조정 관리', (SELECT id FROM sys.menus WHERE code = 'IVM'), 1, 3, 'MENU', 'IVM', '/ivm/inventory-adjustments', '@/pages/ivm/inventory-adjustments', true, true);

-- 재고 실사
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('IVM_INVENTORY_COUNTS', '재고 실사', 'Inventory Counts', '재고 실사 관리', (SELECT id FROM sys.menus WHERE code = 'IVM'), 1, 4, 'MENU', 'IVM', '/ivm/inventory-counts', '@/pages/ivm/inventory-counts', true, true);

-- =====================================================================================
-- LEVEL 0: 구매 관리 (PSM - Procurement/Purchase Management)
-- =====================================================================================

-- 구매 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('PSM', '구매 관리', 'Procurement', '구매요청, 구매주문, 견적', NULL, 0, 10, 'FOLDER', 'PSM', 'shopping-cart', 'lucide', true, true);

-- 구매 요청
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PSM_PURCHASE_REQUISITIONS', '구매 요청', 'Purchase Requisitions', '구매 요청 관리', (SELECT id FROM sys.menus WHERE code = 'PSM'), 1, 1, 'MENU', 'PSM', '/psm/purchase-requisitions', '@/pages/psm/purchase-requisitions', true, true);

-- 구매 주문
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PSM_PURCHASE_ORDERS', '구매 주문', 'Purchase Orders', '구매 주문 관리', (SELECT id FROM sys.menus WHERE code = 'PSM'), 1, 2, 'MENU', 'PSM', '/psm/purchase-orders', '@/pages/psm/purchase-orders', true, true);

-- 구매 견적
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('PSM_PURCHASE_QUOTATIONS', '구매 견적', 'Purchase Quotations', '구매 견적 관리', (SELECT id FROM sys.menus WHERE code = 'PSM'), 1, 3, 'MENU', 'PSM', '/psm/purchase-quotations', '@/pages/psm/purchase-quotations', true, true);

-- =====================================================================================
-- LEVEL 0: 판매 관리 (SRM - Sales/Revenue Management)
-- =====================================================================================

-- 판매 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('SRM', '판매 관리', 'Sales', '판매주문, 배송, 송장', NULL, 0, 11, 'FOLDER', 'SRM', 'trending-up', 'lucide', true, true);

-- 판매 견적
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('SRM_QUOTATIONS', '판매 견적', 'Quotations', '판매 견적 관리', (SELECT id FROM sys.menus WHERE code = 'SRM'), 1, 1, 'MENU', 'SRM', '/srm/quotations', '@/pages/srm/quotations', true, true);

-- 판매 주문
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('SRM_SALES_ORDERS', '판매 주문', 'Sales Orders', '판매 주문 관리', (SELECT id FROM sys.menus WHERE code = 'SRM'), 1, 2, 'MENU', 'SRM', '/srm/sales-orders', '@/pages/srm/sales-orders', true, true);

-- 판매 배송
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('SRM_SALES_DELIVERIES', '판매 배송', 'Sales Deliveries', '판매 배송 관리', (SELECT id FROM sys.menus WHERE code = 'SRM'), 1, 3, 'MENU', 'SRM', '/srm/sales-deliveries', '@/pages/srm/sales-deliveries', true, true);

-- 판매 송장
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('SRM_SALES_INVOICES', '판매 송장', 'Sales Invoices', '판매 송장 관리', (SELECT id FROM sys.menus WHERE code = 'SRM'), 1, 4, 'MENU', 'SRM', '/srm/sales-invoices', '@/pages/srm/sales-invoices', true, true);

-- =====================================================================================
-- LEVEL 0: 고객 지원 (FSM - After Sales/Service Management)
-- =====================================================================================

-- 고객 지원 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('FSM', '고객 지원', 'Support', '서비스요청, 티켓, FAQ', NULL, 0, 12, 'FOLDER', 'FSM', 'alert-circle', 'lucide', true, true);

-- 서비스 요청
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FSM_SERVICE_REQUESTS', '서비스 요청', 'Service Requests', '서비스 요청 관리', (SELECT id FROM sys.menus WHERE code = 'FSM'), 1, 1, 'MENU', 'FSM', '/fsm/service-requests', '@/pages/fsm/service-requests', true, true);

-- 지원 티켓
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FSM_SUPPORT_TICKETS', '지원 티켓', 'Support Tickets', '지원 티켓 관리', (SELECT id FROM sys.menus WHERE code = 'FSM'), 1, 2, 'MENU', 'FSM', '/fsm/support-tickets', '@/pages/fsm/support-tickets', true, true);

-- FAQ 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FSM_FAQS', 'FAQ 관리', 'FAQs', 'FAQ 관리', (SELECT id FROM sys.menus WHERE code = 'FSM'), 1, 3, 'MENU', 'FSM', '/fsm/faqs', '@/pages/fsm/faqs', true, true);

-- =====================================================================================
-- LEVEL 0: 재무 회계 (FIM - Finance/Accounting Management)
-- =====================================================================================

-- 재무 회계 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('FIM', '재무 회계', 'Finance', '계정, 분개, 송장', NULL, 0, 13, 'FOLDER', 'FIM', 'dollar-sign', 'lucide', true, true);

-- 계정 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FIM_ACCOUNTS', '계정 관리', 'Accounts', '계정 과목 관리', (SELECT id FROM sys.menus WHERE code = 'FIM'), 1, 1, 'MENU', 'FIM', '/fim/accounts', '@/pages/fim/accounts', true, true);

-- 분개 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FIM_JOURNAL_ENTRIES', '분개 관리', 'Journal Entries', '분개 관리', (SELECT id FROM sys.menus WHERE code = 'FIM'), 1, 2, 'MENU', 'FIM', '/fim/journal-entries', '@/pages/fim/journal-entries', true, true);

-- 세금 송장
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FIM_TAX_INVOICES', '세금 송장', 'Tax Invoices', '세금 송장 관리', (SELECT id FROM sys.menus WHERE code = 'FIM'), 1, 3, 'MENU', 'FIM', '/fim/tax-invoices', '@/pages/fim/tax-invoices', true, true);

-- =====================================================================================
-- LEVEL 0: 고정 자산 (FAM - Fixed Asset Management)
-- =====================================================================================

-- 고정 자산 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('FAM', '고정 자산', 'Assets', '고정자산, 감가상각', NULL, 0, 14, 'FOLDER', 'FAM', 'building-2', 'lucide', true, true);

-- 고정 자산
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FAM_FIXED_ASSETS', '고정 자산', 'Fixed Assets', '고정 자산 관리', (SELECT id FROM sys.menus WHERE code = 'FAM'), 1, 1, 'MENU', 'FAM', '/fam/fixed-assets', '@/pages/fam/fixed-assets', true, true);

-- 감가상각
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('FAM_ASSET_DEPRECIATION', '감가상각', 'Asset Depreciation', '감가상각 관리', (SELECT id FROM sys.menus WHERE code = 'FAM'), 1, 2, 'MENU', 'FAM', '/fam/asset-depreciation', '@/pages/fam/asset-depreciation', true, true);

-- =====================================================================================
-- LEVEL 0: 워크플로우 (LWM - Workflow Management)
-- =====================================================================================

-- 워크플로우 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('LWM', '워크플로우', 'Workflow', '워크플로우, 스텝, 업무', NULL, 0, 15, 'FOLDER', 'LWM', 'workflow', 'lucide', true, true);

-- 워크플로우
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('LWM_WORKFLOWS', '워크플로우', 'Workflows', '워크플로우 관리', (SELECT id FROM sys.menus WHERE code = 'LWM'), 1, 1, 'MENU', 'LWM', '/lwm/workflows', '@/pages/lwm/workflows', true, true);

-- 스텝 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('LWM_STEPS', '스텝 관리', 'Steps', '워크플로우 스텝 관리', (SELECT id FROM sys.menus WHERE code = 'LWM'), 1, 2, 'MENU', 'LWM', '/lwm/steps', '@/pages/lwm/steps', true, true);

-- 업무 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('LWM_TASKS', '업무 관리', 'Tasks', '업무 관리', (SELECT id FROM sys.menus WHERE code = 'LWM'), 1, 3, 'MENU', 'LWM', '/lwm/tasks', '@/pages/lwm/tasks', true, true);

-- =====================================================================================
-- LEVEL 0: 경영 분석 (BIM - Business Intelligence Management)
-- =====================================================================================

-- 경영 분석 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('BIM', '경영 분석', 'BI', 'KPI, 분석', NULL, 0, 16, 'FOLDER', 'BIM', 'bar-chart-3', 'lucide', true, true);

-- KPI 정의
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('BIM_KPI_DEFINITIONS', 'KPI 정의', 'KPI Definitions', 'KPI 정의 관리', (SELECT id FROM sys.menus WHERE code = 'BIM'), 1, 1, 'MENU', 'BIM', '/bim/kpi-definitions', '@/pages/bim/kpi-definitions', true, true);

-- 판매 분석
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, is_visible, is_active)
VALUES ('BIM_SALES_ANALYTICS', '판매 분석', 'Sales Analytics', '판매 분석 대시보드', (SELECT id FROM sys.menus WHERE code = 'BIM'), 1, 2, 'MENU', 'BIM', '/bim/sales-analytics', '@/pages/bim/sales-analytics', true, true);

-- =====================================================================================
-- LEVEL 0: 시스템 관리 (SYS - System Management)
-- =====================================================================================

-- 시스템 관리 (FOLDER)
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, icon, icon_type, is_visible, is_active)
VALUES ('SYS', '시스템 관리', 'System', '사용자, 역할, 권한, 메뉴, 코드 규칙', NULL, 0, 17, 'FOLDER', 'SYS', 'settings', 'lucide', true, true);

-- 사용자 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, permission_code, is_visible, is_active)
VALUES ('SYS_USERS', '사용자 관리', 'Users', '시스템 사용자 계정 관리', (SELECT id FROM sys.menus WHERE code = 'SYS'), 1, 1, 'MENU', 'SYS', '/sys/users', '@/pages/sys/users', 'users', 'lucide', 'SYS_USERS_READ', true, true);

-- 역할 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, permission_code, is_visible, is_active)
VALUES ('SYS_ROLES', '역할 관리', 'Roles', '역할 및 권한 관리', (SELECT id FROM sys.menus WHERE code = 'SYS'), 1, 2, 'MENU', 'SYS', '/sys/roles', '@/pages/sys/roles', 'shield', 'lucide', 'SYS_ROLES_READ', true, true);

-- 권한 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, permission_code, is_visible, is_active)
VALUES ('SYS_PERMISSIONS', '권한 관리', 'Permissions', '시스템 권한 관리', (SELECT id FROM sys.menus WHERE code = 'SYS'), 1, 3, 'MENU', 'SYS', '/sys/permissions', '@/pages/sys/permissions', 'lock', 'lucide', 'SYS_PERMISSIONS_READ', true, true);

-- 메뉴 관리
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, permission_code, is_visible, is_active, badge_text, badge_color)
VALUES ('SYS_MENUS', '메뉴 관리', 'Menus', '시스템 메뉴 구조 관리', (SELECT id FROM sys.menus WHERE code = 'SYS'), 1, 4, 'MENU', 'SYS', '/sys/menus', '@/pages/sys/menus', 'menu', 'lucide', 'SYS_MENUS_READ', true, true, 'NEW', 'blue');

-- 코드규칙
INSERT INTO sys.menus (code, name, name_en, description, parent_id, depth, sort_order, menu_type, module_code, route_path, component_path, icon, icon_type, permission_code, is_visible, is_active)
VALUES ('SYS_CODE_RULES', '코드규칙', 'Code Rules', '코드 생성 규칙 관리', (SELECT id FROM sys.menus WHERE code = 'SYS'), 1, 5, 'MENU', 'SYS', '/sys/code-rules', '@/pages/sys/code-rules', 'file-text', 'lucide', 'SYS_CODE_RULES_READ', true, true);

-- =====================================================================================
-- 조회 쿼리
-- =====================================================================================

-- 전체 메뉴 조회 (계층 구조)
SELECT 
    m.id,
    m.code,
    m.name,
    m.name_en,
    m.menu_type,
    m.module_code,
    m.depth,
    m.sort_order,
    m.route_path,
    m.icon,
    p.name as parent_name,
    m.is_visible,
    m.is_active
FROM sys.menus m
LEFT JOIN sys.menus p ON m.parent_id = p.id
ORDER BY m.depth, m.sort_order;

-- 최상위 메뉴만 조회
SELECT * FROM sys.menus WHERE parent_id IS NULL ORDER BY sort_order;

-- 특정 부모의 하위 메뉴 조회
SELECT * FROM sys.menus WHERE parent_id = (SELECT id FROM sys.menus WHERE code = 'SYS') ORDER BY sort_order;
