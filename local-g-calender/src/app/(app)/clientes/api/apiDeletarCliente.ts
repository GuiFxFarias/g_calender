export async function apiDeletarCliente(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cliente/${id}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao deletar cliente');
  }

  return response.json();
}
