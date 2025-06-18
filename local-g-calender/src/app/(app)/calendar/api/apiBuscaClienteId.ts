// ./api/apiBuscarClientePorId.ts
export async function apiBuscarClientePorId(id?: number) {
  const res = await fetch(`http://localhost:3001/cliente/${id}`);

  if (!res.ok) {
    throw new Error('Erro ao buscar cliente');
  }

  return res.json();
}
