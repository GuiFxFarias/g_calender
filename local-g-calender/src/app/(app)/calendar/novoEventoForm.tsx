'use client';

import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { apiCriarVisitaComAnexo } from './api/apiCriatVisita';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiListarClientes, Cliente } from './api/apiListarClientes';
import { useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Paperclip } from 'lucide-react';

const formSchema = z.object({
  cliente_id: z.coerce.number().min(1, 'Selecione o cliente'),
  data_visita: z.string().min(1),
  hora_visita: z.string().min(1),
  preco: z.coerce.number().min(0),
  descricao: z.string().min(3),
  status: z.enum([
    'pendente_visita',
    'pendente_recebimento',
    'pago',
    'cancelado',
  ]),
  anexos: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EventoForm() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    apiListarClientes()
      .then(setClientes)
      .catch(() => toast.error('Erro ao carregar clientes'));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: 0,
      data_visita: '',
      hora_visita: '',
      preco: 0,
      descricao: '',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: FormValues) => {
    try {
      await apiCriarVisitaComAnexo({
        cliente_id: values.cliente_id,
        data_visita: `${values.data_visita}T${values.hora_visita}`,
        preco: values.preco,
        descricao: values.descricao,
        status: values.status,
        anexos: values.anexos,
      });

      toast.success('Visita criada com sucesso!');
      form.reset();
      await queryClient.refetchQueries({ queryKey: ['visitas'] });
    } catch {
      toast.error('Erro ao criar visita');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='cliente_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ''}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um cliente' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={String(cliente.id)}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='data_visita'
            render={({ field }) => (
              <FormItem className='w-1/2'>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='hora_visita'
            render={({ field }) => (
              <FormItem className='w-1/2'>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='preco'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='descricao'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Descreva o serviço...'
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
          name='anexos'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexos</FormLabel>
              <FormControl>
                <div>
                  <Label htmlFor='upload-arquivos'>Anexos</Label>
                  <div className='relative inline-block'>
                    <Input
                      id='upload-arquivos'
                      type='file'
                      multiple
                      {...field}
                      className='absolute inset-0 opacity-0 cursor-pointer z-10'
                    />
                    <Button
                      variant='outline'
                      type='button'
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <Paperclip className='w-4 h-4' />
                      Selecionar arquivos
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          Salvar Visita
        </Button>
      </form>
    </Form>
  );
}
