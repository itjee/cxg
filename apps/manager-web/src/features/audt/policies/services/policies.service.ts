import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Policy,
  PolicyListResponse,
  PolicyQueryParams,
  CreatePolicyRequest,
  UpdatePolicyRequest,
} from "../types/policies.types";

const ENDPOINT = "/api/v1/policies";

export const policyService = {
  async listPolicies(
    params?: PolicyQueryParams,
    signal?: AbortSignal
  ): Promise<PolicyListResponse> {
    try {
      const response = await api.get<{ data: PolicyListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          policy_type: params?.policy_type,
          policy_category: params?.policy_category,
          status: params?.status,
          enforcement_level: params?.enforcement_level,
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
      throw ApiError.fromAxiosError(error, "listPolicies");
    }
  },

  async getPolicy(id: string): Promise<Policy> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getPolicy(${id})`);
    }
  },

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createPolicy");
    }
  },

  async updatePolicy(
    id: string,
    data: UpdatePolicyRequest
  ): Promise<Policy> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updatePolicy(${id})`);
    }
  },

  async deletePolicy(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deletePolicy(${id})`);
    }
  },

  async approvePolicy(id: string, approver: string): Promise<Policy> {
    try {
      const response = await api.post(`${ENDPOINT}/${id}/approve`, { approver });
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `approvePolicy(${id})`);
    }
  },
};
