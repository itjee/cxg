"use client";

import { useMemo } from "react";
import { Database, HardDrive, Cpu, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Resource } from "../types";

interface ResourcesStatsProps {
  data: Resource[];
}

export function ResourcesStats({ data }: ResourcesStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const running = data.filter((r) => r.status === "RUNNING").length;
    const totalCpu = data.reduce((sum, r) => sum + (r.cpu_cores || 0), 0);
    const totalMemory = data.reduce((sum, r) => sum + (r.memory_size || 0), 0);
    const totalCost = data.reduce((sum, r) => sum + (r.monthly_cost || 0), 0);

    return [
      {
        title: "전체 리소스",
        value: total,
        description: `${running}개 실행중`,
        icon: Database,
        color: "primary",
      },
      {
        title: "총 CPU",
        value: `${totalCpu} 코어`,
        description: "전체 할당량",
        icon: Cpu,
        color: "success",
      },
      {
        title: "총 메모리",
        value: `${(totalMemory / 1024).toFixed(1)} GB`,
        description: "전체 할당량",
        icon: HardDrive,
        color: "warning",
      },
      {
        title: "월간 총 비용",
        value: `$${totalCost.toFixed(2)}`,
        description: "예상 비용",
        icon: DollarSign,
        color: "default",
      },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stat.description}
                  </p>
                )}
              </div>
              <stat.icon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
