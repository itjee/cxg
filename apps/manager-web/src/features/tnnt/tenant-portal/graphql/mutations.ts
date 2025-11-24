/**
 * @file mutations.ts
 * @description Tenant Portal GraphQL mutations
 */

import { gql } from "@apollo/client";

/**
 * Update tenant basic information
 */
export const UPDATE_TENANT_INFO = gql`
  mutation UpdateTenantInfo($id: ID!, $input: UpdateTenantInput!) {
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
      }
    }
  }
`;

/**
 * Add user to tenant
 */
export const ADD_TENANT_USER = gql`
  mutation AddTenantUser(
    $tenantId: ID!
    $userId: ID!
    $input: AddTenantUserInput!
  ) {
    tenantUsers {
      addUser(
        tenantId: $tenantId
        userId: $userId
        input: $input
      ) {
        id
        userId
        tenantId
        role
        department
        position
        status
        isPrimary
        isAdmin
        startDate
        closeDate
      }
    }
  }
`;

/**
 * Update tenant user
 */
export const UPDATE_TENANT_USER = gql`
  mutation UpdateTenantUser(
    $id: ID!
    $input: UpdateTenantUserInput!
  ) {
    tenantUsers {
      updateUser(id: $id, input: $input) {
        id
        userId
        tenantId
        role
        department
        position
        status
        isPrimary
        isAdmin
        startDate
        closeDate
      }
    }
  }
`;

/**
 * Remove user from tenant
 */
export const REMOVE_TENANT_USER = gql`
  mutation RemoveTenantUser($id: ID!) {
    tenantUsers {
      removeUser(id: $id) {
        success
        message
      }
    }
  }
`;

/**
 * Update tenant subscription
 */
export const UPDATE_TENANT_SUBSCRIPTION = gql`
  mutation UpdateTenantSubscription(
    $id: ID!
    $input: UpdateSubscriptionInput!
  ) {
    tenantSubscriptions {
      updateSubscription(id: $id, input: $input) {
        id
        tenantId
        planId
        startDate
        closeDate
        billingCycle
        maxUsers
        maxStorage
        maxApiCalls
        baseAmount
        userAmount
        currency
        autoRenewal
        notiRenewal
        status
      }
    }
  }
`;

/**
 * Update invoice status (mark as paid, etc.)
 */
export const UPDATE_INVOICE_STATUS = gql`
  mutation UpdateInvoiceStatus(
    $id: ID!
    $status: String!
  ) {
    invoices {
      updateStatus(id: $id, status: $status) {
        id
        invoiceNo
        status
        paidAt
      }
    }
  }
`;

/**
 * Update onboarding step status
 */
export const UPDATE_ONBOARDING_STEP = gql`
  mutation UpdateOnboardingStep(
    $id: ID!
    $input: UpdateOnboardingStepInput!
  ) {
    onboardings {
      updateStep(id: $id, input: $input) {
        id
        stepName
        stepOrder
        stepStatus
        startedAt
        completedAt
        retryCount
        errorMessage
        stepData
      }
    }
  }
`;
