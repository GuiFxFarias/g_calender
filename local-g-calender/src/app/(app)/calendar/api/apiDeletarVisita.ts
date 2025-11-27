export async function apiDeletarVisita(
  visitaId: number,
  scope?: 'single' | 'all',
  dataInstancia?: string
) {
  const token = sessionStorage.getItem('token');

  let url = `${process.env.NEXT_PUBLIC_API_URL}/visita/${visitaId}`;

  const params = new URLSearchParams();
  if (scope) params.append('scope', scope);
  if (dataInstancia) params.append('data_instancia', dataInstancia);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao deletar visita');
  }

  return response.json();
}
