/**
 * @file index.ts
 * @description Users GraphQL Exports
 *
 * Users feature의 모든 GraphQL 정의 및 타입을 export합니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: UsersQueryVariables (복수)
 * - 단일 조회: UserQueryVariables (단수)
 * - 생성/수정: CreateUserVariables, UpdateUserVariables (단수)
 */

export {
  GET_USERS,
  GET_USER,
  type UsersQueryVariables,
  type UserQueryVariables,
} from "./queries";

export {
  CREATE_USER,
  UPDATE_USER,
  type CreateUserVariables,
  type UpdateUserVariables,
} from "./mutations";
