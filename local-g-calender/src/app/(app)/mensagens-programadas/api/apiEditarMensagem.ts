import { MensagemProgramada } from '@/types/MensagemProgramada';

export async function apiEditarMensagemProgramada(
  id: number,
  dados: Partial<MensagemProgramada>
): Promise<{ mensagem: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mensagens-programadas/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(dados),
    }
  );

  if (!res.ok) throw new Error('Erro ao editar a mensagem programada');
  return res.json();
}
