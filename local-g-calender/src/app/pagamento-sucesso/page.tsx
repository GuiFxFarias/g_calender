'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PagamentoSucesso() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/pagamento');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className='flex flex-col items-center justify-center h-[80vh] text-center px-4'>
      <h1 className='text-2xl font-bold text-green-600'>
        ✅ Pagamento aprovado!
      </h1>
      <p className='mt-2 text-zinc-600'>
        Obrigado por sua assinatura. Você será redirecionado para a tela
        principal...
      </p>
    </div>
  );
}
