'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Star, FileText, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesPortalSidebarProps {
  salespersonId: string;
  pendingApprovals: number;
  recentWins?: any;
  topAccounts?: any;
  onNewOpportunity?: () => void;
  onNewActivity?: () => void;
}

export function SalesPortalSidebar({
  salespersonId,
  pendingApprovals,
  onNewOpportunity,
  onNewActivity,
}: SalesPortalSidebarProps) {
  // 모의 데이터
  const approvals = [
    {
      id: '1',
      type: 'discount',
      title: '삼성전자 프로젝트 할인 승인',
      amount: 50000000,
      reason: '대량 구매 및 장기 계약',
      status: 'pending',
      createdDate: '2024-11-01',
      dueDate: '2024-11-03',
      priority: 'high',
    },
    {
      id: '2',
      type: 'special-pricing',
      title: 'LG전자 특별 가격 요청',
      amount: 30000000,
      reason: '경쟁사 제안 대응',
      status: 'pending',
      createdDate: '2024-10-31',
      dueDate: '2024-11-02',
      priority: 'high',
    },
  ];

  const recentWins = [
    {
      id: '1',
      accountName: 'SK하이닉스',
      opportunityName: 'NAND Flash 솔루션',
      amount: 400000000,
      closedDate: '2024-10-28',
      stage: 'contract',
    },
    {
      id: '2',
      accountName: '현대자동차',
      opportunityName: 'MES 시스템 도입',
      amount: 500000000,
      closedDate: '2024-10-20',
      stage: 'contract',
    },
  ];

  const topAccounts = [
    {
      id: '1',
      name: 'SK C&C',
      revenue: 850000000,
      status: 'active',
      trend: 'up',
      nextAction: 'ERP 제안서 검토',
      daysActive: 3,
    },
    {
      id: '2',
      name: '삼성전자',
      revenue: 350000000,
      status: 'active',
      trend: 'up',
      nextAction: '계약서 검토 중',
      daysActive: 1,
    },
    {
      id: '3',
      name: 'LG전자',
      revenue: 280000000,
      status: 'active',
      trend: 'stable',
      nextAction: '기술 검토 미팅',
      daysActive: 8,
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₩${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₩${(value / 1000000).toFixed(0)}M`;
    }
    return `₩${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 sticky top-4">
      {/* 승인 대기 */}
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              승인 대기
            </span>
            {pendingApprovals > 0 && (
              <Badge className="bg-red-600 text-white">{pendingApprovals}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {approvals.length > 0 ? (
            <>
              {approvals.map((approval) => (
                <div key={approval.id} className="p-3 bg-white dark:bg-slate-950/50 rounded-lg border border-red-100 dark:border-red-900/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {approval.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(approval.amount)}
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs whitespace-nowrap">
                      높음
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{approval.reason}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>~{approval.dueDate}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7">
                    검토하기
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                모두 보기
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              대기 중인 승인이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 최근 성약 거래 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            최근 성약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentWins.length > 0 ? (
            <>
              {recentWins.map((win) => (
                <div
                  key={win.id}
                  className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <p className="text-sm font-medium text-foreground">{win.opportunityName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{win.accountName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(win.amount)}
                    </p>
                    <span className="text-xs text-muted-foreground">{win.closedDate}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                모두 보기
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              최근 성약이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 주요 거래처 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            주요 거래처
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topAccounts.length > 0 ? (
            <>
              {topAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {account.nextAction}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(account.revenue)}
                    </p>
                    <div className="flex items-center gap-1">
                      {account.trend === 'up' ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">↑ 증가</span>
                      ) : account.trend === 'down' ? (
                        <span className="text-xs text-red-600 dark:text-red-400">↓ 감소</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">→ 유지</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{account.daysActive}일 전 연락</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                모두 보기
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              거래처가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 빠른 액션 */}
      <Card className="bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            빠른 액션
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={onNewOpportunity}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <span className="text-lg mr-2">💼</span>
            새 기회 추가
          </Button>
          <Button
            onClick={onNewActivity}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <span className="text-lg mr-2">📝</span>
            활동 기록
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <span className="text-lg mr-2">📊</span>
            보고서 생성
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
