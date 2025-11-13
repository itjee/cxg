'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreVertical, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesPortalTabPipelineProps {
  salespersonId?: string;
  opportunities?: any;
}

const colorClasses = {
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  neutral: 'border-border bg-card/50',
};

const iconColorClasses = {
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-500',
  neutral: 'text-muted-foreground',
};

const gradientClasses = {
  primary: 'from-primary/10 via-primary/5 to-transparent',
  success: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  neutral: 'from-muted/10 via-muted/5 to-transparent',
};

export function SalesPortalTabPipeline({
  salespersonId,
}: SalesPortalTabPipelineProps) {
  // 모의 파이프라인 데이터 - Salesforce 표준 단계 (7단계)
  const pipelineStages = [
    {
      stage: 'prospecting',
      label: '탐색',
      description: '초기 리드 발굴, 아직 확인되지 않음',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      count: 12,
      value: 850000000,
      opportunities: [
        { id: '1', name: '신규 고객 A사', company: 'A사', amount: 150000000, date: '2024-11-10' },
        { id: '2', name: '웹사이트 문의', company: 'B사', amount: 200000000, date: '2024-11-08' },
        { id: '3', name: '전시회 참가사', company: 'C사', amount: 250000000, date: '2024-11-05' },
        { id: '4', name: '소개 고객', company: 'D사', amount: 250000000, date: '2024-10-28' },
      ],
    },
    {
      stage: 'qualification',
      label: '검증',
      description: '고객의 필요성 확인, 예산 및 권한자 파악',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      count: 8,
      value: 1200000000,
      opportunities: [
        { id: '5', name: 'E사 시스템 개선', company: 'E사', amount: 300000000, date: '2024-11-02' },
        { id: '6', name: 'F사 운영 자동화', company: 'F사', amount: 350000000, date: '2024-10-30' },
        { id: '7', name: 'G사 데이터 분석', company: 'G사', amount: 280000000, date: '2024-10-28' },
        { id: '8', name: 'H사 클라우드 전환', company: 'H사', amount: 270000000, date: '2024-10-25' },
      ],
    },
    {
      stage: 'needs-analysis',
      label: '분석',
      description: '구체적인 비즈니스 요구사항 분석',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      count: 6,
      value: 1100000000,
      opportunities: [
        { id: '9', name: '삼성전자 클라우드', company: '삼성전자', amount: 350000000, date: '2024-10-28' },
        { id: '10', name: 'LG전자 AI 솔루션', company: 'LG전자', amount: 280000000, date: '2024-10-25' },
        { id: '11', name: 'SK하이닉스 보안', company: 'SK하이닉스', amount: 470000000, date: '2024-10-22' },
      ],
    },
    {
      stage: 'value-proposition',
      label: '제안',
      description: '제안서 준비 및 솔루션 제시',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      count: 5,
      value: 1500000000,
      opportunities: [
        { id: '12', name: '현대자동차 MES', company: '현대자동차', amount: 570000000, date: '2024-10-20' },
        { id: '13', name: 'SK C&C ERP 구축', company: 'SK C&C', amount: 500000000, date: '2024-11-01' },
        { id: '14', name: 'CJ제일제당 DW', company: 'CJ제일제당', amount: 430000000, date: '2024-10-25' },
      ],
    },
    {
      stage: 'negotiation',
      label: '협상',
      description: '계약조건 협상 및 최종 검토',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      count: 3,
      value: 1200000000,
      opportunities: [
        { id: '15', name: '넥슨 게이밍 플랫폼', company: '넥슨', amount: 400000000, date: '2024-10-20' },
        { id: '16', name: '카카오 광고 플랫폼', company: '카카오', amount: 450000000, date: '2024-10-28' },
        { id: '17', name: '네이버 클라우드 확장', company: '네이버', amount: 350000000, date: '2024-10-15' },
      ],
    },
    {
      stage: 'closed-won',
      label: '성약',
      description: '거래 성공 완료',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      count: 2,
      value: 900000000,
      opportunities: [
        { id: '18', name: '포스코 스마트팩토리', company: '포스코', amount: 500000000, date: '2024-10-10' },
        { id: '19', name: 'GS칼텍스 에너지관리', company: 'GS칼텍스', amount: 400000000, date: '2024-10-05' },
      ],
    },
    {
      stage: 'closed-lost',
      label: '실패',
      description: '거래 실패 또는 취소',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      count: 3,
      value: 650000000,
      opportunities: [
        { id: '20', name: '삼성SDS 클라우드', company: '삼성SDS', amount: 300000000, date: '2024-10-15' },
        { id: '21', name: 'KT 5G 인프라', company: 'KT', amount: 250000000, date: '2024-10-10' },
        { id: '22', name: '로엔엔터테인먼트', company: '로엔', amount: 100000000, date: '2024-10-08' },
      ],
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

  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const totalOpportunities = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="space-y-6">
      {/* 파이프라인 요약 - 4열 2줄 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 파이프라인 카드 */}
        <Card
          className={cn(
            colorClasses.primary,
            'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
          )}
        >
          {/* 배경 그라디언트 */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
              gradientClasses.primary,
            )}
          />

          {/* 배경 아이콘 */}
          <div
            className={cn(
              'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
              iconColorClasses.primary,
            )}
          >
            <div className="w-28 h-28">
              <Target className="w-full h-full" />
            </div>
          </div>

          <CardContent className="p-6 relative h-full flex flex-col justify-center">
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                총 파이프라인
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  기회 {totalOpportunities}건
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 단계별 카드 */}
        {pipelineStages.map((stage) => {
          const percentage = (stage.value / totalValue) * 100;
          return (
            <Card
              key={stage.stage}
              className={cn(
                colorClasses.success,
                'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
              )}
            >
              {/* 배경 그라디언트 */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                  gradientClasses.success,
                )}
              />

              {/* 배경 아이콘 */}
              <div
                className={cn(
                  'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                  iconColorClasses.success,
                )}
              >
                <div className="w-28 h-28">
                  <TrendingUp className="w-full h-full" />
                </div>
              </div>

              <CardContent className="p-6 relative h-full flex flex-col justify-center">
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {stage.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                      {formatCurrency(stage.value)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {stage.count}건 ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 파이프라인 구성 - Kanban 스타일 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">파이프라인 구성</h3>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {pipelineStages.map((stage) => (
              <div key={stage.stage} className="flex-shrink-0 w-80 space-y-3">
                {/* 단계 헤더 */}
                <div className={`p-3 rounded-lg ${stage.color} sticky top-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{stage.label}</h4>
                      <p className="text-xs opacity-75">{stage.count}건 · {formatCurrency(stage.value)}</p>
                      <p className="text-xs opacity-60 mt-1">{stage.description}</p>
                    </div>
                  </div>
                </div>

                {/* 기회 카드 */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {stage.opportunities.map((opp) => (
                    <Card
                      key={opp.id}
                      className="cursor-move hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all group"
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{opp.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{opp.company}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="pt-2 border-t border-border/50 space-y-1">
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(opp.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {opp.date}
                          </p>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex gap-1 pt-2">
                          <Button variant="ghost" size="sm" className="flex-1 text-xs h-7">
                            상세 보기
                          </Button>
                          {stage.stage !== 'negotiation' && (
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 파이프라인 트렌드 */}
      <Card
        className={cn(
          colorClasses.neutral,
          'relative overflow-hidden group transition-all duration-300 hover:shadow-lg',
        )}
      >
        {/* 배경 그라디언트 */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
            gradientClasses.neutral,
          )}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">파이프라인 추이 (최근 6개월)</h3>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">파이프라인 금액</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* 차트 */}
            <div className="space-y-3">
              <div className="flex items-end gap-1.5 h-56 px-2">
                {[
                  { value: 65, amount: 200 },
                  { value: 72, amount: 250 },
                  { value: 68, amount: 240 },
                  { value: 75, amount: 280 },
                  { value: 82, amount: 320 },
                  { value: 88, amount: 360 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                    <div className="w-full bg-muted/30 rounded-t-lg hover:bg-muted/50 transition-all duration-200 relative group/column" style={{ height: `${bar.value}%`, minHeight: '40px' }}>
                      {/* 바 그라디언트 */}
                      <div
                        className="w-full h-full bg-gradient-to-t from-primary via-primary/80 to-primary/60 rounded-t-lg transition-all duration-200 group-hover/column:shadow-lg group-hover/column:shadow-primary/30"
                        style={{ height: '100%' }}
                      />
                      {/* 호버 값 표시 */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/column:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        <div className="bg-foreground text-background text-xs font-semibold rounded-md px-3 py-1.5 shadow-lg">
                          ₩{bar.amount}M
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 월 라벨 */}
              <div className="flex justify-between px-2 text-xs text-muted-foreground font-medium">
                <span>5월</span>
                <span>6월</span>
                <span>7월</span>
                <span>8월</span>
                <span>9월</span>
                <span>10월</span>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">평균</p>
                <p className="text-lg font-bold text-foreground">₩271M</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">최고</p>
                <p className="text-lg font-bold text-primary">₩360M</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">증가율</p>
                <p className="text-lg font-bold text-primary">↑ 80%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
