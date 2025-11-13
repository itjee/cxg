import { useQuery } from "@tanstack/react-query";
import { auditLogService } from "../services/audit-logs.service";
import type { AuditLogQueryParams } from "../types/audit-logs.types";

const auditLogsKeys = {
  all: ["auditLogs"] as const,
  lists: () => [...auditLogsKeys.all, "list"] as const,
  list: (params?: AuditLogQueryParams) =>
    [...auditLogsKeys.lists(), params] as const,
  detail: (id: string) => [...auditLogsKeys.all, "detail", id] as const,
};

export function useAuditLogs(params?: AuditLogQueryParams) {
  return useQuery({
    queryKey: auditLogsKeys.list(params),
    queryFn: ({ signal }) => auditLogService.listAuditLogs(params, signal),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useAuditLog(id?: string | null) {
  return useQuery({
    queryKey: auditLogsKeys.detail(id!),
    queryFn: () => auditLogService.getAuditLog(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
