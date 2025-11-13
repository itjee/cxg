'use client';

import React, { useState } from 'react';
import { SalesPortalHeader } from './components/sales-portal-header';
import { SalesPortalMetrics } from './components/sales-portal-metrics';
import { SalesPortalTabs } from './components/sales-portal-tabs';
import { SalesPortalTabSummary } from './components/sales-portal-tab-summary';
import { SalesPortalTabPipeline } from './components/sales-portal-tab-pipeline';
import { SalesPortalTabActivities } from './components/sales-portal-tab-activities';
import { SalesPortalTabLeaderboard } from './components/sales-portal-tab-leaderboard';
import { SalesPortalSidebar } from './components/sales-portal-sidebar';

export default function SalesPortalPage() {
  const [activeTab, setActiveTab] = useState('summary');

  // 모의 판매자 데이터
  const salesperson = {
    id: '1',
    name: '김영업',
    position: '영업사원',
    department: '영업1팀',
    email: 'kim.sales@company.com',
    phone: '010-1234-5678',
    avatar: undefined,
  };

  // 모의 성과 데이터
  const performanceData = {
    pipelineTotal: 2450000000,
    targetAmount: 2000000000,
    quotaAchievementRate: 85.5,
    avgDealSize: 125000000,
    winRate: 68.0,
    daysToClose: 28,
    thisMonthCalls: 24,
    thisMonthEmails: 62,
    thisMonthMeetings: 8,
    thisMonthTasks: 15,
    overdueActivities: 2,
    pendingApprovals: 1,
  };

  const tabs = [
    {
      id: 'summary',
      label: '요약',
      badge: undefined,
      content: (
        <SalesPortalTabSummary
          salespersonId={salesperson.id}
          pipelineOpportunities={undefined}
          recentActivities={undefined}
          upcomingTasks={undefined}
        />
      ),
    },
    {
      id: 'pipeline',
      label: '파이프라인',
      badge: undefined,
      content: (
        <SalesPortalTabPipeline
          salespersonId={salesperson.id}
          opportunities={undefined}
        />
      ),
    },
    {
      id: 'activities',
      label: '활동',
      badge: performanceData.overdueActivities > 0 ? performanceData.overdueActivities : undefined,
      content: (
        <SalesPortalTabActivities
          salespersonId={salesperson.id}
          activities={undefined}
        />
      ),
    },
    {
      id: 'leaderboard',
      label: '순위',
      badge: undefined,
      content: (
        <SalesPortalTabLeaderboard
          salespersonId={salesperson.id}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 헤더 */}
      <SalesPortalHeader salesperson={salesperson} />

      {/* 메인 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 성과 지표 카드 */}
          <SalesPortalMetrics performanceData={performanceData} />

          {/* 탭 */}
          <SalesPortalTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* 우측 사이드바 */}
        <div>
          <SalesPortalSidebar
            salespersonId={salesperson.id}
            pendingApprovals={performanceData.pendingApprovals}
            recentWins={undefined}
            topAccounts={undefined}
            onNewOpportunity={() => console.log('New Opportunity')}
            onNewActivity={() => console.log('New Activity')}
          />
        </div>
      </div>
    </div>
  );
}
