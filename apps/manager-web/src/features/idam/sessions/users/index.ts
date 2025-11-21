/**
 * Sessions Feature - Public API
 *
 * Feature 외부에서 사용할 수 있는 공개 인터페이스입니다.
 * 다른 features에서는 이 index.ts를 통해서만 sessions feature에 접근합니다.
 *
 * @example
 * // Component
 * import { SessionsTable } from '@/features/idam/sessions';
 *
 * // Hook
 * import { useSessions, useCreateSession } from '@/features/idam/sessions';
 *
 * // Type
 * import type { Session } from '@/features/idam/sessions';
 *
 * // Store
 * import { useSessionsStore } from '@/features/idam/sessions';
 */

// ===== Components =====
export * from "./components";

// ===== GraphQL (Hooks & Queries) =====
export { useSessions, useSession, useCreateSession, useUpdateSession } from "./hooks";
export type { GET_SESSIONS, GET_SESSION, CREATE_SESSION, UPDATE_SESSION } from "./graphql";

// ===== Types =====
export type {
  Session,
  GetSessionsResponse,
  GetSessionResponse,
  CreateSessionResponse,
  UpdateSessionResponse,
  SessionQueryVariables,
  SessionsQueryVariables,
  CreateSessionVariables,
  UpdateSessionVariables,
  CreateSessionInput,
  UpdateSessionInput,
  SessionsFilterState,
} from "./types/sessions.types";

// ===== Store =====
export { useSessionsStore } from "./stores/sessions.store";
