interface RedefinirSenhaPayload {
  token: string | null;
  novaSenha: string;
}

export async function apiRedefinirSenha(payload: RedefinirSenhaPayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/redefinir-senha`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao redefinir senha');
  }

  return response.json();
}
