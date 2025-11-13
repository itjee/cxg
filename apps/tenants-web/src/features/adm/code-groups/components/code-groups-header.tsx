"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useCodeGroupStore } from "../stores/code-groups.store";

interface CodeGroupsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * CodeGroups 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function CodeGroupsHeader({
  onRefresh,
  onExport,
}: CodeGroupsHeaderProps) {
  const { openSidebar } = useCodeGroupStore();

  return (
    <ListPageHeader
      title="코드그룹관리"
      description="공통 코드의 그룹 정보를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "코드그룹 추가",
          icon: Plus,
          onClick: () => openSidebar(),
          variant: "default",
        },
        {
          label: "내보내기",
          icon: Download,
          onClick: () => onExport?.(),
          variant: "outline",
        },
      ]}
    />
  );
}
