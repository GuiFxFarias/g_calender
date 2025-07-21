// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import Query from './layoutCliente'; // client-side component

export const metadata = {
  title: 'GCalendar - Sistema de Agendamento',
  description: 'Agendamento fácil para clínicas, consultórios e prestadores',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-br'>
      <head></head>
      <body>
        <Query>
          <Analytics />
          {children}
        </Query>
      </body>
    </html>
  );
}
