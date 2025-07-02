export async function apiDeletarCliente(id: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cliente/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao deletar cliente');
  }

  return response.json();
}
