/**
 * @file mutations.ts
 * @description 테넌트 관리 GraphQL 뮤테이션
 *
 * Manager GraphQL 백엔드와 통신하기 위한 뮤테이션 정의
 */

import { gql } from "@apollo/client";

/**
 * 테넌트 생성 뮤테이션
 *
 * @mutation createTenant
 * @param input - 테넌트 생성 입력 데이터
 * @returns 생성된 테넌트 정보
 */
export const CREATE_TENANT = gql`
  mutation CreateTenant($input: ManagerTenantCreateInput!) {
    tenants {
      createTenant(input: $input) {
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
  }
`;

/**
 * 테넌트 수정 뮤테이션
 *
 * @mutation updateTenant
 * @param id - 테넌트 ID (UUID)
 * @param input - 테넌트 수정 입력 데이터
 * @returns 수정된 테넌트 정보
 */
export const UPDATE_TENANT = gql`
  mutation UpdateTenant($id: ID!, $input: ManagerTenantUpdateInput!) {
    tenants {
      updateTenant(id: $id, input: $input) {
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
  }
`;

/**
 * 테넌트 삭제 뮤테이션
 *
 * @mutation deleteTenant
 * @param id - 테넌트 ID (UUID)
 * @returns 삭제 결과
 */
export const DELETE_TENANT = gql`
  mutation DeleteTenant($id: ID!) {
    tenants {
      deleteTenant(id: $id) {
        success
        message
      }
    }
  }
`;
