// api/apiCriarMensagemProgramada.ts
export async function apiCriarMensagemProgramada(dados: {
  cliente_id?: number;
  texto: string;
  dias_intervalo: number;
  proxima_data_envio: string;
  ativo: boolean;
  telefone: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mensagens-programadas`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    }
  );

  if (!res.ok) throw new Error('Erro ao criar mensagem programada');
}
