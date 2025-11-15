"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResourcesStore } from "../stores";
import type { Resource } from "../types";

interface ResourcesFiltersProps {
  data: Resource[];
}

export function ResourcesFilters({ data }: ResourcesFiltersProps) {
  const {
    globalFilter,
    setGlobalFilter,
    selectedResource,
    setSelectedResource,
    selectedStatus,
    setSelectedStatus,
    selectedRegion,
    setSelectedRegion,
    resetFilters,
  } = useResourcesStore();

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(data.map((r) => r.region)));
  }, [data]);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-4">
        <Input
          placeholder="리소스명, 리소스ID 검색..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="flex-1"
        />

        <Select value={selectedResource} onValueChange={setSelectedResource}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="리소스 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="DATABASE">데이터베이스</SelectItem>
            <SelectItem value="STORAGE">스토리지</SelectItem>
            <SelectItem value="COMPUTE">컴퓨팅</SelectItem>
            <SelectItem value="NETWORK">네트워크</SelectItem>
            <SelectItem value="CACHE">캐시</SelectItem>
            <SelectItem value="LOAD_BALANCER">로드밸런서</SelectItem>
            <SelectItem value="CDN">CDN</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="PROVISIONING">프로비저닝</SelectItem>
            <SelectItem value="RUNNING">실행중</SelectItem>
            <SelectItem value="STOPPED">중지됨</SelectItem>
            <SelectItem value="TERMINATED">종료됨</SelectItem>
            <SelectItem value="ERROR">오류</SelectItem>
            <SelectItem value="MAINTENANCE">점검중</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="리전" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            {uniqueRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters}>
          초기화
        </Button>
      </div>
    </div>
  );
}
