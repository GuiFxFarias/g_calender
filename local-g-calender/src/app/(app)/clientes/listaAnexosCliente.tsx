'use client';

import { ClienteAnexo } from '@/types/ClienteAnexo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Download, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiBuscarAnexosCliente, apiDeletarAnexo } from './api/apiAnexoCliente';

interface ListaAnexosClienteProps {
  clienteId?: number;
}

export function ListaAnexosCliente({ clienteId }: ListaAnexosClienteProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ClienteAnexo[]>({
    queryKey: ['anexosCliente', clienteId],
    queryFn: () => apiBuscarAnexosCliente(clienteId),
  });

  const { mutate: deletarAnexo } = useMutation({
    mutationFn: (id: number) => apiDeletarAnexo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexosCliente', clienteId] });
      toast.success('Anexo deletado');
    },
    onError: () => toast.error('Erro ao deletar anexo'),
  });

  if (isLoading)
    return <p className='text-sm text-zinc-500'>Carregando anexos...</p>;
  if (isError || !data)
    return <p className='text-sm text-red-500'>Erro ao buscar anexos.</p>;
  if (data.length === 0)
    return <p className='text-sm text-zinc-400'>Nenhum anexo encontrado.</p>;

  return (
    <ul className='space-y-2'>
      {data.map((anexo) => (
        <li
          key={anexo.id}
          className='border rounded-md px-3 py-2 flex justify-between items-center text-sm'
        >
          <span className='truncate max-w-[70%]'>
            {anexo.arquivo_url.split('/').pop()}
          </span>
          <span className='flex items-center gap-2'>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}${anexo.arquivo_url}`}
              target='_blank'
              rel='noopener noreferrer'
              download
              className='hover:text-blue-600'
            >
              <Download className='w-4 h-4' />
            </a>
            <Trash
              className='w-4 h-4 text-red-500 cursor-pointer hover:opacity-80'
              onClick={() => deletarAnexo(anexo.id)}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
