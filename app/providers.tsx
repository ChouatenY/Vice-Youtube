'use client';

import { ReactNode } from 'react';
import { LocalUserProvider } from '@/lib/local-user-context';

export function Providers({ children }: { children: ReactNode }) {
  return <LocalUserProvider>{children}</LocalUserProvider>;
}