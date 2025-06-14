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
// import { Paperclip } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { apiCriarClienteTemporario } from './api/apiCriarClienteSemCadastro';
import { Paperclip } from 'lucide-react';

const formSchema = z.object({
  cliente_id: z.coerce.number().min(0, 'Selecione o cliente').optional(),
  nome_cliente: z.string().optional(),
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
  const [clienteSemCadastro, setClienteSemCadastro] = useState<boolean>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: 0,
      nome_cliente: '',
      data_visita: '',
      hora_visita: '',
      preco: 0,
      descricao: '',
      status: 'pendente_visita',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: FormValues) => {
    let clienteIdFinal = values.cliente_id;

    console.log(values);

    if (clienteSemCadastro && values.nome_cliente) {
      try {
        const novoCliente = await apiCriarClienteTemporario(
          values.nome_cliente
        );
        clienteIdFinal = novoCliente.id;
      } catch {
        toast.error('Erro ao criar cliente temporário');
        return;
      }
    }

    try {
      await apiCriarVisitaComAnexo({
        cliente_id: clienteIdFinal,
        data_visita: `${values.data_visita}T${values.hora_visita}`,
        preco: values.preco,
        descricao: values.descricao,
        status: values.status,
        // anexos: values.anexos,
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
        <div className='flex space-x-2 justify-start items-center'>
          <Checkbox
            checked={clienteSemCadastro}
            onCheckedChange={(checked) => setClienteSemCadastro(!!checked)}
          />
          <Label>O cliente não possui cadastro ainda</Label>
        </div>

        {!clienteSemCadastro ? (
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
        ) : (
          <FormField
            control={form.control}
            name='nome_cliente'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder='Digite o nome do cliente' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
              <FormControl>
                <div>
                  <Label htmlFor='upload-arquivos' className='mb-2'>
                    Anexos
                  </Label>
                  <div className='relative inline-block'>
                    <Input
                      id='upload-arquivos'
                      type='file'
                      multiple
                      onChange={(e) => field.onChange(e.target.files)}
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

        <Button type='submit' className='w-full cursor-pointer'>
          Salvar Visita
        </Button>
      </form>
    </Form>
  );
}
