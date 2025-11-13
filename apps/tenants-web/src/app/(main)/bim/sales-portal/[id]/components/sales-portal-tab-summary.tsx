'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesPortalTabSummaryProps {
  salespersonId: string;
  pipelineOpportunities?: any;
  recentActivities?: any;
  upcomingTasks?: any;
}

export function SalesPortalTabSummary({
  salespersonId,
}: SalesPortalTabSummaryProps) {
  // 모의 데이터
  const opportunities = [
    {
      id: '1',
      accountName: 'SK C&C',
      opportunityName: 'ERP 시스템 구축',
      amount: 500000000,
      probability: 85,
      stage: 'negotiation',
      closeDate: '2025-12-15',
      status: 'active',
      lastUpdate: '2024-11-01',
    },
    {
      id: '2',
      accountName: '삼성전자',
      opportunityName: '클라우드 마이그레이션',
      amount: 350000000,
      probability: 65,
      stage: 'proposal',
      closeDate: '2025-12-30',
      status: 'active',
      lastUpdate: '2024-10-28',
    },
    {
      id: '3',
      accountName: 'LG전자',
      opportunityName: 'AI 솔루션 도입',
      amount: 280000000,
      probability: 45,
      stage: 'qualification',
      closeDate: '2026-01-15',
      status: 'active',
      lastUpdate: '2024-10-25',
    },
  ];

  const activities = [
    {
      id: '1',
      type: 'meeting',
      title: 'SK C&C 컨설팅 미팅',
      date: '2024-11-01 14:00',
      attendees: ['김영업', '이선임', '박과장'],
      notes: 'ERP 구축 범위 논의, 다음 주 기술 검토 예정',
    },
    {
      id: '2',
      type: 'call',
      title: '삼성전자 고객 전화',
      date: '2024-10-31 10:30',
      attendees: ['김영업', '정부장'],
      notes: '클라우드 마이그레이션 일정 확인',
    },
    {
      id: '3',
      type: 'email',
      title: 'LG전자 제안서 발송',
      date: '2024-10-30 16:00',
      attendees: ['김영업'],
      notes: 'AI 솔루션 제안서 및 가격표 첨부',
    },
  ];

  const tasks = [
    {
      id: '1',
      title: 'SK C&C 기술 검토 준비',
      dueDate: '2024-11-08',
      priority: 'high',
      status: 'pending',
      description: '기술 검토 자료 준비 및 팀 미팅',
    },
    {
      id: '2',
      title: '삼성전자 계약서 검토',
      dueDate: '2024-11-12',
      priority: 'high',
      status: 'pending',
      description: '법무팀과 계약서 검토 진행',
    },
    {
      id: '3',
      title: 'LG전자 아이디어 미팅 스케줄',
      dueDate: '2024-11-15',
      priority: 'medium',
      status: 'pending',
      description: '다음 주 기술 검토 미팅 일정 확정',
    },
  ];

  const getStageLabel = (stage: string) => {
    const stageMap: Record<string, { label: string; color: string }> = {
      qualification: { label: '리드', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      proposal: { label: '제안', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      negotiation: { label: '협상', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
      closing: { label: '성약', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
    };
    return stageMap[stage] || { label: stage, color: 'bg-gray-100 text-gray-800' };
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      meeting: '📅',
      call: '📞',
      email: '📧',
      task: '✓',
    };
    return icons[type] || '📌';
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high'
      ? 'text-red-600 dark:text-red-400'
      : 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="space-y-6">
      {/* 진행 중인 기회 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">📊</span> 진행 중인 기회
            <Badge variant="secondary">{opportunities.length}건</Badge>
          </h3>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {opportunities.map((opp) => {
            const stageInfo = getStageLabel(opp.stage);
            return (
              <Card
                key={opp.id}
                className="group hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* 좌측 */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{opp.opportunityName}</h4>
                        <Badge className={stageInfo.color} variant="outline">
                          {stageInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{opp.accountName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>성약예정: {opp.closeDate}</span>
                        <span>확률: {opp.probability}%</span>
                      </div>
                    </div>

                    {/* 우측 */}
                    <div className="text-right space-y-2">
                      <p className="font-bold text-lg text-foreground">
                        ₩{(opp.amount / 100000000).toFixed(1)}억
                      </p>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">📌</span> 최근 활동
            <Badge variant="secondary">{activities.length}건</Badge>
          </h3>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                    <div className="flex gap-1 mt-2">
                      {activity.attendees.map((attendee, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 예정된 작업 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">✓</span> 예정된 작업
            <Badge variant="secondary">{tasks.length}건</Badge>
          </h3>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-input"
                        defaultChecked={false}
                      />
                      <p className="font-medium text-foreground">{task.title}</p>
                      <Badge
                        className={cn(
                          'text-xs',
                          task.priority === 'high' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                          task.priority === 'medium' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                        )}
                      >
                        {task.priority === 'high' ? '높음' : '중간'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>마감: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
