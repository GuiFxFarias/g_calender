// components/FormAgendarMensagem.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatarDataLocalParaEnvio } from '@/lib/formataData';
import { apiCriarMensagemProgramada } from '../calendar/api/apiCriarMensagemProgramada';
import { apiListarClientes, Cliente } from '../calendar/api/apiListarClientes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schemaProgramado = z.object({
  cliente_id: z.string().min(1, 'Selecione um cliente'),
  texto: z.string().min(1),
  dias_intervalo: z.coerce.number().optional(),
  proxima_data_envio: z.string().min(1),
  ativo: z.boolean(),
});

type FormProgramadoData = z.infer<typeof schemaProgramado>;

export default function FormAgendarMensagem() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [telefone, setTelefone] = useState('');

  const form = useForm<FormProgramadoData>({
    resolver: zodResolver(schemaProgramado),
    defaultValues: {
      texto: '',
      dias_intervalo: 30,
      proxima_data_envio: '',
      ativo: true,
      cliente_id: '',
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    apiListarClientes()
      .then(setClientes)
      .catch(() => toast.error('Erro ao carregar clientes'));
  }, []);

  useEffect(() => {
    const clienteSelecionado = clientes.find(
      (c) => String(c.id) === form.watch('cliente_id')
    );
    if (clienteSelecionado?.telefone) {
      setTelefone(clienteSelecionado.telefone);
    } else {
      setTelefone('');
    }
  }, [clientes, form]);

  const { mutate: criarMensagem } = useMutation({
    mutationFn: apiCriarMensagemProgramada,
    onSuccess: () => {
      toast.success('Mensagem programada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['mensagensProgramadas'] });
      form.reset();
    },
    onError: () => toast.error('Erro ao programar mensagem'),
  });

  const onSubmit = (values: FormProgramadoData) => {
    if (!telefone) {
      toast.error('Telefone do cliente não encontrado');
      return;
    }

    const dataFormatada = formatarDataLocalParaEnvio(values.proxima_data_envio);

    criarMensagem({
      ...values,
      cliente_id: Number(values.cliente_id),
      telefone,
      proxima_data_envio: dataFormatada,
      dias_intervalo: values.dias_intervalo || 0,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 max-w-xl w-full mx-auto'
      >
        <FormField
          control={form.control}
          name='cliente_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : ''}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um cliente' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.length === 0 ? (
                    <SelectItem value='null' disabled>
                      Ainda não possui um cliente cadastrado
                    </SelectItem>
                  ) : (
                    clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        {cliente.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='texto'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto da Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Digite a mensagem...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dias_intervalo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalo (dias)</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='proxima_data_envio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do primeiro envio</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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

        <Button type='submit' className='w-full'>
          Programar Mensagem
        </Button>
      </form>
    </Form>
  );
}
