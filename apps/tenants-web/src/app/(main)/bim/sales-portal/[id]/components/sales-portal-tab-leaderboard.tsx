'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Medal, TrendingUp, Award, BarChart3, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesPortalTabLeaderboardProps {
  salespersonId?: string;
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

export function SalesPortalTabLeaderboard({
  salespersonId,
}: SalesPortalTabLeaderboardProps) {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // 모의 순위표 데이터
  const leaderboard = [
    {
      rank: 1,
      name: '이상훈',
      department: '영업1팀',
      quota: 2000000000,
      achieved: 1950000000,
      quotaAchievementRate: 97.5,
      deals: 8,
      avgDealSize: 243750000,
      winRate: 75,
      growth: 12.5,
      trend: 'up' as const,
    },
    {
      rank: 2,
      name: '박미영',
      department: '영업1팀',
      quota: 2000000000,
      achieved: 1870000000,
      quotaAchievementRate: 93.5,
      deals: 7,
      avgDealSize: 267142857,
      winRate: 70,
      growth: 8.2,
      trend: 'up' as const,
    },
    {
      rank: 3,
      name: '김영업',
      department: '영업1팀',
      quota: 2000000000,
      achieved: 1710000000,
      quotaAchievementRate: 85.5,
      deals: 6,
      avgDealSize: 285000000,
      winRate: 68,
      growth: 5.3,
      trend: 'up' as const,
    },
    {
      rank: 4,
      name: '최성공',
      department: '영업2팀',
      quota: 1800000000,
      achieved: 1480000000,
      quotaAchievementRate: 82.2,
      deals: 5,
      avgDealSize: 296000000,
      winRate: 65,
      growth: 3.1,
      trend: 'stable' as const,
    },
    {
      rank: 5,
      name: '정의진',
      department: '영업2팀',
      quota: 1800000000,
      achieved: 1380000000,
      quotaAchievementRate: 76.7,
      deals: 4,
      avgDealSize: 345000000,
      winRate: 62,
      growth: -2.1,
      trend: 'down' as const,
    },
    {
      rank: 6,
      name: '한성진',
      department: '영업2팀',
      quota: 1800000000,
      achieved: 1260000000,
      quotaAchievementRate: 70.0,
      deals: 4,
      avgDealSize: 315000000,
      winRate: 60,
      growth: 1.5,
      trend: 'stable' as const,
    },
    {
      rank: 7,
      name: '임효진',
      department: '영업3팀',
      quota: 1600000000,
      achieved: 1120000000,
      quotaAchievementRate: 70.0,
      deals: 3,
      avgDealSize: 373333333,
      winRate: 58,
      growth: 4.2,
      trend: 'up' as const,
    },
    {
      rank: 8,
      name: '손준호',
      department: '영업3팀',
      quota: 1600000000,
      achieved: 960000000,
      quotaAchievementRate: 60.0,
      deals: 3,
      avgDealSize: 320000000,
      winRate: 55,
      growth: -3.5,
      trend: 'down' as const,
    },
  ];

  const currentUserRank = leaderboard.find((user) => user.rank === 3);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₩${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₩${(value / 1000000).toFixed(0)}M`;
    }
    return `₩${value.toLocaleString()}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-amber-50 to-transparent dark:from-amber-950/20';
    if (rank === 2) return 'from-slate-50 to-transparent dark:from-slate-900/20';
    if (rank === 3) return 'from-amber-100/30 to-transparent dark:from-amber-900/20';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* 기간 선택 */}
      <div className="flex gap-2">
        {(['month', 'quarter', 'year'] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p === 'month' ? '이번 달' : p === 'quarter' ? '이번 분기' : '올해'}
          </Button>
        ))}
      </div>

      {/* 내 순위 하이라이트 */}
      {currentUserRank && (
        <Card
          className={cn(
            colorClasses.primary,
            'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1',
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
              'absolute -right-8 -top-8 opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110',
              iconColorClasses.primary,
            )}
          >
            <Crown className="w-32 h-32" />
          </div>

          <CardContent className="p-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{currentUserRank.name}</span>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">내 순위</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">순위</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{currentUserRank.rank}위</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">달성률</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {currentUserRank.quotaAchievementRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">성약 건수</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{currentUserRank.deals}건</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">추이</p>
                  <div className="flex items-center gap-1 mt-1">
                    {currentUserRank.trend === 'up' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{currentUserRank.growth}%</span>
                      </>
                    ) : currentUserRank.trend === 'down' ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400 rotate-180" />
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{currentUserRank.growth}%</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">→</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 진행 바 */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>목표 진행</span>
                  <span className="font-medium">
                    {formatCurrency(currentUserRank.achieved)} / {formatCurrency(currentUserRank.quota)}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((currentUserRank.achieved / currentUserRank.quota) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 순위표 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">전체 순위</h3>
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <Card
              key={user.rank}
              className={cn(
                'bg-gradient-to-r hover:shadow-md transition-all duration-300 cursor-pointer',
                user.rank === 3 && getRankColor(user.rank),
                getRankColor(user.rank),
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  {/* 순위 */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-center min-w-[32px]">
                      {getRankIcon(user.rank) ? (
                        getRankIcon(user.rank)
                      ) : (
                        <span
                          className={cn(
                            'text-lg font-bold',
                            user.rank <= 3 ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground',
                          )}
                        >
                          {user.rank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 사용자 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          'font-semibold text-foreground',
                          user.rank === 3 && 'text-blue-700 dark:text-blue-400',
                        )}
                      >
                        {user.name}
                      </h4>
                      {user.rank === 3 && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                          나
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  </div>

                  {/* 성과 지표 */}
                  <div className="grid grid-cols-4 gap-4 text-right text-xs flex-shrink-0">
                    <div>
                      <p className="text-muted-foreground text-xs">달성률</p>
                      <p className="font-bold text-foreground">{user.quotaAchievementRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">성약</p>
                      <p className="font-bold text-foreground">{user.deals}건</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">성공률</p>
                      <p className="font-bold text-foreground">{user.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">추이</p>
                      <div className="flex items-center justify-end gap-1">
                        {user.trend === 'up' ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              +{user.growth}%
                            </span>
                          </>
                        ) : user.trend === 'down' ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-red-600 dark:text-red-400 rotate-180" />
                            <span className="font-bold text-red-600 dark:text-red-400">
                              {user.growth}%
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-muted-foreground">→</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">목표 진행</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(user.achieved)} / {formatCurrency(user.quota)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        user.rank === 1 && 'bg-gradient-to-r from-amber-500 to-amber-400',
                        user.rank === 2 && 'bg-gradient-to-r from-slate-400 to-slate-300',
                        user.rank === 3 && 'bg-gradient-to-r from-blue-600 to-blue-400',
                        user.rank > 3 && 'bg-gradient-to-r from-purple-600 to-purple-400',
                      )}
                      style={{
                        width: `${Math.min((user.achieved / user.quota) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 순위표 통계 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">팀 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={cn(
              colorClasses.primary,
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses.primary,
              )}
            />
            <div
              className={cn(
                'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                iconColorClasses.primary,
              )}
            >
              <div className="w-28 h-28">
                <BarChart3 className="w-full h-full" />
              </div>
            </div>
            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  전체 매출
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {formatCurrency(
                      leaderboard.reduce((sum, user) => sum + user.achieved, 0),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              colorClasses.success,
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses.success,
              )}
            />
            <div
              className={cn(
                'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                iconColorClasses.success,
              )}
            >
              <div className="w-28 h-28">
                <Award className="w-full h-full" />
              </div>
            </div>
            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  평균 달성률
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {(leaderboard.reduce((sum, user) => sum + user.quotaAchievementRate, 0) / leaderboard.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              colorClasses.info,
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses.info,
              )}
            />
            <div
              className={cn(
                'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                iconColorClasses.info,
              )}
            >
              <div className="w-28 h-28">
                <Zap className="w-full h-full" />
              </div>
            </div>
            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  총 성약 건수
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {leaderboard.reduce((sum, user) => sum + user.deals, 0)}건
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              colorClasses.warning,
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses.warning,
              )}
            />
            <div
              className={cn(
                'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                iconColorClasses.warning,
              )}
            >
              <div className="w-28 h-28">
                <Award className="w-full h-full" />
              </div>
            </div>
            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  평균 거래액
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {formatCurrency(
                      leaderboard.reduce((sum, user) => sum + user.avgDealSize * user.deals, 0) /
                        leaderboard.reduce((sum, user) => sum + user.deals, 0),
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
