/**
 * Code Help GraphQL Queries
 *
 * 코드 헬프 관련 GraphQL 쿼리
 */

import { gql } from "@apollo/client";

export const CODE_HELP_SEARCH_QUERY = gql`
  query CodeHelpSearch(
    $searchType: CodeHelpType!
    $searchQuery: String
    $limit: Int
    $offset: Int
    $filters: JSON
  ) {
    codeHelp(
      searchType: $searchType
      searchQuery: $searchQuery
      limit: $limit
      offset: $offset
      filters: $filters
    ) {
      totalCount
      items {
        id
        code
        name
        description
        metadata
        status
        createdAt
        updatedAt
      }
      hasMore
    }
  }
`;

/**
 * GraphQL 쿼리 변수 타입
 */
export interface CodeHelpSearchVariables {
  searchType: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}
