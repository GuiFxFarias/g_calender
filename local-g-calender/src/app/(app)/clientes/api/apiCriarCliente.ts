import { ClientePayload } from '@/types/Cliente';

export async function apiCriarCliente(payload: ClientePayload) {
  const formData = new FormData();

  formData.append('nome', payload.nome);
  formData.append('telefone', payload.telefone);
  formData.append('endereco', payload.endereco || '');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/criarCliente`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao criar cliente');
  }

  return response.json();
}
