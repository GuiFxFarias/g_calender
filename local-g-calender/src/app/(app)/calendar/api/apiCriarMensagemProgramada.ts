// api/apiCriarMensagemProgramada.ts
export async function apiCriarMensagemProgramada(dados: {
  cliente_id?: number;
  texto: string;
  dias_intervalo: number;
  proxima_data_envio: string;
  ativo: boolean;
  telefone: string;
}) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mensagens-programadas`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    }
  );

  if (!res.ok) throw new Error('Erro ao criar mensagem programada');
}
