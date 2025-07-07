import { ClientePayload } from '@/types/Cliente';

export async function apiEditarCliente(id: number, payload: ClientePayload) {
  const token = sessionStorage.getItem('token');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cliente/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao editar cliente');
  }

  return response.json();
}
