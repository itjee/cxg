/**
 * @file apollo-provider.tsx
 * @description Apollo Client Provider for Next.js
 */

'use client';

import { ApolloProvider as ApolloClientProvider } from '@apollo/client';
import { apolloClient } from './apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

/**
 * Apollo Provider 컴포넌트
 * 
 * 전체 앱에서 Apollo Client를 사용할 수 있도록 합니다.
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
}
