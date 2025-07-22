'úse client';

import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiCriarMensagemProgramada } from './api/apiCriarMensagemProgramada';
import toast from 'react-hot-toast';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { apiBuscarClientePorId } from './api/apiBuscaClienteId';
import { formatarDataLocalParaEnvio } from '@/lib/formataData';

export const schemaProgramado = z.object({
  texto: z.string(),
  dias_intervalo: z.coerce.number().optional(),
  proxima_data_envio: z.string(),
  ativo: z.boolean(),
});

export type FormProgramadoData = z.infer<typeof schemaProgramado>;

export default function FormAgendamento({
  visita,
}: {
  visita: VisitaComAnexoPayload;
}) {
  const formProgramado = useForm<FormProgramadoData>({
    resolver: zodResolver(schemaProgramado),
    defaultValues: {
      texto: '',
      dias_intervalo: 30,
      proxima_data_envio: '',
      ativo: true,
    },
  });

  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const buscarTelefone = async () => {
      try {
        const cliente = await apiBuscarClientePorId(visita.cliente_id);
        setTelefone(cliente.telefone);
      } catch {
        toast.error('Erro ao carregar telefone do cliente');
      }
    };

    buscarTelefone();
  }, [visita.cliente_id]);

  const queryClient = useQueryClient();

  const { mutate: criarMensagem } = useMutation({
    mutationFn: apiCriarMensagemProgramada,
    onSuccess: () => {
      toast.success('Mensagem programada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['mensagens-programadas'] });
    },
    onError: () => {
      toast.error('Erro ao programar mensagem');
    },
  });

  const onSubmitProgramado = async (values: FormProgramadoData) => {
    if (!telefone) {
      toast.error('Telefone do cliente não disponível');
      return;
    }

    const dataFormatada = formatarDataLocalParaEnvio(values.proxima_data_envio);

    criarMensagem({
      cliente_id: visita.cliente_id,
      telefone: telefone,
      texto: values.texto,
      dias_intervalo: values.dias_intervalo || 0,
      proxima_data_envio: dataFormatada,
      ativo: values.ativo,
    });
  };

  return (
    <Form {...formProgramado}>
      <form
        onSubmit={formProgramado.handleSubmit(onSubmitProgramado)}
        className='space-y-4 max-w-xl w-full mx-auto '
      >
        <FormField
          control={formProgramado.control}
          name='texto'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto da Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Digite a mensagem...'
                  className='resize-none w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formProgramado.control}
          name='dias_intervalo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalo (dias)</FormLabel>
              <FormControl>
                <Input type='number' className='w-full' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formProgramado.control}
          name='proxima_data_envio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do primeiro envio</FormLabel>
              <FormControl>
                <Input
                  type='datetime-local'
                  className='w-full cursor-pointer'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formProgramado.control}
          name='ativo'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center space-x-2'>
                <FormControl>
                  <input
                    type='checkbox'
                    className='w-4 h-4'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormControl>
                <FormLabel className='m-0 cursor-pointer'>
                  Mensagem Ativa
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full cursor-pointer'>
          Programar Mensagem
        </Button>
      </form>
    </Form>
  );
}
