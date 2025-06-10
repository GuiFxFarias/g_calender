'use client';

import LoginPage from './(auth)/login/page';
import './globals.css';
import { ReactQueryClientProvider } from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout() {
  return (
    <html lang='pt-BR'>
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <LoginPage />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
