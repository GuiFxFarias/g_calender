'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// ⚠️ Rotas públicas iguais às do seu middleware
const rotasPublicas = [
  '/',
  '/login',
  '/cadastro',
  '/esqueci-senha',
  '/redefinir-senha',
  '/landing',
  '/pagamento',
];

export function BloqueadorDeSistema() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const acesso = JSON.parse(
      sessionStorage.getItem('acessoLiberado') || 'false'
    );

    const rotaEhPublica = rotasPublicas.some((rota) =>
      pathname.startsWith(rota)
    );

    if (!acesso && !rotaEhPublica) {
      console.warn('🔒 Acesso bloqueado! Redirecionando para /pagamento');
      router.push('/pagamento');
    }
  }, [pathname, router]);

  return null;
}
