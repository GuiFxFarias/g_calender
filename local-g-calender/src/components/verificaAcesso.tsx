'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function VerificaAcesso() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const acessoLocal = sessionStorage.getItem('acessoLiberado');

    if (!token) return;

    // Confia no valor do sessionStorage se já existir
    if (acessoLocal === 'false' && pathname !== '/pagamento') {
      router.push('/pagamento');
      return;
    }

    // Só consulta a API se não tiver cache local
    if (acessoLocal === null) {
      async function verificar() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acesso`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          sessionStorage.setItem(
            'acessoLiberado',
            JSON.stringify(data.acessoLiberado)
          );

          if (!data.acessoLiberado && pathname !== '/pagamento') {
            router.push('/pagamento');
          }
        } catch (err) {
          console.error('❌ Erro ao verificar acesso:', err);
          sessionStorage.setItem('acessoLiberado', 'false');
          router.push('/pagamento');
        }
      }

      verificar();
    }
  }, [pathname, router]);

  return null;
}
