import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  AuditLog,
  AuditLogListResponse,
  AuditLogQueryParams,
} from "../types/audit-logs.types";

const ENDPOINT = "/api/v1/audit-logs";

export const auditLogService = {
  async listAuditLogs(
    params?: AuditLogQueryParams,
    signal?: AbortSignal
  ): Promise<AuditLogListResponse> {
    try {
      const response = await api.get<{ data: AuditLogListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          event_type: params?.event_type,
          event_category: params?.event_category,
          result: params?.result,
          risk_level: params?.risk_level,
          tenant_id: params?.tenant_id,
          user_id: params?.user_id,
          start_date: params?.start_date,
          end_date: params?.end_date,
        },
        signal,
      });
      return (
        response.data.data || {
          items: [],
          total: 0,
          page: 1,
          page_size: 20,
          total_pages: 0,
        }
      );
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listAuditLogs");
    }
  },

  async getAuditLog(id: string): Promise<AuditLog> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getAuditLog(${id})`);
    }
  },
};
