'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { apiCriarCheckout } from './api/apiCriarCheckout';
import { useUsuario } from '@/hooks/useUsuario';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const planos = [
  {
    id: 'mensal',
    nome: 'Mensal',
    meses: 1,
    valorMensal: 75,
    beneficio: 'Ideal para começar',
    recursos: [
      'Agendamentos ilimitados',
      'WhatsApp integrado',
      'Histórico completo',
      'Exportar relatórios',
    ],
    link: '/pagamento',
  },
  {
    id: 'trimestral',
    nome: 'Trimestral',
    meses: 3,
    valorMensal: 60,
    beneficio: 'Economize R$25 comparado ao mensal',
    recursos: [
      'Agendamentos ilimitados',
      'WhatsApp integrado',
      'Histórico completo',
      'Exportar relatórios',
    ],
    link: '/pagamento',
    destaque: true, // 🔥 PLANO MAIS VENDIDO
  },
  {
    id: 'anual',
    nome: 'Anual',
    meses: 12,
    valorMensal: 50,
    beneficio: 'Economize R$180 no ano!',
    recursos: [
      'Agendamentos ilimitados',
      'WhatsApp integrado',
      'Histórico completo',
      'Exportar relatórios',
    ],
    link: '/pagamento',
  },
];

export default function PagamentoPage() {
  const usuario = useUsuario();
  const router = useRouter();
  const pathname = usePathname();

  async function pagar(plano_id: string) {
    if (!usuario) {
      toast.error('Você precisa estar logado para continuar.');
      setTimeout(() => {
        router.push('/login?assinatura=true');
      }, 500);
      return;
    }

    try {
      const url = await apiCriarCheckout({
        plano_id,
        usuario_id: usuario.id,
        tenant_id: usuario.tenant_id,
      });
      window.location.href = url;
    } catch {
      toast.error('Erro ao iniciar pagamento. Tente novamente mais tarde.');
    }
  }

  return (
    <div className='max-w-6xl mx-auto py-10 px-4'>
      <div className='flex flex-col items-center justify-center'>
        {pathname == '/pagamento' ? (
          <Link
            href='/'
            className='hover:underline text-blue-600 dark:text-blue-400 inline w-full'
          >
            <p className='flex text-sm'>
              <ArrowLeft className='mr-2' />
              Voltar
            </p>
          </Link>
        ) : null}
        <h1 className='text-3xl font-bold text-center mb-3 '>
          Escolha o plano ideal para você
        </h1>
      </div>
      <p className='text-center text-muted-foreground mb-10'>
        Todos os planos incluem acesso ao sistema completo, suporte técnico e
        atualizações.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {planos.map((plano) => (
          <Card
            key={plano.id}
            className={cn(
              'shadow-md border flex flex-col justify-between transition-transform hover:scale-[1.02]',
              plano.destaque && 'border-blue-600 bg-blue-50'
            )}
          >
            <CardHeader className='text-center relative'>
              <CardTitle className='text-2xl font-bold'>{plano.nome}</CardTitle>
              {plano.destaque && (
                <Badge className='absolute top-2 right-2 bg-blue-600 text-white'>
                  Mais vendido
                </Badge>
              )}
            </CardHeader>

            <CardContent className='text-center flex flex-col flex-grow justify-between'>
              <div>
                <p className='text-4xl font-bold text-blue-600'>
                  R$ {plano.valorMensal}
                  <span className='text-base text-muted-foreground'>
                    {' '}
                    / mês
                  </span>
                </p>
                {plano.meses > 0 && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    Total: R$ {plano.valorMensal * plano.meses}
                  </p>
                )}
                <p className='text-sm text-gray-700 italic mt-2'>
                  {plano.beneficio}
                </p>

                <ul className='mt-4 mb-6 space-y-2 text-sm text-left'>
                  {plano.recursos.map((r) => (
                    <li key={r}>✔ {r}</li>
                  ))}
                </ul>
              </div>

              {plano.link === '/pagamento' ? (
                <Button
                  onClick={() => pagar(plano.id)}
                  className={cn(
                    plano.destaque && 'w-full bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  Assinar
                </Button>
              ) : (
                <Link
                  href={plano.link}
                  className='block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
                >
                  Assinar
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
