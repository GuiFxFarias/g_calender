import { Tag } from '@/types/Tag';

export async function apiBuscarTagsDaVisita(
  visita_id?: number
): Promise<Tag[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tags/visita/${visita_id}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  );

  if (!res.ok) throw new Error('Erro ao buscar tags da visita');

  return res.json();
}
