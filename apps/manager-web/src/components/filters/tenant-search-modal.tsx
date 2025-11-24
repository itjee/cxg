/**
 * @file tenant-search-modal.tsx
 * @description Tenant search and selection modal
 */

"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2 } from "lucide-react";
import { useTenantsForSelector } from "@/features/tnnt/tenant-portal/hooks";
import type { Tenant } from "@/features/tnnt/tenants";

interface TenantSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantSelect: (tenantId: string) => void;
}

export function TenantSearchModal({
  open,
  onOpenChange,
  onTenantSelect,
}: TenantSearchModalProps) {
  const [searchText, setSearchText] = useState("");
  const { data: tenantsData, loading } = useTenantsForSelector({
    search: searchText,
  });

  const tenants = tenantsData?.tenants || [];

  // Filter tenants based on search
  const filteredTenants = useMemo(() => {
    if (!searchText.trim()) return tenants;

    const query = searchText.toLowerCase();
    return tenants.filter(
      (tenant) =>
        tenant.name?.toLowerCase().includes(query) ||
        tenant.code?.toLowerCase().includes(query) ||
        (tenant.bizName || tenant.biz_name || "")
          .toLowerCase()
          .includes(query) ||
        (tenant.bizNo || tenant.biz_no || "").toLowerCase().includes(query)
    );
  }, [tenants, searchText]);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "TRIAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "SUSPENDED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "ACTIVE":
        return "활성";
      case "TRIAL":
        return "평가판";
      case "SUSPENDED":
        return "일시중단";
      default:
        return "비활성";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>테넌트 변경</DialogTitle>
          <DialogDescription>
            검색하여 변경할 테넌트를 선택하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="테넌트명, 코드, 상호, 사업자번호로 검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Tenants List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <Card
                  key={tenant.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onTenantSelect(tenant.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 pt-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {tenant.name}
                        </h3>
                        <Badge
                          className={getStatusColor(tenant.status)}
                          variant="outline"
                        >
                          {getStatusLabel(tenant.status)}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground mb-2">
                        코드: <span className="font-mono">{tenant.code}</span>
                      </div>

                      {((tenant.bizName || tenant.biz_name) ||
                        (tenant.bizNo || tenant.biz_no)) && (
                        <div className="text-sm text-foreground">
                          {(tenant.bizName || tenant.biz_name) && (
                            <div>
                              상호:{" "}
                              <span className="font-medium">
                                {tenant.bizName || tenant.biz_name}
                              </span>
                            </div>
                          )}
                          {(tenant.bizNo || tenant.biz_no) && (
                            <div>
                              사업자번호:{" "}
                              <span className="font-mono font-medium">
                                {tenant.bizNo || tenant.biz_no}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 text-muted-foreground">
                      →
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchText ? "검색 결과가 없습니다" : "테넌트가 없습니다"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
