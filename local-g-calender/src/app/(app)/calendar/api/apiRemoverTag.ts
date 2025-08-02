export async function apiRemoverTag(visita_id?: number, tag_id?: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/remover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify({ visita_id, tag_id }),
  });

  if (!res.ok) throw new Error('Erro ao remover tag da visita');
}
