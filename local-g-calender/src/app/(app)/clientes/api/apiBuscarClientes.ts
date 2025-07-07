import { ClientePayload } from '@/types/Cliente';

export async function getClientes(): Promise<ClientePayload[]> {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao buscar clientes');
  }

  return response.json();
}
