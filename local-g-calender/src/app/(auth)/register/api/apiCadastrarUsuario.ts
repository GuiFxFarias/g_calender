interface CadastrarPayload {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  inicio_teste_gratis: string;
}

export async function apiCadastrarUsuario(payload: CadastrarPayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cadastra`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro?.erro || 'Erro ao cadastrar');
  }

  return response.json();
}
