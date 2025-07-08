export async function apiBuscarAnexosCliente(clienteId?: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/anexos-cliente/${clienteId}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }
  );

  if (!res.ok) throw new Error('Erro ao buscar anexos');
  return res.json();
}

export async function apiDeletarAnexo(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anexos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Erro ao deletar anexo');
  return res.json();
}

export async function apiEnviarAnexoCliente({
  clienteId,
  file,
}: {
  clienteId?: number;
  file: File;
}) {
  const formData = new FormData();
  formData.append('cliente_id', String(clienteId));
  formData.append('anexo_doc', file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anexos-cliente`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

  if (!res.ok) {
    const erro = await res.json();
    throw new Error(erro?.erro || 'Erro ao enviar anexo');
  }

  return res.json();
}
