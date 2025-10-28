import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

export async function apiCriarVisitaComAnexo(payload: VisitaComAnexoPayload) {
  const formData = new FormData();

  formData.append(
    'cliente_id',
    payload.cliente_id ? String(payload.cliente_id) : ''
  );
  formData.append('data_visita', payload.data_visita);
  formData.append('preco', String(payload.preco));
  formData.append('descricao', payload.descricao);
  formData.append('status', payload.status);

  if (payload.anexos && payload.anexos.length > 0) {
    Array.from(payload.anexos).forEach((file) => {
      formData.append('anexo_doc[]', file);
    });
  }

  if (payload.tags && payload.tags.length > 0) {
    formData.append('tags', JSON.stringify(payload.tags));
  }

  const token = sessionStorage.getItem('token');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/criarVisita`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao criar visita');
  }

  const data = await response.json();
  return data.visita_id;
}
