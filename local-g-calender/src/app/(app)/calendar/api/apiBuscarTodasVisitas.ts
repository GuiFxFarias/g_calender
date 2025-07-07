import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

export async function apiBuscarTodasVisitas(): Promise<
  VisitaComAnexoPayload[]
> {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todasVisitas`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erro ao buscar visitas');

  return res.json();
}
