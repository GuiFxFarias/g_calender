'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getClientes } from './api/apiBuscarClientes';
import { ClientePayload } from '@/types/Cliente';
import { Trash } from 'lucide-react';
import { apiDeletarCliente } from './api/apiDeletarCliente';
import toast from 'react-hot-toast';
import { EditarClienteDialog } from './editarClienteForm';

export default function ListaClientes() {
  const {
    data: clientes,
    isLoading,
    isError,
  } = useQuery<ClientePayload[], Error>({
    queryKey: ['clientes'],
    queryFn: getClientes,
  });

  const queryClient = useQueryClient();

  const { mutate: deletarCliente } = useMutation({
    mutationFn: (id: number) => apiDeletarCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente deletado com sucesso');
    },
    onError: (error) => {
      const msg = error?.message || 'Erro ao deletar cliente.';
      toast.error(msg);
    },
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
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>{cliente.nome}</h3>
              <span className='flex items-center space-x-2'>
                <Trash
                  className='size-7 cursor-pointer hover:bg-zinc-200 p-1 rounded-md transition-all'
                  onClick={() => deletarCliente(Number(cliente.id))}
                />
                <EditarClienteDialog clienteId={Number(cliente.id)} />
              </span>
            </div>
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
