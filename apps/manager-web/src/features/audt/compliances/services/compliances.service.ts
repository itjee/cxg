import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Compliance,
  ComplianceListResponse,
  ComplianceQueryParams,
  CreateComplianceRequest,
  UpdateComplianceRequest,
} from "../types/compliances.types";

const ENDPOINT = "/api/v1/compliances";

export const complianceService = {
  async listCompliances(
    params?: ComplianceQueryParams,
    signal?: AbortSignal
  ): Promise<ComplianceListResponse> {
    try {
      const response = await api.get<{ data: ComplianceListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          report_type: params?.report_type,
          compliance_status: params?.compliance_status,
          status: params?.status,
          scope: params?.scope,
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
      throw ApiError.fromAxiosError(error, "listCompliances");
    }
  },

  async getCompliance(id: string): Promise<Compliance> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getCompliance(${id})`);
    }
  },

  async createCompliance(data: CreateComplianceRequest): Promise<Compliance> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createCompliance");
    }
  },

  async updateCompliance(
    id: string,
    data: UpdateComplianceRequest
  ): Promise<Compliance> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateCompliance(${id})`);
    }
  },

  async deleteCompliance(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteCompliance(${id})`);
    }
  },

  async downloadReport(id: string): Promise<Blob> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `downloadReport(${id})`);
    }
  },
};
