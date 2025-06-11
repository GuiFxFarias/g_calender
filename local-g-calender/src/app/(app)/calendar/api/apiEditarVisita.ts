import { EditarVisitaPayload } from '@/types/EditarVisitaPayload';

export async function apiEditarVisita(payload: EditarVisitaPayload) {
  const formData = new FormData();

  formData.append('preco', String(payload.preco));
  formData.append('status', payload.status);

  if (payload.novosArquivos && payload.novosArquivos.length > 0) {
    for (let i = 0; i < payload.novosArquivos.length; i++) {
      formData.append('anexo_doc', payload.novosArquivos[i]);
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/visita/${payload.id}`,
    {
      method: 'PUT',
      body: formData,
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao editar visita');
  }

  return response.json();
}
