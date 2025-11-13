'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Eye as EyeIcon, Mail, Zap, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorClasses = {
  default: 'border-border',
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-orange-500/20 bg-orange-500/5',
};

const iconColorClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-500',
  warning: 'text-orange-600 dark:text-orange-500',
};

const gradientClasses = {
  default: 'from-muted/30 via-transparent to-transparent',
  primary: 'from-primary/10 via-primary/5 to-transparent',
  success: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  warning: 'from-orange-500/10 via-orange-500/5 to-transparent',
};

interface CampaignRecord {
  id: string;
  name: string;
  type: string; // email, event, webinar, etc
  startDate: string;
  endDate: string;
  status: string; // active, completed, draft
  openRate: number;
  clickRate: number;
  contactsReached: number;
}

interface Lead {
  id: string;
  name: string;
  title: string;
  email: string;
  createdDate: string;
  lastContactDate?: string;
  status: string; // new, contacted, qualified, unqualified
}

interface Survey {
  id: string;
  type: string; // csat, nps, feedback
  createdDate: string;
  respondent: string;
  score: number;
  maxScore: number;
  comments?: string;
}

interface PartnerPortalTabMarketingProps {
  partnerId: string;
  campaigns?: CampaignRecord[];
  leads?: Lead[];
  surveys?: Survey[];
}

