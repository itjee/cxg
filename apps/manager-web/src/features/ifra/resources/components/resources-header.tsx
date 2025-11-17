"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResourcesStore } from "../stores";

interface ResourcesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ResourcesHeader({ onRefresh, onExport }: ResourcesHeaderProps) {
  const { openForm } = useResourcesStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">리소스 관리</h1>
        <p className="text-gray-600 mt-1">클라우드 리소스를 관리합니다</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          내보내기
        </Button>
        <Button size="sm" onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" />
          리소스 생성
        </Button>
      </div>
    </div>
  );
}
