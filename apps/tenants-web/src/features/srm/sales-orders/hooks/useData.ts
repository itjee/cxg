import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const QUERY_KEY = ['data'] as const;

export function useList(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => ({}),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => ({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => ({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDelete(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
