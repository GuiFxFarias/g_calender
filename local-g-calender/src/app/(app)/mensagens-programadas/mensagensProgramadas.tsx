'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { MensagemProgramada } from '@/types/MensagemProgramada';
import { apiDeletarMensagem } from './api/apiDeletarMensagem';
import { apiBuscarMensagens } from './api/apiBuscarMensagens';
import { EditarMensagemDialog } from './editarMensagemDialog';
import DialogAgendarMensagem from './dialogCriarMensange';

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

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-zinc-800'>
          Mensagens Programadas
        </h1>
        <DialogAgendarMensagem />
      </div>

      {isLoading && (
        <p className='text-sm text-zinc-500'>Carregando mensagens...</p>
      )}

      {isError || !data ? (
        <p className='text-sm text-red-500'>Erro ao buscar mensagens.</p>
      ) : data.length === 0 ? (
        <p className='text-sm text-zinc-400'>
          Nenhuma mensagem programada encontrada.
        </p>
      ) : (
        <div className='grid gap-4'>
          {data.map((mensagem) => (
            <Card
              key={mensagem.id}
              className='border border-zinc-200 shadow-sm p-2 text-sm text-zinc-700'
            >
              <CardHeader className='pb-1 px-2 flex flex-row justify-between items-start'>
                <div className='space-y-0.5'>
                  <p className='font-medium text-zinc-800'>
                    {mensagem.nome_cliente}
                  </p>
                  <p className='text-xs text-zinc-500'>{mensagem.telefone}</p>
                  <p className='text-xs text-zinc-500'>
                    {new Date(
                      new Date(mensagem.proxima_data_envio).getTime() +
                        3 * 60 * 60 * 1000
                    ).toLocaleString('pt-BR')}{' '}
                    • {mensagem.dias_intervalo}d •{' '}
                    {mensagem.ativo ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <div className='flex gap-2 items-start'>
                  <EditarMensagemDialog mensagem={mensagem} />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => deletarMensagem(mensagem.id)}
                  >
                    <Trash2
                      className='text-red-500 hover:text-red-700'
                      size={18}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='pt-1 px-2 pb-2'>
                <p className='whitespace-pre-line text-xs text-zinc-600 leading-relaxed'>
                  {mensagem.texto}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
