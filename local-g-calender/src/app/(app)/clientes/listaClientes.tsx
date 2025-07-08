'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getClientes } from './api/apiBuscarClientes';
import { ClientePayload } from '@/types/Cliente';
import { Trash } from 'lucide-react';
import { apiDeletarCliente } from './api/apiDeletarCliente';
import toast from 'react-hot-toast';
import { EditarClienteDialog } from './editarClienteForm';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ListaAnexosCliente } from './listaAnexosCliente';
import { UploadAnexoCliente } from './uploadAnexoCliente';

export default function ListaClientes() {
  const [filtro, setFiltro] = useState('');

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

  const clientesFiltrados = clientes?.filter((cliente) =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase())
  );

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

  return (
    <div className='flex flex-col space-y-4 h-[60vh]'>
      <Input
        type='text'
        placeholder='Buscar por nome...'
        className='w-full'
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className='flex flex-col space-y-3 overflow-y-auto'>
        {clientesFiltrados && clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente: ClientePayload) => (
            <Card
              key={cliente.id}
              className='border shadow-sm hover:shadow-md transition text-sm py-2'
            >
              <CardContent>
                <div className='flex items-center justify-between '>
                  <h3 className='font-semibold text-base'>{cliente.nome}</h3>
                  <span className='flex items-center space-x-2'>
                    <Trash
                      className='size-6 cursor-pointer hover:bg-zinc-200 rounded-md transition-all'
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

                <Accordion type='single' collapsible>
                  <AccordionItem value={`anexos-${cliente.id}`}>
                    <AccordionTrigger className='text-sm text-zinc-700 py-1 cursor-pointer hover:bg-zinc-100'>
                      Ver anexos do cliente
                    </AccordionTrigger>
                    <AccordionContent>
                      <ListaAnexosCliente clienteId={cliente.id} />
                      <UploadAnexoCliente clienteId={cliente.id} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-center text-sm text-zinc-500'>
            Nenhum cliente encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
