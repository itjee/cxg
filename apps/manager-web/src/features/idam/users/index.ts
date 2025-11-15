/**
 * Users Feature - Public API
 *
 * Feature 외부에서 사용할 수 있는 공개 인터페이스입니다.
 * 다른 features에서는 이 index.ts를 통해서만 users feature에 접근합니다.
 *
 * @example
 * // Component
 * import { UsersTable } from '@/features/idam/users';
 *
 * // Hook
 * import { useUsers, useCreateUser } from '@/features/idam/users';
 *
 * // Type
 * import type { User } from '@/features/idam/users';
 *
 * // Store
 * import { useUsersStore } from '@/features/idam/users';
 */

// ===== Components =====
export * from "./components";

// ===== GraphQL (Hooks & Queries) =====
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
} from "./hooks";
export type {
  GetUsersVariables,
  GetUserVariables,
  CreateUserVariables,
  UpdateUserVariables,
} from "./graphql";

// ===== Types =====
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UsersQueryParams,
  // Deprecated types (compatibility)
  Users,
  UsersListResponse,
  UsersQueryParams,
} from "./types/users.types";

// ===== Store =====
export { useUsersStore } from "./stores/users.store";
