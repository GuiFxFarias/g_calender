'use client';

import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { VerificaAcesso } from '@/components/verificaAcesso';

const queryClient = new QueryClient();
export default function Query({ children }: { children: React.ReactNode }) {
  function VerificaTenant() {
    useEffect(() => {
      const token = sessionStorage.getItem('token');
      const sessionTenant = sessionStorage.getItem('tenant_id');

      if (!token || !sessionTenant) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        const tokenTenant = decoded.tenant_id;

        if (tokenTenant !== sessionTenant) {
          sessionStorage.clear();
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }, []);

    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <VerificaAcesso />
      <VerificaTenant />
      {children}
    </QueryClientProvider>
  );
}
