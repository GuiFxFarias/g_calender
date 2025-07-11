import { MensagemProgramada } from '@/types/MensagemProgramada';

export async function apiBuscarMensagens(): Promise<MensagemProgramada[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mensagens-programadas`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  );
  if (!res.ok) throw new Error('Erro ao buscar mensagens programadas');
  return res.json();
}
