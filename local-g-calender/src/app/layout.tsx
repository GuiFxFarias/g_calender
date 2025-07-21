// app/layout.tsx (sem 'use client')
import './globals.css';
import { ReactNode } from 'react';
import Query from './layoutCliente';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'GCalendar - Sistema de Agendamento',
  description: 'Agendamento fácil para clínicas, consultórios e prestadores',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-br'>
      <head>
        {/* Google Ads Tag */}
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=AW-17381179530'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17381179530');
            `,
          }}
        />
      </head>
      <Analytics />
      <Query>{children}</Query>
    </html>
  );
}
