interface EsqueciSenhaPayload {
  email: string;
}

export async function apiEsqueciSenha(payload: EsqueciSenhaPayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/esqueci-senha`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao enviar e-mail');
  }

  return response.json();
}
