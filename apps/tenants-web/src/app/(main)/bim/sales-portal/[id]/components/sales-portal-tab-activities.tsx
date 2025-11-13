'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, Phone, Mail, Calendar, Users, Filter, CheckSquare, AlertCircle, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesPortalTabActivitiesProps {
  salespersonId?: string;
  activities?: any;
}

const colorClasses = {
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-orange-500/20 bg-orange-500/5',
  info: 'border-cyan-500/20 bg-cyan-500/5',
};

const iconColorClasses = {
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-500',
  warning: 'text-orange-600 dark:text-orange-500',
  info: 'text-cyan-600 dark:text-cyan-500',
};

const gradientClasses = {
  primary: 'from-primary/10 via-primary/5 to-transparent',
  success: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  warning: 'from-orange-500/10 via-orange-500/5 to-transparent',
  info: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
};

export function SalesPortalTabActivities({
  salespersonId,
}: SalesPortalTabActivitiesProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // 모의 활동 데이터
  const allActivities = [
    {
      id: '1',
      type: 'meeting',
      title: 'SK C&C 기술 검토 미팅',
      accountName: 'SK C&C',
      opportunityName: 'ERP 시스템 구축',
      date: '2024-11-01 14:00',
      endDate: '2024-11-01 15:30',
      location: '서울시 강남구 양재동',
      attendees: ['김영업', '이선임', '박과장', 'SK C&C 담당자'],
      notes: '기술 요구사항 검토, 다음 주 제안서 발송 예정',
      status: 'completed',
      priority: 'high',
    },
    {
      id: '2',
      type: 'call',
      title: '삼성전자 고객 전화',
      accountName: '삼성전자',
      opportunityName: '클라우드 마이그레이션',
      date: '2024-10-31 10:30',
      endDate: '2024-10-31 10:50',
      location: '-',
      attendees: ['김영업', '정부장'],
      notes: '클라우드 마이그레이션 일정 확인, 견적서 검토 결과 논의',
      status: 'completed',
      priority: 'high',
    },
    {
      id: '3',
      type: 'email',
      title: 'LG전자 제안서 발송',
      accountName: 'LG전자',
      opportunityName: 'AI 솔루션 도입',
      date: '2024-10-30 16:00',
      endDate: '2024-10-30 16:00',
      location: '-',
      attendees: ['김영업'],
      notes: 'AI 솔루션 제안서 및 가격표 첨부, ROI 분석 자료 포함',
      status: 'completed',
      priority: 'medium',
    },
    {
      id: '4',
      type: 'task',
      title: 'CJ제일제당 계약서 검토',
      accountName: 'CJ제일제당',
      opportunityName: '데이터 웨어하우스 구축',
      date: '2024-11-08 09:00',
      endDate: '2024-11-08 17:00',
      location: '-',
      attendees: ['김영업', '법무팀'],
      notes: '법무팀과 함께 계약서 조건 검토 및 수정',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '5',
      type: 'meeting',
      title: '현대자동차 MES 시스템 설명회',
      accountName: '현대자동차',
      opportunityName: 'MES 시스템 도입',
      date: '2024-11-12 14:00',
      endDate: '2024-11-12 16:00',
      location: '현대자동차 본사 회의실',
      attendees: ['김영업', '기술팀', '현대자동차 담당자'],
      notes: '제조 공정 효율화를 위한 MES 시스템 기능 시연',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '6',
      type: 'call',
      title: 'SK하이닉스 사전 협의',
      accountName: 'SK하이닉스',
      opportunityName: '보안 솔루션 도입',
      date: '2024-11-15 10:00',
      endDate: '2024-11-15 10:30',
      location: '-',
      attendees: ['김영업'],
      notes: '보안 솔루션의 기술 스펙 및 가격에 대한 사전 협의',
      status: 'pending',
      priority: 'medium',
    },
    {
      id: '7',
      type: 'email',
      title: '넥슨 후속 자료 발송',
      accountName: '넥슨',
      opportunityName: '게이밍 플랫폼 구축',
      date: '2024-11-20 15:00',
      endDate: '2024-11-20 15:00',
      location: '-',
      attendees: ['김영업'],
      notes: '게이밍 플랫폼 통합 솔루션 설명서 및 사례 자료',
      status: 'pending',
      priority: 'low',
    },
  ];

  // 필터링
  const filteredActivities = allActivities.filter((activity) => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    if (!showCompleted && activity.status === 'completed') return false;
    return true;
  });

  const completedCount = allActivities.filter((a) => a.status === 'completed').length;
  const pendingCount = allActivities.filter((a) => a.status === 'pending').length;
  const overdueCount = 0; // 실제로는 현재 날짜와 비교해야 함

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'call':
        return <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'task':
        return <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      meeting: '미팅',
      call: '통화',
      email: '이메일',
      task: '작업',
    };
    return typeMap[type] || type;
  };

  const getPriorityBadgeColor = (priority: string) => {
    return priority === 'high'
      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      : priority === 'medium'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'completed'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return `내일 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statisticCards = [
    {
      label: '전체 활동',
      value: allActivities.length,
      unit: '건',
      icon: <ListTodo className="w-full h-full" />,
      color: 'primary' as const,
    },
    {
      label: '완료된 활동',
      value: completedCount,
      unit: '건',
      icon: <CheckSquare className="w-full h-full" />,
      color: 'success' as const,
    },
    {
      label: '예정 활동',
      value: pendingCount,
      unit: '건',
      icon: <Clock className="w-full h-full" />,
      color: 'info' as const,
    },
    {
      label: '기한 초과',
      value: overdueCount,
      unit: '건',
      icon: <AlertCircle className="w-full h-full" />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 활동 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticCards.map((card, idx) => (
          <Card
            key={idx}
            className={cn(
              colorClasses[card.color],
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            {/* 배경 그라디언트 */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses[card.color],
              )}
            />

            {/* 배경 아이콘 */}
            {card.icon && (
              <div
                className={cn(
                  'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                  iconColorClasses[card.color],
                )}
              >
                <div className="w-28 h-28">
                  {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, {
                    className: 'w-full h-full'
                  })}
                </div>
              </div>
            )}

            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {card.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {card.value}
                  </p>
                  {card.unit && (
                    <span className="text-sm text-muted-foreground">{card.unit}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
          className="whitespace-nowrap"
        >
          <Filter className="w-4 h-4 mr-2" />
          전체
        </Button>
        <Button
          variant={filterType === 'meeting' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('meeting')}
          className="whitespace-nowrap"
        >
          <Calendar className="w-4 h-4 mr-2" />
          미팅
        </Button>
        <Button
          variant={filterType === 'call' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('call')}
          className="whitespace-nowrap"
        >
          <Phone className="w-4 h-4 mr-2" />
          통화
        </Button>
        <Button
          variant={filterType === 'email' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('email')}
          className="whitespace-nowrap"
        >
          <Mail className="w-4 h-4 mr-2" />
          이메일
        </Button>
        <Button
          variant={filterType === 'task' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('task')}
          className="whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          작업
        </Button>
        <div className="flex-1" />
        <Button
          variant={showCompleted ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCompleted(!showCompleted)}
          className="whitespace-nowrap"
        >
          {showCompleted ? '완료됨 숨기기' : '완료됨 보기'}
        </Button>
      </div>

      {/* 활동 목록 */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <Card
            key={activity.id}
            className={cn(
              'hover:shadow-md transition-all duration-300 cursor-pointer group',
              activity.status === 'completed' && 'opacity-75 hover:opacity-100',
            )}
          >
            <CardContent className="p-5">
              <div className="flex gap-4">
                {/* 좌측 아이콘 */}
                <div className="flex-shrink-0 flex items-start justify-center pt-1">
                  {getActivityIcon(activity.type)}
                </div>

                {/* 중앙 정보 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn('font-semibold text-foreground truncate', activity.status === 'completed' && 'line-through opacity-70')}>
                          {activity.title}
                        </h4>
                        <Badge className={cn('text-xs', getPriorityBadgeColor(activity.priority))}>
                          {activity.priority === 'high' ? '높음' : activity.priority === 'medium' ? '중간' : '낮음'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.accountName}
                        {activity.opportunityName && ` · ${activity.opportunityName}`}
                      </p>
                    </div>
                    <Badge className={cn('text-xs whitespace-nowrap', getStatusBadgeColor(activity.status))}>
                      {activity.status === 'completed' ? '완료' : '예정'}
                    </Badge>
                  </div>

                  {/* 상세 정보 */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(activity.date)}
                    </span>
                    {activity.location !== '-' && (
                      <span>📍 {activity.location}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {activity.attendees.length}명
                    </span>
                  </div>

                  {/* 참여자 */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activity.attendees.slice(0, 3).map((attendee, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900/30">
                        {attendee}
                      </Badge>
                    ))}
                    {activity.attendees.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900/30">
                        +{activity.attendees.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* 노트 */}
                  {activity.notes && (
                    <p className="text-xs text-muted-foreground border-l-2 border-blue-500/30 pl-3 mt-2 italic">
                      {activity.notes}
                    </p>
                  )}
                </div>

                {/* 우측 액션 */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {activity.status === 'pending' && (
                    <Button variant="ghost" size="sm" className="text-xs">
                      완료
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    상세 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredActivities.length === 0 && (
          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">활동이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
