/**
 * @file queries.ts
 * @description 워크플로우 관리 GraphQL 쿼리 및 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 워크플로우 목록 조회 쿼리
 *
 * @query workflows
 * @param limit - 조회할 워크플로우 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param active - 활성 여부 필터 (선택)
 * @param search - 검색어 (선택)
 * @returns 워크플로우 목록 배열
 */
export const GET_WORKFLOWS = gql`
  query GetWorkflows(
    $limit: Int!
    $offset: Int!
    $active: Boolean
    $search: String
  ) {
    workflows(
      limit: $limit
      offset: $offset
      active: $active
      search: $search
    ) {
      id
      created_at
      updated_at
      created_by
      updated_by
      name
      description
      is_active
      is_deleted
    }
  }
`;

/**
 * 워크플로우 상세 조회 쿼리
 *
 * @query workflow
 * @param id - 워크플로우 ID (UUID)
 * @returns 워크플로우 상세 정보
 */
export const GET_WORKFLOW = gql`
  query GetWorkflow($id: ID!) {
    workflow(id: $id) {
      id
      created_at
      updated_at
      created_by
      updated_by
      name
      description
      is_active
      is_deleted
    }
  }
`;

/**
 * 워크플로우 생성 뮤테이션
 *
 * @mutation createWorkflow
 * @param input - 워크플로우 생성 입력 데이터
 * @returns 생성된 워크플로우 정보
 */
export const CREATE_WORKFLOW = gql`
  mutation CreateWorkflow($input: ManagerWorkflowCreateInput!) {
    createWorkflow(input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      name
      description
      is_active
      is_deleted
    }
  }
`;

/**
 * 워크플로우 수정 뮤테이션
 *
 * @mutation updateWorkflow
 * @param id - 워크플로우 ID (UUID)
 * @param input - 워크플로우 수정 입력 데이터
 * @returns 수정된 워크플로우 정보
 */
export const UPDATE_WORKFLOW = gql`
  mutation UpdateWorkflow($id: ID!, $input: ManagerWorkflowUpdateInput!) {
    updateWorkflow(id: $id, input: $input) {
      id
      created_at
      updated_at
      created_by
      updated_by
      name
      description
      is_active
      is_deleted
    }
  }
`;

/**
 * 워크플로우 삭제 뮤테이션
 *
 * @mutation deleteWorkflow
 * @param id - 워크플로우 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_WORKFLOW = gql`
  mutation DeleteWorkflow($id: ID!) {
    deleteWorkflow(id: $id) {
      success
      message
    }
  }
`;
