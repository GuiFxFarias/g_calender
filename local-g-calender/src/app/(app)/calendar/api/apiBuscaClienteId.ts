export async function apiBuscarClientePorId(id?: number) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cliente/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.erro || 'Erro ao buscar cliente');
  }

  return res.json();
}
