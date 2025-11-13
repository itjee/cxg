"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRolesStore } from "../stores/roles.store";
import type { Roles } from "../types/roles.types";

interface RolesFiltersProps {
  roles: Roles[];
}

export function RolesFilters({ roles }: RolesFiltersProps) {
  const { selectedStatus, globalFilter, setSelectedStatus, setGlobalFilter } = useRolesStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input placeholder="role 검색..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-10" />
      </div>
      <div className="flex gap-2">
        <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "active" | "inactive" | "")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">전체</SelectItem>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="inactive">비활성</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
