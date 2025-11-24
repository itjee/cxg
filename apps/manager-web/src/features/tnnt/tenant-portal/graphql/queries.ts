/**
 * @file queries.ts
 * @description Tenant Portal GraphQL queries
 */

import { gql } from "@apollo/client";

/**
 * Get tenant basic info
 * @query tenant - Single tenant with all details
 */
export const GET_TENANT_BASIC = gql`
  query GetTenantBasic($id: ID!) {
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

/**
 * Get all tenants for dropdown selector
 * @query tenants - List of all tenants (minimal fields for dropdown)
 */
export const GET_TENANTS_FOR_SELECTOR = gql`
  query GetTenantsForSelector(
    $limit: Int = 100
    $offset: Int = 0
    $search: String
    $status: String
  ) {
    tenants(
      limit: $limit
      offset: $offset
      search: $search
      status: $status
    ) {
      id
      code
      name
      bizNo
      bizName
      status
    }
  }
`;

/**
 * Get tenant users (connected users)
 *
 * Query user relationships for a specific tenant
 * This would need to be implemented in backend if not exists
 */
export const GET_TENANT_USERS = gql`
  query GetTenantUsers(
    $tenantId: ID!
    $limit: Int = 50
    $offset: Int = 0
    $status: String
  ) {
    tenantUsers(
      tenantId: $tenantId
      limit: $limit
      offset: $offset
      status: $status
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
      user {
        id
        fullName
        email
        phone
        username
        status
        lastLoginAt
      }
    }
  }
`;

/**
 * Get tenant roles (roles used in tenant)
 *
 * Query roles related to a specific tenant
 */
export const GET_TENANT_ROLES = gql`
  query GetTenantRoles(
    $tenantId: ID!
    $limit: Int = 50
    $offset: Int = 0
  ) {
    tenantRoles(
      tenantId: $tenantId
      limit: $limit
      offset: $offset
    ) {
      id
      code
      name
      description
      category
      level
      scope
      status
      isSystem
      permissionCount
    }
  }
`;

/**
 * Get tenant onboarding status
 *
 * Query onboarding process steps for a tenant
 */
export const GET_TENANT_ONBOARDING = gql`
  query GetTenantOnboarding($tenantId: ID!) {
    tenantOnboarding(tenantId: $tenantId) {
      id
      tenantId
      stepName
      stepOrder
      stepStatus
      startedAt
      completedAt
      retryCount
      errorMessage
      stepData
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get tenant subscriptions
 *
 * Query subscription details for a tenant
 */
export const GET_TENANT_SUBSCRIPTIONS = gql`
  query GetTenantSubscriptions(
    $tenantId: ID!
    $limit: Int = 50
    $offset: Int = 0
  ) {
    tenantSubscriptions(
      tenantId: $tenantId
      limit: $limit
      offset: $offset
    ) {
      id
      tenantId
      planId
      plan {
        id
        code
        name
        type
        basePrice
        maxUsers
        maxStorage
        maxApiCalls
      }
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
      isDeleted
    }
  }
`;

/**
 * Get tenant invoices and billing history
 *
 * Query invoices and transactions for a tenant
 */
export const GET_TENANT_INVOICES = gql`
  query GetTenantInvoices(
    $tenantId: ID!
    $limit: Int = 50
    $offset: Int = 0
    $status: String
    $startDate: String
    $endDate: String
  ) {
    tenantInvoices(
      tenantId: $tenantId
      limit: $limit
      offset: $offset
      status: $status
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      invoiceNo
      tenantId
      subscriptionId
      invoiceDate
      dueDate
      startDate
      closeDate
      baseAmount
      usageAmount
      discountAmount
      taxAmount
      totalAmount
      currency
      userCount
      usedStorage
      apiCalls
      status
      paidAt
      paymentMethod
    }
  }
`;

/**
 * Get tenant transactions
 *
 * Query payment transactions for a tenant
 */
export const GET_TENANT_TRANSACTIONS = gql`
  query GetTenantTransactions(
    $tenantId: ID!
    $limit: Int = 50
    $offset: Int = 0
    $status: String
  ) {
    tenantTransactions(
      tenantId: $tenantId
      limit: $limit
      offset: $offset
      status: $status
    ) {
      id
      transactionNo
      tenantId
      invoiceId
      amount
      currency
      transactionType
      paymentGateway
      paymentGatewayId
      paymentMethod
      cardDigits
      processedAt
      failedAt
      failureReason
      status
    }
  }
`;

/**
 * Get tenant revenue/sales data
 *
 * Query revenue and sales metrics for a tenant
 * (May vary based on backend implementation)
 */
export const GET_TENANT_REVENUE = gql`
  query GetTenantRevenue(
    $tenantId: ID!
    $startDate: String
    $endDate: String
  ) {
    tenantRevenue(
      tenantId: $tenantId
      startDate: $startDate
      endDate: $endDate
    ) {
      totalRevenue
      totalPaid
      totalPending
      totalOverdue
      currency
      invoiceCount
      paidInvoiceCount
      overdueInvoiceCount
      averageInvoiceAmount
      lastInvoiceDate
    }
  }
`;
