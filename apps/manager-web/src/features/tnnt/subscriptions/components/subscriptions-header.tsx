"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useSubscriptionsStore } from "../stores/subscriptions.store";

interface SubscriptionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function SubscriptionsHeader({ onRefresh, onExport }: SubscriptionsHeaderProps) {
  const { openForm } = useSubscriptionsStore();

  const actions = [
    ...(onRefresh ? [{ label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" as const }] : []),
    { label: "구독 추가", icon: Plus, onClick: () => openForm(), variant: "default" as const },
    ...(onExport ? [{ label: "내보내기", icon: Download, onClick: onExport, variant: "outline" as const }] : []),
  ];

  return <ListPageHeader title="구독 관리" description="플랫폼 구독을 관리합니다" actions={actions} />;
}
