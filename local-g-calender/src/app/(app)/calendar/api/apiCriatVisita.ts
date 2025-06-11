import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

export async function apiCriarVisitaComAnexo(payload: VisitaComAnexoPayload) {
  const formData = new FormData();

  formData.append('cliente_id', String(payload.cliente_id));
  formData.append('data_visita', payload.data_visita);
  formData.append('preco', String(payload.preco));
  formData.append('descricao', payload.descricao);
  formData.append('status', payload.status);

  if (payload.anexos && payload.anexos.length > 0) {
    for (let i = 0; i < payload.anexos.length; i++) {
      formData.append('anexo_doc', payload.anexos[i]);
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/criarVisita`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao criar visita');
  }

  return response.json();
}
