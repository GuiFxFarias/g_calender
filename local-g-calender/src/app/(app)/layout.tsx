'use client';

import { ReactNode } from 'react';
import ComponenteLayout from './componentLayout';
// import ChatbotIA from '@/components/chatBot';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ComponenteLayout>
      {/* <ChatbotIA /> */}
      {children}
    </ComponenteLayout>
  );
}
