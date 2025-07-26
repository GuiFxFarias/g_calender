'use client';

import { ReactNode } from 'react';
import ComponenteLayout from './componentLayout';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <ComponenteLayout>{children}</ComponenteLayout>;
}
