export async function apiCriarCheckout({
  plano_id,
  usuario_id,
  tenant_id,
}: {
  plano_id: string;
  usuario_id: number;
  tenant_id: string;
}): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pagamento`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plano_id, usuario_id, tenant_id }),
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    console.error('❌ Erro no checkout:', erro);
    throw new Error('Erro ao iniciar pagamento');
  }

  const { url } = await res.json();
  return url;
}
