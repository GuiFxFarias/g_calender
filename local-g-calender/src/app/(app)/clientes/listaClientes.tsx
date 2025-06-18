'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getClientes } from './api/apiBuscarClientes';
import { ClientePayload } from '@/types/Cliente';

export default function ListaClientes() {
  const {
    data: clientes,
    isLoading,
    isError,
  } = useQuery<ClientePayload[], Error>({
    queryKey: ['clientes'],
    queryFn: getClientes,
  });

  if (isLoading) {
    return <p className='text-center mt-6'>Carregando clientes...</p>;
  }

  if (isError || !clientes) {
    return (
      <p className='text-center mt-6 text-red-500'>
        Erro ao carregar clientes.
      </p>
    );
  }

  if (clientes.length === 0) {
    return <p className='text-center mt-6'>Nenhum cliente cadastrado.</p>;
  }

  return (
    <div className='flex flex-col space-y-2 h-[60vh] overflow-y-auto'>
      {clientes.map((cliente: ClientePayload) => (
        <Card
          key={cliente.id}
          className='border shadow-sm hover:shadow-md transition'
        >
          <CardContent className='space-y-1'>
            <h3 className='text-lg font-semibold'>{cliente.nome}</h3>
            <p>
              <strong>Telefone:</strong> {cliente.telefone}
            </p>
            {cliente.endereco && (
              <p>
                <strong>Endereço:</strong> {cliente.endereco}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
