/**
 * useNPSSurveys Hook
 * TanStack Query를 사용한 NPS 설문 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { npsSurveyService } from "../services";
import type {
  NPSSurvey,
  CreateNPSSurveyRequest,
  UpdateNPSSurveyRequest,
  NPSSurveyQueryParams,
} from "../types";

const NPS_SURVEYS_QUERY_KEY = ["nps-surveys"] as const;

export function useNPSSurveys(params?: NPSSurveyQueryParams) {
  return useQuery({
    queryKey: [...NPS_SURVEYS_QUERY_KEY, params],
    queryFn: () => npsSurveyService.listNPSSurveys(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useNPSSurvey(id: string | null | undefined) {
  return useQuery({
    queryKey: [...NPS_SURVEYS_QUERY_KEY, "detail", id],
    queryFn: () => npsSurveyService.getNPSSurvey(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateNPSSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNPSSurveyRequest) => npsSurveyService.createNPSSurvey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NPS_SURVEYS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create NPS survey:", error);
    },
  });
}

export function useUpdateNPSSurvey(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNPSSurveyRequest) => npsSurveyService.updateNPSSurvey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NPS_SURVEYS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...NPS_SURVEYS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update NPS survey ${id}:`, error);
    },
  });
}

export function useDeleteNPSSurvey(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => npsSurveyService.deleteNPSSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NPS_SURVEYS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete NPS survey ${id}:`, error);
    },
  });
}
