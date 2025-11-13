/**
 * Menu Configuration
 * 사이드바 메뉴 구조 정의
 * 각 스키마의 엔티티를 기준으로 메뉴 구성
 */

import {
  Home,
  Users,
  Building2,
  Briefcase,
  Package,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  Lock,
  FileText,
  MessageSquare,
  Zap,
  Target,
  AlertCircle,
  DollarSign,
  PieChart,
  Workflow,
  Wrench,
  Clock,
  Gauge,
  Store,
  Box,
} from "lucide-react";
import React from "react";

export interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export interface MenuGroup {
  name: string;
  icon: React.ReactNode;
  description?: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  // 대시보드
  {
    name: "대시보드",
    icon: <Home className="h-5 w-5" />,
    description: "홈 및 개요",
    items: [
      { name: "홈", href: "/overview", icon: <Home className="h-5 w-5" /> },
    ],
  },

  // 포탈
  {
    name: "포탈",
    icon: <Gauge className="h-5 w-5" />,
    description: "영업, 거래처, 제품 통합 포탈",
    items: [
      { name: "영업사원 포탈", href: "/bim/sales-portal", icon: <Gauge className="h-5 w-5" /> },
      { name: "거래처 포탈", href: "/bim/partner-portal/1", icon: <Store className="h-5 w-5" /> },
      { name: "제품 포탈", href: "/bim/product-portal/1", icon: <Box className="h-5 w-5" /> },
    ],
  },

  // 01_adm - Administration (공통 관리)
  {
    name: "기본설정",
    icon: <Settings className="h-5 w-5" />,
    description: "공통 코드, 환율, 단위 등 기본 데이터",
    items: [
      { name: "코드관리", href: "/adm/codes" },
      { name: "코드그룹", href: "/adm/code-groups" },
      { name: "통화관리", href: "/adm/currencies" },
      { name: "환율관리", href: "/adm/exchange-rates" },
      { name: "단위관리", href: "/adm/units" },
      { name: "결제조건", href: "/adm/payment-terms" },
    ],
  },

  // 02_hrm - Human Resource Management
  {
    name: "인사/급여",
    icon: <Users className="h-5 w-5" />,
    description: "직원, 부서, 급여, 근태 관리",
    items: [
      { name: "부서관리", href: "/hrm/departments" },
      { name: "부서변경이력", href: "/hrm/department-histories" },
      { name: "사원관리", href: "/hrm/employees" },
      { name: "인사발령", href: "/hrm/employee-histories" },
      { name: "급여구조", href: "/hrm/payroll-structures" },
      { name: "급여기록", href: "/hrm/payroll-records" },
      { name: "근태관리", href: "/hrm/attendances" },
      { name: "휴가관리", href: "/hrm/absences" },
      { name: "휴가정책", href: "/hrm/leave-policies" },
    ],
  },

  // 03_crm - Customer Relationship Management
  {
    name: "고객관리",
    icon: <Briefcase className="h-5 w-5" />,
    description: "거래처, 영업기회, 활동 관리",
    items: [
      { name: "거래처 관리", href: "/crm/partners" },
      { name: "거래처 연락처", href: "/crm/partner-contacts" },
      { name: "영업 기회", href: "/crm/opportunities" },
      { name: "활동 기록", href: "/crm/activities" },
      { name: "캠페인 관리", href: "/crm/campaigns" },
    ],
  },

  // 04_pim - Product Information Management
  {
    name: "제품관리",
    icon: <Package className="h-5 w-5" />,
    description: "제품, 카테고리, 브랜드 관리",
    items: [
      { name: "제품", href: "/pim/products" },
      { name: "카테고리", href: "/pim/categories" },
      { name: "브랜드", href: "/pim/brands" },
      { name: "제조사", href: "/pim/makers" },
      { name: "제품변형", href: "/pim/product-variants" },
    ],
  },

  // 05_wms - Warehouse Management System
  {
    name: "창고 관리",
    icon: <Warehouse className="h-5 w-5" />,
    description: "창고, 수령, 배송, 재고",
    items: [
      { name: "창고 관리", href: "/wms/warehouses" },
      { name: "창고 위치", href: "/wms/warehouse-locations" },
      { name: "수령 관리", href: "/wms/receiving" },
      { name: "배송 관리", href: "/wms/shipping" },
      { name: "실시간 재고", href: "/wms/inventory" },
    ],
  },

  // 06_apm - Approval Management
  {
    name: "승인 관리",
    icon: <Clock className="h-5 w-5" />,
    description: "승인 요청 및 이력 관리",
    items: [
      { name: "승인 라인", href: "/apm/approval-lines" },
      { name: "승인 요청", href: "/apm/approval-requests" },
      { name: "승인 이력", href: "/apm/approval-histories" },
    ],
  },

  // 10_ivm - Inventory Management
  {
    name: "재고 관리",
    icon: <Package className="h-5 w-5" />,
    description: "재고 잔액, 이동, 조정, 실사",
    items: [
      { name: "재고 잔액", href: "/ivm/inventory-balances" },
      { name: "재고 이동", href: "/ivm/inventory-movements" },
      { name: "재고 조정", href: "/ivm/inventory-adjustments" },
      { name: "재고 실사", href: "/ivm/inventory-counts" },
    ],
  },

  // 11_psm - Procurement/Purchase Management
  {
    name: "구매 관리",
    icon: <ShoppingCart className="h-5 w-5" />,
    description: "구매요청, 구매주문, 견적",
    items: [
      { name: "구매 요청", href: "/psm/purchase-requisitions" },
      { name: "구매 주문", href: "/psm/purchase-orders" },
      { name: "구매 견적", href: "/psm/purchase-quotations" },
    ],
  },

  // 12_srm - Sales/Revenue Management
  {
    name: "판매 관리",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "판매주문, 배송, 송장",
    items: [
      { name: "판매 견적", href: "/srm/quotations" },
      { name: "판매 주문", href: "/srm/sales-orders" },
      { name: "판매 배송", href: "/srm/sales-deliveries" },
      { name: "판매 송장", href: "/srm/sales-invoices" },
    ],
  },

  // 13_fsm - After Sales/Service Management
  {
    name: "고객 지원",
    icon: <AlertCircle className="h-5 w-5" />,
    description: "서비스요청, 티켓, FAQ",
    items: [
      { name: "서비스 요청", href: "/fsm/service-requests" },
      { name: "지원 티켓", href: "/fsm/support-tickets" },
      { name: "FAQ 관리", href: "/fsm/faqs" },
    ],
  },

  // 14_fim - Finance/Accounting Management
  {
    name: "재무 회계",
    icon: <DollarSign className="h-5 w-5" />,
    description: "계정, 분개, 송장",
    items: [
      { name: "계정 관리", href: "/fim/accounts" },
      { name: "분개 관리", href: "/fim/journal-entries" },
      { name: "세금 송장", href: "/fim/tax-invoices" },
    ],
  },

  // 15_fam - Fixed Asset Management
  {
    name: "고정 자산",
    icon: <Building2 className="h-5 w-5" />,
    description: "고정자산, 감가상각",
    items: [
      { name: "고정 자산", href: "/fam/fixed-assets" },
      { name: "감가상각", href: "/fam/asset-depreciation" },
    ],
  },

  // 16_lwm - Workflow/Approval Management
  {
    name: "워크플로우",
    icon: <Workflow className="h-5 w-5" />,
    description: "워크플로우, 스텝, 업무",
    items: [
      { name: "워크플로우", href: "/lwm/workflows" },
      { name: "스텝 관리", href: "/lwm/steps" },
      { name: "업무 관리", href: "/lwm/tasks" },
    ],
  },

  // 20_bim - Business Intelligence Management
  {
    name: "경영 분석",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "KPI, 분석",
    items: [
      { name: "KPI 정의", href: "/bim/kpi-definitions" },
      { name: "판매 분석", href: "/bim/sales-analytics" },
    ],
  },

  // 22_sys - System/User Management
  {
    name: "시스템 관리",
    icon: <Settings className="h-5 w-5" />,
    description: "사용자, 역할, 권한, 메뉴, 코드 규칙",
    items: [
      { name: "사용자 관리", href: "/sys/users" },
      { name: "역할 관리", href: "/sys/roles" },
      { name: "권한 관리", href: "/sys/permissions" },
      { name: "메뉴 관리", href: "/sys/menus" },
      { name: "코드규칙", href: "/sys/code-rules" },
    ],
  },
];
