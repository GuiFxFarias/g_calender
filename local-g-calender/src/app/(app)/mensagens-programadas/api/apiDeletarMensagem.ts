export async function apiDeletarMensagem(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mensagens-programadas/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  );
  if (!res.ok) throw new Error('Erro ao deletar mensagem');
}
