"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { PartnerPortalHeader } from "./components/partner-portal-header";
import { PartnerPortalMetrics } from "./components/partner-portal-metrics";
import { PartnerPortalTabs } from "./components/partner-portal-tabs";
import { PartnerPortalTabSummary } from "./components/partner-portal-tab-summary";
import { PartnerPortalTabPerformance } from "./components/partner-portal-tab-performance";
import { PartnerPortalTabMarketing } from "./components/partner-portal-tab-marketing";
import { PartnerPortalTabDetails } from "./components/partner-portal-tab-details";
import { PartnerPortalTabContacts } from "./components/partner-portal-tab-contacts";
import { PartnerPortalTabAccountOwners } from "./components/partner-portal-tab-account-owners";
import { PartnerPortalTabAddresses } from "./components/partner-portal-tab-addresses";
import { PartnerPortalSidebar } from "./components/partner-portal-sidebar";

export default function PartnerPortalPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  // 모의 거래처 데이터
  const partner = {
    id: partnerId || "1",
    code: "CUST_001",
    name: "ABC고객사",
    englishName: "ABC Customer Inc.",
    type: "customer" as const,
    tier: "우수",
    industry: "제조업",
    address: "서울시 강남구 테헤란로 123",
    tel: "02-2345-6789",
    email: "contact@customer1.com",
    website: "https://www.abccustomer.com",
    representative: "이영한",
    department: "영업관리팀",
    accountOwner: "김영업",
    logo: undefined,
    bizNo: "234-56-78901",
    establishedYear: 2015,
    employees: 250,
    annualRevenue: 50000000000,
    creditLimit: 100000000,
  };

  // Note: Breadcrumb displays menu name (거래처 포탈) for portal routes, not entity name
  // useEffect(() => {
  //   setDynamicData({ [partnerId]: partner.name });
  //   return () => clearDynamicData();
  // }, [partnerId, partner.name, setDynamicData, clearDynamicData]);

  const tabs = [
    {
      id: "summary",
      label: "요약",
      badge: undefined,
      content: (
        <PartnerPortalTabSummary
          partnerId={partner.id}
          activities={undefined}
          opportunities={undefined}
          quotations={undefined}
          serviceRequests={undefined}
        />
      ),
    },
    {
      id: "performance",
      label: "실적 및 재무",
      badge: undefined,
      content: (
        <PartnerPortalTabPerformance
          partnerId={partner.id}
          salesData={undefined}
          categorySales={undefined}
          receivables={undefined}
          accountChanges={undefined}
        />
      ),
    },
    {
      id: "marketing",
      label: "마케팅 및 리드",
      badge: undefined,
      content: (
        <PartnerPortalTabMarketing
          partnerId={partner.id}
          campaigns={undefined}
          leads={undefined}
          surveys={undefined}
        />
      ),
    },
    {
      id: "details",
      label: "상세정보",
      badge: undefined,
      content: <PartnerPortalTabDetails partnerId={partner.id} data={undefined} />,
    },
    {
      id: "partner-contacts",
      label: "거래처 담당자",
      badge: undefined,
      content: <PartnerPortalTabContacts partnerId={partner.id} />,
    },
    {
      id: "account-owners",
      label: "당사 영업 담당자",
      badge: undefined,
      content: <PartnerPortalTabAccountOwners partnerId={partner.id} />,
    },
    {
      id: "addresses",
      label: "주소",
      badge: undefined,
      content: <PartnerPortalTabAddresses partnerId={partner.id} />,
    },
  ];

  // 회사 로고 또는 아이콘 생성
  const getLogoDisplay = () => {
    if (partner.logo) {
      return (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-16 w-16 rounded-lg object-cover border-2 border-blue-200 dark:border-blue-800"
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 상단 헤더 */}
      <PartnerPortalHeader
        partner={partner}
        onBack={() => router.back()}
        onNewOpportunity={() => console.log("New Opportunity")}
        onNewServiceRequest={() => console.log("New Service Request")}
        onLogActivity={() => console.log("Log Activity")}
        getLogoDisplay={getLogoDisplay}
      />

      {/* 메인 콘텐츠 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 메트릭스 */}
          <PartnerPortalMetrics
            partner={partner}
            onNewOpportunity={() => console.log("New Opportunity")}
            onNewServiceRequest={() => console.log("New Service Request")}
            onLogActivity={() => console.log("Log Activity")}
          />

          {/* 탭 */}
          <PartnerPortalTabs tabs={tabs} />
        </div>

        {/* 우측 사이드바 */}
        <div>
          <PartnerPortalSidebar
            partnerId={partner.id}
            contacts={undefined}
            feeds={undefined}
            files={undefined}
            onAddContact={() => console.log("Add Contact")}
            onAddFeed={() => console.log("Add Feed")}
            onAddFile={() => console.log("Add File")}
          />
        </div>
      </div>
    </div>
  );
}
