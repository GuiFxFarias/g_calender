import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

export async function apiBuscarTodasVisitas(): Promise<
  VisitaComAnexoPayload[]
> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todasVisitas`);

  if (!res.ok) throw new Error('Erro ao buscar visitas');

  return res.json();
}
