'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { MensagemProgramada } from '@/types/MensagemProgramada';
import { apiDeletarMensagem } from './api/apiDeletarMensagem';
import { apiBuscarMensagens } from './api/apiBuscarMensagens';

export default function MensagensProgramadasPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<MensagemProgramada[]>({
    queryKey: ['mensagensProgramadas'],
    queryFn: apiBuscarMensagens,
  });

  const { mutate: deletarMensagem } = useMutation({
    mutationFn: apiDeletarMensagem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensagensProgramadas'] });
      toast.success('Mensagem deletada com sucesso');
    },
    onError: () => toast.error('Erro ao deletar mensagem'),
  });

  if (isLoading)
    return <p className='text-sm text-zinc-500'>Carregando mensagens...</p>;

  if (isError || !data)
    return <p className='text-sm text-red-500'>Erro ao buscar mensagens.</p>;

  if (data.length === 0)
    return (
      <p className='text-sm text-zinc-400'>
        Nenhuma mensagem programada encontrada.
      </p>
    );

  return (
    <div className='max-w-5xl mx-auto py-6 px-4 space-y-4'>
      <h1 className='text-2xl font-bold mb-4'>Mensagens Programadas</h1>
      {data.map((mensagem) => (
        <Card key={mensagem.id} className='shadow-sm'>
          <CardHeader className='flex flex-row justify-between items-start'>
            <div>
              <CardTitle className='text-base'>
                Cliente ID: {mensagem.nome_cliente} | Telefone:{' '}
                {mensagem.telefone}
              </CardTitle>
              <p className='text-sm text-zinc-500'>
                Próxima:{' '}
                {new Date(
                  new Date(mensagem.proxima_data_envio).getTime() +
                    3 * 60 * 60 * 1000
                ).toLocaleString('pt-BR')}
              </p>
              <p className='text-sm text-zinc-500'>
                Intervalo: {mensagem.dias_intervalo} dias
              </p>
              <p className='text-sm text-zinc-500'>
                Ativo: {mensagem.ativo ? 'Sim' : 'Não'}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => deletarMensagem(mensagem.id)}
            >
              <Trash2 className='text-red-500 hover:text-red-700' size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-zinc-700'>{mensagem.texto}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
