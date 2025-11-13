/**
 * useCampaigns Hook
 * TanStack Query를 사용한 캠페인 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaigns.service';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignQueryParams,
} from '../';

const CAMPAIGNS_QUERY_KEY = ['campaigns'] as const;

/**
 * 캠페인 목록 조회 훅
 */
export function useCampaigns(params?: CampaignQueryParams) {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => campaignService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 캠페인 상세 조회 훅
 */
export function useCampaign(id: string | null | undefined) {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, 'detail', id],
    queryFn: () => campaignService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 캠페인 생성 훅
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create campaign:', error);
    },
  });
}

/**
 * 캠페인 수정 훅
 */
export function useUpdateCampaign(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCampaignRequest) =>
      campaignService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CAMPAIGNS_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update campaign ${id}:`, error);
    },
  });
}

/**
 * 캠페인 삭제 훅
 */
export function useDeleteCampaign(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => campaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete campaign ${id}:`, error);
    },
  });
}
