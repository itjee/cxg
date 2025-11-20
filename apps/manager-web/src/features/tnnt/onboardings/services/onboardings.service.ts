/**
 * @file onboardings.service.ts
 * @description 온보딩 프로세스 서비스 레이어 (GraphQL)
 *
 * Apollo Client를 사용한 GraphQL 기반 서비스
 * 기존 REST API는 더 이상 사용되지 않습니다.
 *
 * @migration
 * REST API 기반 서비스에서 GraphQL 기반 서비스로 마이그레이션 완료
 * - 모든 HTTP 요청 → GraphQL 쿼리/뮤테이션
 * - axios → Apollo Client
 * - Optimistic Update 지원
 *
 * @example
 * ```typescript
 * // 기존 방식 (REST API) - 더 이상 사용 불가
 * const onboardings = await onboardingsService.listOnboardings({ page: 0, pageSize: 20 });
 *
 * // 새로운 방식 (GraphQL) - hooks 사용
 * const { data: onboardingsResponse } = useOnboardingsGQL({ page: 0, pageSize: 20 });
 * ```
 */

// GraphQL hooks를 통한 간접 호출만 지원합니다.
// 직접 service를 호출하지 마세요. 대신 hooks를 사용하세요.

export {
  useOnboardingsGQL as listOnboardings,
  useOnboardingGQL as getOnboarding,
  useCreateOnboardingGQL as createOnboarding,
  useUpdateOnboardingGQL as updateOnboarding,
  useDeleteOnboardingGQL as deleteOnboarding,
  useRetryOnboardingStepGQL as retryOnboardingStep,
} from "../hooks/use-onboardings-graphql";

// 이전 코드를 참조하려면 git history를 확인하세요:
// git show HEAD:src/features/tnnt/onboardings/services/onboardings.service.ts
