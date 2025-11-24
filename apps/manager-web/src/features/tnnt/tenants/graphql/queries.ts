/**
 * @file queries.ts
 * @description 테넌트 관리 GraphQL 쿼리
 *
 * Manager GraphQL 백엔드와 통신하기 위한 쿼리 정의
 */

import { gql } from "@apollo/client";

/**
 * 테넌트 목록 조회 쿼리
 *
 * @query tenants
 * @param limit - 조회할 테넌트 수
 * @param offset - 시작 위치 (페이지네이션)
 * @param search - 검색어 (선택)
 * @param status - 상태 필터 (선택)
 * @param type - 유형 필터 (선택)
 * @param is_suspended - 일시중단 필터 (선택)
 * @returns 테넌트 목록 배열
 */
export const GET_TENANTS = gql`
  query GetTenants(
    $limit: Int!
    $offset: Int!
    $search: String
    $status: String
    $type: String
    $isSuspended: Boolean
  ) {
    tenants(
      limit: $limit
      offset: $offset
      search: $search
      status: $status
      type: $type
      isSuspended: $isSuspended
    ) {
      id
      code
      name
      type
      bizNo
      bizName
      bizType
      ceoName
      phoneNo
      employeeCount
      address1
      address2
      postcode
      status
      isSuspended
      suspendedReason
      startDate
      closeDate
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;

/**
 * 테넌트 상세 조회 쿼리
 *
 * @query tenant
 * @param id - 테넌트 ID (UUID)
 * @returns 테넌트 상세 정보
 */
export const GET_TENANT = gql`
  query GetTenant($id: ID!) {
    tenant(id: $id) {
      id
      code
      name
      type
      bizNo
      bizName
      bizType
      ceoName
      phoneNo
      employeeCount
      address1
      address2
      postcode
      status
      isSuspended
      suspendedReason
      startDate
      closeDate
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;
