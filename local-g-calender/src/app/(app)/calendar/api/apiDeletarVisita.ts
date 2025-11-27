export async function apiDeletarVisita(visitaId: number, scope?: 'all') {
  const token = sessionStorage.getItem('token');

  console.log('Deletando visita:', visitaId, 'Escopo:', scope);

  const url = scope
    ? `${process.env.NEXT_PUBLIC_API_URL}/visita/${visitaId}?scope=${scope}`
    : `${process.env.NEXT_PUBLIC_API_URL}/visita/${visitaId}`;

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
