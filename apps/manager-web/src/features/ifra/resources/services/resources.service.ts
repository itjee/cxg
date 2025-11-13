import { api } from "@/lib/api";
import type {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
  ResourceListResponse,
  ResourceQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/manager/ifra/resources";

export const resourceService = {
  async listResources(
    params?: ResourceQueryParams,
    signal?: AbortSignal
  ): Promise<ResourceListResponse> {
    const response = await api.get<{ data: ResourceListResponse }>(ENDPOINT, {
      params: {
        page: params?.page,
        page_size: params?.page_size,
        search: params?.search,
        resource: params?.resource,
        status: params?.status,
        tenant_id: params?.tenant_id,
        region: params?.region,
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
  },

  async getResource(id: string, signal?: AbortSignal): Promise<Resource> {
    const response = await api.get<{ data: Resource }>(`${ENDPOINT}/${id}`, {
      signal,
    });
    return response.data.data;
  },

  async createResource(data: CreateResourceRequest): Promise<Resource> {
    const response = await api.post<{ data: Resource }>(ENDPOINT, data);
    return response.data.data;
  },

  async updateResource(
    id: string,
    data: UpdateResourceRequest
  ): Promise<Resource> {
    const response = await api.put<{ data: Resource }>(
      `${ENDPOINT}/${id}`,
      data
    );
    return response.data.data;
  },

  async deleteResource(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
