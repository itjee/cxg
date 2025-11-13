import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { resourceService } from "../services";
import type {
  Resource,
  ResourceQueryParams,
  CreateResourceRequest,
  UpdateResourceRequest,
} from "../types";

// Query Key Factory
export const resourcesKeys = {
  all: ["resources"] as const,
  lists: () => [...resourcesKeys.all, "list"] as const,
  list: (params?: ResourceQueryParams) =>
    [...resourcesKeys.lists(), { ...params }] as const,
  details: () => [...resourcesKeys.all, "detail"] as const,
  detail: (id: string) => [...resourcesKeys.details(), id] as const,
};

// Query Hooks
export function useResources(
  params?: ResourceQueryParams,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: resourcesKeys.list(params),
    queryFn: ({ signal }) => resourceService.listResources(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    ...options,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: resourcesKeys.detail(id),
    queryFn: ({ signal }) => resourceService.getResource(id, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}

// Mutation Hooks
export function useCreateResource(
  options?: UseMutationOptions<Resource, Error, CreateResourceRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => resourceService.createResource(data),
    onSuccess: (newResource) => {
      queryClient.invalidateQueries({
        queryKey: resourcesKeys.lists(),
      });
      options?.onSuccess?.(newResource, {} as any, {} as any);
    },
    onError: options?.onError,
  });
}

export function useUpdateResource(
  id: string,
  options?: UseMutationOptions<Resource, Error, UpdateResourceRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => resourceService.updateResource(id, data),
    onSuccess: (updatedResource) => {
      queryClient.invalidateQueries({
        queryKey: resourcesKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: resourcesKeys.detail(id),
      });
      options?.onSuccess?.(updatedResource, {} as any, {} as any);
    },
    onError: options?.onError,
  });
}

export function useDeleteResource(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourcesKeys.lists(),
      });
      options?.onSuccess?.(undefined, {} as any, {} as any);
    },
    onError: options?.onError,
  });
}
