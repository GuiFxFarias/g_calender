import { ClientePayload } from '@/types/Cliente';

export async function apiCriarCliente(payload: ClientePayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/criarCliente`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao criar cliente');
  }

  return response.json();
}
