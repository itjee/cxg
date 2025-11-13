import { useMemo } from "react";
import { Shield, CheckCircle, Clock, Archive } from "lucide-react";
import { StatsCards, type StatCardData } from "@/components/stats";
import type { Policy } from "../types/policies.types";

interface PoliciesStatsProps {
  data: Policy[];
}

export function PoliciesStats({ data }: PoliciesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((p) => p.status === "ACTIVE").length;
    const pending = data.filter((p) => p.status === "PENDING_APPROVAL").length;
    const archived = data.filter((p) => p.status === "ARCHIVED").length;
    const mandatory = data.filter((p) => p.enforcement_level === "MANDATORY").length;

    return [
      {
        title: "전체 정책",
        value: total.toString(),
        description: "보안 정책",
        icon: <Shield className="h-5 w-5" />,
        color: "primary",
      },
      {
        title: "활성 정책",
        value: active.toString(),
        description: `${total > 0 ? ((active / total) * 100).toFixed(1) : 0}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success",
      },
      {
        title: "승인 대기",
        value: pending.toString(),
        description: `필수 정책: ${mandatory}`,
        icon: <Clock className="h-5 w-5" />,
        color: "warning",
      },
      {
        title: "보관됨",
        value: archived.toString(),
        description: "이전 버전",
        icon: <Archive className="h-5 w-5" />,
        color: "default",
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
