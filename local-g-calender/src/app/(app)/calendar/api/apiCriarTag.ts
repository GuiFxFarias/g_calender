export async function apiCriarTag(nome: string): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify({ nome }),
  });

  if (!res.ok) throw new Error('Erro ao criar tag');

  const data = await res.json();
  return data.id; // <- backend deve enviar isso
}
