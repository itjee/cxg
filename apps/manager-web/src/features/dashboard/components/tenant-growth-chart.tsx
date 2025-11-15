"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useTenantGrowth } from "../hooks";
import { useDashboardStore } from "../stores";

export function TenantGrowthChart() {
  // Store에서 선택된 기간 가져오기
  const { selectedPeriod, setSelectedPeriod } = useDashboardStore();

  // GraphQL로 테넌트 성장 데이터 조회
  const { data, loading, error } = useTenantGrowth({ period: selectedPeriod });
  return (
    <Card className="transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-medium">
            테넌트 증가 추이
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              selectedPeriod === "week"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            지난 7일
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              selectedPeriod === "month"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            지난 30일
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              selectedPeriod === "year"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            지난 90일
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center text-destructive text-sm">
            차트 데이터를 로드할 수 없습니다
          </div>
        ) : (
          <div className="h-[300px] relative rounded overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
            {/* Chart visualization using CSS gradient */}
            {data?.tenantGrowth && data.tenantGrowth.length > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0 h-4/5 opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%)",
                  clipPath:
                    "polygon(0% 100%, 8% 85%, 16% 80%, 24% 70%, 32% 65%, 40% 55%, 48% 50%, 56% 40%, 64% 35%, 72% 28%, 80% 25%, 88% 20%, 96% 18%, 100% 15%, 100% 100%)",
                }}
              />
            )}

            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-border/30" />
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-muted-foreground">
              <span className="pl-2">30</span>
              <span className="pl-2">24</span>
              <span className="pl-2">18</span>
              <span className="pl-2">12</span>
              <span className="pl-2">6</span>
              <span className="pl-2">0</span>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-12 pb-2 text-xs text-muted-foreground">
              <span>1월</span>
              <span>2월</span>
              <span>3월</span>
              <span>4월</span>
              <span>5월</span>
              <span>6월</span>
            </div>

            {/* Stats overlay */}
            {data?.tenantGrowth && data.tenantGrowth.length > 0 && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border">
                <div className="text-xs text-muted-foreground mb-1">
                  신규 테넌트
                </div>
                <div className="text-2xl font-bold text-primary">
                  +{data.tenantGrowth[data.tenantGrowth.length - 1].newTenants}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>증가 중</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">테넌트 수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-muted-foreground">활성 테넌트</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
