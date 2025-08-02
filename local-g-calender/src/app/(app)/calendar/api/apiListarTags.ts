import { Tag } from '@/types/Tag';

export async function apiListarTags(): Promise<Tag[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

  if (!res.ok) throw new Error('Erro ao buscar tags');

  return res.json();
}
