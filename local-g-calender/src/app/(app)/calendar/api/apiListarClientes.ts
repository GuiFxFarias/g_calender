export type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
};

export async function apiListarClientes(): Promise<Cliente[]> {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar clientes');
  }

  return response.json();
}