export function PartnerPortalTabMarketing({
  partnerId,
  campaigns = [],
  leads = [],
  surveys = [],
}: PartnerPortalTabMarketingProps) {
  // 모의 캠페인 데이터
  const mockCampaigns: CampaignRecord[] = campaigns.length > 0 ? campaigns : [
    {
      id: '1',
      name: '신제품 론칭 캠페인',
      type: 'email',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'active',
      openRate: 35.2,
      clickRate: 12.5,
      contactsReached: 152,
    },
    {
      id: '2',
      name: '봄 세일 프로모션',
      type: 'email',
      startDate: '2024-09-15',
      endDate: '2024-09-30',
      status: 'completed',
      openRate: 42.8,
      clickRate: 18.3,
      contactsReached: 198,
    },
    {
      id: '3',
      name: '온라인 웨비나 초대',
      type: 'webinar',
      startDate: '2024-08-20',
      endDate: '2024-09-15',
      status: 'completed',
      openRate: 28.5,
      clickRate: 8.2,
      contactsReached: 124,
    },
  ];

  // 모의 리드 데이터
  const mockLeads: Lead[] = leads.length > 0 ? leads : [
    {
      id: '1',
      name: '박소영',
      title: '구매담당자',
      email: 'park.soyoung@company.com',
      createdDate: '2024-09-10',
      lastContactDate: '2024-10-25',
      status: 'qualified',
    },
    {
      id: '2',
      name: '이지훈',
      title: '부장',
      email: 'lee.jihun@company.com',
      createdDate: '2024-10-05',
      lastContactDate: '2024-10-28',
      status: 'qualified',
    },
    {
      id: '3',
      name: '김미옥',
      title: '팀장',
      email: 'kim.mieok@company.com',
      createdDate: '2024-10-15',
      lastContactDate: undefined,
      status: 'contacted',
    },
    {
      id: '4',
      name: '최준호',
      title: '신입사원',
      email: 'choi.junho@company.com',
      createdDate: '2024-10-22',
      lastContactDate: undefined,
      status: 'new',
    },
  ];

  // 모의 설문 데이터
  const mockSurveys: Survey[] = surveys.length > 0 ? surveys : [
    {
      id: '1',
      type: 'nps',
      createdDate: '2024-10-25',
      respondent: '박소영',
      score: 8,
      maxScore: 10,
      comments: '제품 품질은 우수하나 배송기간이 길어 아쉽습니다.',
    },
    {
      id: '2',
      type: 'csat',
      createdDate: '2024-10-20',
      respondent: '이지훈',
      score: 8,
      maxScore: 10,
      comments: '애프터서비스가 매우 만족스럽습니다.',
    },
    {
      id: '3',
      type: 'feedback',
      createdDate: '2024-10-15',
      respondent: '김미옥',
      score: 7,
      maxScore: 10,
      comments: '신제품 출시 시 미리 공지해주면 좋겠습니다.',
    },
  ];

  const getCampaignTypeBg = (type: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      event: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      webinar: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getCampaignTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: '이메일',
      event: '이벤트',
      webinar: '웨비나',
    };
    return labels[type] || type;
  };

  const getCampaignStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getCampaignStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: '진행중',
      completed: '완료',
      draft: '작성중',
    };
    return labels[status] || status;
  };

  const getLeadStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      contacted: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      qualified: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      unqualified: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30';
  };

  const getLeadStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: '신규',
      contacted: '접촉함',
      qualified: '검증됨',
      unqualified: '부적격',
    };
    return labels[status] || status;
  };

  const getSurveyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      nps: 'NPS 설문',
      csat: 'CSAT 설문',
      feedback: '의견 수집',
    };
    return labels[type] || type;
  };

  const getSurveyTypeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const avgNPS = Math.round(
    mockSurveys
      .filter((s) => s.type === 'nps')
      .reduce((sum, s) => sum + s.score, 0) / mockSurveys.filter((s) => s.type === 'nps').length ||
      0
  );

  const avgCSAT = Math.round(
    mockSurveys
      .filter((s) => s.type === 'csat')
      .reduce((sum, s) => sum + s.score, 0) / mockSurveys.filter((s) => s.type === 'csat').length ||
      0
  );

  const getTrendColor = (value: number | string, threshold: number = 7) => {
    if (value === 0 || value === '-') return 'default';
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    return numValue >= threshold ? 'success' : 'warning';
  };

  const stats = [
    {
      label: '진행 중인 캠페인',
      value: mockCampaigns.filter((c) => c.status === 'active').length,
      trend: 'up' as const,
      color: 'success' as const,
      icon: <Zap className="w-full h-full" />,
    },
    {
      label: '총 리드',
      value: mockLeads.length,
      trend: 'up' as const,
      color: 'success' as const,
      icon: <Users className="w-full h-full" />,
    },
    {
      label: '평균 NPS',
      value: avgNPS || '-',
      trend: avgNPS >= 7 ? ('up' as const) : ('down' as const),
      color: avgNPS >= 7 ? ('success' as const) : ('warning' as const),
      icon: <TrendingUp className="w-full h-full" />,
    },
    {
      label: '평균 CSAT',
      value: avgCSAT || '-',
      trend: avgCSAT >= 7 ? ('up' as const) : ('down' as const),
      color: avgCSAT >= 7 ? ('success' as const) : ('warning' as const),
      icon: <MessageSquare className="w-full h-full" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const color = stat.color as 'success' | 'warning' | 'default' | 'primary';
          return (
            <Card
              key={idx}
              className={cn(
                colorClasses[color],
                'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
              )}
            >
              {/* 배경 그라디언트 */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                  gradientClasses[color],
                )}
              />

              {/* 배경 아이콘 */}
              {stat.icon && (
                <div
                  className={cn(
                    'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                    iconColorClasses[color],
                  )}
                >
                  <div className="w-28 h-28">
                    {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, {
                      className: 'w-full h-full'
                    })}
                  </div>
                </div>
              )}

              <CardContent className="p-6 relative h-full flex flex-col justify-center">
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{stat.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">{stat.value}</p>
                  </div>
                  {stat.trend && (
                    <div className="mt-3 flex items-center gap-2">
                      {stat.trend === 'up' && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                          ↑ 증가
                        </span>
                      )}
                      {stat.trend === 'down' && (
                        <span className="text-xs font-medium text-destructive">
                          ↓ 감소
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 캠페인 히스토리 */}
      <Card className={cn(
        "relative overflow-hidden",
        "border border-border",
        "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
        "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
        "transition-all duration-300 group cursor-pointer"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
          "from-primary/5 via-primary/2 to-transparent"
        )} />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">캠페인 히스토리</h3>
            <Button size="sm">
              모두 보기
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-100 dark:bg-neutral-700/50">
                <TableRow>
                <TableHead className="text-xs font-medium">캠페인명</TableHead>
                <TableHead className="text-xs font-medium">유형</TableHead>
                <TableHead className="text-xs font-medium">기간</TableHead>
                <TableHead className="text-xs font-medium">상태</TableHead>
                <TableHead className="text-xs font-medium">오픈율</TableHead>
                <TableHead className="text-xs font-medium">클릭율</TableHead>
                <TableHead className="text-xs font-medium">대상자</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-neutral-100 dark:bg-neutral-700/50">
                  <TableCell className="text-sm font-medium text-foreground">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getCampaignTypeBg(
                        campaign.type
                      )}`}
                    >
                      {getCampaignTypeLabel(campaign.type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {campaign.startDate} ~ {campaign.endDate}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getCampaignStatusBg(
                        campaign.status
                      )}`}
                    >
                      {getCampaignStatusLabel(campaign.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{campaign.openRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-sm font-medium">{campaign.clickRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{campaign.contactsReached}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 잠재 리드 목록 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">잠재 리드 목록</h3>
              <Button size="sm">
                <Mail className="h-4 w-4 mr-2" />
                추가
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border border-border rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeadStatusBg(
                          lead.status
                        )}`}
                      >
                        {getLeadStatusLabel(lead.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.title}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      추가일: {lead.createdDate}
                      {lead.lastContactDate && ` | 최근연락: ${lead.lastContactDate}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>

        {/* 피드백/설문 응답 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">피드백 및 설문 응답</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockSurveys.map((survey) => (
                <div
                  key={survey.id}
                  className="p-4 border border-border rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{getSurveyTypeLabel(survey.type)}</h4>
                  <span
                    className={`text-2xl font-bold ${getSurveyTypeColor(
                      survey.score,
                      survey.maxScore
                    )}`}
                  >
                    {survey.score}/{survey.maxScore}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {survey.respondent} • {survey.createdDate}
                </p>

                  {survey.comments && (
                    <p className="text-sm text-foreground bg-neutral-100 dark:bg-neutral-700/50 rounded p-2 mt-2">
                      {survey.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
