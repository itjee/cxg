'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityRecord {
  id: string;
  type: string; // meeting, call, email
  subject: string;
  date: string;
  owner: string;
  notes?: string;
}

interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount: number;
  expectedCloseDate: string;
  owner: string;
}

interface Quotation {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: string; // draft, sent, approved, rejected
}

interface ServiceRequest {
  id: string;
  number: string;
  title: string;
  status: string; // open, in_progress, closed
  createdDate: string;
  owner: string;
}

interface PartnerPortalTabSummaryProps {
  partnerId: string;
  activities?: ActivityRecord[];
  opportunities?: Opportunity[];
  quotations?: Quotation[];
  serviceRequests?: ServiceRequest[];
}

export function PartnerPortalTabSummary({
  partnerId,
  activities = [],
  opportunities = [],
  quotations = [],
  serviceRequests = [],
}: PartnerPortalTabSummaryProps) {
  // 모의 데이터
  const mockActivities: ActivityRecord[] = activities.length > 0 ? activities : [
    {
      id: '1',
      type: 'meeting',
      subject: '분기별 비즈니스 검토 미팅',
      date: '2024-10-28',
      owner: '김영업',
      notes: '2025년 계약 논의',
    },
    {
      id: '2',
      type: 'call',
      subject: '주문 상태 확인 전화',
      date: '2024-10-25',
      owner: '이판매',
      notes: '배송 예정일 확인',
    },
    {
      id: '3',
      type: 'email',
      subject: '신제품 소개 이메일 발송',
      date: '2024-10-20',
      owner: '박마케팅',
      notes: '신제품 카탈로그 첨부',
    },
  ];

  const mockOpportunities: Opportunity[] = opportunities.length > 0 ? opportunities : [
    {
      id: '1',
      name: '2025년 정기구매 계약',
      stage: 'Negotiation',
      amount: 50000000,
      expectedCloseDate: '2024-12-31',
      owner: '김영업',
    },
    {
      id: '2',
      name: '신제품 도입 검토',
      stage: 'Proposal',
      amount: 35000000,
      expectedCloseDate: '2024-11-30',
      owner: '이판매',
    },
    {
      id: '3',
      name: '추가 물량 공급',
      stage: 'Discovery',
      amount: 20000000,
      expectedCloseDate: '2025-01-31',
      owner: '김영업',
    },
  ];

  const mockQuotations: Quotation[] = quotations.length > 0 ? quotations : [
    {
      id: '1',
      number: 'QT-2024-001',
      date: '2024-10-25',
      amount: 15000000,
      status: 'sent',
    },
    {
      id: '2',
      number: 'QT-2024-002',
      date: '2024-10-20',
      amount: 8500000,
      status: 'approved',
    },
  ];

  const mockServiceRequests: ServiceRequest[] = serviceRequests.length > 0 ? serviceRequests : [
    {
      id: '1',
      number: 'SR-2024-045',
      title: '제품 품질 문제 조사',
      status: 'in_progress',
      createdDate: '2024-10-22',
      owner: '박지원',
    },
    {
      id: '2',
      number: 'SR-2024-044',
      title: '배송 지연 처리',
      status: 'open',
      createdDate: '2024-10-25',
      owner: '이지원',
    },
  ];

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      meeting: '미팅',
      call: '통화',
      email: '이메일',
    };
    return labels[type] || type;
  };

  const getActivityTypeBg = (type: string) => {
    const colors: Record<string, string> = {
      meeting: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      call: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      email: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getOpportunityStageBg = (stage: string) => {
    const colors: Record<string, string> = {
      Discovery: 'bg-gray-100 dark:bg-gray-900/30',
      Proposal: 'bg-yellow-100 dark:bg-yellow-900/30',
      Negotiation: 'bg-orange-100 dark:bg-orange-900/30',
      Closed: 'bg-green-100 dark:bg-green-900/30',
    };
    return colors[stage] || 'bg-blue-100 dark:bg-blue-900/30';
  };

  const getQuotationStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getQuotationStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '작성중',
      sent: '발송됨',
      approved: '승인됨',
      rejected: '거절됨',
    };
    return labels[status] || status;
  };

  const getServiceRequestStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      closed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getServiceRequestStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: '오픈',
      in_progress: '진행중',
      closed: '완료',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* 상단 2개 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 영업 활동 내역 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">영업 활동 내역</h3>
              <Button variant="outline" size="sm">
                모두 보기
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    "p-4 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeBg(
                          activity.type
                        )}`}
                      >
                        {getActivityTypeLabel(activity.type)}
                      </span>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                    <p className="font-medium text-foreground">{activity.subject}</p>
                    {activity.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">담당: {activity.owner}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>

        {/* 진행 중인 기회 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">진행 중인 기회</h3>
              <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {mockOpportunities.length}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className={cn(
                    "p-3 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                >
                  <p className="font-medium text-sm text-foreground">{opp.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getOpportunityStageBg(opp.stage)}`}>
                      {opp.stage}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {(opp.amount / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 2개 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 발송된 견적 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">발송된 견적</h3>
              <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                {mockQuotations.length}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockQuotations.map((quote) => (
                <div
                  key={quote.id}
                  className={cn(
                    "p-3 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-foreground">{quote.number}</p>
                    <span className={`text-xs px-2 py-1 rounded ${getQuotationStatusBg(quote.status)}`}>
                      {getQuotationStatusLabel(quote.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{quote.date}</p>
                  <p className="text-sm font-semibold text-foreground mt-2">
                    {(quote.amount / 1000000).toFixed(1)}M원
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 미결 서비스 요청 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">미결 서비스요청</h3>
              <span className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                {mockServiceRequests.length}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockServiceRequests.map((sr) => (
                <div
                  key={sr.id}
                  className={cn(
                    "p-3 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{sr.number}</p>
                      <p className="text-xs text-muted-foreground mt-1">{sr.title}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getServiceRequestStatusBg(sr.status)}`}>
                      {getServiceRequestStatusLabel(sr.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
