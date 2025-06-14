export async function apiCriarClienteTemporario(
  nome?: string,
  telefone?: string
): Promise<{ id: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clienteSemCadastro`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, telefone }),
    }
  );

  if (!res.ok) {
    throw new Error('Erro ao criar cliente temporário');
  }

  const data = await res.json();
  return { id: data.id };
}
