import { Anexo } from '@/types/Anexo'; // interface abaixo

export async function getAnexosPorVisitaId(
  visita_id?: number
): Promise<Anexo[]> {
  const token = sessionStorage.getItem('token');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/anexos/${visita_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao buscar anexos');
  }

  return response.json();
}
